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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onBandingkan?: (company: CompanyDetail | any) => void;
}

/* ---------- Ikon SVG ---------- */

const ikonKelas = "h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4";

const IkonTimbangan = () => (
  <svg className={ikonKelas} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);

const IkonReview = () => (
  <svg className={ikonKelas} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h8M8 14h5m-9 6l3-3h10a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14z" />
  </svg>
);

const IkonKontak = () => (
  <svg className={ikonKelas} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IkonPeta = () => (
  <svg className={ikonKelas} fill="currentColor" viewBox="0 0 20 20" aria-hidden>
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const IkonDokumen = () => (
  <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IkonFasilitas = () => (
  <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

/* ---------- Helper Pemecah Teks ---------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cleanTaskList(rawTasks: any): string[] {
  if (!rawTasks) return [];
  const list = Array.isArray(rawTasks) ? rawTasks : [rawTasks];

  return list
    .flatMap((item) => {
      if (typeof item === "string") {
        let trimmed = item.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) return parsed;
          } catch {}
        }
        return trimmed.split(/\r?\n+/);
      }
      return String(item);
    })
    .map((s: string) =>
      s
        .trim()
        .replace(/^[-•*]\s*/, "")
        .replace(/^\d+[.)]\s*/, "")
        .replace(/^["'](.*)["']$/, "$1")
        .trim()
    )
    .filter((s: string) => s.length > 0 && s !== "[" && s !== "]");
}

/* ---------- Komponen ---------- */

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

    const rawRoles = company.roles;
    let rolesArr: string[] = [];

    if (Array.isArray(rawRoles)) {
      rolesArr = rawRoles
        .map((r) => (typeof r === "object" && r !== null && "role" in r ? (r as any).role : String(r)))
        .filter(Boolean);
    } else if (typeof rawRoles === "string") {
      rolesArr = [rawRoles];
    } else {
      rolesArr = ["Staff PKL"];
    }

    if (rolesArr.length === 0) rolesArr = ["Staff PKL"];

    const allTasks = cleanTaskList(company.tasks);

    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

    const findMatchingRoleIndex = (text: string) => {
      const cleanT = norm(text);
      if (!cleanT) return -1;
      return rolesArr.findIndex((r) => {
        const cleanR = norm(r);
        return cleanT === cleanR || cleanT.startsWith(cleanR) || cleanR.startsWith(cleanT);
      });
    };

    const groupedMap = new Map<string, string[]>();
    rolesArr.forEach((r) => groupedMap.set(r, []));

    let currentRole = rolesArr[0];

    for (const item of allTasks) {
      const matchIdx = findMatchingRoleIndex(item);
      if (matchIdx !== -1) {
        currentRole = rolesArr[matchIdx];
        if (item.includes(":") && item.split(":")[1].trim().length > 0) {
          const detail = item.split(":").slice(1).join(":").trim();
          groupedMap.get(currentRole)?.push(detail);
        }
      } else {
        groupedMap.get(currentRole)?.push(item);
      }
    }

    const hasGroupedTasks = Array.from(groupedMap.values()).some((arr) => arr.length > 0);

    if (hasGroupedTasks) {
      return rolesArr.map((r) => ({
        role: r,
        tasks:
          (groupedMap.get(r)?.length ?? 0) > 0
            ? (groupedMap.get(r) as string[])
            : ["Mengikuti arahan mentor dan penempatan unit kerja."],
      }));
    }

    return rolesArr.map((r, idx) => ({
      role: r,
      tasks: allTasks[idx] ? [allTasks[idx]] : allTasks,
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

  const activeRoleData = roleList.find((r) => r.role === selectedRole);
  const currentTasks =
    activeRoleData && activeRoleData.tasks.length > 0
      ? activeRoleData.tasks
      : roleList[0]?.tasks || cleanTaskList(company.tasks);

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
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const mapsHref =
    company.mapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      company.name + " " + company.address
    )}`;

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
          aria-label="Tutup"
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
          className="relative w-full h-52 sm:h-72 rounded-2xl overflow-hidden mb-5 sm:mb-6 bg-gray-100 select-none cursor-pointer"
        >
          <Image
            src={imageList[currentSlide] || company.imageSrc}
            alt={company.name}
            fill
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover transition-opacity duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-4 sm:p-7 text-white pointer-events-none">
            <span className="bg-[#dbeafe] text-[#2563eb] text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full w-fit mb-2 shadow-sm">
              {company.category}
            </span>
            <h2 className="text-xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {company.name}
            </h2>
            <div className="flex items-start gap-1.5 text-[11px] sm:text-sm text-gray-200 mt-1">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="line-clamp-2">{company.address}</span>
            </div>
          </div>

          {imageList.length > 1 && (
            <div className="absolute top-3 left-3 flex items-center gap-2 z-10 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
              {imageList.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Foto ${i + 1}`}
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
        <div className="grid grid-cols-2 bg-[#f0f5ff] rounded-2xl p-3 sm:p-5 mb-5 sm:mb-6 text-center border border-blue-50">
          <div className="border-r border-blue-200 pr-2 sm:pr-3 flex flex-col justify-center">
            <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 tracking-wider uppercase block mb-1">
              JAM KERJA
            </span>
            <p className="text-[11px] sm:text-sm font-semibold text-gray-800">
              {company.workHours.shift1}
            </p>
            {company.workHours.shift2 && (
              <p className="text-[11px] sm:text-sm font-semibold text-gray-800">
                {company.workHours.shift2}
              </p>
            )}
          </div>
          <div className="pl-2 sm:pl-3 flex flex-col justify-center">
            <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 tracking-wider uppercase block mb-1">
              KUOTA SISWA
            </span>
            <p className="text-sm sm:text-base font-extrabold text-gray-900">
              {company.quota}
            </p>
          </div>
        </div>

        {/* Role Yang Dibutuhkan */}
        {roleList.length > 0 && (
          <div className="mb-5 sm:mb-6">
            <h4 className="text-[11px] sm:text-xs font-bold text-gray-500 tracking-wider uppercase mb-3">
              ROLE YANG DIBUTUHKAN:
            </h4>
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {roleList.map((r, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedRole(r.role)}
                  className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm font-semibold transition cursor-pointer ${
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

        {/* Hal Perlu Dikerjakan */}
        <div className="mb-5 sm:mb-6">
          <h4 className="text-[11px] sm:text-xs font-bold text-gray-500 tracking-wider uppercase mb-3">
            HAL PERLU DIKERJAKAN:
          </h4>
          {currentTasks.length > 0 ? (
            <div className="space-y-2">
              {currentTasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 leading-relaxed"
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

        {/* Syarat Berkas & Fasilitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div className="bg-[#f3f7fd] p-4 sm:p-5 rounded-2xl border border-blue-50/60">
            <h4 className="text-[11px] sm:text-xs font-bold text-gray-900 tracking-wider uppercase mb-3 flex items-center gap-2">
              <IkonDokumen /> SYARAT BERKAS:
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

          <div className="bg-[#f3f7fd] p-4 sm:p-5 rounded-2xl border border-blue-50/60">
            <h4 className="text-[11px] sm:text-xs font-bold text-gray-900 tracking-wider uppercase mb-3 flex items-center gap-2">
              <IkonFasilitas /> FASILITAS:
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
          <div className="bg-[#f0f6ff] p-4 sm:p-6 rounded-2xl border border-blue-100 mb-5 sm:mb-6">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-xs sm:text-sm">
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

        {/* Tombol Aksi: Terkunci 1 baris pas, tidak bisa digulir */}
        <div className="grid grid-cols-5 gap-1 pt-2 sm:gap-2">
          {/* Tombol Maps */}
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 rounded-xl bg-[#182752] px-1 py-2 text-[10px] font-semibold text-white transition hover:bg-[#131f42] sm:px-3 sm:py-2.5 sm:text-xs"
          >
            <IkonPeta />
            <span>Maps</span>
          </a>

          {/* Tombol Bandingkan */}
          <button
            type="button"
            onClick={() => onBandingkan && onBandingkan(company)}
            className={`flex cursor-pointer items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold transition sm:px-3 sm:py-2.5 sm:text-xs ${
              isComparing
                ? "border border-blue-300 bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            <IkonTimbangan />
            <span>{isComparing ? "Terpilih" : "Bandingkan"}</span>
          </button>

          {/* Tombol Review */}
          <button
            type="button"
            onClick={() => setIsReviewOpen(true)}
            className="flex cursor-pointer items-center justify-center gap-1 rounded-xl bg-gray-100 px-1 py-2 text-[10px] font-semibold text-gray-800 transition hover:bg-gray-200 sm:px-3 sm:py-2.5 sm:text-xs"
          >
            <IkonReview />
            <span>Review</span>
          </button>

          {/* Tombol Kontak */}
          <button
            type="button"
            onClick={() => setIsContactOpen(true)}
            className="flex cursor-pointer items-center justify-center gap-1 rounded-xl bg-gray-100 px-1 py-2 text-[10px] font-semibold text-gray-800 transition hover:bg-gray-200 sm:px-3 sm:py-2.5 sm:text-xs"
          >
            <IkonKontak />
            <span>Kontak</span>
          </button>

          {/* Tombol Tutup */}
          <button
            type="button"
            onClick={onClose}
            className="flex cursor-pointer items-center justify-center rounded-xl bg-gray-200 px-1 py-2 text-[10px] font-semibold text-gray-800 transition hover:bg-gray-300 sm:px-3 sm:py-2.5 sm:text-xs"
          >
            <span>Tutup</span>
          </button>
        </div>

        {/* Modal Form Review */}
        {isReviewOpen && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsReviewOpen(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                Tulis Review Pengalaman PKL
              </h3>
              <p className="text-xs text-gray-500 mb-5">
                Review kamu akan ditinjau oleh pihak sekolah/admin sebelum dipublikasikan.
              </p>

              {reviewSuccess ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl text-center text-sm font-medium">
                  Terima kasih! Review berhasil dikirim dan menunggu moderasi admin.
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      Pengalaman &amp; Ulasan *
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
              className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">Kontak Narahubung</h3>
                <button
                  type="button"
                  aria-label="Tutup kontak"
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
                  <p className="font-semibold text-gray-800 break-all">
                    {company.contacts?.email ||
                      `pkl@${company.name.toLowerCase().replace(/\s+/g, "")}.co.id`}
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