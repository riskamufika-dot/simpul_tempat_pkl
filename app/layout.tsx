import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Merriweather } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const merriweather = Merriweather({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tempat PKL - Cari & Bandingkan Tempat PKL',
  description: 'Pusat informasi lengkap untuk membantu siswa menemukan tempat PKL yang sesuai minat dan kebutuhan.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${merriweather.variable}`}>
      <body className="font-sans bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}