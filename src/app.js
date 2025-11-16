import { supabase } from './supabase-client.js';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

async function getWatchlistMedia() {
    const { data: media, error } = await supabase
        .from('media')
        .select('*');

    if (error) {
        console.error('Error fetching media:', error);
        return [];
    }
    return media;
}

async function renderMedia(media) {
    const movieGrid = document.getElementById('movie-grid');
    if (!movieGrid) {
        console.error('Movie grid element not found!');
        return;
    }

    movieGrid.innerHTML = '';

    for (const item of media) {
        let posterUrl = 'https://placehold.co/500x750?text=No+Image';
        let title = item.title || item.name;
        let type = item.media_type || item.type;
        let tmdb_id = item.id || item.tmdb_id;

        if (item.tmdb_id) {
            const endpoint = item.type === 'movie' ? 'movie' : 'tv';
            const tmdbUrl = `https://api.themoviedb.org/3/${endpoint}/${item.tmdb_id}?api_key=${TMDB_API_KEY}`;
            try {
                const response = await fetch(tmdbUrl);
                if (response.ok) {
                    const tmdbData = await response.json();
                    if (tmdbData.poster_path) {
                        posterUrl = `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`;
                    }
                }
            } catch (error) {
                console.error('Error fetching from TMDB:', error);
            }
        }

        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card', 'bg-bg-secondary', 'rounded-lg', 'shadow-lg', 'overflow-hidden');
        movieCard.dataset.tmdbId = tmdb_id;

        movieCard.innerHTML = `
            <img src="${posterUrl}" alt="${title}" class="w-full h-auto">
            <div class="p-4">
                <h3 class="text-white font-bold text-lg">${title}</h3>
                <p class="text-gray-400 text-sm">${type}</p>
            </div>
        `;
        movieGrid.appendChild(movieCard);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const watchlistMedia = await getWatchlistMedia();
    renderMedia(watchlistMedia);

    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
});
