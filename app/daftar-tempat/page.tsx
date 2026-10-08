'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeaderDaftarTempat from '@/components/sections/DaftarTempat';
import FilterTempat from '@/components/catalog/FilterTempat';
import KartuTempatPKL from '@/components/catalog/KartuTempatPKL';
import PopUpDetail from '@/components/modals/PopUpDetail';
import PopUpBandingkan from '@/components/modals/PopUpBandingkan';

export default function DaftarTempatPage() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      <Navbar onOpenCompare={() => setIsCompareOpen(true)} />

      <HeaderDaftarTempat />

      <div className="bg-[#101d42] py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <FilterTempat />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <KartuTempatPKL
              onDetail={() => setIsDetailOpen(true)}
              onToggleCompare={() => setIsCompareOpen(true)}
            />
            <KartuTempatPKL
              onDetail={() => setIsDetailOpen(true)}
              onToggleCompare={() => setIsCompareOpen(true)}
            />
          </div>
        </div>
      </div>

      <Footer />

      {/* Modals */}
      <PopUpDetail isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />
      <PopUpBandingkan isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
    </main>
  );
}