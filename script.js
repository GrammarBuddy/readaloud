// Await the DOMContentLoaded event to ensure all elements are available
document.addEventListener('DOMContentLoaded', () => {

    let passages = {}; // This will hold the fetched data
    let currentPassage = "";
    let wordCount = 0;
    let animationDuration = 0;
    let isPaused = false;

    // Get DOM elements
    const easyBtn = document.getElementById('easy-btn');
    const mediumBtn = document.getElementById('medium-btn');
    const hardBtn = document.getElementById('hard-btn');
    const readingText = document.getElementById('reading-text');
    const speedSlider = document.getElementById('speed-slider');
    const speedValueDisplay = document.getElementById('speed-value');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resumeBtn = document.getElementById('resume-btn');
    const resetBtn = document.getElementById('reset-btn');
    const progressBar = document.getElementById('progress-bar');
    const countdownElement = document.getElementById('countdown');

    let intervalId;

    // Fetch passages from passages.json
    fetch('passages.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            passages = data;
            // You can optionally pre-select a level here, e.g., selectLevel('medium');
        })
        .catch(error => {
            console.error('Error fetching passages:', error);
            readingText.textContent = 'Failed to load passages. Please check the passages.json file.';
        });

    // Event listeners
    easyBtn.addEventListener('click', () => {
        selectLevel('easy');
    });
    mediumBtn.addEventListener('click', () => {
        selectLevel('medium');
    });
    hardBtn.addEventListener('click', () => {
        selectLevel('hard');
    });

    startBtn.addEventListener('click', startCountdown);
    pauseBtn.addEventListener('click', pauseApp);
    resumeBtn.addEventListener('click', resumeApp);
    resetBtn.addEventListener('click', resetApp);
    
    speedSlider.addEventListener('input', (e) => {
        setSpeed(e.target.value);
    });

    // Function to select a passage based on difficulty
    function selectLevel(level) {
        if (!passages[level] || passages[level].length === 0) {
            readingText.textContent = `No passages found for ${level} difficulty.`;
            return;
        }
        
        const selectedPassage = passages[level][Math.floor(Math.random() * passages[level].length)];
        currentPassage = selectedPassage;
        wordCount = currentPassage.split(' ').length;
        readingText.textContent = currentPassage;
        readingText.style.display = 'inline-block';
        resetApp(); // Reset the UI to its initial state
        setSpeed(speedSlider.value); // Set the speed for the new passage
        
        // Highlight the selected difficulty button
        document.querySelectorAll('.button-group button').forEach(btn => {
            btn.classList.remove('active', 'bg-emerald-50', 'text-emerald-600', 'ring-4', 'ring-emerald-300');
            btn.classList.add('hover:bg-emerald-50', 'hover:text-emerald-600');
        });
        document.getElementById(`${level}-btn`).classList.add('active', 'bg-emerald-50', 'text-emerald-600');
        document.getElementById(`${level}-btn`).classList.remove('hover:bg-emerald-50', 'hover:text-emerald-600');
    }

    // Function to set the reading speed
    function setSpeed(speed) {
        speedValueDisplay.textContent = `${speed} WPM`;
        animationDuration = (wordCount / speed) * 60;
    }

    // Function to start the countdown
    function startCountdown() {
        if (!currentPassage) return;
        let count = 3;
        countdownElement.textContent = count;
        countdownElement.classList.remove('hidden');
        startBtn.classList.add('hidden');
        pauseBtn.classList.add('hidden');
        resumeBtn.classList.add('hidden');
        
        intervalId = setInterval(() => {
            count--;
            if (count > 0) {
                countdownElement.textContent = count;
            } else {
                clearInterval(intervalId);
                countdownElement.classList.add('hidden');
                startScroll();
            }
        }, 1000);
    }

    // Function to start the scrolling animation
    function startScroll() {
        // Immediately start the animation
        readingText.style.animationName = 'scroll';
        readingText.style.animationTimingFunction = 'linear';
        readingText.style.animationFillMode = 'forwards';
        readingText.style.animationPlayState = 'running';
        readingText.style.animationDuration = `${animationDuration}s`;

        // Start progress bar animation
        progressBar.style.transition = `width ${animationDuration}s linear`;
        progressBar.style.width = '100%';
        
        // Show pause and reset buttons, hide start button
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
        resumeBtn.style.display = 'none';
    }

    // Function to pause the app
    function pauseApp() {
        if (isPaused) return;
        isPaused = true;
        readingText.style.animationPlayState = 'paused';
        progressBar.style.transition = 'none';
        
        const currentWidth = progressBar.offsetWidth;
        const containerWidth = progressBar.parentElement.offsetWidth;
        const remainingDuration = animationDuration * (1 - currentWidth / containerWidth);

        progressBar.style.transition = `width ${remainingDuration}s linear`;
        
        pauseBtn.style.display = 'none';
        resumeBtn.style.display = 'block';
    }

    // Function to resume the app
    function resumeApp() {
        if (!isPaused) return;
        isPaused = false;
        readingText.style.animationPlayState = 'running';
        
        // Resume the progress bar animation
        const currentWidth = progressBar.offsetWidth;
        const containerWidth = progressBar.parentElement.offsetWidth;
        const remainingDuration = animationDuration * (1 - currentWidth / containerWidth);
        
        progressBar.style.transition = `width ${remainingDuration}s linear`;
        progressBar.style.width = '100%';

        pauseBtn.style.display = 'block';
        resumeBtn.style.display = 'none';
    }

    // Function to reset the app
    function resetApp() {
        clearInterval(intervalId);
        isPaused = false;
        countdownElement.classList.add('hidden');
        
        readingText.style.animation = 'none';
        readingText.style.transform = 'translateY(100%)';
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        
        // Hide pause/resume buttons and show start button
        startBtn.style.display = 'block';
        pauseBtn.style.display = 'none';
        resumeBtn.style.display = 'none';
    }
});
