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
// CALCULATE + HISTORY
// =======================
function calculate() {
    if (!display.value) return;

    try {
        const expression = display.value
            .replace(/×/g, "*")
            .replace(/÷/g, "/");

        const result = eval(expression);

        addHistory(display.value, result);
        display.value = result;
        lastExpression = expression;

        animateButton("=");
    } catch {
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
    item.innerText = `${expression} = ${result}`;

    item.onclick = () => {
        display.value = result;
    };

    history.prepend(item);
}

// =======================
// COPY RESULT
// =======================
display.addEventListener("click", async () => {
    if (!display.value || display.value === "Error") return;

    try {
        await navigator.clipboard.writeText(display.value);
        showToast("Copied!");
    } catch {}
});

// =======================
// TOAST
// =======================
function showToast(text) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = text;

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

    if (!isNaN(key)) appendValue(key);
    else if (key === "+") appendValue("+");
    else if (key === "-") appendValue("-");
    else if (key === "*") appendValue("*");
    else if (key === "/") appendValue("/");
    else if (key === ".") appendValue(".");
    else if (key === "Enter") calculate();
    else if (key === "Backspace") deleteLast();
    else if (key === "Escape") clearDisplay();
});
