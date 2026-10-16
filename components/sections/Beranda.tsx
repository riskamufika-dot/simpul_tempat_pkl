'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getHeroSliders } from '@/lib/strapi';

interface SliderItem {
  id: number;
  title?: string;
  subtitle?: string;
  image?: { url: string };
  image_url?: string;
}

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    async function loadSliders() {
      try {
        const data = await getHeroSliders();
        if (Array.isArray(data) && data.length > 0) {
          setSliders(data);
        }
      } catch (err) {
        console.error('Gagal mengambil data hero slider:', err);
      }
    }
    loadSliders();
  }, []);

  useEffect(() => {
    if (sliders.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sliders.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [sliders.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(searchQuery ? `/daftar-tempat?search=${encodeURIComponent(searchQuery)}` : '/daftar-tempat');
  };

  const currentSlider = sliders[activeSlide];
  const heroImage = currentSlider?.image?.url || currentSlider?.image_url;

  return (
    <section className="bg-white py-12 md:py-20 px-4 text-center relative overflow-hidden">
      <div className="container mx-auto max-w-4xl space-y-8 relative z-10">
        {heroImage && (
          <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-2xl overflow-hidden shadow-md mb-6">
            <Image
              src={heroImage}
              alt={currentSlider?.title || 'Banner SIMPUL'}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-white text-left">
              {currentSlider?.title && (
                <h2 className="text-xl md:text-3xl font-bold">{currentSlider.title}</h2>
              )}
              {currentSlider?.subtitle && (
                <p className="text-xs md:text-sm text-gray-200 mt-1">{currentSlider.subtitle}</p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-sky-800 tracking-tight">
            Temukan tempat PKL
          </h1>
          <p className="text-gray-600 text-xs md:text-sm leading-relaxed max-w-lg mx-auto">
            Pusat informasi lengkap untuk membantu siswa menemukan tempat PKL yang sesuai minat dan kebutuhan
          </p>

          <form onSubmit={handleSearch} className="pt-4 flex items-center justify-center gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 text-xs">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama tempat, jurusan..."
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-700 bg-gray-50/50"
              />
            </div>
            <button
              type="submit"
              className="bg-sky-800 hover:bg-sky-900 text-white text-xs font-semibold px-6 py-2.5 rounded-full transition cursor-pointer"
            >
              Cari
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}