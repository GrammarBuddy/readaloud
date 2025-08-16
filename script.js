let passages = {};
let selectedDifficulty = null;
let scrollInterval = null;
let countdownTimer = null;
let currentPosition = 0;

async function loadPassages() {
    const response = await fetch("passages.json");
    passages = await response.json();
}

function setDifficulty(level) {
    selectedDifficulty = level;
    document.getElementById("instruction").textContent =
        level.charAt(0).toUpperCase() + level.slice(1) + " selected!";
}

function startReading() {
    if (!selectedDifficulty) {
        alert("Please select a difficulty first!");
        return;
    }

    // Clear old passage
    const passageDiv = document.getElementById("passage");
    passageDiv.textContent = "";

    let countdown = 3;
    const countdownDiv = document.getElementById("countdown");
    countdownDiv.textContent = countdown;

    countdownTimer = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownDiv.textContent = countdown;
        } else {
            clearInterval(countdownTimer);
            countdownDiv.textContent = "";
            showPassage();
            startScrolling();
        }
    }, 1000);
}

function showPassage() {
    const passageDiv = document.getElementById("passage");
    passageDiv.textContent = passages[selectedDifficulty];
    const container = document.getElementById("passageContainer");

    // Start passage at bottom of container
    currentPosition = container.clientHeight;
    passageDiv.style.top = currentPosition + "px";
}

function startScrolling() {
    const passageDiv = document.getElementById("passage");
    const container = document.getElementById("passageContainer");
    const speed = parseInt(document.getElementById("speedSlider").value, 10);

    if (scrollInterval) clearInterval(scrollInterval);

    scrollInterval = setInterval(() => {
        currentPosition -= 1; // move upward
        passageDiv.style.top = currentPosition + "px";

        // stop when completely scrolled past top
        if (currentPosition + passageDiv.clientHeight < 0) {
            clearInterval(scrollInterval);
        }
    }, 200 / speed); // speed control
}

function stopReading() {
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadPassages();

    // Hook buttons
    document.getElementById("startButton").addEventListener("click", startReading);
    document.getElementById("stopButton").addEventListener("click", stopReading);
});
