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
    <article className="flex h-full flex-col rounded-2xl bg-white p-2 shadow-md transition hover:shadow-xl sm:p-3">
      {/* Foto tinggi tetap */}
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-200 sm:aspect-[16/10]">
        {tempat.gambar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tempat.gambar}
            alt={tempat.nama}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col px-0.5 pt-2 sm:px-1 sm:pt-3">
        <span className="line-clamp-1 w-fit max-w-full rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-medium text-blue-700 sm:px-2.5 sm:text-[11px]">
          {tempat.jurusan}
        </span>

        <h3 className="mt-1 line-clamp-2 min-h-[2.25rem] text-[13px] font-semibold leading-tight text-gray-900 sm:mt-1.5 sm:min-h-[2.5rem] sm:text-base">
          {tempat.nama}
        </h3>

        {roles.length > 0 && (
          <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-700 sm:mt-1.5 sm:gap-1.5 sm:text-[11px]">
            <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3H2V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zM2 13h16v3a2 2 0 01-2 2H4a2 2 0 01-2-2v-3z" />
            </svg>
            <span className="line-clamp-1">{roles.join(", ")}</span>
          </p>
        )}

        <p className="mt-1.5 line-clamp-2 text-[10px] leading-relaxed text-gray-600 sm:mt-2 sm:line-clamp-3 sm:text-xs">
          {tempat.deskripsi}
        </p>

        {/* mt-auto: tombol selalu menempel di dasar kartu, berdampingan di semua layar */}
        <div className="mt-auto flex flex-row gap-1.5 pt-3 sm:gap-2 sm:pt-4">
          <button
            onClick={() => onDetail(tempat)}
            className="min-w-0 flex-1 whitespace-nowrap rounded-full bg-gray-100 px-1 py-1.5 text-[10px] font-medium text-gray-700 transition hover:bg-gray-200 sm:px-2 sm:py-2 sm:text-xs"
          >
            Detail
          </button>
          <button
            onClick={() => onBandingkan(tempat)}
            className={`min-w-0 flex-1 whitespace-nowrap rounded-full px-1 py-1.5 text-[10px] font-medium transition sm:px-2 sm:py-2 sm:text-xs ${
              dipilih
                ? "bg-[#101d42] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {dipilih ? (
              "✓ Dipilih"
            ) : (
              <>
                +<span className="hidden min-[400px]:inline"> Bandingkan</span>
                <span className="min-[400px]:hidden"> Banding</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}