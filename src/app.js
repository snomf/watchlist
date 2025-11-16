import { supabase } from './supabase-client.js';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Fetches the user's watchlist from Supabase.
 */
async function getWatchlistMedia() {
    const { data: media, error } = await supabase.from('media').select('*');
    if (error) {
        console.error('Error fetching media:', error);
        return [];
    }
    return media;
}

/**
 * Renders a list of media items (from the watchlist) to the grid.
 * @param {Array} media - An array of media objects from Supabase.
 */
async function renderMedia(media) {
    const movieGrid = document.getElementById('movie-grid');
    if (!movieGrid) return;
    movieGrid.innerHTML = '';

    for (const item of media) {
        const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://placehold.co/500x750?text=No+Image';
        createMovieCard(movieGrid, item.title, item.type, item.tmdb_id, posterUrl);
    }
}

/**
 * Searches TMDB for movies and TV shows.
 * @param {string} query - The search term.
 * @returns {Array} - A list of search results.
 */
async function searchTMDB(query) {
    if (!query) return [];
    const searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        // Filter out results that aren't movies or TV shows
        return data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
    } catch (error) {
        console.error('Error searching TMDB:', error);
        return [];
    }
}

/**
 * Renders a list of search results to the grid.
 * @param {Array} results - An array of media objects from the TMDB search.
 */
function renderSearchResults(results) {
    const movieGrid = document.getElementById('movie-grid');
    if (!movieGrid) return;
    movieGrid.innerHTML = '';

    for (const item of results) {
        const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://placehold.co/500x750?text=No+Image';
        createMovieCard(movieGrid, item.title || item.name, item.media_type, item.id, posterUrl);
    }
}

/**
 * Creates and appends a single movie card to the grid.
 * @param {HTMLElement} grid - The movie grid element.
 * @param {string} title - The title of the media.
 * @param {string} type - The type of media ('movie' or 'tv').
 * @param {number} tmdbId - The TMDB ID.
 * @param {string} posterUrl - The URL for the poster image.
 */
function createMovieCard(grid, title, type, tmdbId, posterUrl) {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card relative rounded-lg shadow-lg overflow-hidden cursor-pointer group';
    movieCard.dataset.tmdbId = tmdbId;
    movieCard.dataset.type = type;

    movieCard.innerHTML = `
        <img src="${posterUrl}" alt="${title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-4">
            <h3 class="text-white font-bold text-lg truncate">${title}</h3>
        </div>
    `;
    movieCard.addEventListener('click', () => openMovieModal(tmdbId, type));
    grid.appendChild(movieCard);
}


/**
 * Opens the movie details modal.
 * @param {number} tmdbId - The TMDB ID of the selected media.
 * @param {string} type - The type of media ('movie' or 'tv').
 */
async function openMovieModal(tmdbId, type) {
    const modal = document.getElementById('movie-modal');
    if (!modal) return;

    const endpoint = type === 'movie' ? 'movie' : 'tv';
    const tmdbUrl = `https://api.themoviedb.org/3/${endpoint}/${tmdbId}?api_key=${TMDB_API_KEY}`;

    try {
        const response = await fetch(tmdbUrl);
        if (!response.ok) throw new Error('Failed to fetch modal data.');

        const data = await response.json();
        document.getElementById('modal-title').textContent = data.title || data.name;
        document.getElementById('modal-overview').textContent = data.overview;

        const releaseDate = data.release_date || data.first_air_date || '';
        document.getElementById('modal-release-year').textContent = releaseDate.substring(0, 4);

        const runtime = data.runtime || (data.episode_run_time ? data.episode_run_time[0] : 'N/A');
        document.getElementById('modal-runtime').textContent = `${runtime} min`;

        document.getElementById('modal-score').textContent = data.vote_average ? data.vote_average.toFixed(1) : 'N/A';

        const backdropUrl = data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : 'https://placehold.co/800x400?text=No+Image';
        document.getElementById('modal-backdrop-image').src = backdropUrl;

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    } catch (error) {
        console.error('Error opening movie modal:', error);
    }
}

/**
 * Sets up the event listener for the modal's close button.
 */
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

// --- INITIALIZATION ---

let allMedia = []; // To store the initial watchlist

async function initializeApp() {
    // Hide loading spinner
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) loadingSpinner.style.display = 'none';

    // Fetch and render the initial watchlist
    allMedia = await getWatchlistMedia();
    renderMedia(allMedia);

    // Setup search bar
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', async (e) => {
        const searchTerm = e.target.value.trim();
        if (searchTerm === '') {
            renderMedia(allMedia); // If search is cleared, show original watchlist
        } else {
            const searchResults = await searchTMDB(searchTerm);
            renderSearchResults(searchResults);
        }
    });

    // Setup other UI elements
    setupModalCloseButton();
}

document.addEventListener('DOMContentLoaded', initializeApp);
