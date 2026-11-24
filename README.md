# PinjamLab

PinjamLab adalah aplikasi web buat nyatat peminjaman alat kelas. Lewat aplikasi ini kita bisa lihat alat mana yang masih tersedia, catat siapa yang minjam, balikin alat, dan lihat riwayat peminjamannya.

## Teknologi

HTML, JavaScript, Tailwind CSS, Node.js, Express, dan MySQL.

## Cara Menjalankan

1. Install Node.js dan MySQL, lalu nyalakan MySQL (kalau pakai XAMPP, klik Start di bagian MySQL).
2. Clone project dari GitHub dan masuk ke foldernya:
   ```
   git clone https://github.com/reaganharyaa-png/project-bersama.git
   cd project-bersama
   ```
3. Import database dan data awalnya:
   ```
   mysql -u root -p < schema.sql
   ```
   Bisa juga lewat phpMyAdmin (Import). File ini bikin database `pinjamlab`, tabel `equipment` dan `loans`, plus 6 data alat. Kalau dijalankan lagi, semua data akan ke-reset.
4. Copy `.env.example` jadi `.env`, lalu sesuaikan isinya dengan MySQL di komputermu (biasanya cukup `DB_PASSWORD`).
5. Install package:
   ```
   npm install
   ```
6. Jalankan server:
   ```
   npm start
   ```
7. Buka `http://localhost:3000` di browser.

## Endpoint API

| Method | Alamat | Fungsi |
| --- | --- | --- |
| GET | `/api/equipment` | Ambil semua alat |
| GET | `/api/loans` | Ambil riwayat peminjaman |
| POST | `/api/loans` | Pinjam alat |
| PATCH | `/api/loans/:id/return` | Kembalikan alat |

## Anggota Kelompok

| Nama | Tugas |
| --- | --- |
| Rendi | Tampilan halaman (`public/index.html`) |
| Reagan | Database dan server |
| Fakhri | Riwayat, pinjam, dan kembali |
| Fauzan | Kode halaman (`public/app.js`) dan README |

## Kendala yang Ditemui

**Rendi**
- Susah mengatur desain dan tata letak.
- Warna yang dipilih awalnya kurang cocok.

**Reagan**
- File `.env` tidak ikut Git, jadi tiap anggota harus bikin sendiri dari `.env.example`.
- Halaman kosong kalau database belum di-import atau MySQL belum nyala.
- Ada konflik merge di `public/index.html` karena file itu dikerjakan di lebih dari satu branch.

**Fakhri**
- Setelah semua bagian digabung, halaman kami malah kosong. Pas dicek di Network dan Console, ternyata ada error di `app.js` karena ID di `index.html` tidak sama dengan yang dipakai di `app.js`. Backend-nya sebenarnya sudah benar. (isi: siapa yang memperbaiki dan apa yang diubah), lalu halaman jadi normal. Pelajarannya, bug seperti ini baru kelihatan setelah semua bagian digabung.

**Fauzan**
- Awalnya `app.js` tidak ketemu karena ada di dalam folder `public`.
- Masih bingung pakai perintah Git lewat CMD.
- Sempat gagal login dan autentikasi akun GitHub.
- Susah menemukan kode aktivasi GitHub waktu login.

## Refleksi

**Rendi**
Saya mengerjakan wireframe di Figma dan `index.html` yang responsif pakai Tailwind. Kesalahan saya, saya pakai ID elemen buatan sendiri, bukan ID dari kontrak di PDF, jadi tidak nyambung dengan `app.js`. Setelah itu saya perbaiki dan kirim lewat branch dan Pull Request. Saya juga baru sadar kalau desain harus dicek dengan aturan bisnis, karena field tanggal di Figma bentrok dengan waktu pinjam yang otomatis diisi server. Waktu review silang, saya (isi: apa yang kamu review). Pelajaran terpenting buat saya: sepakat soal ID dan nama field dari awal bikin proses menyatukan pekerjaan jauh lebih cepat.

**Reagan**
Saya mengerjakan skema database, koneksi MySQL, server Express, dan endpoint GET `/api/equipment`. Saya juga me-review PR (isi: nama anggota) dengan mengecek (isi: nama field, status HTTP, dan transaksi). Kendala terbesar saya adalah (isi: misalnya `.env` ter-commit dan konflik merge). Dari situ saya belajar kalau `.gitignore` harus disiapkan dari awal, dan kesepakatan nama tabel dan field bikin integrasi lebih lancar.

**Fakhri**
Di PinjamLab saya kebagian backend peminjaman, yaitu file `routes/loans.js` yang isinya lihat riwayat, pinjam alat, dan kembalikan alat. Saya pastikan nama peminjam dicek dulu, alat yang sedang dipinjam tidak bisa dipinjam lagi, dan kalau ada yang salah server kasih pesan error yang jelas. Semuanya saya tes pakai Postman dan saya cek langsung isi databasenya. Saya juga ikut me-review pekerjaan teman. Yang paling saya pelajari: kalau dari awal tim sudah sepakat soal nama field dan format data, menyambungkan pekerjaan jadi jauh lebih gampang. Ada juga bug yang baru ketahuan setelah semuanya digabung, misalnya halaman kosong karena ID di HTML dan JavaScript beda.

**Fauzan**
Di proyek PinjamLab saya mengerjakan `app.js`, yaitu kode yang menghubungkan tampilan dengan server, dan juga menyusun README. Awalnya saya sempat bingung karena `app.js` tidak ketemu, ternyata file itu harus ada di dalam folder `public`. Dari situ saya paham kalau struktur folder berpengaruh langsung ke cara server menampilkan halaman.

Bagian yang paling menantang buat saya adalah Git. Saya belum terbiasa pakai perintah Git lewat CMD, dan sempat gagal login karena autentikasi akun GitHub. Saya juga lama mencari kode aktivasi GitHub yang muncul waktu login. Setelah dicoba pelan-pelan, akhirnya saya bisa menambahkan file dengan `git add`, membuat commit dengan `git commit`, dan mengirimnya ke repository dengan `git push`. Sekarang saya tahu bahwa `git push` bukan sekadar mengirim file, tapi juga butuh akun yang sudah terautentikasi dengan benar.

Dari proyek ini saya juga belajar kalau bug sering baru muncul setelah semua bagian digabung. Halaman kami sempat kosong karena ID di `index.html` tidak sama dengan yang saya pakai di `app.js`. 
