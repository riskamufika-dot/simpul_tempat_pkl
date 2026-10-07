'use client';

import { useState } from 'react';

// Layout
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Komponen Halaman Beranda
import HeaderBeranda from '@/components/sections/Beranda'; // "Temukan tempat PKL"
import FiturUtama from '@/components/sections/FiturUtama';       // "Semua yang Anda butuhkan"
import LangkahPKL from '@/components/sections/Langkah';     // "Cari tempat PKL yang sesuai..."
import KategoriJurusan from '@/components/sections/KategoriJurusan'; // "Kategori Jurusan PKL"
import Testimonial from '@/components/sections/Testimonial';         // "Testimoni Siswa"

// Modals
import PopUpDetail from '@/components/modals/PopUpDetail';
import PopUpBandingkan from '@/components/modals/PopUpBandingkan';

export default function Home() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      <Navbar onOpenCompare={() => setIsCompareOpen(true)} />

      <section id="beranda">
        <HeaderBeranda />
        <FiturUtama />
        <LangkahPKL />
        <KategoriJurusan />
        <Testimonial />
      </section>

      <Footer />

      {/* Modals */}
      <PopUpDetail isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />
      <PopUpBandingkan isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
    </main>
  );
}