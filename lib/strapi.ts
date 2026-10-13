import { TempatPKL } from "@/types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://simpul-production.up.railway.app";

function fullUrl(path?: string | null) {
  if (!path) return null;
  return path.startsWith("http") ? path : `${STRAPI_URL}${path}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCompanyToTempatPKL(item: any): TempatPKL {
  // Ambil gambar pertama dari field 'images'
  const firstImage = Array.isArray(item.images) && item.images.length > 0 
    ? item.images[0]?.url 
    : item.images?.url;

  // Format jam kerja (bisa berupa teks deskripsi / nama shift)
  const jamKerjaList = Array.isArray(item.working_hours)
    ? item.working_hours.map((w: any) => typeof w === 'string' ? w : (w.title || w.shift || w.name || JSON.stringify(w)))
    : [];

  // Ambil jurusan dari relasi 'majors'
  const primaryMajor = Array.isArray(item.majors) && item.majors.length > 0 
    ? item.majors[0] 
    : null;

  return {
    id: item.id,
    nama: item.name ?? "",
    jurusan: primaryMajor?.name ?? primaryMajor?.title ?? "",
    singkatanJurusan: primaryMajor?.code ?? primaryMajor?.abbreviation ?? "",
    deskripsi: item.description ?? "",
    alamat: item.address ?? "",
    jarak: item.distance_note ?? "",
    gambar: fullUrl(firstImage),
    jamKerja: jamKerjaList,
    kuota: item.quota_status ?? "-",
    role: Array.isArray(item.roles) ? item.roles.map((r: any) => r.name || r.title || "") : [],
    tugas: [],
    syaratBerkas: Array.isArray(item.requirements) ? item.requirements : [],
    fasilitas: Array.isArray(item.facilities) ? item.facilities : [],
    testimoni: Array.isArray(item.testimonials) && item.testimonials.length > 0
      ? {
          nama: item.testimonials[0]?.name || item.testimonials[0]?.student_name || "",
          sekolah: item.testimonials[0]?.school || "",
          isi: item.testimonials[0]?.content || item.testimonials[0]?.review || ""
        }
      : null,
    linkMaps: item.google_maps_url ?? null,
  };
}

export async function getTempatPKL(): Promise<TempatPKL[]> {
  // Mengambil langsung hingga 100 data sekaligus agar 61 katalog terambil semua
  const res = await fetch(
    `${STRAPI_URL}/api/companies?populate=*&pagination[pageSize]=100`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Gagal mengambil data Company: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  
  if (!json.data || !Array.isArray(json.data)) {
    return [];
  }

  return json.data.map(mapCompanyToTempatPKL);
}