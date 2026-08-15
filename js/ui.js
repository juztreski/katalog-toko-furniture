// ============================================================
// UTILITAS UMUM (format rupiah, HTML, notifikasi)
// ============================================================

function formatRupiah(nilai) {
  return "Rp " + Number(nilai || 0).toLocaleString("id-ID");
}

function escapeHtml(teks) {
  return String(teks == null ? "" : teks)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

let notifTimer = null;
function notif(pesan) {
  let el = document.getElementById("notif");
  if (!el) {
    el = document.createElement("div");
    el.id = "notif";
    el.className = "notif";
    document.body.appendChild(el);
  }
  el.textContent = pesan;
  el.classList.add("tampil");
  clearTimeout(notifTimer);
  notifTimer = setTimeout(function () {
    el.classList.remove("tampil");
  }, 2600);
}
