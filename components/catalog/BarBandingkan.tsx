import { TempatPKL } from "@/types";

interface Props {
  terpilih: TempatPKL[];
  onHapus: (id: number) => void;
  onBandingkan: () => void;
}

export default function BarBandingkan({ terpilih, onHapus, onBandingkan }: Props) {
  if (terpilih.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full bg-[#101d42] px-5 py-3 text-white shadow-xl">
      <span className="text-sm">{terpilih.length}/2 dipilih:</span>
      {terpilih.map((t) => (
        <span key={t.id} className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs">
          {t.nama}
          <button onClick={() => onHapus(t.id)} aria-label={`Hapus ${t.nama}`}>×</button>
        </span>
      ))}
      <button
        onClick={onBandingkan}
        disabled={terpilih.length < 2}
        className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#101d42] disabled:opacity-40"
      >
        Bandingkan
      </button>
    </div>
  );
}