/**
 * ==========================================
 * HHT ASSET MANAGEMENT
 * File      : app.js
 * Version   : 2.0.0
 * Mode      : Single Page Application
 * Depends   : config.js, api.js, Bootstrap, SweetAlert2
 * ==========================================
 */

let APP_STATE = {
  page: CONFIG.DEFAULT_PAGE,
  hhtList: [],
  departmentList: [],
  transactionList: [],
  selectedHHT: null,
  borrowModal: null,
  returnModal: null
};


/**
 * ==========================================
 * INIT APP
 * ==========================================
 */

window.addEventListener("load", function () {

  initDateTime();

  initMenu();

  initModal();

  initForm();

  loadPage(CONFIG.DEFAULT_PAGE);

});


/**
 * ==========================================
 * DATE & CLOCK
 * ==========================================
 */

function initDateTime() {

  const today = new Date();

  const todayText = document.getElementById("todayText");

  if (todayText) {
    todayText.innerHTML = today.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  updateClock();

  setInterval(updateClock, 1000);

}


function updateClock() {

  const clock = document.getElementById("clockText");

  if (!clock) return;

  const now = new Date();

  clock.innerHTML = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

}


/**
 * ==========================================
 * MENU
 * ==========================================
 */

function initMenu() {

  const menuLinks = document.querySelectorAll(".menu-link");

  menuLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

      event.preventDefault();

      const page = this.getAttribute("data-page");

      if (!page) return;

      setActiveMenu(page);

      loadPage(page);

    });

  });

}


function setActiveMenu(page) {

  const menuLinks = document.querySelectorAll(".menu-link");

  menuLinks.forEach(function (link) {

    link.classList.remove("active");

    if (link.getAttribute("data-page") === page) {
      link.classList.add("active");
    }

  });

}


/**
 * ==========================================
 * MODAL
 * ==========================================
 */

function initModal() {

  const borrowModalElement = document.getElementById("borrowModal");
  const returnModalElement = document.getElementById("returnModal");

  if (borrowModalElement) {
    APP_STATE.borrowModal = new bootstrap.Modal(borrowModalElement);
  }

  if (returnModalElement) {
    APP_STATE.returnModal = new bootstrap.Modal(returnModalElement);
  }

}


/**
 * ==========================================
 * FORM
 * ==========================================
 */

function initForm() {

  const borrowForm = document.getElementById("borrowForm");
  const returnForm = document.getElementById("returnForm");

  if (borrowForm) {
    borrowForm.addEventListener("submit", submitBorrow);
  }

  if (returnForm) {
    returnForm.addEventListener("submit", submitReturn);
  }

}


/**
 * ==========================================
 * ROUTER
 * ==========================================
 */

function loadPage(page) {

  APP_STATE.page = page;

  const app = document.getElementById("app");

  if (!app) return;

  switch (page) {

    case "dashboard":
      renderDashboardPage();
      break;

    case "borrow":
      renderBorrowPage();
      break;

    case "return":
      renderReturnPage();
      break;

    case "report":
      renderReportPage();
      break;

    case "master":
      renderMasterPage();
      break;

    case "setting":
      renderSettingPage();
      break;

    default:
      renderDashboardPage();

  }

}


/**
 * ==========================================
 * DASHBOARD PAGE
 * ==========================================
 */

