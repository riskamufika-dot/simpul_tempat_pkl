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
  sort_order?: number;
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
          // Ambil hanya slide milik Beranda (sort_order = 1)
          const homeSlides = data.filter((s: any) => Number(s.sort_order) === 1);
          setSliders(homeSlides.length > 0 ? homeSlides : data);
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
    router.push(
      searchQuery
        ? `/daftar-tempat?search=${encodeURIComponent(searchQuery)}`
        : '/daftar-tempat'
    );
  };

  const currentSlider = sliders[activeSlide];
  const heroImage = currentSlider?.image?.url || currentSlider?.image_url;

  return (
    <section className="relative w-full min-h-[460px] md:min-h-[520px] flex items-center overflow-hidden bg-white">
      {/* Gambar Asli dari Database Strapi */}
      {heroImage && (
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src={heroImage}
            alt={currentSlider?.title || 'Latar Belakang Beranda'}
            fill
            className="object-cover object-center transition-all duration-700 ease-in-out"
            priority
          />
        </div>
      )}

      {/* Konten Teks & Form Pencarian */}
      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-xl text-left space-y-6">
          {/* Badge Tag */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50/90 border border-blue-100 shadow-xs">
            <span className="text-xs font-semibold text-blue-600 tracking-wide">
              Temukan Tempat PKL Terbaik
            </span>
          </div>

          {/* Judul & Deskripsi */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#182752] tracking-tight leading-[1.18]">
              {currentSlider?.title || 'Temukan tempat PKL'}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg font-medium">
              {currentSlider?.subtitle ||
                'Pusat informasi lengkap untuk membantu siswa menemukan tempat PKL yang sesuai minat dan kebutuhan'}
            </p>
          </div>

          {/* Form Pencarian */}
          <form onSubmit={handleSearch} className="pt-2 flex items-center gap-2 max-w-md">
            <div className="relative flex-1">
              {/* Icon PNG Pengganti Emoji */}
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                <Image
                  src="/icons/searchabu.png"
                  alt="Cari"
                  width={18}
                  height={18}
                  className="object-contain"
                />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama tempat, jurusan..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#182752] bg-white shadow-sm text-slate-800 placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              className="bg-[#182752] hover:bg-[#111c3b] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full transition cursor-pointer shadow-sm shrink-0"
            >
              Cari
            </button>
          </form>
        </div>
      </div>

      {/* Indikator Titik Slider */}
      {sliders.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-2">
          {sliders.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeSlide === idx
                  ? 'w-6 bg-[#182752]'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}