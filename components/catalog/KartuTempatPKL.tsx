import { TempatPKL } from "@/types";

interface Props {
  tempat: TempatPKL;
  dipilih: boolean;
  onDetail: (t: TempatPKL) => void;
  onBandingkan: (t: TempatPKL) => void;
}

export default function KartuTempatPKL({ tempat, dipilih, onDetail, onBandingkan }: Props) {
  return (
    <article className="rounded-2xl bg-white p-3 shadow-md">
      <div className="h-44 overflow-hidden rounded-xl bg-gray-200">
        {tempat.gambar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tempat.gambar} alt={tempat.nama} className="h-full w-full object-cover" />
        )}
      </div>

      <span className="mt-3 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
        {tempat.jurusan}
      </span>

      <h3 className="mt-1 text-lg font-semibold text-[#101d42]">{tempat.nama}</h3>
      <p className="mt-1 text-[11px] text-gray-500">{tempat.role.join(", ")}</p>
      <p className="mt-2 line-clamp-3 text-[11px] text-gray-500">{tempat.deskripsi}</p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onDetail(tempat)}
          className="flex-1 rounded-full bg-gray-100 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
        >
          Detail
        </button>
        <button
          onClick={() => onBandingkan(tempat)}
          className={`flex-1 rounded-full py-1.5 text-xs font-medium ${
            dipilih ? "bg-[#101d42] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {dipilih ? "✓ Dipilih" : "+ Bandingkan"}
        </button>
      </div>
    </article>
  );
}