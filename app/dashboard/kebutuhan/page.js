'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, X, Package, Search } from 'lucide-react';
import {
  INITIAL_KEBUTUHAN,
  readLocal,
  writeLocal,
} from '../../lib/panti-data';

const EMPTY = {
  barang: '',
  jumlah: '',
  prioritas: 'Sedang',
  status: 'Belum Terpenuhi',
  catatan: '',
};

export default function KebutuhanPage() {
  const [items, setItems] = useState(INITIAL_KEBUTUHAN);
  const [role, setRole] = useState('admin');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Semua');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    setRole(localStorage.getItem('panticare_role') || 'admin');
    setItems(readLocal('panticare_kebutuhan', INITIAL_KEBUTUHAN));
  }, []);

  useEffect(() => {
    const refresh = () =>
      setItems(readLocal('panticare_kebutuhan', INITIAL_KEBUTUHAN));

    window.addEventListener('panticare-data-update', refresh);

    return () => {
      window.removeEventListener('panticare-data-update', refresh);
    };
  }, []);

  const filtered = useMemo(
    () =>
      items.filter(
        (x) =>
          x.barang.toLowerCase().includes(search.toLowerCase()) &&
          (filter === 'Semua' || x.status === filter)
      ),
    [items, search, filter]
  );

  function save(e) {
    e.preventDefault();

    const next = editing
      ? items.map((x) =>
          x.id === editing ? { ...form, id: editing } : x
        )
      : [{ ...form, id: Date.now() }, ...items];

    setItems(next);
    writeLocal('panticare_kebutuhan', next);
    setOpen(false);
    setEditing(null);
    setForm(EMPTY);
  }

  function edit(item) {
    setEditing(item.id);
    setForm({
      barang: item.barang,
      jumlah: item.jumlah,
      prioritas: item.prioritas,
      status: item.status,
      catatan: item.catatan || '',
    });
    setOpen(true);
  }

  function remove(id) {
    if (!confirm('Hapus kebutuhan ini?')) return;

    const next = items.filter((x) => x.id !== id);

    setItems(next);
    writeLocal('panticare_kebutuhan', next);
  }

  const priority = (p) =>
    p === 'Sangat Tinggi'
      ? 'bg-rose-100 text-rose-700'
      : p === 'Tinggi'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-sky-100 text-sky-700';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Daftar Kebutuhan Panti
          </h1>
          <p className="text-sm text-slate-500">
            Kelola kebutuhan dan pantau pemenuhannya.
          </p>
        </div>

        {role !== 'pengguna' && (
          <button
            onClick={() => {
              setEditing(null);
              setForm(EMPTY);
              setOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
          >
            <Plus size={17} />
            Tambah Kebutuhan
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          ['Total Kebutuhan', items.length],
          [
            'Belum Terpenuhi',
            items.filter((x) => x.status === 'Belum Terpenuhi').length,
          ],
          [
            'Sudah Terpenuhi',
            items.filter((x) => x.status === 'Terpenuhi').length,
          ],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border bg-white p-5"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-3 text-slate-400"
            size={18}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kebutuhan..."
            className="w-full rounded-xl border bg-white py-2.5 pl-10 pr-3"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border bg-white px-3 py-2.5"
        >
          <option>Semua</option>
          {[
            'Belum Terpenuhi',
            'Terpenuhi Sebagian',
            'Terpenuhi',
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Package size={20} />
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priority(item.prioritas)}`}
              >
                {item.prioritas}
              </span>
            </div>

            <h2 className="mt-4 font-bold text-slate-900">
              {item.barang}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Jumlah dibutuhkan:{' '}
              <b className="text-slate-700">{item.jumlah}</b>
            </p>

            {item.catatan && (
              <p className="mt-3 text-sm text-slate-500">
                {item.catatan}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <span className="text-xs text-slate-500">
                {item.status}
              </span>

              {role !== 'pengguna' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => edit(item)}
                    aria-label="Edit"
                    className="rounded-lg p-2 text-sky-700 hover:bg-sky-50"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => remove(item.id)}
                    aria-label="Hapus"
                    className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed bg-white p-10 text-center text-sm text-slate-500">
            Tidak ada kebutuhan yang cocok.
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <form
            onSubmit={save}
            className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {editing ? 'Edit Kebutuhan' : 'Tambah Kebutuhan'}
              </h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
              >
                <X />
              </button>
            </div>

            <label className="block text-sm font-medium">
              Nama kebutuhan
              <input
                required
                value={form.barang}
                onChange={(e) =>
                  setForm({ ...form, barang: e.target.value })
                }
                className="mt-1 w-full rounded-xl border p-3"
              />
            </label>

            <label className="block text-sm font-medium">
              Jumlah dibutuhkan
              <input
                required
                value={form.jumlah}
                onChange={(e) =>
                  setForm({ ...form, jumlah: e.target.value })
                }
                placeholder="Contoh: 20 paket"
                className="mt-1 w-full rounded-xl border p-3"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-medium">
                Prioritas
                <select
                  value={form.prioritas}
                  onChange={(e) =>
                    setForm({ ...form, prioritas: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border p-3"
                >
                  {[
                    'Rendah',
                    'Sedang',
                    'Tinggi',
                    'Sangat Tinggi',
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-medium">
                Status
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border p-3"
                >
                  {[
                    'Belum Terpenuhi',
                    'Terpenuhi Sebagian',
                    'Terpenuhi',
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block text-sm font-medium">
              Catatan
              <textarea
                value={form.catatan}
                onChange={(e) =>
                  setForm({ ...form, catatan: e.target.value })
                }
                className="mt-1 w-full rounded-xl border p-3"
                rows="3"
              />
            </label>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
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