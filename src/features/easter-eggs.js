let allenTimeout = null;

export function setupAllenEasterEgg() {
    const allen = document.getElementById('allen-easter-egg');
    if (!allen) return;

    // Clear existing timeout
    if (allenTimeout) clearTimeout(allenTimeout);

    // Check theme
    const currentTheme = document.documentElement.getAttribute('data-theme');

    if (currentTheme !== 'smiling-friends') {
        allen.classList.add('hidden');
        allen.style.transform = 'scale(1)'; // Reset scale
        return;
    }

    // Random time between 37s and 90s
    const minTime = 37000;
    const maxTime = 90000;
    const randomTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

    allenTimeout = setTimeout(() => {
        allen.classList.remove('hidden');
        // Ensure he's visible and full size
        allen.style.transform = 'scale(1)';
    }, randomTime);

    // Click interaction
    allen.onclick = () => {
        allen.style.transform = 'scale(0)';
        setTimeout(() => {
            allen.classList.add('hidden');
            // Reset for next time? Or just once per session? 
            // Let's restart the timer for endless fun
            setupAllenEasterEgg();
        }, 500); // Wait for transition
    };
}
