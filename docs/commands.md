
# Commands — SIMPUL

Dokumen ini berisi perintah untuk instalasi,
pengembangan, dan pemeriksaan project SIMPUL.

## 1. Instalasi Dependencies

```bash
npm install
```

## 2. Menjalankan Development Server

```bash
npm run dev
```

Buka http://localhost:3000 di browser.

## 3. Build Production

```bash
npm run build
```

## 4. Menjalankan Production Build

```bash
npm run start
```

Jalankan setelah proses build berhasil.

## 5. Pemeriksaan Kode

```bash
npm run lint
```

Jalankan jika script lint tersedia di package.json.

## 6. Backend Strapi

Jalankan perintah dari folder backend yang berisi
package.json Strapi.

```bash
npm install
npm run develop
```

Periksa package.json backend untuk memastikan
perintah tersebut sesuai dengan konfigurasi project.

## Catatan

- Periksa package.json sebelum menjalankan command.
- Pastikan environment variable sudah dikonfigurasi.
- Jangan membagikan password database atau API key.
- Pastikan backend aktif jika frontend membutuhkan API.
