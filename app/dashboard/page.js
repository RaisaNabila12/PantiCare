import { Baby, CircleDollarSign, Package, CalendarDays } from 'lucide-react';

export default function DashboardOverview() {
  const stats = [
    { label: 'Total Anak Asuh', value: '48 Anak', icon: Baby, change: '+2 bulan ini' },
    { label: 'Total Donasi Bulan Ini', value: 'Rp 24.500.000', icon: CircleDollarSign, change: '+12%' },
    { label: 'Kebutuhan Mendesak', value: '5 Barang', icon: Package, change: 'Perlu segera' },
    { label: 'Kegiatan Mendatang', value: '3 Acara', icon: CalendarDays, change: 'Minggu ini' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ringkasan Dashboard</h1>
        <p className="text-sm text-slate-500">Selamat datang kembali di sistem pengelolaan PantiCare.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Icon size={21} strokeWidth={2} />
                </span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                  {stat.change}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-3">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="relative rounded-2xl overflow-hidden h-64 shadow-md text-white flex items-center p-8">
        <img
          src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1200&auto=format&fit=crop"
          alt="Panti Activities"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="relative z-10 max-w-lg">
          <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase">Program Unggulan</span>
          <h2 className="text-2xl font-bold mt-2">Pendidikan Digital untuk Anak Asuh</h2>
          <p className="text-sm text-slate-200 mt-1">
            Membantu anak-anak belajar pemrograman dasar dan keahlian digital untuk masa depan.
          </p>
        </div>
      </div>
    </div>
  );
}