async function renderDashboardPage() {

  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p>Monitoring status seluruh HHT secara real-time.</p>
      </div>

      <button class="btn btn-primary" onclick="renderDashboardPage()">
        <i class="bi bi-arrow-clockwise"></i>
        Refresh
      </button>
    </div>

    <div class="row g-3 mb-4">

      <div class="col-md-4">
        <div class="stat-card">
          <div>
            <span>Total HHT</span>
            <h2 id="totalHHT">0</h2>
          </div>
          <i class="bi bi-hdd-network"></i>
        </div>
      </div>

      <div class="col-md-4">
        <div class="stat-card success">
          <div>
            <span>Available</span>
            <h2 id="availableHHT">0</h2>
          </div>
          <i class="bi bi-check-circle"></i>
        </div>
      </div>

      <div class="col-md-4">
        <div class="stat-card danger">
          <div>
            <span>Borrowed</span>
            <h2 id="borrowedHHT">0</h2>
          </div>
          <i class="bi bi-exclamation-circle"></i>
        </div>
      </div>

    </div>

    <section class="panel">
      <div class="panel-header">
        <h5>Daftar HHT</h5>

        <input 
          type="text" 
          id="dashboardSearch" 
          class="form-control search-box" 
          placeholder="Cari nomor atau nama HHT..."
        >
      </div>

      <div id="dashboardGrid" class="hht-grid">
        ${loadingHTML()}
      </div>
    </section>
  `;

  await loadDashboardData();

  const search = document.getElementById("dashboardSearch");

  if (search) {
    search.addEventListener("input", function () {
      renderDashboardGrid();
    });
  }

}


async function loadDashboardData() {

  const dashboardRes = await API.get("dashboard");
  const hhtRes = await API.get("hht");

  if (!dashboardRes.success) {
    Swal.fire("Error", dashboardRes.message, "error");
    return;
  }

  if (!hhtRes.success) {
    Swal.fire("Error", hhtRes.message, "error");
    return;
  }

  APP_STATE.hhtList = hhtRes.data || [];

  document.getElementById("totalHHT").innerHTML = dashboardRes.data.total || 0;
  document.getElementById("availableHHT").innerHTML = dashboardRes.data.available || 0;
  document.getElementById("borrowedHHT").innerHTML = dashboardRes.data.borrowed || 0;

  renderDashboardGrid();

}


function renderDashboardGrid() {

  const grid = document.getElementById("dashboardGrid");

  if (!grid) return;

  const search = document.getElementById("dashboardSearch");

  const keyword = search ? search.value.toLowerCase() : "";

  const filtered = APP_STATE.hhtList.filter(function (item) {

    return (
      String(item.no_hht).toLowerCase().includes(keyword) ||
      String(item.nama_hht).toLowerCase().includes(keyword) ||
      String(item.status).toLowerCase().includes(keyword)
    );

  });

  if (filtered.length === 0) {
    grid.innerHTML = emptyHTML("Data HHT tidak ditemukan");
    return;
  }

  let html = "";

  filtered.forEach(function (item) {

    const status = String(item.status || "").toUpperCase();

    const cardClass = status === CONFIG.STATUS.AVAILABLE
      ? "available"
      : "borrowed";

    html += `
      <div class="hht-card ${cardClass}">

        <div class="hht-no">
          HHT ${item.no_hht}
        </div>

        <div class="hht-name">
          ${item.nama_hht}
        </div>

        ${statusBadge(status)}

      </div>
    `;

  });

  grid.innerHTML = html;

}


/**
 * ==========================================
 * BORROW PAGE
 * ==========================================
 */

async function renderBorrowPage() {

  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Peminjaman HHT</h1>
        <p>Pilih HHT yang tersedia, lalu isi data peminjam.</p>
      </div>

      <button class="btn btn-primary" onclick="renderBorrowPage()">
        <i class="bi bi-arrow-clockwise"></i>
        Refresh
      </button>
    </div>

    <section class="panel">
      <div class="panel-header">
        <h5>Pilih HHT</h5>

        <input 
          type="text" 
          id="borrowSearch" 
          class="form-control search-box" 
          placeholder="Cari HHT..."
        >
      </div>

      <div id="borrowGrid" class="hht-grid">
        ${loadingHTML()}
      </div>
    </section>
  `;

  await loadBorrowData();

  const search = document.getElementById("borrowSearch");

  if (search) {
    search.addEventListener("input", renderBorrowGrid);
  }

}


async function loadBorrowData() {

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

  APP_STATE.hhtList = hhtRes.data || [];
  APP_STATE.departmentList = deptRes.data || [];

  renderDepartmentSelect();

  renderBorrowGrid();

}


