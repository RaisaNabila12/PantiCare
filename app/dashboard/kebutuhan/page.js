export default function KebutuhanPage() {
  const kebutuhan = [
    { id: 1, barang: 'Beras & Sembako', jumlah: '100 kg', prioritas: 'Sangat Tinggi', status: 'Belum Terpenuhi' },
    { id: 2, barang: 'Buku Tulis & Alat Tulis', jumlah: '50 Paket', prioritas: 'Sedang', status: 'Terpenuhi Sebagian' },
    { id: 3, barang: 'Seragam Sekolah', jumlah: '20 Pasang', prioritas: 'Tinggi', status: 'Belum Terpenuhi' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Daftar Kebutuhan Panti</h1>
        <p className="text-sm text-slate-500">Kebutuhan logistik dan barang prioritas anak-anak panti.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kebutuhan.map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-slate-900">{item.barang}</h3>
              <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                item.prioritas === 'Sangat Tinggi' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {item.prioritas}
              </span>
            </div>
            <p className="text-sm text-slate-600">Jumlah Dibutuhkan: <span className="font-semibold">{item.jumlah}</span></p>
            <div className="pt-2 border-t text-xs text-slate-500 flex justify-between">
              <span>Status:</span>
              <span className="font-medium text-slate-700">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}