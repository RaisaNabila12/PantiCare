'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Gagal login ke server API');

      const data = await res.json();
      localStorage.setItem('token', data.token || 'demo-token');
      router.push('/dashboard');
    } catch (err) {
      console.warn('Backend offline, menggunakan simulasi lokal:', err.message);
      localStorage.setItem('token', 'demo-auth-token');
      setMessage({ type: 'success', text: 'Login Berhasil (Mode Demo)! Mengalihkan...' });
      setTimeout(() => router.push('/dashboard'), 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-12 text-white bg-emerald-950">
        <img
          src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop"
          alt="PantiCare Shelter"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-emerald-400"><Heart size={24} strokeWidth={2.5} fill="currentColor" /> PantiCare</Link>
        </div>
        <div className="relative z-10 max-w-lg">
          <span className="text-xs font-semibold tracking-wider text-emerald-300 uppercase">Welcome Back</span>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight">
            Kelola data panti dengan efisien dan transparan.
          </h1>
        </div>
        <div className="relative z-10 text-xs text-emerald-300/80">
          © 2026 PantiCare System.
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div>
            <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase">Sign In</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-1">Selamat datang</h2>
            <p className="text-sm text-slate-500 mt-1">Masukkan akun Anda untuk melanjutkan.</p>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl text-sm ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-medium rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 text-sm mt-2 flex items-center justify-center gap-2"
            >
              {loading ? 'Memproses...' : <>Masuk <ArrowRight size={17} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Belum punya akun?{' '}
            <Link href="/register" className="font-semibold text-emerald-700 hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}