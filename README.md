
# SIMPUL
### Sistem Informasi Magang & Pilihan untuk Lapangan
*Satu Simpul, Banyak Peluang*

[![Website SIMPUL]](https://simpulpkl.vercel.app)
[![GitHub Frontend]](https://github.com/riskamufika-dot/simpul_tempat_pkl)
[![GitHub Backend]](https://github.com/BagasSD/simpul)

**SIMPUL** adalah website yang dibuat untuk membantu siswa SMK mencari, melihat info lengkap, dan membandingkan tempat Praktik Kerja Lapangan (PKL) agar sesuai dengan jurusan dan minat masing-masing.

- 🌐 **Website Live**: [https://simpulpkl.vercel.app](https://simpulpkl.vercel.app)
- 💻 **Repositori Frontend**: [github.com/riskamufika-dot/simpul_tempat_pkl](https://github.com/riskamufika-dot/simpul_tempat_pkl)
- 🗄️ **Repositori Backend (Strapi)**: [github.com/BagasSD/simpul](https://github.com/BagasSD/simpul)

---

## 💡 Kenapa Namanya SIMPUL?

- **Kepanjangannya**: *Sistem Informasi Magang & Pilihan untuk Lapangan*.
- **Arti Simpul**: Seperti simpul tali yang menyatukan banyak benang, SIMPUL menghubungkan **Siswa SMK**, **Sekolah**, dan **Tempat PKL** dalam satu website yang mudah diakses.
- **Pilihan untuk Lapangan**: Memberikan kebebasan bagi siswa untuk memilih tempat kerja lapangan (PKL) terbaik untuk masa depan mereka.

---

## 🎯 Masalah yang Ingin Diselesaikan

Sebelum ada SIMPUL, siswa SMK sering mengalami hal-hal ini:
1. **Info PKL Berantakan**: Informasi tempat PKL mencar-mencar di grup chat, selebaran kertas sekolah, atau cuma tahu dari cerita teman.
2. **Takut Salah Jurusan**: Bingung apakah kantor yang dituju benar-benar menerima jurusan mereka dan memberikan tugas yang sesuai keahlian.
3. **Susah Membandingkan**: Sulit menimbang-nimbang kalau punya 2 pilihan tempat PKL (mana yang fasilitasnya lebih oke, mana yang jam kerjanya cocok).

SIMPUL mengumpulkan semua informasi tersebut di satu tempat agar siswa bisa memilih dengan tenang dan tepat.

---

## ✨ Fitur-Fitur Utama

- 🔍 **Pencarian Cepat**: Tinggal ketik nama kantor, nama kota/alamat, jurusan, atau posisi pekerjaan di kotak pencarian.
- 🎯 **Filter Jurusan & Bidang**: Pilih tempat PKL berdasarkan jurusanmu (misal: RPL, TKJ, DKV, Akuntansi) atau bidang industrinya.
- 🏢 **Detail Lengkap Tempat PKL**: Klik kartu tempat PKL untuk melihat:
  - Foto kantor & link langsung ke Google Maps.
  - Jam kerja (Shift 1 & Shift 2).
  - Status kuota siswa (Tersedia / Penuh).
  - Posisi kerja dan apa saja tugas hariannya.
  - Berkas persyaratan (CV, surat sekolah, dll).
  - Fasilitas (uang saku, makan siang, sertifikat).
  - Ulasan alumni dan nomor kontak kantor.
- ⚖️ **Bandingkan 2 Tempat PKL**: Taruh 2 tempat PKL bersebelahan untuk membandingkan syarat, jam kerja, tugas, dan fasilitasnya secara langsung.
- ℹ️ **Halaman Tentang Kami**: Mengenal tujuan dibuatnya SIMPUL dan tim yang mengembangkannya.

---

## 🔄 Alur Penggunaan Aplikasi (User Flow)

Berikut tahapan bagaimana siswa menggunakan website SIMPUL dari awal sampai menentukan tempat PKL:

```text
┌────────────────────────────────────────────────────────┐
│  1. Masuk ke Website SIMPUL                            │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  2. Halaman Beranda                                    │
│  Melihat gambaran website, kategori jurusan, & langkah │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  3. Masuk ke Daftar Tempat (Katalog PKL)               │
│  Mencari kata kunci atau menyaring filter jurusan      │
└───────────────────────────┬────────────────────────────┘
                            │
             ┌──────────────┴──────────────┐
             ▼                             ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│ 4A. Lihat Detail Tempat  │  │  4B. Bandingkan Tempat   │
│ • Nama Perusahaan        │  │ • Pilih 2 tempat PKL     │
│ • Lokasi (Alamat & Maps) │  │ • Bandingkan jam kerja,  │
│ • Jam Kerja (Shift)      │  │   tugas, role, & syarat  │
│ • Hal Dikerjakan (Tugas) │  │   secara berdampingan    │
│ • Role / Bidang          │  │                          │
│ • Syarat Persyaratan     │  │                          │
└────────────┬─────────────┘  └────────────┬─────────────┘
             └──────────────┬──────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  5. Tentukan Pilihan                                   │
│  Menentukan tempat PKL yang paling sesuai              │
└────────────────────────────────────────────────────────┘
```

**Penjelasan Tiap Tahap:**
1. **Masuk ke Website**: Siswa membuka alamat website SIMPUL.
2. **Halaman Beranda**: Siswa melihat sekilas informasi SIMPUL, kategori jurusan, dan langkah-langkah praktis.
3. **Masuk ke Daftar Tempat**: Siswa membuka halaman katalog untuk mencari dan menyaring tempat PKL sesuai jurusannya.
4. **Melihat Detail & Membandingkan**:
   - **Lihat Detail**: Membuka pop-up untuk mengecek nama perusahaan, lokasi & Google Maps, jam kerja shift, hal yang dikerjakan (tugas), role/bidang, dan berkas persyaratan.
   - **Bandingkan Tempat**: Memilih 2 tempat PKL untuk dibandingkan secara langsung berdampingan.
5. **Tentukan Pilihan**: Setelah melihat detail dan membandingkan, siswa menentukan tempat PKL yang paling pas dengan minat dan keahliannya.

---

## 💻 Teknologi yang Digunakan

Aplikasi ini dibagi menjadi dua bagian terpisah:
1. **Tampilan Website (Frontend — Repositori ini)**:
   - Dibuat menggunakan **Next.js**, **React**, dan **Tailwind CSS**.
   - Repositori GitHub: [github.com/riskamufika-dot/simpul_tempat_pkl](https://github.com/riskamufika-dot/simpul_tempat_pkl)
   - Sudah diunggah dan bisa diakses online di: [simpulpkl.vercel.app](https://simpulpkl.vercel.app).
2. **Penyimpanan Data (Backend Strapi — Terpisah)**:
   - Menggunakan **Strapi (Headless CMS)** dan basis data **MySQL**.
   - Repositori GitHub: [github.com/BagasSD/simpul](https://github.com/BagasSD/simpul)
   - Sudah menyala online di server cloud: [simpul-production.up.railway.app](https://simpul-production.up.railway.app).

---

## 🚀 Cara Menjalankan Website di Laptop

Kamu hanya perlu melakukan 3 langkah mudah ini:

### 1. Download & Pasang Bahan (Dependencies)
Buka terminal di folder proyek ini, lalu ketik:
```bash
npm ci
```
*(atau bisa juga ketik `npm install`)*

### 2. Nyalakan Website
Ketik perintah:
```bash
npm run dev
```

### 3. Buka di Browser
Buka Google Chrome atau browser lainnya, lalu ketik alamat:
**http://localhost:3000**

---

## 📁 Panduan Lainnya

- Ingin lihat contekan perintah terminal lengkap? Buka **[docs/commands.md](docs/commands.md)**.
- Ingin baca rencana dan penjelasan fitur lengkap? Buka **[docs/PRD.md](docs/PRD.md)**.

---

## 👥 Tim Pembuat

**SYNERGY TECH (TEAM B)**
- Cici Wahyuningsih
- Imelda Novianti
- Riska Mufika
- Shelva Demiya

