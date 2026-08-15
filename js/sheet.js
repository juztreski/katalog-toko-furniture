// ============================================================
// PEMUAT DATA - Google Sheets (realtime) + fallback ke products.js
// ------------------------------------------------------------
// Mencoba memuat produk dari window.SHEET_URL (CSV Google Sheets).
// Jika URL kosong / gagal, memakai window.PRODUCTS (data/products.js).
// Halaman memanggil IRMA.muat() lalu IRMA.setelahMuat(fungsi).
// ============================================================
window.IRMA = window.IRMA || {};

IRMA.panggilan = [];
IRMA.siap = false;
IRMA.sudahDicoba = false;

IRMA.setelahMuat = function (cb) {
  if (IRMA.siap) {
    cb(window.PRODUCTS);
    return;
  }
  IRMA.panggilan.push(cb);
};

IRMA.muat = function () {
  if (IRMA.sudahDicoba) return;
  IRMA.sudahDicoba = true;

  if (!window.SHEET_URL) {
    IRMA.selesai();
    return;
  }

  fetch(window.SHEET_URL, { cache: "no-store" })
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    })
    .then(function (teks) {
      var produk = produkDariCsv(teks);
      if (produk && produk.length) window.PRODUCTS = produk;
      IRMA.selesai();
    })
    .catch(function () {
      IRMA.selesai();
    });
};

IRMA.selesai = function () {
  IRMA.siap = true;
  var daftar = IRMA.panggilan.slice();
  IRMA.panggilan = [];
  daftar.forEach(function (cb) {
    cb(window.PRODUCTS);
  });
};

// ---------- Parser CSV ----------
// Mendukung sel dengan tanda kutip (koma / baris baru di dalam deskripsi).
function parseCsv(teks) {
  var baris = [];
  var barisSaatIni = [];
  var sel = "";
  var dalamKutip = false;
  var c, i;

  for (i = 0; i < teks.length; i++) {
    c = teks[i];
    if (dalamKutip) {
      if (c === '"') {
        if (teks[i + 1] === '"') {
          sel += '"';
          i++;
        } else {
          dalamKutip = false;
        }
      } else {
        sel += c;
      }
    } else if (c === '"') {
      dalamKutip = true;
    } else if (c === ",") {
      barisSaatIni.push(sel);
      sel = "";
    } else if (c === "\n") {
      barisSaatIni.push(sel);
      baris.push(barisSaatIni);
      barisSaatIni = [];
      sel = "";
    } else if (c === "\r") {
      // abaikan carriage return
    } else {
      sel += c;
    }
  }

  if (sel.length || barisSaatIni.length) {
    barisSaatIni.push(sel);
    baris.push(barisSaatIni);
  }

  return baris;
}

function ambilIndeks(header, nama) {
  var target = String(nama).toLowerCase();
  for (var i = 0; i < header.length; i++) {
    if (String(header[i]).trim().toLowerCase() === target) return i;
  }
  return -1;
}

function ubahAngka(nilai) {
  var angka = String(nilai || "").replace(/[^\d]/g, "");
  return angka === "" ? 0 : Number(angka);
}

function ubahFoto(nilai) {
  return String(nilai || "")
    .split(/\s*[,|]\s*/)
    .map(function (f) { return f.trim(); })
    .filter(function (f) { return f !== ""; });
}

// Mengubah baris CSV menjadi array produk.
// Baris pertama = header: id | nama | kategori | harga | stok | deskripsi | foto
function produkDariCsv(teks) {
  var baris = parseCsv(teks);
  if (baris.length < 2) return [];

  var header = baris[0];
  var iId = ambilIndeks(header, "id");
  var iNama = ambilIndeks(header, "nama");
  var iKategori = ambilIndeks(header, "kategori");
  var iHarga = ambilIndeks(header, "harga");
  var iStok = ambilIndeks(header, "stok");
  var iDeskripsi = ambilIndeks(header, "deskripsi");
  var iFoto = ambilIndeks(header, "foto");

  var hasil = [];
  var autoId = 1;

  for (var r = 1; r < baris.length; r++) {
    var barisData = baris[r];
    var ambil = function (idx) {
      return idx >= 0 ? String(barisData[idx] == null ? "" : barisData[idx]).trim() : "";
    };

    var nama = ambil(iNama);
    if (!nama) continue; // abaikan baris kosong / belum diisi

    var id = ubahAngka(ambil(iId));
    if (!id) id = autoId;

    var foto = ubahFoto(ambil(iFoto));
    if (foto.length === 0) foto = ["images/produk/kursi-1.svg"];

    hasil.push({
      id: id,
      nama: nama,
      kategori: ambil(iKategori) || "Lainnya",
      harga: ubahAngka(ambil(iHarga)),
      stok: ambil(iStok) || "Tersedia",
      deskripsi: ambil(iDeskripsi),
      foto: foto
    });
    autoId++;
  }

  return hasil;
}
