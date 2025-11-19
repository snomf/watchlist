export function initializeStarRating(containerId, initialRating = 0, onRatingChange) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const html = `
        <div class="rating-stars-container flex items-center" data-user-id="${containerId}">
            <div class="stars" aria-label="Rating">
                <i class="rating-star fas fa-star" data-value="1"></i>
                <i class="rating-star fas fa-star" data-value="2"></i>
                <i class="rating-star fas fa-star" data-value="3"></i>
                <i class="rating-star fas fa-star" data-value="4"></i>
                <i class="rating-star fas fa-star" data-value="5"></i>
                <i class="rating-star fas fa-star" data-value="6"></i>
                <i class="rating-star fas fa-star" data-value="7"></i>
                <i class="rating-star fas fa-star" data-value="8"></i>
                <i class="rating-star fas fa-star" data-value="9"></i>
                <i class="rating-star fas fa-star" data-value="10"></i>
            </div>
            <input type="number" step="0.1" min="0" max="10" class="rating-input-manual w-16 bg-bg-primary border-border-primary rounded-md text-center ml-2">
            <input type="hidden" class="rating-input-hidden" name="rating-${containerId}" value="0">
        </div>
    `;
    container.innerHTML = html;

    const starsContainer = container.querySelector('.stars');
    const manualInput = container.querySelector('.rating-input-manual');
    const hiddenInput = container.querySelector('.rating-input-hidden');
    const stars = Array.from(container.querySelectorAll('.rating-star'));

    let currentRating = initialRating;

    function updateStars(rating) {
        const numericRating = parseFloat(rating);
        // Round to nearest 0.5 for display
        const displayRating = Math.round(numericRating * 2) / 2;

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
        const clickX = e.clientX - left;
        const percentage = (clickX / width);
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
        const percentage = (clickX / width);
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

    manualInput.addEventListener('input', (e) => {
        let value = parseFloat(e.target.value);
        if (isNaN(value)) value = 0;
        if (value < 0) value = 0;
        if (value > 10) value = 10;

        currentRating = value;
        updateStars(currentRating);
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
