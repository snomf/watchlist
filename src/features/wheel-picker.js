
const COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
    '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71'
];

export class WheelPicker {
    constructor(mediaItems, openModalCallback) {
        this.allMedia = mediaItems || [];
        this.filteredItems = [];
        this.openModalCallback = openModalCallback;

        this.canvas = document.getElementById('wheel-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

        this.isSpinning = false;
        this.currentAngle = 0;
        this.spinVelocity = 0;
        this.spinFriction = 0.985; // Deceleration
        this.segments = [];

        // UI Elements
        this.modal = document.getElementById('wheel-modal');
        this.spinBtn = document.getElementById('wheel-spin-btn');
        this.closeBtn = document.getElementById('close-wheel-modal-btn');
        this.shuffleBtn = document.getElementById('wheel-shuffle-btn');
        this.itemCountLabel = document.getElementById('wheel-item-count');

        // Filters
        this.filterMovie = document.getElementById('wheel-filter-movie');
        this.filterTV = document.getElementById('wheel-filter-tv');
        this.filterRuntime = document.getElementById('wheel-filter-runtime');
        this.filterRuntimeValue = document.getElementById('wheel-runtime-value');
        this.ratingFiltersContainer = document.getElementById('wheel-rating-filters');
        this.sourceSelect = document.getElementById('wheel-source-select');

        // Result Overlay
        this.resultOverlay = document.getElementById('wheel-result-overlay');
        this.winnerCard = document.getElementById('wheel-winner-card');
        this.winnerImage = document.getElementById('wheel-winner-image');
        this.winnerTitle = document.getElementById('wheel-winner-title');
        this.openWinnerBtn = document.getElementById('wheel-open-winner-btn');
        this.removeWinnerBtn = document.getElementById('wheel-remove-winner-btn');
        this.closeResultBtn = document.getElementById('wheel-close-result-btn');

        this.currentWinner = null;
        this.removedIds = new Set();

        this.init();
    }

    init() {
        if (!this.canvas) return;

        // Resize canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Event Listeners
        this.spinBtn.addEventListener('click', () => this.spin());
        this.closeBtn.addEventListener('click', () => this.close());
        this.shuffleBtn.addEventListener('click', () => this.shuffle());

        // Filter Listeners
        this.filterMovie.addEventListener('change', () => this.applyFilters());
        this.filterTV.addEventListener('change', () => this.applyFilters());
        this.filterRuntime.addEventListener('input', (e) => {
            const val = e.target.value;
            this.filterRuntimeValue.textContent = val >= 240 ? 'All' : `< ${val}m`;
            this.applyFilters();
        });
        this.sourceSelect.addEventListener('change', () => this.applyFilters());

        // Result Listeners
        this.closeResultBtn.addEventListener('click', () => this.hideResult());
        this.openWinnerBtn.addEventListener('click', () => {
            if (this.currentWinner) {
                this.openModalCallback(this.currentWinner.tmdb_id, this.currentWinner.type || this.currentWinner.media_type);
                this.close(); // Close wheel modal? Or keep it open? User probably wants to see details.
                // Let's keep wheel open in background but hidden? No, standard modal behavior is one at a time usually.
                // But here we might want to return to wheel.
                // For now, let's close the wheel modal so the movie modal is visible.
            }
        });
        this.removeWinnerBtn.addEventListener('click', () => {
            this.removeWinner();
            this.hideResult();
        });

        // Populate Rating Filters
        this.populateRatingFilters();

        // Initial Filter Apply
        this.applyFilters();
    }

    updateMedia(mediaItems) {
        this.allMedia = mediaItems;
        this.removedIds.clear(); // Reset removed items when media updates? Or keep them? Let's reset.
        this.populateRatingFilters(); // Re-populate in case of new ratings
        this.applyFilters();
    }

    populateRatingFilters() {
        // Extract unique ratings
        const ratings = new Set();
        this.allMedia.forEach(item => {
            if (item.content_rating) ratings.add(item.content_rating);
        });

        // Clear container
        this.ratingFiltersContainer.innerHTML = '';

        // Create "All" checkbox? Or just list them all checked by default
        Array.from(ratings).sort().forEach(rating => {
            if (!rating) return;
            const label = document.createElement('label');
            label.className = 'flex items-center space-x-2 cursor-pointer';
            label.innerHTML = `
                <input type="checkbox" value="${rating}" checked class="form-checkbox text-accent-primary rounded bg-bg-primary border-border-primary wheel-rating-checkbox">
                <span class="text-sm text-text-secondary">${rating}</span>
            `;
            label.querySelector('input').addEventListener('change', () => this.applyFilters());
            this.ratingFiltersContainer.appendChild(label);
        });
    }

    applyFilters() {
        const showMovies = this.filterMovie.checked;
        const showTV = this.filterTV.checked;
        const maxRuntime = parseInt(this.filterRuntime.value);
        const source = this.sourceSelect.value;

        // Get checked ratings
        const checkedRatings = Array.from(this.ratingFiltersContainer.querySelectorAll('input:checked')).map(cb => cb.value);

        this.filteredItems = this.allMedia.filter(item => {
            // Exclude removed items
            if (this.removedIds.has(item.tmdb_id)) return false;

            // Type Filter
            const isMovie = item.type === 'movie' || item.media_type === 'movie';
            const isTV = item.type === 'tv' || item.media_type === 'tv' || item.type === 'series';

            if (isMovie && !showMovies) return false;
            if (isTV && !showTV) return false;

            // Rating Filter
            if (item.content_rating && !checkedRatings.includes(item.content_rating)) return false;
            // If item has no rating, maybe include it? Or exclude? Let's include for now if no filters are strict.
            // Actually, if we have rating filters and it has none, it might be safer to hide or show based on "Unrated" checkbox.
            // For simplicity, if it has a rating, check it. If not, let it pass.

            // Runtime Filter
            if (maxRuntime < 240) {
                const runtime = item.runtime || (item.episode_run_time ? item.episode_run_time[0] : 0);
                if (!runtime || runtime > maxRuntime) return false;
            }

            // Source Filter
            if (source === 'want-to-watch' && !item.want_to_watch) return false;
            if (source === 'currently-watching' && !item.currently_watching) return false;

            return true;
        });

        this.itemCountLabel.textContent = `${this.filteredItems.length} items`;
        this.drawWheel();
    }

    resizeCanvas() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        this.drawWheel();
    }

