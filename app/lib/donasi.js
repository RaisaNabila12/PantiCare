export const INITIAL_DONASI = [
  {
    id: 1,
    donatur: 'Hamba Allah',
    jumlah: 2000000,
    metode: 'Transfer BCA',
    tanggal: '06 Okt 2026',
    status: 'Tercatat',
  },
  {
    id: 2,
    donatur: 'PT Peduli Bangsa',
    jumlah: 10000000,
    metode: 'Transfer Mandiri',
    tanggal: '04 Okt 2026',
    status: 'Tercatat',
  },
  {
    id: 3,
    donatur: 'Rina Kusuma',
    jumlah: 500000,
    metode: 'QRIS',
    tanggal: '01 Okt 2026',
    status: 'Tercatat',
  },
];

export const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);

export function getDonasi() {
  try {
    const data = JSON.parse(localStorage.getItem('panticare_donasi'));
    return Array.isArray(data) ? data : INITIAL_DONASI;
  } catch {
    return INITIAL_DONASI;
  }
}

export function saveDonasi(items) {
  localStorage.setItem('panticare_donasi', JSON.stringify(items));
  window.dispatchEvent(new Event('panticare-donasi-update'));
}