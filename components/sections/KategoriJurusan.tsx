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
          const mapped: JurusanItem[] = majors.map((m: any) => {
            const code = m.code || m.abbreviation || 'UMUM';
            const countValue = m.companies_count ?? (Array.isArray(m.companies) ? m.companies.length : 0);

            let fallbackLogo = '/images/logo pplg.png';
            const lowerCode = code.toLowerCase();
            if (lowerCode.includes('akl')) fallbackLogo = '/images/logo akl.png';
            if (lowerCode.includes('mplb')) fallbackLogo = '/images/logo mplb.png';
            if (lowerCode.includes('pm')) fallbackLogo = '/images/logo pm.png';

            return {
              id: m.id,
              code: code,
              name: m.name || m.title || '',
              count: `${countValue} Tempat`,
              description: m.description || `Tempat PKL siswa jurusan ${code}`,
              imageSrc: m.logo?.url || m.icon?.url || fallbackLogo,
              queryFilter: m.name || code,
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
    <section className="bg-[#182752] py-20 px-6 sm:px-10 lg:px-16 text-white w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            Kategori Jurusan PKL
          </h2>
          <p className="text-gray-300 text-sm sm:text-base font-normal">
            Jelajahi tempat PKL berdasarkan bidang yang paling diminati siswa
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dataJurusan.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 text-slate-900 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-center mb-6">
                  <div className="relative w-28 h-28 drop-shadow-md">
                    <Image
                      src={item.imageSrc}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="text-left mb-3">
                  <span className="inline-block bg-[#e0edff] text-[#2563eb] text-[11px] font-bold px-3 py-1 rounded-full">
                    {item.code} • {item.count}
                  </span>
                </div>

                <h3 className="text-left font-bold text-lg text-gray-900 leading-snug mb-2 min-h-[52px]">
                  {item.name}
                </h3>

                <p className="text-left text-gray-500 text-xs leading-relaxed mb-6 font-normal line-clamp-3">
                  {item.description}
                </p>
              </div>

              <div>
                <Link
                  href={`/daftar-tempat?jurusan=${encodeURIComponent(item.queryFilter)}`}
                  className="w-full bg-[#1c3879] hover:bg-[#162d61] text-white text-sm font-semibold py-2.5 rounded-xl block text-center transition shadow-sm cursor-pointer"
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