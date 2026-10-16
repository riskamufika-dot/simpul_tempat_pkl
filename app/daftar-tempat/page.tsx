"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeaderDaftarTempat from "@/components/sections/DaftarTempat";
import FilterTempat from "@/components/catalog/FilterTempat";
import KartuTempatPKL from "@/components/catalog/KartuTempatPKL";
import PlaceSkeleton from "@/components/catalog/LoadingKartu";
import BarBandingkan from "@/components/catalog/BarBandingkan";
import PopUpDetail, { CompanyDetail } from "@/components/modals/PopUpDetail";
import PopUpBandingkan from "@/components/modals/PopUpBandingkan";
import {
  getTempatPKL,
  getHeroSliders,
  getBusinessFields,
  getMajors,
} from "@/lib/strapi";
import { TempatPKL } from "@/types";

function toCompanyDetail(t: any): CompanyDetail {
  return {
    id: t.id,
    documentId: t.documentId,
    name: t.nama,
    category: t.jurusan,
    address: t.jarak ? `${t.alamat} (${t.jarak})` : t.alamat,
    mapsUrl: t.linkMaps ?? undefined,
    imageSrc: t.gambar ?? "/placeholder.png",
    images: t.images && t.images.length > 0 ? t.images : [t.gambar],
    workHours: {
      shift1: t.jamKerja?.[0] ?? "-",
      shift2: t.jamKerja?.[1],
    },
    quota: t.kuota,
    roles: t.detailedRoles && t.detailedRoles.length > 0 ? t.detailedRoles : t.role,
    tasks: t.tugas,
    requirements: t.syaratBerkas,
    facilities: t.fasilitas,
    testimonial: t.testimoni
      ? {
          studentName: t.testimoni.nama,
          school: t.testimoni.sekolah,
          feedback: t.testimoni.isi,
        }
      : undefined,
    contacts: t.contacts ?? undefined,
  };
}

