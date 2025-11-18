export async function initializeStarRating(containerId, initialRating = 0, onRatingChange) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Fetch and insert the HTML template
    const response = await fetch('/templates/rating-stars.html');
    const html = await response.text();
    container.innerHTML = html.replace(/{userId}/g, containerId);

    const starsContainer = container.querySelector('.stars');
    const manualInput = container.querySelector('.rating-input-manual');
    const hiddenInput = container.querySelector('.rating-input-hidden');
    const stars = Array.from(container.querySelectorAll('.rating-star'));

    let currentRating = initialRating;

    function updateStars(rating) {
        const numericRating = parseFloat(rating);
        stars.forEach(star => {
            const starValue = parseFloat(star.dataset.value);
            star.classList.remove('filled', 'half-filled');
            if (starValue <= numericRating) {
                star.classList.add('filled');
            } else if (starValue - 0.5 === numericRating) {
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
        const isHalf = percentage < 0.5;

        const hoverValue = parseFloat(e.currentTarget.dataset.value);

        stars.forEach(s => {
            const sValue = parseFloat(s.dataset.value);
            s.classList.remove('filled', 'half-filled');
            if (sValue < hoverValue) {
                s.classList.add('filled');
            } else if (sValue === hoverValue) {
                if (isHalf) {
                    s.classList.add('half-filled');
                } else {
                    s.classList.add('filled');
                }
            }
        });
    }

    function handleClick(e) {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - left;
        const percentage = (clickX / width);
        const isHalf = percentage < 0.5;

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

    manualInput.addEventListener('change', (e) => {
        let value = parseFloat(e.target.value);
        if (isNaN(value)) value = 0;
        if (value < 0) value = 0;
        if (value > 10) value = 10;

        // Round to nearest 0.5
        value = Math.round(value * 2) / 2;

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
