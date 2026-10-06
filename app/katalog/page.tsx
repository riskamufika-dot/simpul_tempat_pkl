"use client";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar"; // Orang 1 (ubah ke { Navbar } jika named export)
import Footer from "@/components/layout/Footer"; // Orang 1
import FilterSection from "@/components/catalog/FilterSection";
import PlaceCard from "@/components/catalog/PlaceCard";
import PlaceSkeleton from "@/components/catalog/PlaceSkeleton";
import CompareBar from "@/components/catalog/CompareBar";
import { getPlaces } from "@/lib/strapi";
import { EMPTY_FILTER, type CompareMode, type Filter, type Place } from "@/types";

const PAGE_SIZE = 6;

export default function KatalogPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>(EMPTY_FILTER);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<Place[]>([]); // tempat yang akan dibandingkan (maks 2)

  useEffect(() => {
    getPlaces()
      .then(setPlaces)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      places.filter(
        (p) =>
          (!filter.bidang || p.role.includes(filter.bidang)) &&
          (!filter.jurusan || p.jurusan === filter.jurusan)
      ),
    [places, filter]
  );

  const handleFilter = (f: Filter) => {
    setFilter(f);
    setVisible(PAGE_SIZE);
  };

  const toggleCompare = (p: Place) =>
    setSelected((s) => (s.some((x) => x.id === p.id) ? s.filter((x) => x.id !== p.id) : s.length < 2 ? [...s, p] : s));

  const openDetail = (p: Place) => {
    // TODO: buka DetailModal (Orang 2), mis. setDetailPlace(p)
    console.log("detail", p.nama);
  };

  const openCompare = (mode: CompareMode) => {
    // TODO: buka CompareModal (Orang 2) dengan props: places={selected} mode={mode}
    console.log("compare", selected.map((p) => p.nama), mode);
  };

  return (
    <>
      <Navbar />
      <main className="bg-[#1B2A5E] px-4 py-10 pb-28">
        <div className="mx-auto max-w-5xl space-y-6">
          <h1 className="sr-only">Cari dan bandingkan tempat PKL</h1>
          <FilterSection filter={filter} onChange={handleFilter} />

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">
              Data tidak bisa dimuat: {error}. Periksa URL Strapi di file .env.local, lalu muat ulang halaman.
            </p>
          )}

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, i) => <PlaceSkeleton key={i} />)}
            </div>
          ) : !error && filtered.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center">
              <p className="font-semibold text-slate-900">Belum ada data</p>
              <p className="mt-1 text-sm text-slate-600">Tidak ada tempat PKL yang cocok dengan filter ini.</p>
              <button onClick={() => handleFilter(EMPTY_FILTER)} className="mt-4 rounded-full bg-[#1B2A5E] px-5 py-2 text-sm font-medium text-white">
                Reset filter
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                {filtered.slice(0, visible).map((p) => (
                  <PlaceCard
                    key={p.id}
                    place={p}
                    selected={selected.some((x) => x.id === p.id)}
                    canSelect={selected.length < 2}
                    onDetail={openDetail}
                    onToggleCompare={toggleCompare}
                  />
                ))}
              </div>
              {visible < filtered.length && (
                <div className="text-center">
                  <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="rounded-full bg-white px-6 py-2 text-sm font-medium text-[#1B2A5E]">
                    Tampilkan lebih banyak
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      {selected.length > 0 && <CompareBar selected={selected} onCompare={openCompare} onCancel={() => setSelected([])} />}
      <Footer />
    </>
  );
}