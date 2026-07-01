/**
 * ==========================================
 * HHT ASSET MANAGEMENT
 * Page      : Dashboard
 * Version   : 1.0.0
 * Depends   : config.js, api.js
 * ==========================================
 */

let allHHT = [];


/**
 * Page Load
 */
window.addEventListener("load", function () {

  refreshDashboard();

  const search = document.getElementById("searchInput");

  if (search) {
    search.addEventListener("input", renderHHT);
  }

});


/**
 * Refresh Semua Data
 */
async function refreshDashboard() {

  await Promise.all([
    loadDashboard(),
    loadHHT()
  ]);

}


/**
 * Load Statistik Dashboard
 */
async function loadDashboard() {

  const res = await API.get("dashboard");

  if (!res.success) {
    alert(res.message);
    return;
  }

  document.getElementById("totalHHT").innerHTML = res.data.total || 0;
  document.getElementById("availableHHT").innerHTML = res.data.available || 0;
  document.getElementById("borrowedHHT").innerHTML = res.data.borrowed || 0;

}


/**
 * Load Daftar HHT
 */
async function loadHHT() {

  const res = await API.get("hht");

  if (!res.success) {
    alert(res.message);
    return;
  }

  allHHT = res.data || [];

  renderHHT();

}


/**
 * Render Card HHT
 */
function renderHHT() {

  const grid = document.getElementById("hhtGrid");

  const search = document.getElementById("searchInput");

  const keyword = search ? search.value.toLowerCase() : "";

  const filtered = allHHT.filter(function (item) {

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
