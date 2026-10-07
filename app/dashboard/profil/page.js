export default function ProfilPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profil Pengurus Panti</h1>
        <p className="text-sm text-slate-500">Pengaturan informasi akun dan panti asuhan.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-4 border-b pb-4">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl">
            PC
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Admin PantiCare</h2>
            <p className="text-sm text-slate-500">admin@panticare.org</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <label className="block text-xs text-slate-500 font-semibold">Nama Panti Asuhan</label>
            <p className="font-medium text-slate-800">Panti Asuhan Kasih Bunda</p>
          </div>
          <div>
            <label className="block text-xs text-slate-500 font-semibold">Alamat</label>
            <p className="font-medium text-slate-800">Jl. Merdeka No. 45, Banda Aceh</p>
          </div>
          <div>
            <label className="block text-xs text-slate-500 font-semibold">Nomor Telepon Kontak</label>
            <p className="font-medium text-slate-800">+62 812-3456-7890</p>
          </div>
        </div>
      </div>
    </div>
  );
}