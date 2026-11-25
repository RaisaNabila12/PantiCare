
'use client';

import { useEffect, useState } from 'react';
import { getDonasi, saveDonasi, rupiah } from '../../lib/donasi';

export default function DonasiPage() {
  const [donasi, setDonasi] = useState([]);
  const [role, setRole] = useState('pengguna');

  useEffect(() => {
    setRole(localStorage.getItem('panticare_role') || 'pengguna');
  }, []);

  const verified = donasi.filter((d) =>
    ['Diterima', 'Tercatat'].includes(d.status)
  );

  function updateStatus(id, status) {
    if (role !== 'admin') return;

    saveDonasi(
      getDonasi().map((d) =>
        d.id === id ? { ...d, status } : d
      )
    );
  }

  function exportCSV() {
    const rows = [
      [
        'ID',
        'Donatur',
        'Nominal',
        'Metode',
        'Tanggal',
        'Status',
        ...(role === 'admin' ? ['Verifikasi'] : []),
      ],
      ...donasi.map((d) => [
        d.id,
        d.donatur,
        d.jumlah,
        d.metode,
        d.tanggal,
        d.status,
      ]),
    ];

    const csv =
      '\uFEFF' +
      rows
        .map((r) =>
          r
            .map(
              (v) =>
                '"' + String(v ?? '').replace(/"/g, '""') + '"'
            )
            .join(',')
        )
        .join('\r\n');

    const a = document.createElement('a');
    a.href = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8' })
    );
    a.download = 'laporan-donasi.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  useEffect(() => {
    const refresh = () => setDonasi(getDonasi());

    refresh();

    window.addEventListener('storage', refresh);
    window.addEventListener('panticare-donasi-update', refresh);

    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('panticare-donasi-update', refresh);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Pencatatan Donasi
        </h1>
        <p className="text-sm text-slate-500">
          Rekapitulasi donasi PantiCare (mode demo).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          [
            'Total Terkumpul',
            rupiah(
              verified.reduce(
                (a, b) => a + Number(b.jumlah),
                0
              )
            ),
          ],
          ['Jumlah Transaksi', `${donasi.length} Transaksi`],
          ['Status Laporan', 'Tercatat (Demo)'],
        ].map(([k, v]) => (
          <div
            key={k}
            className="bg-white p-5 rounded-2xl border border-slate-200"
          >
            <p className="text-xs font-semibold text-slate-500">
              {k}
            </p>
            <p className="text-xl font-bold text-emerald-600 mt-1">
              {v}
            </p>
          </div>
        ))}
      </div>

      {role === 'admin' && (
        <button
          onClick={exportCSV}
          className="bg-emerald-600 text-white rounded-xl px-5 py-3"
        >
          Unduh Laporan CSV (Excel)
        </button>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              {[
                'Donatur',
                'Jumlah Donasi',
                'Metode Pembayaran',
                'Tanggal',
                'Status',
                ...(role === 'admin' ? ['Verifikasi'] : []),
              ].map((v) => (
                <th key={v} className="p-4">
                  {v}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {donasi.map((d) => (
              <tr key={d.id}>
                <td className="p-4 font-semibold">
                  {d.donatur}
                </td>

                <td className="p-4 text-emerald-600 font-bold">
                  {rupiah(d.jumlah)}
                </td>

                <td className="p-4">{d.metode}</td>

                <td className="p-4">{d.tanggal}</td>

                <td className="p-4">
                  {d.status || 'Tercatat'}
                </td>

                {role === 'admin' && (
                  <td className="p-4">
                    <select
                      aria-label="Verifikasi donasi"
                      className="border rounded-lg p-2"
                      value={d.status || 'Menunggu'}
                      onChange={(e) =>
                        updateStatus(d.id, e.target.value)
                      }
                    >
                      {[
                        'Menunggu',
                        'Diterima',
                        'Ditolak',
                        'Tercatat',
                      ].map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
