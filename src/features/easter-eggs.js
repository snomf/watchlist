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

        console.log(`🟡 Smiling Friends Easter Egg: Allen will appear in ${(randomTime / 1000).toFixed(1)}s`);

        easterEggTimeout = setTimeout(() => {
            console.log('🟡 Allen has appeared!');
            allen.classList.remove('hidden');
            allen.style.transform = 'scale(1)';
        }, randomTime);

        allen.onclick = () => {
            console.log('🟡 Allen was clicked! Restarting interval...');
            allen.style.transform = 'scale(0)';
            setTimeout(() => {
                allen.classList.add('hidden');
                setupEasterEggs(); // Restart timer
            }, 500);
        };
    }

    // --- IT (Balloon) ---
    else if (currentTheme === 'it' && balloon) {
        // Random time between 15s and 23s
        const minTime = 15000;
        const maxTime = 23000;
        const randomTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

        console.log(`🎈 IT Easter Egg: Balloon will appear in ${(randomTime / 1000).toFixed(1)}s`);

        easterEggTimeout = setTimeout(() => {
            console.log('🎈 Balloon has appeared and is floating up!');
            balloon.classList.remove('hidden');
            balloon.style.transition = 'bottom 10s linear'; // Slow float up
            // Force reflow
            void balloon.offsetWidth;
            balloon.style.bottom = '110vh'; // Float off screen

            // Restart interval when balloon finishes floating off screen
            const handleTransitionEnd = (e) => {
                if (e.propertyName === 'bottom') {
                    console.log('🎈 Balloon floated off screen! Restarting interval...');
                    balloon.removeEventListener('transitionend', handleTransitionEnd);
                    balloon.classList.add('hidden');
                    balloon.style.bottom = '-150px'; // Reset position
                    setupEasterEggs(); // Restart timer
                }
            };
            balloon.addEventListener('transitionend', handleTransitionEnd);
        }, randomTime);

        balloon.onclick = () => {
            console.log('🎈 Balloon was clicked! Restarting interval...');
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
