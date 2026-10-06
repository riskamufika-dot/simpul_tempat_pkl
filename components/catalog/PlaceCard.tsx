import type { Place } from "@/types";

interface Props {
  place: Place;
  selected: boolean; // sudah dipilih untuk dibandingkan
  canSelect: boolean; // false kalau sudah 2 tempat terpilih
  onDetail: (place: Place) => void; // buka DetailModal (Orang 2)
  onToggleCompare: (place: Place) => void;
}

const btn =
  "flex-1 rounded-full bg-slate-200 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-50";

export default function PlaceCard({ place, selected, canSelect, onDetail, onToggleCompare }: Props) {
  return (
    <article className={`flex flex-col gap-3 rounded-2xl bg-white p-2 ${selected ? "ring-4 ring-sky-400" : ""}`}>
      <div className="aspect-[16/9] overflow-hidden rounded-xl bg-slate-200">
        {place.gambar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={place.gambar} alt={place.nama} className="h-full w-full object-cover" />
        )}
      </div>

      <div className="space-y-2 px-2">
        <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          {place.jurusan}
        </span>
        <h3 className="text-lg font-semibold text-slate-900">{place.nama}</h3>
        <p className="text-xs text-slate-700">{place.role.join(", ")}</p>
        <p className="line-clamp-3 text-xs text-slate-600">{place.deskripsi}</p>
      </div>

      <div className="mt-auto flex gap-2 px-2 pb-2">
        <button className={btn} onClick={() => onDetail(place)}>Detail</button>
        <button
          className={btn}
          aria-pressed={selected}
          disabled={!selected && !canSelect}
          onClick={() => onToggleCompare(place)}
        >
          {selected ? "Batal pilih" : "+ Bandingkan"}
        </button>
      </div>
    </article>
  );
}