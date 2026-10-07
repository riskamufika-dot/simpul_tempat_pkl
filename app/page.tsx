'use client';

import { useState } from 'react';

// Layout
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Komponen Halaman Beranda (Kiri)
import HeaderBeranda from '@/components/sections/Beranda'; // "Temukan tempat PKL"
import FiturUtama from '@/components/sections/FiturUtama';       // "Semua yang Anda butuhkan"
import LangkahPKL from '@/components/sections/Langkah';     // "Cari tempat PKL yang sesuai..."

// Komponen Halaman Daftar Tempat (Kanan)
import HeaderDaftarTempat from '@/components/sections/DaftarTempat'; // "Cari & Bandingkan..."
import FilterTempat from '@/components/catalog/FilterTempat';             // Filter
import KartuTempatPKL from '@/components/catalog/KartuTempatPKL';         // Kartu PT

// Modals
import PopUpDetail from '@/components/modals/PopUpDetail';
import PopUpBandingkan from '@/components/modals/PopUpBandingkan';

export default function Home() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      <Navbar onOpenCompare={() => setIsCompareOpen(true)} />

      {/* ==================== 1. BAGIAN BERANDA (SEBELAH KIRI) ==================== */}
      <section id="beranda">
        <HeaderBeranda />
        <FiturUtama />
        <LangkahPKL />
      </section>

      {/* ==================== 2. BAGIAN DAFTAR TEMPAT (SEBELAH KANAN) ==================== */}
      <section id="daftar-tempat" className="pt-10">
        {/* Header Khusus Daftar Tempat */}
        <HeaderDaftarTempat />

      
      </section>

      <Footer />

      {/* Modals */}
      <PopUpDetail isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />
      <PopUpBandingkan isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
    </main>
  );
}