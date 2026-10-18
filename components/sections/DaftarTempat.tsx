"use client";

import { useEffect, useState } from "react";

interface Props {
  kata: string;
  onKata: (v: string) => void;
  onCari: () => void;
  gambar?: string[]; // foto latar dari Strapi
}

export default function HeaderDaftarTempat({ kata, onKata, onCari, gambar = [] }: Props) {
  const [aktif, setAktif] = useState(0);
  const jumlah = gambar.length;
  const idx = jumlah ? aktif % jumlah : 0;

  const sebelumnya = () => setAktif((idx - 1 + jumlah) % jumlah);
  const berikutnya = () => setAktif((idx + 1) % jumlah);

  // ganti foto otomatis tiap 5 detik
  useEffect(() => {
    if (jumlah < 2) return;
    const t = setInterval(() => setAktif((i) => (i + 1) % jumlah), 5000);
    return () => clearInterval(t);
  }, [jumlah]);

  return (
    <section className="w-full bg-white">
     <div className="relative flex min-h-[220px] w-full items-center overflow-hidden bg-[#101d42] sm:min-h-[340px] lg:min-h-[380px]">
        {/* Foto latar dari database */}
        {gambar.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src + i}
            src={src}
            alt=""className={`absolute inset-0 h-full w-full object-cover object-[70%_center] transition-opacity duration-700 sm:object-center ${
            
              i === idx ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Lapisan gelap: rata di HP, gradasi dari kiri di layar lebih besar */}
       <div className="absolute inset-0 bg-linear-to-r from-[#101d42]/95 via-[#101d42]/60 to-[#101d42]/10" />

        {/* Isi, rata kiri */}
        
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-9 pt-5 sm:px-10 sm:py-8 lg:px-16 xl:px-24"><h1 className="max-w-3xl text-lg font-extrabold leading-snug text-white sm:text-3xl lg:text-4xl">
            Cari &amp; Bandingkan Tempat PKL{" "}
            <span className="block text-blue-400">Sesuai Kompetensi Jurusanmu</span>
          </h1>

          <p className="mt-1.5 max-w-[17rem] text-[10px] leading-relaxed text-gray-200 sm:mt-3 sm:max-w-xl sm:text-sm">
            Dapatkan informasi transparan mengenai jobdesk harian, besaran uang saku,
            sisa kuota, serta ulasan nyata kakak kelas terdahulu.
          </p>

          <div className="mt-3 flex w-full max-w-xs gap-2 sm:mt-6 sm:max-w-xl">
            <div className="relative min-w-0 flex-1">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
              </svg>
              <input
                type="text"
                value={kata}
                onChange={(e) => onKata(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onCari()}
                placeholder="Cari nama tempat PKL..."
                className="w-full rounded-full bg-white py-2.5 pl-10 pr-4 text-xs text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 sm:py-3 sm:pl-11 sm:text-sm"
              />
            </div>
            <button
              onClick={onCari}
              className="shrink-0 rounded-full bg-blue-700 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-600 sm:px-6 sm:py-3 sm:text-sm"
            >
              Cari
            </button>
          </div>
        </div>

        {/* Panah (sembunyi di HP) dan titik */}
        {jumlah > 1 && (
          <>
           

            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {gambar.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setAktif(i)}
                  aria-label={`Foto ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === idx ? "w-5 bg-white" : "w-2 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}