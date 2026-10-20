import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-blue-950 border-t border-blue-900/40 text-white pt-16 pb-10">
      <div className="container mx-auto px-6 md:px-12">
        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-xs">
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
              <li><Link href="/daftar-tempat" className="hover:text-white">Daftar Tempat</Link></li>
              <li><Link href="/tentang-kami" className="hover:text-white">Tentang Kami</Link></li>
            </ul>
          </div>

          {/* Kolom 2: Jurusan */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white">Jurusan</h4>
            <ul className="space-y-2 text-gray-300">
              <li>RPL/PPLG</li>
              <li>MPLB</li>
              <li>AKL</li>
              <li>PM</li>
            </ul>
          </div>

          {/* Kolom 3: Ikuti Kami */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white">Ikuti Kami</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Facebook</li>
              <li>Instagram</li>
              <li>YouTube</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-blue-900/60 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-400 gap-4">
          <p>© 2026 Pusat Informasi Tempat PKL. Hak cipta dilindungi.</p>

          <div className="flex items-center gap-6">
            <span>Kebijakan Privasi</span>
          </div>

          {/* Social Icons Section */}
          <div className="flex items-center gap-3.5">
            <a href="https://www.facebook.com/share/14uhVhxiUB1/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <Image src="/icons/facebook.png" alt="Facebook" width={25} height={25} className="object-contain" />
            </a>
            <a href="https://www.instagram.com/smkn2sumedang.official?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <Image src="/icons/instagram.png" alt="Instagram" width={22} height={22} className="object-contain" />
            </a>
            <a href="https://youtube.com/@smkn2sumedang?si=-4xkE4VVyvYL-yz2" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <Image src="/icons/youtube.png" alt="Youtube" width={25} height={25} className="object-contain" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}