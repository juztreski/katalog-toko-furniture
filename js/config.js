// ============================================================
// KONFIGURASI - IRMA FURNITURE
// ------------------------------------------------------------
// TEMPELKAN URL GOOGLE SHEETS DI SINI untuk update produk realtime.
//
// Cara mendapatkannya:
// 1. Buka https://sheets.new lalu buat sheet dengan baris pertama:
//    id | nama | kategori | harga | stok | deskripsi | foto
// 2. Klik File > Share > "Anyone with the link" > pilih "Viewer" > Copy link
// 3. Salin URL hasil share, lalu ubah formatnya menjadi:
//    https://docs.google.com/spreadsheets/d/<ID_SHEET>/export?format=csv&gid=0
//    (hanya bagian <ID_SHEET> saja yang diambil dari link share tadi)
// 4. Tempel di bawah, lalu commit & push sekali. Setelah itu update
//    cukup lewat spreadsheet - langsung tampil di situs.
//
// Contoh:
//   window.SHEET_URL = "https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/export?format=csv&gid=0";
//
// Jika dibiarkan kosong (""), situs otomatis memakai data/data/products.js.
// ============================================================
window.SHEET_URL = "https://docs.google.com/spreadsheets/d/1PgCCfjOqXajMTNKzekpuixp2-KUI6uuVTnkOjwGggMs/export?format=csv&gid=0";
