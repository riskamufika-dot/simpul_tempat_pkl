"use client";

import React from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";

export default function TentangKamiPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <section className="flex-grow w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-12 flex flex-col justify-center">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="p-2.5 rounded-full hover:bg-slate-100 transition inline-flex items-center text-slate-700 hover:text-slate-900 group"
            aria-label="Kembali"
          >
            <svg
              className="w-7 h-7 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Logo Graphic */}
          <div className="md:col-span-5 flex justify-center items-center py-4">
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 flex items-center justify-center">
              <Image
                src="/logo TP.png"
                alt="SIMPUL Logo"
                width={320}
                height={320}
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </div>

          {/* Right Text Content */}
          <div className="md:col-span-7 space-y-5 text-slate-800">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
              Tentang Kami
            </h1>

            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 pt-1">
              Apa itu SIMPUL?
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              <p>
                <strong className="font-semibold text-slate-900">
                  SIMPUL (Sistem Informasi Magang & Pilihan Untuk Lapangan)
                </strong>{" "}
                adalah platform informasi yang membantu siswa menemukan dan mengenal berbagai pilihan tempat Praktik Kerja Lapangan (PKL) dengan lebih mudah.
              </p>

              <p>
                Kami menyediakan informasi mengenai tempat PKL, bidang yang tersedia, lokasi, persyaratan, serta informasi lainnya yang dapat membantu siswa dalam menentukan pilihan sesuai dengan kebutuhan dan minat mereka.
              </p>

              <p>
                Melalui SIMPUL, siswa tidak perlu mencari informasi tempat PKL dari berbagai sumber secara terpisah. Semua informasi dapat ditemukan dalam satu platform sehingga proses mencari dan mempertimbangkan tempat PKL menjadi lebih mudah, terarah, dan informatif.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