function DaftarTempatContent() {
  const searchParams = useSearchParams();
  const queryJurusan = searchParams.get("jurusan") || "";
  const querySearch = searchParams.get("search") || "";

  const [data, setData] = useState<TempatPKL[]>([]);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [masterBidang, setMasterBidang] = useState<string[]>([]);
  const [masterJurusan, setMasterJurusan] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Pencarian real-time langsung menggunakan `kata`
  const [kata, setKata] = useState(querySearch);
  const [bidang, setBidang] = useState("");
  const [jurusan, setJurusan] = useState(queryJurusan);
  const [terpilih, setTerpilih] = useState<TempatPKL[]>([]);
  const [detailItem, setDetailItem] = useState<CompanyDetail | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Sinkronkan state saat URL query berubah
  useEffect(() => {
    if (queryJurusan) setJurusan(queryJurusan);
    if (querySearch) setKata(querySearch);
  }, [queryJurusan, querySearch]);

  useEffect(() => {
    async function loadData() {
      try {
        const [resCompanies, resSliders, resBidang, resMajors] = await Promise.all([
          getTempatPKL(),
          getHeroSliders(),
          getBusinessFields(),
          getMajors(),
        ]);

        setData(resCompanies);

        const listBidang = (resBidang || [])
          .map((b: any) => b.name || b.title || "")
          .filter(Boolean);
        setMasterBidang(listBidang);

        const listJurusan = (resMajors || [])
          .map((m: any) => m.name || m.title || "")
          .filter(Boolean);
        setMasterJurusan(listJurusan);

        const bannerUrls = (resSliders || [])
          .map((s: any) => s.image?.url || s.image_url)
          .filter(Boolean);
        setHeroImages(bannerUrls);
      } catch (err) {
        console.error("Gagal memuat data katalog:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const daftarBidang = useMemo(() => {
    const s = new Set<string>(masterBidang);
    data.forEach((d: any) => {
      if (d.bidang && d.bidang.trim() !== "") {
        s.add(d.bidang);
      }
      if (Array.isArray(d.role)) {
        d.role.forEach((r: string) => {
          if (r && r !== "Umum") s.add(r);
        });
      }
    });
    return Array.from(s).filter(Boolean);
  }, [data, masterBidang]);

  const daftarJurusan = useMemo(() => {
    const s = new Set<string>(masterJurusan);
    data.forEach((d: any) => {
      if (d.jurusan && d.jurusan.trim() !== "") {
        s.add(d.jurusan);
      }
    });
    return Array.from(s).filter(Boolean);
  }, [data, masterJurusan]);

  // Pencarian instan (langsung merespons saat ketik / hapus karakter)
  const hasilFilter = useMemo(() => {
    const searchLower = kata.trim().toLowerCase();

    return data.filter((t: any) => {
      const matchKata = searchLower
        ? (t.nama && t.nama.toLowerCase().includes(searchLower)) ||
          (t.deskripsi && t.deskripsi.toLowerCase().includes(searchLower)) ||
          (t.jurusan && t.jurusan.toLowerCase().includes(searchLower)) ||
          (t.alamat && t.alamat.toLowerCase().includes(searchLower)) ||
          (Array.isArray(t.role) &&
            t.role.some((r: string) => r.toLowerCase().includes(searchLower)))
        : true;

      const matchBidang = bidang
        ? (t.bidang && t.bidang.toLowerCase() === bidang.toLowerCase()) ||
          (Array.isArray(t.role) &&
            t.role.some((r: string) => r.toLowerCase() === bidang.toLowerCase()))
        : true;

      const matchJurusan = jurusan
        ? (t.jurusan && t.jurusan.toLowerCase().includes(jurusan.toLowerCase())) ||
          (t.singkatanJurusan &&
            t.singkatanJurusan.toLowerCase().includes(jurusan.toLowerCase()))
        : true;

      return matchKata && matchBidang && matchJurusan;
    });
  }, [data, kata, bidang, jurusan]);

  const toggleBandingkan = (tempat: TempatPKL) => {
    setTerpilih((prev) => {
      const ada = prev.some((p) => p.id === tempat.id);
      if (ada) return prev.filter((p) => p.id !== tempat.id);
      if (prev.length >= 2) return [prev[1], tempat];
      return [...prev, tempat];
    });
  };

  return (
    // Latar belakang bersih disesuaikan: bg-[#f8fafc] (slate terang)
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Navbar
        compareCount={terpilih.length}
        onOpenCompare={() => setIsCompareOpen(true)}
      />

      <HeaderDaftarTempat
        kata={kata}
        onKata={setKata}
        onCari={() => {}}
        gambar={heroImages}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Bar Filter */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <FilterTempat
            bidang={bidang}
            jurusan={jurusan}
            daftarBidang={daftarBidang}
            daftarJurusan={daftarJurusan}
            onBidang={setBidang}
            onJurusan={setJurusan}
          />
          <span className="text-xs font-medium text-slate-500">
            Ditemukan <strong className="text-blue-900">{hasilFilter.length}</strong> tempat PKL
          </span>
        </div>

        {/* Daftar Kartu */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PlaceSkeleton key={i} />
            ))}
          </div>
        ) : hasilFilter.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center text-slate-500 shadow-sm">
            Tidak ada tempat PKL yang cocok dengan kata kunci &quot;{kata}&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hasilFilter.map((item) => (
              <KartuTempatPKL
                key={item.id}
                tempat={item}
                dipilih={terpilih.some((p) => p.id === item.id)}
                onDetail={(t) => setDetailItem(toCompanyDetail(t))}
                onBandingkan={toggleBandingkan}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />

      <BarBandingkan
        terpilih={terpilih}
        onHapus={(id) => setTerpilih((prev) => prev.filter((p) => p.id !== id))}
        onBandingkan={() => setIsCompareOpen(true)}
      />

      <PopUpDetail
        isOpen={Boolean(detailItem)}
        onClose={() => setDetailItem(null)}
        company={detailItem}
        isComparing={
          detailItem ? terpilih.some((p) => p.id === detailItem.id) : false
        }
        onBandingkan={(c) => {
          const raw = data.find((d) => d.id === c.id);
          if (raw) toggleBandingkan(raw);
        }}
      />

      <PopUpBandingkan
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        items={terpilih}
        onClear={() => setTerpilih([])}
        onRemoveItem={(id) => setTerpilih((prev) => prev.filter((p) => p.id !== id))}
      />
    </main>
  );
}

export default function DaftarTempatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fafc]" />}>
      <DaftarTempatContent />
    </Suspense>
  );
}