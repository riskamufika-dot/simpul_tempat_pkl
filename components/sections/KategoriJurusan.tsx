'use client';

import Link from 'next/link';
import Image from 'next/image';

interface JurusanItem {
  id: string;
  code: string;
  name: string;
  count: string;
  description: string;
  imageSrc: string;
}

const jurusanList: JurusanItem[] = [
  {
    id: 'rpl',
    code: 'RPL',
    name: 'Rekayasa Perangkat Lunak',
    count: '5 Tempat',
    description: 'Tempat PKL siswa dengan Jurusan RPL',
    imageSrc: '/images/logo pplg.png',
  },
  {
    id: 'akl',
    code: 'AKL',
    name: 'Akutansi Keuangan dan Lembaga',
    count: '5 Tempat',
    description: 'Tempat PKL siswa dengan Jurusan AKL',
    imageSrc: '/images/logo akl.png',
  },
  {
    id: 'mplb',
    code: 'MPLB',
    name: 'Menejemen Perkantoran dan Layanan Bisnis',
    count: '5 Tempat',
    description: 'Tempat PKL siswa dengan Jurusan MPLB',
    imageSrc: '/images/logo mplb.png',
  },
  {
    id: 'pm',
    code: 'PM',
    name: 'Pemasaran',
    count: '5 Tempat',
    description: 'Tempat PKL siswa dengan Jurusan PM',
    imageSrc: '/images/logo pm.png',
  },
];

export default function KategoriJurusan() {
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
          {jurusanList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 text-center text-slate-900 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Logo Jurusan Gambar */}
                <div className="flex justify-center mb-5">
                  <div className="relative w-28 h-28 drop-shadow-md">
                    <Image
                      src={item.imageSrc}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Badge Code & Count */}
                <div className="inline-block bg-sky-100 text-sky-700 text-[11px] font-bold px-3 py-1 rounded-full mb-3">
                  {item.code} - {item.count}
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-base text-gray-900 leading-snug mb-3 min-h-[48px] flex items-center justify-center">
                  {item.name}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-xs leading-relaxed mb-6 font-normal">
                  {item.description}
                </p>
              </div>

              {/* Action Link */}
              <Link
                href={`/daftar-tempat?jurusan=${encodeURIComponent(item.name)}`}
                className="w-full bg-[#1e3a8a] hover:bg-blue-900 text-white text-xs font-semibold py-3 rounded-full block transition shadow-md"
              >
                Lihat
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
