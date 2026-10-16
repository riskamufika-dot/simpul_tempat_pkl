"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
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
    <main className="min-h-screen bg-slate-900 text-white">
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 py-20">
        {loading ? (
          <div className="animate-pulse space-y-6 text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-slate-800" />
            <div className="mx-auto h-8 w-48 rounded bg-slate-800" />
            <div className="mx-auto h-20 w-full max-w-lg rounded bg-slate-800" />
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6 h-28 w-28">
              <Image
                src={logoUrl}
                alt="Logo SIMPUL"
                fill
                className="object-contain"
                priority
              />
            </div>

            <h1 className="mb-4 text-3xl font-extrabold sm:text-5xl">
              {appInfo?.title || "Tentang SIMPUL"}
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
              {appInfo?.content ||
                "SIMPUL (Sistem Informasi Magang & Penempatan Lapangan) adalah platform digital yang dirancang untuk mempermudah siswa SMK dalam mencari, membandingkan, dan memilih tempat Praktik Kerja Lapangan (PKL) yang sesuai dengan jurusan dan kompetensi keahliannya."}
            </p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}