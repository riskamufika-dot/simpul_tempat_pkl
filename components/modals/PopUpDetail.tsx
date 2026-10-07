"use client";

import React from "react";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: any; // <--- Tambahkan prop item di sini
}

export default function DetailModal({ isOpen, onClose, item }: DetailModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 text-[#182752] shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
          aria-label="Tutup modal"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 text-[#182752] mb-3">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-xl font-bold">Detail Lokasi & Alamat</h3>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          Informasi rincian alamat dan denah tempat PKL yang dituju:
        </p>

        <div className="w-full h-44 bg-blue-50 border border-blue-200 rounded-xl mb-4 flex flex-col items-center justify-center text-blue-600">
          <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="text-xs font-semibold">Pratinjau Peta Google Maps</span>
        </div>

        <div className="space-y-2 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <p><strong>Alamat:</strong> {item?.address || "Jl. Telekomunikasi No. 1, Terusan Buahbatu, Bandung"}</p>
          <p><strong>Keterangan:</strong> Lokasi strategis, dekat rute angkutan umum.</p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-sm rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}