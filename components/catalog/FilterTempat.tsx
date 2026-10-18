interface Props {
  bidang: string;
  jurusan: string;
  daftarBidang: string[];
  daftarJurusan: string[];
  onBidang: (v: string) => void;
  onJurusan: (v: string) => void;
}

const selectClass =
  "w-full min-w-0 appearance-none truncate rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-xs text-gray-800 shadow-sm outline-none focus:ring-2 focus:ring-blue-400 sm:py-3 sm:pl-4 sm:pr-12 sm:text-base";

function Panah() {
  return (
    <svg
      className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-600 sm:right-5 sm:h-4 sm:w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function FilterTempat(p: Props) {
  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 lg:w-auto">
      <span className="text-sm font-semibold text-slate-800 sm:text-xl">Filter:</span>

      <div className="grid flex-1 grid-cols-2 gap-2 sm:gap-4 lg:w-[44rem] lg:flex-none">
        <div className="relative min-w-0">
          <select
            value={p.bidang}
            onChange={(e) => p.onBidang(e.target.value)}
            className={selectClass}
            aria-label="Filter bidang"
          >
            <option value="">Semua Bidang</option>
            {p.daftarBidang.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <Panah />
        </div>

        <div className="relative min-w-0">
          <select
            value={p.jurusan}
            onChange={(e) => p.onJurusan(e.target.value)}
            className={selectClass}
            aria-label="Filter jurusan"
          >
            <option value="">Semua Jurusan</option>
            {p.daftarJurusan.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
          <Panah />
        </div>
      </div>
    </div>
  );
}