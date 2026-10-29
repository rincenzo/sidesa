# SiDesa – Sistem Pelayanan Administrasi Desa

Stack: HTML, CSS, JavaScript (frontend) · Node.js + Express (backend) · MySQL (database).

## Tampilan
Antarmuka modern: sidebar (bottom bar di ponsel), mode gelap/terang, kartu pilihan jenis surat, unggah drag-and-drop, stepper status, timeline riwayat, dan pencarian + filter. Font Inter dimuat dari Google Fonts (butuh internet, ada fallback font sistem).

## Struktur
```
sidesa/
├── server.js              # REST API + sesi login
├── package.json
├── .env.example           # salin menjadi .env
├── database/
│   ├── schema.sql         # tabel MySQL (sesuai ERD)
│   └── seed.js            # akun demo + 6 jenis surat
├── public/
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
└── uploads/               # berkas dokumen warga
```

## Cara menjalankan
1. Pasang **Node.js 18+** dan **XAMPP/Laragon** (untuk MySQL). Nyalakan MySQL.
2. Buka folder ini di VS Code (`File > Open Folder`), lalu buka terminal (`Ctrl + ``).
3. Impor database:
   - phpMyAdmin: menu *Import* → pilih `database/schema.sql`, atau
   - terminal: `mysql -u root < database/schema.sql`
4. Salin `.env.example` menjadi `.env`, sesuaikan `DB_USER` dan `DB_PASS`.
5. `npm install`
6. `npm run seed`
7. `npm start` (atau `npm run dev` agar restart otomatis)
8. Buka http://localhost:3000

## Akun demo
| Peran | Email | Sandi |
|---|---|---|
| Masyarakat | warga@desa.id | warga123 |
| Petugas | petugas@desa.id | petugas123 |
| Admin | admin@desa.id | admin123 |

Ganti sandi demo sebelum dipakai sungguhan.

## Alur status
Menunggu → Diproses → Disetujui → Selesai, dengan cabang Revisi (kembali ke Diproses setelah warga unggah ulang) dan Ditolak.

## Ekstensi VS Code yang berguna
MySQL (Weijan Chen) untuk melihat tabel, REST Client untuk menguji API, ESLint.
