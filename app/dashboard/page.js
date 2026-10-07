import {
  Baby,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Package,
  TrendingUp,
} from 'lucide-react';

export default function DashboardOverview() {
  const stats = [
    {
      label: 'Total Anak Asuh',
      value: '48 Anak',
      change: '+2 bulan ini',
      icon: Baby,
    },
    {
      label: 'Total Donasi Bulan Ini',
      value: 'Rp 24.500.000',
      change: '+12%',
      icon: CircleDollarSign,
    },
    {
      label: 'Kebutuhan Mendesak',
      value: '5 Barang',
      change: 'Perlu segera',
      icon: Package,
    },
    {
      label: 'Kegiatan Mendatang',
      value: '3 Acara',
      change: 'Minggu ini',
      icon: CalendarDays,
    },
  ];

  const activities = [
    {
      title: 'Pemeriksaan Kesehatan Gratis',
      date: '15 Oktober 2026',
      location: 'Aula Utama PantiCare',
    },
    {
      title: 'Pelatihan Coding & Web Basic',
      date: '22 Oktober 2026',
      location: 'Lab Komputer PantiCare',
    },
    {
      title: 'Kegiatan Belajar Bersama',
      date: '28 Oktober 2026',
      location: 'Ruang Belajar PantiCare',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Ringkasan Dashboard
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Selamat datang kembali di sistem pengelolaan PantiCare.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Icon size={21} strokeWidth={2} />
                </div>

                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                  {stat.change}
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-500 mt-4">
                {stat.label}
              </p>

              <p className="text-xl font-bold text-slate-900 mt-1">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Program Unggulan */}
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden min-h-72 shadow-md text-white flex items-center p-8">
          <img
            src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1200&auto=format&fit=crop"
            alt="Kegiatan anak PantiCare"
            className="absolute inset-0 w-full h-full object-cover brightness-50"
          />

          <div className="relative z-10 max-w-lg">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase">
              <TrendingUp size={13} />
              Program Unggulan
            </span>

            <h2 className="text-2xl font-bold mt-3">
              Pendidikan Digital untuk Anak Asuh
            </h2>

            <p className="text-sm text-slate-200 mt-2 leading-relaxed">
              Membantu anak-anak belajar pemrograman dasar dan keahlian
              digital untuk mempersiapkan masa depan yang lebih baik.
            </p>
          </div>
        </div>

        {/* Status Sistem */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Status Sistem
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Kondisi pengelolaan PantiCare
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={21} />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Data Anak
              </span>

              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Aktif
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Pencatatan Donasi
              </span>

              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Aktif
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Agenda Kegiatan
              </span>

              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Aktif
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Activities */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="font-bold text-slate-900">
            Kegiatan Mendatang
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Agenda kegiatan sosial dan edukasi PantiCare.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {activities.map((activity) => (
            <div
              key={activity.title}
              className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CalendarDays size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {activity.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    {activity.location}
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-emerald-700">
                {activity.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}