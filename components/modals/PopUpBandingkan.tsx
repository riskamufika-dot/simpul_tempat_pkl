"use client";

import React from "react";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  items?: any[]; // <--- Tambahkan prop items di sini
}

export default function CompareModal({ isOpen, onClose, items }: CompareModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-[#182752] shadow-2xl relative"
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
          <h3 className="text-xl font-bold">Perbandingan Tempat PKL</h3>
        </div>

        <p className="text-gray-600 text-sm mb-6">
          Bandingkan opsi tempat PKL yang telah Anda pilih:
        </p>

        {/* Tabel Komparasi Sederhana */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
            <h4 className="font-bold text-blue-700">PT Sawarga Digital</h4>
            <p className="text-xs text-gray-500">Bandung, Jawa Barat</p>
            <div className="pt-2 text-xs border-t border-gray-200 space-y-1">
              <p>• Kuota: 3 Siswa</p>
              <p>• Jam Kerja: 08.00 - 17.00</p>
              <p>• Uang Saku: Ada</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
            <h4 className="font-bold text-blue-700">PT SAWALA Inovasi</h4>
            <p className="text-xs text-gray-500">Bandung, Jawa Barat</p>
            <div className="pt-2 text-xs border-t border-gray-200 space-y-1">
              <p>• Kuota: 2 Siswa</p>
              <p>• Jam Kerja: 08.30 - 16.30</p>
              <p>• Uang Saku: Ada</p>
            </div>
          </div>
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