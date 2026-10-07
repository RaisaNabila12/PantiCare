import { CalendarDays, MapPin } from 'lucide-react';

export default function KegiatanPage() {
  const kegiatan = [
    {
      id: 1,
      judul: 'Pemeriksaan Kesehatan Gratis',
      tanggal: '15 Oktober 2026',
      lokasi: 'Aula Utama PantiCare',
      gambar: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 2,
      judul: 'Pelatihan Coding & Web Basic',
      tanggal: '22 Oktober 2026',
      lokasi: 'Lab Komputer PantiCare',
      gambar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Agenda Kegiatan</h1>
        <p className="text-sm text-slate-500">Jadwal kegiatan sosial dan edukasi anak-anak panti.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kegiatan.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <img src={item.gambar} alt={item.judul} className="w-full h-48 object-cover" />
            <div className="p-5 space-y-2">
              <h3 className="text-lg font-bold text-slate-900">{item.judul}</h3>
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                <CalendarDays size={14} strokeWidth={2} />
                {item.tanggal}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <MapPin size={14} strokeWidth={2} />
                {item.lokasi}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
