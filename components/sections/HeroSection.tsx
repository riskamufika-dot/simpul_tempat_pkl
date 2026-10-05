'use client';

import { useState } from 'react';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic pencarian
  };

  return (
    <section className="bg-white py-16 md:py-24 px-4 text-center">
      <div className="container mx-auto max-w-4xl space-y-12">
        {/* Banner Visi 1: Search Focus */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-sky-800 tracking-tight">
            Temukan tempat PKL
          </h1>
          <p className="text-gray-600 text-xs md:text-sm leading-relaxed max-w-lg mx-auto">
            Pusat informasi lengkap untuk membantu siswa menemukan tempat PKL yang sesuai minat dan kebutuhan
          </p>

          {/* Search Bar Input */}
          <form onSubmit={handleSearch} className="pt-4 flex items-center justify-center gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 text-xs">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama PT, jurusan, dll....."
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-700 bg-gray-50/50"
              />
            </div>
            <button
              type="submit"
              className="bg-sky-800 hover:bg-sky-900 text-white text-xs font-semibold px-6 py-2.5 rounded-full transition"
            >
              Cari
            </button>
          </form>
        </div>

        <hr className="border-gray-100 my-12" />

        {/* Banner Visi 2: Value Proposition Header */}
        <div className="space-y-3 max-w-3xl mx-auto pt-4">
          <h2 className="text-3xl md:text-5xl font-black text-black tracking-tight leading-tight">
            Cari & Bandingkan Tempat PKL
          </h2>
          <h3 className="text-2xl md:text-4xl font-extrabold text-blue-900">
            Sesuai Kompetensi Jurusanmu
          </h3>
          <p className="text-gray-500 text-xs md:text-sm max-w-xl mx-auto pt-2 leading-relaxed">
            Dapatkan informasi transparan mengenai jobdesk harian, besaran uang saku, sisa kuota, serta ulasan nyata kakak kelas terdahulu.
          </p>
        </div>
      </div>
    </section>
  );
}