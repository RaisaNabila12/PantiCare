'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Camera,
  Pencil,
  Save,
  X,
  UserRound,
  Mail,
  Phone,
  MapPin,
  Building2,
} from 'lucide-react';

const emptyProfile = {
  nama: '',
  email: '',
  telepon: '',
  alamat: '',
  panti: '',
};

export default function ProfilPage() {
  const [role, setRole] = useState('admin');
  const [form, setForm] = useState(emptyProfile);
  const [photo, setPhoto] = useState('');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    const r = localStorage.getItem('panticare_role') || 'admin';
    setRole(r);

    const u = JSON.parse(localStorage.getItem('panticare_user') || '{}');
    const stored = JSON.parse(
      localStorage.getItem('panticare_profil_' + r) || '{}'
    );

    setForm({
      nama:
        stored.nama ||
        u.name ||
        (r === 'admin' ? 'Admin PantiCare' : 'Pengguna PantiCare'),
      email:
        stored.email ||
        u.email ||
        (r === 'admin' ? 'admin@panticare.org' : ''),
      telepon: stored.telepon || '',
      alamat:
        stored.alamat ||
        (r === 'admin' ? 'Jl. Merdeka No. 45, Banda Aceh' : ''),
      panti:
        stored.panti ||
        (r === 'admin' ? 'Panti Asuhan Kasih Bunda' : ''),
    });

    setPhoto(localStorage.getItem('panticare_foto_' + r) || '');
  }, []);

  const fields = [
    ['nama', 'Nama Lengkap'],
    ['email', 'Email'],
    ['telepon', 'Nomor Telepon'],
    ['alamat', 'Alamat'],
    ...(role === 'admin' ? [['panti', 'Nama Panti Asuhan']] : []),
  ];

  function submit(e) {
    e.preventDefault();

    localStorage.setItem(
      'panticare_profil_' + role,
      JSON.stringify(form)
    );

    localStorage.setItem(
      'panticare_user',
      JSON.stringify({ name: form.nama, email: form.email })
    );

    setEditing(false);
    setSaved(true);
  }

  function uploadPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError('');

    if (!file.type.startsWith('image/')) {
      setPhotoError('Pilih file gambar seperti JPG atau PNG.');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setPhotoError('Ukuran foto maksimal 3 MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        localStorage.setItem('panticare_foto_' + role, reader.result);
        setPhoto(reader.result);
        setSaved(true);
      } catch {
        setPhotoError(
          'Foto terlalu besar untuk penyimpanan browser. Coba gambar yang lebih kecil.'
        );
      }
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function removePhoto() {
    localStorage.removeItem('panticare_foto_' + role);
    setPhoto('');
    setSaved(true);
  }

  const initials = (form.nama || 'P')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((x) => x[0])
    .join('')
    .toUpperCase();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Profil {role === 'admin' ? 'Admin' : 'Pengguna'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Informasi akun dan identitas profil Anda.
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-emerald-700 to-teal-500" />

        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
            <div className="relative">
              {photo ? (
                <img
                  src={photo}
                  alt="Foto profil"
                  className="h-24 w-24 rounded-full border-4 border-white bg-white object-cover shadow"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-emerald-100 text-2xl font-bold text-emerald-800 shadow">
                  {initials}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                aria-label="Pasang foto profil"
                title="Pasang atau ubah foto profil"
                className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-emerald-600 p-2 text-white shadow hover:bg-emerald-700"
              >
                <Camera size={16} />
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={uploadPhoto}
              />
            </div>

            {!editing && (
              <button
                onClick={() => {
                  setSaved(false);
                  setEditing(true);
                }}
                className="mb-1 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                <Pencil size={16} />
                Edit Profil
              </button>
            )}
          </div>

          <div className="mt-3">
            <h2 className="text-xl font-bold text-slate-900">
              {form.nama || 'Nama belum diatur'}
            </h2>
            <p className="text-sm text-slate-500">
              {role === 'admin' ? 'Pengurus Panti' : 'Donatur'} · {form.email}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => fileRef.current?.click()}
              className="text-sm font-semibold text-emerald-700 hover:underline"
            >
              {photo ? 'Ganti foto profil' : 'Pasang foto profil'}
            </button>

            {photo && (
              <button
                onClick={removePhoto}
                className="text-sm text-rose-600 hover:underline"
              >
                Hapus foto
              </button>
            )}
          </div>

          {photoError && (
            <p className="mt-2 text-sm text-rose-600" role="alert">
              {photoError}
            </p>
          )}
        </div>
      </section>

      {editing ? (
        <form
          onSubmit={submit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Edit Informasi Profil
            </h3>

            <button
              type="button"
              onClick={() => setEditing(false)}
              aria-label="Batal edit"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>

          {fields.map(([key, label]) => (
            <div key={key}>
              <label
                htmlFor={key}
                className="mb-1 block text-sm font-semibold text-slate-700"
              >
                {label}
              </label>

              <input
                id={key}
                type={key === 'email' ? 'email' : 'text'}
                required={key === 'nama' || key === 'email'}
                value={form[key]}
                onChange={(e) => {
                  setForm({ ...form, [key]: e.target.value });
                  setSaved(false);
                }}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <Save size={16} />
              Simpan Perubahan
            </button>

            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
          </div>
        </form>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-5 text-lg font-bold text-slate-900">
            Informasi Pribadi
          </h3>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              [UserRound, 'Nama Lengkap', form.nama],
              [Mail, 'Email', form.email],
              [Phone, 'Nomor Telepon', form.telepon],
              [MapPin, 'Alamat', form.alamat],
              ...(role === 'admin'
                ? [[Building2, 'Nama Panti Asuhan', form.panti]]
                : []),
            ].map(([Icon, label, value]) => (
              <div key={label} className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500">
                    {label}
                  </p>
                  <p className="break-words text-sm font-semibold text-slate-800">
                    {value || 'Belum diisi'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {saved && (
        <p role="status" className="text-sm font-medium text-emerald-700">
          Perubahan profil berhasil disimpan di browser ini.
        </p>
      )}
    </div>
  );
}