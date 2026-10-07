'use client';

import { useMemo, useState } from 'react';
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

export default function DataAnakPage() {
  const [anakList, setAnakList] = useState([
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
  ]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    nama: '',
    umur: '',
    pendidikan: '',
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
    setEditingId(null);

    setForm({
      nama: '',
      umur: '',
      pendidikan: '',
      status: 'Aktif',
    });

    setShowModal(true);
  };

  const openEditModal = (anak) => {
    setEditingId(anak.id);

    setForm({
      nama: anak.nama,
      umur: anak.umur.replace(' Tahun', ''),
      pendidikan: anak.pendidikan,
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
                pendidikan: form.pendidikan,
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
        pendidikan: form.pendidikan,
        status: form.status,
        tglMasuk: new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      };

      setAnakList((currentList) => [
        ...currentList,
        newAnak,
      ]);
    }

    closeModal();
  };

  const handleDelete = (id) => {
    const anak = anakList.find((item) => item.id === id);

    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus data ${anak?.nama}?`
    );

    if (!confirmed) {
      return;
    }

    setAnakList((currentList) =>
      currentList.filter((item) => item.id !== id)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Baby size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Data Anak Asuh
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Kelola dan pantau data anak asuh PantiCare.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
        >
          <Plus size={17} />
          Tambah Anak Asuh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
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

                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {stat.value}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Daftar Anak Asuh
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Menampilkan data anak yang terdaftar di PantiCare.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
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
                  className="w-full sm:w-64 pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option>Semua Status</option>
                <option>Aktif</option>
                <option>Tidak Aktif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[950px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold text-slate-500">
                  Anak
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-slate-500">
                  Usia
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-slate-500">
                  Pendidikan
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-slate-500">
                  Tanggal Masuk
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-slate-500 text-right">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredAnak.length > 0 ? (
                filteredAnak.map((anak) => (
                  <tr
                    key={anak.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                          {anak.nama.charAt(0)}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {anak.nama}
                          </p>

                          <p className="text-xs text-slate-400 mt-0.5">
                            ID Anak #
                            {String(anak.id).padStart(3, '0')}
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
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          anak.status === 'Aktif'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {anak.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(anak)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(anak.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition"
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
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                        <Search size={20} />
                      </div>

                      <p className="font-semibold text-slate-700 mt-3">
                        Data tidak ditemukan
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Coba gunakan kata kunci pencarian yang berbeda.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50">
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

      {/* Modal Tambah / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId
                    ? 'Edit Data Anak'
                    : 'Tambah Anak Asuh'}
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  {editingId
                    ? 'Perbarui informasi anak asuh.'
                    : 'Masukkan informasi anak asuh baru.'}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X size={19} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >
              {/* Nama */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Lengkap
                </label>

                <input
                  type="text"
                  required
                  value={form.nama}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nama: e.target.value,
                    })
                  }
                  placeholder="Contoh: Andi Wijaya"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Umur */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
                      setForm({
                        ...form,
                        umur: e.target.value,
                      })
                    }
                    placeholder="Contoh: 12"
                    className="w-full px-3 py-2.5 pr-16 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    Tahun
                  </span>
                </div>
              </div>

              {/* Pendidikan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pendidikan
                </label>

                <input
                  type="text"
                  required
                  value={form.pendidikan}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      pendidikan: e.target.value,
                    })
                  }
                  placeholder="Contoh: SMP Kelas 8"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option>Aktif</option>
                  <option>Tidak Aktif</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition"
                >
                  {editingId
                    ? 'Simpan Perubahan'
                    : 'Tambah Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}