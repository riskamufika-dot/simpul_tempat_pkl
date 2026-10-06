export interface Place {
  id: number;
  nama: string;
  gambar: string | null;
  jurusan: string; // satu jurusan per tempat, mis. "Pemasaran (PM)"
  role: string[]; // bidang/role yang dibutuhkan, mis. ["Kasir", "Display Staff"]
  deskripsi: string;
  alamat: string;
  jarak: string; // mis. "0,1 km dari SMKN 2 Sumedang"
  jamKerja: string[];
  kuota: string; // mis. "Terbatas"
  tugas: string[];
  syaratBerkas: string[];
  fasilitas: string[];
  mapsUrl: string;
}

export interface Filter {
  bidang: string;
  jurusan: string;
}

export const EMPTY_FILTER: Filter = { bidang: "", jurusan: "" };

// Daftar dari desain Figma. Samakan dengan data di Strapi.
export const BIDANG_LIST = [
  "Frontend Development", "Backend Development", "UI/UX Designer", "Administrasi Keuangan",
  "Administrasi Perkantoran", "Pelayanan Publik", "Pengelolaan Data", "Kearsipan",
  "Kasir", "Digital Marketing", "Display Staff",
];

export const JURUSAN_LIST = [
  "Rekayasa Perangkat Lunak (RPL)",
  "Menejemen Perkantoran dan Layanan Bisnis (MPLB)",
  "Akuntansi dan Keuangan Lembaga (AKL)",
  "Pemasaran (PM)",
];

// Pilihan di dropdown bar "Bandingkan"
export const COMPARE_MODES = [
  "Bandingkan Semua", "Bidang/Role yang Dibutuhkan", "Lokasi (Jarak)",
  "Jam Kerja", "Kuota Siswa", "Fasilitas", "Syarat Berkas",
] as const;
export type CompareMode = (typeof COMPARE_MODES)[number];