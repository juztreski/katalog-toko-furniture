// ============================================================
// HALAMAN KONTAK / ORDER - kontak.html
// ============================================================
(function () {
  var pilihProduk = document.getElementById("fProduk");
  var semuaProduk = window.PRODUCTS || [];

  semuaProduk.forEach(function (p) {
    var opsi = document.createElement("option");
    opsi.value = p.nama;
    opsi.textContent = p.nama + " - " + formatRupiah(p.harga);
    pilihProduk.appendChild(opsi);
  });

  document.getElementById("formOrder").addEventListener("submit", function (e) {
    e.preventDefault();
    var data = {
      nama: document.getElementById("fNama").value.trim(),
      telepon: document.getElementById("fTelepon").value.trim(),
      produk: pilihProduk.value,
      jumlah: document.getElementById("fJumlah").value,
      catatan: document.getElementById("fCatatan").value
    };
    if (!data.nama || !data.telepon) {
      notif("Mohon isi nama dan nomor WhatsApp.");
      return;
    }
    window.open(tautanWa(pesanOrderForm(data)), "_blank");
  });

  document.getElementById("tahun").textContent = new Date().getFullYear();
})();
