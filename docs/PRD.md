
# Dokumen Kebutuhan Produk (PRD) — SIMPUL
## Sistem Informasi Magang & Pilihan untuk Lapangan
*Slogan: "Satu Simpul, Banyak Peluang"*

- **Alamat Website (Live)**: [https://simpulpkl.vercel.app](https://simpulpkl.vercel.app)
- **Repositori Frontend**: [https://github.com/riskamufika-dot/simpul_tempat_pkl](https://github.com/riskamufika-dot/simpul_tempat_pkl)
- **Repositori Backend (Strapi)**: [https://github.com/BagasSD/simpul](https://github.com/BagasSD/simpul)
- **Server API Backend**: [https://simpul-production.up.railway.app](https://simpul-production.up.railway.app)
- **Status Aplikasi**: Sudah tayang di internet (*Live Production*)
- **Jenis Proyek**: Aplikasi Web Frontend (Next.js)
- **Tim Pengembang**: SYNERGY TECH (Team B)
- **Versi Dokumen**: 2.0 (Bahasa Ringkas & Mudah Dipahami)

---

## 1. Tentang SIMPUL

### 1.1 Apa itu SIMPUL?
**SIMPUL** adalah website yang dibuat untuk membantu siswa SMK mencari, memilih, melihat rincian lengkap, dan membandingkan tempat Praktik Kerja Lapangan (PKL). 

Di SIMPUL, siswa bisa melihat nama perusahaan, jurusan yang diterima, bidang usaha, alamat kantor, posisi/pekerjaan yang dibuka, jam kerja (shift), berkas persyaratan, fasilitas yang didapat, hingga ulasan dari kakak kelas yang pernah PKL di sana.

### 1.2 Kenapa Namanya SIMPUL?
- **Kepanjangan**: *Sistem Informasi Magang & Pilihan untuk Lapangan*.
- **Arti Kata "Simpul"**: Seperti sebuah simpul tali yang menyatukan banyak benang, SIMPUL menjadi jembatan penghubung yang mempertemukan **Siswa SMK**, **Pihak Sekolah**, dan **Dunia Industri (Tempat PKL)** dalam satu tempat.
- **Arti "Pilihan untuk Lapangan"**: Memberikan banyak pilihan tempat kerja lapangan (PKL) agar siswa bisa bebas memilih tempat yang paling pas dengan minat dan keahliannya.
- **Kenapa pakai kata Magang dan PKL?**: Di sekolah istilah resminya adalah *PKL*, tetapi siswa dan perusahaan sehari-hari juga sering menyebutnya *magang*. Kedua kata ini dipakai agar aplikasi terasa akrab bagi siapa saja.

---

## 2. Alasan Kenapa SIMPUL Dibuat

### 2.1 Masalah yang Sering Dialami Siswa SMK
1. **Informasi Tercecer**: Info tempat PKL biasanya berantakan—sebagian ada di kertas arsip sekolah, sebagian di grup WhatsApp, atau hanya tahu dari cerita teman.
2. **Takut Salah Jurusan**: Banyak siswa bingung apakah suatu kantor benar-benar butuh jurusan mereka (misalnya anak RPL butuh tempat koding, bukan bagian administrasi).
3. **Tugas dan Jam Kerja Tidak Jelas**: Sering kali siswa baru tahu jam kerjanya masuk pagi/sore atau tugas hariannya baru saat hari pertama masuk kerja.
4. **Susah Membandingkan**: Siswa kesulitan menimbang jika punya dua pilihan tempat PKL, mana yang fasilitas dan syaratnya lebih cocok.

### 2.2 Tujuan Utama yang Ingin Dicapai
> *"Membantu siswa SMK agar bisa mencari, melihat info lengkap, dan membandingkan tempat PKL yang pas dengan jurusannya secara gampang di satu website, tanpa perlu mencari informasi ke sana-kemari."*

---

## 3. Manfaat Aplikasi

- **Untuk Siswa**: Cari tempat PKL jadi hemat waktu (cukup hitungan menit di HP), infonya transparan, dan tidak salah pilih tempat.
- **Untuk Guru / Sekolah**: Guru lebih mudah memberikan rekomendasi tempat PKL resmi yang sudah terdata ke siswa.

---

## 4. Siapa yang Menggunakan Website Ini?

| Pengguna | Siapa Mereka? | Apa yang Mereka Cari? |
|---|---|---|
| **Siswa SMK (Utama)** | Siswa kelas XI atau XII SMK yang sedang mencari tempat PKL. Terbiasa membuka website lewat HP. | Mencari tempat yang sesuai jurusan, melihat tugas harian, mengecek fasilitas/uang saku, dan membandingkan 2 tempat. |
| **Guru Pembimbing (Pendukung)** | Guru sekolah yang mendampingi siswa PKL. | Mengecek profil perusahaan, alamat kantor, dan ketersediaan kuota siswa. |

---

## 5. Daftar Fitur: Mana yang Sudah Jadi & Mana yang Rencana

Agar jelas, berikut status fitur yang ada di website SIMPUL saat ini:

| Fitur | Status Saat Ini | Keterangan |
|---|---|---|
| **Katalog Daftar Tempat PKL** | **Sudah Jadi (Tersedia)** | Kartu tempat PKL berisi foto, nama, jurusan, alamat, dan status kuota. |
| **Pencarian Kata Kunci** | **Sudah Jadi (Tersedia)** | Mengetik nama tempat, alamat, jurusan, deskripsi, atau posisi kerja. |
| **Filter Bidang Industri** | **Sudah Jadi (Tersedia)** | Menu dropdown untuk memilih bidang (misal: Teknologi Informasi, Otomotif). |
| **Filter Jurusan** | **Sudah Jadi (Tersedia)** | Menu dropdown untuk memilih jurusan (misal: RPL, TKJ, DKV, Akuntansi). |
| **Info Alamat & Google Maps** | **Sudah Jadi (Tersedia)** | Menampilkan alamat kantor tertulis lengkap dan tombol link langsung ke Google Maps pada detail tempat PKL. |
| **Pencarian Kota lewat Kotak Cari** | **Sudah Jadi (Tersedia)** | Siswa bisa mengetik nama kota (misal: "Bandung" atau "Jakarta") di kotak pencarian untuk menemukan tempat di kota tersebut. |
| **Dropdown Khusus Pilihan Kota / Radius** | **Belum Ada (Rencana Masa Depan)** | Menu dropdown khusus daftar kota atau penyaring jarak kilometer belum dibuat, saat ini pencarian lokasi menggunakan kotak cari teks. |
| **Pop-Up Detail Lengkap** | **Sudah Jadi (Tersedia)** | Jendela detail berisi foto, jam kerja shift, kuota, tugas per posisi, syarat berkas, fasilitas, ulasan, dan nomor kontak. |
| **Fitur Bandingkan (Komparasi)** | **Sudah Jadi (Tersedia)** | Membandingkan **maksimal 2 tempat** secara bersandingan dengan pilihan aspek yang bisa diceklis. |
| **Halaman Tentang Kami** | **Sudah Jadi (Tersedia)** | Penjelasan tujuan  SIMPUL. |
| **Login / Akun Siswa** | **Belum Ada (Rencana Masa Depan)** | Saat ini website bisa langsung dipakai oleh siapa saja tanpa perlu daftar/login. |
| **Pendaftaran Perusahaan Mandiri** | **Belum Ada (Rencana Masa Depan)** | Data tempat PKL saat ini diisi dan diatur oleh tim melalui backend Strapi. |

---

## 6. Alur Pengguna (User Flow)

Alur perjalanan siswa saat menggunakan website SIMPUL:

```text
               ┌─────────────────────────────────────────┐
               │         1. Masuk ke Website             │
               └────────────────────┬────────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────┐
               │            2. Halaman Beranda           │
               └────────────────────┬────────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────┐
               │         3. Masuk ke Daftar Tempat       │
               │   (Cari kata kunci & filter jurusan)    │
               └────────────────────┬────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
   ┌───────────────────────────────┐   ┌───────────────────────────────┐
   │    4A. Lihat Detail Tempat    │   │     4B. Bandingkan Tempat     │
   │  • Nama Perusahaan            │   │  • Memilih 2 tempat PKL       │
   │  • Lokasi (Alamat & Maps)     │   │  • Membandingkan jam kerja,   │
   │  • Jam Kerja (Shift)          │   │    tugas, syarat, dan lokasi  │
   │  • Hal yang Dikerjakan (Tugas)│   │    secara berdampingan        │
   │  • Role / Bidang Pekerjaan    │   │                               │
   │  • Syarat Berkas & Fasilitas  │   │                               │
   └──────────────┬────────────────┘   └──────────────┬────────────────┘
                  └─────────────────┬─────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────┐
               │          5. Tentukan Pilihan            │
               │  (Menentukan tempat PKL yang sesuai)    │
               └─────────────────────────────────────────┘
```

**Penjelasan Tahapan:**
1. **Masuk ke Website**: Siswa membuka alamat website SIMPUL.
2. **Halaman Beranda**: Siswa melihat ringkasan informasi, fitur utama, kategori jurusan, dan langkah-langkah PKL.
3. **Masuk ke Halaman Daftar Tempat**: Siswa masuk ke katalog untuk mencari tempat PKL lewat kotak pencarian atau memfilter berdasarkan jurusan dan bidang.
4. **Melihat Detail & Membandingkan**:
   - **Detail Tempat**: Siswa mengeklik kartu untuk melihat rincian lengkap berupa nama perusahaan, lokasi kantor & Google Maps, jam kerja, hal yang dikerjakan (tugas), role/bidang pekerjaan, dan berkas persyaratan.
   - **Bandingkan Tempat**: Siswa memilih 2 tempat PKL untuk dibandingkan secara langsung berdampingan.
5. **Tentukan Pilihan**: Setelah melihat detail dan membandingkan, siswa dapat menentukan tempat PKL yang paling pas dengan minat dan keahliannya.

---

## 7. Cara Kerja Fitur (Kebutuhan Fungsional)

### 7.1 Fitur Pencarian Kata Kunci
- Siswa bisa mengetik di kotak pencarian di bagian atas halaman katalog.
- Pencarian mencocokkan kata yang diketik dengan:
  - Nama tempat PKL (contoh: "Telkom", "Diskominfo")
  - Alamat / nama kota (contoh: "Bandung", "Jakarta")
  - Jurusan (contoh: "RPL")
  - Posisi kerja (contoh: "Web Developer", "Teknisi")
- Website akan menampilkan teks jumlah tempat yang ditemukan (misal: *"Ditemukan 5 tempat PKL"*).
- Jika yang dicari tidak ada, website akan memunculkan pesan ramah bahwa data tidak ditemukan.

### 7.2 Fitur Filter (Penyaring)
- Tersedia dropdown pilihan **Bidang** dan dropdown **Jurusan**.
- Siswa bisa memakai pencarian kata kunci dan filter secara bersamaan agar hasil pencarian semakin pas.

### 7.3 Fitur Detail Tempat PKL (Pop-up Detail)
- Saat kartu tempat PKL diklik, akan muncul jendela pop-up besar berisi:
  - Foto galeri perusahaan
  - Nama perusahaan dan jurusannya
  - Alamat lengkap dan tombol menuju Google Maps
  - Jam kerja (Shift 1 dan Shift 2)
  - Kuota penerimaan (misal: "Tersedia" atau "Penuh")
  - Pilihan posisi kerja dan rincian apa saja yang dikerjakan
  - Berkas persyaratan yang harus disiapkan (CV, Surat Sekolah, portofolio)
  - Fasilitas yang didapat (uang saku, makan siang, sertifikat)
  - Ulasan dari alumni yang pernah PKL di sana
  - Kontak (nomor WhatsApp, telepon, atau email)
- Pop-up ini gampang ditutup (bisa lewat tombol silang, tombol escape di keyboard, atau menekan tombol kembali/swipe di HP).

### 7.4 Fitur Perbandingan (Bandingkan 2 Tempat)
- Siswa bisa menekan tombol timbangan (*Bandingkan*) pada kartu tempat PKL.
- **Aturan Perbandingan:**
  - Minimal harus memilih **2 tempat** dan maksimal **2 tempat**.
  - Tombol melayang di bawah layar akan aktif jika sudah terpilih 2 tempat (`2/2`).
  - Kalau siswa memilih tempat ke-3, tempat yang paling pertama dipilih akan otomatis tergeser dan diganti tempat yang baru dipilih (sistem antrian).
  - Tempat PKL dengan jurusan berbeda tetap bisa dibandingkan.
- **Aspek yang Dibandingkan:**
  - Foto dan nama perusahaan
  - Alamat
  - Jam kerja
  - Kuota siswa
  - Posisi kerja (bisa dipilih posisinya untuk melihat tugas yang berbeda)
  - Tugas yang dikerjakan
  - Fasilitas
  - Syarat berkas
- Siswa bisa mencentang/menghapus centang parameter mana saja yang mau dilihat di perbandingan.

---

## 8. Kenyamanan, Kecepatan, dan Keamanan (Kebutuhan Nonfungsional)

### 8.1 Kecepatan & Kinerja
- **Tidak Sering Memuat Ulang (*Caching*)**: Data yang sudah diambil disimpan sementara di memori browser selama 5 menit. Jadi kalau siswa pindah-pindah halaman, datanya langsung muncul seketika tanpa nunggu lama.
- **Gambar Ringan**: Foto tempat PKL diatur otomatis agar ukurannya tidak membebani kuota internet siswa.
- **Animasi Loading**: Saat data sedang diambil, muncul kotak abu-abu yang berkedip halus (*skeleton*) agar siswa tahu website sedang bekerja, bukan macet.

### 8.2 Keamanan
- Menggunakan alamat web aman yang diawali `https://`.
- Pengunjung umum hanya bisa membaca data, tidak bisa merusak atau mengubah data perusahaan dari website.
- Data penting dan password database disimpan di server backend yang terpisah.

### 8.3 Tampilan & Kemudahan Pakai
- **Pas di Layar HP**: Tata letak dibuat nyaman untuk layar HP kecil hingga layar laptop lebar.
- **Warna Jelas & Nyaman**: Menggunakan warna biru gelap khas SIMPUL dengan teks putih/terang yang gampang dibaca dan tidak silau.
- **Gampang Kembali di HP**: Jika pop-up detail atau pop-up perbandingan terbuka di HP, memencet tombol Back bawaan HP akan menutup pop-up tersebut secara alami.

### 8.4 Penanganan Data Kosong (*Fallback Data*)
Jika ada data dari kantor yang belum diisi lengkap oleh admin, website tidak akan rusak atau error. Website dengan jujur akan menampilkan keterangan:
- Jam kerja belum diisi $\rightarrow$ Ditulis: *"Informasi jam kerja belum tersedia"*
- Kuota belum diisi $\rightarrow$ Ditulis: *"Informasi kuota belum tersedia"*
- Tugas belum diisi $\rightarrow$ Ditulis: *"Informasi tugas belum tersedia"*
- Foto belum diisi $\rightarrow$ Ditampilkan gambar pengganti standar (`placeholder`)
- Jika internet mati $\rightarrow$ Muncul kotak pesan *"Data tempat PKL gagal dimuat"* beserta tombol *"Coba lagi"*.

---

## 9. Hubungan Frontend dan Backend

Aplikasi SIMPUL terbagi menjadi dua bagian sistem yang saling terhubung:
1. **Frontend (Website SIMPUL)**:
   - Repositori: [github.com/riskamufika-dot/simpul_tempat_pkl](https://github.com/riskamufika-dot/simpul_tempat_pkl)
   - Berfungsi menyajikan tampilan, kolom pencarian, filter, modal detail, dan fitur perbandingan kepada siswa.
2. **Backend (Strapi CMS & MySQL)**:
   - Repositori: [github.com/BagasSD/simpul](https://github.com/BagasSD/simpul)
   - Server API: [simpul-production.up.railway.app](https://simpul-production.up.railway.app)
   - Berfungsi sebagai pusat penyimpanan data tempat PKL, jurusan, testimoni alumni, dan akun administrator.
- Frontend secara otomatis mengambil data dari Strapi dan merapikannya:
  - Merapikan tulisan singkatan jurusan (misalnya merapikan `Rekayasa Perangkat Lunak (RPL)`).
  - Membersihkan tanda titik, tanda minus, atau nomor urut pada daftar tugas dan syarat berkas agar tampil rapi sebagai poin-poin yang enak dibaca.

---

## 10. Tanda Aplikasi Berhasil Dibuat (Kriteria Keberhasilan)

Aplikasi SIMPUL dinyatakan berhasil dan siap dipresentasikan jika:
1. Halaman daftar tempat PKL berhasil memuat data dari internet secara lancar.
2. Siswa mengetik nama tempat atau kota di kotak cari, kartu yang muncul langsung menyaring dengan benar.
3. Dropdown jurusan dan bidang berfungsi menyaring kartu tempat PKL.
4. Kartu tempat PKL diklik, pop-up detail muncul dengan isi yang lengkap.
5. Tombol bandingkan bisa dipakai saat memilih 2 tempat dan menampilkan perbandingan berdampingan.
6. Tampilan rapi dan nyaman digunakan di layar HP maupun laptop.
7. Aplikasi tidak memunculkan error kodingan saat diperiksa dengan perintah `npm run lint` dan `npm run build`.

---

## 11. Catatan & Batasan

1. Kelengkapan informasi tempat PKL tergantung pada keaktifan admin dalam mengisi data di CMS Strapi.
2. Link peta membutuhkan koneksi ke Google Maps.
3. Tempat yang sedang dibandingkan disimpan di memori sementara browser, jadi jika tab browser ditutup, daftar perbandingan akan kembali kosong.


