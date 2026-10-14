import { TempatPKL } from "@/types";

interface Props {
  tempat: TempatPKL;
  dipilih: boolean;
  onDetail: (t: TempatPKL) => void;
  onBandingkan: (t: TempatPKL) => void;
}

export default function KartuTempatPKL({ tempat, dipilih, onDetail, onBandingkan }: Props) {
  const roles = tempat.role.filter((r) => typeof r === "string" && r.trim() !== "");

  return (
    <article className="flex h-full flex-col rounded-2xl bg-white p-3 shadow-md transition hover:shadow-xl">
      {/* Foto tinggi tetap */}
      <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-200">
        {tempat.gambar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tempat.gambar}
            alt={tempat.nama}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col px-1 pt-3">
        <span className="line-clamp-1 w-fit max-w-full rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-medium text-blue-700 sm:text-[11px]">
          {tempat.jurusan}
        </span>

        <h3 className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-base font-semibold leading-tight text-gray-900">{tempat.nama}</h3>

        {roles.length > 0 && (
          <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-gray-700">
            <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3H2V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zM2 13h16v3a2 2 0 01-2 2H4a2 2 0 01-2-2v-3z" />
            </svg>
            <span className="line-clamp-1">{roles.join(", ")}</span>
          </p>
        )}

        <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-gray-600 sm:text-xs">
          {tempat.deskripsi}
        </p>

        {/* mt-auto: tombol selalu menempel di dasar kartu */}
        <div className="mt-auto flex flex-row gap-2 pt-4">
          <button
  onClick={() => onDetail(tempat)}
  className="flex-1 whitespace-nowrap rounded-full bg-gray-100 px-2 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
>
  Detail
</button>
<button
  onClick={() => onBandingkan(tempat)}
  className={`flex-1 whitespace-nowrap rounded-full px-2 py-2 text-xs font-medium transition ${
    dipilih
      ? "bg-[#101d42] text-white"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  }`}
>
  {dipilih ? "✓ Dipilih" : "+ Bandingkan"}
</button>
        </div>
      </div>
    </article>
  );
}