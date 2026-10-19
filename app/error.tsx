"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error halaman:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#182752] p-6 text-center text-white">
      <h2 className="text-xl font-bold">Terjadi kesalahan</h2>
      <p className="text-sm text-gray-300">Halaman gagal dimuat. Silakan coba lagi.</p>
      <button
        type="button"
        onClick={reset}
        className="cursor-pointer rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#182752]"
      >
        Coba lagi
      </button>
    </div>
  );
}