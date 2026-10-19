
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { TempatPKL } from "@/types";
import PopUpBandingkan from "@/components/modals/PopUpBandingkan";

interface CompareContextValue {
  terpilih: TempatPKL[];
  toggleBandingkan: (tempat: TempatPKL) => void;
  hapus: (id: number | string) => void;
  kosongkan: () => void;
  openCompare: () => void;
  closeCompare: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

const KEY = "simpul-compare";
const MAKSIMAL_PILIHAN = 2;

export function DaftarPerbandingan({
  children,
}: {
  children: ReactNode;
}) {
  const [terpilih, setTerpilih] = useState<TempatPKL[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [siap, setSiap] = useState(false);

  // Memuat pilihan yang tersimpan ketika halaman dibuka.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);

      if (raw) {
        const parsed: unknown = JSON.parse(raw);

        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (item): item is TempatPKL =>
              item !== null &&
              typeof item === "object" &&
              "id" in item &&
              (typeof item.id === "number" ||
                typeof item.id === "string")
          );

          const unik = valid.filter(
            (item, index, arr) =>
              arr.findIndex(
                (p) => String(p.id) === String(item.id)
              ) === index
          );

          setTerpilih(unik.slice(0, MAKSIMAL_PILIHAN));
        }
      }
    } catch {
      setTerpilih([]);
    } finally {
      setSiap(true);
    }
  }, []);

  // Menyimpan pilihan setiap kali daftar berubah.
  useEffect(() => {
    if (!siap) return;

    try {
      sessionStorage.setItem(KEY, JSON.stringify(terpilih));
    } catch {
      // Fitur perbandingan tetap bisa digunakan tanpa penyimpanan.
    }
  }, [terpilih, siap]);

  // Menambahkan atau menghapus tempat dari daftar perbandingan.
  const toggleBandingkan = useCallback((tempat: TempatPKL) => {
    setTerpilih((prev) => {
      const sudahAda = prev.some(
        (item) => String(item.id) === String(tempat.id)
      );

      if (sudahAda) {
        return prev.filter(
          (item) => String(item.id) !== String(tempat.id)
        );
      }

      if (prev.length >= MAKSIMAL_PILIHAN) {
        return [...prev.slice(1), tempat];
      }

      return [...prev, tempat];
    });
  }, []);

  const hapus = useCallback((id: number | string) => {
    setTerpilih((prev) =>
      prev.filter((item) => String(item.id) !== String(id))
    );
  }, []);

  const kosongkan = useCallback(() => {
    setTerpilih([]);
  }, []);

  const openCompare = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCompare = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <CompareContext.Provider
      value={{
        terpilih,
        toggleBandingkan,
        hapus,
        kosongkan,
        openCompare,
        closeCompare,
      }}
    >
      {children}

      <PopUpBandingkan
        isOpen={isOpen}
        onClose={closeCompare}
        items={terpilih}
        onClear={kosongkan}
        onRemoveItem={hapus}
      />
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);

  if (!ctx) {
    throw new Error(
      "useCompare harus dipakai di dalam DaftarPerbandingan"
    );
  }

  return ctx;
}
