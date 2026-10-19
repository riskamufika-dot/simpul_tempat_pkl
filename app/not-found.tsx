import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#182752] p-6 text-center text-white">
      <h2 className="text-5xl font-extrabold">404</h2>
      <p className="text-sm text-gray-300">Halaman yang kamu cari tidak ditemukan.</p>
      <Link
        href="/"
        className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#182752]"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}