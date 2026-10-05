'use client';

import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <div>
        <Navbar compareCount={0} />
        <main>
          <HeroSection />
        </main>
      </div>
      <Footer />
    </div>
  );
}