const $ = (id) => document.getElementById(id);

const total = $('stat-total');
const tersedia = $('stat-available');
const dipinjam = $('stat-borrowed');
const daftarAlat = $('equipment-list');
const daftarAlatHp = $('equipment-list-mobile');
const formPinjam = $('borrow-form');
const inputNama = $('borrower-name');
const pilihAlat = $('equipment-id');
const tombolPinjam = $('btn-borrow');
const daftarRiwayat = $('loan-list');
const daftarRiwayatHp = $('loan-list-mobile');
const pesan = $('message');
const tombolMuat = $('refresh-btn');
const inputTanggal = $('tanggal');

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const LENCANA = 'rounded-full px-2.5 py-0.5 text-xs font-medium ';
const TOMBOL = 'rounded-xl border-[1.5px] border-brand px-5 py-3 text-sm font-semibold text-brand-dark ';

function aman(teks) {
  const div = document.createElement('div');
  div.textContent = teks;
  return div.innerHTML;
}

function tanggalHariIni() {
  return new Date().toISOString().slice(0, 10);
}

function tulisTanggal(teks) {
  const t = new Date(teks);
  const jam = String(t.getHours()).padStart(2, '0');
  const menit = String(t.getMinutes()).padStart(2, '0');
  return `${t.getDate()} ${BULAN[t.getMonth()]} ${t.getFullYear()}, ${jam}.${menit}`;
}

function lencana(sedia, teks) {
  const warna = sedia ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800';
  return `<span class="${LENCANA}${warna}">${teks}</span>`;
}

function lencanaAlat(status) {
  return lencana(status === 'available', status === 'available' ? 'Tersedia' : 'Dipinjam');
}

function lencanaRiwayat(status) {
  return lencana(status !== 'dipinjam', status === 'dipinjam' ? 'Dipinjam' : 'Dikembalikan');
}

let waktuPesan;
function tampilkanPesan(teks, gagal) {
  const warna = gagal ? 'bg-red-100 text-red-800' : 'bg-[#CCFBF1] text-teal-900';
  pesan.className = `rounded-xl px-4 py-3 text-sm font-medium ${warna}`;
  pesan.textContent = teks;
  clearTimeout(waktuPesan);
  waktuPesan = setTimeout(() => (pesan.className = 'hidden'), 4000);
}

async function panggil(alamat, pilihan) {
  let jawaban;
  try {
    jawaban = await fetch('/api' + alamat, pilihan);
  } catch {
    throw new Error('Tidak dapat terhubung ke server.');
  }
  const isi = await jawaban.json().catch(() => ({}));
  if (!jawaban.ok) throw new Error(isi.message || 'Terjadi kesalahan.');
  return isi;
}

function tampilkanAlat(alat) {
  const sedia = alat.filter((a) => a.status === 'available');

  total.textContent = alat.length;
  tersedia.textContent = sedia.length;
  dipinjam.textContent = alat.length - sedia.length;

  daftarAlat.innerHTML = alat
    .map((a, i) => `
      <tr class="border-b border-line">
        <td class="py-4">${i + 1}</td>
        <td class="py-4 font-semibold">${aman(a.name)}</td>
        <td class="py-4">${aman(a.category)}</td>
        <td class="py-4">${lencanaAlat(a.status)}</td>
      </tr>`)
    .join('');

  daftarAlatHp.innerHTML = alat
    .map((a) => `
      <li class="flex items-center justify-between border-b border-line py-3">
        <div>
          <p class="font-semibold">${aman(a.name)}</p>
          <p class="text-xs text-muted">${aman(a.category)}</p>
        </div>
        ${lencanaAlat(a.status)}
      </li>`)
    .join('');

  pilihAlat.innerHTML =
    '<option value="" disabled selected>Pilih alat yang tersedia</option>' +
    sedia.map((a) => `<option value="${a.id}">${aman(a.name)}</option>`).join('');
}

function tampilkanRiwayat(riwayat) {
  daftarRiwayat.innerHTML = riwayat
    .map((r) => {
      const aksi = r.status === 'dipinjam'
        ? `<button type="button" data-id="${r.id}" class="${TOMBOL}">Kembali</button>`
        : '-';
      return `
      <tr class="border-b border-line">
        <td class="py-3 font-semibold">${aman(r.equipment_name)}</td>
        <td class="py-3">${aman(r.borrower_name)}</td>
        <td class="py-3">${tulisTanggal(r.borrowed_at)}</td>
        <td class="py-3">${lencanaRiwayat(r.status)}</td>
        <td class="py-3">${aksi}</td>
      </tr>`;
    })
    .join('');

  daftarRiwayatHp.innerHTML = riwayat
    .map((r) => {
      const aksi = r.status === 'dipinjam'
        ? `<button type="button" data-id="${r.id}" class="mt-3 w-full ${TOMBOL}">Kembali</button>`
        : '';
      return `
      <div class="rounded-xl border border-line p-3">
        <div class="flex items-center justify-between">
          <p class="font-semibold">${aman(r.equipment_name)}</p>
          ${lencanaRiwayat(r.status)}
        </div>
        <p class="mt-2 text-[13px]">Peminjam: ${aman(r.borrower_name)}</p>
        <p class="text-[13px]">Tanggal: ${tulisTanggal(r.borrowed_at)}</p>
        ${aksi}
      </div>`;
    })
    .join('');
}

async function muatData() {
  try {
    const alat = await panggil('/equipment');
    const riwayat = await panggil('/loans');
    tampilkanAlat(alat.data);
    tampilkanRiwayat(riwayat.data);
  } catch (galat) {
    tampilkanPesan(galat.message, true);
  }
}

formPinjam.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nama = inputNama.value.trim();

  if (nama.length < 2 || nama.length > 80) {
    return tampilkanPesan('Nama peminjam harus 2 sampai 80 karakter.', true);
  }
  if (!pilihAlat.value) {
    return tampilkanPesan('Pilih alat terlebih dahulu.', true);
  }

  tombolPinjam.disabled = true;
  try {
    const hasil = await panggil('/loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ equipment_id: Number(pilihAlat.value), borrower_name: nama }),
    });
    formPinjam.reset();
    inputTanggal.value = tanggalHariIni();
    tampilkanPesan(hasil.message, false);
  } catch (galat) {
    tampilkanPesan(galat.message, true);
  }
  tombolPinjam.disabled = false;
  muatData();
});

async function kembalikan(e) {
  const id = e.target.dataset.id;
  if (!id) return;
  try {
    const hasil = await panggil(`/loans/${id}/return`, { method: 'PATCH' });
    tampilkanPesan(hasil.message, false);
  } catch (galat) {
    tampilkanPesan(galat.message, true);
  }
  muatData();
}

daftarRiwayat.addEventListener('click', kembalikan);
daftarRiwayatHp.addEventListener('click', kembalikan);
tombolMuat.addEventListener('click', muatData);

$('formTambahAlat').addEventListener('submit', (e) => {
  e.preventDefault();
  tampilkanPesan('Fitur tambah alat belum tersedia.', true);
});

inputTanggal.value = tanggalHariIni();
muatData();
