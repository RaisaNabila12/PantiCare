export default function DonasiPage() {
  const donasi = [
    { id: 1, donatur: 'Hamba Allah', jumlah: 'Rp 2.000.000', metode: 'Transfer BCA', tanggal: '06 Okt 2026' },
    { id: 2, donatur: 'PT Peduli Bangsa', jumlah: 'Rp 10.000.000', metode: 'Transfer Mandiri', tanggal: '04 Okt 2026' },
    { id: 3, donatur: 'Rina Kusuma', jumlah: 'Rp 500.000', metode: 'QRIS', tanggal: '01 Okt 2026' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pencatatan Donasi</h1>
        <p className="text-sm text-slate-500">Rekapitulasi penerimaan donasi finansial PantiCare.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500">Total Terkumpul</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">Rp 12.500.000</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500">Jumlah Transaksi</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">3 Transaksi</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500">Status Laporan</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">Terverifikasi</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
            <tr>
              <th className="p-4">Donatur</th>
              <th className="p-4">Jumlah Donasi</th>
              <th className="p-4">Metode Pembayaran</th>
              <th className="p-4">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {donasi.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80">
                <td className="p-4 font-semibold text-slate-800">{item.donatur}</td>
                <td className="p-4 text-emerald-600 font-bold">{item.jumlah}</td>
                <td className="p-4 text-slate-600">{item.metode}</td>
                <td className="p-4 text-slate-500">{item.tanggal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}