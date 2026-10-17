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

export default function PopUpBandingkan({
  isOpen,
  onClose,
  items = [],
  places = [],
  onClear,
  onRemoveItem,
}: PopUpBandingkanProps) {
  const activePlaces = (items || places || []).slice(0, 2);

  const [selectedRole1, setSelectedRole1] = useState("");
  const [selectedRole2, setSelectedRole2] = useState("");

  const formatPlace = (place: any, index: number) => {
    if (!place) return null;

    // 1. Ekstraksi daftar detailedRoles { role: string, tasks: string[] }
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

    // Filter agar nama role valid dan bukan nama bidang/kategori umum
    extractedDetailedRoles = extractedDetailedRoles.filter(
      (item) => item.role && !/^[a-z0-9]{20,}$/i.test(item.role)
    );

    // Ambil hanya nama-nama posisinya untuk dropdown
    const roleOptions = extractedDetailedRoles.map((item) => item.role);

    return {
      id: place.id !== undefined ? place.id : index,
      name: place.name || place.nama || "Nama Tempat",
      image:
        place.imageSrc ||
        place.gambar?.url ||
        place.gambar ||
        place.images?.[0] ||
        "/images/placeholder.png",
      address:
        place.address ||
        place.alamat ||
        place.lokasi ||
        "Alamat belum tersedia",
      shift1:
        place.shift1 ||
        place.jamKerja?.[0] ||
        place.jam_kerja?.shift1 ||
        place.workHours?.shift1 ||
        "Shift 1 (Pagi): 08.00 – 16.00 WIB",
      shift2:
        place.shift2 ||
        place.jamKerja?.[1] ||
        place.jam_kerja?.shift2 ||
        place.workHours?.shift2 ||
        "Shift 2 (Siang): 13.00 – 21.00 WIB",
      quota:
        place.quotaNote ||
        place.quota ||
        place.kuota ||
        "Tersedia",
      detailedRoles: extractedDetailedRoles,
      roles: roleOptions.length > 0 ? roleOptions : ["Administrasi Operasional"],
      defaultTasks:
        place.tasks ||
        place.tugas ||
        place.hal_dikerjakan || [
          "Membantu operasional dan administrasi harian",
          "Membantu pengarsipan dokumen sesuai arahan pembimbing",
        ],
      facilities:
        place.facilities ||
        place.fasilitas || [
          "Ruang kerja dan sarana penunjang praktik",
          "Bimbingan langsung dari pembimbing lapangan",
          "Sertifikat / Surat Keterangan Selesai PKL",
        ],
      requirements:
        place.requirements ||
        place.syaratBerkas ||
        place.syarat_berkas || [
          "Surat permohonan PKL resmi dari sekolah",
          "Biodata siswa / Curriculum Vitae (CV)",
          "Fotokopi Kartu Pelajar (KTA)",
        ],
    };
  };

  const comparedList = activePlaces.map(formatPlace).filter(Boolean);

  // Inisialisasi otomatis role terpilih saat modal dibuka
  useEffect(() => {
    if (comparedList[0]?.roles?.length) {
      setSelectedRole1(comparedList[0].roles[0]);
    }
    if (comparedList[1]?.roles?.length) {
      setSelectedRole2(comparedList[1].roles[0]);
    }
  }, [items, places]);

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

  // Fungsi helper untuk mengambil tugas spesifik berdasarkan role terpilih
  const getActiveTasks = (place: any, selectedRole: string) => {
    if (!place) return [];
    const found = place.detailedRoles?.find(
      (dr: any) => dr.role === selectedRole
    );
    if (found && Array.isArray(found.tasks) && found.tasks.length > 0) {
      return found.tasks;
    }
    return place.defaultTasks || [];
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-7xl w-full p-6 sm:p-10 lg:p-12 shadow-2xl relative my-auto max-h-[96vh] overflow-y-auto text-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-11 h-11 rounded-xl bg-[#1e3a8a] text-white flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Komparasi 2 Tempat PKL Berdampingan
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Bandingkan parameter kunci sebelum mengajukan surat tugas
            </p>
          </div>
        </div>

        {/* Tabel Komparasi Bersih & Lurus Sejajar */}
        <div className="w-full text-sm">
          {/* BARIS 1: Profil Perusahaan */}
          <div className="grid grid-cols-12 gap-4 py-4 px-3 rounded-2xl items-start">
            <div className="col-span-12 lg:col-span-2 font-semibold text-gray-500 pt-2">
              Profil Perusahaan:
            </div>
            <div className="col-span-12 lg:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {comparedList.map((place: any) => (
                <div key={place.id} className="space-y-3">
                  <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-gray-100">
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
                      className="absolute top-2.5 right-2.5 text-white hover:text-red-500 transition-colors cursor-pointer z-30 flex items-center justify-center p-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                      title="Hapus dari perbandingan"
                    >
                      <svg className="w-6 h-6 stroke-current" fill="none" strokeWidth="2.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                    {place.name}
                  </h3>
                </div>
              ))}
              {comparedList.length === 1 && (
                <div
                  onClick={onClose}
                  className="border-2 border-dashed border-blue-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2 cursor-pointer bg-blue-50/30 hover:bg-blue-50/60 transition"
                >
                  <span className="text-blue-600 font-bold text-xl">+</span>
                  <span className="text-xs text-gray-500">Pilih 1 tempat lagi dari daftar</span>
                </div>
              )}
            </div>
          </div>

          {/* BARIS 2: Lokasi / Alamat */}
          <div className="grid grid-cols-12 gap-4 py-3.5 px-3 rounded-2xl items-start bg-slate-50/70">
            <div className="col-span-12 lg:col-span-2 font-semibold text-gray-500">
              Lokasi (Jarak):
            </div>
            <div className="col-span-12 lg:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {comparedList.map((place: any) => (
                <div key={place.id} className="flex items-start gap-2 text-xs sm:text-sm text-gray-800 leading-relaxed">
                  <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{place.address}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BARIS 3: Jam Kerja */}
          <div className="grid grid-cols-12 gap-4 py-3.5 px-3 rounded-2xl items-start">
            <div className="col-span-12 lg:col-span-2 font-semibold text-gray-500">
              Jam Kerja:
            </div>
            <div className="col-span-12 lg:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {comparedList.map((place: any) => (
                <div key={place.id} className="text-xs sm:text-sm text-gray-800 leading-relaxed space-y-0.5">
                  <p>{place.shift1}</p>
                  <p>{place.shift2}</p>
                </div>
              ))}
            </div>
          </div>

          {/* BARIS 4: Kuota Siswa */}
          <div className="grid grid-cols-12 gap-4 py-3.5 px-3 rounded-2xl items-center bg-slate-50/70">
            <div className="col-span-12 lg:col-span-2 font-semibold text-gray-500">
              Kuota Siswa:
            </div>
            <div className="col-span-12 lg:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {comparedList.map((place: any) => (
                <div key={place.id} className="text-xs sm:text-sm text-gray-800 font-semibold">
                  <span className="inline-block px-3 py-1 bg-blue-100/70 text-blue-700 rounded-lg text-xs">
                    {place.quota}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* BARIS 5: Role / Posisi Pekerjaan Per Perusahaan */}
          <div className="grid grid-cols-12 gap-4 py-3.5 px-3 rounded-2xl items-center">
            <div className="col-span-12 lg:col-span-2 font-semibold text-gray-500">
              Posisi / Role:
            </div>
            <div className="col-span-12 lg:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {comparedList.map((place: any, idx: number) => {
                const currentRole = idx === 0 ? selectedRole1 : selectedRole2;
                return (
                  <div key={place.id} className="relative">
                    <select
                      value={currentRole}
                      onChange={(e) =>
                        idx === 0
                          ? setSelectedRole1(e.target.value)
                          : setSelectedRole2(e.target.value)
                      }
                      className="w-full appearance-none bg-white border border-[#2563eb] text-[#2563eb] font-semibold rounded-full py-2 px-5 pr-10 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer shadow-sm"
                    >
                      {place.roles.map((r: string, i: number) => (
                        <option key={i} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#2563eb]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BARIS 6: Hal yang Perlu Dikerjakan (Sinkron dengan Role) */}
          <div className="grid grid-cols-12 gap-4 py-4 px-3 rounded-2xl items-start bg-slate-50/70">
            <div className="col-span-12 lg:col-span-2 font-semibold text-gray-500">
              Hal yang Perlu Dikerjakan:
            </div>
            <div className="col-span-12 lg:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {comparedList.map((place: any, idx: number) => {
                const chosenRole = idx === 0 ? selectedRole1 : selectedRole2;
                const taskList = getActiveTasks(place, chosenRole);
                return (
                  <div key={place.id} className="text-xs sm:text-sm text-gray-800">
                    <ol className="list-decimal list-outside pl-4 space-y-2 leading-relaxed">
                      {taskList.map((task: string, i: number) => (
                        <li key={i}>{task}</li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BARIS 7: Fasilitas */}
          <div className="grid grid-cols-12 gap-4 py-4 px-3 rounded-2xl items-start">
            <div className="col-span-12 lg:col-span-2 font-semibold text-gray-500">
              Fasilitas:
            </div>
            <div className="col-span-12 lg:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {comparedList.map((place: any) => (
                <div key={place.id} className="text-xs sm:text-sm text-gray-800">
                  <ol className="list-decimal list-outside pl-4 space-y-1.5 leading-relaxed">
                    {Array.isArray(place.facilities) &&
                      place.facilities.map((fac: string, i: number) => (
                        <li key={i}>{fac}</li>
                      ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>

          {/* BARIS 8: Syarat Berkas */}
          <div className="grid grid-cols-12 gap-4 py-4 px-3 rounded-2xl items-start bg-slate-50/70">
            <div className="col-span-12 lg:col-span-2 font-semibold text-gray-500">
              Syarat Berkas:
            </div>
            <div className="col-span-12 lg:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {comparedList.map((place: any) => (
                <div key={place.id} className="text-xs sm:text-sm text-gray-800">
                  <ol className="list-decimal list-outside pl-4 space-y-1.5 leading-relaxed">
                    {Array.isArray(place.requirements) &&
                      place.requirements.map((req: string, i: number) => (
                        <li key={i}>{req}</li>
                      ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Tombol */}
        <div className="flex items-center justify-between pt-8 mt-4">
          <button
            type="button"
            onClick={onClear}
            className="text-red-600 hover:text-red-700 font-bold text-sm sm:text-base transition cursor-pointer"
          >
            Kosongkan Pilihan
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-[#e2e8f0] hover:bg-[#cbd5e1] text-gray-800 font-semibold px-8 py-2.5 rounded-full text-sm transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}