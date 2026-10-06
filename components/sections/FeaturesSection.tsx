"use client";

import React, { useState } from "react";
import Link from "next/link";
import DetailModal from "@/components/modals/DetailModal";
import CompareModal from "@/components/modals/CompareModal";

interface FeatureItem {
  id: number;
  title: string;
  description: string;
  actionText: string;
  href?: string;
  type: "link" | "modal-detail" | "modal-compare";
  icon: React.ReactNode;
}

export default function FeaturesSection() {
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  const features: FeatureItem[] = [
    {
      id: 1,
      title: "Pencarian tempat PKL dengan kata kunci mudah",
      description: "Temukan tempat berdasarkan nama, bidang, atau lokasi",
      actionText: "Cari",
      href: "/daftar-tempat",
      type: "link",
      icon: (
        <svg className="w-8 h-8 text-[#182752]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Filter Jurusan untuk menyaring pilihan sesuai Jurusanmu",
      description: "Pilih Jurusan RPL, MPLB dan Lainnya",
      actionText: "Filter",
      href: "/daftar-tempat?filter=jurusan",
      type: "link",
      icon: (
        <svg className="w-8 h-8 text-[#182752]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Detail lokasi lengkap dengan alamat dan peta",
      description: "Lihat lokasi tempat PKL secara jelas dan akurat",
      actionText: "Lokasi",
      type: "modal-detail",
      icon: (
        <svg className="w-8 h-8 text-[#182752]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Perbandingan tempat untuk menimbang pilihan terbaik",
      description: "Bandingkan beberapa tempat PKL dalam satu tampilan",
      actionText: "Bandingkan",
      href: "/perbandingan",
      type: "link",
      icon: (
        <svg className="w-8 h-8 text-[#182752]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <section className="bg-[#182752] py-20 px-6 sm:px-10 lg:px-16 text-white w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
              Semua yang Anda butuhkan
            </h2>
            <p className="text-gray-300 text-sm sm:text-base font-normal">
              Fitur utama untuk memudahkan pencarian tempat PKL Anda
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item) => {
              const cardInner = (
                <>
                  <div>
                    <div className="mb-6">{item.icon}</div>
                    <h3 className="text-xl sm:text-2xl font-bold leading-snug mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-2 font-semibold text-sm text-[#182752] group-hover:gap-3 transition-all duration-200">
                    <span>{item.actionText}</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </>
              );

              const cardClasses =
                "group bg-[#eaedf2] hover:bg-white text-[#182752] rounded-2xl p-7 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 min-h-[320px] text-left";

              if (item.type === "modal-detail") {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIsDetailOpen(true)}
                    className={`${cardClasses} cursor-pointer`}
                  >
                    {cardInner}
                  </button>
                );
              }

              if (item.type === "modal-compare") {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIsCompareOpen(true)}
                    className={`${cardClasses} cursor-pointer`}
                  >
                    {cardInner}
                  </button>
                );
              }

              return (
                <Link key={item.id} href={item.href || "#"} className={cardClasses}>
                  {cardInner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal Components */}
      <DetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />
      <CompareModal isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
    </>
  );
}