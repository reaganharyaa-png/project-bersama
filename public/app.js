// Mengambil bagian halaman berdasarkan id-nya
function ambil(id) {
  return document.getElementById(id);
}

// Mengubah kode status dari server menjadi tulisan
const tulisanStatus = {
  available: "Tersedia",
  borrowed: "Dipinjam",
  dipinjam: "Dipinjam",
  dikembalikan: "Dikembalikan",
};

// Mengamankan teks supaya tidak merusak halaman
function amankanTeks(teks) {
  const kotak = document.createElement("div");
  kotak.textContent = teks;
  return kotak.innerHTML;
}

// Menampilkan pesan berhasil (hijau) atau gagal (merah)
function tampilkanPesan(isi, gagal) {
  let warna = "bg-green-100 text-green-800";
  if (gagal) {
    warna = "bg-red-100 text-red-800";
  }
  ambil("message").className = "rounded-xl px-4 py-3 text-sm " + warna;
  ambil("message").textContent = isi;
}

// Mengirim permintaan ke server lalu mengambil jawabannya
async function kirimPermintaan(alamat, metode, data) {
  const pengaturan = {
    method: metode,
    headers: { "Content-Type": "application/json" },
  };
  if (data) {
    pengaturan.body = JSON.stringify(data);
  }

  const jawaban = await fetch(alamat, pengaturan);
  const hasil = await jawaban.json();
  if (!jawaban.ok) {
    throw new Error(hasil.message);
  }
  return hasil;
}

// Mengambil data terbaru dari server lalu menampilkannya
async function muatData() {
  try {
    const hasilAlat = await kirimPermintaan("/api/equipment", "GET");
    const hasilRiwayat = await kirimPermintaan("/api/loans", "GET");
    const daftarAlat = hasilAlat.data;
    const daftarRiwayat = hasilRiwayat.data;

    let jumlahTersedia = 0;
    let isiTabelAlat = "";
    let isiPilihan = '<option value="" selected disabled>Pilih alat</option>';

    for (const alat of daftarAlat) {
      isiTabelAlat += `<tr class="border-b">
        <td class="py-2">${amankanTeks(alat.name)}</td>
        <td class="py-2">${amankanTeks(alat.category)}</td>
        <td class="py-2">${tulisanStatus[alat.status]}</td></tr>`;

      // Alat yang tersedia dihitung dan masuk ke pilihan form
      if (alat.status === "available") {
        jumlahTersedia = jumlahTersedia + 1;
        isiPilihan += `<option value="${alat.id}">${amankanTeks(alat.name)}</option>`;
      }
    }

    ambil("stat-total").textContent = daftarAlat.length;
    ambil("stat-available").textContent = jumlahTersedia;
    ambil("stat-borrowed").textContent = daftarAlat.length - jumlahTersedia;
    ambil("equipment-list").innerHTML = isiTabelAlat;
    ambil("equipment-id").innerHTML = isiPilihan;

    let isiTabelRiwayat = "";
    for (const riwayat of daftarRiwayat) {
      const waktu = new Date(String(riwayat.borrowed_at).replace(" ", "T")).toLocaleString("id-ID");

      // Tombol Kembali hanya untuk yang masih dipinjam
      let aksi = "-";
      if (riwayat.status === "dipinjam") {
        aksi = `<button type="button" data-id="${riwayat.id}" class="tombol-kembali rounded-xl border px-3 py-1">Kembali</button>`;
      }

      isiTabelRiwayat += `<tr class="border-b">
        <td class="py-2">${amankanTeks(riwayat.equipment_name)}</td>
        <td class="py-2">${amankanTeks(riwayat.borrower_name)}</td>
        <td class="py-2">${waktu}</td>
        <td class="py-2">${tulisanStatus[riwayat.status]}</td>
        <td class="py-2">${aksi}</td></tr>`;
    }
    ambil("loan-list").innerHTML = isiTabelRiwayat;
  } catch (kesalahan) {
    tampilkanPesan("Gagal memuat data: " + kesalahan.message, true);
  }
}

// Saat form pinjam dikirim
ambil("borrow-form").addEventListener("submit", async function (kejadian) {
  kejadian.preventDefault();

  const nama = ambil("borrower-name").value.trim();
  const idAlat = Number(ambil("equipment-id").value);

  if (nama.length < 2 || nama.length > 80) {
    tampilkanPesan("Nama peminjam harus 2 sampai 80 karakter", true);
    return;
  }
  if (!idAlat) {
    tampilkanPesan("Pilih alat terlebih dahulu", true);
    return;
  }

  try {
    const hasil = await kirimPermintaan("/api/loans", "POST", {
      equipment_id: idAlat,
      borrower_name: nama,
    });
    tampilkanPesan(hasil.message, false);
    ambil("borrow-form").reset();
  } catch (kesalahan) {
    tampilkanPesan(kesalahan.message, true);
  }
  muatData();
});

// Saat tombol Kembali ditekan
// (tombolnya dibuat ulang setiap data dimuat, jadi pendengarnya dipasang di seluruh halaman)
document.addEventListener("click", async function (kejadian) {
  const tombol = kejadian.target.closest(".tombol-kembali");
  if (!tombol) {
    return;
  }

  try {
    const hasil = await kirimPermintaan("/api/loans/" + tombol.dataset.id + "/return", "PATCH");
    tampilkanPesan(hasil.message, false);
  } catch (kesalahan) {
    tampilkanPesan(kesalahan.message, true);
  }
  muatData();
});

// Saat tombol Muat ulang ditekan
ambil("refresh-btn").addEventListener("click", muatData);

// Tampilkan data saat halaman pertama dibuka
muatData();