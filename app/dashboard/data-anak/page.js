'use client';

import { useState } from 'react';

export default function DataAnakPage() {
  const [anakList, setAnakList] = useState([
    { id: 1, nama: 'Ahmad Rizky', umur: '10 Tahun', pendidikan: 'SD Kelas 4', status: 'Aktif', tglMasuk: '12 Jan 2023' },
    { id: 2, nama: 'Siti Nurhaliza', umur: '14 Tahun', pendidikan: 'SMP Kelas 8', status: 'Aktif', tglMasuk: '05 Mar 2022' },
    { id: 3, nama: 'Budi Santoso', umur: '8 Tahun', pendidikan: 'SD Kelas 2', status: 'Aktif', tglMasuk: '20 Aug 2023' },
    { id: 4, nama: 'Dewi Anggraini', umur: '16 Tahun', pendidikan: 'SMA Kelas 11', status: 'Aktif', tglMasuk: '10 Nov 2021' },
  ]);

  const [form, setForm] = useState({ nama: '', umur: '', pendidikan: '' });
  const [showModal, setShowModal] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    const newAnak = {
      id: Date.now(),
      nama: form.nama,
      umur: `${form.umur} Tahun`,
      pendidikan: form.pendidikan,
      status: 'Aktif',
      tglMasuk: 'Hari ini'
    };
    setAnakList([...anakList, newAnak]);
    setForm({ nama: '', umur: '', pendidikan: '' });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Anak Asuh</h1>
          <p className="text-sm text-slate-500">Kelola daftar anak asuh yang terdaftar di PantiCare.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
        >
          + Tambah Anak Asuh
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
            <tr>
              <th className="p-4">Nama Lengkap</th>
              <th className="p-4">Usia</th>
              <th className="p-4">Pendidikan</th>
              <th className="p-4">Tanggal Masuk</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {anakList.map((anak) => (
              <tr key={anak.id} className="hover:bg-slate-50/80">
                <td className="p-4 font-semibold text-slate-800">{anak.nama}</td>
                <td className="p-4 text-slate-600">{anak.umur}</td>
                <td className="p-4 text-slate-600">{anak.pendidikan}</td>
                <td className="p-4 text-slate-500">{anak.tglMasuk}</td>
                <td className="p-4">
                  <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-medium">
                    {anak.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Tambah Data Anak Asuh</h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  placeholder="Contoh: Andi Wijaya"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Usia (Tahun)</label>
                <input
                  type="number"
                  required
                  value={form.umur}
                  onChange={(e) => setForm({ ...form, umur: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  placeholder="12"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pendidikan</label>
                <input
                  type="text"
                  required
                  value={form.pendidikan}
                  onChange={(e) => setForm({ ...form, pendidikan: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  placeholder="SD / SMP / SMA"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-xl text-sm font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}