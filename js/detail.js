// ============================================================
// HALAMAN DETAIL PRODUK - detail.html
// ============================================================
(function () {
  var wadah = document.getElementById("isiDetail");
  var id = Number(new URLSearchParams(window.location.search).get("id"));

  document.getElementById("tahun").textContent = new Date().getFullYear();

  function cariProduk(idTarget) {
    var semua = window.PRODUCTS || [];
    for (var i = 0; i < semua.length; i++) {
      if (semua[i].id === idTarget) return semua[i];
    }
    return null;
  }

  function bangun(produk) {
    if (!produk) {
      wadah.innerHTML =
        '<div class="kosong"><h3>Produk tidak ditemukan</h3><p><a href="index.html">&larr; Kembali ke katalog</a></p></div>';
      return;
    }

    function stokInfo(p) {
      if (p.stok === "Terbatas") return '<span class="stok-info hati-hati">Stok terbatas</span>';
      if (p.stok === "Pesanan") return '<span class="stok-info pesan">Made by order</span>';
      return '<span class="stok-info ok">Tersedia</span>';
    }

    wadah.innerHTML =
      '<p class="penunjuk"><a href="index.html">&larr; Kembali ke katalog</a></p>' +
      '<div class="susunan-detail">' +
      '<div>' +
      '<div class="galeri-utama"><img id="fotoUtama" src="' + escapeHtml(produk.foto[0]) + '" alt="' + escapeHtml(produk.nama) + '" /></div>' +
      '<div class="galeri-mini" id="galeriMini"></div>' +
      "</div>" +
      '<div class="info-detail">' +
      '<span class="lencana-kategori">' + escapeHtml(produk.kategori) + "</span>" +
      "<h1>" + escapeHtml(produk.nama) + "</h1>" +
      '<div class="harga-besar">' + formatRupiah(produk.harga) + "</div>" +
      stokInfo(produk) +
      '<hr class="garis-pisah" />' +
      '<div class="deskripsi"><h3>Deskripsi</h3><p>' + escapeHtml(produk.deskripsi) + "</p></div>" +
      '<hr class="garis-pisah" />' +
      '<div class="pesan-baris">' +
      '<div class="pilih-jumlah">' +
      '<button type="button" id="btnKurang">&minus;</button>' +
      '<input type="number" id="jumlahOrder" value="1" min="1" />' +
      '<button type="button" id="btnTambah">+</button>' +
      "</div>" +
      '<button class="btn btn-wa" id="btnWa">Pesan via WhatsApp</button>' +
      "</div>" +
      '<p class="catatan">Klik tombol di atas untuk memesan langsung. Pesanan Anda akan dikirim melalui WhatsApp ke admin kami.</p>' +
      "</div>" +
      "</div>";

    var fotoUtama = document.getElementById("fotoUtama");
    var galeriMini = document.getElementById("galeriMini");
    var jumlahInput = document.getElementById("jumlahOrder");

    produk.foto.forEach(function (src, idx) {
      var img = document.createElement("img");
      img.src = src;
      img.alt = "Foto " + (idx + 1) + " " + produk.nama;
      if (idx === 0) img.className = "aktif";
      img.addEventListener("click", function () {
        fotoUtama.src = src;
        var semua = galeriMini.querySelectorAll("img");
        for (var i = 0; i < semua.length; i++) semua[i].classList.remove("aktif");
        img.classList.add("aktif");
      });
      galeriMini.appendChild(img);
    });

    function ambilJumlah() {
      var n = Number(jumlahInput.value);
      if (isNaN(n) || n < 1) n = 1;
      return n;
    }

    document.getElementById("btnTambah").addEventListener("click", function () {
      jumlahInput.value = ambilJumlah() + 1;
    });
    document.getElementById("btnKurang").addEventListener("click", function () {
      var n = ambilJumlah() - 1;
      if (n < 1) n = 1;
      jumlahInput.value = n;
    });

    document.getElementById("btnWa").addEventListener("click", function () {
      var pesan = pesanOrderProduk(produk, ambilJumlah(), "");
      window.open(tautanWa(pesan), "_blank");
    });

    document.title = produk.nama + " - Irma Furniture";
  }

  window.IRMA.setelahMuat(function () {
    bangun(cariProduk(id));
  });
  window.IRMA.muat();
})();
