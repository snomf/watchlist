export function initializeStarRating(containerId, initialRating = 0, onRatingChange) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="star-rating-widget flex items-center gap-2">
            <div class="stars-wrapper flex">
                ${[...Array(10)].map((_, i) => `
                    <div class="star-container" data-value="${i + 1}">
                        <div class="star-half left" data-value="${i + 0.5}"></div>
                        <div class="star-half right" data-value="${i + 1}"></div>
                        <i class="star-icon fas fa-star text-gray-500"></i>
                    </div>
                `).join('')}
            </div>
            <input type="number" step="0.5" min="0" max="10" class="rating-input-manual w-16 bg-bg-primary border-border-primary rounded-md text-center">
            <input type="hidden" class="rating-input-hidden" name="rating-${containerId}">
        </div>
    `;

    const starsWrapper = container.querySelector('.stars-wrapper');
    const manualInput = container.querySelector('.rating-input-manual');
    const hiddenInput = container.querySelector('.rating-input-hidden');
    const starContainers = Array.from(container.querySelectorAll('.star-container'));

    let currentRating = parseFloat(initialRating) || 0;

    const updateView = (rating) => {
        const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5

        starContainers.forEach(star => {
            const starValue = parseFloat(star.dataset.value);
            const icon = star.querySelector('.star-icon');
            icon.classList.remove('fas', 'fa-star', 'fa-star-half-alt', 'far', 'fa-star'); // Reset classes

            if (roundedRating >= starValue) {
                icon.className = 'star-icon fas fa-star';
                icon.style.color = 'var(--star-color, #fbbf24)'; // Full star
            } else if (roundedRating >= starValue - 0.5) {
                icon.className = 'star-icon fas fa-star-half-alt';
                icon.style.color = 'var(--star-color, #fbbf24)'; // Half star
            } else {
                icon.className = 'star-icon far fa-star text-gray-500'; // Empty star
                icon.style.color = ''; // Reset
            }
        });
        manualInput.value = rating.toFixed(1);
        hiddenInput.value = rating;
    };

    const setRating = (newRating) => {
        currentRating = newRating;
        updateView(currentRating);
        if (onRatingChange) {
            onRatingChange(currentRating);
        }
    };

    starContainers.forEach(star => {
        ['.left', '.right'].forEach(selector => {
            const half = star.querySelector(selector);
            const ratingValue = parseFloat(half.dataset.value);

            half.addEventListener('mouseenter', () => updateView(ratingValue));
            half.addEventListener('click', () => setRating(ratingValue));
        });
    });

    starsWrapper.addEventListener('mouseleave', () => updateView(currentRating));

    manualInput.addEventListener('change', () => {
        let value = parseFloat(manualInput.value);
        if (isNaN(value)) value = 0;
        value = Math.max(0, Math.min(10, value)); // Clamp value
        setRating(value);
    });

    // Initial setup
    setRating(currentRating);
}
