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
import { useCompare } from "@/components/layout/DaftarPerbandingan";
import {
  getTempatPKL,
  getHeroSliders,
  getBusinessFields,
  getMajors,
} from "@/lib/strapi";
import { TempatPKL } from "@/types";

/* ---------- Helper ---------- */

// "Pemasaran (PM)" -> "pemasaran" (untuk membandingkan jurusan)
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

/* ---------- Halaman ---------- */

function DaftarTempatContent() {
  const searchParams = useSearchParams();
  const queryJurusan = searchParams.get("jurusan") || "";
  const querySearch = searchParams.get("search") || "";

  // Pilihan perbandingan dibagi ke seluruh halaman (dari DaftarPerbandingan)
  const { terpilih, toggleBandingkan, hapus, openCompare } = useCompare();

  const [data, setData] = useState<TempatPKL[]>([]);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [masterBidang, setMasterBidang] = useState<string[]>([]);
  const [masterJurusan, setMasterJurusan] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [kata, setKata] = useState(querySearch);
  const [bidang, setBidang] = useState("");
  const [jurusan, setJurusan] = useState(queryJurusan);
  const [detailItem, setDetailItem] = useState<CompanyDetail | null>(null);

  // Sinkronkan filter saat query URL berubah
  useEffect(() => {
    if (queryJurusan) setJurusan(queryJurusan);
    if (querySearch) setKata(querySearch);
  }, [queryJurusan, querySearch]);

  // Ambil semua data dari Strapi
  useEffect(() => {
    async function loadData() {
      try {
        const [resCompanies, resSliders, resBidang, resMajors] =
          await Promise.all([
            getTempatPKL(),
            getHeroSliders(),
            getBusinessFields(),
            getMajors(),
          ]);

        setData(resCompanies);

        setMasterBidang(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (resBidang || []).map((b: any) => b.name || b.title || "").filter(Boolean)
        );

        // Master jurusan dari Strapi, format "Nama (KODE)"
        setMasterJurusan(
          (resMajors || [])
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((m: any) => {
              const nama = (m.name || m.title || "").trim();
              const kode = m.code || m.abbreviation || "";
              return kode ? `${nama} (${kode})` : nama;
            })
            .filter(Boolean)
        );

        // Ambil slide khusus Daftar Tempat (sort_order = 2)
        const catalogSliders = (resSliders || []).filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (s: any) => Number(s.sort_order) === 2
        );

        const activeSliders =
          catalogSliders.length > 0 ? catalogSliders : resSliders || [];

        setHeroImages(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          activeSliders
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((s: any) => s.image?.url || s.image_url)
            .filter(Boolean)
        );
      } catch (err) {
        console.error("Gagal memuat data katalog:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Dropdown Bidang: HANYA dari master Business Field di Strapi + bidang perusahaan yang ada di data
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

  // Dropdown Jurusan: hanya dari tabel Major di Strapi
  const daftarJurusan = useMemo(
    () => [...masterJurusan].sort(),
    [masterJurusan]
  );

  // Filter: pencarian + bidang + jurusan
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

  // Cek apakah user sedang aktif mencari / memfilter
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
        {/* Bar filter: Membentang penuh 100% selebar container daftar kartu */}
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

          {/* Hanya muncul saat user mengetik kata kunci atau memilih opsi filter */}
          {sedangMencari && (
            <div className="flex justify-end pt-1">
              <span className="text-xs font-medium text-slate-300">
                Ditemukan <strong className="text-white font-bold">{hasilFilter.length}</strong> tempat PKL
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
        isComparing={
          detailItem ? terpilih.some((p) => p.id === detailItem.id) : false
        }
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