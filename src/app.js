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
        movieCard.classList.add('movie-card', 'bg-bg-secondary', 'rounded-lg', 'shadow-lg', 'overflow-hidden', 'cursor-pointer');
        movieCard.dataset.tmdbId = tmdb_id;
        movieCard.dataset.type = type;

        movieCard.innerHTML = `
            <img src="${posterUrl}" alt="${title}" class="w-full h-auto">
            <div class="p-4">
                <h3 class="text-white font-bold text-lg">${title}</h3>
                <p class="text-gray-400 text-sm">${type}</p>
            </div>
        `;
        movieCard.addEventListener('click', () => openMovieModal(tmdb_id, type));
        movieGrid.appendChild(movieCard);
    }
}

async function openMovieModal(tmdbId, type) {
    const modal = document.getElementById('movie-modal');
    if (!modal) {
        console.error('Movie modal element not found!');
        return;
    }

    const endpoint = type === 'movie' ? 'movie' : 'tv';
    const tmdbUrl = `https://api.themoviedb.org/3/${endpoint}/${tmdbId}?api_key=${TMDB_API_KEY}`;

    try {
        const response = await fetch(tmdbUrl);
        if (response.ok) {
            const data = await response.json();
            document.getElementById('modal-title').textContent = data.title || data.name;
            document.getElementById('modal-overview').textContent = data.overview;
            document.getElementById('modal-release-year').textContent = (data.release_date || data.first_air_date).substring(0, 4);
            document.getElementById('modal-runtime').textContent = `${data.runtime || data.episode_run_time[0]} min`;
            document.getElementById('modal-score').textContent = data.vote_average.toFixed(1);

            const backdropUrl = data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : 'https://placehold.co/800x400?text=No+Image';
            document.getElementById('modal-backdrop-image').src = backdropUrl;

            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    } catch (error) {
        console.error('Error fetching modal data from TMDB:', error);
    }
}

function setupModalCloseButton() {
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modal = document.getElementById('movie-modal');
    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
    }
}

let allMedia = [];

async function initializeApp() {
    allMedia = await getWatchlistMedia();
    renderMedia(allMedia);

    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }

    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        if (searchTerm === '') {
            renderMedia(allMedia);
            return;
        }
        const filteredMedia = allMedia.filter(item => {
            const title = item.title || item.name;
            return title.toLowerCase().includes(searchTerm);
        });
        renderMedia(filteredMedia);
    });

    setupModalCloseButton();
}

document.addEventListener('DOMContentLoaded', initializeApp);
