import { TempatPKL } from "@/types";

interface Props {
  terpilih: TempatPKL[];
  onHapus: (id: number) => void;
  onBandingkan: () => void;
}

export default function BarBandingkan({ terpilih, onHapus, onBandingkan }: Props) {
  if (terpilih.length === 0) return null;

  return (
    <div className="fixed bottom-3 left-1/2 z-40 flex max-w-[96vw] -translate-x-1/2 items-center gap-1.5 rounded-full bg-[#101d42] px-3 py-2 text-white shadow-xl sm:bottom-4 sm:max-w-[95vw] sm:gap-3 sm:px-5 sm:py-3">
      {/* Teks jumlah terpilih */}
      <span className="shrink-0 text-[11px] font-medium sm:text-sm">
        {terpilih.length}/2:
      </span>

      {/* Daftar nama tempat: tetap flex-row ke samping */}
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
        {terpilih.map((t) => (
          <span
            key={t.id}
            className="flex max-w-[110px] min-w-0 items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] xs:max-w-[140px] sm:max-w-[220px] sm:text-xs"
          >
            <span className="truncate">{t.nama}</span>
            <button
              onClick={() => onHapus(t.id)}
              aria-label={`Hapus ${t.nama}`}
              className="shrink-0 text-xs leading-none text-white/70 hover:text-white"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Tombol Bandingkan di paling kanan */}
      <button
        onClick={onBandingkan}
        disabled={terpilih.length < 2}
        className="shrink-0 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#101d42] transition disabled:opacity-40 sm:px-4 sm:py-1.5 sm:text-xs"
      >
        Bandingkan
      </button>
    </div>
  );
}