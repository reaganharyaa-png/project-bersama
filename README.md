# PinjamLab

Aplikasi web sederhana untuk mencatat peminjaman alat kelas. Pengelola bisa melihat alat yang tersedia, mencatat peminjam, mengembalikan alat, dan melihat riwayat.

## Teknologi

HTML, JavaScript, Tailwind CSS, Node.js, Express, dan MySQL.

## Cara Menjalankan

1. Pasang Node.js dan MySQL, lalu nyalakan MySQL.
2. Salin proyek dari GitHub, lalu masuk ke foldernya:
   ```
   git clone https://github.com/reaganharyaa-png/project-bersama.git
   cd project-bersama
   ```
3. Buat basis data dan isi data awalnya:
   ```
   mysql -u root -p < schema.sql
   ```
4. Salin file `.env.example` menjadi `.env`, lalu isi sesuai MySQL di komputermu.
5. Pasang paket yang dibutuhkan:
   ```
   npm install
   ```
6. Jalankan server:
   ```
   npm start
   ```
7. Buka `http://localhost:3000` di Chrome atau peramban lain.

## Alamat Layanan

| Cara | Alamat | Fungsi |
| --- | --- | --- |
| GET | `/api/equipment` | Mengambil semua alat |
| GET | `/api/loans` | Mengambil riwayat peminjaman |
| POST | `/api/loans` | Meminjam alat |
| PATCH | `/api/loans/:id/return` | Mengembalikan alat |

## Anggota Kelompok

| Nama | Tugas |
| --- | --- |
| Rendi | Tampilan halaman (`public/index.html`) |
| Reagan | Basis data dan server |
| Fakhri | Riwayat, pinjam, dan kembali |
| Fauzan | Kode halaman (`public/app.js`) dan README |
