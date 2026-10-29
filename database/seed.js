require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const JENIS = [
  ['Surat Keterangan Domisili', 'Keterangan tempat tinggal warga', ['KTP', 'Kartu Keluarga']],
  ['Surat Keterangan Tidak Mampu (SKTM)', 'Untuk keringanan biaya', ['KTP', 'Kartu Keluarga', 'Surat pengantar RT/RW']],
  ['Surat Keterangan Usaha', 'Keterangan usaha milik warga', ['KTP', 'Foto tempat usaha']],
  ['Surat Pengantar', 'Pengantar umum ke instansi lain', ['KTP']],
  ['Surat Keterangan Kelahiran', 'Keterangan kelahiran anak', ['KTP orang tua', 'Surat keterangan bidan/RS']],
  ['Surat Keterangan Kematian', 'Keterangan kematian warga', ['KTP almarhum', 'Surat keterangan dokter/RS']],
];
const USERS = [
  ['Admin Desa', 'admin@desa.id', 'admin123', 'admin'],
  ['Siti Petugas', 'petugas@desa.id', 'petugas123', 'petugas'],
  ['Budi Santoso', 'warga@desa.id', 'warga123', 'masyarakat'],
];

(async () => {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'sidesa',
  });
  for (const [nama, email, pw, role] of USERS) {
    await c.query('INSERT IGNORE INTO users (nama,email,password,role) VALUES (?,?,?,?)',
      [nama, email, await bcrypt.hash(pw, 10), role]);
  }
  const [[warga]] = await c.query('SELECT id_user FROM users WHERE email=?', ['warga@desa.id']);
  await c.query('INSERT IGNORE INTO warga (id_user,nama,nik,no_kk,alamat,no_hp) VALUES (?,?,?,?,?,?)',
    [warga.id_user, 'Budi Santoso', '1471012345670001', '1471012345670002', 'Jl. Melati No. 5, RT 02/RW 01', '081234567890']);
  const [[{ n }]] = await c.query('SELECT COUNT(*) n FROM jenis_surat');
  if (n === 0) {
    for (const [nama, desk, syarat] of JENIS) {
      await c.query('INSERT INTO jenis_surat (nama_surat,deskripsi,persyaratan) VALUES (?,?,?)', [nama, desk, syarat.join('\n')]);
    }
  }
  console.log('Seed selesai: 3 akun demo + 6 jenis surat.');
  await c.end();
})().catch((e) => { console.error('Seed gagal:', e.message); process.exit(1); });
