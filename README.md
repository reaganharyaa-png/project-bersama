# PinjamLab

Aplikasi web sederhana untuk mencatat peminjaman alat kelas. Pengelola bisa melihat ketersediaan alat, mencatat nama peminjam, mengembalikan alat, dan memeriksa riwayat peminjaman.

Proyek kelompok BTEK Academy (Project-Based Learning), dikerjakan oleh 4 siswa dalam 1 hari.

## Teknologi

- HTML dan Tailwind CSS
- JavaScript biasa (tanpa kerangka kerja)
- Node.js dan Express
- MySQL

## Fitur

| ID | Fitur | Keterangan |
| --- | --- | --- |
| F01 | Katalog alat | Menampilkan nama, kategori, dan status alat |
| F02 | Ringkasan | Menampilkan jumlah total, tersedia, dan dipinjam |
| F03 | Form pinjam | Isi nama peminjam dan pilih alat yang tersedia |
| F04 | Kembalikan | Tombol kembali pada riwayat yang masih dipinjam |
| F05 | Riwayat | Menampilkan alat, peminjam, waktu pinjam, status, dan aksi |
| F06 | Pesan | Pemberitahuan saat berhasil atau gagal |

## Aturan Peminjaman

- Satu alat tidak bisa dipinjam dua kali secara bersamaan.
- Nama peminjam wajib diisi, 2 sampai 80 karakter setelah spasi di tepi dihapus.
- Waktu peminjaman dicatat otomatis oleh server.
- Pengembalian tidak menghapus riwayat, hanya mengisi waktu kembali.
- Pinjaman yang sudah dikembalikan tidak bisa dikembalikan lagi.

## Struktur Folder

```
pinjamlab/
├── public/
│   ├── index.html
│   └── app.js
├── routes/
│   ├── equipment.js
│   └── loans.js
├── db.js
├── server.js
├── schema.sql
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Cara Menjalankan

### 1. Yang perlu dipasang

- Node.js (versi LTS)
- MySQL
- Git

### 2. Ambil proyek

```
git clone https://github.com/[isi: nama-akun]/project-bersama.git
cd project-bersama
```

### 3. Siapkan pengaturan

Salin `.env.example` menjadi `.env`, lalu isi sesuai MySQL di komputermu.

```
copy .env.example .env
```

[isi: tulis daftar isi `.env` sesuai kesepakatan tim, misalnya alamat database, pengguna, kata sandi, dan nama database]

### 4. Siapkan database

Pastikan MySQL menyala, lalu jalankan `schema.sql`:

```
mysql -u root -p < schema.sql
```

File ini membuat database `pinjamlab`, tabel `equipment` dan `loans`, serta 6 alat awal.

### 5. Pasang paket

```
npm install
```

### 6. Jalankan server

```
npm start
```

### 7. Buka di browser

```
http://localhost:[isi: nomor port]
```

## Struktur Database

Nama database: `pinjamlab`

**Tabel `equipment`**

| Kolom | Ketentuan |
| --- | --- |
| id | INT, kunci utama, otomatis bertambah |
| name | VARCHAR(100), wajib |
| category | VARCHAR(60), wajib |
| status | `available` atau `borrowed`, bawaan `available` |

**Tabel `loans`**

| Kolom | Ketentuan |
| --- | --- |
| id | INT, kunci utama, otomatis bertambah |
| equipment_id | INT, kunci asing ke `equipment.id` |
| borrower_name | VARCHAR(80), wajib |
| borrowed_at | DATETIME, terisi otomatis saat pinjam |
| returned_at | DATETIME, boleh kosong (kosong berarti masih dipinjam) |

**Data awal alat**

| Nama | Kategori |
| --- | --- |
| Webcam HD | Multimedia |
| Mikrofon USB | Audio |
| Kabel HDMI | Aksesori |
| Proyektor Mini | Presentasi |
| Tripod Kamera | Multimedia |
| Mouse Wireless | Aksesori |

## Daftar Alamat API

| Metode | Alamat | Berhasil | Gagal |
| --- | --- | --- | --- |
| GET | `/api/equipment` | 200, `{"data": [...]}` | 500 gangguan server |
| GET | `/api/loans` | 200, `{"data": [...]}` | 500 gangguan server |
| POST | `/api/loans` | 201, `{"message": "...", "id": angka}` | 400 data salah, 404 alat tidak ada, 409 sedang dipinjam |
| PATCH | `/api/loans/:id/return` | 200, `{"message": "..."}` | 400 ID salah, 404 pinjaman tidak ada, 409 sudah kembali |

Semua pesan kesalahan berbentuk `{"message": "..."}`.

Contoh data untuk `POST /api/loans`:

```json
{
  "equipment_id": 1,
  "borrower_name": "Andi"
}
```

## Pengujian

Mulai dari database yang sudah di-reset. Isi kolom hasil dengan PASS atau FAIL, dan tulis penyebabnya kalau gagal.

| Kode | Langkah | Hasil yang diharapkan | Hasil | Catatan |
| --- | --- | --- | --- | --- |
| T01 | Buka halaman atau muat ulang | 6 alat tampil; total 6, tersedia 6, dipinjam 0 | [isi] | [isi] |
| T02 | Pinjam Webcam HD untuk Andi | 201; status Webcam menjadi dipinjam, riwayat bertambah | [isi] | [isi] |
| T03 | Pinjam Webcam yang sama lagi | 409; tidak ada pinjaman baru | [isi] | [isi] |
| T04 | Kembalikan pinjaman Andi | 200; alat tersedia; waktu kembali terisi | [isi] | [isi] |
| T05 | Kembalikan pinjaman yang sama lagi lewat API | 409; riwayat tidak berubah | [isi] | [isi] |
| T06 | Kirim nama kosong atau terlalu singkat | 400; data tidak tercatat | [isi] | [isi] |
| T07 | Kirim `equipment_id` yang tidak ada | 404; tidak ada pinjaman | [isi] | [isi] |
| T08 | Muat ulang browser setelah pinjam atau kembali | Status dan riwayat tetap konsisten | [isi] | [isi] |

## Pembagian Tugas

| Anggota | Tugas | File |
| --- | --- | --- |
| [isi: nama siswa 1] | Wireframe Figma, halaman responsif, kerangka HTML | `public/index.html` |
| [isi: nama siswa 2] | Skema MySQL, data awal, koneksi, server, alamat GET alat | `schema.sql`, `db.js`, `server.js`, `routes/equipment.js` |
| [isi: nama siswa 3] | Riwayat, pinjam, kembali, validasi, aturan status | `routes/loans.js` |
| [isi: nama siswa 4] | Kode browser, formulir, pesan, pengujian, demo | `public/app.js`, `README.md` |

## Tautan

- Wireframe Figma: [isi: tautan]
- Repository: [isi: tautan]

## Refleksi

[isi: satu paragraf per siswa tentang kontribusi, review yang diberikan, dan pelajaran yang didapat]