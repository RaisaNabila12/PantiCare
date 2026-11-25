'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownToLine,
  CalendarDays,
  ChartColumnIncreasing,
  CircleDollarSign,
  FileText,
  HeartHandshake,
  Printer,
  Search,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { getDonasi, rupiah } from '../../lib/donasi';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const VERIFIED = ['Diterima', 'Tercatat'];

function parseDonationDate(value) {
  if (!value) return null;
  const raw = String(value).trim();
  const iso = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  const parts = raw.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (!parts) return null;
  const month = MONTHS.findIndex((m) => m.toLowerCase() === parts[2].slice(0, 3).toLowerCase());
  if (month < 0) return null;
  return new Date(Number(parts[3]), month, Number(parts[1]));
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(key) {
  const [year, month] = key.split('-').map(Number);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

function exportRows(rows) {
  const header = ['ID Donasi', 'Nama Donatur', 'Nominal', 'Metode Pembayaran', 'Tanggal', 'Status'];
  const body = rows.map((d) => [d.id, d.donatur, d.jumlah, d.metode, d.tanggal, d.status || 'Tercatat']);
  const csv = '\uFEFF' + [header, ...body].map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'laporan-donasi-panticare.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export default function LaporanDonasiPage() {
  const [donasi, setDonasi] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('semua');
  const [selectedStatus, setSelectedStatus] = useState('semua');

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

  const verified = useMemo(() => donasi.filter((item) => VERIFIED.includes(item.status || 'Tercatat')), [donasi]);
  const monthOptions = useMemo(() => {
    const keys = [...new Set(donasi.map((item) => parseDonationDate(item.tanggal)).filter(Boolean).map(monthKey))].sort().reverse();
    return keys;
  }, [donasi]);

  const filtered = useMemo(() => {
    return donasi.filter((item) => {
      const date = parseDonationDate(item.tanggal);
      const matchesMonth = selectedMonth === 'semua' || (date && monthKey(date) === selectedMonth);
      const matchesStatus = selectedStatus === 'semua' || (item.status || 'Tercatat') === selectedStatus;
      const q = keyword.trim().toLowerCase();
      const matchesKeyword = !q || [item.donatur, item.metode, item.id].some((value) => String(value ?? '').toLowerCase().includes(q));
      return matchesMonth && matchesStatus && matchesKeyword;
    });
  }, [donasi, keyword, selectedMonth, selectedStatus]);

  const filteredVerified = filtered.filter((item) => VERIFIED.includes(item.status || 'Tercatat'));
  const total = filteredVerified.reduce((sum, item) => sum + Number(item.jumlah || 0), 0);
  const average = filteredVerified.length ? total / filteredVerified.length : 0;
  const largest = filteredVerified.reduce((best, item) => Number(item.jumlah) > Number(best?.jumlah || 0) ? item : best, null);

  const monthly = useMemo(() => {
    const buckets = {};
    verified.forEach((item) => {
      const date = parseDonationDate(item.tanggal);
      if (!date) return;
      const key = monthKey(date);
      buckets[key] = (buckets[key] || 0) + Number(item.jumlah || 0);
    });
    return Object.entries(buckets).sort(([a], [b]) => a.localeCompare(b)).slice(-6);
  }, [verified]);
  const maxMonthly = Math.max(1, ...monthly.map(([, value]) => value));

  const methods = useMemo(() => {
    const buckets = {};
    filteredVerified.forEach((item) => {
      const name = item.metode || 'Tidak disebutkan';
      buckets[name] = (buckets[name] || 0) + Number(item.jumlah || 0);
    });
    return Object.entries(buckets).sort((a, b) => b[1] - a[1]);
  }, [filteredVerified]);

  const statuses = [
    { label: 'Diterima', count: donasi.filter((d) => d.status === 'Diterima').length, color: 'bg-emerald-500' },
    { label: 'Tercatat', count: donasi.filter((d) => !d.status || d.status === 'Tercatat').length, color: 'bg-sky-500' },
    { label: 'Menunggu', count: donasi.filter((d) => d.status === 'Menunggu').length, color: 'bg-amber-500' },
    { label: 'Ditolak', count: donasi.filter((d) => d.status === 'Ditolak').length, color: 'bg-rose-500' },
  ];
  const statusTotal = Math.max(1, donasi.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700"><FileText size={17} /> PUSAT LAPORAN</div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Laporan Donasi</h1>
          <p className="mt-1 text-sm text-slate-500">Pantau pemasukan, tren donasi, dan riwayat kontribusi PantiCare.</p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"><Printer size={17} /> Cetak / PDF</button>
          <button onClick={() => exportRows(filtered)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"><ArrowDownToLine size={17} /> Ekspor CSV</button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-600">Total donasi terverifikasi</span><span className="rounded-xl bg-emerald-100 p-2 text-emerald-700"><Wallet size={19}/></span></div>
          <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{rupiah(total)}</p>
          <p className="mt-1 text-xs text-slate-500">Status diterima dan tercatat</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-600">Transaksi terverifikasi</span><span className="rounded-xl bg-sky-50 p-2 text-sky-700"><HeartHandshake size={19}/></span></div>
          <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{filteredVerified.length}</p>
          <p className="mt-1 text-xs text-slate-500">Dari {filtered.length} transaksi pada filter ini</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-600">Rata-rata donasi</span><span className="rounded-xl bg-violet-50 p-2 text-violet-700"><ChartColumnIncreasing size={19}/></span></div>
          <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{rupiah(average)}</p>
          <p className="mt-1 text-xs text-slate-500">Per transaksi terverifikasi</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-600">Donasi terbesar</span><span className="rounded-xl bg-amber-50 p-2 text-amber-700"><TrendingUp size={19}/></span></div>
          <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{rupiah(Number(largest?.jumlah || 0))}</p>
          <p className="mt-1 truncate text-xs text-slate-500">{largest?.donatur || 'Belum ada transaksi'}</p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-5 flex items-start justify-between gap-3"><div><h2 className="font-bold text-slate-900">Tren donasi bulanan</h2><p className="mt-1 text-xs text-slate-500">Total donasi terverifikasi dalam 6 bulan data terakhir</p></div><span className="rounded-xl bg-emerald-50 p-2 text-emerald-700"><ChartColumnIncreasing size={19}/></span></div>
          {monthly.length ? <div className="flex h-56 items-end gap-3 border-b border-slate-100 pb-2 sm:gap-5">
            {monthly.map(([key, value]) => <div key={key} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
              <span className="max-w-full truncate text-center text-[10px] font-semibold text-slate-600 sm:text-xs">{rupiah(value)}</span>
              <div className="flex h-36 w-full items-end"><div title={`${monthLabel(key)}: ${rupiah(value)}`} className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all" style={{ height: `${Math.max(5, value / maxMonthly * 100)}%` }}/></div>
              <span className="text-center text-[10px] text-slate-500 sm:text-xs">{monthLabel(key)}</span>
            </div>)}
          </div> : <div className="flex h-56 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">Belum ada data tanggal donasi yang dapat ditampilkan.</div>}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5"><h2 className="font-bold text-slate-900">Status donasi</h2><p className="mt-1 text-xs text-slate-500">Ringkasan seluruh transaksi</p></div>
          <div className="space-y-4">
            {statuses.map((item) => <div key={item.label}><div className="mb-1.5 flex justify-between text-sm"><span className="text-slate-600">{item.label}</span><strong className="text-slate-900">{item.count}</strong></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`${item.color} h-full rounded-full`} style={{ width: `${item.count / statusTotal * 100}%` }}/></div></div>)}
          </div>
          <div className="mt-6 rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Total transaksi tercatat</p><p className="mt-1 text-xl font-bold text-slate-900">{donasi.length} transaksi</p></div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
          <div className="mb-4 flex items-center gap-2"><CircleDollarSign size={18} className="text-emerald-600"/><h2 className="font-bold text-slate-900">Metode pembayaran</h2></div>
          {methods.length ? <div className="space-y-4">{methods.map(([name, value]) => <div key={name}><div className="mb-1 flex justify-between gap-2 text-sm"><span className="truncate text-slate-600">{name}</span><strong className="whitespace-nowrap text-slate-900">{rupiah(value)}</strong></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-sky-500" style={{width:`${value / Math.max(1,...methods.map(([,v])=>v))*100}%`}}/></div></div>)}</div> : <p className="text-sm text-slate-500">Belum ada data pembayaran.</p>}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center gap-2"><CalendarDays size={18} className="text-emerald-600"/><h2 className="font-bold text-slate-900">Filter laporan</h2></div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 print:hidden">
            <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">Cari donatur / metode</span><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={keyword} onChange={(e)=>setKeyword(e.target.value)} placeholder="Ketik kata kunci..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"/></div></label>
            <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">Periode</span><select value={selectedMonth} onChange={(e)=>setSelectedMonth(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"><option value="semua">Semua periode</option>{monthOptions.map((key)=><option key={key} value={key}>{monthLabel(key)}</option>)}</select></label>
            <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">Status</span><select value={selectedStatus} onChange={(e)=>setSelectedStatus(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"><option value="semua">Semua status</option>{['Diterima','Tercatat','Menunggu','Ditolak'].map((status)=><option key={status}>{status}</option>)}</select></label>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500"><span>Menampilkan {filtered.length} dari {donasi.length} transaksi</span><button onClick={()=>{setKeyword('');setSelectedMonth('semua');setSelectedStatus('semua')}} className="font-semibold text-emerald-700 hover:text-emerald-800 print:hidden">Reset filter</button></div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold text-slate-900">Rincian transaksi donasi</h2><p className="mt-1 text-xs text-slate-500">Daftar transaksi sesuai filter yang dipilih</p></div><span className="text-xs font-medium text-slate-500">Total terverifikasi: <strong className="text-emerald-700">{rupiah(total)}</strong></span></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3 font-semibold">Donatur</th><th className="px-5 py-3 font-semibold">Tanggal</th><th className="px-5 py-3 font-semibold">Metode</th><th className="px-5 py-3 text-right font-semibold">Nominal</th><th className="px-5 py-3 text-center font-semibold">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length ? filtered.map((item) => { const status = item.status || 'Tercatat'; const statusClass = status === 'Diterima' || status === 'Tercatat' ? 'bg-emerald-50 text-emerald-700' : status === 'Menunggu' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'; return <tr key={item.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><p className="font-semibold text-slate-800">{item.donatur || 'Donatur'}</p><p className="mt-0.5 text-xs text-slate-400">ID #{item.id}</p></td><td className="px-5 py-4 text-slate-600">{item.tanggal || '-'}</td><td className="px-5 py-4 text-slate-600">{item.metode || '-'}</td><td className="px-5 py-4 text-right font-bold text-slate-900">{rupiah(Number(item.jumlah || 0))}</td><td className="px-5 py-4 text-center"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}>{status}</span></td></tr> }) : <tr><td colSpan="5" className="px-5 py-12 text-center"><div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400"><Search size={18}/></div><p className="font-semibold text-slate-700">Transaksi tidak ditemukan</p><p className="mt-1 text-xs text-slate-500">Coba ubah kata kunci atau filter laporan.</p></td></tr>}
            </tbody>
            {filtered.length > 0 && <tfoot className="border-t-2 border-slate-100 bg-slate-50"><tr><td colSpan="3" className="px-5 py-4 font-bold text-slate-700">Total donasi terverifikasi</td><td className="px-5 py-4 text-right font-bold text-emerald-700">{rupiah(total)}</td><td/></tr></tfoot>}
          </table>
        </div>
      </section>
      <p className="text-xs text-slate-400">Catatan: laporan ini menggunakan data demo yang tersimpan di browser (localStorage). Transaksi berstatus Menunggu atau Ditolak tidak dihitung ke total donasi terverifikasi.</p>
      <style jsx global>{`@media print { body { background: white !important; } aside, main > div:first-child, button, select, input { display: none !important; } main { padding: 0 !important; overflow: visible !important; } main > div { width: 100% !important; } section, .rounded-2xl { break-inside: avoid; box-shadow: none !important; } }`}</style>
    </div>
  );
}