    drawWheel() {
        if (!this.ctx) return;
        const { width, height } = this.canvas;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 10;

        this.ctx.clearRect(0, 0, width, height);

        const len = this.filteredItems.length;
        if (len === 0) {
            // Draw empty state
            this.ctx.fillStyle = '#ccc';
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = '#666';
            this.ctx.font = '20px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('No items found', centerX, centerY);
            return;
        }

        const anglePerSegment = (Math.PI * 2) / len;

        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(this.currentAngle);

        for (let i = 0; i < len; i++) {
            const item = this.filteredItems[i];
            const startAngle = i * anglePerSegment;
            const endAngle = (i + 1) * anglePerSegment;

            // Draw Segment
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.arc(0, 0, radius, startAngle, endAngle);
            this.ctx.fillStyle = COLORS[i % COLORS.length];
            this.ctx.fill();
            this.ctx.stroke();

            // Draw Text
            this.ctx.save();
            this.ctx.rotate(startAngle + anglePerSegment / 2);
            this.ctx.textAlign = 'right';
            this.ctx.fillStyle = '#fff';
            this.ctx.font = len > 50 ? '10px Inter' : '14px Inter';
            this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
            this.ctx.shadowBlur = 4;

            let text = item.title || item.name;
            if (text.length > 20) text = text.substring(0, 18) + '...';

            this.ctx.fillText(text, radius - 20, 5);
            this.ctx.restore();
        }

        this.ctx.restore();
    }

    spin() {
        if (this.isSpinning || this.filteredItems.length === 0) return;

        this.isSpinning = true;
        this.spinVelocity = Math.random() * 0.3 + 0.4; // Initial speed
        this.spinBtn.disabled = true;
        this.spinBtn.classList.add('opacity-50', 'cursor-not-allowed');

        this.animate();
    }

