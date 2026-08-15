# Irma Furniture - Katalog Online

Website katalog online sederhana untuk toko **Irma Furniture**. Gratis, tanpa server/database, cukup HTML/CSS/JS + file data.

## Struktur File

```
projek1/
├── index.html        → Beranda: daftar produk, kategori, pencarian, filter harga
├── detail.html       → Detail produk + galeri foto + tombol pesan WhatsApp
├── kontak.html       → Info toko + form order via WhatsApp
├── admin.html        → Panel admin (kelola produk + download data)
├── css/style.css     → Desain & tampilan
├── js/               → Logika katalog, detail, kontak, admin
├── data/products.js  → DATA PRODUK (file yang berisi seluruh produk)
└── images/produk/    → Foto produk
```

## Cara Menjalankan Secara Lokal

Buka `index.html` langsung di browser (klik dua kali), atau lebih baik jalankan server lokal:

```bash
# dari folder projek1
python3 -m http.server 8000
```

Lalu buka http://localhost:8000

## Cara Menambah/Mengubah Produk (untuk pemilik)

1. Buka halaman **Admin** (`admin.html`) pada website yang sudah online.
2. Masukkan kata sandi. **Kata sandi bawaan: `irma2026`** (cara ganti: ubah teks di `js/admin.js` baris `var HASH_PASSWORD = hashSederhana("irma2026");`).
3. Klik **+ Tambah Produk**, isi nama, kategori, harga, status stok, foto, deskripsi.
   - Foto: letakkan file foto di folder `images/produk/`, lalu isi namanya mis. `images/produk/kursi-1.svg`. Minimal 1 foto per produk.
4. Klik **Simpan**, lalu klik **Download products.js**.
5. Ganti file `data/products.js` di proyek ini dengan hasil unduhan.
6. Upload ulang seluruh folder ke hosting.

## Cara Membuatnya Online (GRATIS) - Netlify Drop

Cara termudah (tanpa akun dulu):

1. Buka https://app.netlify.com/drop
2. Seret (drag & drop) **seluruh folder projek1** ke halaman itu.
3. Selesai — website Anda langsung online dengan alamat seperti `https://xyz.netlify.app`.

Saat produk berubah, ulangi langkah di atas (drag & drop folder) dan alamat lama tetap sama bila pakai akun Netlify. Untuk alamat yang stabil & gratis selamanya, buat akun Netlify gratis lalu deploy lewat UI yang sama.

**Alternatif gratis lain:** GitHub Pages (perlu akun GitHub), Vercel, atau Cloudflare Pages.

## Pengaturan Penting

| Hal | Lokasi |
|---|---|
| Nomor WhatsApp toko | `js/wa.js` baris `var WA_NUMBER = "6285161996787";` |
| Kata sandi admin | `js/admin.js` baris `var HASH_PASSWORD = hashSederhana("irma2026");` |
| Alamat & jam toko | `kontak.html` bagian "Info Toko" |
| Contoh produk awal | `data/products.js` |

> **Catatan keamanan:** Kata sandi admin hanya diperiksa di browser pengunjung. Karena itu gunakan kata sandi khusus untuk katalog ini dan jangan dipakai untuk akun penting lain. Untuk keamanan penuh, perlu backend (tidak tersedia di versi gratis ini).