function renderDepartmentSelect() {

  const select = document.getElementById("borrowDepartment");

  if (!select) return;

  let html = `<option value="">Pilih Department</option>`;

  APP_STATE.departmentList.forEach(function (dept) {

    html += `
      <option value="${dept.nama}">
        ${dept.nama}
      </option>
    `;

  });

  select.innerHTML = html;

}


function renderBorrowGrid() {

  const grid = document.getElementById("borrowGrid");

  if (!grid) return;

  const search = document.getElementById("borrowSearch");

  const keyword = search ? search.value.toLowerCase() : "";

  const filtered = APP_STATE.hhtList.filter(function (item) {

    return (
      String(item.no_hht).toLowerCase().includes(keyword) ||
      String(item.nama_hht).toLowerCase().includes(keyword) ||
      String(item.status).toLowerCase().includes(keyword)
    );

  });

  if (filtered.length === 0) {
    grid.innerHTML = emptyHTML("Data HHT tidak ditemukan");
    return;
  }

  let html = "";

  filtered.forEach(function (item) {

    const status = String(item.status || "").toUpperCase();

    const cardClass = status === CONFIG.STATUS.AVAILABLE
      ? "available"
      : "borrowed";

    const button = status === CONFIG.STATUS.AVAILABLE
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


function openBorrowModal(id) {

  const item = APP_STATE.hhtList.find(function (row) {
    return String(row.id) === String(id);
  });

  if (!item) {
    Swal.fire("Error", "HHT tidak ditemukan", "error");
    return;
  }

  document.getElementById("borrowHhtId").value = item.id;

  document.getElementById("borrowHhtName").value =
    "HHT " + item.no_hht + " - " + item.nama_hht;

  document.getElementById("borrowName").value = "";

  document.getElementById("borrowDepartment").value = "";

  APP_STATE.borrowModal.show();

}


async function submitBorrow(event) {

  event.preventDefault();

  const payload = {
    hhtId: document.getElementById("borrowHhtId").value,
    nama: document.getElementById("borrowName").value.trim(),
    department: document.getElementById("borrowDepartment").value
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

  APP_STATE.borrowModal.hide();

  await Swal.fire("Berhasil", res.message || "Peminjaman berhasil", "success");

  renderBorrowPage();

}


/**
 * ==========================================
 * RETURN PAGE
 * ==========================================
 */

async function renderReturnPage() {

  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Pengembalian HHT</h1>
        <p>Pilih HHT yang sedang dipinjam untuk dikembalikan.</p>
      </div>

      <button class="btn btn-primary" onclick="renderReturnPage()">
        <i class="bi bi-arrow-clockwise"></i>
        Refresh
      </button>
    </div>

    <section class="panel">
      <div class="panel-header">
        <h5>HHT Sedang Dipinjam</h5>

        <input 
          type="text" 
          id="returnSearch" 
          class="form-control search-box" 
          placeholder="Cari HHT..."
        >
      </div>

      <div id="returnGrid" class="hht-grid">
        ${loadingHTML()}
      </div>
    </section>
  `;

  await loadReturnData();

  const search = document.getElementById("returnSearch");

  if (search) {
    search.addEventListener("input", renderReturnGrid);
  }

}


async function loadReturnData() {

  const hhtRes = await API.get("hht");

  if (!hhtRes.success) {
    Swal.fire("Error", hhtRes.message, "error");
    return;
  }

  APP_STATE.hhtList = hhtRes.data || [];

  renderReturnGrid();

}


function renderReturnGrid() {

  const grid = document.getElementById("returnGrid");

  if (!grid) return;

  const search = document.getElementById("returnSearch");

  const keyword = search ? search.value.toLowerCase() : "";

  const borrowedOnly = APP_STATE.hhtList.filter(function (item) {
    return String(item.status || "").toUpperCase() === CONFIG.STATUS.BORROWED;
  });

  const filtered = borrowedOnly.filter(function (item) {

    return (
      String(item.no_hht).toLowerCase().includes(keyword) ||
      String(item.nama_hht).toLowerCase().includes(keyword)
    );

  });

  if (filtered.length === 0) {
    grid.innerHTML = emptyHTML("Tidak ada HHT yang sedang dipinjam");
    return;
  }

  let html = "";

  filtered.forEach(function (item) {

    html += `
      <div class="hht-card borrowed">

        <div class="hht-no">
          HHT ${item.no_hht}
        </div>

        <div class="hht-name">
          ${item.nama_hht}
        </div>

        ${statusBadge(item.status)}

        <button 
          class="btn btn-success w-100 mt-3" 
          onclick="openReturnModal('${item.id}')"
        >
          <i class="bi bi-box-arrow-in-down"></i>
          Kembalikan
        </button>

      </div>
    `;

  });

  grid.innerHTML = html;

}


function openReturnModal(id) {

  const item = APP_STATE.hhtList.find(function (row) {
    return String(row.id) === String(id);
  });

  if (!item) {
    Swal.fire("Error", "HHT tidak ditemukan", "error");
    return;
  }

  document.getElementById("returnHhtId").value = item.id;

  document.getElementById("returnInfo").innerHTML = `
    <strong>HHT ${item.no_hht}</strong><br>
    ${item.nama_hht}
  `;

  document.getElementById("returnNote").value = "";

  APP_STATE.returnModal.show();

}


async function submitReturn(event) {

  event.preventDefault();

  const payload = {
    hhtId: document.getElementById("returnHhtId").value,
    note: document.getElementById("returnNote").value.trim()
  };

  const confirm = await Swal.fire({
    title: "Konfirmasi Pengembalian",
    text: "Apakah HHT ini sudah benar-benar dikembalikan?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Kembalikan",
    cancelButtonText: "Batal"
  });

  if (!confirm.isConfirmed) return;

  const res = await API.post("return", payload);

  if (!res.success) {
    Swal.fire("Gagal", res.message, "error");
    return;
  }

  APP_STATE.returnModal.hide();

  await Swal.fire("Berhasil", res.message || "Pengembalian berhasil", "success");

  renderReturnPage();

}


/**
 * ==========================================
 * REPORT PAGE
 * ==========================================
 */

async function renderReportPage() {

  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Report</h1>
        <p>Laporan transaksi peminjaman dan pengembalian HHT.</p>
      </div>

      <button class="btn btn-primary" onclick="renderReportPage()">
        <i class="bi bi-arrow-clockwise"></i>
        Refresh
      </button>
    </div>

    <section class="panel">

      <div class="panel-header">
        <h5>Riwayat Transaksi</h5>

        <input 
          type="text" 
          id="reportSearch" 
          class="form-control search-box" 
          placeholder="Cari transaksi..."
        >
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>HHT</th>
              <th>Peminjam</th>
              <th>Department</th>
              <th>Pinjam</th>
              <th>Kembali</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody id="reportBody">
            <tr>
              <td colspan="7">
                ${loadingHTML()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </section>
  `;

  await loadReportData();

  const search = document.getElementById("reportSearch");

  if (search) {
    search.addEventListener("input", renderReportTable);
  }

}


async function loadReportData() {

  const res = await API.get("transaction");

  if (!res.success) {

    APP_STATE.transactionList = [];

    document.getElementById("reportBody").innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted py-4">
          Endpoint transaksi belum aktif di backend.
        </td>
      </tr>
    `;

    return;

  }

  APP_STATE.transactionList = res.data || [];

  renderReportTable();

}


function renderReportTable() {

  const tbody = document.getElementById("reportBody");

  if (!tbody) return;

  const search = document.getElementById("reportSearch");

  const keyword = search ? search.value.toLowerCase() : "";

  const filtered = APP_STATE.transactionList.filter(function (item) {
    return JSON.stringify(item).toLowerCase().includes(keyword);
  });

  if (filtered.length === 0) {

    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted py-4">
          Data transaksi tidak ditemukan.
        </td>
      </tr>
    `;

    return;

  }

  let html = "";

  filtered.forEach(function (item) {

    html += `
      <tr>
        <td>${item.transaction_id || item.TRANSACTION_ID || "-"}</td>
        <td>${item.no_hht || item.NO_HHT || item.hht_id || item.HHT_ID || "-"}</td>
        <td>${item.peminjam || item.PEMINJAM || "-"}</td>
        <td>${item.department || item.DEPARTMENT || "-"}</td>
        <td>${formatDateTime(item.pinjam_at || item.PINJAM_AT)}</td>
        <td>${formatDateTime(item.kembali_at || item.KEMBALI_AT)}</td>
        <td>${statusBadge(item.status || item.STATUS)}</td>
      </tr>
    `;

  });

  tbody.innerHTML = html;

}


/**
 * ==========================================
 * MASTER PAGE
 * ==========================================
 */

async function renderMasterPage() {

  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Master HHT</h1>
        <p>Daftar master perangkat HHT yang terdaftar di sistem.</p>
      </div>

      <button class="btn btn-primary" onclick="renderMasterPage()">
        <i class="bi bi-arrow-clockwise"></i>
        Refresh
      </button>
    </div>

    <section class="panel">

      <div class="panel-header">
        <h5>Master Data HHT</h5>

        <input 
          type="text" 
          id="masterSearch" 
          class="form-control search-box" 
          placeholder="Cari HHT..."
        >
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>No HHT</th>
              <th>Nama HHT</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody id="masterBody">
            <tr>
              <td colspan="4">
                ${loadingHTML()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </section>
  `;

  await loadMasterData();

  const search = document.getElementById("masterSearch");

  if (search) {
    search.addEventListener("input", renderMasterTable);
  }

}


async function loadMasterData() {

  const res = await API.get("hht");

  if (!res.success) {
    Swal.fire("Error", res.message, "error");
    return;
  }

  APP_STATE.hhtList = res.data || [];

  renderMasterTable();

}


function renderMasterTable() {

  const tbody = document.getElementById("masterBody");

  if (!tbody) return;

  const search = document.getElementById("masterSearch");

  const keyword = search ? search.value.toLowerCase() : "";

  const filtered = APP_STATE.hhtList.filter(function (item) {

    return (
      String(item.id).toLowerCase().includes(keyword) ||
      String(item.no_hht).toLowerCase().includes(keyword) ||
      String(item.nama_hht).toLowerCase().includes(keyword) ||
      String(item.status).toLowerCase().includes(keyword)
    );

  });

  if (filtered.length === 0) {

    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted py-4">
          Data HHT tidak ditemukan.
        </td>
      </tr>
    `;

    return;

  }

  let html = "";

  filtered.forEach(function (item) {

    html += `
      <tr>
        <td>${item.id}</td>
        <td>HHT ${item.no_hht}</td>
        <td>${item.nama_hht}</td>
        <td>${statusBadge(item.status)}</td>
      </tr>
    `;

  });

  tbody.innerHTML = html;

}


/**
 * ==========================================
 * SETTING PAGE
 * ==========================================
 */

function renderSettingPage() {

  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Setting</h1>
        <p>Informasi konfigurasi aplikasi.</p>
      </div>
    </div>

    <section class="panel">

      <h5 class="mb-3">Application Info</h5>

      <table class="table">
        <tr>
          <td width="180">App Name</td>
          <td>${CONFIG.APP_NAME}</td>
        </tr>
        <tr>
          <td>Version</td>
          <td>${CONFIG.VERSION}</td>
        </tr>
        <tr>
          <td>API URL</td>
          <td>
            <code>${CONFIG.API_URL}</code>
          </td>
        </tr>
      </table>

      <div class="alert alert-warning mt-3">
        Jika API URL masih berisi 
        <strong>PASTE_URL_APPS_SCRIPT_DISINI</strong>, 
        silakan ubah file <code>assets/js/config.js</code>.
      </div>

    </section>
  `;

}
