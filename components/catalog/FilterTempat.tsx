interface Props {
  bidang: string;
  jurusan: string;
  daftarBidang: string[];
  daftarJurusan: string[];
  onBidang: (v: string) => void;
  onJurusan: (v: string) => void;
}

const selectClass =
  "w-52 rounded-lg bg-white px-3 py-2 text-sm text-gray-700 outline-none";

export default function FilterTempat(p: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="font-semibold text-white">Filter:</span>
      <select value={p.bidang} onChange={(e) => p.onBidang(e.target.value)} className={selectClass}>
        <option value="">Semua Bidang</option>
        {p.daftarBidang.map((b) => <option key={b} value={b}>{b}</option>)}
      </select>
      <select value={p.jurusan} onChange={(e) => p.onJurusan(e.target.value)} className={selectClass}>
        <option value="">Semua Jurusan</option>
        {p.daftarJurusan.map((j) => <option key={j} value={j}>{j}</option>)}
      </select>
    </div>
  );
}