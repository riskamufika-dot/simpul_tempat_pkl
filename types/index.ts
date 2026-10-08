export interface Testimoni {
  nama: string;
  sekolah: string;
  isi: string;
}

export interface TempatPKL {
  id: number;
  nama: string;
  jurusan: string;
  singkatanJurusan: string;
  deskripsi: string;
  alamat: string;
  jarak: string;
  gambar: string | null;
  jamKerja: string[];
  kuota: string;
  role: string[];
  tugas: string[];
  syaratBerkas: string[];
  fasilitas: string[];
  testimoni?: Testimoni | null;
  linkMaps?: string | null;
}