/**
 * ==========================================
 * SIDEBAR COMPONENT
 * ==========================================
 */

(function () {

    const currentPage = location.pathname.split("/").pop();

    const menus = [

        {
            title: "Dashboard",
            icon: "bi-speedometer2",
            link: "index.html"
        },

        {
            title: "Peminjaman",
            icon: "bi-box-arrow-up",
            link: "pinjam.html"
        },

        {
            title: "Pengembalian",
            icon: "bi-box-arrow-in-down",
            link: "kembali.html"
        },

        {
            title: "Report",
            icon: "bi-file-earmark-text",
            link: "report.html"
        },

        {
            title: "Master HHT",
            icon: "bi-hdd-stack",
            link: "master-hht.html"
        }

    ];


    let html = "";

    html += `
    <aside class="sidebar">

        <div class="sidebar-logo">

            <i class="bi bi-broadcast-pin-fill"></i>

            <span>HHT SYSTEM</span>

        </div>
    `;


    menus.forEach(menu => {

        const active = currentPage === menu.link
            ? "active"
            : "";

        html += `

        <a href="${menu.link}" class="${active}">

            <i class="bi ${menu.icon}"></i>

            <span>${menu.title}</span>

        </a>

        `;

    });


    html += `

    <hr style="border-color:#374151">

    <a href="#">

        <i class="bi bi-gear"></i>

        <span>Setting</span>

    </a>

    <a href="#">

        <i class="bi bi-box-arrow-right"></i>

        <span>Logout</span>

    </a>

    </aside>

    `;


    document.write(html);

})();
