
'use client';

import { useEffect, useState } from 'react';
import { getDonasi, rupiah } from '../../lib/donasi';

export default function TargetDonasi() {
  const [role, setRole] = useState('pengguna');
  const [target, setTarget] = useState(5000000);
  const [nilai, setNilai] = useState('5000000');
  const [donasi, setDonasi] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setRole(localStorage.getItem('panticare_role') || 'pengguna');

    const t = Number(localStorage.getItem('panticare_target') || 5000000);
    setTarget(t);
    setNilai(String(t));

    const refresh = () => setDonasi(getDonasi());

    refresh();

    window.addEventListener('storage', refresh);
    window.addEventListener('panticare-donasi-update', refresh);

    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('panticare-donasi-update', refresh);
    };
  }, []);

  const total = donasi
    .filter((d) => ['Diterima', 'Tercatat'].includes(d.status))
    .reduce((a, d) => a + Number(d.jumlah), 0);

  const pct =
    target > 0 ? Math.min(100, Math.round((total / target) * 100)) : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Target Penggalangan Dana
      </h1>

      <section className="space-y-4 rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-bold">
          Perlengkapan Sekolah Anak Asuh
        </h2>

        <p>
          Donasi diterima: <strong>{rupiah(total)}</strong> dari target{' '}
          <strong>{rupiah(target)}</strong>
        </p>

        <div className="h-5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-emerald-600"
            style={{ width: pct + '%' }}
          />
        </div>

        <p className="font-semibold text-emerald-700">
          {pct}% tercapai
        </p>

        {role === 'admin' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();

              const n = Number(nilai);

              if (n < 1000 || !Number.isSafeInteger(n)) return;

              localStorage.setItem('panticare_target', String(n));
              setTarget(n);
              setSaved(true);
            }}
            className="flex flex-wrap items-end gap-3"
          >
            <label className="text-sm">
              Ubah target (Rp)
              <input
                className="mt-1 block rounded-xl border p-3"
                type="number"
                min="1000"
                value={nilai}
                onChange={(e) => {
                  setNilai(e.target.value);
                  setSaved(false);
                }}
              />
            </label>

            <button className="rounded-xl bg-emerald-600 px-5 py-3 text-white">
              Simpan Target
            </button>

            {saved && (
              <span className="text-emerald-700">
                Tersimpan
              </span>
            )}
          </form>
        )}
      </section>

      <p className="text-sm text-slate-500">
        Mode demo: hanya donasi berstatus Diterima atau Tercatat yang dihitung.
      </p>
    </div>
  );
}
