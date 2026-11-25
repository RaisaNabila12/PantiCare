export const INITIAL_KEBUTUHAN = [
  {
    id: 1,
    barang: 'Beras & Sembako',
    jumlah: '100 kg',
    prioritas: 'Sangat Tinggi',
    status: 'Belum Terpenuhi',
    catatan: 'Kebutuhan pokok untuk konsumsi harian.',
  },
  {
    id: 2,
    barang: 'Buku Tulis & Alat Tulis',
    jumlah: '50 Paket',
    prioritas: 'Sedang',
    status: 'Terpenuhi Sebagian',
    catatan: 'Perlengkapan belajar anak-anak.',
  },
  {
    id: 3,
    barang: 'Seragam Sekolah',
    jumlah: '20 Pasang',
    prioritas: 'Tinggi',
    status: 'Belum Terpenuhi',
    catatan: 'Untuk anak yang memasuki tahun ajaran baru.',
  },
];

export const INITIAL_KEGIATAN = [
  {
    id: 1,
    judul: 'Pemeriksaan Kesehatan Gratis',
    tanggal: '2026-11-15',
    lokasi: 'Aula Utama PantiCare',
    deskripsi: 'Pemeriksaan kesehatan rutin bersama relawan medis.',
    gambar:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 2,
    judul: 'Pelatihan Coding & Web Basic',
    tanggal: '2026-11-22',
    lokasi: 'Lab Komputer PantiCare',
    deskripsi: 'Pengenalan pemrograman dan pembuatan website sederhana.',
    gambar:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=900&auto=format&fit=crop',
  },
];

export function readLocal(key, fallback) {
  if (typeof window === 'undefined') return fallback;

  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event('panticare-data-update'));
}

export function formatTanggal(value) {
  if (!value) return '-';

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
}