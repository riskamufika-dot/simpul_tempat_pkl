"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { TempatPKL } from "@/types";
import PopUpBandingkan from "@/components/modals/PopUpBandingkan";

interface CompareContextValue {
  terpilih: TempatPKL[];
  toggleBandingkan: (t: TempatPKL) => void;
  hapus: (id: number | string) => void;
  kosongkan: () => void;
  openCompare: () => void;
  closeCompare: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

const KEY = "simpul-compare";

export function DaftarPerbandingan({ children }: { children: ReactNode }) {
  const [terpilih, setTerpilih] = useState<TempatPKL[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [siap, setSiap] = useState(false);

  // Ambil pilihan tersimpan (tetap ada walau halaman di-refresh)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setTerpilih(JSON.parse(raw));
    } catch {}
    setSiap(true);
  }, []);

  // Simpan setiap ada perubahan
  useEffect(() => {
    if (!siap) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(terpilih));
    } catch {}
  }, [terpilih, siap]);

  const toggleBandingkan = useCallback((t: TempatPKL) => {
    setTerpilih((prev) => {
      if (prev.some((p) => p.id === t.id)) return prev.filter((p) => p.id !== t.id);
      if (prev.length >= 2) return [prev[1], t];
      return [...prev, t];
    });
  }, []);

  const hapus = useCallback(
    (id: number | string) =>
      setTerpilih((prev) => prev.filter((p) => String(p.id) !== String(id))),
    []
  );

  return (
    <CompareContext.Provider
      value={{
        terpilih,
        toggleBandingkan,
        hapus,
        kosongkan: () => setTerpilih([]),
        openCompare: () => setIsOpen(true),
        closeCompare: () => setIsOpen(false),
      }}
    >
      {children}

      {/* Satu pop up untuk seluruh website */}
      <PopUpBandingkan
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={terpilih}
        onClear={() => setTerpilih([])}
        onRemoveItem={(id) => hapus(id)}
      />
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare harus dipakai di dalam CompareProvider");
  return ctx;
}