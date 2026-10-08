import { TempatPKL } from "@/types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

function fullUrl(path?: string | null) {
  if (!path) return null;
  return path.startsWith("http") ? path : `${STRAPI_URL}${path}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTempat(item: any): TempatPKL {
  return {
    id: item.id,
    nama: item.nama ?? "",
    jurusan: item.jurusan ?? "",
    singkatanJurusan: item.singkatanJurusan ?? "",
    deskripsi: item.deskripsi ?? "",
    alamat: item.alamat ?? "",
    jarak: item.jarak ?? "",
    gambar: fullUrl(item.gambar?.url),
    jamKerja: item.jamKerja ?? [],
    kuota: item.kuota ?? "-",
    role: item.role ?? [],
    tugas: item.tugas ?? [],
    syaratBerkas: item.syaratBerkas ?? [],
    fasilitas: item.fasilitas ?? [],
    testimoni: item.testimoni ?? null,
    linkMaps: item.linkMaps ?? null,
  };
}

export async function getTempatPKL(): Promise<TempatPKL[]> {
  const res = await fetch(`${STRAPI_URL}/api/tempat-pkls?populate=*`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal mengambil data tempat PKL");
  const json = await res.json();
  return json.data.map(mapTempat);
}