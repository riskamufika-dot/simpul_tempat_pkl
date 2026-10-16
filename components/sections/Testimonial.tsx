'use client';

import React, { useState, useEffect } from 'react';
import { getTestimonials } from '@/lib/strapi';

interface TestimonialItem {
  id: number | string;
  name: string;
  company: string;
  feedback: string;
}

export default function Testimonial() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const data = await getTestimonials();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: TestimonialItem[] = data
            .map((t: any) => ({
              id: t.id,
              name: t.full_name || t.name || 'Siswa PKL',
              company: t.company?.name || t.school_name || 'Tempat PKL',
              feedback: t.review || t.content || t.feedback || '',
            }))
            .filter((item) => item.feedback.trim() !== '');

          setTestimonials(mapped);
        }
      } catch (err) {
        console.error('Gagal memuat testimoni:', err);
      }
    }
    loadTestimonials();
  }, []);

  if (testimonials.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev + 2 >= testimonials.length ? 0 : prev + 2
    );
  };

  const displayedItems = testimonials.slice(currentIndex, currentIndex + 2);

  return (
    <section className="bg-white py-24 px-6 sm:px-10 lg:px-16 text-gray-900 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Testimoni Siswa
          </h2>
          <p className="text-gray-700 text-sm sm:text-base font-normal">
            Kata mereka yang sudah melaksanakan PKL
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-300 rounded-2xl p-8 flex flex-col justify-between min-h-[240px] bg-white shadow-sm"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{item.name}</h4>
                    <p className="text-gray-500 text-xs sm:text-sm">{item.company}</p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed font-normal">
                  {item.feedback}
                </p>
              </div>
            ))}
          </div>

          {testimonials.length > 2 && (
            <div className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
              <button
                onClick={handleNext}
                aria-label="Berikutnya"
                className="w-12 h-12 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-100 transition shadow-sm cursor-pointer"
              >
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}