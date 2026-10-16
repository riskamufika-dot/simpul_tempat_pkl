'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCompare } from '@/components/layout/DaftarPerbandingan';

interface NavbarProps {
  compareCount?: number;
  onOpenCompare?: () => void;
}

const menu = [
  { label: 'Beranda', href: '/' },
  { label: 'Daftar Tempat', href: '/daftar-tempat' },
  { label: 'Tentang Kami', href: '/tentang-kami' },
];

// sesudah
export default function Navbar(_props: NavbarProps) {
  const { terpilih, openCompare } = useCompare();
  const compareCount = terpilih.length;
  const onOpenCompare = openCompare;
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Tutup sidebar saat pindah halaman
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Kunci scroll halaman saat sidebar terbuka + tutup dengan tombol Esc
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const aktif = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const tombolBanding = (
    <button
      onClick={() => {
        setOpen(false);
        onOpenCompare?.();
      }}
      className="flex items-center gap-2 rounded-full border border-white/80 px-3 py-2 font-serif text-sm text-white shadow-sm transition hover:bg-white/10 sm:gap-2.5 sm:px-4"
    >
      <div className="flex items-center gap-1.5">
      <img 
        src="/icons/banding.png" 
        alt="Bandingkan" 
        className="h-4 w-4 object-contain" 
      />
      <span> Banding</span>
      </div>
      <span className="rounded-full border border-white/80 px-2 py-0.5 text-[11px]">
        {compareCount}/2
      </span>
    </button>
  );

  return (
    <header className="sticky top-0 z-50 bg-blue-950 text-white shadow-md">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-2 px-4 py-2 sm:px-6 lg:h-20 lg:py-0">
        {/* Logo */}
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 md:flex-none">
          <Image
            src="/logo TP.png"
            alt="Tempat PKL Logo"
            width={70}
            height={70}
            className="h-9 w-auto shrink-0 object-contain sm:h-12 lg:h-14"
          />
          <div className="flex min-w-0 flex-col items-start">
            <span className="text-lg font-bold tracking-tight text-white sm:text-xl">
              SIMPUL
            </span>
            {/* Teks boleh turun baris di layar kecil, tidak dipotong */}
            <span className="block text-[8px] leading-tight text-blue-200 sm:text-[9px] lg:text-[10px]">
              Sistem Informasi Magang &amp; Penempatan Lapangan
            </span>
          </div>
        </Link>

        {/* Menu desktop / tablet */}
        <nav className="hidden items-center gap-6 font-serif text-sm md:flex lg:gap-10">
          {menu.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`transition-colors hover:text-white ${
                aktif(m.href)
                  ? 'border-b-2 border-white pb-0.5 text-white'
                  : 'text-gray-200'
              }`}
            >
              {m.label}
            </Link>
          ))}
        </nav>

        {/* Kanan: tombol banding (desktop) + banding ringkas & hamburger (HP) */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="hidden md:block">{tombolBanding}</div>

          <button
            onClick={onOpenCompare}
            className="flex items-center gap-1.5 rounded-full border border-white/80 px-2.5 py-1.5 text-xs md:hidden"
            aria-label="Buka perbandingan"
          >
            ⚖️
            <span className="rounded-full border border-white/80 px-1.5 text-[10px]">
              {compareCount}/2
            </span>
          </button>

          <button
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/10 md:hidden"
            aria-label="Buka menu"
            aria-expanded={open}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Latar gelap di belakang sidebar */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden
      />

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-72 max-w-[85%] flex-col bg-blue-950 shadow-2xl transition-transform duration-300 md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Menu navigasi"
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <span className="text-lg font-bold">SIMPUL</span>
          <button
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-xl hover:bg-white/10"
            aria-label="Tutup menu"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4 font-serif">
          {menu.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`rounded-xl px-4 py-3 text-base transition ${
                aktif(m.href)
                  ? 'bg-white/15 font-semibold text-white'
                  : 'text-gray-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              {m.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">{tombolBanding}</div>
      </aside>
    </header>
  );
}