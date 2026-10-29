CREATE DATABASE IF NOT EXISTS sidesa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sidesa;

CREATE TABLE IF NOT EXISTS users (
  id_user INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('masyarakat','petugas','admin') NOT NULL DEFAULT 'masyarakat',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS warga (
  id_warga INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  nik CHAR(16) NOT NULL UNIQUE,
  no_kk CHAR(16) NOT NULL,
  alamat TEXT,
  no_hp VARCHAR(20),
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS jenis_surat (
  id_jenis INT AUTO_INCREMENT PRIMARY KEY,
  nama_surat VARCHAR(120) NOT NULL,
  deskripsi TEXT,
  persyaratan TEXT NOT NULL COMMENT 'satu persyaratan per baris'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pengajuan (
  id_pengajuan INT AUTO_INCREMENT PRIMARY KEY,
  id_warga INT NOT NULL,
  id_jenis INT NOT NULL,
  tanggal_pengajuan DATE NOT NULL,
  status ENUM('Menunggu','Diproses','Revisi','Disetujui','Selesai','Ditolak') NOT NULL DEFAULT 'Menunggu',
  keterangan TEXT,
  catatan TEXT,
  FOREIGN KEY (id_warga) REFERENCES warga(id_warga),
  FOREIGN KEY (id_jenis) REFERENCES jenis_surat(id_jenis),
  INDEX (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS dokumen (
  id_dokumen INT AUTO_INCREMENT PRIMARY KEY,
  id_pengajuan INT NOT NULL,
  nama_dokumen VARCHAR(120) NOT NULL,
  file_dokumen VARCHAR(255) NOT NULL,
  nama_asli VARCHAR(255),
  status_verifikasi ENUM('Belum','Valid','Tidak Valid') NOT NULL DEFAULT 'Belum',
  FOREIGN KEY (id_pengajuan) REFERENCES pengajuan(id_pengajuan) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS surat (
  id_surat INT AUTO_INCREMENT PRIMARY KEY,
  id_pengajuan INT NOT NULL UNIQUE,
  nomor_surat VARCHAR(50) NOT NULL UNIQUE,
  tanggal_surat DATE NOT NULL,
  file_surat VARCHAR(255) NULL,
  FOREIGN KEY (id_pengajuan) REFERENCES pengajuan(id_pengajuan) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS log_pengajuan (
  id_log INT AUTO_INCREMENT PRIMARY KEY,
  id_pengajuan INT NOT NULL,
  id_user INT NULL,
  status VARCHAR(30) NOT NULL,
  keterangan TEXT,
  waktu DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_pengajuan) REFERENCES pengajuan(id_pengajuan) ON DELETE CASCADE,
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE SET NULL
) ENGINE=InnoDB;
