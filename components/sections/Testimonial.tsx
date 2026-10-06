"use client";

import React, { useState } from "react";

interface TestimonialItem {
  id: number;
  name: string;
  company: string;
  feedback: string;
}

const testimonialsData: TestimonialItem[] = [
  {
    id: 1,
    name: "Rizky Pratama",
    company: "PT Sawarga Digital Indonesia",
    feedback:
      '"Awalnya sempet deg-degan pas mau PKL di sini, eh ternyata malah makin gak mau pulang pas udah kelar 😭. Timnya seru-seru, tempatnya kondusif, dan yang paling penting: beneran dibimbing tanpa bikin pressure. Thank you PT Sawarga Digital Indonesia for the core memory and valuable lessons!."',
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    company: "PT SAWALA Inovasi",
    feedback:
      '"PKL di PT SAWALA tuh bener-bener 10/10! 🌟 Lingkungannya super welcoming, mentornya baik dan telaten banget ngajarin dari nol, plus vibe kerjanya yang seru bikin gak ngerasa \'kultur syok\' sama dunia kerja. Suasana kerjanya asik, tapi tetep dapet banyak insight baru yang bermanfaat banget!."',
  },
  {
    id: 3,
    name: "Ahmad Fauzi",
    company: "PT Solusi Teknologi",
    feedback:
      '"Pengalaman magang yang sangat berharga! Fasilitas lengkap dan mentor selalu siap membantu ketika menemukan kesulitan teknis."',
  },
  {
    id: 4,
    name: "Nabila Putri",
    company: "PT Inovasi Cipta",
    feedback:
      '"Banyak ilmu baru seputar alur kerja industri profesional dan budaya kerja kolaboratif. Sangat direkomendasikan!"',
  },
];

export default function Testimonial() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev + 2 >= testimonialsData.length ? 0 : prev + 2
    );
  };

  const displayedItems = testimonialsData.slice(currentIndex, currentIndex + 2);

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
                className="border border-gray-400/80 rounded-sm p-8 flex flex-col justify-between min-h-[300px] bg-white"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{item.name}</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">{item.company}</p>
                  </div>
                </div>

                <p className="text-gray-800 text-sm sm:text-[15px] leading-relaxed font-normal">
                  {item.feedback}
                </p>
              </div>
            ))}
          </div>

          <div className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
            <button
              onClick={handleNext}
              aria-label="Berikutnya"
              className="w-12 h-12 rounded-full border border-gray-400 bg-white flex items-center justify-center hover:bg-gray-100 transition shadow-sm cursor-pointer"
            >
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            onClick={() => setCurrentIndex(0)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === 0 ? "bg-black w-2.5 h-2.5" : "bg-gray-300"
            }`}
          />
          <button
            onClick={() => setCurrentIndex(2)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex !== 0 ? "bg-black w-2.5 h-2.5" : "bg-gray-300"
            }`}
          />
        </div>
      </div>
    </section>
  );
}