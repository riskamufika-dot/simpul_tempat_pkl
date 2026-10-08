'use client';

import Link from 'next/link';
import Image from 'next/image';

interface NavbarProps {
  compareCount?: number;
  onOpenCompare?: () => void;
}

export default function Navbar({ compareCount = 0, onOpenCompare }: NavbarProps) {
  return (
    <header className="bg-blue-950 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo TP.png"
            alt="Tempat PKL Logo"
            width={70}
            height={70}
            className="h-auto object-contain"
          />
          <span className="font-bold text-lg tracking-tight text-white">Tempat PKL</span>
        </Link>

        {/* Navigation Menu (Font Merriweather) */}
        <nav className="hidden md:flex items-center gap-10 font-serif text-sm text-gray-200">
          <Link href="/" className="hover:text-white transition-colors">
            Beranda
          </Link>
          <Link href="/daftar-tempat" className="hover:text-white transition-colors">
            Daftar Tempat
          </Link>
          <Link href="/tentang-kami" className="hover:text-white transition-colors">
            Tentang Kami
          </Link>
        </nav>

        {/* CTA Button Bandingkan */}
        <button
          onClick={onOpenCompare}
          className="border border-white/80 hover:bg-white/10 text-white px-4 py-2 rounded-full text-sm font-serif flex items-center gap-2.5 transition shadow-sm"
          >
          <span className="flex items-center gap-1.5">
            ⚖️ Banding
          </span>
          <span className="border border-white/80 text-white text-[11px] px-2.5 py-0.5 rounded-full font-serif">
            {compareCount}/2
          </span>
        </button>
      </div>
    </header>
  );
}