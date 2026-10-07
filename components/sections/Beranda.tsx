'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const targetElement = document.getElementById('daftar-tempat');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(searchQuery ? `/daftar-tempat?search=${encodeURIComponent(searchQuery)}` : '/daftar-tempat');
    }
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
      </div>
    </section>
  );
}