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
} from 'lucide-react';

export default function DataAnakPage() {
  const [anakList] = useState([
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
        {/* Table Header */}
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

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
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
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          anak.status === 'Aktif'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {anak.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
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
    </div>
  );
}