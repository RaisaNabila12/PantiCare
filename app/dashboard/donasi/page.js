'use client';

import { useState } from 'react';
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  HandCoins,
  Search,
  Users,
} from 'lucide-react';

export default function DonasiPage() {
  const [search, setSearch] = useState('');

  const donasi = [
    {
      id: 1,
      donatur: 'Hamba Allah',
      jumlah: 'Rp 2.000.000',
      metode: 'Transfer BCA',
      tanggal: '06 Okt 2026',
    },
    {
      id: 2,
      donatur: 'PT Peduli Bangsa',
      jumlah: 'Rp 10.000.000',
      metode: 'Transfer Mandiri',
      tanggal: '04 Okt 2026',
    },
    {
      id: 3,
      donatur: 'Rina Kusuma',
      jumlah: 'Rp 500.000',
      metode: 'QRIS',
      tanggal: '01 Okt 2026',
    },
  ];

  const filteredDonasi = donasi.filter((item) =>
    item.donatur.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <HandCoins size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Pencatatan Donasi
            </h1>

            <p className="text-sm text-slate-500">
              Rekapitulasi penerimaan donasi finansial PantiCare.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Total Terkumpul
              </p>

              <p className="text-2xl font-bold text-emerald-600 mt-1">
                Rp 12.500.000
              </p>
            </div>

            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Banknote size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Jumlah Transaksi
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                3 Transaksi
              </p>
            </div>

            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Status Laporan
              </p>

              <p className="text-2xl font-bold text-blue-600 mt-1">
                Terverifikasi
              </p>
            </div>

            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Donation History */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-bold text-slate-900">
                Riwayat Donasi
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Daftar donasi yang telah diterima PantiCare.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Cari nama donatur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="p-4">Donatur</th>
                <th className="p-4">Jumlah Donasi</th>
                <th className="p-4">Metode Pembayaran</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredDonasi.length > 0 ? (
                filteredDonasi.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4 font-semibold text-slate-800">
                      {item.donatur}
                    </td>

                    <td className="p-4 text-emerald-600 font-bold">
                      {item.jumlah}
                    </td>

                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-slate-400" />
                        {item.metode}
                      </div>
                    </td>

                    <td className="p-4 text-slate-500">
                      {item.tanggal}
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                        <CheckCircle2 size={13} />
                        Terverifikasi
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-slate-500"
                  >
                    Data donasi tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}