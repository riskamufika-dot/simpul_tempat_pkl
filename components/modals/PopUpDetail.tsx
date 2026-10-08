"use client";

import React from "react";
import Image from "next/image";

export interface CompanyDetail {
  id: string | number;
  name: string;
  category: string;
  address: string;
  mapsUrl?: string;
  imageSrc: string;
  workHours: {
    shift1: string;
    shift2?: string;
  };
  quota: string;
  roles: string[];
  tasks: string[];
  requirements: string[];
  facilities: string[];
  testimonial?: {
    studentName: string;
    school: string;
    feedback: string;
  };
}

interface PopUpDetailProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyDetail | null;
}

export default function PopUpDetail({ isOpen, onClose, company }: PopUpDetailProps) {
  if (!isOpen || !company) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-7 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto text-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Tutup Silang */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-gray-700 bg-white/90 hover:bg-white w-9 h-9 rounded-full flex items-center justify-center shadow-md transition text-lg cursor-pointer"
          aria-label="Tutup modal"
        >
          ✕
        </button>

        {/* 1. Banner Foto & Info Utama */}
        <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden mb-6 bg-gray-100">
          <Image
            src={company.imageSrc}
            alt={company.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-5 sm:p-7 text-white">
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full w-fit mb-2 shadow-sm">
              {company.category}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {company.name}
            </h2>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-200 mt-1">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{company.address}</span>
            </div>
          </div>
        </div>

        {/* 2. Jam Kerja & Kuota Siswa */}
        <div className="grid grid-cols-2 bg-[#f0f5ff] rounded-2xl p-4 sm:p-5 mb-6 text-center border border-blue-50">
          <div className="border-r border-blue-200 pr-3">
            <span className="text-[11px] font-bold text-gray-500 tracking-wider uppercase block mb-1">
              JAM KERJA
            </span>
            <p className="text-xs sm:text-sm font-semibold text-gray-800">
              Shift 1 (Pagi): {company.workHours.shift1}
            </p>
            {company.workHours.shift2 && (
              <p className="text-xs sm:text-sm font-semibold text-gray-800">
                Shift 2 (Siang): {company.workHours.shift2}
              </p>
            )}
          </div>
          <div className="pl-3 flex flex-col justify-center">
            <span className="text-[11px] font-bold text-gray-500 tracking-wider uppercase block mb-1">
              KUOTA SISWA
            </span>
            <p className="text-sm sm:text-base font-extrabold text-gray-900">
              {company.quota}
            </p>
          </div>
        </div>

        {/* 3. Role yang Dibutuhkan */}
        {company.roles && company.roles.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-3">
              ROLE YANG DIBUTUHKAN:
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {company.roles.map((role, idx) => (
                <span
                  key={idx}
                  className="px-5 py-1.5 rounded-full border border-blue-600 text-blue-600 text-sm font-semibold"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 4. Hal Perlu Dikerjakan */}
        {company.tasks && company.tasks.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-3">
              HAL PERLU DIKERJAKAN:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 font-medium">
              {company.tasks.map((task, idx) => (
                <li key={idx}>{task}</li>
              ))}
            </ol>
          </div>
        )}

        {/* 5. Dua Kolom: Syarat Berkas & Fasilitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#f3f7fd] p-5 rounded-2xl border border-blue-50/60">
            <h4 className="text-xs font-bold text-gray-900 tracking-wider uppercase mb-3 flex items-center gap-2">
              <span className="text-sm">📄</span> SYARAT BERKAS:
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
              {company.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ol>
          </div>

          <div className="bg-[#f3f7fd] p-5 rounded-2xl border border-blue-50/60">
            <h4 className="text-xs font-bold text-gray-900 tracking-wider uppercase mb-3 flex items-center gap-2">
              <span className="text-sm">✨</span> FASILITAS:
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
              {company.facilities.map((fac, idx) => (
                <li key={idx}>{fac}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* 6. Testimoni Siswa */}
        {company.testimonial && (
          <div className="bg-[#f3f7fd] p-5 rounded-2xl border border-blue-50/60 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div className="text-sm">
                <span className="font-bold text-gray-900">{company.testimonial.studentName} </span>
                <span className="text-gray-500 font-medium">({company.testimonial.school})</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic pl-1">
              “{company.testimonial.feedback}”
            </p>
          </div>
        )}

        {/* 7. Baris Tombol Aksi */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <a
            href={
              company.mapsUrl ||
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                company.name + " " + company.address
              )}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[170px] bg-[#182752] hover:bg-[#131f42] text-white text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>Buka Lokasi Google Maps</span>
          </a>

          <button
            type="button"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
          >
            ⚖️ Bandingkan
          </button>

          <button
            type="button"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
          >
            💬 Review
          </button>

          <button
            type="button"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
          >
            👤 Kontak
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs sm:text-sm font-semibold py-3 px-5 rounded-xl transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}