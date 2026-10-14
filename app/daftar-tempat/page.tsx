"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeaderDaftarTempat from "@/components/sections/DaftarTempat";
import FilterTempat from "@/components/catalog/FilterTempat";
import KartuTempatPKL from "@/components/catalog/KartuTempatPKL";
import LoadingKartu from "@/components/catalog/LoadingKartu";
import BarBandingkan from "@/components/catalog/BarBandingkan";
import PopUpBandingkan from "@/components/modals/PopUpBandingkan";
import { getTempatPKL } from "@/lib/strapi";
import { TempatPKL } from "@/types";
import PopUpDetail, { CompanyDetail } from "@/components/modals/PopUpDetail";

function toCompanyDetail(t: TempatPKL): CompanyDetail {
  return {
    id: t.id,
    name: t.nama,
    category: t.jurusan,
    address: t.jarak ? `${t.alamat} (${t.jarak})` : t.alamat,
    mapsUrl: t.linkMaps ?? undefined,
    imageSrc: t.gambar ?? "/placeholder.png",
    workHours: {
      shift1: t.jamKerja[0] ?? "-",
      shift2: t.jamKerja[1],
    },
    quota: t.kuota,
    roles: t.role,
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
  };
}

function DaftarTempatContent() {
  const searchParams = useSearchParams();
  const queryJurusan = searchParams.get("jurusan");

  const [data, setData] = useState<TempatPKL[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [kata, setKata] = useState("");
  const [kataAktif, setKataAktif] = useState("");
  const [bidang, setBidang] = useState("");
  const [jurusan, setJurusan] = useState(queryJurusan || "");

  const [detail, setDetail] = useState<TempatPKL | null>(null);
  const [terpilih, setTerpilih] = useState<TempatPKL[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Ambil seluruh data langsung dari Strapi (hingga 100 data)
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const res = await getTempatPKL();
        setData(res);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data tempat PKL.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Update filter jurusan jika query param di URL berubah
  useEffect(() => {
    if (queryJurusan) {
      setJurusan(queryJurusan);
    }
  }, [queryJurusan]);

  const daftarBidang = useMemo(
    () => [...new Set(data.flatMap((d) => d.role))].sort(),
    [data]
  );
  
  const daftarJurusan = useMemo(
    () => [...new Set(data.map((d) => d.jurusan))].sort(),
    [data]
  );

  // Foto hero diambil dari data Strapi (maksimal 5)
const gambarHero = useMemo(
  () =>
    data
      .map((d) => d.gambar)
      .filter((g): g is string => typeof g === "string" && g !== "")
      .slice(0, 5),
  [data]
);

  // Filter pencarian & kategori
  const tampil = useMemo(() => {
    const q = kataAktif.toLowerCase();
    const jFilter = jurusan.toLowerCase();

    return data.filter((d) => {
      const cocokKata =
  !q ||
  d.nama
    .toLowerCase()
    .split(/\s+/)
    .some((kata) => kata.replace(/[()]/g, "").startsWith(q));
      const cocokBidang = !bidang || d.role.includes(bidang);

      // Pencocokan fleksibel agar cocok dengan nama atau singkatan jurusan
      const cocokJurusan =
        !jurusan ||
        d.jurusan.toLowerCase().includes(jFilter) ||
        jFilter.includes(d.jurusan.toLowerCase());

      return cocokKata && cocokBidang && cocokJurusan;
    });
  }, [data, kataAktif, bidang, jurusan]);

  const toggleBandingkan = (t: TempatPKL) => {
    setTerpilih((prev) => {
      if (prev.some((p) => p.id === t.id)) return prev.filter((p) => p.id !== t.id);
      if (prev.length >= 2) return [prev[1], t];
      return [...prev, t];
    });
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar
        compareCount={terpilih.length}
        onOpenCompare={() => setIsCompareOpen(true)}
      />

     <HeaderDaftarTempat
  kata={kata}
  onKata={(v) => {
    setKata(v);
    setKataAktif(v);
  }}
  onCari={() => setKataAktif(kata)}
/>


     
<div className="bg-blue-950 px-5 py-10 sm:px-10 lg:px-16 xl:px-24 lg:py-12">
        <div className="mx-auto w-full max-w-7xl space-y-8">
          <FilterTempat
            bidang={bidang}
            jurusan={jurusan}
            daftarBidang={daftarBidang}
            daftarJurusan={daftarJurusan}
            onBidang={setBidang}
            onJurusan={setJurusan}
          />

          {error && <p className="text-center text-red-300">{error}</p>}

          <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {loading
              ? Array.from({ length: 6 }).map((_, i) => <LoadingKartu key={i} />)
              : tampil.map((t) => (
                  <KartuTempatPKL
                    key={t.id}
                    tempat={t}
                    dipilih={terpilih.some((p) => p.id === t.id)}
                    onDetail={setDetail}
                    onBandingkan={toggleBandingkan}
                  />
                ))}
          </div>

          {!loading && !error && tampil.length === 0 && (
            <p className="text-center text-white/70 py-10">
              Tidak ada tempat PKL yang cocok dengan kriteria pencarian/jurusan ini.
            </p>
          )}
        </div>
      </div>

      <BarBandingkan
        terpilih={terpilih}
        onHapus={(id) => setTerpilih((p) => p.filter((x) => x.id !== id))}
        onBandingkan={() => setIsCompareOpen(true)}
      />

      {/* PopUp Detail */}
      <PopUpDetail
        isOpen={detail !== null}
        onClose={() => setDetail(null)}
        company={detail ? toCompanyDetail(detail) : null}
        isComparing={detail ? terpilih.some((p) => p.id === detail.id) : false}
        onBandingkan={(comp: any) => {
          const target = data.find((d) => d.id === comp.id);
          if (target) {
            toggleBandingkan(target);
          }
        }}
      />

      {/* PopUp Bandingkan */}
      <PopUpBandingkan
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        items={terpilih}
        onClear={() => setTerpilih([])}
        onRemoveItem={(idHapus) => {
          setTerpilih((prev) =>
            prev.filter((item, idx) => {
              const currentId = item.id !== undefined ? item.id : idx;
              return String(currentId) !== String(idHapus);
            })
          );
        }}
      />

      <Footer />
    </main>
  );
}

export default function DaftarTempatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <DaftarTempatContent />
    </Suspense>
  );
}