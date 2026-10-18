import React from "react";
import Image from "next/image";

interface StepItem {
  number: string;
  badge: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
}

const stepsData: StepItem[] = [
  {
    number: "01",
    badge: "Cari Tempat",
    title: "Cari tempat PKL yang sesuai dengan minat Anda",
    description:
      "Gunakan kata kunci atau jelajahi daftar tempat yang tersedia. Pilih bidang yang Anda inginkan.",
    imageSrc: "/images/langkah1.jpeg",
    imageAlt: "Suasana kantor",
    reverse: false,
  },
  {
    number: "02",
    badge: "Baca Detail",
    title: "Baca detail lengkap setiap tempat PKL",
    description:
      "Lihat gambaran tempat, kegiatan, bidang, dan lokasi. Pahami apa yang akan Anda kerjakan.",
    imageSrc: "/images/langkah2.jpeg",
    imageAlt: "Detail laptop",
    reverse: true,
  },
  {
    number: "03",
    badge: "Bandingkan Pilihan",
    title: "Bandingkan beberapa tempat PKL sekaligus",
    description:
      "Gunakan fitur perbandingan untuk melihat kelebihan dan kekurangan setiap tempat secara berdampingan.",
    imageSrc: "/images/langkah3.jpeg",
    imageAlt: "Ruang komputer",
    reverse: false,
  },
  {
    number: "04",
    badge: "Tentukan Pilihan",
    title: "Tentukan tempat PKL yang paling sesuai",
    description:
      "Setelah membandingkan, pilih tempat yang paling cocok dengan minat dan kebutuhan Anda. Siapkan dokumen.",
    imageSrc: "/images/langkah4.jpeg",
    imageAlt: "Memilih tempat",
    reverse: true,
  },
];

export default function StepsSection() {
  return (
    <section className="bg-white py-20 px-6 sm:px-10 lg:px-16 text-gray-900 w-full overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
        {/* Header Bagian Panduan */}
        <div className="text-center max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-blue-950 leading-tight whitespace-normal sm:whitespace-nowrap">
            Panduan Menemukan Tempat PKL
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-gray-500 font-normal leading-relaxed max-w-xl mx-auto">
            Ikuti langkah praktis berikut untuk menemukan tempat magang terbaik sesuai keahlian Anda
          </p>
        </div>

        <div className="space-y-20 sm:space-y-28">
          {stepsData.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col gap-10 lg:gap-16 items-center ${
                step.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
              }`}
            >
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0066cc] mb-4">
                  <span>{step.number}</span>
                  <span>{step.badge}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-4 leading-snug">
                  {step.title}
                </h3>

                <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-lg">
                  {step.description}
                </p>
              </div>

              <div className="w-full lg:w-1/2">
                <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <Image
                    src={step.imageSrc}
                    alt={step.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}