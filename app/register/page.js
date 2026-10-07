'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.password !== formData.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Konfirmasi password tidak cocok.',
      });
      return;
    }

    setLoading(true);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      const res = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal mendaftar dari server API');
      }

      setMessage({
        type: 'success',
        text: 'Registrasi berhasil! Mengalihkan ke halaman login...',
      });

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err) {
      console.warn(
        'Backend offline, menggunakan simulasi lokal:',
        err.message
      );

      localStorage.setItem(
        'panticare_user',
        JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      );

      setMessage({
        type: 'success',
        text: 'Registrasi Berhasil (Mode Demo)! Mengalihkan ke login...',
      });

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-12 text-white bg-emerald-950">
        <img
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop"
          alt="PantiCare Social Impact"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />

        <div className="relative z-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold tracking-tight text-emerald-400"
          >
            <Heart
              size={24}
              strokeWidth={2.5}
              fill="currentColor"
            />
            PantiCare
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <span className="text-xs font-semibold tracking-wider text-emerald-300 uppercase">
            Make An Impact
          </span>

          <h1 className="mt-3 text-4xl font-extrabold leading-tight">
            Setiap data punya cerita untuk dibantu.
          </h1>

          <p className="mt-4 text-emerald-100/90 text-sm leading-relaxed">
            Bangun pengelolaan panti yang lebih terstruktur,
            transparan, dan berdampak sosial secara berkelanjutan.
          </p>
        </div>

        <div className="relative z-10 text-xs text-emerald-300/80">
          © 2026 PantiCare System. All rights reserved.
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div>
            <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase">
              Create Account
            </span>

            <h2 className="text-3xl font-bold text-slate-900 mt-1">
              Buat akun baru
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Daftar untuk mulai menggunakan PantiCare.
            </p>
          </div>

          {message.text && (
            <div
              className={`p-4 rounded-xl text-sm ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap
              </label>

              <input
                type="text"
                required
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email
              </label>

              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>

              <input
                type="password"
                required
                placeholder="Masukkan password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Konfirmasi Password
              </label>

              <input
                type="password"
                required
                placeholder="Ulangi password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-medium rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 text-sm mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                'Memproses...'
              ) : (
                <>
                  Daftar
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="font-semibold text-emerald-700 hover:underline"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}