// ============================================================
// DASHBOARD KELOLA KATALOG - admin.html
// (tabel pratinjau + link ke Google Sheets)
// ============================================================
(function () {
  var tbody = document.getElementById("tbodyProduk");
  var kosong = document.getElementById("adminKosong");
  var linkSheet = document.getElementById("linkSheet");
  var belumDiatur = document.getElementById("belumDiatur");

  function labelStok(p) {
    if (p.stok === "Terbatas") return "Terbatas";
    if (p.stok === "Pesanan") return "Made by order";
    return "Tersedia";
  }

  function renderTabel() {
    var isi = (window.PRODUCTS || [])
      .slice()
      .sort(function (a, b) { return b.id - a.id; });

    document.getElementById("jumlahProduk").textContent =
      isi.length + " produk (sumber: " + (window.SHEET_URL ? "Google Sheets" : "data/products.js") + ")";

    if (isi.length === 0) {
      tbody.innerHTML = "";
      kosong.style.display = "block";
      return;
    }

    kosong.style.display = "none";
    tbody.innerHTML = isi
      .map(function (p) {
        return (
          "<tr>" +
          '<td><img class="foto-tabel" src="' + escapeHtml(p.foto[0]) + '" alt="" /></td>' +
          "<td>" + escapeHtml(p.nama) + "</td>" +
          "<td>" + escapeHtml(p.kategori) + "</td>" +
          "<td>" + formatRupiah(p.harga) + "</td>" +
          "<td>" + labelStok(p) + "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function aturLinkSheet() {
    if (window.SHEET_URL) {
      var cocok = window.SHEET_URL.match(/spreadsheets\/d\/([^\/]+)/);
      if (cocok) {
        linkSheet.href = "https://docs.google.com/spreadsheets/d/" + cocok[1] + "/edit";
      }
      linkSheet.style.display = "inline-flex";
      belumDiatur.style.display = "none";
    } else {
      linkSheet.style.display = "none";
      belumDiatur.style.display = "block";
    }
  }

  document.getElementById("tahun").textContent = new Date().getFullYear();

  aturLinkSheet();
  renderTabel();
  window.IRMA.setelahMuat(renderTabel);
  window.IRMA.muat();
})();
