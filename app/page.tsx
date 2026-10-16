import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeaderBeranda from '@/components/sections/Beranda';
import FiturUtama from '@/components/sections/FiturUtama';
import LangkahPKL from '@/components/sections/Langkah';
import KategoriJurusan from '@/components/sections/KategoriJurusan';
import Testimonial from '@/components/sections/Testimonial';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section id="beranda">
        <HeaderBeranda />
        <FiturUtama />
        <LangkahPKL />
        <KategoriJurusan />
        <Testimonial />
      </section>

      <Footer />
    </main>
  );
}