/**
 * ==========================================
 * HHT ASSET MANAGEMENT
 * API CLIENT
 * ==========================================
 */

const API = {

  async get(action) {

    try {

      const url = `${CONFIG.API_URL}?action=${encodeURIComponent(action)}`;

      const response = await fetch(url);

      return await response.json();

    } catch (error) {

      console.error("GET API ERROR:", error);

      return {
        success: false,
        message: error.message,
        data: null
      };

    }

  },

  async post(action, data = {}) {

    try {

      const url = `${CONFIG.API_URL}?action=${encodeURIComponent(action)}`;

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data)
      });

      return await response.json();

    } catch (error) {

      console.error("POST API ERROR:", error);

      return {
        success: false,
        message: error.message,
        data: null
      };

    }

  }

};


/**
 * ==========================================
 * STATUS BADGE
 * ==========================================
 */

function statusBadge(status) {

  const value = String(status || "").toUpperCase();

  if (value === "AVAILABLE") {

    return `<span class="badge-soft badge-available">AVAILABLE</span>`;

  }

  if (value === "BORROWED") {

    return `<span class="badge-soft badge-borrowed">BORROWED</span>`;

  }

  return `<span class="badge-soft badge-borrowed">${value || "-"}</span>`;

}
