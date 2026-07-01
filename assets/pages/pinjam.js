/**
 * ==========================================
 * HHT ASSET MANAGEMENT
 * Page      : Peminjaman
 * Version   : 1.0.0
 * Depends   : config.js, api.js, Bootstrap, SweetAlert2
 * ==========================================
 */

let hhtList = [];
let departmentList = [];
let borrowModal;


/**
 * Page Load
 */
window.addEventListener("load", function () {

  borrowModal = new bootstrap.Modal(document.getElementById("borrowModal"));

  loadBorrowPage();

  document.getElementById("searchInput").addEventListener("input", renderBorrowGrid);

  document.getElementById("borrowForm").addEventListener("submit", submitBorrow);

});


/**
 * Load Data Halaman
 */
async function loadBorrowPage() {

  const hhtRes = await API.get("hht");
  const deptRes = await API.get("department");

  if (!hhtRes.success) {
    Swal.fire("Error", hhtRes.message, "error");
    return;
  }

  if (!deptRes.success) {
    Swal.fire("Error", deptRes.message, "error");
    return;
  }

  hhtList = hhtRes.data || [];
  departmentList = deptRes.data || [];

  renderDepartment();
  renderBorrowGrid();

}


/**
 * Render Department
 */
function renderDepartment() {

  const select = document.getElementById("department");

  let html = `<option value="">Pilih Department</option>`;

  departmentList.forEach(function (dept) {

    html += `
      <option value="${dept.nama}">
        ${dept.nama}
      </option>
    `;

  });

  select.innerHTML = html;

}


/**
 * Render Grid HHT
 */
function renderBorrowGrid() {

  const grid = document.getElementById("borrowGrid");
  const keyword = document.getElementById("searchInput").value.toLowerCase();

  const filtered = hhtList.filter(function (item) {

    return (
      String(item.no_hht).toLowerCase().includes(keyword) ||
      String(item.nama_hht).toLowerCase().includes(keyword) ||
      String(item.status).toLowerCase().includes(keyword)
    );

  });


  if (filtered.length === 0) {

    grid.innerHTML = `
      <div class="empty-state">
        Data HHT tidak ditemukan.
      </div>
    `;

    return;

  }


  let html = "";

  filtered.forEach(function (item) {

    const status = String(item.status || "").toUpperCase();

    const cardClass = status === "AVAILABLE"
      ? "available"
      : "borrowed";

    const button = status === "AVAILABLE"
      ? `
        <button 
          class="btn btn-primary w-100 mt-3" 
          onclick="openBorrowModal('${item.id}')"
        >
          <i class="bi bi-box-arrow-up"></i>
          Pinjam
        </button>
      `
      : `
        <button class="btn btn-secondary w-100 mt-3" disabled>
          Sedang Dipinjam
        </button>
      `;

    html += `
      <div class="hht-card ${cardClass}">

        <div class="hht-no">
          HHT ${item.no_hht}
        </div>

        <div class="hht-name">
          ${item.nama_hht}
        </div>

        ${statusBadge(status)}

        ${button}

      </div>
    `;

  });

  grid.innerHTML = html;

}


/**
 * Open Modal
 */
function openBorrowModal(id) {

  const item = hhtList.find(function (row) {
    return String(row.id) === String(id);
  });

  if (!item) {
    Swal.fire("Error", "HHT tidak ditemukan", "error");
    return;
  }

  document.getElementById("hhtId").value = item.id;

  document.getElementById("hhtName").value =
    "HHT " + item.no_hht + " - " + item.nama_hht;

  document.getElementById("nama").value = "";

  document.getElementById("department").value = "";

  borrowModal.show();

}


/**
 * Submit Peminjaman
 */
async function submitBorrow(event) {

  event.preventDefault();

  const payload = {
    hhtId: document.getElementById("hhtId").value,
    nama: document.getElementById("nama").value.trim(),
    department: document.getElementById("department").value
  };

  if (!payload.nama) {
    Swal.fire("Validasi", "Nama peminjam wajib diisi", "warning");
    return;
  }

  if (!payload.department) {
    Swal.fire("Validasi", "Department wajib dipilih", "warning");
    return;
  }

  const confirm = await Swal.fire({
    title: "Konfirmasi Peminjaman",
    text: "Apakah data peminjaman sudah benar?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Pinjam",
    cancelButtonText: "Batal"
  });

  if (!confirm.isConfirmed) return;

  const res = await API.post("borrow", payload);

  if (!res.success) {
    Swal.fire("Gagal", res.message, "error");
    return;
  }

  borrowModal.hide();

  Swal.fire("Berhasil", res.message || "Peminjaman berhasil", "success");

  loadBorrowPage();

}
