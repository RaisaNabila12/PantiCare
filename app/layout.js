import './globals.css';

export const metadata = {
  title: 'PantiCare - Sistem Pengelolaan Panti Asuhan',
  description: 'Aplikasi pengelolaan data anak, donasi, kebutuhan, dan kegiatan panti asuhan.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased text-slate-800 bg-slate-50">{children}</body>
    </html>
  );
}