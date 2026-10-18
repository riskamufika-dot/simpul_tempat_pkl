"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getAppInfo } from "@/lib/strapi";

interface AppInfoData {
  title?: string;
  content?: string;
  logo?: {
    url?: string;
  };
}

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://simpul-production.up.railway.app";

export default function TentangKamiPage() {
  const [appInfo, setAppInfo] = useState<AppInfoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAppInfo() {
      try {
        const data = await getAppInfo();
        setAppInfo(data);
      } catch (error) {
        console.error("Gagal memuat info aplikasi:", error);
      } finally {
        setLoading(false);
      }
    }
    loadAppInfo();
  }, []);

  const logoUrl = appInfo?.logo?.url
    ? appInfo.logo.url.startsWith("http")
      ? appInfo.logo.url
      : `${STRAPI_URL}${appInfo.logo.url}`
    : "/logo TP.png";

  return (
    <main className="min-h-screen bg-[#0b132b] text-white">
      <Navbar />

     {/* --- HERO SECTION --- */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-20 text-center">
        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="mx-auto h-20 w-20 rounded-full bg-slate-800" />
            <div className="mx-auto h-10 w-3/4 max-w-xl rounded bg-slate-800" />
            <div className="mx-auto h-16 w-full max-w-2xl rounded bg-slate-800" />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Logo Apps */}
            <div className="relative mb-4 h-20 w-20">
              <Image
                src={logoUrl}
                alt="Logo SIMPUL"
                fill
                className="object-contain"
                priority
              />
            </div>

            <span className="mb-2 text-xs font-semibold tracking-widest text-blue-400 uppercase">
              TENTANG KAMI
            </span>

            {/* Judul & Tagline Terpisah Rapi */}
            <h1 className="mb-6 text-3xl font-extrabold text-white sm:text-5xl leading-tight">
              SIMPUL <br />
              <span className="text-blue-400">
                {appInfo?.title?.includes("-")
                  ? appInfo.title.split("-")[1].trim()
                  : "Satu Simpul, Banyak Peluang"}
              </span>
            </h1>

            {/* Deskripsi */}
            <p className="max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {appInfo?.content ||
                "SIMPUL (Sistem Informasi Magang & Pilihan untuk Lapangan) adalah platform yang membantu siswa menemukan dan membandingkan tempat PKL berdasarkan bidang, lokasi, dan persyaratan. Dengan informasi yang terpusat, SIMPUL memudahkan siswa memilih tempat PKL yang sesuai dengan jurusan, kebutuhan, dan minat mereka."}
            </p>
          </div>
        )}
      </section>

      {/* --- SECTION: MENGAPA SIMPUL DIBUAT? --- */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Teks Kiri */}
          <div className="lg:col-span-5">
            <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
              MENGAPA SIMPUL DIBUAT?
            </span>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl leading-snug">
              Mencari Tempat PKL Jadi Lebih Mudah
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              Siswa sering kesulitan menemukan informasi tempat PKL karena informasi yang tersebar di berbagai sumber, sulit menyesuaikan dengan jurusan, dan harus membandingkan banyak pilihan secara manual. SIMPUL hadir untuk mengatasi masalah tersebut dengan menyediakan semua informasi dalam satu platform.
            </p>
          </div>

          {/* Kartu Fitur Kanan */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {/* Card 1 */}
            <div className="rounded-2xl border border-slate-700/60 bg-[#121e3d] p-6 transition hover:border-blue-500/50">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/30">
                <img src="/icons/database.png" alt="Informasi Terpusat" className="h-5 w-5 object-contain" />
              </div>
              <h3 className="text-base font-semibold text-white">Informasi Terpusat</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Semua informasi tempat PKL dalam satu platform, lebih praktis dan mudah diakses.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-slate-700/60 bg-[#121e3d] p-6 transition hover:border-blue-500/50">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/30">
                <img src="/icons/graduation.png" alt="Sesuai Jurusan" className="h-5 w-5 object-contain" />
              </div>
              <h3 className="text-base font-semibold text-white">Sesuai Jurusan</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Membantu siswa menemukan tempat PKL yang sesuai dengan jurusan dan bidang keahlian.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-slate-700/60 bg-[#121e3d] p-6 sm:col-span-2 transition hover:border-blue-500/50">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/30">
                <img src="/icons/pause.png" alt="Mudah Dibandingkan" className="h-5 w-5 object-contain" />
              </div>
              <h3 className="text-base font-semibold text-white">Mudah Dibandingkan</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Memudahkan siswa membandingkan beberapa pilihan berdasarkan lokasi, bidang, dan informasi lainnya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION: TUJUAN KAMI --- */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Teks Kiri */}
          <div className="lg:col-span-5">
            <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
              TUJUAN KAMI
            </span>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl leading-snug">
              Membantu Siswa Menentukan Pilihan PKL
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              SIMPUL hadir dengan tujuan untuk memudahkan siswa SMK dalam mencari, memilih, dan membandingkan tempat PKL, serta menyediakan informasi yang lengkap dan terpercaya dalam satu platform.
            </p>
          </div>

          {/* Grid 4 Poin Kanan */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {/* Poin 1 */}
            <div className="flex items-start gap-4 rounded-xl border border-slate-800 bg-[#101935] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600/20">
                <img src="/icons/search.png" alt="Pencarian" className="h-5 w-5 object-contain" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Memudahkan Pencarian</h4>
                <p className="mt-1 text-xs text-slate-300">
                  Membantu siswa menemukan tempat PKL dengan lebih cepat dan mudah.
                </p>
              </div>
            </div>

            {/* Poin 2 */}
            <div className="flex items-start gap-4 rounded-xl border border-slate-800 bg-[#101935] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600/20">
                <img src="/icons/person.png" alt="Memilih" className="h-5 w-5 object-contain" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Memilih yang Sesuai</h4>
                <p className="mt-1 text-xs text-slate-300">
                  Membantu siswa menentukan tempat PKL yang sesuai dengan jurusan dan bidang keahlian.
                </p>
              </div>
            </div>

            {/* Poin 3 */}
            <div className="flex items-start gap-4 rounded-xl border border-slate-800 bg-[#101935] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600/20">
                <img src="/icons/pause.png" alt="Membandingkan" className="h-5 w-5 object-contain" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Membandingkan Pilihan</h4>
                <p className="mt-1 text-xs text-slate-300">
                  Memudahkan siswa membandingkan beberapa tempat PKL sebelum menentukan pilihan.
                </p>
              </div>
            </div>

            {/* Poin 4 */}
            <div className="flex items-start gap-4 rounded-xl border border-slate-800 bg-[#101935] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600/20">
                <img src="/icons/clipboard.png" alt="Informasi" className="h-5 w-5 object-contain" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Menyediakan Informasi</h4>
                <p className="mt-1 text-xs text-slate-300">
                  Menyajikan informasi tempat PKL secara lengkap dan terstruktur dalam satu platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION: TARGET USER & VALUE --- */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 rounded-2xl border border-slate-700/60 bg-[#101935] p-8 md:grid-cols-2">
          {/* Target User */}
          <div className="flex items-start gap-5 border-b border-slate-800 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20">
              <img src="/icons/graduation.png" alt="Siswa SMK" className="h-7 w-7 object-contain" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Target User</span>
              <h3 className="mt-1 text-xl font-bold text-white">Siswa SMK</h3>
              <p className="mt-1 text-xs text-slate-300">
                yang akan melaksanakan Praktik Kerja Lapangan (PKL).
              </p>
            </div>
          </div>

          {/* Proposed Value */}
          <div className="flex items-start gap-5 md:pl-2">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20">
              <img src="/icons/diamond.png" alt="Value" className="h-7 w-7 object-contain" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Proposed Value</span>
              <h3 className="mt-1 text-lg font-bold leading-snug text-white">
                Memudahkan siswa mencari dan membandingkan tempat PKL sesuai jurusan dalam satu platform.
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* --- BANNER CTA BOTTOM --- */}
      <section className="mx-auto max-w-6xl px-6 pt-6 pb-20">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-[#101d42] to-[#122353] p-8 md:flex-row">
          <div>
            <h3 className="text-lg font-bold text-white sm:text-xl">
              Siap menemukan tempat PKL yang tepat untuk masa depanmu?
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              Jelajahi berbagai pilihan tempat PKL yang sesuai dengan jurusan dan minatmu hanya di SIMPUL.
            </p>
          </div>

          <Link
            href="/daftar-tempat"
            className="flex shrink-0 items-center justify-center rounded-xl bg-blue-400 px-6 py-3 text-xs font-semibold text-slate-900 shadow-md transition hover:bg-sky-300"
          >
            Lihat Daftar Tempat PKL
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}