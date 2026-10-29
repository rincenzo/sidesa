require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const multer = require('multer');

const UPLOAD_DIR = path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'sidesa',
  dateStrings: true,
  connectionLimit: 10,
});

const FILE_OK = /\.(pdf|jpe?g|png)$/i;
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, f, cb) => cb(null, `${Date.now()}-${Math.floor(Math.random() * 1e6)}${path.extname(f.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, f, cb) => (FILE_OK.test(f.originalname) ? cb(null, true) : cb(new Error('Hanya PDF, JPG, atau PNG'))),
});

const app = express();
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'ganti-rahasia-ini',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 8 * 3600 * 1000 },
}));
app.use(express.static(path.join(__dirname, 'public')));

const h = (fn) => (req, res, next) => fn(req, res, next).catch(next);
const bad = (res, msg, code = 400) => res.status(code).json({ error: msg });
const need = (...roles) => (req, res, next) => {
  if (!req.session.user) return bad(res, 'Silakan login terlebih dahulu', 401);
  if (roles.length && !roles.includes(req.session.user.role)) return bad(res, 'Akses ditolak', 403);
  next();
};
const staff = need('petugas', 'admin');
const d16 = (s) => /^\d{16}$/.test(s || '');
const syarat = (j) => ({ ...j, syarat: j.persyaratan.split('\n').filter(Boolean) });
const addLog = (c, idp, idu, status, ket) =>
  c.query('INSERT INTO log_pengajuan (id_pengajuan,id_user,status,keterangan) VALUES (?,?,?,?)', [idp, idu, status, ket || null]);

async function getPengajuan(req, res, id) {
  const [[p]] = await db.query(
    `SELECT p.*, w.id_user AS owner, w.nama AS pemohon, w.nik, w.no_kk, w.alamat, j.nama_surat AS jenis
       FROM pengajuan p JOIN warga w ON w.id_warga=p.id_warga JOIN jenis_surat j ON j.id_jenis=p.id_jenis
      WHERE p.id_pengajuan=?`, [id]);
  if (!p) { bad(res, 'Pengajuan tidak ditemukan', 404); return null; }
  const u = req.session.user;
  if (u.role === 'masyarakat' && p.owner !== u.id) { bad(res, 'Akses ditolak', 403); return null; }
  return p;
}

/* ---------- Auth ---------- */
app.post('/api/register', h(async (req, res) => {
  const b = req.body;
  if (!b.nama || !b.email || (b.password || '').length < 6) return bad(res, 'Nama, email, dan kata sandi (min. 6 karakter) wajib diisi');
  if (!d16(b.nik) || !d16(b.no_kk)) return bad(res, 'NIK dan No. KK harus 16 digit');
  const c = await db.getConnection();
  try {
    await c.beginTransaction();
    const [r] = await c.query('INSERT INTO users (nama,email,password,role) VALUES (?,?,?,?)',
      [b.nama, b.email.toLowerCase(), await bcrypt.hash(b.password, 10), 'masyarakat']);
    await c.query('INSERT INTO warga (id_user,nama,nik,no_kk,alamat,no_hp) VALUES (?,?,?,?,?,?)',
      [r.insertId, b.nama, b.nik, b.no_kk, b.alamat || '', b.no_hp || '']);
    await c.commit();
    res.json({ ok: true });
  } catch (e) {
    await c.rollback();
    if (e.code === 'ER_DUP_ENTRY') return bad(res, 'Email atau NIK sudah terdaftar', 409);
    throw e;
  } finally { c.release(); }
}));

app.post('/api/login', h(async (req, res) => {
  const [[u]] = await db.query('SELECT * FROM users WHERE email=?', [(req.body.email || '').toLowerCase()]);
  if (!u || !(await bcrypt.compare(req.body.password || '', u.password))) return bad(res, 'Email atau kata sandi salah', 401);
  req.session.user = { id: u.id_user, nama: u.nama, role: u.role };
  res.json({ user: req.session.user });
}));
app.post('/api/logout', (req, res) => req.session.destroy(() => res.json({ ok: true })));
app.get('/api/me', (req, res) => res.json({ user: req.session.user || null }));

/* ---------- Jenis surat ---------- */
app.get('/api/jenis', need(), h(async (req, res) => {
  const [rows] = await db.query('SELECT * FROM jenis_surat ORDER BY id_jenis');
  res.json(rows.map(syarat));
}));
app.post('/api/jenis', need('admin'), h(async (req, res) => {
  const { nama_surat, deskripsi, persyaratan } = req.body;
  const list = String(persyaratan || '').split(/[,\n]/).map((x) => x.trim()).filter(Boolean);
  if (!nama_surat || !list.length) return bad(res, 'Nama surat dan persyaratan wajib diisi');
  await db.query('INSERT INTO jenis_surat (nama_surat,deskripsi,persyaratan) VALUES (?,?,?)', [nama_surat, deskripsi || '', list.join('\n')]);
  res.json({ ok: true });
}));
app.delete('/api/jenis/:id', need('admin'), h(async (req, res) => {
  try { await db.query('DELETE FROM jenis_surat WHERE id_jenis=?', [req.params.id]); res.json({ ok: true }); }
  catch (e) { if (e.code === 'ER_ROW_IS_REFERENCED_2') return bad(res, 'Jenis surat sudah dipakai pengajuan', 409); throw e; }
}));

/* ---------- Warga & petugas (admin) ---------- */
app.get('/api/warga', need('admin'), h(async (req, res) => res.json((await db.query('SELECT * FROM warga ORDER BY nama'))[0])));
app.post('/api/warga', need('admin'), h(async (req, res) => {
  const b = req.body;
  if (!b.nama || !d16(b.nik) || !d16(b.no_kk)) return bad(res, 'Nama wajib, NIK dan No. KK 16 digit');
  try { await db.query('INSERT INTO warga (nama,nik,no_kk,alamat,no_hp) VALUES (?,?,?,?,?)', [b.nama, b.nik, b.no_kk, b.alamat || '', b.no_hp || '']); res.json({ ok: true }); }
  catch (e) { if (e.code === 'ER_DUP_ENTRY') return bad(res, 'NIK sudah terdaftar', 409); throw e; }
}));
app.delete('/api/warga/:id', need('admin'), h(async (req, res) => {
  try { await db.query('DELETE FROM warga WHERE id_warga=?', [req.params.id]); res.json({ ok: true }); }
  catch (e) { if (e.code === 'ER_ROW_IS_REFERENCED_2') return bad(res, 'Warga masih memiliki pengajuan', 409); throw e; }
}));
app.get('/api/petugas', need('admin'), h(async (req, res) =>
  res.json((await db.query("SELECT id_user,nama,email FROM users WHERE role='petugas' ORDER BY nama"))[0])));
app.post('/api/petugas', need('admin'), h(async (req, res) => {
  const b = req.body;
  if (!b.nama || !b.email || (b.password || '').length < 6) return bad(res, 'Lengkapi data (kata sandi min. 6 karakter)');
  try { await db.query('INSERT INTO users (nama,email,password,role) VALUES (?,?,?,?)', [b.nama, b.email.toLowerCase(), await bcrypt.hash(b.password, 10), 'petugas']); res.json({ ok: true }); }
  catch (e) { if (e.code === 'ER_DUP_ENTRY') return bad(res, 'Email sudah terdaftar', 409); throw e; }
}));
app.delete('/api/petugas/:id', need('admin'), h(async (req, res) => {
  await db.query("DELETE FROM users WHERE id_user=? AND role='petugas'", [req.params.id]);
  res.json({ ok: true });
}));

/* ---------- Profil ---------- */
app.get('/api/profil', need('masyarakat'), h(async (req, res) =>
  res.json((await db.query('SELECT * FROM warga WHERE id_user=?', [req.session.user.id]))[0][0] || null)));
app.put('/api/profil', need('masyarakat'), h(async (req, res) => {
  await db.query('UPDATE warga SET alamat=?, no_hp=? WHERE id_user=?', [req.body.alamat || '', req.body.no_hp || '', req.session.user.id]);
  res.json({ ok: true });
}));

/* ---------- Pengajuan ---------- */
app.get('/api/pengajuan', need(), h(async (req, res) => {
  const u = req.session.user;
  const [rows] = await db.query(
    `SELECT p.id_pengajuan AS id, p.tanggal_pengajuan AS tgl, p.status, j.nama_surat AS jenis, w.nama AS pemohon
       FROM pengajuan p JOIN jenis_surat j ON j.id_jenis=p.id_jenis JOIN warga w ON w.id_warga=p.id_warga
      ${u.role === 'masyarakat' ? 'WHERE w.id_user=?' : ''} ORDER BY p.id_pengajuan DESC`,
    u.role === 'masyarakat' ? [u.id] : []);
  res.json(rows);
}));

app.post('/api/pengajuan', need('masyarakat'), upload.array('dokumen', 10), h(async (req, res) => {
  const [[w]] = await db.query('SELECT id_warga FROM warga WHERE id_user=?', [req.session.user.id]);
  const [[j]] = await db.query('SELECT * FROM jenis_surat WHERE id_jenis=?', [req.body.id_jenis]);
  if (!w || !j) return bad(res, 'Data warga atau jenis surat tidak valid');
  const list = syarat(j).syarat, files = req.files || [];
  if (files.length !== list.length) return bad(res, 'Lengkapi semua dokumen persyaratan');
  const c = await db.getConnection();
  try {
    await c.beginTransaction();
    const [r] = await c.query('INSERT INTO pengajuan (id_warga,id_jenis,tanggal_pengajuan,keterangan) VALUES (?,?,CURDATE(),?)',
      [w.id_warga, j.id_jenis, req.body.keterangan || '']);
    for (let i = 0; i < list.length; i++) {
      await c.query('INSERT INTO dokumen (id_pengajuan,nama_dokumen,file_dokumen,nama_asli) VALUES (?,?,?,?)',
        [r.insertId, list[i], files[i].filename, files[i].originalname]);
    }
    await addLog(c, r.insertId, req.session.user.id, 'Menunggu', 'Pengajuan dikirim');
    await c.commit();
    res.json({ id: r.insertId });
  } catch (e) { await c.rollback(); throw e; } finally { c.release(); }
}));

app.get('/api/pengajuan/:id', need(), h(async (req, res) => {
  const p = await getPengajuan(req, res, req.params.id); if (!p) return;
  const [docs] = await db.query('SELECT id_dokumen,nama_dokumen,nama_asli,status_verifikasi FROM dokumen WHERE id_pengajuan=? ORDER BY id_dokumen', [p.id_pengajuan]);
  const [log] = await db.query(
    `SELECT l.status, l.keterangan, l.waktu, u.nama AS oleh FROM log_pengajuan l LEFT JOIN users u ON u.id_user=l.id_user
      WHERE l.id_pengajuan=? ORDER BY l.id_log`, [p.id_pengajuan]);
  res.json({ p, docs, log });
}));

app.patch('/api/dokumen/:id', staff, h(async (req, res) => {
  const st = req.body.status;
  if (!['Valid', 'Tidak Valid'].includes(st)) return bad(res, 'Status verifikasi tidak valid');
  const [r] = await db.query(
    `UPDATE dokumen d JOIN pengajuan p ON p.id_pengajuan=d.id_pengajuan SET d.status_verifikasi=?
      WHERE d.id_dokumen=? AND p.status='Diproses'`, [st, req.params.id]);
  if (!r.affectedRows) return bad(res, 'Dokumen hanya bisa diverifikasi saat pengajuan berstatus Diproses', 409);
  res.json({ ok: true });
}));

app.patch('/api/pengajuan/:id/status', staff, h(async (req, res) => {
  const p = await getPengajuan(req, res, req.params.id); if (!p) return;
  const status = req.body.status, cat = (req.body.catatan || '').trim();
  const allowed = { Menunggu: ['Diproses'], Diproses: ['Disetujui', 'Revisi', 'Ditolak'] };
  if (!(allowed[p.status] || []).includes(status)) return bad(res, `Status ${p.status} tidak bisa diubah ke ${status}`, 409);
  const [docs] = await db.query('SELECT status_verifikasi AS v FROM dokumen WHERE id_pengajuan=?', [p.id_pengajuan]);
  if (status === 'Disetujui' && docs.some((d) => d.v !== 'Valid')) return bad(res, 'Semua dokumen harus berstatus Valid');
  if (status === 'Revisi' && !docs.some((d) => d.v === 'Tidak Valid')) return bad(res, 'Tandai dokumen yang perlu diperbaiki');
  if (['Revisi', 'Ditolak'].includes(status) && !cat) return bad(res, 'Catatan untuk pemohon wajib diisi');
  await db.query('UPDATE pengajuan SET status=?, catatan=? WHERE id_pengajuan=?', [status, cat || p.catatan, p.id_pengajuan]);
  await addLog(db, p.id_pengajuan, req.session.user.id, status, cat);
  res.json({ ok: true });
}));

app.post('/api/pengajuan/:id/revisi', need('masyarakat'), upload.array('dokumen', 10), h(async (req, res) => {
  const p = await getPengajuan(req, res, req.params.id); if (!p) return;
  if (p.status !== 'Revisi') return bad(res, 'Pengajuan tidak sedang dalam status Revisi', 409);
  let ids; try { ids = JSON.parse(req.body.ids || '[]'); } catch { return bad(res, 'Data tidak valid'); }
  const files = req.files || [];
  const [pending] = await db.query("SELECT id_dokumen FROM dokumen WHERE id_pengajuan=? AND status_verifikasi<>'Valid'", [p.id_pengajuan]);
  if (files.length !== ids.length || ids.length !== pending.length) return bad(res, 'Unggah ulang semua dokumen yang diminta');
  const valid = new Set(pending.map((d) => d.id_dokumen));
  if (!ids.every((i) => valid.has(Number(i)))) return bad(res, 'Dokumen tidak sesuai');
  const c = await db.getConnection();
  try {
    await c.beginTransaction();
    for (let i = 0; i < ids.length; i++) {
      await c.query("UPDATE dokumen SET file_dokumen=?, nama_asli=?, status_verifikasi='Belum' WHERE id_dokumen=?", [files[i].filename, files[i].originalname, ids[i]]);
    }
    await c.query("UPDATE pengajuan SET status='Diproses' WHERE id_pengajuan=?", [p.id_pengajuan]);
    await addLog(c, p.id_pengajuan, req.session.user.id, 'Diproses', 'Dokumen revisi diunggah');
    await c.commit();
    res.json({ ok: true });
  } catch (e) { await c.rollback(); throw e; } finally { c.release(); }
}));

app.post('/api/pengajuan/:id/terbit', staff, h(async (req, res) => {
  const p = await getPengajuan(req, res, req.params.id); if (!p) return;
  if (p.status !== 'Disetujui') return bad(res, 'Pengajuan belum disetujui', 409);
  const c = await db.getConnection();
  try {
    await c.beginTransaction();
    const [[{ n }]] = await c.query('SELECT COUNT(*)+1 AS n FROM surat FOR UPDATE');
    const now = new Date();
    const nomor = `${String(n).padStart(3, '0')}/PEM/${now.getMonth() + 1}/${now.getFullYear()}`;
    await c.query('INSERT INTO surat (id_pengajuan,nomor_surat,tanggal_surat) VALUES (?,?,CURDATE())', [p.id_pengajuan, nomor]);
    await c.query("UPDATE pengajuan SET status='Selesai' WHERE id_pengajuan=?", [p.id_pengajuan]);
    await addLog(c, p.id_pengajuan, req.session.user.id, 'Selesai', `Surat terbit ${nomor}`);
    await c.commit();
    res.json({ nomor });
  } catch (e) { await c.rollback(); throw e; } finally { c.release(); }
}));

app.get('/api/pengajuan/:id/surat', need(), h(async (req, res) => {
  const p = await getPengajuan(req, res, req.params.id); if (!p) return;
  const [[s]] = await db.query('SELECT nomor_surat, tanggal_surat FROM surat WHERE id_pengajuan=?', [p.id_pengajuan]);
  if (!s) return bad(res, 'Surat belum diterbitkan', 404);
  res.json({ desa: process.env.NAMA_DESA || 'Sukamaju', ...s, nama: p.pemohon, nik: p.nik, no_kk: p.no_kk, alamat: p.alamat, jenis: p.jenis, keterangan: p.keterangan });
}));

app.get('/api/dokumen/:id/file', need(), h(async (req, res) => {
  const [[d]] = await db.query(
    `SELECT d.file_dokumen, d.nama_asli, w.id_user AS owner FROM dokumen d
       JOIN pengajuan p ON p.id_pengajuan=d.id_pengajuan JOIN warga w ON w.id_warga=p.id_warga WHERE d.id_dokumen=?`, [req.params.id]);
  if (!d) return bad(res, 'File tidak ditemukan', 404);
  const u = req.session.user;
  if (u.role === 'masyarakat' && d.owner !== u.id) return bad(res, 'Akses ditolak', 403);
  res.sendFile(path.join(UPLOAD_DIR, path.basename(d.file_dokumen)));
}));

/* ---------- Statistik ---------- */
app.get('/api/stats', need('admin'), h(async (req, res) => {
  const [[{ warga }]] = await db.query('SELECT COUNT(*) AS warga FROM warga');
  const [st] = await db.query('SELECT status, COUNT(*) AS n FROM pengajuan GROUP BY status');
  const [perJenis] = await db.query(
    'SELECT j.nama_surat, COUNT(p.id_pengajuan) AS n FROM jenis_surat j LEFT JOIN pengajuan p ON p.id_jenis=j.id_jenis GROUP BY j.id_jenis ORDER BY j.id_jenis');
  res.json({ warga, status: Object.fromEntries(st.map((r) => [r.status, r.n])), perJenis });
}));

app.use((err, req, res, next) => {
  console.error(err);
  const msg = err.code === 'LIMIT_FILE_SIZE' ? 'Ukuran file maksimal 5 MB'
    : (err.message || '').startsWith('Hanya') ? err.message : 'Terjadi kesalahan pada server';
  res.status(err.code === 'LIMIT_FILE_SIZE' || (err.message || '').startsWith('Hanya') ? 400 : 500).json({ error: msg });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SiDesa berjalan di http://localhost:${PORT}`));
