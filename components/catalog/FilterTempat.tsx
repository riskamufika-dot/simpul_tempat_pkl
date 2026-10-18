"use client";

import React from "react";

interface FilterTempatProps {
  bidang: string;
  jurusan: string;
  daftarBidang: string[];
  daftarJurusan: string[];
  onBidang: (val: string) => void;
  onJurusan: (val: string) => void;
}

export default function FilterTempat({
  bidang,
  jurusan,
  daftarBidang,
  daftarJurusan,
  onBidang,
  onJurusan,
}: FilterTempatProps) {
  return (
    <div className="flex flex-row items-center gap-2 sm:gap-3.5 w-full">
      {/* Label Filter: Selalu di pinggir kiri sejajar dengan dropdown */}
      <span className="text-xs sm:text-sm font-semibold text-white shrink-0">
        Filter:
      </span>

      {/* Kontainer Dropdown: 2 kolom berdampingan ke kanan */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full flex-1">
        {/* Dropdown 1: Semua Bidang */}
        <div className="relative w-full">
          <select
            value={bidang}
            onChange={(e) => onBidang(e.target.value)}
            className="w-full appearance-none rounded-xl bg-white px-2.5 sm:px-4 py-2 sm:py-2.5 pr-7 sm:pr-10 text-[11px] sm:text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer truncate"
          >
            <option value="">Semua Bidang</option>
            {daftarBidang.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-2 sm:right-3.5 flex items-center text-slate-500">
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Dropdown 2: Semua Jurusan */}
        <div className="relative w-full">
          <select
            value={jurusan}
            onChange={(e) => onJurusan(e.target.value)}
            className="w-full appearance-none rounded-xl bg-white px-2.5 sm:px-4 py-2 sm:py-2.5 pr-7 sm:pr-10 text-[11px] sm:text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer truncate"
          >
            <option value="">Semua Jurusan</option>
            {daftarJurusan.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-2 sm:right-3.5 flex items-center text-slate-500">
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}