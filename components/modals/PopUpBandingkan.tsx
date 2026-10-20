"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface PopUpBandingkanProps {
  isOpen: boolean;
  onClose: () => void;
  items?: any[];
  places?: any[];
  onClear?: () => void;
  onRemoveItem?: (id: any) => void;
}

// Daftar opsi parameter komparasi yang bisa dipilih user
const PARAMETER_OPTIONS = [
  { id: "lokasi", label: "Lokasi" },
  { id: "jamKerja", label: "Jam Kerja" },
  { id: "kuota", label: "Kuota Siswa" },
  { id: "role", label: "Posisi / Role" },
  { id: "tugas", label: "Hal Dikerjakan" },
  { id: "fasilitas", label: "Fasilitas" },
  { id: "syarat", label: "Syarat Berkas" },
];

export default function PopUpBandingkan({
  isOpen,
  onClose,
  items = [],
  places = [],
  onClear,
  onRemoveItem,
}: PopUpBandingkanProps) {
  const activePlaces = (items.length > 0 ? items : places).slice(0, 2);

  const [selectedRole1, setSelectedRole1] = useState("");
  const [selectedRole2, setSelectedRole2] = useState("");

  // Menangani gestur Back / Swipe bawaan HP
  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ modalBandingkanOpen: true }, "");

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, onClose]);

  // State untuk melacak parameter apa saja yang ingin ditampilkan user
  const [selectedParams, setSelectedParams] = useState<string[]>([
    "lokasi",
    "jamKerja",
    "kuota",
    "role",
    "tugas",
    "fasilitas",
    "syarat",
  ]);

  const toggleParam = (id: string) => {
    setSelectedParams((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const isVisible = (id: string) => selectedParams.includes(id);

  // Mengubah berbagai bentuk data jam kerja menjadi daftar baris teks
  const toLines = (v: any): string[] => {
    if (!v) return [];
    if (Array.isArray(v)) return v.flatMap(toLines);
    if (typeof v === "object") return Object.values(v).flatMap(toLines);
    return String(v)
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const formatPlace = (place: any, index: number) => {
    if (!place) return null;

    let extractedDetailedRoles: { role: string; tasks: string[] }[] = [];

    if (Array.isArray(place.detailedRoles) && place.detailedRoles.length > 0) {
      extractedDetailedRoles = place.detailedRoles;
    } else if (
      Array.isArray(place.roles) &&
      place.roles.length > 0 &&
      typeof place.roles[0] === "object"
    ) {
      extractedDetailedRoles = place.roles;
    } else if (Array.isArray(place.role) && place.role.length > 0) {
      const defaultTasks = Array.isArray(place.tugas)
        ? place.tugas
        : Array.isArray(place.tasks)
        ? place.tasks
        : [];
      extractedDetailedRoles = place.role.map((r: any) => ({
        role: typeof r === "string" ? r : r?.role || r?.title || String(r),
        tasks: defaultTasks,
      }));
    } else if (Array.isArray(place.roles) && place.roles.length > 0) {
      const defaultTasks = Array.isArray(place.tugas)
        ? place.tugas
        : Array.isArray(place.tasks)
        ? place.tasks
        : [];
      extractedDetailedRoles = place.roles.map((r: any) => ({
        role: typeof r === "string" ? r : r?.role || r?.title || String(r),
        tasks: defaultTasks,
      }));
    }

    extractedDetailedRoles = extractedDetailedRoles.filter(
      (item) => item.role && !/^[a-z0-9]{20,}\$/i.test(item.role)
    );

    const roleOptions = extractedDetailedRoles.map((item) => item.role);

    // MENGHAPUS DATA FIKTIF: Menggunakan fallback jujur "Informasi belum tersedia"
    const rawJamKerja = Array.from(
      new Set([
        ...toLines(place.jamKerja),
        ...toLines(place.jam_kerja),
        ...toLines(place.workHours),
        ...toLines(place.shift1),
        ...toLines(place.shift2),
      ])
    );

    const rawTasks = place.tasks || place.tugas || place.hal_dikerjakan || [];
    const rawFacilities = place.facilities || place.fasilitas || [];
    const rawRequirements = place.requirements || place.syaratBerkas || place.syarat_berkas || [];

    return {
      id: place.id !== undefined ? place.id : index,
      name: place.name || place.nama || "Nama Tempat",
      image:
        place.imageSrc ||
        place.gambar?.url ||
        place.gambar ||
        place.images?.[0] ||
        "/placeholder.png",
      address:
        place.address || place.alamat || place.lokasi || "Alamat belum tersedia",
      jamKerjaList: rawJamKerja.length > 0 ? rawJamKerja : ["Informasi jam kerja belum tersedia"],
      quota: place.quotaNote || place.quota || place.kuota || "Informasi kuota belum tersedia",
      detailedRoles: extractedDetailedRoles,
      roles: roleOptions.length > 0 ? roleOptions : ["Posisi belum ditentukan"],
      defaultTasks: rawTasks.length > 0 ? rawTasks : ["Informasi tugas belum tersedia"],
      facilities: rawFacilities.length > 0 ? rawFacilities : ["Informasi fasilitas belum tersedia"],
      requirements: rawRequirements.length > 0 ? rawRequirements : ["Informasi persyaratan belum tersedia"],
    };
  };

  const comparedList = activePlaces.map(formatPlace).filter(Boolean) as any[];

  const kunci = comparedList.map((p) => p.id).join(",");

  useEffect(() => {
    setSelectedRole1(comparedList[0]?.roles?.[0] ?? "");
    setSelectedRole2(comparedList[1]?.roles?.[0] ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kunci]);

  if (!isOpen) return null;

  if (comparedList.length === 0) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-3xl max-w-md w-full p-8 text-center text-gray-800 shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ⚖️
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Pilihan Telah Dikosongkan
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Tidak ada tempat yang sedang dibandingkan. Silakan pilih kembali dari daftar tempat PKL.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-[#182752] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#131f42] transition cursor-pointer"
          >
            Pilih Tempat PKL
          </button>
        </div>
      </div>
    );
  }

  const getActiveTasks = (place: any, selectedRole: string) => {
    if (!place) return [];
    const found = place.detailedRoles?.find((dr: any) => dr.role === selectedRole);
    if (found && Array.isArray(found.tasks) && found.tasks.length > 0) {
      return found.tasks;
    }
    return place.defaultTasks || [];
  };

  const roleDipilih = (idx: number) => (idx === 0 ? selectedRole1 : selectedRole2);
  const ubahRole = (idx: number, v: string) =>
    idx === 0 ? setSelectedRole1(v) : setSelectedRole2(v);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-7xl w-full p-3 sm:p-10 lg:p-12 shadow-2xl relative my-auto max-h-[96vh] overflow-y-auto text-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#1e3a8a] text-white flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <div>
            <h2 className="text-base sm:text-2xl font-bold text-gray-900 tracking-tight">
              Komparasi 2 Tempat PKL Berdampingan
            </h2>
            <p className="text-[11px] sm:text-sm text-gray-500 mt-0.5">
              Bandingkan parameter kunci sebelum mengajukan surat tugas
            </p>
          </div>
        </div>

        {/* Pilihan Parameter Komparasi */}
        <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-3 sm:p-4 mb-5">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[10px] sm:text-xs font-bold text-gray-600 uppercase tracking-wider">
              Tampilkan Parameter:
            </span>
            <button
              type="button"
              onClick={() =>
                setSelectedParams(
                  selectedParams.length === PARAMETER_OPTIONS.length
                    ? ["lokasi", "jamKerja"]
                    : PARAMETER_OPTIONS.map((p) => p.id)
                )
              }
              className="text-[10px] sm:text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              {selectedParams.length === PARAMETER_OPTIONS.length
                ? "Pilih Sebagian"
                : "Pilih Semua"}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {PARAMETER_OPTIONS.map((param) => {
              const active = isVisible(param.id);
              return (
                <button
                  key={param.id}
                  type="button"
                  onClick={() => toggleParam(param.id)}
                  className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition cursor-pointer border ${
                    active
                      ? "bg-[#1e3a8a] border-[#1e3a8a] text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {active ? "✓ " : "+ "}
                  {param.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Konten Utama */}
        <div className="w-full text-xs sm:text-sm space-y-3">
          {/* BARIS 1: Profil Perusahaan */}
          <div className="grid grid-cols-12 gap-2 sm:gap-4 py-3 px-2 sm:px-3 rounded-2xl items-start">
            <div className="col-span-12 lg:col-span-2 font-semibold text-gray-500 pt-1 text-xs sm:text-sm">
              Profil Perusahaan:
            </div>
            <div className="col-span-12 lg:col-span-10 grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6">
              {comparedList.map((place: any) => (
                <div key={place.id} className="space-y-2">
                  <div className="relative w-full h-28 sm:h-52 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100">
                    <Image
                      src={place.image}
                      alt={place.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onRemoveItem) onRemoveItem(place.id);
                      }}
                      className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 text-white hover:text-red-500 transition-colors cursor-pointer z-30 flex items-center justify-center p-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                      title="Hapus dari perbandingan"
                    >
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 stroke-current" fill="none" strokeWidth="2.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="text-xs sm:text-xl font-bold text-gray-900 leading-snug line-clamp-2">
                    {place.name}
                  </h3>
                </div>
              ))}
              {comparedList.length === 1 && (
                <div
                  onClick={onClose}
                  className="border-2 border-dashed border-blue-200 rounded-xl sm:rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1 cursor-pointer bg-blue-50/30 hover:bg-blue-50/60 transition"
                >
                  <span className="text-blue-600 font-bold text-lg">+</span>
                  <span className="text-[10px] sm:text-xs text-gray-500">Pilih 1 tempat lagi</span>
                </div>
              )}
            </div>
          </div>

          {/* BARIS 2: Lokasi */}
          {isVisible("lokasi") && (
            <div className="grid grid-cols-12 gap-2 sm:gap-4 py-3 px-2 sm:px-3 rounded-2xl items-start bg-slate-50/70">
              <div className="col-span-12 lg:col-span-2 font-semibold text-gray-500 text-xs sm:text-sm">
                Lokasi:
              </div>
              <div className="col-span-12 lg:col-span-10 grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6">
                {comparedList.map((place: any) => (
                  <div key={place.id} className="flex items-start gap-1.5 text-[11px] sm:text-sm text-gray-800 leading-relaxed">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{place.address}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BARIS 3: Jam Kerja */}
          {isVisible("jamKerja") && (
            <div className="grid grid-cols-12 gap-2 sm:gap-4 py-3 px-2 sm:px-3 rounded-2xl items-start">
              <div className="col-span-12 lg:col-span-2 font-semibold text-gray-500 text-xs sm:text-sm">
                Jam Kerja:
              </div>
              <div className="col-span-12 lg:col-span-10 grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6">
                {comparedList.map((place: any) => (
                  <div key={place.id} className="text-[11px] sm:text-sm text-gray-800 leading-relaxed space-y-0.5">
                    {place.jamKerjaList.map((line: string, i: number) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BARIS 4: Kuota */}
          {isVisible("kuota") && (
            <div className="grid grid-cols-12 gap-2 sm:gap-4 py-3 px-2 sm:px-3 rounded-2xl items-center bg-slate-50/70">
              <div className="col-span-12 lg:col-span-2 font-semibold text-gray-500 text-xs sm:text-sm">
                Kuota Siswa:
              </div>
              <div className="col-span-12 lg:col-span-10 grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6">
                {comparedList.map((place: any) => (
                  <div key={place.id} className="text-[11px] sm:text-sm text-gray-800 font-semibold">
                    <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 bg-blue-100/70 text-blue-700 rounded-lg text-[10px] sm:text-xs">
                      {place.quota}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BARIS 5: Role */}
          {isVisible("role") && (
            <div className="grid grid-cols-12 gap-2 sm:gap-4 py-3 px-2 sm:px-3 rounded-2xl items-center">
              <div className="col-span-12 lg:col-span-2 font-semibold text-gray-500 text-xs sm:text-sm">
                Posisi / Role:
              </div>
              <div className="col-span-12 lg:col-span-10 grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6">
                {comparedList.map((place: any, idx: number) => (
                  <div key={place.id} className="relative">
                    <select
                      value={roleDipilih(idx)}
                      onChange={(e) => ubahRole(idx, e.target.value)}
                      className="w-full appearance-none bg-white border border-[#2563eb] text-[#2563eb] font-semibold rounded-full py-1.5 sm:py-2 px-3 sm:px-5 pr-7 sm:pr-10 text-[10px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer shadow-sm truncate"
                    >
                      {place.roles.map((r: string, i: number) => (
                        <option key={i} value={r}>{r}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-2.5 sm:right-4 flex items-center text-[#2563eb]">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BARIS 6: Tugas */}
          {isVisible("tugas") && (
            <div className="grid grid-cols-12 gap-2 sm:gap-4 py-3 px-2 sm:px-3 rounded-2xl items-start bg-slate-50/70">
              <div className="col-span-12 lg:col-span-2 font-semibold text-gray-500 text-xs sm:text-sm">
                Hal yang Perlu Dikerjakan:
              </div>
              <div className="col-span-12 lg:col-span-10 grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6">
                {comparedList.map((place: any, idx: number) => (
                  <div key={place.id} className="text-[11px] sm:text-sm text-gray-800">
                    <ol className="list-decimal list-outside pl-3 sm:pl-4 space-y-1.5 leading-relaxed">
                      {getActiveTasks(place, roleDipilih(idx)).map((task: string, i: number) => (
                        <li key={i}>{task}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BARIS 7: Fasilitas */}
          {isVisible("fasilitas") && (
            <div className="grid grid-cols-12 gap-2 sm:gap-4 py-3 px-2 sm:px-3 rounded-2xl items-start">
              <div className="col-span-12 lg:col-span-2 font-semibold text-gray-500 text-xs sm:text-sm">
                Fasilitas:
              </div>
              <div className="col-span-12 lg:col-span-10 grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6">
                {comparedList.map((place: any) => (
                  <div key={place.id} className="text-[11px] sm:text-sm text-gray-800">
                    <ol className="list-decimal list-outside pl-3 sm:pl-4 space-y-1.5 leading-relaxed">
                      {Array.isArray(place.facilities) &&
                        place.facilities.map((fac: string, i: number) => (
                          <li key={i}>{fac}</li>
                        ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BARIS 8: Syarat Berkas */}
          {isVisible("syarat") && (
            <div className="grid grid-cols-12 gap-2 sm:gap-4 py-3 px-2 sm:px-3 rounded-2xl items-start bg-slate-50/70">
              <div className="col-span-12 lg:col-span-2 font-semibold text-gray-500 text-xs sm:text-sm">
                Syarat Berkas:
              </div>
              <div className="col-span-12 lg:col-span-10 grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6">
                {comparedList.map((place: any) => (
                  <div key={place.id} className="text-[11px] sm:text-sm text-gray-800">
                    <ol className="list-decimal list-outside pl-3 sm:pl-4 space-y-1.5 leading-relaxed">
                      {Array.isArray(place.requirements) &&
                        place.requirements.map((req: string, i: number) => (
                          <li key={i}>{req}</li>
                        ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tombol Aksi */}
        <div className="flex items-center justify-between gap-3 mt-6 sm:mt-8 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => {
              if (onClear) onClear();
            }}
            className="text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 hover:underline transition cursor-pointer"
          >
            Kosongkan Pilihan
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 sm:px-8 py-2 sm:py-2.5 rounded-full bg-gray-200 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-300 transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}