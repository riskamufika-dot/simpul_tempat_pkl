"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://simpul-production.up.railway.app";

export interface CompanyDetail {
  id: string | number;
  documentId?: string;
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
    phone?: string;
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

// Helper pembersih format teks list (menghapus tanda petik, kurung siku, dan bullet berlebih)
function cleanTaskList(rawTasks: any): string[] {
  if (!rawTasks) return [];
  const list = Array.isArray(rawTasks) ? rawTasks : [rawTasks];

  return list
    .flatMap((item) => {
      if (typeof item === "string") {
        const trimmed = item.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) return parsed;
          } catch {}
        }
        return item.split(/\r?\n/);
      }
      return String(item);
    })
    .map((s: string) =>
      s
        .trim()
        .replace(/^[-•*]\s*/, "")
        .replace(/^\d+[\.\)]\s*/, "")
        .replace(/^["'](.*)["']$/, "$1")
        .trim()
    )
    .filter((s: string) => s.length > 0 && s !== "[" && s !== "]");
}

export default function PopUpDetail({
  isOpen,
  onClose,
  company,
  isComparing = false,
  onBandingkan,
}: PopUpDetailProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const [namaReviewer, setNamaReviewer] = useState("");
  const [asalSekolah, setAsalSekolah] = useState("");
  const [jurusanReviewer, setJurusanReviewer] = useState("");
  const [pesanReview, setPesanReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const imageList = useMemo(() => {
    if (!company) return [];
    if (company.images && company.images.length > 0) return company.images;
    if (company.imageSrc) return [company.imageSrc];
    return ["/placeholder.png"];
  }, [company]);

  useEffect(() => {
    if (!isOpen || imageList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imageList.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isOpen, imageList.length]);

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
    if (distance > 25) {
      setCurrentSlide((prev) => (prev + 1) % imageList.length);
    } else if (distance < -25) {
      setCurrentSlide((prev) => (prev - 1 + imageList.length) % imageList.length);
    } else if (Math.abs(distance) < 5) {
      setCurrentSlide((prev) => (prev + 1) % imageList.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Normalisasi daftar role dan tugas
  const roleList: { role: string; tasks: string[] }[] = useMemo(() => {
    if (!company) return [];

    if (
      company.roles &&
      company.roles.length > 0 &&
      typeof company.roles[0] === "object"
    ) {
      return (company.roles as { role: string; tasks: string[] }[]).map((r) => ({
        role: r.role,
        tasks: cleanTaskList(r.tasks),
      }));
    }

    const defaultRoleTasks = cleanTaskList(company.tasks);
    return ((company.roles as string[]) || ["Staff PKL"]).map((r) => ({
      role: r,
      tasks: defaultRoleTasks,
    }));
  }, [company]);

  useEffect(() => {
    if (company && roleList.length > 0) {
      setSelectedRole(roleList[0].role);
      setCurrentSlide(0);
      setReviewSuccess(false);
      setReviewError(null);
    }
  }, [company, roleList]);

  if (!isOpen || !company) return null;

  // Tugas yang sedang aktif mengikuti tombol role yang diklik
  const activeRoleData = roleList.find((r) => r.role === selectedRole);
  const currentTasks =
    activeRoleData && activeRoleData.tasks.length > 0
      ? activeRoleData.tasks
      : cleanTaskList(company.tasks);

  const cleanedRequirements = cleanTaskList(company.requirements);
  const cleanedFacilities = cleanTaskList(company.facilities);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setReviewError(null);

    try {
      const payload = {
        data: {
          company: company.documentId || company.id,
          full_name: namaReviewer,
          school_name: asalSekolah,
          major: jurusanReviewer,
          review: pesanReview,
          is_featured: false,
        },
      };

      const res = await fetch(`${STRAPI_URL}/api/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal mengirim ulasan ke server.");

      setReviewSuccess(true);
      setTimeout(() => {
        setIsReviewOpen(false);
        setNamaReviewer("");
        setAsalSekolah("");
        setJurusanReviewer("");
        setPesanReview("");
        setReviewSuccess(false);
      }, 1800);
    } catch (err: any) {
      setReviewError(err.message || "Terjadi kesalahan.");
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
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-gray-700 bg-white/90 hover:bg-white w-9 h-9 rounded-full flex items-center justify-center shadow-md transition text-lg cursor-pointer"
        >
          ✕
        </button>

        {/* Banner Slider */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden mb-6 bg-gray-100 select-none cursor-pointer"
        >
          <Image
            src={imageList[currentSlide] || company.imageSrc}
            alt={company.name}
            fill
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover transition-opacity duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-5 sm:p-7 text-white pointer-events-none">
            <span className="bg-[#dbeafe] text-[#2563eb] text-xs font-semibold px-3.5 py-1 rounded-full w-fit mb-2 shadow-sm">
              {company.category}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {company.name}
            </h2>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-200 mt-1">
              <svg
                className="w-4 h-4 text-red-500 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{company.address}</span>
            </div>
          </div>

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
                    currentSlide === i ? "w-6 bg-white" : "w-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Jam Kerja & Kuota Siswa */}
        <div className="grid grid-cols-2 bg-[#f0f5ff] rounded-2xl p-4 sm:p-5 mb-6 text-center border border-blue-50">
          <div className="border-r border-blue-200 pr-3 flex flex-col justify-center">
            <span className="text-[11px] font-bold text-gray-500 tracking-wider uppercase block mb-1">
              JAM KERJA
            </span>
            <p className="text-xs sm:text-sm font-semibold text-gray-800">
              {company.workHours.shift1}
            </p>
            {company.workHours.shift2 && (
              <p className="text-xs sm:text-sm font-semibold text-gray-800">
                {company.workHours.shift2}
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

        {/* Role Yang Dibutuhkan */}
        {roleList.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-3">
              ROLE YANG DIBUTUHKAN:
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {roleList.map((r, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedRole(r.role)}
                  className={`px-6 py-2 rounded-full border text-sm font-semibold transition cursor-pointer ${
                    selectedRole === r.role
                      ? "border-[#2563eb] text-[#2563eb] bg-[#eff6ff] shadow-sm ring-1 ring-blue-500"
                      : "border-blue-400 text-blue-600 bg-white hover:bg-blue-50"
                  }`}
                >
                  {r.role}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hal Perlu Dikerjakan (Daftar Rapi Bernomor) */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-3.5 flex items-center gap-1.5">
            HAL PERLU DIKERJAKAN:
          </h4>
          {currentTasks.length > 0 ? (
            <div className="space-y-2.5">
              {currentTasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 leading-relaxed"
                >
                  <span className="font-semibold text-gray-900 select-none shrink-0 w-5">
                    {idx + 1}.
                  </span>
                  <p className="flex-1 break-words">{task}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-gray-400 italic">
              Mengikuti arahan mentor dan penempatan unit kerja.
            </p>
          )}
        </div>

        {/* Syarat Berkas & Fasilitas (Format List Sejajar) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#f3f7fd] p-5 rounded-2xl border border-blue-50/60">
            <h4 className="text-xs font-bold text-gray-900 tracking-wider uppercase mb-3 flex items-center gap-2">
              <span className="text-sm">📄</span> SYARAT BERKAS:
            </h4>
            <div className="space-y-2">
              {cleanedRequirements.length > 0 ? (
                cleanedRequirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 leading-relaxed"
                  >
                    <span className="font-semibold text-gray-900 select-none shrink-0 w-4">
                      {idx + 1}.
                    </span>
                    <p className="flex-1 break-words">{req}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">
                  Sesuai ketentuan sekolah dan instansi penempatan.
                </p>
              )}
            </div>
          </div>

          <div className="bg-[#f3f7fd] p-5 rounded-2xl border border-blue-50/60">
            <h4 className="text-xs font-bold text-gray-900 tracking-wider uppercase mb-3 flex items-center gap-2">
              <span className="text-sm">✨</span> FASILITAS:
            </h4>
            <div className="space-y-2">
              {cleanedFacilities.length > 0 ? (
                cleanedFacilities.map((fac, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 leading-relaxed"
                  >
                    <span className="font-semibold text-gray-900 select-none shrink-0 w-4">
                      {idx + 1}.
                    </span>
                    <p className="flex-1 break-words">{fac}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">
                  Fasilitas operasional standar tempat PKL.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Testimoni Siswa */}
        {company.testimonial && company.testimonial.feedback && (
          <div className="bg-[#f0f6ff] p-5 sm:p-6 rounded-2xl border border-blue-100 mb-6">
            <div className="flex items-center gap-3.5 mb-2.5">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-sm">
                <span className="font-bold text-slate-900">
                  {company.testimonial.studentName}{" "}
                </span>
                {company.testimonial.school && (
                  <span className="text-slate-500 font-medium">
                    ({company.testimonial.school})
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-0.5">
              “{company.testimonial.feedback}”
            </p>
          </div>
        )}

        {/* Tombol Aksi */}
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
            Buka Lokasi Google Maps
          </a>

          <button
            type="button"
            onClick={() => onBandingkan && onBandingkan(company)}
            className={`text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl flex items-center gap-1.5 transition cursor-pointer ${
              isComparing
                ? "bg-blue-100 text-blue-700 border border-blue-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
          >
            ⚖️ {isComparing ? "Terpilih" : "Bandingkan"}
          </button>

          <button
            type="button"
            onClick={() => setIsReviewOpen(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl transition cursor-pointer"
          >
            💬 Review
          </button>

          <button
            type="button"
            onClick={() => setIsContactOpen(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl transition cursor-pointer"
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

        {/* Modal Form Review */}
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
                Review kamu akan ditinjau oleh pihak sekolah/admin sebelum dipublikasikan[cite: 8].
              </p>

              {reviewSuccess ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl text-center text-sm font-medium">
                  🎉 Terima kasih! Review berhasil dikirim dan menunggu moderasi admin[cite: 8].
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {reviewError && (
                    <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-200">
                      {reviewError}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Perusahaan
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
                        placeholder="Contoh: RPL"
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
                      placeholder="Ceritakan suasana kerja dan bimbingan selama PKL..."
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

        {/* Modal Kontak */}
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
                <h3 className="text-lg font-bold text-gray-900">Kontak Narahubung</h3>
                <button
                  type="button"
                  onClick={() => setIsContactOpen(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-sm mt-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500">Telepon:</span>
                  <p className="font-semibold text-gray-800">
                    {company.contacts?.phone || company.contacts?.telepon || "(0261) 201234"}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500">WhatsApp:</span>
                  <p className="font-semibold text-gray-800">
                    {company.contacts?.whatsapp || "+62 812-3456-7890"}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500">Email:</span>
                  <p className="font-semibold text-gray-800">
                    {company.contacts?.email || `pkl@${company.name.toLowerCase().replace(/\s+/g, "")}.co.id`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}