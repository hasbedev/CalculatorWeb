const APP_VERSION = "0.9.0";

/* LOAD NAVBAR */
fetch("components/navbar.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("navbar").innerHTML = html;
        initNavbar();
    });

function initNavbar() {

    /* ================= THEME TOGGLE ================= */
    const body = document.body;
    const toggle = document.getElementById("themeToggle");
    const icon = toggle.querySelector("i");

    function setTheme(theme) {
        body.classList.remove("dark", "light");
        body.classList.add(theme);
        localStorage.setItem("theme", theme);

        icon.className =
            theme === "dark"
                ? "fa-solid fa-moon"
                : "fa-solid fa-sun";
    }

    setTheme(localStorage.getItem("theme") || "dark");

    toggle.addEventListener("click", () => {
        setTheme(body.classList.contains("dark") ? "light" : "dark");
    });

    /* ================= AUTO HIDE NAVBAR ================= */
    const navbar = document.querySelector(".navbar");
    let lastScroll = 0;

    window.addEventListener("scroll", () => {
        const current = window.scrollY;
        if (current > lastScroll && current > 80) {
            navbar.classList.add("hide");
        } else {
            navbar.classList.remove("hide");
        }
        lastScroll = current;
    });

    /* ================= STATUS TAG ================= */
    const statusTag = document.getElementById("statusTag");
    const major = parseInt(APP_VERSION.split(".")[0]);

    if (major >= 1) {
        statusTag.textContent = "STABLE";
        statusTag.classList.add("stable");
    } else {
        statusTag.textContent = "BETA";
        statusTag.classList.add("beta");
    }

    /* ================= INFO MODAL ================= */
    const infoBtn = document.querySelector(".info-btn");
    const infoModal = document.getElementById("infoModal");
    const closeInfo = document.querySelector(".close-info");
    const infoVersion = document.getElementById("infoVersion");

    infoBtn.addEventListener("click", () => {
        infoModal.classList.add("show");
        infoVersion.textContent = APP_VERSION;
    });

    closeInfo.addEventListener("click", () => {
        infoModal.classList.remove("show");
    });

    infoModal.addEventListener("click", (e) => {
        if (e.target === infoModal) {
            infoModal.classList.remove("show");
        }
    });
}
