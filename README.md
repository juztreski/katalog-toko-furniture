# Irma Furniture - Katalog Online

Website katalog online sederhana untuk toko **Irma Furniture**. Gratis, tanpa server/database. Produk dikelola lewat **Google Sheets** sehingga perubahan tampil secara **realtime** di situs.

## Struktur File

```
projek1/
├── index.html        → Beranda: daftar produk, kategori, pencarian, filter harga
├── detail.html       → Detail produk + galeri foto + tombol pesan WhatsApp
├── kontak.html       → Info toko + form order via WhatsApp
├── admin.html        → Dashboard kelola katalog (link ke Google Sheets + pratinjau)
├── css/style.css     → Desain & tampilan
├── js/
│   ├── config.js     → ★ TEMPAT TEMPEL URL GOOGLE SHEETS
│   ├── sheet.js      → Pemuat data dari Google Sheets (realtime)
│   ├── ui.js / wa.js → Utilitas & pengaturan WhatsApp
│   └── catalog.js / detail.js / kontak.js / admin.js → Logika tiap halaman
├── data/products.js  → Data cadangan (fallback bila sheets belum diatur)
└── images/produk/    → Foto produk (opsional; bisa juga URL eksternal)
```

## Cara Menjalankan Secara Lokal

```bash
# dari folder projek1
python3 -m http.server 8000
```

Lalu buka http://localhost:8000

## Update Produk secara REALTIME via Google Sheets

1. Buka **https://sheets.new** dan buat sheet dengan **baris pertama**:

   ```
   id | nama | kategori | harga | stok | deskripsi | foto
   ```

   Contoh satu baris produk:
   ```
   1 | Sofa 3 Seater | Sofa | 2750000 | Tersedia | Sofa bahan fabrik halus, rangka kayu solid. | images/produk/sofa-1.svg, images/produk/sofa-2.svg
   ```

   - `harga` = angka rupiah tanpa titik (contoh: `2750000`)
   - `stok` = `Tersedia`, `Terbatas`, atau `Pesanan`
   - `foto` = nama file di `images/produk/` **atau** URL gambar (pisahkan beberapa foto dengan koma `,`)
   - Baris tanpa nama produk akan diabaikan otomatis

2. **File → Share → "Anyone with the link" → pilih "Viewer" → Copy link**.

3. Salin **ID sheet** dari link itu (bagian `.../d/<ID_SHEET>/edit`), lalu tempel URL berikut di **`js/config.js`**:

   ```js
   window.SHEET_URL = "https://docs.google.com/spreadsheets/d/<ID_SHEET>/export?format=csv&gid=0";
   ```

4. Commit & push perubahan ini **sekali saja**:

   ```bash
   git add -A
   git commit -m "Hubungkan katalog ke Google Sheets"
   git push
   ```

5. **Selesai.** Mulai sekarang, cukup ubah data di spreadsheet → simpan → pengunjung melihat produk terbaru begitu mereka membuka/refresh halaman. Tidak perlu download/upload file lagi.

> Jika `window.SHEET_URL` dibiarkan kosong, situs otomatis memakai data dari `data/products.js`.

## Menambah Foto Produk Baru

- Foto di repo: masukkan file ke folder `images/produk/` lalu tulis `images/produk/<namafile>.jpg` di kolom `foto`. (Menambah file foto baru perlu commit & push.)
- Foto via URL: upload ke layanan gambar gratis (Postimages, Imgur, dll), salin tautan gambarnya, lalu tempel di kolom `foto`. Real-time penuh.

## Cara Membuatnya Online (GRATIS)

Repo ini sudah di GitHub → **GitHub Pages** otomatis aktif:
- Alamat: `https://juztreski.github.io/katalog-toko-furniture/`

Setiap kali `git push` ke branch `main`, GitHub Pages membangun ulang situs (±1 menit).

**Alternatif:** Netlify Drop (https://app.netlify.com/drop) — seret seluruh folder, atau gunakan Vercel/Cloudflare Pages.

## Pengaturan Penting

| Hal | Lokasi |
|---|---|
| Nomor WhatsApp toko | `js/wa.js` baris `var WA_NUMBER = "6285161996787";` |
| URL Google Sheets | `js/config.js` baris `window.SHEET_URL = "..."` |
| Alamat & jam toko | `kontak.html` bagian "Info Toko" |
| Data cadangan (fallback) | `data/products.js` |
