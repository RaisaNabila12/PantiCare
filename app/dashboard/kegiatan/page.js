
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  ImagePlus,
} from 'lucide-react';

import {
  INITIAL_KEGIATAN,
  readLocal,
  writeLocal,
  formatTanggal,
} from '../../lib/panti-data';

const EMPTY = {
  judul: '',
  tanggal: '',
  lokasi: '',
  deskripsi: '',
  gambar: '',
};

export default function KegiatanPage() {
  const [items, setItems] = useState(INITIAL_KEGIATAN);
  const [role, setRole] = useState('admin');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    setRole(localStorage.getItem('panticare_role') || 'admin');
    setItems(readLocal('panticare_kegiatan', INITIAL_KEGIATAN));
  }, []);

  const filtered = useMemo(
    () =>
      items
        .filter(
          (x) =>
            x.judul.toLowerCase().includes(search.toLowerCase()) ||
            x.lokasi.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => a.tanggal.localeCompare(b.tanggal)),
    [items, search]
  );

  function handleImage(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageError('');

    if (!file.type.startsWith('image/')) {
      setImageError('File harus berupa gambar.');
      e.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError('Ukuran gambar maksimal 2 MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        gambar: reader.result,
      }));
    };

    reader.onerror = () => {
      setImageError('Gagal membaca gambar. Silakan coba lagi.');
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function save(e) {
    e.preventDefault();

    const next = editing
      ? items.map((x) =>
          x.id === editing ? { ...form, id: editing } : x
        )
      : [{ ...form, id: Date.now() }, ...items];

    try {
      writeLocal('panticare_kegiatan', next);
      setItems(next);
      setOpen(false);
      setEditing(null);
      setForm(EMPTY);
      setImageError('');
    } catch {
      setImageError(
        'Penyimpanan gagal. Coba gunakan gambar dengan ukuran lebih kecil.'
      );
    }
  }

  function edit(x) {
    setEditing(x.id);
    setForm({
      judul: x.judul,
      tanggal: x.tanggal,
      lokasi: x.lokasi,
      deskripsi: x.deskripsi || '',
      gambar: x.gambar || '',
    });
    setImageError('');
    setOpen(true);
  }

  function remove(id) {
    if (!confirm('Hapus agenda kegiatan ini?')) return;

    const next = items.filter((x) => x.id !== id);
    setItems(next);
    writeLocal('panticare_kegiatan', next);
  }

  function closeForm() {
    setOpen(false);
    setEditing(null);
    setForm(EMPTY);
    setImageError('');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Agenda Kegiatan
          </h1>
          <p className="text-sm text-slate-500">
            Jadwal kegiatan sosial dan edukasi anak-anak panti.
          </p>
        </div>

        {role !== 'pengguna' && (
          <button
            onClick={() => {
              setEditing(null);
              setForm(EMPTY);
              setImageError('');
              setOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
          >
            <Plus size={17} />
            Tambah Kegiatan
          </button>
        )}
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-3 text-slate-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama kegiatan atau lokasi..."
          className="w-full rounded-xl border bg-white py-2.5 pl-10 pr-3"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filtered.map((x) => (
          <article
            key={x.id}
            className="overflow-hidden rounded-2xl border bg-white shadow-sm"
          >
            <div className="h-48 bg-slate-100">
              {x.gambar ? (
                <img
                  src={x.gambar}
                  alt={x.judul}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  <CalendarDays size={42} />
                </div>
              )}
            </div>

            <div className="space-y-3 p-5">
              <h2 className="text-lg font-bold text-slate-900">
                {x.judul}
              </h2>

              <p className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                <CalendarDays size={16} />
                {formatTanggal(x.tanggal)}
              </p>

              <p className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin size={16} />
                {x.lokasi}
              </p>

              {x.deskripsi && (
                <p className="text-sm leading-relaxed text-slate-600">
                  {x.deskripsi}
                </p>
              )}

              {role !== 'pengguna' && (
                <div className="flex justify-end gap-2 border-t pt-3">
                  <button
                    onClick={() => edit(x)}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-sky-700 hover:bg-sky-50"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    onClick={() => remove(x.id)}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 size={15} />
                    Hapus
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed bg-white p-10 text-center text-sm text-slate-500">
            Belum ada kegiatan yang cocok.
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <form
            onSubmit={save}
            className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {editing ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
              </h2>

              <button type="button" onClick={closeForm}>
                <X />
              </button>
            </div>

            <label className="block text-sm font-medium">
              Nama kegiatan
              <input
                required
                value={form.judul}
                onChange={(e) =>
                  setForm({ ...form, judul: e.target.value })
                }
                className="mt-1 w-full rounded-xl border p-3"
              />
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium">
                Tanggal
                <input
                  required
                  type="date"
                  value={form.tanggal}
                  onChange={(e) =>
                    setForm({ ...form, tanggal: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border p-3"
                />
              </label>

              <label className="text-sm font-medium">
                Lokasi
                <input
                  required
                  value={form.lokasi}
                  onChange={(e) =>
                    setForm({ ...form, lokasi: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border p-3"
                />
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Gambar kegiatan
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-5 text-center hover:border-emerald-500 hover:bg-emerald-50">
                {form.gambar ? (
                  <img
                    src={form.gambar}
                    alt="Preview gambar kegiatan"
                    className="mb-3 h-40 w-full rounded-lg object-cover"
                  />
                ) : (
                  <>
                    <ImagePlus
                      size={32}
                      className="mb-2 text-emerald-600"
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      Pilih gambar dari perangkat
                    </span>
                    <span className="mt-1 text-xs text-slate-500">
                      JPG, PNG, atau gambar lainnya · Maksimal 2 MB
                    </span>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
              </label>

              {form.gambar && (
                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, gambar: '' })
                  }
                  className="mt-2 text-sm text-rose-600 hover:underline"
                >
                  Hapus gambar
                </button>
              )}

              {imageError && (
                <p className="mt-2 text-sm text-rose-600">
                  {imageError}
                </p>
              )}
            </div>

            <label className="block text-sm font-medium">
              Deskripsi
              <textarea
                value={form.deskripsi}
                onChange={(e) =>
                  setForm({ ...form, deskripsi: e.target.value })
                }
                rows="3"
                className="mt-1 w-full rounded-xl border p-3"
              />
            </label>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border px-4 py-2.5"
              >
                Batal
              </button>

              <button className="rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white">
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
