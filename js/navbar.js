const APP_VERSION = "0.9.3"; // Update version karena ada perbaikan keamanan

/* LOAD NAVBAR */
fetch("components/navbar.html")
    .then(res => {
        if (!res.ok) throw new Error('Navbar not found');
        return res.text();
    })
    .then(html => {
        document.getElementById("navbar").innerHTML = html;
        initNavbar();
    })
    .catch(err => {
        console.error("Failed to load navbar:", err);
        // Fallback jika navbar gagal dimuat
        document.getElementById("navbar").innerHTML = `
            <nav class="navbar">
                <div class="nav-left">
                    <i class="fa-solid fa-calculator logo-icon"></i>
                    <span class="logo">CALCULATOR</span>
                    <span class="tag beta">BETA</span>
                </div>
                <div class="nav-right">
                    <button class="info-btn" title="App Info">
                        <i class="fa-solid fa-circle-info"></i>
                    </button>
                    <button id="themeToggle" aria-label="Toggle theme">
                        <i class="fa-solid fa-moon"></i>
                    </button>
                </div>
            </nav>
        `;
        // Coba init navbar meski dari fallback
        initNavbar();
    });

function initNavbar() {

    /* ================= THEME TOGGLE ================= */
    const body = document.body;
    const toggle = document.getElementById("themeToggle");
    
    if (!toggle) {
        console.error("Theme toggle button not found");
        return;
    }
    
    const icon = toggle.querySelector("i");

    function setTheme(theme) {
        body.classList.remove("dark", "light");
        body.classList.add(theme);
        localStorage.setItem("theme", theme);

        if (icon) {
            icon.className =
                theme === "dark"
                    ? "fa-solid fa-moon"
                    : "fa-solid fa-sun";
        }
    }

    setTheme(localStorage.getItem("theme") || "dark");

    toggle.addEventListener("click", () => {
        // Tambah class switching untuk animasi
        toggle.classList.add("switching");
        setTimeout(() => toggle.classList.remove("switching"), 500);
        
        setTheme(body.classList.contains("dark") ? "light" : "dark");
    });

    /* ================= AUTO HIDE NAVBAR ================= */
    const navbar = document.querySelector(".navbar");
    
    if (navbar) {
        let lastScroll = 0;

        window.addEventListener("scroll", () => {
            const current = window.scrollY;
            
            // Tambah class scrolled jika scroll > 50px
            if (current > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
            
            if (current > lastScroll && current > 80) {
                navbar.classList.add("hide");
            } else {
                navbar.classList.remove("hide");
            }
            lastScroll = current;
        });
    }

    /* ================= STATUS TAG ================= */
    const statusTag = document.getElementById("statusTag");
    
    if (statusTag) {
        const major = parseInt(APP_VERSION.split(".")[0]);

        if (major >= 1) {
            statusTag.textContent = "STABLE";
            statusTag.classList.add("stable");
        } else {
            statusTag.textContent = "BETA";
            statusTag.classList.add("beta");
        }
    }

    /* ================= INFO MODAL ================= */
    const infoBtn = document.querySelector(".info-btn");
    const infoModal = document.getElementById("infoModal");
    const closeInfo = document.querySelector(".close-info");
    const infoVersion = document.getElementById("infoVersion");

    if (infoBtn && infoModal && closeInfo) {
        infoBtn.addEventListener("click", () => {
            infoModal.classList.add("show");
            if (infoVersion) {
                infoVersion.textContent = APP_VERSION;
            }
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
}
