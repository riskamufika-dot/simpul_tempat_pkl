"use client";

import React, { useState } from "react";
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

  const formatPlace = (place: any, index: number) => {
    if (!place) return null;
    return {
      id: place.id !== undefined ? place.id : index,
      name: place.name || place.nama || "Nama Tempat",
      image:
        place.imageSrc ||
        place.gambar?.url ||
        place.gambar ||
        "/images/placeholder.png",
      address:
        place.address ||
        place.alamat ||
        place.lokasi ||
        "Alamat belum tersedia",
      shift1:
        place.shift1 ||
        place.jam_kerja?.shift1 ||
        place.workHours?.shift1 ||
        "Shift 1 (Pagi): 08.00 – 16.00 WIB",
      shift2:
        place.shift2 ||
        place.jam_kerja?.shift2 ||
        place.workHours?.shift2 ||
        "Shift 2 (Siang): 13.00 – 21.00 WIB",
      quota:
        place.quotaNote ||
        place.quota ||
        place.kuota ||
        "Terbatas, sesuai kebutuhan dan kebijakan perusahaan",
      roles:
        place.roles ||
        place.posisi ||
        place.bidang ||
        ["Pilih Bidang/Role", "Kasir", "Display Staff"],
      tasks:
        place.tasks ||
        place.tugas ||
        place.hal_dikerjakan || [
          "Membantu proses transaksi",
          "Menata area kasir",
          "Memberikan pelayanan kepada pelanggan sesuai arahan.",
        ],
      facilities:
        place.facilities ||
        place.fasilitas || [
          "Tempat pelaksanaan PKL",
          "Pembimbing selama kegiatan PKL",
          "Pengalaman bekerja di lingkungan pusat perbelanjaan",
          "Pengalaman dalam pelayanan pelanggan dan operasional toko",
          "Pengalaman dalam penataan produk dan proses transaksi",
        ],
      requirements:
        place.requirements ||
        place.syarat_berkas ||
        place.berkas || [
          "Surat pengantar/permohonan PKL dari sekolah",
          "Surat tugas atau penempatan PKL",
          "Fotokopi kartu pelajar",
          "Formulir atau dokumen administrasi PKL dari sekolah",
          "Dokumen tambahan sesuai ketentuan perusahaan",
        ],
    };
  };

  const comparedList = activePlaces.map(formatPlace).filter(Boolean);

  const [selectedRole1, setSelectedRole1] = useState("");
  const [selectedRole2, setSelectedRole2] = useState("");

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-7xl w-full p-6 sm:p-10 lg:p-12 shadow-2xl relative my-auto max-h-[96vh] overflow-y-auto text-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-8">
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

        <div className="grid grid-cols-12 gap-3 lg:gap-4 items-start text-sm">
          <div className="hidden lg:flex lg:col-span-2 flex-col gap-6 text-gray-600 font-semibold pt-4 pr-1">
            <div className="h-48 flex items-center">Profil Perusahaan:</div>
            <div className="min-h-[58px] flex items-center">Lokasi (Jarak):</div>
            <div className="min-h-[48px] flex items-center">Jam Kerja:</div>
            <div className="min-h-[42px] flex items-center">Kuota Siswa:</div>
            <div className="min-h-[46px] flex items-center">Bidang/Role:</div>
            <div className="min-h-[115px] flex items-center">Hal yang Perlu Dikerjakan:</div>
            <div className="min-h-[155px] flex items-center">Fasilitas:</div>
            <div className="min-h-[165px] flex items-center">Syarat Berkas:</div>
          </div>

          <div className="col-span-12 lg:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
            {comparedList.map((place: any, idx: number) => (
              <div
                key={place.id}
                className="border border-gray-200/90 rounded-3xl p-5 sm:p-7 bg-white shadow-sm flex flex-col gap-6 relative"
              >
                <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-100">
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
                    if (onRemoveItem) {
      onRemoveItem(place.id);
    }
  }}
  className="absolute top-2.5 right-2.5 text-white hover:text-red-500 transition-colors cursor-pointer z-30 flex items-center justify-center p-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
  title="Hapus dari perbandingan"
  aria-label="Hapus dari perbandingan"
>
  <svg className="w-6 h-6 stroke-current" fill="none" strokeWidth="2.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
</button>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                    {place.name}
                  </h3>
                </div>

                <div className="min-h-[58px] flex items-start gap-2 text-xs sm:text-sm text-gray-800 leading-relaxed">
                  <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{place.address}</span>
                </div>

                <div className="min-h-[48px] text-xs sm:text-sm text-gray-800 leading-relaxed space-y-0.5">
                  <p>{place.shift1}</p>
                  <p>{place.shift2}</p>
                </div>

                <div className="min-h-[42px] text-xs sm:text-sm text-gray-800 leading-relaxed flex items-center">
                  {place.quota}
                </div>

                <div className="min-h-[46px] relative">
                  <select
                    value={idx === 0 ? selectedRole1 : selectedRole2}
                    onChange={(e) =>
                      idx === 0
                        ? setSelectedRole1(e.target.value)
                        : setSelectedRole2(e.target.value)
                    }
                    className="w-full appearance-none bg-white border border-[#2563eb] text-[#2563eb] font-medium rounded-full py-2.5 px-5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                  >
                    <option value="">Pilih Bidang/Role</option>
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

                <div className="min-h-[115px] text-xs sm:text-sm text-gray-800">
                  <ol className="list-decimal list-outside pl-4 space-y-2 leading-relaxed">
                    {place.tasks.map((task: string, i: number) => (
                      <li key={i}>{task}</li>
                    ))}
                  </ol>
                </div>

                <div className="min-h-[155px] text-xs sm:text-sm text-gray-800">
                  <ol className="list-decimal list-outside pl-4 space-y-1.5 leading-relaxed">
                    {place.facilities.map((fac: string, i: number) => (
                      <li key={i}>{fac}</li>
                    ))}
                  </ol>
                </div>

                <div className="min-h-[165px] text-xs sm:text-sm text-gray-800">
                  <ol className="list-decimal list-outside pl-4 space-y-1.5 leading-relaxed">
                    {place.requirements.map((req: string, i: number) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}

            {comparedList.length === 1 && (
              <div
                onClick={onClose}
                className="border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-3xl p-8 bg-blue-50/40 hover:bg-blue-50/80 transition flex flex-col items-center justify-center text-center gap-4 cursor-pointer min-h-[500px]"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold shadow-sm">
                  +
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Tambah Tempat PKL Lain
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-[240px]">
                    Klik di sini untuk kembali ke daftar kartu dan memilih 1 tempat lagi sebagai pembanding
                  </p>
                </div>
                <span className="mt-2 inline-flex items-center text-xs font-semibold text-blue-600 underline">
                  Kembali ke Daftar Tempat →
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-10 mt-8 border-t border-gray-100">
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