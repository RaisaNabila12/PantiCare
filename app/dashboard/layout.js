
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getDonasi } from '../lib/donasi';
import {
  INITIAL_KEBUTUHAN,
  INITIAL_KEGIATAN,
  readLocal,
  formatTanggal,
} from '../lib/panti-data';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Baby,
  CircleDollarSign,
  Package,
  CalendarDays,
  UserRound,
  LogOut,
  Heart,
  Target,
  FileBarChart,
  Bell,
  X,
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setRole(localStorage.getItem('panticare_role') || 'admin');

    const refresh = () => {
      const ds = getDonasi()
        .filter((d) => d.status === 'Menunggu')
        .slice(0, 4)
        .map((d) => ({
          id: 'd' + d.id,
          title: 'Donasi baru menunggu verifikasi',
          detail: `${d.donatur} · Rp ${Number(d.jumlah).toLocaleString('id-ID')}`,
          href: '/dashboard/donasi',
        }));

      const ks = readLocal('panticare_kebutuhan', INITIAL_KEBUTUHAN)
        .filter((k) => k.prioritas === 'Sangat Tinggi' && k.status !== 'Terpenuhi')
        .slice(0, 3)
        .map((k) => ({
          id: 'k' + k.id,
          title: 'Kebutuhan prioritas tinggi',
          detail: k.barang + ' · ' + k.jumlah,
          href: '/dashboard/kebutuhan',
        }));

      const now = new Date();

      const es = readLocal('panticare_kegiatan', INITIAL_KEGIATAN)
        .filter((k) => {
          const d = new Date(`${k.tanggal}T00:00:00`);
          return (
            d >= new Date(now.getFullYear(), now.getMonth(), now.getDate()) &&
            d <= new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7)
          );
        })
        .slice(0, 3)
        .map((k) => ({
          id: 'e' + k.id,
          title: 'Kegiatan dalam 7 hari ke depan',
          detail: k.judul + ' · ' + formatTanggal(k.tanggal),
          href: '/dashboard/kegiatan',
        }));

      setNotifications([...ds, ...ks, ...es]);
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

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Data Anak', path: '/dashboard/data-anak', icon: Baby },
    { name: 'Donasi', path: '/dashboard/donasi', icon: CircleDollarSign },
    ...(role === 'pengguna'
      ? [{ name: 'Buat Donasi', path: '/dashboard/buat-donasi', icon: Heart }]
      : []),
    { name: 'Target Donasi', path: '/dashboard/target-donasi', icon: Target },
    { name: 'Laporan Donasi', path: '/dashboard/laporan-donasi', icon: FileBarChart },
    { name: 'Kebutuhan', path: '/dashboard/kebutuhan', icon: Package },
    { name: 'Kegiatan', path: '/dashboard/kegiatan', icon: CalendarDays },
    { name: 'Profil', path: '/dashboard/profil', icon: UserRound },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('panticare_role');
    router.push('/login');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-slate-100">
      <aside className="sticky top-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-6 shrink-0 overflow-y-auto">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-2xl font-bold text-emerald-400"
            >
              <Heart size={24} strokeWidth={2.5} fill="currentColor" />
              <span>PantiCare</span>
            </Link>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} strokeWidth={2} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all w-full text-left"
        >
          <LogOut size={18} strokeWidth={2} />
          <span>Keluar</span>
        </button>
      </aside>

      <main className="h-screen min-w-0 flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="mb-5 flex justify-end">
          <div className="relative">
            <button
              onClick={() => setShowNotifications((v) => !v)}
              aria-label="Notifikasi"
              className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Bell size={18} />
              Notifikasi
              {notifications.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] text-white">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 z-40 mt-2 w-[min(90vw,360px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b p-4">
                  <div>
                    <p className="font-bold text-slate-900">Notifikasi</p>
                    <p className="text-xs text-slate-500">
                      Informasi yang perlu diperhatikan
                    </p>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    aria-label="Tutup"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <Link
                      key={n.id}
                      href={n.href}
                      onClick={() => setShowNotifications(false)}
                      className="block border-b p-4 hover:bg-slate-50"
                    >
                      <p className="text-sm font-semibold text-slate-800">
                        {n.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {n.detail}
                      </p>
                    </Link>
                  ))}

                  {notifications.length === 0 && (
                    <p className="p-6 text-center text-sm text-slate-500">
                      Belum ada notifikasi baru.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {role === 'pengguna' && (
          <p className="mb-5 text-sm bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3">
            Mode Pengguna: data panti hanya dapat dilihat. Anda dapat mengubah
            profil dan melakukan donasi.
          </p>
        )}

        {children}
      </main>
    </div>
  );
}