    animate() {
        if (!this.isSpinning) return;

        this.currentAngle += this.spinVelocity;
        this.spinVelocity *= this.spinFriction; // Decelerate

        // Stop condition
        if (this.spinVelocity < 0.002) {
            this.isSpinning = false;
            this.spinVelocity = 0;
            this.spinBtn.disabled = false;
            this.spinBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            this.determineWinner();
        } else {
            this.drawWheel();
            requestAnimationFrame(() => this.animate());
        }
    }

    determineWinner() {
        const len = this.filteredItems.length;
        const anglePerSegment = (Math.PI * 2) / len;

        // Normalize angle
        let normalizedAngle = this.currentAngle % (Math.PI * 2);

        // The pointer is at 0 degrees (right side) in canvas, but we rotated the context.
        // Actually, in my draw code:
        // Pointer is at right side (0 radians).
        // Canvas rotates by currentAngle.
        // So the segment at 0 radians is the one that overlaps with the pointer?
        // Wait, if I rotate the canvas by +angle, the items move clockwise.
        // The pointer is static at 0 (3 o'clock).
        // So we need to find which segment is at 0.

        // If currentAngle is 0, segment 0 is at [0, step].
        // If currentAngle is -step, segment 1 is at [0, step].
        // We need to calculate the effective angle of the pointer relative to the wheel.

        // Effective Pointer Angle = (2PI - (currentAngle % 2PI)) % 2PI
        // This gives the angle on the wheel that is currently aligning with the static 0 angle of the canvas.

        const pointerAngle = (Math.PI * 2 - (normalizedAngle % (Math.PI * 2))) % (Math.PI * 2);
        const winnerIndex = Math.floor(pointerAngle / anglePerSegment);

        this.currentWinner = this.filteredItems[winnerIndex];
        this.showResult(this.currentWinner);
    }

    showResult(item) {
        // Confetti!
        if (window.confetti) {
            window.confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: COLORS
            });
        }

        // Update Overlay
        this.winnerTitle.textContent = item.title || item.name;
        const posterPath = item.poster_path;
        if (posterPath) {
            this.winnerImage.src = posterPath.startsWith('http') ? posterPath : `https://image.tmdb.org/t/p/w500${posterPath}`;
        } else {
            this.winnerImage.src = 'https://placehold.co/300x450?text=No+Image';
        }

        // Show Overlay
        this.resultOverlay.classList.remove('hidden');
        // Small delay for fade in
        setTimeout(() => {
            this.resultOverlay.classList.remove('opacity-0');
        }, 10);
    }

    hideResult() {
        this.resultOverlay.classList.add('opacity-0');
        setTimeout(() => {
            this.resultOverlay.classList.add('hidden');
        }, 300);
    }

    removeWinner() {
        if (!this.currentWinner) return;

        // Remove from filtered list locally to update wheel immediately
        // Note: This doesn't delete from DB, just from the current wheel session
        this.filteredItems = this.filteredItems.filter(i => i.tmdb_id !== this.currentWinner.tmdb_id);

        // Also update the source array if we want it to persist during this session?
        // The user said "you can also remove items from the wheel".
        // Usually this means "remove from the wheel so I don't spin it again".

        // I'll filter it out from the current filteredItems.
        // But if I re-apply filters, it might come back if I don't track "removed items".
        // So I should track removed IDs.

        if (!this.removedIds) this.removedIds = new Set();
        this.removedIds.add(this.currentWinner.tmdb_id);

        this.applyFilters(); // This will re-filter and exclude removed items
    }

    shuffle() {
        // Fisher-Yates shuffle
        for (let i = this.filteredItems.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.filteredItems[i], this.filteredItems[j]] = [this.filteredItems[j], this.filteredItems[i]];
        }
        this.drawWheel();
    }

    open() {
        this.modal.classList.remove('hidden');
        this.modal.classList.add('flex');
        this.resizeCanvas();
        this.applyFilters();
    }

    close() {
        this.modal.classList.add('hidden');
        this.modal.classList.remove('flex');
    }
}

// Export function to initialize wheel picker
export function initWheelPicker(mediaItems, openModalCallback) {
    return new WheelPicker(mediaItems, openModalCallback);
}
