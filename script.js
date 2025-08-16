let passages = {};
let currentDifficulty = null;
let scrollInterval;
let countdownTimer;
let scrollDuration = 20; // default duration in seconds

async function loadPassages() {
    try {
        const response = await fetch('passages.json');
        passages = await response.json();
    } catch (error) {
        console.error('Error loading passages:', error);
    }
}

function setDifficulty(level) {
    currentDifficulty = level;
    const readingText = document.getElementById('readingText');

    if (level) {
        readingText.textContent = `${level.charAt(0).toUpperCase() + level.slice(1)} selected`;
        readingText.classList.remove('placeholder');
    }
}

function startReading() {
    if (!currentDifficulty) {
        alert('Please select a difficulty first!');
        return;
    }

    const countdownEl = document.getElementById('countdown');
    let timeLeft = 3;
    countdownEl.textContent = timeLeft;
    countdownEl.style.display = 'block';

    clearInterval(countdownTimer);
    countdownTimer = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            countdownEl.textContent = timeLeft;
        } else {
            clearInterval(countdownTimer);
            countdownEl.style.display = 'none';
            showAndScrollPassage();
        }
    }, 1000);
}

function showAndScrollPassage() {
    const container = document.querySelector('.scroll-container');
    const text = document.getElementById('readingText');

    // Get the actual passage
    const passage = passages[currentDifficulty];
    text.textContent = passage;

    // Reset any previous scroll
    clearInterval(scrollInterval);
    text.style.transition = 'none';
    text.style.transform = 'translateY(0)';

    // Force reflow
    void text.offsetHeight;

    // Get dimensions
    const containerHeight = container.offsetHeight;
    const textHeight = text.scrollHeight;

    // Start from bottom
    const startY = containerHeight;
    const endY = -textHeight;

    text.style.transform = `translateY(${startY}px)`;

    // Get scroll speed from slider (seconds)
    const speedSlider = document.getElementById('speedSlider');
    scrollDuration = speedSlider ? parseInt(speedSlider.value, 10) : 20;

    // Animate
    setTimeout(() => {
        text.style.transition = `transform ${scrollDuration}s linear`;
        text.style.transform = `translateY(${endY}px)`;
    }, 100);
}

function stopReading() {
    clearInterval(scrollInterval);
    clearInterval(countdownTimer);

    const readingText = document.getElementById('readingText');
    readingText.style.transition = 'none';
    readingText.style.transform = 'translateY(0)';

    const countdownEl = document.getElementById('countdown');
    countdownEl.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', loadPassages);
