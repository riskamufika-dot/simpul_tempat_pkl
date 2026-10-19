
"use client";

import { TempatPKL } from "@/types";

interface PopUpBandingkanProps {
  isOpen: boolean;
  onClose: () => void;
  items: TempatPKL[];
  onClear: () => void;
  onRemoveItem: (id: number | string) => void;
}

// Mengambil teks berdasarkan properti yang tersedia pada data tempat PKL.
function ambilTeks(
  item: TempatPKL,
  keys: string[],
  fallback: string
): string {
  const data = item as unknown as Record<string, unknown>;

  for (const key of keys) {
    const value = data[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return fallback;
}

export default function PopUpBandingkan({
  isOpen,
  onClose,
  items,
  onClear,
  onRemoveItem,
}: PopUpBandingkanProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-bandingkan"
        className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2
              id="judul-bandingkan"
              className="text-xl font-bold text-gray-900"
            >
              Perbandingan Tempat PKL
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Pilih maksimal 2 tempat untuk dibandingkan.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup popup"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="mb-5 space-y-3">
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center">
              <p className="font-medium text-gray-700">
                Belum ada tempat PKL yang dipilih.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Pilih tempat PKL dari katalog terlebih dahulu.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={String(item.id)}
                className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 p-4"
              >
                <div className="min-w-0">
                  <h3 className="break-words font-semibold text-gray-900">
                    {ambilTeks(
                      item,
                      ["nama", "name", "nama_perusahaan", "namaTempat", "judul"],
                      "Tempat PKL"
                    )}
                  </h3>

                  <p className="mt-1 break-words text-sm text-gray-500">
                    {ambilTeks(
                      item,
                      ["alamat", "address", "lokasi"],
                      "Alamat belum tersedia"
                    )}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    ID: {String(item.id)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Hapus
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mb-5">
          <p className="mb-2 text-sm font-medium text-gray-700">
            Tempat dipilih: {items.length}/2
          </p>

          <div className="flex gap-2">
            {[0, 1].map((index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full ${
                  items[index]
                    ? "bg-blue-600"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onClear}
            disabled={items.length === 0}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Kosongkan
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
