"use client";

// Buat interface lokal agar tidak ketergantungan tipe dari luar
interface Place {
  id?: string;
  nama?: string;
  jurusan?: string;
  role?: string[];
  deskripsi?: string;
  gambar?: string;
}

interface Props {
  place?: Place;
  selected?: boolean;
  canSelect?: boolean;
  onDetail?: (place: any) => void;
  onToggleCompare?: (place: any) => void;
}

const btn =
  "flex-1 rounded-full bg-slate-200 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-50";

const dummyPlace: Place = {
  id: "1",
  nama: "PT SAWALA Inovasi Indonesia",
  jurusan: "Rekayasa Perangkat Lunak",
  role: ["Frontend", "Backend"],
  deskripsi: "Deskripsi singkat tempat PKL...",
  gambar: "/images/sawala.jpg",
};

export default function PlaceCard({
  place = dummyPlace,
  selected = false,
  canSelect = true,
  onDetail = () => {},
  onToggleCompare = () => {},
}: Props) {
  return (
    <article className={`flex flex-col gap-3 rounded-2xl bg-white p-2 ${selected ? "ring-4 ring-sky-400" : ""}`}>
      <div className="aspect-[16/9] overflow-hidden rounded-xl bg-slate-200">
        {place?.gambar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={place.gambar} alt={place.nama || "Tempat PKL"} className="h-full w-full object-cover" />
        )}
      </div>

      <div className="space-y-2 px-2">
        <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          {place?.jurusan || "Jurusan"}
        </span>
        <h3 className="text-lg font-semibold text-slate-900">{place?.nama || "Nama Tempat"}</h3>
        <p className="text-xs text-slate-700">{place?.role?.join(", ")}</p>
        <p className="line-clamp-3 text-xs text-slate-600">{place?.deskripsi}</p>
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