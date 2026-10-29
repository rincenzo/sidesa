/* ===== util ===== */
const $ = (s, r = document) => r.querySelector(s);
const val = (id) => ($('#' + id)?.value || '').trim();
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (d) => (d ? new Date(String(d).replace(' ', 'T')).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-');
const fmtTime = (d) => new Date(String(d).replace(' ', 'T')).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const ini = (n) => String(n || '?').trim().split(/\s+/).slice(0, 2).map((x) => x[0]).join('').toUpperCase();

const IC = {
  grid: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  filePlus: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 18v-6M9 15h6"/>',
  fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8M8 9h2"/>',
  files: '<path d="M15 2H8a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V6z"/><path d="M15 2v4h4M3 7v14a2 2 0 0 0 2 2h10"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  history: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 21a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M22 21a7 7 0 0 0-4-6.3"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  back: '<path d="M19 12H5M12 19l-7-7 7-7"/>', chev: '<path d="m9 18 6-6-6-6"/>',
  printer: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  landmark: '<path d="M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10M2 10l10-7 10 7z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
};
const ic = (n) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${IC[n]}</svg>`;

const COL = { Menunggu: '#d97706', Diproses: '#2563eb', Revisi: '#ea580c', Disetujui: '#16a34a', Selesai: '#0d9488', Ditolak: '#e11d48' };
const pill = (s, c) => `<span class="pill" style="--c:${c || COL[s]}">${s}</span>`;
const NAV = {
  masyarakat: [['ajukan', 'Ajukan Surat', 'Ajukan', 'filePlus'], ['saya', 'Pengajuan Saya', 'Pengajuan', 'inbox'], ['profil', 'Profil Saya', 'Profil', 'user']],
  petugas: [['masuk', 'Pengajuan Masuk', 'Masuk', 'inbox'], ['riwayat', 'Riwayat', 'Riwayat', 'history']],
  admin: [['dash', 'Dashboard', 'Dashboard', 'grid'], ['semua', 'Semua Pengajuan', 'Pengajuan', 'files'], ['warga', 'Data Warga', 'Warga', 'users'], ['jenis', 'Jenis Surat', 'Jenis', 'fileText'], ['petugas', 'Data Petugas', 'Petugas', 'shield']],
};
const SUB = {
  ajukan: 'Pilih jenis surat dan lengkapi dokumen persyaratan.', saya: 'Pantau status semua pengajuan Anda.', profil: 'Data diri yang tercantum pada surat.',
  masuk: 'Pengajuan yang menunggu atau sedang diproses.', riwayat: 'Pengajuan yang sudah selesai atau ditolak.',
  dash: 'Ringkasan layanan administrasi desa.', semua: 'Seluruh pengajuan dari warga.', warga: 'Kelola data kependudukan warga.', jenis: 'Atur jenis surat dan persyaratannya.', petugas: 'Kelola akun petugas desa.',
};

/* ===== state & api ===== */
let me = null, tab = '', det = null, reg = false, JENIS = [], selJ = 0, LIST = [], FS = '';
async function api(url, o = {}) {
  const opt = { credentials: 'same-origin', method: o.method || 'GET' };
  if (o.json) { opt.method = o.method || 'POST'; opt.headers = { 'Content-Type': 'application/json' }; opt.body = JSON.stringify(o.json); }
  if (o.form) { opt.method = o.method || 'POST'; opt.body = o.form; }
  const r = await fetch(url, opt);
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || 'Terjadi kesalahan');
  return d;
}
let tt;
function toast(m, type = 'ok') {
  const t = $('#toast'); t.className = type === 'err' ? 'err' : '';
  t.innerHTML = ic(type === 'err' ? 'alert' : 'check') + `<span>${esc(m)}</span>`;
  requestAnimationFrame(() => t.classList.add('show')); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 3200);
}
async function run(fn) { try { await fn(); } catch (e) { toast(e.message, 'err'); } }
const isStaff = () => me.role !== 'masyarakat';
const closeModal = () => { const m = $('#modal'); m.style.display = 'none'; m.className = ''; m.innerHTML = ''; };
$('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
function ask(title, text) {
  return new Promise((res) => {
    const m = $('#modal'); m.className = 'center'; m.style.display = 'grid';
    m.innerHTML = `<div class="dlg"><h3>${esc(title)}</h3><p>${esc(text)}</p><div class="row end"><button class="btn ghost" id="no">Batal</button><button class="btn danger" id="yes">Ya, hapus</button></div></div>`;
    $('#yes').onclick = () => { closeModal(); res(true); }; $('#no').onclick = () => { closeModal(); res(false); };
  });
}
document.addEventListener('change', (e) => {
  const t = e.target; if (!t.matches('.drop input')) return;
  const l = t.closest('.drop'), f = t.files[0];
  if (f && f.size > 5 * 1024 * 1024) { t.value = ''; toast('Ukuran file maksimal 5 MB', 'err'); l.classList.remove('has'); return; }
  l.classList.toggle('has', !!f);
  l.querySelector('span').textContent = f ? `${f.name} · ${Math.max(1, Math.round(f.size / 1024))} KB` : 'Seret berkas ke sini atau klik untuk memilih';
});

/* ===== components ===== */
const field = (id, label, type = 'text', v = '', ph = '') => `<div class="f"><label for="${id}">${label}</label>${type === 'textarea'
  ? `<textarea id="${id}" rows="3" placeholder="${esc(ph)}">${esc(v)}</textarea>` : `<input id="${id}" type="${type}" value="${esc(v)}" placeholder="${esc(ph)}">`}</div>`;
const drop = (id, label, cls = '', data = '') => `<label class="drop">${ic('upload')}<div><b>${esc(label)}</b><span>Seret berkas ke sini atau klik untuk memilih</span></div><input type="file" id="${id}" class="${cls}" ${data} accept=".pdf,.jpg,.jpeg,.png"></label>`;
const tbl = (h, rows) => `<div class="tw"><table class="tbl"><tr>${h.map((x) => `<th>${x}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>${rows.length ? '' : emptyState('Belum ada data', 'Data akan muncul di sini.')}`;
const emptyState = (t, s) => `<div class="empty">${ic('inbox')}<b>${t}</b><span>${s}</span></div>`;
const skeleton = () => '<div class="skel"></div><div class="skel"></div><div class="skel" style="height:56px"></div>';
const delBtn = (t, id) => `<button class="ib del" title="Hapus" onclick="A.del('${t}',${id})">${ic('trash')}</button>`;

function items(a) {
  if (!a.length) return emptyState('Tidak ada pengajuan', 'Pengajuan yang sesuai akan tampil di sini.');
  return a.map((p) => `<div class="item" onclick="A.open(${p.id})"><div class="av" style="--c:${COL[p.status]}">${ic('fileText')}</div>
    <div class="im"><b>${esc(p.jenis)}</b><span>#${p.id}${isStaff() ? ' · ' + esc(p.pemohon) : ''} · ${fmt(p.tgl)}</span></div>${pill(p.status)}${ic('chev')}</div>`).join('');
}
function listView(a) {
  LIST = a; FS = '';
  const st = [...new Set(a.map((p) => p.status))];
  return `<div class="toolbar"><div class="search">${ic('search')}<input id="q" type="text" placeholder="Cari jenis surat atau nama pemohon" oninput="A.filter()"></div>
  <div class="chips" id="chips">${['', ...st].map((s) => `<button class="chip ${s === '' ? 'on' : ''}" onclick="A.fs('${s}')">${s || 'Semua'}</button>`).join('')}</div></div><div id="lst">${items(a)}</div>`;
}

/* ===== views ===== */
function authView() {
  const feat = [['filePlus', 'Ajukan surat kapan saja'], ['clock', 'Pantau status secara langsung'], ['printer', 'Cetak surat resmi dengan mudah']];
  return `<div class="login"><section class="hero"><div class="brand"><div class="logo">${ic('landmark')}</div>SiDesa</div>
  <div><h1>Layanan desa, kini cukup dari genggaman.</h1><p>Ajukan surat, unggah dokumen, dan pantau prosesnya tanpa antre di kantor desa.</p>
  <ul>${feat.map((f) => `<li>${ic(f[0])}${f[1]}</li>`).join('')}</ul></div><small>© Pemerintah Desa</small></section>
  <section class="fside"><div class="fcard"><div class="tabs"><button class="${!reg ? 'on' : ''}" onclick="A.auth(false)">Masuk</button><button class="${reg ? 'on' : ''}" onclick="A.auth(true)">Daftar</button></div>
  ${reg ? `<h2>Buat akun warga</h2><p class="mu">Isi data sesuai KTP dan Kartu Keluarga.</p>${field('rn', 'Nama lengkap')}${field('em', 'Email', 'email')}${field('pw', 'Kata sandi (min. 6 karakter)', 'password')}
  <div class="fr">${field('nik', 'NIK (16 digit)')}${field('kk', 'No. KK (16 digit)')}</div>${field('al', 'Alamat', 'textarea')}${field('hp', 'No. HP', 'tel')}
  <button class="btn" style="width:100%" onclick="A.reg()">Buat akun</button>`
  : `<h2>Selamat datang</h2><p class="mu">Masuk untuk mengajukan atau memproses surat.</p>${field('em', 'Email', 'email', '', 'nama@email.com')}${field('pw', 'Kata sandi', 'password')}
  <button class="btn" style="width:100%" onclick="A.login()">Masuk</button>
  <div class="demo"><p>Coba cepat dengan akun demo:</p><div><button onclick="A.demo('warga@desa.id','warga123')">Warga</button><button onclick="A.demo('petugas@desa.id','petugas123')">Petugas</button><button onclick="A.demo('admin@desa.id','admin123')">Admin</button></div></div>`}
  </div></section></div>`;
}

async function render() {
  const app = $('#app');
  if (!me) { app.innerHTML = authView(); return; }
  const nav = NAV[me.role], dark = document.documentElement.dataset.theme === 'dark';
  const cur = nav.find((n) => n[0] === tab);
  app.innerHTML = `<div class="shell"><aside class="side"><div class="brand"><div class="logo">${ic('landmark')}</div>SiDesa</div>
  <div class="nvs">${nav.map((n) => `<button class="nv ${tab === n[0] ? 'on' : ''}" onclick="A.go('${n[0]}')">${ic(n[3])}<span>${n[2]}</span></button>`).join('')}</div>
  <div class="me"><div class="avt">${ini(me.nama)}</div><div><b>${esc(me.nama)}</b><span>${me.role}</span></div></div></aside>
  <div class="content"><div class="top"><div><h2>${det !== null ? 'Detail Pengajuan' : cur[1]}</h2><p>${det !== null ? 'Rincian dokumen, status, dan riwayat proses.' : SUB[tab]}</p></div>
  <div class="tools"><button class="ib" title="Ganti tema" onclick="A.theme()">${ic(dark ? 'sun' : 'moon')}</button><button class="ib" title="Keluar" onclick="A.out()">${ic('logout')}</button></div></div>
  <div id="view">${skeleton()}</div></div></div>`;
  await refresh(false);
}
async function refresh(keep = true) {
  await run(async () => {
    const y = scrollY, html = det !== null ? await detail() : await page();
    const v = $('#view'); if (!v) return; v.innerHTML = html; if (keep) scrollTo(0, y);
  });
}

async function page() {
  switch (tab) {
    case 'ajukan': {
      JENIS = await api('/api/jenis'); if (!JENIS.some((j) => j.id_jenis === selJ)) selJ = JENIS[0]?.id_jenis || 0;
      return `<div class="split"><div class="card"><h3 class="ct">1. Pilih jenis surat</h3><div class="opts">${JENIS.map((j) =>
        `<button class="opt ${j.id_jenis === selJ ? 'on' : ''}" data-id="${j.id_jenis}" onclick="A.pj(${j.id_jenis})"><div class="oi">${ic('fileText')}</div><b>${esc(j.nama_surat)}</b><span>${esc(j.deskripsi || '')}</span></button>`).join('')}</div>
        <h3 class="ct" style="margin-top:26px">2. Keperluan surat</h3>${field('kt', 'Untuk keperluan apa surat ini dibuat?', 'textarea', '', 'Contoh: melamar pekerjaan, pendaftaran sekolah')}
        <h3 class="ct" style="margin-top:12px">3. Unggah dokumen persyaratan</h3><div id="syr">${syr()}</div>
        <div class="row end"><button class="btn" id="kirim" onclick="A.kirim()">${ic('send')} Kirim pengajuan</button></div></div>
        <aside class="card tips"><h3 class="ct">Alur layanan</h3><ul>
        <li>${ic('upload')}<div><b>Kirim pengajuan</b>Lengkapi form dan unggah dokumen.</div></li>
        <li>${ic('shield')}<div><b>Diverifikasi petugas</b>Dokumen diperiksa, bila salah Anda diminta memperbaiki.</div></li>
        <li>${ic('printer')}<div><b>Surat terbit</b>Surat siap dilihat dan dicetak dari halaman ini.</div></li></ul></aside></div>`;
    }
    case 'saya': return listView(await api('/api/pengajuan'));
    case 'masuk': return listView((await api('/api/pengajuan')).filter((p) => !['Selesai', 'Ditolak'].includes(p.status)));
    case 'riwayat': return listView((await api('/api/pengajuan')).filter((p) => ['Selesai', 'Ditolak'].includes(p.status)));
    case 'semua': return listView(await api('/api/pengajuan'));
    case 'profil': {
      const w = await api('/api/profil');
      return `<div class="card" style="max-width:640px">${w ? `<div class="prof"><div class="avt">${ini(w.nama)}</div><div><h3>${esc(w.nama)}</h3><span class="mu">NIK ${esc(w.nik)} · KK ${esc(w.no_kk)}</span></div></div>
        ${field('al', 'Alamat', 'textarea', w.alamat)}${field('hp', 'No. HP', 'tel', w.no_hp)}<button class="btn" onclick="A.prof()">Simpan perubahan</button>` : emptyState('Data warga belum terhubung', 'Hubungi admin desa.')}</div>`;
    }
    case 'dash': {
      const s = await api('/api/stats'), tot = Object.values(s.status).reduce((a, b) => a + b, 0), mx = Math.max(1, ...s.perJenis.map((j) => j.n));
      const stat = (i, l, n, c) => `<div class="stat"><div class="si" style="--c:${c}">${ic(i)}</div><div><span>${l}</span><b>${n}</b></div></div>`;
      const keys = Object.keys(COL).filter((k) => s.status[k]);
      return `<div class="stats">${stat('users', 'Warga terdaftar', s.warga, '#0891b2')}${stat('files', 'Total pengajuan', tot, '#4f46e5')}${stat('clock', 'Menunggu', s.status.Menunggu || 0, COL.Menunggu)}${stat('check', 'Selesai', s.status.Selesai || 0, COL.Selesai)}</div>
      <div class="split2"><div class="card"><h3 class="ct">Status pengajuan</h3>${tot ? `<div class="seg">${keys.map((k) => `<i style="flex:${s.status[k]};background:${COL[k]}" title="${k}: ${s.status[k]}"></i>`).join('')}</div>
        <div class="legend">${keys.map((k) => `<span style="--c:${COL[k]}">${k} <b>${s.status[k]}</b></span>`).join('')}</div>` : emptyState('Belum ada pengajuan', 'Statistik muncul setelah warga mengajukan surat.')}</div>
      <div class="card"><h3 class="ct">Pengajuan per jenis surat</h3>${s.perJenis.map((j) => `<div class="hb"><div class="hl"><span>${esc(j.nama_surat)}</span><b>${j.n}</b></div><div class="ht"><i style="width:${(j.n / mx) * 100}%;${j.n ? '' : 'min-width:0;width:0'}"></i></div></div>`).join('')}</div></div>`;
    }
    case 'warga': {
      const w = await api('/api/warga');
      return `<div class="split"><div class="card"><h3 class="ct">Daftar warga (${w.length})</h3>${tbl(['Nama', 'NIK', 'Alamat', ''], w.map((x) => [`<b>${esc(x.nama)}</b><br><span class="mu">${esc(x.no_hp || '')}</span>`, esc(x.nik), esc(x.alamat), delBtn('warga', x.id_warga)]))}</div>
      <div class="card"><h3 class="ct">Tambah warga</h3>${field('wn', 'Nama lengkap')}${field('nik', 'NIK (16 digit)')}${field('kk', 'No. KK (16 digit)')}${field('al', 'Alamat')}${field('hp', 'No. HP', 'tel')}<button class="btn" onclick="A.addW()">${ic('plus')} Simpan</button></div></div>`;
    }
    case 'jenis': {
      const j = await api('/api/jenis');
      return `<div class="split"><div class="card"><h3 class="ct">Jenis surat (${j.length})</h3>${tbl(['Nama surat', 'Persyaratan', ''], j.map((x) => [`<b>${esc(x.nama_surat)}</b>`, esc(x.syarat.join(', ')), delBtn('jenis', x.id_jenis)]))}</div>
      <div class="card"><h3 class="ct">Tambah jenis surat</h3>${field('jn2', 'Nama surat')}${field('jd', 'Deskripsi singkat')}${field('js', 'Persyaratan (pisahkan dengan koma)', 'textarea', '', 'KTP, Kartu Keluarga')}<button class="btn" onclick="A.addJ()">${ic('plus')} Simpan</button></div></div>`;
    }
    case 'petugas': {
      const p = await api('/api/petugas');
      return `<div class="split"><div class="card"><h3 class="ct">Petugas desa (${p.length})</h3>${tbl(['Nama', 'Email', ''], p.map((x) => [`<b>${esc(x.nama)}</b>`, esc(x.email), delBtn('petugas', x.id_user)]))}</div>
      <div class="card"><h3 class="ct">Tambah petugas</h3>${field('pn', 'Nama lengkap')}${field('em', 'Email', 'email')}${field('pw', 'Kata sandi (min. 6)', 'password')}<button class="btn" onclick="A.addP()">${ic('plus')} Simpan</button></div></div>`;
    }
  }
  return '';
}
function syr() {
  const j = JENIS.find((x) => x.id_jenis === selJ);
  return j ? `<div class="drops">${j.syarat.map((s, i) => drop('f' + i, s)).join('')}</div>` : '';
}

async function detail() {
  const { p, docs, log } = await api('/api/pengajuan/' + det);
  const S = ['Menunggu', 'Diproses', 'Disetujui', 'Selesai'], IX = { Menunggu: 0, Diproses: 1, Revisi: 1, Disetujui: 2, Selesai: 3, Ditolak: 1 }, cur = IX[p.status];
  const stepper = `<div class="stepper">${S.map((s, i) => { const done = i < cur || p.status === 'Selesai', now = i === cur && p.status !== 'Selesai';
    return `<div class="stp ${done ? 'done' : ''} ${now ? 'now' : ''}" style="--c:${COL[p.status]}"><i>${done ? ic('check') : i + 1}</i><span>${s}</span></div>`; }).join('')}</div>`;
  let banner = '';
  if (p.status === 'Revisi') banner = `<div class="alert" style="--c:${COL.Revisi}">${ic('alert')}<div><b>Perlu perbaikan dokumen</b><p>${esc(p.catatan || '')}${isStaff() ? '' : ' Unggah ulang dokumen yang ditandai di bawah.'}</p></div></div>`;
  if (p.status === 'Ditolak') banner = `<div class="alert" style="--c:${COL.Ditolak}">${ic('x')}<div><b>Pengajuan ditolak</b><p>${esc(p.catatan || '')}</p></div></div>`;
  if (p.status === 'Selesai') banner = `<div class="alert" style="--c:${COL.Selesai}">${ic('check')}<div><b>Surat sudah terbit</b><p>Surat dapat dilihat dan dicetak.</p></div></div>`;
  const vc = { Belum: ['Belum diperiksa', '#64748b'], Valid: ['Valid', '#16a34a'], 'Tidak Valid': ['Tidak valid', '#e11d48'] };
  const canV = isStaff() && p.status === 'Diproses';
  const docRows = docs.map((d) => `<div class="doc"><div class="di">${ic('fileText')}</div><div class="im"><b>${esc(d.nama_dokumen)}</b><a href="/api/dokumen/${d.id_dokumen}/file" target="_blank" rel="noopener">${esc(d.nama_asli)}</a></div>
    ${pill(vc[d.status_verifikasi][0], vc[d.status_verifikasi][1])}${canV ? `<div class="btns"><button class="ib ok" title="Valid" onclick="A.vf(${d.id_dokumen},'Valid')">${ic('check')}</button><button class="ib no" title="Tidak valid" onclick="A.vf(${d.id_dokumen},'Tidak Valid')">${ic('x')}</button></div>` : ''}</div>`).join('');
  let act = '';
  if (isStaff()) {
    if (p.status === 'Menunggu') act = `<div class="card"><h3 class="ct">Tindakan</h3><p class="mu">Mulai proses untuk memeriksa dokumen.</p><div class="row"><button class="btn" onclick="A.st(${p.id_pengajuan},'Diproses')">Proses pengajuan</button></div></div>`;
    if (p.status === 'Diproses') act = `<div class="card"><h3 class="ct">Keputusan</h3><p class="mu" style="margin-bottom:12px">Tandai setiap dokumen Valid atau Tidak valid, lalu putuskan.</p>${field('cat', 'Catatan untuk pemohon (wajib saat revisi atau tolak)', 'textarea')}
      <div class="row" style="margin-top:0"><button class="btn" onclick="A.st(${p.id_pengajuan},'Disetujui')">${ic('check')} Setujui</button><button class="btn ghost" onclick="A.st(${p.id_pengajuan},'Revisi')">Minta revisi</button><button class="btn danger" onclick="A.st(${p.id_pengajuan},'Ditolak')">Tolak</button></div></div>`;
    if (p.status === 'Disetujui') act = `<div class="card"><h3 class="ct">Tindakan</h3><p class="mu">Semua dokumen valid. Terbitkan surat untuk menyelesaikan pengajuan.</p><div class="row"><button class="btn" onclick="A.terbit(${p.id_pengajuan})">${ic('fileText')} Terbitkan surat</button></div></div>`;
  } else if (p.status === 'Revisi') {
    act = `<div class="card"><h3 class="ct">Unggah ulang dokumen</h3><div class="drops">${docs.filter((d) => d.status_verifikasi !== 'Valid').map((d) => drop('rv' + d.id_dokumen, d.nama_dokumen, 'rv', `data-id="${d.id_dokumen}"`)).join('')}</div>
      <div class="row end"><button class="btn" onclick="A.revisi(${p.id_pengajuan})">${ic('send')} Kirim ulang</button></div></div>`;
  }
  if (p.status === 'Selesai') act += `<div class="row" style="margin:0 0 18px"><button class="btn" onclick="A.surat(${p.id_pengajuan})">${ic('printer')} Lihat dan cetak surat</button></div>`;
  return `<button class="btn ghost sm back" onclick="A.back()">${ic('back')} Kembali</button>
  <div class="dhead"><div><h2>${esc(p.jenis)}</h2><span class="mu">Pengajuan #${p.id_pengajuan} · diajukan ${fmt(p.tanggal_pengajuan)}</span></div>${pill(p.status)}</div>${banner}
  <div class="card">${stepper}</div>
  <div class="split"><div><div class="card"><h3 class="ct">Data pemohon</h3><dl class="info"><div><dt>Nama</dt><dd>${esc(p.pemohon)}</dd></div><div><dt>NIK</dt><dd>${esc(p.nik)}</dd></div>
    <div class="w"><dt>Alamat</dt><dd>${esc(p.alamat || '-')}</dd></div><div class="w"><dt>Keperluan</dt><dd>${esc(p.keterangan || '-')}</dd></div></dl></div>
  <div class="card"><h3 class="ct">Dokumen persyaratan</h3>${docRows}</div>${act}</div>
  <aside class="card"><h3 class="ct">Riwayat proses</h3><div class="tl">${log.map((l) => `<div class="tli" style="--c:${COL[l.status] || '#64748b'}"><i></i><div><b>${l.status}</b><span>${esc(l.oleh || '-')} · ${fmtTime(l.waktu)}</span>${l.keterangan ? `<p>${esc(l.keterangan)}</p>` : ''}</div></div>`).join('')}</div></aside></div>`;
}

const suratHTML = (s) => `<div class="sheetbar"><button class="btn" onclick="window.print()">${ic('printer')} Cetak</button><button class="btn ghost" onclick="A.close()">Tutup</button></div>
<div class="paper"><h3>PEMERINTAH DESA ${esc(s.desa).toUpperCase()}</h3><hr><h3 style="text-decoration:underline">${esc(s.jenis).toUpperCase()}</h3><p class="c">Nomor: ${esc(s.nomor_surat)}</p>
<p style="margin-top:18px">Yang bertanda tangan di bawah ini, Kepala Desa ${esc(s.desa)}, menerangkan bahwa:</p>
<table><tr><td>Nama</td><td>: ${esc(s.nama)}</td></tr><tr><td>NIK</td><td>: ${esc(s.nik)}</td></tr><tr><td>No. KK</td><td>: ${esc(s.no_kk)}</td></tr><tr><td>Alamat</td><td>: ${esc(s.alamat)}</td></tr></table>
<p>adalah benar warga Desa ${esc(s.desa)}. Surat ini dibuat untuk keperluan: ${esc(s.keterangan || '-')}.</p><p>Demikian surat ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
<div class="ttd">${esc(s.desa)}, ${fmt(s.tanggal_surat)}<br>Kepala Desa<br><br><br><br><b>( ______________ )</b></div></div>`;

/* ===== actions ===== */
const A = {
  go(t) { tab = t; det = null; render(); },
  open(id) { det = id; render(); scrollTo(0, 0); },
  back() { det = null; render(); },
  close: closeModal,
  auth(r) { reg = r; render(); },
  theme() {
    const n = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = n; try { localStorage.setItem('theme', n); } catch (e) {} if (me) { const b = $('.tools .ib'); b.innerHTML = ic(n === 'dark' ? 'sun' : 'moon'); }
  },
  fs(s) { FS = s; document.querySelectorAll('#chips .chip').forEach((c) => c.classList.toggle('on', (c.textContent === 'Semua' ? '' : c.textContent) === s)); A.filter(); },
  filter() {
    const q = val('q').toLowerCase();
    $('#lst').innerHTML = items(LIST.filter((p) => (!FS || p.status === FS) && (!q || `${p.jenis} ${p.pemohon} ${p.id}`.toLowerCase().includes(q))));
  },
  demo(e, p) { $('#em').value = e; $('#pw').value = p; A.login(); },
  login: () => run(async () => {
    me = (await api('/api/login', { json: { email: val('em'), password: $('#pw').value } })).user;
    tab = NAV[me.role][0][0]; det = null; render();
  }),
  out: () => run(async () => { await api('/api/logout', { json: {} }); me = null; det = null; reg = false; render(); }),
  reg: () => run(async () => {
    await api('/api/register', { json: { nama: val('rn'), email: val('em'), password: $('#pw').value, nik: val('nik'), no_kk: val('kk'), alamat: val('al'), no_hp: val('hp') } });
    reg = false; render(); toast('Akun dibuat, silakan masuk');
  }),
  pj(id) { selJ = id; document.querySelectorAll('.opt').forEach((o) => o.classList.toggle('on', +o.dataset.id === id)); $('#syr').innerHTML = syr(); },
  kirim: () => run(async () => {
    const j = JENIS.find((x) => x.id_jenis === selJ), fd = new FormData();
    fd.append('id_jenis', selJ); fd.append('keterangan', val('kt'));
    for (let i = 0; i < j.syarat.length; i++) {
      const f = $('#f' + i).files[0]; if (!f) throw new Error('Unggah dokumen: ' + j.syarat[i]);
      fd.append('dokumen', f);
    }
    const b = $('#kirim'); b.disabled = true;
    try { const r = await api('/api/pengajuan', { form: fd }); tab = 'saya'; det = r.id; render(); toast('Pengajuan berhasil dikirim'); }
    finally { b.disabled = false; }
  }),
  prof: () => run(async () => { await api('/api/profil', { method: 'PUT', json: { alamat: val('al'), no_hp: val('hp') } }); toast('Profil disimpan'); }),
  vf: (id, st) => run(async () => { await api('/api/dokumen/' + id, { method: 'PATCH', json: { status: st } }); await refresh(); }),
  st: (id, status) => run(async () => { await api(`/api/pengajuan/${id}/status`, { method: 'PATCH', json: { status, catatan: val('cat') } }); toast('Status diperbarui: ' + status); await refresh(); }),
  revisi: (id) => run(async () => {
    const fd = new FormData(), ids = [];
    for (const el of document.querySelectorAll('.rv')) {
      if (!el.files[0]) throw new Error('Unggah ulang semua dokumen yang diminta');
      ids.push(+el.dataset.id); fd.append('dokumen', el.files[0]);
    }
    fd.append('ids', JSON.stringify(ids));
    await api(`/api/pengajuan/${id}/revisi`, { form: fd }); toast('Revisi terkirim'); await refresh();
  }),
  terbit: (id) => run(async () => { const r = await api(`/api/pengajuan/${id}/terbit`, { json: {} }); toast('Surat terbit: ' + r.nomor); await refresh(); }),
  surat: (id) => run(async () => { const s = await api(`/api/pengajuan/${id}/surat`); const m = $('#modal'); m.className = ''; m.innerHTML = suratHTML(s); m.style.display = 'block'; }),
  del: (t, id) => run(async () => { if (!(await ask('Hapus data ini?', 'Tindakan ini tidak dapat dibatalkan.'))) return; await api(`/api/${t}/${id}`, { method: 'DELETE' }); toast('Data dihapus'); await refresh(); }),
  addW: () => run(async () => { await api('/api/warga', { json: { nama: val('wn'), nik: val('nik'), no_kk: val('kk'), alamat: val('al'), no_hp: val('hp') } }); toast('Warga ditambahkan'); await refresh(false); }),
  addJ: () => run(async () => { await api('/api/jenis', { json: { nama_surat: val('jn2'), deskripsi: val('jd'), persyaratan: val('js') } }); toast('Jenis surat ditambahkan'); await refresh(false); }),
  addP: () => run(async () => { await api('/api/petugas', { json: { nama: val('pn'), email: val('em'), password: $('#pw').value } }); toast('Petugas ditambahkan'); await refresh(false); }),
};

run(async () => { me = (await api('/api/me')).user; if (me) tab = NAV[me.role][0][0]; render(); });
