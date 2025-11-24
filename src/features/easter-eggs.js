let easterEggTimeout = null;

export function setupEasterEggs() {
    const allen = document.getElementById('allen-easter-egg');
    const balloon = document.getElementById('balloon-easter-egg');

    // Clear existing timeout
    if (easterEggTimeout) clearTimeout(easterEggTimeout);

    // Reset elements
    if (allen) {
        allen.classList.add('hidden');
        allen.style.transform = 'scale(1)';
    }
    if (balloon) {
        balloon.classList.add('hidden');
        balloon.style.bottom = '-150px'; // Reset position
        balloon.style.transition = 'none'; // Disable transition for reset
    }

    // Check theme
    const currentTheme = document.documentElement.getAttribute('data-theme');

    // --- Smiling Friends (Allen) ---
    if (currentTheme === 'smiling-friends' && allen) {
        // Random time between 37s and 90s
        const minTime = 37000;
        const maxTime = 90000;
        const randomTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

        easterEggTimeout = setTimeout(() => {
            allen.classList.remove('hidden');
            allen.style.transform = 'scale(1)';
        }, randomTime);

        allen.onclick = () => {
            allen.style.transform = 'scale(0)';
            setTimeout(() => {
                allen.classList.add('hidden');
                setupEasterEggs(); // Restart timer
            }, 500);
        };
    }

    // --- IT (Balloon) ---
    else if (currentTheme === 'it' && balloon) {
        // Random time between 10s and 45s (faster for testing/scare factor)
        const minTime = 10000;
        const maxTime = 45000;
        const randomTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

        easterEggTimeout = setTimeout(() => {
            balloon.classList.remove('hidden');
            balloon.style.transition = 'bottom 10s linear'; // Slow float up
            // Force reflow
            void balloon.offsetWidth;
            balloon.style.bottom = '110vh'; // Float off screen
        }, randomTime);

        balloon.onclick = () => {
            // Pop effect? Just disappear for now as requested
            balloon.style.transition = 'transform 0.2s ease-out';
            balloon.style.transform = 'translateX(-50%) scale(0)';

            setTimeout(() => {
                balloon.classList.add('hidden');
                balloon.style.transform = 'translateX(-50%) scale(1)'; // Reset scale
                balloon.style.bottom = '-150px'; // Reset position
                setupEasterEggs(); // Restart timer
            }, 200);
        };
    }
}
