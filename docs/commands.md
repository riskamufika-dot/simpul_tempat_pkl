
# Panduan Perintah Terminal (Commands) — SIMPUL

File ini adalah **buku contekan perintah** yang diketik di layar hitam/biru (Terminal) laptop saat kamu ingin menjalankan, mengecek, atau menguji website SIMPUL.

> 💡 **PENTING UNTUK DIINGAT**:  
> Di laptopmu, kamu **hanya menjalankan tampilan website (Frontend)** saja. Kamu **TIDAK PERLU** menyalakan server backend Strapi atau database, karena datanya sudah otomatis menyala online di internet (Railway).

---

## 📌 3 Perintah yang Paling Sering Digunakan

Biar tidak bingung, sebenarnya perintah yang sering dipakai sehari-hari cuma 3 ini:

| Perintah | Kapan Dipakai? | Apa Fungsinya? |
|---|---|---|
| `npm ci` | Cuma **1 kali** saat baru pertama download proyek. | Mendownload dan memasang semua bahan kodingan yang dibutuhkan website. |
| `npm run dev` | **Setiap hari** saat mau menyalakan website di laptop. | Menyalakan website agar bisa dibuka di Google Chrome (`http://localhost:3000`). |
| `npm run lint` | Sebelum kodingan dikumpulkan atau dipresentasikan. | Memeriksa apakah ada kodingan yang salah ketik atau error. |

---

## 1. Syarat di Laptop Kamu

Sebelum mengetik perintah apa pun, laptopmu harus sudah terpasang program **Node.js**.  
Untuk mengecek apakah sudah ada di laptop, ketik ini di terminal lalu tekan Enter:

```bash
node -v
npm -v
```
*(Kalau muncul angka versinya, berarti laptopmu sudah siap!)*

---

## 2. Cara Memasang Bahan Website (Install Dependencies)

Saat baru pertama kali mengambil proyek ini dari GitHub, kodingannya belum punya bahan-bahan pendukung. Kamu harus memasangnya terlebih dahulu dengan mengetik:

```bash
npm ci
```
* **Kenapa pakai `npm ci`?** Supaya semua paket kodingan yang terpasang persis sama dengan yang dipakai teman satu kelompokmu, tidak ada yang beda versi.
* *(Kalau kamu terbiasa pakai `npm install`, itu juga boleh dan bisa digunakan).*

---

## 3. Cara Menyalakan Website di Laptop (Development)

Ini adalah perintah yang **paling sering kamu ketik setiap hari** saat mau melihat atau mencoba website SIMPUL:

```bash
npm run dev
```

**Langkah setelah mengetik perintah di atas:**
1. Tunggu beberapa detik sampai muncul tulisan `Ready in ... ms`.
2. Buka browser (Google Chrome).
3. Ketik alamat ini di browser: **http://localhost:3000**
4. Website SIMPUL akan langsung menyala di layarmu!

**Cara Mematikan Website:**
Kalau sudah selesai dan mau menutup website, klik di layar terminal lalu tekan tombol keyboard **`Ctrl` + `C`**.

---

## 4. Cara Mengecek Kodingan (Linting)

Sebelum kamu presentasi ke pembimbing atau upload ke GitHub, kamu bisa meminta komputer memeriksa apakah ada salah ketik atau kodingan yang berpotensi error:

```bash
npm run lint
```
* Kalau terminal tidak menampilkan tulisan warna merah, berarti semua file kodinganmu sudah rapi dan aman!

---

## 5. Cara Menguji Kesiapan Upload ke Internet (Build)

Jika website mau di-upload ke Vercel agar bisa dibuka orang lain di internet, kamu bisa mengetesnya dulu di laptop:

```bash
npm run build
```
Perintah ini akan membungkus dan merapikan seluruh kodingan agar ukurannya ringan saat diakses oleh pengguna.

---

## 6. Tentang Alamat Server Data (Backend)

Website SIMPUL ini mengambil data tempat PKL secara online dari server Strapi di internet:
- **Server API Live**: [https://simpul-production.up.railway.app](https://simpul-production.up.railway.app)
- **Repositori Backend Strapi**: [https://github.com/BagasSD/simpul](https://github.com/BagasSD/simpul)

Pengaturan koneksi ini sudah otomatis terpasang di dalam kodingan frontend. Jadi untuk mengerjakan website ini, kamu **tidak perlu menjalankan backend lokal**. 

*(Catatan: Jika sewaktu-waktu kamu ingin menjalankan Strapi di komputermu sendiri, kamu bisa mendownload repositori backend di atas, lalu ketik `npm install` dan `npm run develop` di folder backend tersebut).*

---

## 7. Solusi Kalau Terjadi Masalah (Tanya Jawab Singkat)

| Masalah yang Muncul | Apa Penyebabnya? | Cara Mengatasinya |
|---|---|---|
| Muncul tulisan *Port 3000 is in use* | Port 3000 masih terpakai oleh aplikasi lain atau terminal sebelumnya belum dimatikan. | Jangan panik! Next.js otomatis memindahkan ke alamat `http://localhost:3001`. Buka saja alamat tersebut di Chrome. |
| Di website tertulis *"Data tempat PKL gagal dimuat"* | Koneksi internet di laptopmu sedang lambat atau terputus. | Pastikan laptopmu terhubung ke internet (WiFi/Hotspot), lalu klik tombol *"Coba lagi"* di layar website. |
| Terminal menampilkan banyak tulisan merah saat `npm run dev` | Ada bahan kodingan yang belum terpasang sempurna. | Ketik ulang `npm ci` di terminal, tunggu sampai selesai, lalu coba ketik `npm run dev` lagi. |


