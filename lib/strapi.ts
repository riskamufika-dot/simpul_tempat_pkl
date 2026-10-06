import type { Place } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

const base = {
  gambar: null,
  alamat: "Sumedang, Jawa Barat",
  jarak: "1 km dari SMKN 2 Sumedang",
  jamKerja: ["Shift 1 (Pagi): 08.00 - 16.00 WIB"],
  kuota: "Terbatas",
  tugas: ["Membantu pekerjaan harian sesuai arahan"],
  syaratBerkas: ["Surat pengantar PKL dari sekolah", "Fotokopi kartu pelajar"],
  fasilitas: ["Tempat pelaksanaan PKL", "Pembimbing selama kegiatan PKL"],
  mapsUrl: "https://maps.google.com",
};

// Data dummy: dipakai selama NEXT_PUBLIC_STRAPI_URL kosong
const DUMMY: Place[] = [
  { ...base, id: 1, nama: "PT SAWALA Inovasi Indonesia", jurusan: "Rekayasa Perangkat Lunak (RPL)", role: ["Frontend Development", "Backend Development", "UI/UX Designer"], deskripsi: "Perusahaan teknologi yang mengembangkan aplikasi web dan mobile untuk berbagai klien." },
  { ...base, id: 2, nama: "RSUD Umar Wirahadikusuma", jurusan: "Akuntansi dan Keuangan Lembaga (AKL)", role: ["Administrasi Keuangan"], deskripsi: "Rumah sakit rujukan utama milik Pemerintah Kabupaten Sumedang, pelayanan kesehatan 24 jam." },
  { ...base, id: 3, nama: "Badan Kesatuan Bangsa dan Politik", jurusan: "Menejemen Perkantoran dan Layanan Bisnis (MPLB)", role: ["Administrasi Perkantoran", "Kearsipan", "Pengelolaan Data"], deskripsi: "Instansi pemerintah daerah yang menangani urusan kesatuan bangsa dan politik." },
  { ...base, id: 4, nama: "Plaza Asia", jurusan: "Pemasaran (PM)", role: ["Kasir", "Display Staff"], deskripsi: "Pusat perbelanjaan terbesar di Sumedang: supermarket, department store, dan food court.", jamKerja: ["Shift 1 (Pagi): 08.00 - 16.00 WIB", "Shift 2 (Siang): 13.00 - 21.00 WIB"] },
];

// Ubah data Strapi jadi Place. Nama field harus sama dengan yang dibuat orang database.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(item: any): Place {
  const a = item.attributes ?? item; // v4: attributes, v5: flat
  const img = a.gambar?.url ?? a.gambar?.data?.attributes?.url ?? null;
  const list = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);
  return {
    id: item.id,
    nama: a.nama ?? "",
    gambar: img ? (img.startsWith("http") ? img : `${BASE_URL}${img}`) : null,
    jurusan: a.jurusan ?? "",
    role: list(a.role),
    deskripsi: a.deskripsi ?? "",
    alamat: a.alamat ?? "",
    jarak: a.jarak ?? "",
    jamKerja: list(a.jamKerja),
    kuota: String(a.kuota ?? ""),
    tugas: list(a.tugas),
    syaratBerkas: list(a.syaratBerkas),
    fasilitas: list(a.fasilitas),
    mapsUrl: a.mapsUrl ?? "",
  };
}

async function request(path: string) {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
  });
  if (!res.ok) throw new Error(`Gagal mengambil data (${res.status})`);
  return res.json();
}

export async function getPlaces(): Promise<Place[]> {
  if (!BASE_URL) return DUMMY;
  const json = await request("/places?populate=*&pagination[pageSize]=100");
  return (json.data ?? []).map(normalize);
}

export async function getPlaceById(id: number): Promise<Place | null> {
  if (!BASE_URL) return DUMMY.find((p) => p.id === id) ?? null;
  const json = await request(`/places/${id}?populate=*`);
  return json.data ? normalize(json.data) : null;
}