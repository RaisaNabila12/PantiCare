'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Baby,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Package,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { getDonasi, rupiah } from '../lib/donasi';
import {
  INITIAL_KEBUTUHAN,
  INITIAL_KEGIATAN,
  readLocal,
  formatTanggal,
} from '../lib/panti-data';

const ANAK_AWAL = [
  { id: 1, nama: 'Ahmad Rizky', status: 'Aktif' },
  { id: 2, nama: 'Siti Nurhaliza', status: 'Aktif' },
  { id: 3, nama: 'Budi Santoso', status: 'Aktif' },
  { id: 4, nama: 'Dewi Anggraini', status: 'Aktif' },
];

export default function DashboardOverview() {
  const [anak, setAnak] = useState(ANAK_AWAL);
  const [kebutuhan, setKebutuhan] = useState(INITIAL_KEBUTUHAN);
  const [kegiatan, setKegiatan] = useState(INITIAL_KEGIATAN);
  const [donasi, setDonasi] = useState([]);

  useEffect(() => {
    const refresh = () => {
      setAnak(readLocal('panticare_anak', ANAK_AWAL));
      setKebutuhan(readLocal('panticare_kebutuhan', INITIAL_KEBUTUHAN));
      setKegiatan(readLocal('panticare_kegiatan', INITIAL_KEGIATAN));
      setDonasi(getDonasi());
    };

    refresh();

    window.addEventListener('panticare-data-update', refresh);
    window.addEventListener('panticare-donasi-update', refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener('panticare-data-update', refresh);
      window.removeEventListener('panticare-donasi-update', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const bulanIni = new Date().getMonth();
  const tahunIni = new Date().getFullYear();

  const totalDonasi = donasi
    .filter((d) => ['Diterima', 'Tercatat'].includes(d.status || 'Tercatat'))
    .reduce((sum, d) => sum + Number(d.jumlah || 0), 0);

  const upcoming = useMemo(
    () =>
      kegiatan
        .filter((x) => new Date(`${x.tanggal}T23:59:59`) >= new Date())
        .sort((a, b) => a.tanggal.localeCompare(b.tanggal))
        .slice(0, 4),
    [kegiatan]
  );

  const stats = [
    {
      label: 'Total Anak Asuh',
      value: `${anak.length} Anak`,
      change: `${anak.filter((x) => x.status === 'Aktif').length} aktif`,
      icon: Baby,
    },
    {
      label: 'Total Donasi Tercatat',
      value: rupiah(totalDonasi),
      change: `${donasi.length} transaksi`,
      icon: CircleDollarSign,
    },
    {
      label: 'Kebutuhan Belum Terpenuhi',
      value: `${kebutuhan.filter((x) => x.status !== 'Terpenuhi').length} Item`,
      change: 'Perlu dipantau',
      icon: Package,
    },
    {
      label: 'Kegiatan Mendatang',
      value: `${upcoming.length} Agenda`,
      change: 'Jadwal terdekat',
      icon: CalendarDays,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Ringkasan Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Pantau aktivitas dan informasi PantiCare dalam satu halaman.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;

          return (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Icon size={22} />
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {s.change}
                </span>
              </div>

              <p className="mt-5 text-xs font-medium text-slate-500">
                {s.label}
              </p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {s.value}
              </p>
              <p className="mt-3 border-t pt-3 text-xs text-slate-400">
                Dihitung dari data demo tersimpan
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="relative flex min-h-72 items-center overflow-hidden rounded-2xl p-8 text-white shadow-md lg:col-span-2">
          <img
            src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1200&auto=format&fit=crop"
            alt="Kegiatan anak PantiCare"
            className="absolute inset-0 h-full w-full object-cover brightness-50"
          />

          <div className="relative z-10 max-w-lg">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold uppercase">
              <TrendingUp size={13} />
              Program Unggulan
            </span>

            <h2 className="mt-3 text-2xl font-bold">
              Pendidikan Digital untuk Anak Asuh
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-slate-200">
              Membantu anak-anak belajar pemrograman dasar dan keahlian digital
              untuk mempersiapkan masa depan yang lebih baik.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Ringkasan Pengelolaan
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Kondisi data saat ini
              </p>
            </div>
            <CheckCircle2 className="text-emerald-600" size={22} />
          </div>

          <div className="mt-6 space-y-4">
            {[
              ['Data Anak', anak.length + ' data'],
              ['Pencatatan Donasi', donasi.length + ' transaksi'],
              ['Kebutuhan Panti', kebutuhan.length + ' item'],
              ['Agenda Kegiatan', kegiatan.length + ' agenda'],
            ].map(([a, b]) => (
              <div
                key={a}
                className="flex items-center justify-between gap-2"
              >
                <span className="text-sm text-slate-500">{a}</span>
                <span className="text-xs font-semibold text-emerald-700">
                  {b}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="font-bold text-slate-900">
              Kegiatan Mendatang
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Agenda sosial dan edukasi berikutnya.
            </p>
          </div>

          <Link
            href="/dashboard/kegiatan"
            className="text-sm font-semibold text-emerald-700"
          >
            Lihat semua
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {upcoming.map((x) => (
            <div
              key={x.id}
              className="flex flex-col justify-between gap-3 p-5 hover:bg-slate-50 sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                  <CalendarDays size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {x.judul}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={13} />
                    {x.lokasi}
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-emerald-700">
                {formatTanggal(x.tanggal)}
              </span>
            </div>
          ))}

          {upcoming.length === 0 && (
            <p className="p-6 text-sm text-slate-500">
              Belum ada kegiatan mendatang.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}