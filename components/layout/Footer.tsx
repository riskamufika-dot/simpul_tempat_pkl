import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white pt-16 pb-10">
      <div className="container mx-auto px-6 md:px-12">
        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16 text-xs">
          {/* Logo Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/logo TP.png"
              alt="Logo"
              width={70}
              height={70}
              className="h-auto object-contain"
            />
          </div>

          {/* Kolom 1: Navigasi */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white">Navigasi</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/" className="hover:text-white">Beranda</Link></li>
              <li><Link href="#daftar-tempat" className="hover:text-white">Daftar Tempat</Link></li>
              <li><Link href="#tentang-kami" className="hover:text-white">Tentang Kami</Link></li>
              <li><Link href="#bandingkan" className="hover:text-white">Bandingkan</Link></li>
            </ul>
          </div>

          {/* Kolom 2: Jurusan */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white">Jurusan</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="#" className="hover:text-white">RPL/PPLG</Link></li>
              <li><Link href="#" className="hover:text-white">MPLB</Link></li>
              <li><Link href="#" className="hover:text-white">AKL</Link></li>
              <li><Link href="#" className="hover:text-white">PM</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Sumber Daya */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white">Sumber Daya</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="#" className="hover:text-white">Panduan PKL</Link></li>
              <li><Link href="#" className="hover:text-white">Pertanyaan Umum</Link></li>
              <li><Link href="#" className="hover:text-white">Tips Memilih</Link></li>
              <li><Link href="#" className="hover:text-white">Bantuan</Link></li>
            </ul>
          </div>

          {/* Kolom 4: Perusahaan */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white">Perusahaan</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="#" className="hover:text-white">Tentang</Link></li>
              <li><Link href="#" className="hover:text-white">Karier</Link></li>
              <li><Link href="#" className="hover:text-white">Berita</Link></li>
              <li><Link href="#" className="hover:text-white">Kemitraan</Link></li>
              <li><Link href="#" className="hover:text-white">Media</Link></li>
            </ul>
          </div>

          {/* Kolom 5: Ikuti Kami */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white">Ikuti Kami</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white">Facebook</a></li>
              <li><a href="#" className="hover:text-white">Instagram</a></li>
              <li><a href="#" className="hover:text-white">YouTube</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-blue-900/60 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-400 gap-4">
          <p>© 2026 Pusat Informasi Tempat PKL. Hak cipta dilindungi.</p>
          
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white">Kebijakan Privasi</Link>
          </div>

          {/* Social Icons Section */}
        <div className="flex items-center gap-4">
          <a href="#" className="hover:opacity-80 transition-opacity">
            <Image src="/icons/facebook.png" alt="Facebook" width={20} height={20} />
          </a>
          <a href="https://www.instagram.com/smkn2sumedang.official?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
             className="hover:opacity-80 transition-opacity">
            <Image src="/icons/instagramm.png" alt="Instagram" width={20} height={20} />
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity">
            <Image src="/icons/youtube.png" alt="Youtube" width={20} height={20} />
          </a>
        </div>
        </div>
      </div>
    </footer>
  );
}