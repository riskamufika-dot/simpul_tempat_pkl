interface Props {
  bidang: string;
  jurusan: string;
  daftarBidang: string[];
  daftarJurusan: string[];
  onBidang: (v: string) => void;
  onJurusan: (v: string) => void;
}

const selectClass =
  "w-full appearance-none rounded-xl bg-white py-3 pl-4 pr-12 text-sm text-gray-800 shadow-sm outline-none focus:ring-2 focus:ring-blue-400 sm:text-base";

function Panah() {
  return (
    <svg
      className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600"
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <span className="text-lg font-semibold text-white sm:text-xl">Filter:</span>

      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:max-w-3xl">
        <div className="relative">
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

        <div className="relative">
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