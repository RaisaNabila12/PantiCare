'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getDonasi,
  saveDonasi,
  rupiah,
} from '../../lib/donasi';

export default function DonaturPage() {
  const router = useRouter();
  const [nama, setNama] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [metode, setMetode] = useState('Transfer BCA');
  const [riwayat, setRiwayat] = useState([]);
  const [pesan, setPesan] = useState('');

  useEffect(() => {
    if (localStorage.getItem('panticare_role') !== 'pengguna') {
      router.replace('/login');
      return;
    }

    setNama(
      JSON.parse(localStorage.getItem('panticare_user') || '{}').name ||
        'Donatur'
    );

    setRiwayat(getDonasi());

    const refresh = () => setRiwayat(getDonasi());

    window.addEventListener('storage', refresh);
    window.addEventListener('panticare-donasi-update', refresh);

    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('panticare-donasi-update', refresh);
    };
  }, [router]);

  function submit(e) {
    e.preventDefault();

    const n = Number(jumlah);

    if (!Number.isSafeInteger(n) || n < 1000) {
      setPesan('Minimal donasi Rp 1.000.');
      return;
    }

    const item = {
      id: Date.now(),
      donatur: nama.trim() || 'Hamba Allah',
      jumlah: n,
      metode,
      tanggal: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Menunggu',
      email:
        JSON.parse(localStorage.getItem('panticare_user') || '{}').email ||
        '',
      target: 'Perlengkapan Sekolah',
    };

    const next = [item, ...getDonasi()];

    saveDonasi(next);
    setRiwayat(next);
    setJumlah('');
    setPesan(
      'Donasi berhasil dicatat dalam mode demo. Belum ada pembayaran sungguhan.'
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Donasi untuk Anak Asuh
        </h1>
        <p className="text-slate-500">
          Isi formulir untuk mencatat donasi Anda.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Nama Donatur
          </label>
          <input
            required
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">
            Nominal Donasi (Rp)
          </label>
          <input
            type="number"
            min="1000"
            required
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            placeholder="Contoh: 50000"
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">
            Metode Pembayaran (Simulasi)
          </label>
          <select
            value={metode}
            onChange={(e) => setMetode(e.target.value)}
            className="w-full rounded-xl border p-3"
          >
            {['Transfer BCA', 'Transfer Mandiri', 'QRIS'].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>

        <button className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700">
          Catat Donasi
        </button>

        {pesan && (
          <p role="status" className="text-sm text-emerald-700">
            {pesan}
          </p>
        )}
      </form>

      <section className="rounded-2xl border bg-white p-6">
        <h2 className="mb-3 font-bold">
          Riwayat Donasi Anda (Demo)
        </h2>

        {riwayat
          .filter((x) => x.donatur === nama)
          .map((x) => (
            <p
              key={x.id}
              className="border-b py-3 text-sm"
            >
              {x.tanggal} — {rupiah(x.jumlah)} — {x.metode} —{' '}
              <strong>{x.status}</strong>

              <button
                type="button"
                onClick={() => {
                  const w = window.open('', '_blank');
                  if (!w) return;

                  w.document.write(
                    '<html><head><title>Bukti Donasi</title></head><body style="font-family:Arial;padding:32px"><h1>PantiCare - Bukti Pencatatan Donasi</h1><p>ID: ' +
                      x.id +
                      '</p><p>Donatur: ' +
                      x.donatur +
                      '</p><p>Nominal: ' +
                      rupiah(x.jumlah) +
                      '</p><p>Metode: ' +
                      x.metode +
                      '</p><p>Status: ' +
                      x.status +
                      '</p><p>Catatan: Simulasi, bukan bukti transfer dana.</p></body></html>'
                  );

                  w.document.close();
                  w.print();
                }}
                className="ml-3 text-emerald-700 underline"
              >
                Cetak Bukti / PDF
              </button>
            </p>
          ))}
      </section>
    </div>
  );
}