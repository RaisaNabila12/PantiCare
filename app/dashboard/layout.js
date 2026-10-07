'use client';

import Link from 'next/link';
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
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Data Anak', path: '/dashboard/data-anak', icon: Baby },
    { name: 'Donasi', path: '/dashboard/donasi', icon: CircleDollarSign },
    { name: 'Kebutuhan', path: '/dashboard/kebutuhan', icon: Package },
    { name: 'Kegiatan', path: '/dashboard/kegiatan', icon: CalendarDays },
    { name: 'Profil', path: '/dashboard/profil', icon: UserRound },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-6 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-bold text-emerald-400">
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

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
