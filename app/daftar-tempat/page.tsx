"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeaderDaftarTempat from "@/components/sections/DaftarTempat";
import FilterTempat from "@/components/catalog/FilterTempat";
import KartuTempatPKL from "@/components/catalog/KartuTempatPKL";
import PlaceSkeleton from "@/components/catalog/LoadingKartu";
import BarBandingkan from "@/components/catalog/BarBandingkan";
import PopUpDetail, { CompanyDetail } from "@/components/modals/PopUpDetail";
import { useCompare } from "@/components/layout/DaftarPerbandingan";
import {
  getTempatPKL,
  getHeroSlidersDaftarTempat,
  getBusinessFields,
  getMajors,
} from "@/lib/strapi";
import { TempatPKL } from "@/types";

/* ---------- Helper ---------- */

const normalJurusan = (j: string) =>
  (j || "").replace(/\s*\([^)]*\)\s*$/, "").trim().toLowerCase();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCompanyDetail(t: any): CompanyDetail {
  return {
    id: t.id,
    documentId: t.documentId,
    name: t.nama,
    category: t.jurusan,
    address: t.jarak ? `${t.alamat} (${t.jarak})` : t.alamat,
    mapsUrl: t.linkMaps ?? undefined,
    imageSrc: t.gambar ?? "/placeholder.png",
    images: t.images && t.images.length > 0 ? t.images : [t.gambar ?? "/placeholder.png"],
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

/* ---------- Halaman ---------- */

function DaftarTempatContent() {
  const searchParams = useSearchParams();
  const queryJurusan = searchParams.get("jurusan") || "";
  const querySearch = searchParams.get("search") || "";

  const { terpilih, toggleBandingkan, hapus, openCompare } = useCompare();

  const [data, setData] = useState<TempatPKL[]>([]);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [masterBidang, setMasterBidang] = useState<string[]>([]);
  const [masterJurusan, setMasterJurusan] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [kata, setKata] = useState(querySearch);
  const [bidang, setBidang] = useState("");
  const [jurusan, setJurusan] = useState(queryJurusan);
  const [detailItem, setDetailItem] = useState<CompanyDetail | null>(null);

  useEffect(() => {
    if (queryJurusan) setJurusan(queryJurusan);
    if (querySearch) setKata(querySearch);
  }, [queryJurusan, querySearch]);

  const CACHE_KEY = "simpul-tempat-cache-v6";
  const CACHE_MS = 5 * 60 * 1000; // 5 menit

  const loadData = useCallback(async () => {
    setError(false);

    let hasValidCache = false;
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw);
        if (Date.now() - cached.waktu < CACHE_MS) {
          if (Array.isArray(cached.companies) && cached.companies.length > 0) {
            setData(cached.companies);
          }
          if (Array.isArray(cached.sliders) && cached.sliders.length > 0) {
            setHeroImages(cached.sliders);
          }
          if (Array.isArray(cached.bidang) && cached.bidang.length > 0) {
            setMasterBidang(cached.bidang);
          }
          if (Array.isArray(cached.majors) && cached.majors.length > 0) {
            setMasterJurusan(cached.majors);
          }
          hasValidCache = true;
          setLoading(false);
        }
      }
    } catch {
      hasValidCache = false;
    }

    if (!hasValidCache) {
      setLoading(true);
    }

    try {
      const [resCompanies, resSliders, resBidangRaw, resMajorsRaw] = await Promise.all([
        getTempatPKL(),
        getHeroSlidersDaftarTempat(),
        getBusinessFields(),
        getMajors(),
      ]);

      // Ekstrak nama string bidang
      const cleanBidangList = Array.isArray(resBidangRaw)
        ? resBidangRaw
            .map((b: any) =>
              typeof b === "string"
                ? b
                : b.name || b.nama || b.attributes?.name || b.attributes?.nama || ""
            )
            .filter(Boolean)
        : [];

      // Ekstrak label string jurusan
      const cleanJurusanList = Array.isArray(resMajorsRaw)
        ? resMajorsRaw
            .map((m: any) => {
              if (typeof m === "string") return m;
              const nama =
                m.name || m.nama || m.attributes?.name || m.attributes?.nama || "";
              const kode =
                m.code ||
                m.abbreviation ||
                m.attributes?.code ||
                m.attributes?.abbreviation ||
                "";
              if (!nama && !kode) return null;
              return kode ? `${nama} (${kode})` : nama;
            })
            .filter(Boolean)
        : [];

      setData(resCompanies);
      setHeroImages(resSliders);
      setMasterBidang(cleanBidangList);
      setMasterJurusan(cleanJurusanList);

      try {
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            waktu: Date.now(),
            companies: resCompanies,
            sliders: resSliders,
            bidang: cleanBidangList,
            majors: cleanJurusanList,
          })
        );
      } catch {}
    } catch (err) {
      console.error("Gagal memuat data katalog:", err);
      setData((d) => {
        if (d.length === 0) setError(true);
        return d;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Dropdown Bidang
  const daftarBidang = useMemo(() => {
    const s = new Set<string>(masterBidang);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.forEach((d: any) => {
      if (d.bidang && typeof d.bidang === "string" && d.bidang.trim() !== "") {
        s.add(d.bidang.trim());
      }
    });
    return Array.from(s).filter(Boolean).sort();
  }, [data, masterBidang]);

  // Dropdown Jurusan
  const daftarJurusan = useMemo(() => {
    return [...masterJurusan].sort();
  }, [masterJurusan]);

  // Filter
  const hasilFilter = useMemo(() => {
    const q = kata.trim().toLowerCase();
    const jFilter = normalJurusan(jurusan);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.filter((t: any) => {
      const matchKata = q
        ? (t.nama && t.nama.toLowerCase().includes(q)) ||
          (t.deskripsi && t.deskripsi.toLowerCase().includes(q)) ||
          (t.jurusan && t.jurusan.toLowerCase().includes(q)) ||
          (t.alamat && t.alamat.toLowerCase().includes(q)) ||
          (Array.isArray(t.role) &&
            t.role.some((r: string) => r.toLowerCase().includes(q)))
        : true;

      const matchBidang = bidang
        ? t.bidang && t.bidang.toLowerCase() === bidang.toLowerCase()
        : true;

      const matchJurusan = jFilter
        ? normalJurusan(t.jurusan) === jFilter ||
          (t.singkatanJurusan || "").toLowerCase() === jFilter
        : true;

      return matchKata && matchBidang && matchJurusan;
    });
  }, [data, kata, bidang, jurusan]);

  const sedangMencari = Boolean(kata.trim() || bidang || jurusan);

  return (
    <main className="min-h-screen bg-[#182752] text-white">
      <Navbar />

      <HeaderDaftarTempat
        kata={kata}
        onKata={setKata}
        onCari={() => {}}
        gambar={heroImages}
      />

      <div className="mx-auto max-w-7xl px-3 py-8 pb-28 sm:px-6 sm:py-10 lg:px-8">
        {/* Bar filter */}
        <div className="mb-6 w-full space-y-2">
          <div className="w-full">
            <FilterTempat
              bidang={bidang}
              jurusan={jurusan}
              daftarBidang={daftarBidang}
              daftarJurusan={daftarJurusan}
              onBidang={setBidang}
              onJurusan={setJurusan}
            />
          </div>

          {sedangMencari && !loading && !error && (
            <div className="flex justify-end pt-1">
              <span className="text-xs font-medium text-slate-300">
                Ditemukan{" "}
                <strong className="font-bold text-white">{hasilFilter.length}</strong>{" "}
                tempat PKL
              </span>
            </div>
          )}
        </div>

        {/* Daftar kartu */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PlaceSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-300/40 bg-red-500/10 p-10 text-center">
            <p className="font-semibold text-red-200">Data tempat PKL gagal dimuat</p>
            <p className="mt-1 text-sm text-slate-300">
              Periksa koneksi internet kamu, lalu coba lagi.
            </p>
            <button
              type="button"
              onClick={loadData}
              className="mt-4 cursor-pointer rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#182752]"
            >
              Coba lagi
            </button>
          </div>
        ) : hasilFilter.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-[#162244] p-14 text-center text-slate-300 shadow-sm">
            {kata
              ? `Tempat PKL "${kata}" tidak ada di data kami.`
              : "Tidak ada tempat PKL yang cocok dengan filter yang dipilih."}
          </div>
        ) : (
          <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
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
        onHapus={(id) => hapus(id)}
        onBandingkan={openCompare}
      />

      <PopUpDetail
        isOpen={Boolean(detailItem)}
        onClose={() => setDetailItem(null)}
        company={detailItem}
        isComparing={detailItem ? terpilih.some((p) => p.id === detailItem.id) : false}
        onBandingkan={(c) => {
          const raw = data.find((d) => d.id === c.id);
          if (raw) toggleBandingkan(raw);
        }}
      />
    </main>
  );
}

export default function DaftarTempatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#182752]" />}>
      <DaftarTempatContent />
    </Suspense>
  );
}