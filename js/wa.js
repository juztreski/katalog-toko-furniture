// ============================================================
// PENGATURAN WHATSAPP - IRMA FURNITURE
// ------------------------------------------------------------
// GANTI NOMOR WA DI SINI bila nomor toko berubah.
// Format: kode negara + nomor, tanpa +, spasi, atau tanda (-)
// Contoh Indonesia: 6281234567890
// ============================================================
var WA_NUMBER = "6285161996787";

function tautanWa(pesan) {
  return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(pesan);
}

function pesanOrderProduk(produk, jumlah, catatan) {
  var baris = [
    "Halo *Irma Furniture*, saya ingin memesan:",
    "",
    "\uD83D\uDD11 " + produk.nama,
    "Harga: " + formatRupiah(produk.harga),
    "Jumlah: " + jumlah + " pcs",
    "Total: " + formatRupiah(produk.harga * jumlah)
  ];
  if (catatan && catatan.trim()) {
    baris.push("");
    baris.push("Catatan: " + catatan.trim());
  }
  baris.push("");
  baris.push("Mohon info ketersediaan & cara pembayarannya. Terima kasih.");
  return baris.join("\n");
}

function pesanOrderForm(data) {
  var baris = [
    "Halo *Irma Furniture*, saya ingin melakukan order:",
    "",
    "Nama: " + data.nama,
    "No. WhatsApp: " + data.telepon
  ];
  if (data.produk) baris.push("Produk: " + data.produk);
  baris.push("Jumlah: " + data.jumlah + " pcs");
  if (data.catatan && data.catatan.trim()) {
    baris.push("");
    baris.push("Catatan: " + data.catatan.trim());
  }
  baris.push("");
  baris.push("Mohon info ketersediaan & cara pembayarannya. Terima kasih.");
  return baris.join("\n");
}
