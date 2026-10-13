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
  queryFilter: string; // Nilai jurusan persis sesuai database Strapi/Dummy
}

const jurusanList: JurusanItem[] = [
  {
    id: 'rpl',
    code: 'RPL',
    name: 'Rekayasa Perangkat Lunak',
    count: '5 Tempat',
    description: 'Tempat PKL siswa dengan Jurusan RPL',
    imageSrc: '/images/logo pplg.png',
    queryFilter: 'Rekayasa Perangkat Lunak (RPL)', // Sesuaikan format di database jika hanya "RPL" atau "PPLG"
  },
  {
    id: 'akl',
    code: 'AKL',
    name: 'Akutansi Keuangan dan Lembaga',
    count: '5 Tempat',
    description: 'Tempat PKL siswa dengan Jurusan AKL',
    imageSrc: '/images/logo akl.png',
    queryFilter: 'Akuntansi Keuangan dan Lembaga (AKL)',
  },
  {
    id: 'mplb',
    code: 'MPLB',
    name: 'Menejemen Perkantoran dan Layanan Bisnis',
    count: '5 Tempat',
    description: 'Tempat PKL siswa dengan Jurusan MPLB',
    imageSrc: '/images/logo mplb.png',
    queryFilter: 'Manajemen Perkantoran dan Layanan Bisnis (MPLB)',
  },
  {
    id: 'pm',
    code: 'PM',
    name: 'Pemasaran',
    count: '5 Tempat',
    description: 'Tempat PKL siswa dengan Jurusan PM',
    imageSrc: '/images/logo pm.png',
    queryFilter: 'Pemasaran (PM)',
  },
];

export default function KategoriJurusan() {
  return (
    <section className="bg-[#182752] py-20 px-6 sm:px-10 lg:px-16 text-white w-full">
      <div className="max-w-7xl mx-auto">
        {/* Judul Section */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            Kategori Jurusan PKL
          </h2>
          <p className="text-gray-300 text-sm sm:text-base font-normal">
            Jelajahi tempat PKL berdasarkan bidang yang paling diminati siswa
          </p>
        </div>

        {/* Grid Kartu Jurusan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {jurusanList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 text-slate-900 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Logo Jurusan di Tengah */}
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

                {/* Badge Rata Kiri */}
                <div className="text-left mb-3">
                  <span className="inline-block bg-[#e0edff] text-[#2563eb] text-[11px] font-bold px-3 py-1 rounded-full">
                    {item.code} - {item.count}
                  </span>
                </div>

                {/* Judul Jurusan Rata Kiri */}
                <h3 className="text-left font-bold text-lg text-gray-900 leading-snug mb-2 min-h-[52px]">
                  {item.name}
                </h3>

                {/* Deskripsi Rata Kiri */}
                <p className="text-left text-gray-500 text-xs leading-relaxed mb-6 font-normal">
                  {item.description}
                </p>
              </div>

              {/* Tombol Lihat: Mengarahkan langsung ke filter jurusan di katalog */}
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