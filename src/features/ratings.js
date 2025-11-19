export function initializeStarRating(containerId, initialRating = 0, onRatingChange) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Ensure the container is empty before initializing
    container.innerHTML = '';

    const html = `
        <div class="rating-stars-container">
            <div class="stars" aria-label="Rating">
                ${[...Array(10)].map((_, i) => `<i class="rating-star fas fa-star" data-value="${i + 1}"></i>`).join('')}
            </div>
            <input type="number" step="0.1" min="0" max="10" class="rating-input-manual w-16 bg-bg-primary border-border-primary rounded-md text-center ml-2">
            <input type="hidden" class="rating-input-hidden" name="rating-${containerId}">
        </div>
    `;
    container.innerHTML = html;

    const starsContainer = container.querySelector('.stars');
    const manualInput = container.querySelector('.rating-input-manual');
    const hiddenInput = container.querySelector('.rating-input-hidden');
    const stars = Array.from(container.querySelectorAll('.rating-star'));

    let currentRating = parseFloat(initialRating) || 0;

    function updateStars(rating) {
        const numericRating = parseFloat(rating);
        const displayRating = Math.round(numericRating * 2) / 2; // Round to nearest 0.5 for display

        stars.forEach(star => {
            const starValue = parseFloat(star.dataset.value);
            star.classList.remove('filled', 'half-filled');
            if (starValue <= displayRating) {
                star.classList.add('filled');
            } else if (starValue - 0.5 === displayRating) {
                star.classList.add('half-filled');
            }
        });

        manualInput.value = numericRating.toFixed(1);
        hiddenInput.value = numericRating;
    }

    function handleMouseMove(e) {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const hoverX = e.clientX - left;
        const percentage = hoverX / width;
        const isHalf = percentage <= 0.5;

        const hoverValue = parseFloat(e.currentTarget.dataset.value);
        const displayHoverValue = hoverValue - (isHalf ? 0.5 : 0);

        stars.forEach(s => {
            const sValue = parseFloat(s.dataset.value);
            s.classList.remove('filled', 'half-filled');
            if (sValue <= displayHoverValue) {
                s.classList.add('filled');
            } else if (sValue - 0.5 === displayHoverValue) {
                s.classList.add('half-filled');
            }
        });
    }

    function handleClick(e) {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - left;
        const percentage = clickX / width;
        const isHalf = percentage <= 0.5;

        const newValue = parseFloat(e.currentTarget.dataset.value) - (isHalf ? 0.5 : 0);
        currentRating = newValue;

        updateStars(currentRating);
        if (onRatingChange) {
            onRatingChange(currentRating);
        }
    }

    stars.forEach(star => {
        star.addEventListener('mousemove', handleMouseMove);
        star.addEventListener('click', handleClick);
    });

    manualInput.addEventListener('input', () => {
        let value = parseFloat(manualInput.value);
        if (isNaN(value)) value = 0;
        if (value < 0) value = 0;
        if (value > 10) value = 10;

        currentRating = value;
        updateStars(currentRating); // Visually update stars based on precise value rounded to .5
        if (onRatingChange) {
            onRatingChange(currentRating); // Pass the precise value
        }
    });

    // Also handle 'change' for when user finishes editing (e.g., blurs away)
    manualInput.addEventListener('change', () => {
         if (onRatingChange) {
            onRatingChange(currentRating);
        }
    });

    starsContainer.addEventListener('mouseleave', () => {
        updateStars(currentRating);
    });

    // Set initial state
    updateStars(currentRating);
}
