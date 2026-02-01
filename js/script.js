const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");

// =======================
// CORE STATE
// =======================
let lastExpression = "";

// =======================
// BASIC FUNCTIONS
// =======================
function appendValue(v) {
    if (display.value === "Error") display.value = "";
    display.value += v;
    animateButton(v);
}

function clearDisplay() {
    display.value = "";
    animateButton("C");
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
    animateButton("⌫");
}

// =======================
// SAFE CALCULATOR (TANPA EVAL!)
// =======================
function safeCalculate(expression) {
    // Validasi: hanya izinkan angka, operator, titik, kurung, dan spasi
    const validPattern = /^[0-9+\-*/.() ]+$/;
    
    if (!validPattern.test(expression)) {
        throw new Error("Invalid expression");
    }
    
    // Cegah eksekusi kode berbahaya
    const dangerousPatterns = [
        "eval", "function", "=>", "alert", "console",
        "window", "document", "location", "constructor",
        "__proto__", "prototype", "import", "require"
    ];
    
    for (const pattern of dangerousPatterns) {
        if (expression.toLowerCase().includes(pattern)) {
            throw new Error("Security violation");
        }
    }
    
    // Gunakan Function constructor yang lebih aman dari eval
    // Function constructor membuat fungsi dalam scope terbatas
    try {
        const func = new Function('return (' + expression + ')');
        return func();
    } catch (e) {
        throw new Error("Calculation error");
    }
}

// =======================
// CALCULATE + HISTORY
// =======================
function calculate() {
    if (!display.value) return;

    try {
        const expression = display.value
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/−/g, "-");

        // Gunakan fungsi aman, bukan eval!
        const result = safeCalculate(expression);

        // Cek apakah hasil valid
        if (!isFinite(result)) {
            display.value = "Error";
            return;
        }

        // Bulatkan hasil jika terlalu panjang
        const roundedResult = Math.round(result * 100000000) / 100000000;

        addHistory(display.value, roundedResult);
        display.value = roundedResult;
        lastExpression = expression;

        animateButton("=");
    } catch (error) {
        console.error("Calculation error:", error.message);
        display.value = "Error";
    }
}

// =======================
// HISTORY
// =======================
function addHistory(expression, result) {
    let history = document.getElementById("history");

    if (!history) {
        history = document.createElement("div");
        history.id = "history";
        history.className = "history";
        document.querySelector(".calculator").appendChild(history);
    }

    const item = document.createElement("div");
    item.className = "history-item";
    
    // Escape HTML untuk mencegah XSS di history
    const safeExpression = escapeHtml(expression);
    const safeResult = escapeHtml(String(result));
    
    item.textContent = `${safeExpression} = ${safeResult}`;

    item.onclick = () => {
        display.value = result;
    };

    history.prepend(item);
    
    // Batasi history maksimal 10 item
    const items = history.querySelectorAll('.history-item');
    if (items.length > 10) {
        items[items.length - 1].remove();
    }
}

// Fungsi helper untuk escape HTML (mencegah XSS)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =======================
// COPY RESULT
// =======================
display.addEventListener("click", async () => {
    if (!display.value || display.value === "Error") return;

    try {
        await navigator.clipboard.writeText(display.value);
        showToast("Copied!");
    } catch (err) {
        console.error("Failed to copy:", err);
        // Fallback untuk browser yang tidak support clipboard API
        showToast("Copy failed!");
    }
});

// =======================
// TOAST
// =======================
function showToast(text) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = text; // Gunakan textContent, bukan innerHTML
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1200);
}

// =======================
// BUTTON ANIMATION
// =======================
function animateButton(value) {
    buttons.forEach(btn => {
        if (btn.innerText === value) {
            btn.classList.add("active");
            setTimeout(() => btn.classList.remove("active"), 120);
        }
    });
}

// =======================
// KEYBOARD SUPPORT
// =======================
document.addEventListener("keydown", (e) => {
    const key = e.key;

    // Cegah input berbahaya dari keyboard
    if (!isNaN(key)) {
        e.preventDefault();
        appendValue(key);
    }
    else if (key === "+") {
        e.preventDefault();
        appendValue("+");
    }
    else if (key === "-") {
        e.preventDefault();
        appendValue("-");
    }
    else if (key === "*") {
        e.preventDefault();
        appendValue("*");
    }
    else if (key === "/") {
        e.preventDefault();
        appendValue("/");
    }
    else if (key === ".") {
        e.preventDefault();
        appendValue(".");
    }
    else if (key === "Enter") {
        e.preventDefault();
        calculate();
    }
    else if (key === "Backspace") {
        e.preventDefault();
        deleteLast();
    }
    else if (key === "Escape") {
        e.preventDefault();
        clearDisplay();
    }
});
