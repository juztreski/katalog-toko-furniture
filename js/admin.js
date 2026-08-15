// ============================================================
// PANEL ADMIN - admin.html
// ------------------------------------------------------------
// CARA MENGGANTI PASSWORD:
// Ubah teks di dalam tanda kutip pada baris: 
//   var HASH_PASSWORD = hashSederhana("irma2026");
// Ganti "irma2026" dengan password baru Anda.
// (Password hanya diperiksa di browser, jadi sebaiknya
//  jangan memakai password penting untuk panel ini.)
// ============================================================
(function () {
  var HASH_PASSWORD = hashSederhana("irma2026");
  var KUNCI_SESI = "irma_admin_aktif";

  var produk = (window.PRODUCTS || []).slice();
  var sedangEdit = null; // id produk yang sedang diedit, null = tambah baru

  function hashSederhana(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) {
      h = ((h << 5) + h) + s.charCodeAt(i);
    }
    return h >>> 0;
  }

  function idBaru() {
    var maks = 0;
    produk.forEach(function (p) { if (p.id > maks) maks = p.id; });
    return maks + 1;
  }

  function daftarKategori() {
    var set = ["Kursi", "Meja", "Lemari", "Sofa", "Tempat Tidur", "Rak", "Lainnya"];
    produk.forEach(function (p) {
      if (set.indexOf(p.kategori) === -1) set.push(p.kategori);
    });
    return set.sort();
  }

  // ---------- Login ----------
  function cekLogin() {
    return localStorage.getItem(KUNCI_SESI) === "1";
  }

  function tampilLogin() {
    document.getElementById("kartuLogin").style.display = "block";
    document.getElementById("panelAdmin").style.display = "none";
  }

  function tampilPanel() {
    document.getElementById("kartuLogin").style.display = "none";
    document.getElementById("panelAdmin").style.display = "block";
    renderTabel();
  }

  if (!cekLogin()) tampilLogin();
  else tampilPanel();

  document.getElementById("formLogin").addEventListener("submit", function (e) {
    e.preventDefault();
    var nilai = document.getElementById("inputPassword").value;
    if (hashSederhana(nilai) === HASH_PASSWORD) {
      localStorage.setItem(KUNCI_SESI, "1");
      document.getElementById("pesanSalah").style.display = "none";
      document.getElementById("inputPassword").value = "";
      tampilPanel();
    } else {
      document.getElementById("pesanSalah").style.display = "block";
    }
  });

  document.getElementById("btnKeluar").addEventListener("click", function () {
    localStorage.removeItem(KUNCI_SESI);
    tampilLogin();
  });

  // ---------- Tabel ----------
  function labelStok(p) {
    if (p.stok === "Terbatas") return "Terbatas";
    if (p.stok === "Pesanan") return "Made by order";
    return "Tersedia";
  }

  function renderTabel() {
    var cari = document.getElementById("cariAdmin").value.trim().toLowerCase();
    var isi = produk
      .filter(function (p) {
        return !cari || (p.nama + " " + p.kategori).toLowerCase().indexOf(cari) !== -1;
      })
      .slice()
      .sort(function (a, b) { return b.id - a.id; });

    document.getElementById("jumlahProduk").textContent = produk.length + " produk total";

    var tbody = document.getElementById("tbodyProduk");
    var kosong = document.getElementById("adminKosong");

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
          '<td><div class="aksi">' +
          '<button class="btn btn-garis btn-kecil" data-aksi="edit" data-id="' + p.id + '">Edit</button>' +
          '<button class="btn btn-merah btn-kecil" data-aksi="hapus" data-id="' + p.id + '">Hapus</button>' +
          "</div></td>" +
          "</tr>"
        );
      })
      .join("");
  }

  document.getElementById("cariAdmin").addEventListener("input", renderTabel);

  document.getElementById("tbodyProduk").addEventListener("click", function (e) {
    var tombol = e.target.closest("button[data-aksi]");
    if (!tombol) return;
    var id = Number(tombol.dataset.id);
    if (tombol.dataset.aksi === "edit") bukaForm(id);
    else if (tombol.dataset.aksi === "hapus") hapusProduk(id);
  });

  // ---------- Form produk ----------
  function tambahKolomFoto(nilai) {
    var wadahFoto = document.getElementById("daftarFoto");
    var baris = document.createElement("div");
    baris.className = "foto-medan";
    baris.style.marginBottom = "8px";

    var input = document.createElement("input");
    input.type = "text";
    input.className = "foto-input";
    input.placeholder = "cth. images/produk/kursi-1.svg";
    if (nilai) input.value = nilai;

    var hapus = document.createElement("button");
    hapus.type = "button";
    hapus.className = "btn btn-garis btn-kecil";
    hapus.textContent = "Hapus";

    hapus.addEventListener("click", function () {
      if (wadahFoto.querySelectorAll(".foto-medan").length > 1) {
        baris.remove();
      } else {
        notif("Minimal satu foto diperlukan.");
      }
    });

    baris.appendChild(input);
    baris.appendChild(hapus);
    wadahFoto.appendChild(baris);
  }

  document.getElementById("btnTambahFoto").addEventListener("click", function () {
    tambahKolomFoto("");
  });

  function isiPilihanKategori(nilaiSekarang) {
    var pilih = document.getElementById("pKategori");
    pilih.innerHTML = "";
    daftarKategori().forEach(function (nama) {
      var opsi = document.createElement("option");
      opsi.value = nama;
      opsi.textContent = nama;
      pilih.appendChild(opsi);
    });
    if (nilaiSekarang) pilih.value = nilaiSekarang;
  }

  function bukaForm(id) {
    sedangEdit = null;
    document.getElementById("formProduk").reset();
    document.getElementById("daftarFoto").innerHTML = "";

    if (id != null) {
      var p = null;
      produk.forEach(function (x) { if (x.id === id) p = x; });
      if (!p) return;
      sedangEdit = id;
      document.getElementById("judulModal").textContent = "Edit Produk";
      document.getElementById("pNama").value = p.nama;
      document.getElementById("pHarga").value = p.harga;
      document.getElementById("pStok").value = p.stok || "Tersedia";
      document.getElementById("pDeskripsi").value = p.deskripsi || "";
      isiPilihanKategori(p.kategori);
      (p.foto && p.foto.length ? p.foto : [""]).forEach(function (f) {
        tambahKolomFoto(f);
      });
    } else {
      document.getElementById("judulModal").textContent = "Tambah Produk";
      isiPilihanKategori("");
      tambahKolomFoto("");
    }

    document.getElementById("lapisanForm").classList.add("tampil");
  }

  document.getElementById("btnTambah").addEventListener("click", function () {
    bukaForm(null);
  });

  document.getElementById("btnBatal").addEventListener("click", function () {
    document.getElementById("lapisanForm").classList.remove("tampil");
  });

  document.getElementById("lapisanForm").addEventListener("click", function (e) {
    if (e.target === this) this.classList.remove("tampil");
  });

  function ambilFotoInput() {
    var inputFoto = document.querySelectorAll(".foto-input");
    var daftar = [];
    for (var i = 0; i < inputFoto.length; i++) {
      var nilai = inputFoto[i].value.trim();
      if (nilai) daftar.push(nilai);
    }
    return daftar;
  }

  document.getElementById("formProduk").addEventListener("submit", function (e) {
    e.preventDefault();

    var nama = document.getElementById("pNama").value.trim();
    var harga = Number(document.getElementById("pHarga").value);
    var kategori = document.getElementById("pKategori").value;
    var stok = document.getElementById("pStok").value;
    var deskripsi = document.getElementById("pDeskripsi").value.trim();
    var foto = ambilFotoInput();

    if (!nama || !kategori || !deskripsi || isNaN(harga) || harga < 0) {
      notif("Lengkapi semua kolom yang wajib diisi.");
      return;
    }
    if (foto.length === 0) {
      notif("Tambahkan minimal satu foto produk.");
      return;
    }

    if (sedangEdit != null) {
      produk.forEach(function (p) {
        if (p.id === sedangEdit) {
          p.nama = nama;
          p.harga = harga;
          p.kategori = kategori;
          p.stok = stok;
          p.deskripsi = deskripsi;
          p.foto = foto;
        }
      });
      notif("Produk berhasil diperbarui.");
    } else {
      produk.push({
        id: idBaru(),
        nama: nama,
        harga: harga,
        kategori: kategori,
        stok: stok,
        deskripsi: deskripsi,
        foto: foto
      });
      notif("Produk berhasil ditambahkan.");
    }

    document.getElementById("lapisanForm").classList.remove("tampil");
    renderTabel();
  });

  // ---------- Hapus ----------
  function hapusProduk(id) {
    var p = null;
    produk.forEach(function (x) { if (x.id === id) p = x; });
    if (!p) return;
    if (confirm('Hapus produk "' + p.nama + '"?')) {
      produk = produk.filter(function (x) { return x.id !== id; });
      renderTabel();
      notif("Produk dihapus.");
    }
  }

  // ---------- Download ----------
  document.getElementById("btnDownload").addEventListener("click", function () {
    var isi =
      "// ============================================================\n" +
      "// DATA PRODUK IRMA FURNITURE\n" +
      "// Hasil export dari panel admin. Ganti file data/products.js\n" +
      "// di komputer Anda dengan file ini, lalu upload ulang ke hosting.\n" +
      "// ============================================================\n" +
      "window.PRODUCTS = " + JSON.stringify(produk, null, 2) + ";\n";

    var blob = new Blob([isi], { type: "application/javascript;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "products.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notif("products.js berhasil diunduh.");
  });
})();
