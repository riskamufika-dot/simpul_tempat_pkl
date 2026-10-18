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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
   <section className="relative flex min-h-[340px] w-full items-center overflow-hidden bg-white sm:min-h-[400px] md:min-h-[520px]">
      {/* Foto: blok di atas (HP), latar penuh (tablet ke atas) */}
      {heroImage && (
       <div className="pointer-events-none absolute inset-0 z-0 select-none">
          <Image
            src={heroImage}
            alt={currentSlider?.title || 'Latar Belakang Beranda'}
            fill
            sizes="100vw"
           className="object-cover object-[75%_center] transition-all duration-700 ease-in-out md:object-center"
            priority
          />
        </div>
      )}

      <div className="absolute inset-0 z-[1] bg-linear-to-r from-white/95 via-white/70 to-white/10 md:hidden" />

      {/* Teks & pencarian */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 md:py-20 lg:px-8">
  <div className="max-w-[16rem] space-y-3 text-left sm:max-w-xl sm:space-y-6">
          <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50/90 px-3 py-1 shadow-xs sm:px-4 sm:py-1.5">
            <span className="text-[11px] font-semibold tracking-wide text-blue-600 sm:text-xs">
              Temukan Tempat PKL Terbaik
            </span>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-xl font-extrabold leading-tight tracking-tight text-[#182752] sm:text-4xl md:text-5xl md:leading-[1.18]">
              {currentSlider?.title || 'Temukan tempat PKL'}
            </h1>
            <p className="max-w-lg text-[11px] font-medium leading-relaxed text-slate-600 sm:text-sm md:text-base">
              {currentSlider?.subtitle ||
                'Pusat informasi lengkap untuk membantu siswa menemukan tempat PKL yang sesuai minat dan kebutuhan'}
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex max-w-md items-center gap-2 pt-1">
            <div className="relative min-w-0 flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
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
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#182752] sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 cursor-pointer rounded-full bg-[#182752] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#111c3b] sm:px-6 sm:text-sm"
            >
              Cari
            </button>
          </form>
        </div>
      </div>

      {/* Titik slider */}
      {sliders.length > 1 && (
        <div className="absolute left-1/2 top-48 z-20 flex -translate-x-1/2 items-center justify-center gap-2 sm:top-64 md:bottom-4 md:top-auto">
          {sliders.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlide(idx)}
              className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
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