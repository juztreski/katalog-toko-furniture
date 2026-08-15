// ============================================================
// KATALOG UTAMA - index.html
// (memuat data dari Google Sheets bila diatur, fallback products.js)
// ============================================================
(function () {
  var semuaProduk = (window.PRODUCTS || []).slice().sort(function (a, b) {
    return b.id - a.id;
  });
  var kategoriAktif = "Semua";
  var cari = "";
  var minHarga = null;
  var maxHarga = null;
  var urutan = "";

  var grid = document.getElementById("gridProduk");
  var kosong = document.getElementById("kosong");
  var keterangan = document.getElementById("keteranganKatalog");
  var pilKategori = document.getElementById("pilKategori");

  function ambilSemua() {
    semuaProduk = (window.PRODUCTS || []).slice().sort(function (a, b) {
      return b.id - a.id;
    });
  }

  function daftarKategori() {
    var set = {};
    semuaProduk.forEach(function (p) {
      set[p.kategori] = true;
    });
    return Object.keys(set).sort();
  }

  function tampilKategori() {
    var daftar = ["Semua"].concat(daftarKategori());
    pilKategori.innerHTML = "";
    daftar.forEach(function (nama) {
      var tombol = document.createElement("button");
      tombol.type = "button";
      tombol.className = "pil" + (nama === kategoriAktif ? " aktif" : "");
      tombol.textContent = nama;
      tombol.addEventListener("click", function () {
        kategoriAktif = nama;
        render();
      });
      pilKategori.appendChild(tombol);
    });
  }

  function filterProduk() {
    var hasil = semuaProduk.filter(function (p) {
      if (kategoriAktif !== "Semua" && p.kategori !== kategoriAktif) return false;
      if (cari) {
        var teks = (p.nama + " " + p.kategori + " " + p.deskripsi).toLowerCase();
        if (teks.indexOf(cari) === -1) return false;
      }
      if (minHarga !== null && p.harga < minHarga) return false;
      if (maxHarga !== null && p.harga > maxHarga) return false;
      return true;
    });

    if (urutan === "termurah") hasil.sort(function (a, b) { return a.harga - b.harga; });
    else if (urutan === "termahal") hasil.sort(function (a, b) { return b.harga - a.harga; });
    else if (urutan === "nama") hasil.sort(function (a, b) { return a.nama.localeCompare(b.nama, "id"); });
    return hasil;
  }

  function kartuStok(p) {
    if (p.stok === "Terbatas") return '<span class="kartu-stok hati-hati">Stok terbatas</span>';
    if (p.stok === "Pesanan") return '<span class="kartu-stok hati-hati">Made by order</span>';
    return '<span class="kartu-stok ok">Tersedia</span>';
  }

  function render() {
    ambilSemua();
    var hasil = filterProduk();
    keterangan.textContent =
      kategoriAktif === "Semua"
        ? "Menampilkan " + hasil.length + " produk"
        : "Kategori " + kategoriAktif + " - " + hasil.length + " produk";

    if (hasil.length === 0) {
      grid.innerHTML = "";
      kosong.style.display = "block";
      return;
    }

    kosong.style.display = "none";
    grid.innerHTML = hasil
      .map(function (p) {
        return (
          '<article class="kartu">' +
          '<a href="detail.html?id=' + p.id + '" class="kartu-foto">' +
          '<span class="lencana-kategori">' + escapeHtml(p.kategori) + "</span>" +
          '<img src="' + escapeHtml(p.foto[0]) + '" alt="' + escapeHtml(p.nama) + '" loading="lazy" />' +
          "</a>" +
          '<div class="kartu-badan">' +
          '<h3><a href="detail.html?id=' + p.id + '">' + escapeHtml(p.nama) + "</a></h3>" +
          '<span class="kartu-harga">' + formatRupiah(p.harga) + "</span>" +
          kartuStok(p) +
          '<div class="kartu-tombol">' +
          '<a href="detail.html?id=' + p.id + '" class="btn btn-utama">Lihat Detail</a>' +
          "</div>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  function bacaFilter() {
    minHarga = document.getElementById("hargaMin").value === "" ? null : Number(document.getElementById("hargaMin").value);
    maxHarga = document.getElementById("hargaMax").value === "" ? null : Number(document.getElementById("hargaMax").value);
    urutan = document.getElementById("urutHarga").value;
  }

  document.getElementById("formCari").addEventListener("submit", function (e) {
    e.preventDefault();
    cari = document.getElementById("inputCari").value.trim().toLowerCase();
    render();
  });

  document.getElementById("inputCari").addEventListener("input", function (e) {
    cari = e.target.value.trim().toLowerCase();
    render();
  });

  document.getElementById("hargaMin").addEventListener("input", function () { bacaFilter(); render(); });
  document.getElementById("hargaMax").addEventListener("input", function () { bacaFilter(); render(); });
  document.getElementById("urutHarga").addEventListener("change", function () { bacaFilter(); render(); });

  document.getElementById("tahun").textContent = new Date().getFullYear();

  function init() {
    ambilSemua();
    tampilKategori();
    render();
  }

  init();
  window.IRMA.setelahMuat(function () { init(); });
  window.IRMA.muat();
})();
