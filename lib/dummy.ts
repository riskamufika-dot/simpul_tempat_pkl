import { TempatPKL } from "@/types";

// DATA SEMENTARA, hapus file ini kalau database Strapi sudah jadi
export const DUMMY_TEMPAT: TempatPKL[] = [
  {
    id: 1,
    nama: "Plaza Asia",
    jurusan: "Pemasaran (PM)",
    singkatanJurusan: "PM",
    deskripsi:
      "Plaza Asia Sumedang adalah pusat perbelanjaan terpadu terbesar di Sumedang yang mencakup Supermarket, Department Store, area hiburan, dan food court.",
    alamat:
      "Jl. Mayor Abdurahman No.225, Kotakaler, Kec. Sumedang Utara, Kabupaten Sumedang, Jawa Barat 45322",
    jarak: "±0,1 km dari SMKN 2 Sumedang",
    gambar: null,
    jamKerja: ["08.00 – 16.00 WIB", "13.00 – 21.00 WIB"],
    kuota: "Terbatas",
    role: ["Kasir", "Display Staff"],
    tugas: [
      "Membantu proses transaksi",
      "Menata area kasir",
      "Memberikan pelayanan kepada pelanggan sesuai arahan",
    ],
    syaratBerkas: [
      "Surat pengantar/permohonan PKL dari sekolah",
      "Surat tugas atau penempatan PKL",
      "Fotokopi kartu pelajar",
      "Formulir atau dokumen administrasi PKL dari sekolah",
      "Dokumen tambahan sesuai ketentuan perusahaan",
    ],
    fasilitas: [
      "Tempat pelaksanaan PKL",
      "Pembimbing selama kegiatan PKL",
      "Pengalaman bekerja di lingkungan pusat perbelanjaan",
      "Pengalaman dalam pelayanan pelanggan dan operasional toko",
      "Pengalaman dalam penataan produk dan proses transaksi",
    ],
    testimoni: {
      nama: "Riska Mufika",
      sekolah: "SMK 2 Sumedang",
      isi: "Tempat yang pas banget yang mau nyobain atmosfer kerja modern.",
    },
    linkMaps: null,
  },
  {
    id: 2,
    nama: "PT SAWALA Inovasi Indonesia",
    jurusan: "Rekayasa Perangkat Lunak (RPL)",
    singkatanJurusan: "RPL",
    deskripsi:
      "Perusahaan pengembang perangkat lunak yang menerima siswa PKL untuk mengerjakan proyek web dan aplikasi.",
    alamat: "Bandung, Jawa Barat",
    jarak: "",
    gambar: null,
    jamKerja: ["08.00 – 16.00 WIB"],
    kuota: "2 Siswa",
    role: ["Frontend Development", "Backend Development", "UI/UX Designer"],
    tugas: [
      "Membantu pengembangan fitur web",
      "Menguji dan memperbaiki bug",
      "Membuat desain antarmuka sesuai arahan tim",
    ],
    syaratBerkas: [
      "Surat pengantar PKL dari sekolah",
      "Fotokopi kartu pelajar",
    ],
    fasilitas: [
      "Pembimbing selama kegiatan PKL",
      "Pengalaman mengerjakan proyek nyata",
    ],
    testimoni: null,
    linkMaps: null,
  },
];