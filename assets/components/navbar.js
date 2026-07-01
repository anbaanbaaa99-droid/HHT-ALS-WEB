/**
 * ==========================================
 * HHT ASSET MANAGEMENT
 * Component : Navbar
 * Version   : 1.0.0
 * Depends   : Bootstrap Icons, style.css
 * ==========================================
 */

(function () {

  const today = new Date();

  const tanggal = today.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const html = `
    <header class="topbar">

      <div>
        <strong>HHT Asset Management</strong>
        <div style="font-size:12px;color:#6b7280;">
          ${tanggal}
        </div>
      </div>

      <div class="d-flex align-items-center gap-3">

        <div style="font-size:14px;color:#6b7280;" id="navbarClock">
          --:--:--
        </div>

        <i class="bi bi-bell fs-5"></i>

        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-person-circle fs-4"></i>
          <span>Admin</span>
        </div>

      </div>

    </header>
  `;

  document.write(html);

})();


/**
 * Realtime Clock
 */
setInterval(function () {

  const clock = document.getElementById("navbarClock");

  if (!clock) return;

  const now = new Date();

  clock.innerHTML = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

}, 1000);
