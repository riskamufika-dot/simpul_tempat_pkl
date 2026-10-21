'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getTestimonials } from '@/lib/strapi';

interface TestimonialItem {
  id: number | string;
  name: string;
  company: string;
  feedback: string;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't-1',
    name: 'Rizki Pratama',
    company: 'PT Telkom Indonesia (Witel Sumedang)',
    feedback:
      'Pengalaman PKL di Telkom sangat membuka wawasan saya tentang dunia IT industri. Banyak ilmu baru tentang jaringan komputer dan pemeliharaan sistem yang saya pelajari langsung dari para profesional.',
  },
  {
    id: 't-2',
    name: 'Siti Nurhaliza',
    company: 'Diskominfo Kab. Sumedang',
    feedback:
      'Lingkungan kerjanya sangat suportif dan ramah untuk siswa SMK. Kami dibimbing langsung dalam pengelolaan sistem informasi dan pelayanan publik berbasis digital.',
  },
  {
    id: 't-3',
    name: 'Ahmad Fauzi',
    company: 'Bank BJB Cabang Sumedang',
    feedback:
      'Sangat cocok untuk jurusan AKL dan MPLB. Saya belajar langsung tentang alur pembukuan, pengarsipan berkas resmi, dan etika komunikasi profesional di kantor.',
  },
  {
    id: 't-4',
    name: 'Dina Lestari',
    company: 'Yogya Grand Sumedang',
    feedback:
      'Bagi jurusan Pemasaran, PKL di sini melatih mental pelayanan prima, display produk, dan manajemen stok secara nyata. Sangat direkomendasikan!',
  },
];

export default function Testimonial() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS);
  const [aktif, setAktif] = useState(0);
  const [bisaKiri, setBisaKiri] = useState(false);
  const [bisaKanan, setBisaKanan] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const data = await getTestimonials();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: TestimonialItem[] = data
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((t: any) => ({
              id: t.id,
              name: t.full_name || t.name || 'Siswa PKL',
              company: t.company?.name || t.school_name || 'Tempat PKL',
              feedback: t.review || t.content || t.feedback || '',
            }))
            .filter((item) => item.feedback.trim() !== '');

          if (mapped.length > 0) {
            setTestimonials(mapped);
          }
        }
      } catch (err) {
        console.error('Gagal memuat testimoni:', err);
      }
    }
    loadTestimonials();
  }, []);

  // Perbarui status tombol dan titik sesuai posisi geser
  const perbarui = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maks = el.scrollWidth - el.clientWidth;
    setBisaKiri(el.scrollLeft > 4);
    setBisaKanan(el.scrollLeft < maks - 4);

    const kartu = el.children[0] as HTMLElement | undefined;
    if (kartu) {
      const langkah = kartu.offsetWidth + 16;
      setAktif(Math.round(el.scrollLeft / langkah));
    }
  }, []);

  useEffect(() => {
    perbarui();
    window.addEventListener('resize', perbarui);
    return () => window.removeEventListener('resize', perbarui);
  }, [testimonials, perbarui]);

  if (testimonials.length === 0) return null;

  const geser = (arah: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const kartu = el.children[0] as HTMLElement | undefined;
    const langkah = kartu ? (kartu.offsetWidth + 16) * 2 : el.clientWidth;
    el.scrollBy({ left: arah * langkah, behavior: 'smooth' });
  };

  const keKartu = (i: number) => {
    const el = trackRef.current;
    const kartu = el?.children[0] as HTMLElement | undefined;
    if (!el || !kartu) return;
    el.scrollTo({ left: i * (kartu.offsetWidth + 16), behavior: 'smooth' });
  };

  return (
    <section className="bg-white py-12 sm:py-24 px-4 sm:px-10 lg:px-16 text-gray-900 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2 sm:mb-4">
            Testimoni Siswa
          </h2>
          <p className="text-gray-700 text-xs sm:text-base font-normal">
            Kata mereka yang sudah melaksanakan PKL
          </p>
        </div>

        <div className="relative">
          {/* Baris yang bisa digeser */}
          <div
            ref={trackRef}
            onScroll={perbarui}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="snap-start shrink-0 grow-0 basis-[calc(50%-8px)] w-[calc(50%-8px)] min-w-0 max-w-[calc(50%-8px)] border border-gray-300 rounded-2xl p-4 sm:p-8 flex flex-col h-[220px] sm:h-[260px] bg-white shadow-sm overflow-hidden"
              >
                <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-xs sm:text-base truncate">{item.name}</h4>
                    <p className="text-gray-500 text-[10px] sm:text-sm truncate">{item.company}</p>
                  </div>
                </div>

                <p className="text-gray-700 text-[11px] sm:text-sm leading-relaxed font-normal line-clamp-6 sm:line-clamp-5 break-words">
  {item.feedback}
</p>
              </div>
            ))}
          </div>

          {/* Tombol panah (laptop) */}
          {testimonials.length > 2 && (
            <>
              <button
                onClick={() => geser(-1)}
                disabled={!bisaKiri}
                aria-label="Sebelumnya"
                className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-gray-300 bg-white items-center justify-center hover:bg-gray-100 transition shadow-sm cursor-pointer disabled:opacity-30 disabled:cursor-default"
              >
                <svg className="w-5 h-5 text-gray-800 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <button
                onClick={() => geser(1)}
                disabled={!bisaKanan}
                aria-label="Berikutnya"
                className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-gray-300 bg-white items-center justify-center hover:bg-gray-100 transition shadow-sm cursor-pointer disabled:opacity-30 disabled:cursor-default"
              >
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Titik penanda posisi */}
        {testimonials.length > 2 && (
          <div className="mt-4 flex justify-center gap-2">
            {testimonials.slice(0, testimonials.length - 1).map((_, i) => (
              <button
                key={i}
                onClick={() => keKartu(i)}
                aria-label={`Testimoni ${i + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === aktif ? 'w-6 bg-[#182752]' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}