import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Users,
} from 'lucide-react';

export default function KegiatanPage() {
  const kegiatan = [
    {
      id: 1,
      judul: 'Pemeriksaan Kesehatan Gratis',
      tanggal: '15 Oktober 2026',
      lokasi: 'Aula Utama PantiCare',
      peserta: '50 Peserta',
      status: 'Akan Datang',
      gambar:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 2,
      judul: 'Pelatihan Coding & Web Basic',
      tanggal: '22 Oktober 2026',
      lokasi: 'Lab Komputer PantiCare',
      peserta: '25 Peserta',
      status: 'Akan Datang',
      gambar:
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 3,
      judul: 'Kegiatan Belajar Bersama',
      tanggal: '28 Oktober 2026',
      lokasi: 'Ruang Belajar PantiCare',
      peserta: '30 Peserta',
      status: 'Akan Datang',
      gambar:
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Agenda Kegiatan
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Jadwal kegiatan sosial dan edukasi anak-anak PantiCare.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Total Kegiatan
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {kegiatan.length}
              </p>
            </div>

            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CalendarDays size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Kegiatan Mendatang
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {kegiatan.length}
              </p>
            </div>

            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Clock3 size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Status Agenda
              </p>

              <p className="text-2xl font-bold text-emerald-600 mt-1">
                Aktif
              </p>
            </div>

            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Daftar Kegiatan
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Informasi kegiatan yang akan dilaksanakan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {kegiatan.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={item.gambar}
                alt={item.judul}
                className="w-full h-48 object-cover"
              />

              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-slate-900">
                    {item.judul}
                  </h3>

                  <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    <CheckCircle2 size={13} />
                    {item.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-emerald-600 font-semibold flex items-center gap-2">
                    <CalendarDays size={16} />
                    {item.tanggal}
                  </p>

                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <MapPin size={16} />
                    {item.lokasi}
                  </p>

                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <Users size={16} />
                    {item.peserta}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}