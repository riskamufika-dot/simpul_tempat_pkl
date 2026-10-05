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
          <Link href="#daftar-tempat" className="hover:text-white transition-colors">
            Daftar Tempat
          </Link>
          <Link href="#tentang-kami" className="hover:text-white transition-colors">
            Tentang Kami
          </Link>
        </nav>

        {/* CTA Button Bandingkan */}
        <button
          onClick={onOpenCompare}
          className="bg-amber-400 hover:bg-amber-500 text-blue-950 px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition shadow-sm"
        >
          <span>⚖️ Banding</span>
          <span className="bg-amber-500/80 text-blue-950 text-[10px] px-2 py-0.5 rounded-full font-black">
            {compareCount}/2
          </span>
        </button>
      </div>
    </header>
  );
}