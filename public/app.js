// PinjamLab - app.js (versi sederhana)
// Tugas file ini: mengambil data dari API lalu menampilkannya di halaman.

// ===== 1. Ambil elemen dari HTML =====
var statTotal = document.getElementById('stat-total');
var statAvailable = document.getElementById('stat-available');
var statBorrowed = document.getElementById('stat-borrowed');
var equipmentList = document.getElementById('equipment-list');
var equipmentListMobile = document.getElementById('equipment-list-mobile');
var borrowForm = document.getElementById('borrow-form');
var borrowerName = document.getElementById('borrower-name');
var equipmentId = document.getElementById('equipment-id');
var loanList = document.getElementById('loan-list');
var loanListMobile = document.getElementById('loan-list-mobile');
var message = document.getElementById('message');
var refreshBtn = document.getElementById('refresh-btn');
var tanggal = document.getElementById('tanggal');
var formTambahAlat = document.getElementById('formTambahAlat');

// ===== 2. Fungsi bantu =====

// Menampilkan pesan sukses / gagal
function showMessage(text, isError) {
  message.textContent = text;
  if (isError) {
    message.className = 'rounded-xl bg-red-100 px-4 py-3 text-sm font-medium text-red-800';
  } else {
    message.className = 'rounded-xl bg-[#CCFBF1] px-4 py-3 text-sm font-medium text-teal-900';
  }
  // sembunyikan lagi setelah 4 detik
  setTimeout(function () {
    message.className = 'hidden';
  }, 4000);
}

// Mengubah tanggal dari database menjadi tulisan, contoh: 21 Nov 2026, 09.15
function formatTanggal(teks) {
  var d = new Date(teks);
  var bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  var jam = String(d.getHours()).padStart(2, '0');
  var menit = String(d.getMinutes()).padStart(2, '0');
  return d.getDate() + ' ' + bulan[d.getMonth()] + ' ' + d.getFullYear() + ', ' + jam + '.' + menit;
}

// Membuat label status (badge) untuk alat
function badgeAlat(status) {
  if (status === 'available') {
    return '<span class="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-800">Tersedia</span>';
  }
  return '<span class="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">Dipinjam</span>';
}

// Membuat label status (badge) untuk riwayat
function badgeRiwayat(status) {
  if (status === 'dipinjam') {
    return '<span class="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">Dipinjam</span>';
  }
  return '<span class="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-800">Dikembalikan</span>';
}

// Mengubah tanda < > agar teks dari pengguna tidak merusak halaman
function aman(teks) {
  var div = document.createElement('div');
  div.textContent = teks;
  return div.innerHTML;
}

// ===== 3. Menampilkan data alat =====
function tampilkanAlat(alat) {
  var tersedia = 0;
  var barisDesktop = '';
  var barisHp = '';
  var pilihan = '<option value="" disabled selected>Pilih alat yang tersedia</option>';

  for (var i = 0; i < alat.length; i++) {
    var a = alat[i];

    if (a.status === 'available') {
      tersedia = tersedia + 1;
      // hanya alat tersedia yang masuk ke pilihan form
      pilihan += '<option value="' + a.id + '">' + aman(a.name) + '</option>';
    }

    barisDesktop +=
      '<tr class="border-b border-line">' +
      '<td class="py-4">' + (i + 1) + '</td>' +
      '<td class="py-4 font-semibold">' + aman(a.name) + '</td>' +
      '<td class="py-4">' + aman(a.category) + '</td>' +
      '<td class="py-4">' + badgeAlat(a.status) + '</td>' +
      '</tr>';

    barisHp +=
      '<li class="flex items-center justify-between border-b border-line py-3">' +
      '<div><p class="font-semibold">' + aman(a.name) + '</p>' +
      '<p class="text-xs text-muted">' + aman(a.category) + '</p></div>' +
      badgeAlat(a.status) +
      '</li>';
  }

  // isi ringkasan
  statTotal.textContent = alat.length;
  statAvailable.textContent = tersedia;
  statBorrowed.textContent = alat.length - tersedia;

  // isi tabel, daftar HP, dan pilihan form
  equipmentList.innerHTML = barisDesktop;
  equipmentListMobile.innerHTML = barisHp;
  equipmentId.innerHTML = pilihan;
}

