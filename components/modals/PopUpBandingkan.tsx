"use client";

import React from "react";
import { TempatPKL } from "@/types";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: TempatPKL[];
}

export default function CompareModal({ isOpen, onClose, items }: CompareModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 text-[#182752] shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
          aria-label="Tutup modal"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold mb-1">Perbandingan Tempat PKL</h3>
        <p className="text-gray-600 text-sm mb-6">
          Bandingkan opsi tempat PKL yang telah Anda pilih:
        </p>

        {items.length < 2 ? (
          <p className="rounded-2xl bg-gray-50 p-6 text-center text-sm text-gray-500">
            Pilih minimal 2 tempat lewat tombol &quot;+ Bandingkan&quot; untuk mulai membandingkan.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            {items.map((t) => (
              <div
                key={t.id}
                className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3"
              >
                <div>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 rounded-full px-2 py-0.5">
                    {t.jurusan}
                  </span>
                  <h4 className="mt-1 font-bold text-blue-700">{t.nama}</h4>
                  <p className="text-xs text-gray-500">{t.alamat}</p>
                  {t.jarak && <p className="text-xs text-gray-500">📍 {t.jarak}</p>}
                </div>

                <div className="pt-2 text-xs border-t border-gray-200 space-y-1">
                  <p><b>Kuota:</b> {t.kuota}</p>
                  {t.jamKerja[0] && <p><b>Shift 1:</b> {t.jamKerja[0]}</p>}
                  {t.jamKerja[1] && <p><b>Shift 2:</b> {t.jamKerja[1]}</p>}
                </div>

                <div className="pt-2 text-xs border-t border-gray-200">
                  <p className="font-bold mb-1">Role</p>
                  <p>{t.role.join(", ") || "-"}</p>
                </div>

                <div className="pt-2 text-xs border-t border-gray-200">
                  <p className="font-bold mb-1">Fasilitas</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {t.fasilitas.length
                      ? t.fasilitas.map((f, i) => <li key={i}>{f}</li>)
                      : <li>-</li>}
                  </ul>
                </div>

                <div className="pt-2 text-xs border-t border-gray-200">
                  <p className="font-bold mb-1">Syarat Berkas</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {t.syaratBerkas.length
                      ? t.syaratBerkas.map((s, i) => <li key={i}>{s}</li>)
                      : <li>-</li>}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

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