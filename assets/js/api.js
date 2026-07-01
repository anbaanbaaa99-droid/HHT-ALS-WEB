/**
 * ==========================================
 * HHT ASSET MANAGEMENT
 * File      : api.js
 * Version   : 2.0.0
 * Mode      : Single Page Application
 * Depends   : config.js
 * ==========================================
 */

const API = {

  /**
   * GET Request
   * Contoh:
   * API.get("dashboard")
   */
  async get(action) {

    try {

      const url = `${CONFIG.API_URL}?action=${encodeURIComponent(action)}`;

      const response = await fetch(url, {
        method: "GET"
      });

      const result = await response.json();

      return result;

    } catch (error) {

      console.error("API GET ERROR:", error);

      return {
        success: false,
        message: error.message || "Gagal mengambil data",
        data: null
      };

    }

  },


  /**
   * POST Request
   * Contoh:
   * API.post("borrow", { hhtId: 1, nama: "Budi" })
   */
  async post(action, data = {}) {

    try {

      const url = `${CONFIG.API_URL}?action=${encodeURIComponent(action)}`;

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data)
      });

      const result = await response.json();

      return result;

    } catch (error) {

      console.error("API POST ERROR:", error);

      return {
        success: false,
        message: error.message || "Gagal mengirim data",
        data: null
      };

    }

  }

};


/**
 * ==========================================
 * HELPER UI
 * ==========================================
 */


/**
 * Badge Status HHT
 */
function statusBadge(status) {

  const value = String(status || "").toUpperCase();

  if (value === CONFIG.STATUS.AVAILABLE) {

    return `
      <span class="badge-soft badge-available">
        <i class="bi bi-check-circle me-1"></i>
        AVAILABLE
      </span>
    `;

  }

  if (value === CONFIG.STATUS.BORROWED) {

    return `
      <span class="badge-soft badge-borrowed">
        <i class="bi bi-exclamation-circle me-1"></i>
        BORROWED
      </span>
    `;

  }

  if (value === CONFIG.STATUS.RETURNED) {

    return `
      <span class="badge-soft badge-returned">
        <i class="bi bi-arrow-return-left me-1"></i>
        RETURNED
      </span>
    `;

  }

  return `
    <span class="badge-soft badge-borrowed">
      ${value || "-"}
    </span>
  `;

}


/**
 * Loading HTML
 */
function loadingHTML(text = "Memuat data...") {

  return `
    <div class="loading-box">
      <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
      <span>${text}</span>
    </div>
  `;

}


/**
 * Empty State HTML
 */
function emptyHTML(text = "Data tidak ditemukan") {

  return `
    <div class="empty-state">
      <i class="bi bi-inbox fs-2 d-block mb-2"></i>
      ${text}
    </div>
  `;

}


/**
 * Format tanggal sederhana
 */
function formatDateTime(value) {

  if (!value) return "-";

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

}
