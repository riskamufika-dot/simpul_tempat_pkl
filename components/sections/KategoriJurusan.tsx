'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getMajors } from '@/lib/strapi';

interface JurusanItem {
  id: string | number;
  code: string;
  name: string;
  count: string;
  description: string;
  imageSrc: string;
  queryFilter: string;
}

export default function KategoriJurusan() {
  const [dataJurusan, setDataJurusan] = useState<JurusanItem[]>([]);

  useEffect(() => {
    async function loadMajors() {
      try {
        const majors = await getMajors();
        if (Array.isArray(majors) && majors.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: JurusanItem[] = majors.map((m: any, index: number) => {
            const code =
              m.code ||
              m.abbreviation ||
              m.attributes?.code ||
              m.attributes?.abbreviation ||
              'UMUM';
            const countValue =
              m.companies_count ??
              m.attributes?.companies_count ??
              (Array.isArray(m.companies)
                ? m.companies.length
                : Array.isArray(m.attributes?.companies?.data)
                ? m.attributes.companies.data.length
                : 0);

            let fallbackLogo = '/images/logo pplg.png';
            const lowerCode = code.toLowerCase();
            if (lowerCode.includes('akl')) fallbackLogo = '/images/logo akl.png';
            if (lowerCode.includes('mplb')) fallbackLogo = '/images/logo mplb.png';
            if (lowerCode.includes('pm')) fallbackLogo = '/images/logo pm.png';

            const rawLogo =
              m.logo?.url ||
              m.icon?.url ||
              m.attributes?.logo?.data?.attributes?.url ||
              m.attributes?.icon?.data?.attributes?.url;

            return {
              id: m.id ?? m.documentId ?? `jurusan-${index}`,
              code: code,
              name: m.name || m.title || m.attributes?.name || m.attributes?.title || '',
              count: `${countValue} Tempat`,
              description:
                m.description ||
                m.attributes?.description ||
                `Tempat PKL siswa jurusan ${code}`,
              imageSrc: rawLogo || fallbackLogo,
              queryFilter: m.name || m.attributes?.name || code,
            };
          });
          setDataJurusan(mapped);
        }
      } catch (err) {
        console.error('Gagal mengambil kategori jurusan:', err);
      }
    }
    loadMajors();
  }, []);

  if (dataJurusan.length === 0) return null;

  return (
    <section className="bg-[#182752] py-12 sm:py-20 px-4 sm:px-10 lg:px-16 text-white w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2 sm:mb-3">
            Kategori Jurusan PKL
          </h2>
          <p className="text-gray-300 text-xs sm:text-base font-normal">
            Jelajahi tempat PKL berdasarkan bidang yang paling diminati siswa
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {dataJurusan.map((item, index) => (
            <div
              key={item.id ?? index}
              className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-6 text-slate-900 shadow-xl hover:shadow-2xl sm:hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-center mb-3 sm:mb-6">
                  <div className="relative w-12 h-12 sm:w-24 sm:h-24 lg:w-28 lg:h-28 drop-shadow-md">
                    <Image
                      src={item.imageSrc}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 64px, 112px"
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="text-left mb-2 sm:mb-3">
                  <span className="inline-block bg-[#e0edff] text-[#2563eb] text-[9px] sm:text-[11px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                    {item.code} • {item.count}
                  </span>
                </div>

                <h3 className="text-left font-bold text-[11px] sm:text-lg text-gray-900 leading-snug mb-3 sm:mb-5 line-clamp-2 sm:line-clamp-none sm:min-h-[52px]">
                  {item.name}
                </h3>
              </div>

              <div>
                <Link
                  href={`/daftar-tempat?jurusan=${encodeURIComponent(item.queryFilter)}`}
                  className="w-full bg-[#1c3879] hover:bg-[#162d61] text-white text-xs sm:text-sm font-semibold py-1.5 sm:py-2.5 rounded-xl block text-center transition shadow-sm cursor-pointer"
                >
                  Lihat
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}