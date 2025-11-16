
function searchMedia(query, callback) {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            const data = JSON.parse(this.response);
            callback(data.results);
        } else {
            console.error('Error fetching from TMDB:', this.statusText);
            callback([]);
        }
    };

    xhr.onerror = function () {
        console.error('Error fetching from TMDB: Network error');
        callback([]);
    };

    xhr.send();
}

function renderMedia(media) {
    const movieGrid = document.getElementById('movie-grid');
    if (!movieGrid) {
        console.error('Movie grid element not found!');
        return;
    }

    movieGrid.innerHTML = '';

    media.forEach(item => {
        if (!item.poster_path) return;

        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card', 'bg-bg-secondary', 'rounded-lg', 'shadow-lg', 'overflow-hidden');

        const posterUrl = `https://image.tmdb.org/t/p/w500${item.poster_path}`;

        movieCard.innerHTML = `
            <img src="${posterUrl}" alt="${item.title || item.name}" class="w-full h-auto">
            <div class="p-4">
                <h3 class="text-white font-bold text-lg">${item.title || item.name}</h3>
            </div>
        `;

        movieGrid.appendChild(movieCard);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }

    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const query = e.target.value;
            if (query.length > 2) {
                searchMedia(query, renderMedia);
            }
        });
    }
});
