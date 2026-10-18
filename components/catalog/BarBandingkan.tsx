import { TempatPKL } from "@/types";

interface Props {
  terpilih: TempatPKL[];
  onHapus: (id: number) => void;
  onBandingkan: () => void;
}

export default function BarBandingkan({ terpilih, onHapus, onBandingkan }: Props) {
  if (terpilih.length === 0) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-fit flex-col gap-2 rounded-2xl bg-[#101d42] p-3 text-white shadow-xl sm:inset-x-auto sm:bottom-4 sm:left-1/2 sm:max-w-[95vw] sm:-translate-x-1/2 sm:flex-row sm:items-center sm:gap-3 sm:rounded-full sm:px-5 sm:py-3">
      {/* Baris atas di HP: jumlah + tombol */}
      <div className="flex items-center justify-between gap-3 sm:contents">
        <span className="shrink-0 text-xs sm:text-sm">{terpilih.length}/2 dipilih:</span>

        <button
          onClick={onBandingkan}
          disabled={terpilih.length < 2}
          className="shrink-0 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#101d42] disabled:opacity-40 sm:order-last"
        >
          Bandingkan
        </button>
      </div>

      {/* Nama tempat: terpotong 1 baris supaya tidak melebar */}
      <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:gap-3">
        {terpilih.map((t) => (
          <span
            key={t.id}
            className="flex min-w-0 items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] sm:max-w-[220px] sm:text-xs"
          >
            <span className="truncate">{t.nama}</span>
            <button
              onClick={() => onHapus(t.id)}
              aria-label={`Hapus ${t.nama}`}
              className="shrink-0 text-sm leading-none"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}