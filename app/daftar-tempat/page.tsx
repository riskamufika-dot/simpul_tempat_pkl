"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeaderDaftarTempat from "@/components/sections/DaftarTempat";
import FilterTempat from "@/components/catalog/FilterTempat";
import KartuTempatPKL from "@/components/catalog/KartuTempatPKL";
import LoadingKartu from "@/components/catalog/LoadingKartu";
import BarBandingkan from "@/components/catalog/BarBandingkan";
import PopUpBandingkan from "@/components/modals/PopUpBandingkan";
import { getTempatPKL } from "@/lib/strapi";
import { DUMMY_TEMPAT } from "@/lib/dummy";
import { TempatPKL } from "@/types";
import PopUpDetail, { CompanyDetail } from "@/components/modals/PopUpDetail";

const PAKAI_DUMMY = true;

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

export default function DaftarTempatPage() {
  const [data, setData] = useState<TempatPKL[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [kata, setKata] = useState("");
  const [kataAktif, setKataAktif] = useState("");
  const [bidang, setBidang] = useState("");
  const [jurusan, setJurusan] = useState("");

  const [detail, setDetail] = useState<TempatPKL | null>(null);
  const [terpilih, setTerpilih] = useState<TempatPKL[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

 useEffect(() => {
  getTempatPKL()
    .then((hasil) => {
      setData(hasil.length === 0 && PAKAI_DUMMY ? DUMMY_TEMPAT : hasil);
    })
    .catch((e) => {
      if (PAKAI_DUMMY) {
        setData(DUMMY_TEMPAT);
      } else {
        setError(e.message);
      }
    })
    .finally(() => setLoading(false));
}, []);

  const daftarBidang = useMemo(
    () => [...new Set(data.flatMap((d) => d.role))].sort(),
    [data]
  );
  const daftarJurusan = useMemo(
    () => [...new Set(data.map((d) => d.jurusan))].sort(),
    [data]
  );

  const tampil = useMemo(() => {
    const q = kataAktif.toLowerCase();
    return data.filter((d) => {
      const cocokKata =
        !q ||
        d.nama.toLowerCase().includes(q) ||
        d.jurusan.toLowerCase().includes(q) ||
        d.role.some((r) => r.toLowerCase().includes(q));
      const cocokBidang = !bidang || d.role.includes(bidang);
      const cocokJurusan = !jurusan || d.jurusan === jurusan;
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
      <Navbar onOpenCompare={() => setIsCompareOpen(true)} />

      <HeaderDaftarTempat
        kata={kata}
        onKata={setKata}
        onCari={() => setKataAktif(kata)}
      />

      <div className="bg-blue-950 px-6 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <FilterTempat
            bidang={bidang}
            jurusan={jurusan}
            daftarBidang={daftarBidang}
            daftarJurusan={daftarJurusan}
            onBidang={setBidang}
            onJurusan={setJurusan}
          />

          {error && <p className="text-center text-red-300">{error}</p>}

          <div className="grid gap-6 md:grid-cols-2">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <LoadingKartu key={i} />)
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
            <p className="text-center text-white/70">Tidak ada tempat yang cocok</p>
          )}
        </div>
      </div>

      <BarBandingkan
        terpilih={terpilih}
        onHapus={(id) => setTerpilih((p) => p.filter((x) => x.id !== id))}
        onBandingkan={() => setIsCompareOpen(true)}
      />

      <PopUpDetail
  isOpen={detail !== null}
  onClose={() => setDetail(null)}
  company={detail ? toCompanyDetail(detail) : null}
/>
      <PopUpBandingkan
  isOpen={isCompareOpen}
  onClose={() => setIsCompareOpen(false)}
  items={terpilih}
/>

      <Footer />
    </main>
  );
}