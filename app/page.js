import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-900 text-white">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 text-2xl font-bold text-emerald-400"><Heart size={24} strokeWidth={2.5} fill="currentColor" /> PantiCare</div>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition">
            Masuk
          </Link>
          <Link href="/register" className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-500 transition">
            Daftar Sekarang
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto text-center px-6 py-20 my-auto">
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-500/20">
          Sistem Pengelolaan Panti Digital
        </span>
        <h1 className="text-5xl sm:text-6xl font-extrabold mt-6 leading-tight">
          Setiap Data Punya Cerita Untuk Dibantu.
        </h1>
        <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Platform terpadu untuk mengelola data anak asuh, pencatatan donasi yang transparan, ketersediaan kebutuhan, serta agenda kegiatan sosial panti.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/register" className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-emerald-900/30 inline-flex items-center gap-2">
            Mulai Sekarang <ArrowRight size={17} />
          </Link>
          <Link href="/login" className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all border border-slate-700">
            Masuk Akun
          </Link>
        </div>
      </main>

      <footer className="p-6 text-center text-xs text-slate-500 border-t border-slate-800">
        © 2026 PantiCare System. All rights reserved.
      </footer>
    </div>
  );
}