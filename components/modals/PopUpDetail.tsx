"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";

export interface CompanyDetail {
  id: string | number;
  name: string;
  category: string;
  address: string;
  mapsUrl?: string;
  imageSrc: string;
  images?: string[];
  workHours: {
    shift1: string;
    shift2?: string;
  };
  quota: string;
  roles: string[] | { role: string; tasks: string[] }[];
  tasks?: string[];
  requirements: string[];
  facilities: string[];
  testimonial?: {
    studentName: string;
    school: string;
    feedback: string;
  };
  contacts?: {
    telepon?: string;
    whatsapp?: string;
    email?: string;
  };
}

export interface PopUpDetailProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyDetail | null;
  isComparing?: boolean;
  onBandingkan?: (company: CompanyDetail | any) => void;
}

export default function PopUpDetail({
  isOpen,
  onClose,
  company,
  isComparing = false,
  onBandingkan,
}: PopUpDetailProps) {
  // State Slide
  const [currentSlide, setCurrentSlide] = useState(0);

  // Ref untuk Swipe / Drag Touch & Mouse
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // State Role Aktif
  const [selectedRole, setSelectedRole] = useState<string>("");

  // State Sub-modal (Review & Kontak)
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // State Form Review
  const [namaReviewer, setNamaReviewer] = useState("");
  const [asalSekolah, setAsalSekolah] = useState("");
  const [jurusanReviewer, setJurusanReviewer] = useState("");
  const [pesanReview, setPesanReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Susunan gambar slider
  const imageList = useMemo(() => {
    if (!company) return [];
    if (company.images && company.images.length > 0) return company.images;
    if (company.imageSrc) {
      return [
        company.imageSrc,
        "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80",
      ];
    }
    return ["/placeholder.png"];
  }, [company]);

  // Auto-play Slide Foto: Berpindah otomatis setiap 3.5 detik (tidak terhenti oleh hover mouse)
  useEffect(() => {
    if (!isOpen || imageList.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imageList.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isOpen, imageList.length]);

  // Logika Drag Mouse & Touch Geser Foto
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    touchStartX.current = clientX;
    touchEndX.current = clientX;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    touchEndX.current = clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipe = 25; // Sensitivitas geser ringan

    if (distance > minSwipe) {
      // Geser ke kiri -> gambar berikutnya
      setCurrentSlide((prev) => (prev + 1) % imageList.length);
    } else if (distance < -minSwipe) {
      // Geser ke kanan -> gambar sebelumnya
      setCurrentSlide((prev) => (prev - 1 + imageList.length) % imageList.length);
    } else if (Math.abs(distance) < 5) {
      // Klik biasa di laptop/desktop -> langsung lanjut ke foto berikutnya
      setCurrentSlide((prev) => (prev + 1) % imageList.length);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Normalisasi list role & tugas masing-masing role
  const roleList: { role: string; tasks: string[] }[] = useMemo(() => {
    if (!company) return [];
    if (
      company.roles &&
      company.roles.length > 0 &&
      typeof company.roles[0] === "object"
    ) {
      return company.roles as { role: string; tasks: string[] }[];
    }
    return ((company.roles as string[]) || ["Kasir", "Display Staff"]).map((r) => {
      const lower = r.toLowerCase();
      let defaultTasks =
        company.tasks && company.tasks.length > 0
          ? company.tasks
          : [
              "Membantu proses operasional harian",
              "Menata dan merapikan area kerja",
              "Memberikan pelayanan kepada pelanggan sesuai arahan",
            ];

      if (lower.includes("kasir")) {
        defaultTasks = [
          "Membantu proses transaksi",
          "Menata area kasir",
          "Memberikan pelayanan kepada pelanggan sesuai arahan",
        ];
      } else if (lower.includes("display")) {
        defaultTasks = [
          "Menata dan merapikan produk",
          "Memastikan produk tersusun sesuai kategori",
          "Membantu mengisi kembali produk yang tersedia",
        ];
      }
      return { role: r, tasks: defaultTasks };
    });
  }, [company]);

  // Sinkronisasi saat modal dibuka
  useEffect(() => {
    if (company && roleList.length > 0) {
      setSelectedRole(roleList[0].role);
      setCurrentSlide(0);
      setReviewSuccess(false);
    }
  }, [company, roleList]);

  if (!isOpen || !company) return null;

  const activeRoleData = roleList.find((r) => r.role === selectedRole);
  const currentTasks = activeRoleData ? activeRoleData.tasks : company.tasks || [];

  // Submit Review ke Strapi
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        data: {
          nama: namaReviewer,
          sekolah: asalSekolah,
          jurusan: jurusanReviewer,
          perusahaan: company.name,
          perusahaanId: company.id,
          komentar: pesanReview,
          isApproved: false,
        },
      };

      await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      ).catch(() => {});

      setReviewSuccess(true);
      setTimeout(() => {
        setIsReviewOpen(false);
        setNamaReviewer("");
        setAsalSekolah("");
        setJurusanReviewer("");
        setPesanReview("");
        setReviewSuccess(false);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-7 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto text-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Tutup Silang di Kanan Atas */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-gray-700 bg-white/90 hover:bg-white w-9 h-9 rounded-full flex items-center justify-center shadow-md transition text-lg cursor-pointer"
          aria-label="Tutup modal"
        >
          ✕
        </button>

        {/* 1. BANNER SLIDER (OTOMATIS + BISA KLIK / GESER RINGAN DI LAPTOP) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden mb-6 bg-gray-100 select-none cursor-pointer"
          title="Klik atau geser foto untuk berganti slide"
        >
          <Image
            src={imageList[currentSlide] || company.imageSrc}
            alt={company.name}
            fill
            unoptimized
            draggable={false}
            className="object-cover transition-opacity duration-500 ease-in-out"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-5 sm:p-7 text-white pointer-events-none">
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

          {/* Indikator Titik Slider di Bagian Tengah Bawah Foto */}
          {imageList.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
              {imageList.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(i);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentSlide === i ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 2. JAM KERJA & KUOTA SISWA */}
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

        {/* 3. ROLE YANG DIBUTUHKAN (Warna Berubah Sesuai Role Terpilih) */}
        {roleList.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-3">
              ROLE YANG DIBUTUHKAN:
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {roleList.map((r, idx) => {
                const isActive = selectedRole === r.role;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedRole(r.role)}
                    className={`px-5 py-1.5 rounded-full border text-sm font-semibold transition cursor-pointer ${
                      isActive
                        ? "bg-[#2563eb] text-white border-[#2563eb] shadow-sm"
                        : "border-blue-600 text-blue-600 bg-white hover:bg-blue-50"
                    }`}
                  >
                    {r.role}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. HAL PERLU DIKERJAKAN (Dinamis Sesuai Role) */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-3">
            HAL PERLU DIKERJAKAN:
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 font-medium">
            {currentTasks.map((task, idx) => (
              <li key={idx}>{task}</li>
            ))}
          </ol>
        </div>

        {/* 5. DUA KOLOM: SYARAT BERKAS & FASILITAS */}
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

        {/* 6. TESTIMONI SISWA */}
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

        {/* 7. BARIS TOMBOL AKSI */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          {/* Tombol Maps */}
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

          {/* Tombol Bandingkan */}
          <button
            type="button"
            onClick={() => {
              if (onBandingkan) onBandingkan(company);
            }}
            className={`text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl flex items-center gap-1.5 transition cursor-pointer ${
              isComparing
                ? "bg-blue-100 text-blue-700 border border-blue-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
          >
            ⚖️ {isComparing ? "Terpilih" : "Bandingkan"}
          </button>

          {/* Tombol Review */}
          <button
            type="button"
            onClick={() => setIsReviewOpen(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
          >
            💬 Review
          </button>

          {/* Tombol Kontak */}
          <button
            type="button"
            onClick={() => setIsContactOpen(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
          >
            👤 Kontak
          </button>

          {/* Tombol Tutup */}
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs sm:text-sm font-semibold py-3 px-5 rounded-xl transition cursor-pointer"
          >
            Tutup
          </button>
        </div>

        {/* SUB-MODAL 1: FORM REVIEW (MODERASI STRAPI) */}
        {isReviewOpen && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsReviewOpen(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Tulis Review Pengalaman PKL
              </h3>
              <p className="text-xs text-gray-500 mb-5">
                Review kamu akan ditinjau oleh pihak sekolah/admin sebelum dipublikasikan.
              </p>

              {reviewSuccess ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl text-center text-sm font-medium">
                  🎉 Terima kasih! Review berhasil dikirim dan sedang menunggu moderasi admin.
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Perusahaan yang Direview
                    </label>
                    <input
                      type="text"
                      disabled
                      value={company.name}
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-700 font-semibold cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Riska Mufika"
                      value={namaReviewer}
                      onChange={(e) => setNamaReviewer(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Asal Sekolah *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: SMKN 2 Sumedang"
                        value={asalSekolah}
                        onChange={(e) => setAsalSekolah(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Jurusan *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: RPL / PM"
                        value={jurusanReviewer}
                        onChange={(e) => setJurusanReviewer(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Pengalaman & Ulasan *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Ceritakan suasana kerja, perlakuan pembimbing, dan hal yang kamu pelajari..."
                      value={pesanReview}
                      onChange={(e) => setPesanReview(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsReviewOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#2563eb] hover:bg-blue-700 text-white cursor-pointer transition disabled:opacity-50"
                    >
                      {isSubmitting ? "Mengirim..." : "Kirim Review"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* SUB-MODAL 2: DETAIL KONTAK (INFORMASI SAJA, TIDAK REDIRECT) */}
        {isContactOpen && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsContactOpen(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">
                  Kontak Narahubung PKL
                </h3>
                <button
                  type="button"
                  onClick={() => setIsContactOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-gray-500 mb-5">
                Saluran komunikasi resmi yang dapat dihubungi untuk konfirmasi dan pendaftaran PKL di {company.name}:
              </p>

              <div className="space-y-3 text-sm">
                <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3">
                  <span className="text-lg">📞</span>
                  <div>
                    <p className="text-[11px] text-gray-400 font-semibold uppercase">Telepon Kantor</p>
                    <p className="font-semibold text-gray-800">
                      {company.contacts?.telepon || "(0261) 201234 / HRD"}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3">
                  <span className="text-lg">💬</span>
                  <div>
                    <p className="text-[11px] text-gray-400 font-semibold uppercase">WhatsApp Humas / HR</p>
                    <p className="font-semibold text-gray-800">
                      {company.contacts?.whatsapp || "+62 812-3456-7890"}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3">
                  <span className="text-lg">✉️</span>
                  <div>
                    <p className="text-[11px] text-gray-400 font-semibold uppercase">Email Rekrutmen PKL</p>
                    <p className="font-semibold text-gray-800">
                      {company.contacts?.email || `pkl@${company.name.toLowerCase().replace(/\s+/g, "")}.co.id`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsContactOpen(false)}
                  className="w-full bg-[#182752] text-white py-2.5 rounded-xl font-semibold text-xs sm:text-sm hover:bg-[#131f42] transition cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}