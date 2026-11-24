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

## Setup Database
1. Jalankan MySQL (XAMPP: Start pada MySQL).
2. Import `schema.sql` (phpMyAdmin > Import, atau `mysql -u root -p < schema.sql`).
   File ini membuat database `pinjamlab`, tabel `equipment` dan `loans`, dan 6 data awal.
   Menjalankannya ulang akan mereset data.
3. Salin `.env.example` menjadi `.env` dan sesuaikan `DB_PASSWORD` bila perlu.
4. `npm install` lalu `npm start`, buka http://localhost:3000.

## Anggota Kelompok

| Nama | Tugas |
| --- | --- |
| Rendi | Tampilan halaman (`public/index.html`) |
| Reagan | Basis data dan server |
| Fakhri | Riwayat, pinjam, dan kembali |
| Fauzan | Kode halaman (`public/app.js`) dan README |

## Kendala yang Ditemui
- Siswa 1
   - Sulit mengatur desain dan tata letak
   - Warna kurang cocok

- Siswa 2
   - `.env` tidak ikut Git, setiap anggota harus membuatnya sendiri dari `.env.example`.
   - Halaman kosong bila database belum di-import atau MySQL belum berjalan.
   - Konflik merge pada `public/index.html` karena file dikerjakan di lebih dari satu branch.

- Siswa 3
   Setelah semua digabung, halaman kami kosong. Kami cek Network dan Console, ternyata ada error di app.js karena nama ID di index.html nggak sama. Backend-nya sebenarnya sudah benar. [Nama] memperbaikinya dengan [apa yang diubah], dan halaman jadi normal. Pelajarannya: bug begini baru kelihatan setelah semua bagian digabung.

- Siswa 4
   -Awalnya file app.js tidak ditemukan karena berada di folder public.

   -Sempat mengalami kesulitan dalam menggunakan perintah Git di CMD.

   -Mengalami kendala saat login dan autentikasi akun GitHub.

   -Kesulitan menemukan kode aktivasi GitHub saat proses login.

## Refleksi
- Siswa 1
   Saya mengerjakan wireframe Figma dan index.html yang responsif dengan Tailwind. Kesalahan saya adalah memakai ID elemen sendiri, bukan ID dari kontrak PDF, sehingga tidak cocok dengan app.js; saya memperbaikinya dan mengirimnya lewat branch dan Pull Request. Saya juga belajar memeriksa desain terhadap aturan bisnis, karena field tanggal di Figma bentrok dengan waktu pinjam otomatis dari server. Dalam review silang, saya (…). Pelajaran terpenting: kesepakatan ID dan nama field di awal mengurangi waktu integrasi.
- Siswa 2
   Saya mengerjakan skema database, koneksi MySQL, server Express, dan endpoint GET /api/equipment. Saya me-review PR [nama/Siswa 3] dengan memeriksa [nama field, status HTTP, dan transaksi]. Kendala terbesar saya adalah [.env ter-commit dan konflik merge]. Saya belajar bahwa [.gitignore harus disiapkan sejak awal, dan kontrak nama tabel serta field membuat integrasi lebih cepat].
- Siswa 3
   Di proyek PinjamLab, saya bagian backend untuk peminjaman: nulis file routes/loans.js yang isinya lihat riwayat, pinjam alat, dan kembalikan alat. saya pastikan nama peminjam dicek dulu, alat yang lagi dipinjam nggak bisa dipinjam lagi, dan kalau ada yang salah, servernya ngasih pesan error yang jelas. saya ngetes semuanya pakai Postman dan ngecek langsung isi database-nya. saya juga ikut review pekerjaan agan, yang paling aku pelajari: kalau dari awal tim sudah sepakat soal nama field dan format data, nyambungin kerjaan jadi jauh lebih gampang. Dan ada bug yang baru ketahuan setelah semua digabung, contohnya halaman yang kosong gara-gara nama ID di HTML dan JavaScript nggak sama.

- Siswa 4
   Selama melakukan proses commit file app.js ke GitHub, saya mendapatkan pengalaman dan pengetahuan baru tentang penggunaan Git dan GitHub. Saya belajar bagaimana menambahkan file tertentu menggunakan perintah git add, membuat commit menggunakan git commit, serta mengirimkan perubahan ke repository GitHub menggunakan git push.