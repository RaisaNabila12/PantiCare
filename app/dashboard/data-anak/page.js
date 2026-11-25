'use client';

import { useMemo, useState, useEffect } from 'react';
import { readLocal, writeLocal } from '../../lib/panti-data';
import {
  Baby,
  Search,
  Users,
  UserCheck,
  UserX,
  Plus,
  GraduationCap,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';

const anakAwal = [
  {
    id: 1,
    nama: 'Ahmad Rizky',
    umur: '10 Tahun',
    pendidikan: 'SD Kelas 4',
    status: 'Aktif',
    tglMasuk: '12 Jan 2023',
  },
  {
    id: 2,
    nama: 'Siti Nurhaliza',
    umur: '14 Tahun',
    pendidikan: 'SMP Kelas 8',
    status: 'Aktif',
    tglMasuk: '05 Mar 2022',
  },
  {
    id: 3,
    nama: 'Budi Santoso',
    umur: '8 Tahun',
    pendidikan: 'SD Kelas 2',
    status: 'Aktif',
    tglMasuk: '20 Aug 2023',
  },
  {
    id: 4,
    nama: 'Dewi Anggraini',
    umur: '16 Tahun',
    pendidikan: 'SMA Kelas 11',
    status: 'Aktif',
    tglMasuk: '10 Nov 2021',
  },
];

export default function DataAnakPage() {
  const [isPengguna, setIsPengguna] = useState(false);
  const [anakList, setAnakList] = useState(anakAwal);

  useEffect(() => {
    setIsPengguna(localStorage.getItem('panticare_role') === 'pengguna');
    setAnakList(readLocal('panticare_anak', anakAwal));
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      writeLocal('panticare_anak', anakList);
    }
  }, [anakList]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    nama: '',
    umur: '',
    pendidikan: '',
    kelas: '',
    status: 'Aktif',
  });

  const filteredAnak = useMemo(() => {
    return anakList.filter((anak) => {
      const matchSearch = anak.nama
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus =
        statusFilter === 'Semua Status' ||
        anak.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [anakList, search, statusFilter]);

  const totalAnak = anakList.length;
  const anakAktif = anakList.filter(
    (anak) => anak.status === 'Aktif'
  ).length;
  const anakTidakAktif = anakList.filter(
    (anak) => anak.status !== 'Aktif'
  ).length;

  const stats = [
    {
      label: 'Total Anak',
      value: totalAnak,
      icon: Users,
      description: 'Seluruh anak asuh',
    },
    {
      label: 'Anak Aktif',
      value: anakAktif,
      icon: UserCheck,
      description: 'Masih terdaftar',
    },
    {
      label: 'Tidak Aktif',
      value: anakTidakAktif,
      icon: UserX,
      description: 'Tidak aktif',
    },
    {
      label: 'Data Pendidikan',
      value: totalAnak,
      icon: GraduationCap,
      description: 'Data pendidikan tercatat',
    },
  ];

  const openAddModal = () => {
    if (isPengguna) return;

    setEditingId(null);
    setForm({
      nama: '',
      umur: '',
      pendidikan: '',
      kelas: '',
      status: 'Aktif',
    });
    setShowModal(true);
  };

  const openEditModal = (anak) => {
    if (isPengguna) return;

    setEditingId(anak.id);
    setForm({
      nama: anak.nama,
      umur: anak.umur.replace(' Tahun', ''),
      pendidikan: anak.pendidikan.split(' Kelas ')[0],
      kelas: anak.kelas || anak.pendidikan.split(' Kelas ')[1] || '',
      status: anak.status,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({
      nama: '',
      umur: '',
      pendidikan: '',
      kelas: '',
      status: 'Aktif',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setAnakList((currentList) =>
        currentList.map((anak) =>
          anak.id === editingId
            ? {
                ...anak,
                nama: form.nama,
                umur: `${form.umur} Tahun`,
                pendidikan: `${form.pendidikan} Kelas ${form.kelas}`,
                kelas: form.kelas,
                status: form.status,
              }
            : anak
        )
      );
    } else {
      const newAnak = {
        id: Date.now(),
        nama: form.nama,
        umur: `${form.umur} Tahun`,
        pendidikan: `${form.pendidikan} Kelas ${form.kelas}`,
        kelas: form.kelas,
        status: form.status,
        tglMasuk: new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      };

      setAnakList((currentList) => [...currentList, newAnak]);
    }

    closeModal();
  };

  const handleDelete = (id) => {
    if (isPengguna) return;

    const anak = anakList.find((item) => item.id === id);
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus data ${anak?.nama}?`
    );

    if (!confirmed) return;

    setAnakList((currentList) =>
      currentList.filter((item) => item.id !== id)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Baby size={21} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Data Anak Asuh
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Kelola dan pantau data anak asuh PantiCare.
            </p>
          </div>
        </div>

        <button
          type="button"
          style={{ display: isPengguna ? 'none' : undefined }}
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus size={17} />
          Tambah Anak Asuh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Icon size={21} />
                </div>
                <span className="text-xs font-medium text-slate-400">
                  PantiCare
                </span>
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Daftar Anak Asuh
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Menampilkan data anak yang terdaftar di PantiCare.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama anak..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option>Semua Status</option>
                <option>Aktif</option>
                <option>Tidak Aktif</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                {['Anak', 'Usia', 'Pendidikan', 'Tanggal Masuk', 'Status', 'Aksi'].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 text-xs font-semibold text-slate-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredAnak.length > 0 ? (
                filteredAnak.map((anak) => (
                  <tr
                    key={anak.id}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-600">
                          {anak.nama.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {anak.nama}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            ID Anak #{String(anak.id).padStart(3, '0')}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {anak.umur}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <GraduationCap
                          size={16}
                          className="text-slate-400"
                        />
                        {anak.pendidikan}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {anak.tglMasuk}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          anak.status === 'Aktif'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {anak.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          disabled={isPengguna}
                          style={{ display: isPengguna ? 'none' : undefined }}
                          onClick={() => openEditModal(anak)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={isPengguna}
                          style={{ display: isPengguna ? 'none' : undefined }}
                          onClick={() => handleDelete(anak.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 size={14} />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <Search size={20} />
                      </div>
                      <p className="mt-3 font-semibold text-slate-700">
                        Data tidak ditemukan
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Coba gunakan kata kunci pencarian yang berbeda.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4">
          <p className="text-xs text-slate-500">
            Menampilkan{' '}
            <span className="font-semibold text-slate-700">
              {filteredAnak.length}
            </span>{' '}
            dari{' '}
            <span className="font-semibold text-slate-700">
              {totalAnak}
            </span>{' '}
            data anak.
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? 'Edit Data Anak' : 'Tambah Anak Asuh'}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {editingId
                    ? 'Perbarui informasi anak asuh.'
                    : 'Masukkan informasi anak asuh baru.'}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={form.nama}
                  onChange={(e) =>
                    setForm({ ...form, nama: e.target.value })
                  }
                  placeholder="Contoh: Andi Wijaya"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Usia
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="25"
                    required
                    value={form.umur}
                    onChange={(e) =>
                      setForm({ ...form, umur: e.target.value })
                    }
                    placeholder="Contoh: 12"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 pr-16 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    Tahun
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Jenjang Pendidikan
                </label>
                <select
                  required
                  value={form.pendidikan}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      pendidikan: e.target.value,
                      kelas: '',
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700"
                >
                  <option value="">Pilih jenjang pendidikan</option>
                  {['SD', 'SMP', 'SMA', 'SMK'].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Kelas
                </label>
                <select
                  required
                  disabled={!form.pendidikan}
                  value={form.kelas}
                  onChange={(e) =>
                    setForm({ ...form, kelas: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 disabled:bg-slate-100"
                >
                  <option value="">Pilih kelas</option>
                  {(form.pendidikan === 'SD'
                    ? [1, 2, 3, 4, 5, 6]
                    : form.pendidikan === 'SMP'
                      ? [7, 8, 9]
                      : [10, 11, 12]
                  ).map((v) => (
                    <option key={v} value={v}>Kelas {v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option>Aktif</option>
                  <option>Tidak Aktif</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  {editingId ? 'Simpan Perubahan' : 'Tambah Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}