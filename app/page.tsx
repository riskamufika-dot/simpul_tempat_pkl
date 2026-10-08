'use client';

import { useState } from 'react';

// Layout
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Komponen Halaman Beranda
import HeaderBeranda from '@/components/sections/Beranda';
import FiturUtama from '@/components/sections/FiturUtama';
import LangkahPKL from '@/components/sections/Langkah';
import KategoriJurusan from '@/components/sections/KategoriJurusan';
import Testimonial from '@/components/sections/Testimonial';

// Modals
import PopUpBandingkan from '@/components/modals/PopUpBandingkan';

export default function Home() {
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

      <PopUpBandingkan
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        items={[]}
      />
    </main>
  );
}