// ===== 4. Menampilkan riwayat =====
function tampilkanRiwayat(riwayat) {
  var barisDesktop = '';
  var barisHp = '';
  var kelasTombol =
    'rounded-xl border-[1.5px] border-brand px-5 py-3 text-sm font-semibold text-brand-dark';

  for (var i = 0; i < riwayat.length; i++) {
    var r = riwayat[i];
    var tombol = '<span class="text-muted">-</span>';
    var tombolHp = '';

    // tombol Kembali hanya untuk yang masih dipinjam
    if (r.status === 'dipinjam') {
      tombol = '<button type="button" data-id="' + r.id + '" class="' + kelasTombol + '">Kembali</button>';
      tombolHp = '<button type="button" data-id="' + r.id + '" class="mt-3 w-full ' + kelasTombol + '">Kembali</button>';
    }

    barisDesktop +=
      '<tr class="border-b border-line">' +
      '<td class="py-3 font-semibold">' + aman(r.equipment_name) + '</td>' +
      '<td class="py-3">' + aman(r.borrower_name) + '</td>' +
      '<td class="py-3">' + formatTanggal(r.borrowed_at) + '</td>' +
      '<td class="py-3">' + badgeRiwayat(r.status) + '</td>' +
      '<td class="py-3">' + tombol + '</td>' +
      '</tr>';

    barisHp +=
      '<div class="rounded-xl border border-line p-3">' +
      '<div class="flex items-center justify-between">' +
      '<p class="font-semibold">' + aman(r.equipment_name) + '</p>' + badgeRiwayat(r.status) +
      '</div>' +
      '<p class="mt-2 text-[13px]">Peminjam: ' + aman(r.borrower_name) + '</p>' +
      '<p class="text-[13px]">Tanggal: ' + formatTanggal(r.borrowed_at) + '</p>' +
      tombolHp +
      '</div>';
  }

  loanList.innerHTML = barisDesktop;
  loanListMobile.innerHTML = barisHp;
}

// ===== 5. Mengambil data dari API =====
async function muatData() {
  try {
    var responAlat = await fetch('/api/equipment');
    var dataAlat = await responAlat.json();

    var responRiwayat = await fetch('/api/loans');
    var dataRiwayat = await responRiwayat.json();

    if (!responAlat.ok || !responRiwayat.ok) {
      showMessage('Gagal memuat data dari server.', true);
      return;
    }

    tampilkanAlat(dataAlat.data);
    tampilkanRiwayat(dataRiwayat.data);
  } catch (error) {
    showMessage('Tidak dapat terhubung ke server.', true);
  }
}

// ===== 6. Pinjam alat =====
borrowForm.addEventListener('submit', async function (event) {
  event.preventDefault(); // cegah halaman reload

  var nama = borrowerName.value.trim();
  var idAlat = Number(equipmentId.value);

  // cek isian
  if (nama.length < 2 || nama.length > 80) {
    showMessage('Nama peminjam harus 2 sampai 80 karakter.', true);
    return;
  }
  if (!idAlat) {
    showMessage('Pilih alat terlebih dahulu.', true);
    return;
  }

  try {
    var respon = await fetch('/api/loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ equipment_id: idAlat, borrower_name: nama })
    });
    var hasil = await respon.json();

    if (respon.ok) {
      showMessage(hasil.message, false);
      borrowForm.reset();
      tanggal.value = hariIni();
    } else {
      showMessage(hasil.message, true);
    }
    muatData(); // perbarui tampilan
  } catch (error) {
    showMessage('Tidak dapat terhubung ke server.', true);
  }
});

// ===== 7. Kembalikan alat =====
async function kembalikan(id) {
  try {
    var respon = await fetch('/api/loans/' + id + '/return', { method: 'PATCH' });
    var hasil = await respon.json();

    showMessage(hasil.message, !respon.ok);
    muatData();
  } catch (error) {
    showMessage('Tidak dapat terhubung ke server.', true);
  }
}

// Saat tombol "Kembali" diklik (di tabel desktop maupun kartu HP)
function klikTombolKembali(event) {
  var id = event.target.getAttribute('data-id');
  if (id) {
    kembalikan(id);
  }
}
loanList.addEventListener('click', klikTombolKembali);
loanListMobile.addEventListener('click', klikTombolKembali);

// ===== 8. Tombol muat ulang =====
refreshBtn.addEventListener('click', function () {
  muatData();
});

// ===== 9. Lain-lain =====

// Form "Tambah alat" tidak ada di API, jadi hanya memberi tahu pengguna
formTambahAlat.addEventListener('submit', function (event) {
  event.preventDefault();
  showMessage('Fitur tambah alat belum tersedia.', true);
});

// Tanggal hari ini (format yyyy-mm-dd) untuk isian tanggal bawaan Figma.
// Tanggal ini tidak dikirim ke server, karena waktu pinjam dicatat server.
function hariIni() {
  var d = new Date();
  var bulan = String(d.getMonth() + 1).padStart(2, '0');
  var hari = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + bulan + '-' + hari;
}
tanggal.value = hariIni();

// ===== 10. Mulai =====
muatData();
