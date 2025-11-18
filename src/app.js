import { supabase } from './supabase-client.js';
import { seedDatabaseFromLocal } from './seeder.js';
import { initializeSettings, loadAndApplySettings } from './settings.js';
import { initializeStarRating } from './features/ratings.js';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Fetches the user's watchlist from Supabase, only including items with an
 * approved source.
 */
async function getWatchlistMedia() {
    const approvedSources = ['fetched', 'added', 'tbw'];
    const { data: media, error } = await supabase
        .from('media')
        .select('*')
        .in('source', approvedSources);

    if (error) {
        console.error('Error fetching media:', error);
        return [];
    }
    return media;
}

/**
 * Synchronizes the local watchlist data with the latest data from TMDB.
 * Any discrepancies found (e.g., poster path, title) are updated in Supabase.
 * @param {Array} localMedia - The array of media objects from Supabase.
 * @returns {Array} - The updated array of media objects after syncing.
 */
async function syncWithTMDB(localMedia) {
    console.log('Starting TMDB data synchronization...');
    const BATCH_SIZE = 10;
    let updatedMedia = [];
    let updatedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < localMedia.length; i += BATCH_SIZE) {
        const batch = localMedia.slice(i, i + BATCH_SIZE);

        const syncPromises = batch.map(async (item) => {
            if (!item.tmdb_id || !item.type) return item;

            const endpoint = item.type === 'movie' ? 'movie' : 'tv';
            const tmdbUrl = `https://api.themoviedb.org/3/${endpoint}/${item.tmdb_id}?api_key=${TMDB_API_KEY}`;

            try {
                const response = await fetch(tmdbUrl);
                if (!response.ok) {
                    console.error(`Error fetching TMDB data for ${item.title} (ID: ${item.tmdb_id}): ${response.status}`);
                    errorCount++;
                    return item;
                }

                const tmdbData = await response.json();
                const tmdbTitle = tmdbData.title || tmdbData.name;
                const updates = {};

                if (item.poster_path !== tmdbData.poster_path) updates.poster_path = tmdbData.poster_path;
                if (item.title !== tmdbTitle) updates.title = tmdbTitle;

                if (Object.keys(updates).length > 0) {
                    const { error } = await supabase.from('media').update(updates).eq('id', item.id);
                    if (error) {
                        console.error(`Error updating Supabase for ${item.title}:`, error);
                        errorCount++;
                        return item;
                    }
                    updatedCount++;
                    return { ...item, ...updates };
                }
                return item;
            } catch (error) {
                console.error(`Error during TMDB sync for ${item.title}:`, error);
                errorCount++;
                return item;
            }
        });

        const batchResults = await Promise.all(syncPromises);
        updatedMedia = updatedMedia.concat(batchResults);
    }

    console.log(`TMDB sync complete. Updated: ${updatedCount}/${localMedia.length}. Errors: ${errorCount}`);
    return updatedMedia;
}

// --- STATE ---
let allMedia = [];
let currentMedia = [];
let filteredMedia = []; // To hold the currently visible media
let currentFilter = 'all';
let currentView = 'grid';

// --- RENDERING ---

async function searchTMDB(query) {
    if (!query) return [];
    const searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(searchUrl);
        const data = await response.json();

        let results = data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');

        // Check the setting
        const { data: settings } = await supabase.from('settings').select('hide_search_results_without_images').single();
        if (settings?.hide_search_results_without_images) {
            results = results.filter(item => item.poster_path);
        }

        return results;
    } catch (error) {
        console.error('Error searching TMDB:', error);
        return [];
    }
}

function renderContent() {
    const movieGrid = document.getElementById('movie-grid');
    const movieList = document.getElementById('movie-list');

    // 1. Filter the media
    if (currentFilter === 'all') {
        filteredMedia = currentMedia;
    } else {
        filteredMedia = currentMedia.filter(item => {
            const itemType = item.type || item.media_type; // 'movie', 'series', or 'tv'
            if (currentFilter === 'movie') {
                return itemType === 'movie';
            }
            if (currentFilter === 'tv') {
                return itemType === 'tv' || itemType === 'series';
            }
            return false;
        });
    }

    // 2. Render based on the current view
    if (currentView === 'grid') {
        movieGrid.innerHTML = '';
        movieList.innerHTML = '';
        movieGrid.style.display = 'grid';
        movieList.style.display = 'none';

        if (filteredMedia.length === 0) {
            movieGrid.innerHTML = '<p class="text-text-muted col-span-full text-center">No results found.</p>';
            return;
        }

        for (const item of filteredMedia) {
            const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://placehold.co/500x750?text=No+Image';
            const title = item.title || item.name;
            const type = item.type || item.media_type;
            const tmdbId = item.tmdb_id || item.id;
            createMovieCard(movieGrid, title, type, tmdbId, posterUrl, item.watched);
        }
    } else { // currentView === 'list'
        movieGrid.innerHTML = '';
        movieList.innerHTML = '';
        movieGrid.style.display = 'none';
        movieList.style.display = 'block';

        if (filteredMedia.length === 0) {
            movieList.innerHTML = '<p class="text-text-muted text-center">No results found.</p>';
            return;
        }

        const listContainer = document.createElement('div');
        listContainer.className = 'bg-bg-secondary p-4 md:p-6 rounded-lg shadow-lg';

        filteredMedia.forEach(item => {
            const title = item.title || item.name;
            const type = item.type || item.media_type;
            const tmdbId = item.tmdb_id || item.id;

            const listItem = document.createElement('div');
            listItem.className = 'flex items-center py-1';
            listItem.innerHTML = `
                <span class="text-text-muted mr-2">-</span>
                <a href="#" class="text-text-primary hover:text-accent-primary underline transition-colors" data-tmdb-id="${tmdbId}" data-type="${type}">${title}</a>
            `;
            listItem.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                openMovieModal(tmdbId, type);
            });
            listContainer.appendChild(listItem);
        });
        movieList.appendChild(listContainer);
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
function createMovieCard(grid, title, type, tmdbId, posterUrl, isWatched) {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card relative rounded-lg shadow-lg overflow-hidden cursor-pointer group';
    if (isWatched) {
        movieCard.classList.add('watched');
    }
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
let currentMediaItem = null; // To store the full media item for the open modal

async function openMovieModal(tmdbId, type) {
    const modal = document.getElementById('movie-modal');
    if (!modal) return;

    // Store the tmdbId in the modal for later use
    modal.dataset.tmdbId = tmdbId;

    const endpoint = type === 'movie' ? 'movie' : 'tv';
    const appendToResponse = 'credits,images,videos,release_dates,external_ids';
    const tmdbUrl = `https://api.themoviedb.org/3/${endpoint}/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=${appendToResponse}`;

    try {
        const response = await fetch(tmdbUrl);
        if (!response.ok) throw new Error('Failed to fetch modal data.');

        const data = await response.json();

        // --- Basic Info ---
        document.getElementById('modal-overview').textContent = data.overview;

        // --- Logo ---
        const titleElement = document.getElementById('modal-title');
        titleElement.innerHTML = ''; // Clear previous content
        const bestLogo = data.images?.logos?.find(logo => logo.iso_639_1 === 'en' && !logo.file_path.endsWith('.svg')) || data.images?.logos?.[0];

        if (bestLogo) {
            const logoUrl = `https://image.tmdb.org/t/p/w500${bestLogo.file_path}`;
            titleElement.innerHTML = `<img src="${logoUrl}" alt="${data.title || data.name} Logo" class="max-h-24">`;
        } else {
            titleElement.textContent = data.title || data.name;
        }

        const releaseDate = data.release_date || data.first_air_date || '';
        document.getElementById('modal-release-year').textContent = releaseDate.substring(0, 4);

        const runtime = data.runtime || (data.episode_run_time ? data.episode_run_time[0] : 'N/A');
        document.getElementById('modal-runtime').textContent = runtime ? `${runtime} min` : 'N/A';

        // --- Content Rating ---
        let contentRating = 'N/A';
        if (type === 'movie' && data.release_dates) {
            const usRelease = data.release_dates.results.find(r => r.iso_3166_1 === 'US');
            if (usRelease) {
                const rating = usRelease.release_dates.find(rd => rd.certification !== '');
                if (rating) contentRating = rating.certification;
            }
        } else if (type === 'tv' && data.content_ratings) {
            const usRating = data.content_ratings.results.find(r => r.iso_3166_1 === 'US');
            if (usRating) contentRating = usRating.rating;
        }
        document.getElementById('modal-content-rating').textContent = contentRating;

        // --- IMDb Score & Link ---
        const imdbId = data.external_ids.imdb_id;
        const imdbScore = data.vote_average ? data.vote_average.toFixed(1) : 'N/A';
        document.getElementById('modal-score').textContent = imdbScore;
        const imdbLink = document.getElementById('modal-imdb-link');
        if (imdbId) {
            imdbLink.href = `https://www.imdb.com/title/${imdbId}`;
            imdbLink.style.display = 'flex';
        } else {
            imdbLink.style.display = 'none';
        }

        // --- Backdrop Image ---
        const backdropUrl = data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : 'https://placehold.co/800x400?text=No+Image';
        document.getElementById('modal-backdrop-image').src = backdropUrl;

        // --- Fetch and Display User Ratings & Notes ---
        const { data: mediaItem, error } = await supabase
            .from('media')
            .select('*')
            .eq('tmdb_id', tmdbId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = 'Not a single row was found'
            console.error('Error fetching media item for ratings:', error);
        }

        currentMediaItem = mediaItem || {
            tmdb_id: tmdbId,
            type: type,
            favorited_by: [],
            watched: false,
            juainny_rating: null,
            erick_rating: null,
            juainny_notes: null,
            erick_notes: null,
        };

        // --- Initialize Star Ratings ---
        await initializeStarRating('juainny-rating-container', currentMediaItem?.juainny_rating || 0, debouncedSave);
        await initializeStarRating('erick-rating-container', currentMediaItem?.erick_rating || 0, debouncedSave);

        // --- Favorites ---
        updateFavoriteGlow(currentMediaItem);

        // --- Watched Status ---
        updateWatchedButtonUI(currentMediaItem);

        document.getElementById('juainny-notes').value = currentMediaItem?.juainny_notes || '';
        document.getElementById('erick-notes').value = mediaItem?.erick_notes || '';

        // Show the notes section
        document.getElementById('notes-section').classList.remove('hidden');

        // --- Update Supabase with backdrop path ---
        if (data.backdrop_path && mediaItem.backdrop_path !== data.backdrop_path) {
            const { error: updateError } = await supabase
                .from('media')
                .update({ backdrop_path: data.backdrop_path })
                .eq('tmdb_id', tmdbId);
            if (updateError) console.error('Error updating backdrop path:', updateError);
        }

        // --- Show Modal ---
        modal.classList.remove('hidden');
        modal.classList.remove('modal-hidden');
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
            modal.classList.add('modal-hidden');
            modal.classList.remove('flex');
        });
    }
}

// --- DEBOUNCE UTILITY ---
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

const debouncedSave = debounce(saveRatingsAndNotes, 500); // 500ms delay

/**
 * Saves the current ratings and notes to Supabase.
 */
async function saveRatingsAndNotes() {
    const modal = document.getElementById('movie-modal');
    const tmdbId = modal.dataset.tmdbId;
    if (!tmdbId) return;

    const juainnyRating = document.querySelector('#juainny-rating-container .rating-input-hidden').value;
    const erickRating = document.querySelector('#erick-rating-container .rating-input-hidden').value;

    const updates = {
        juainny_rating: parseFloat(juainnyRating) || null,
        juainny_notes: document.getElementById('juainny-notes').value || null,
        erick_rating: parseFloat(erickRating) || null,
        erick_notes: document.getElementById('erick-notes').value || null,
    };

    const { error } = await supabase.from('media').update(updates).eq('tmdb_id', tmdbId);
    if (error) {
        console.error('Error saving ratings and notes:', error);
    } else {
        console.log('Ratings and notes auto-saved successfully.');
    }
}

/**
 * Sets up event listeners for the ratings and notes input fields.
 */
function setupRatingAndNotesListeners() {
    // Listener for textareas
    const notesInputs = ['juainny-notes', 'erick-notes'];
    notesInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', debouncedSave);
    });

    // The onRatingChange callback in initializeStarRating will trigger the debounced save
}

// --- EVENT LISTENERS ---

function setupFeelingLuckyButton() {
    const luckyButton = document.getElementById('random-movie-btn');
    if (luckyButton) {
        luckyButton.addEventListener('click', () => {
            if (filteredMedia.length === 0) {
                // Optionally, provide feedback to the user
                console.log("No movies to choose from!");
                return;
            }
            const randomItem = filteredMedia[Math.floor(Math.random() * filteredMedia.length)];
            const tmdbId = randomItem.tmdb_id || randomItem.id;
            const type = randomItem.type || randomItem.media_type;
            openMovieModal(tmdbId, type);
        });
    }
}

function setupFilterControls() {
    const filterControls = document.getElementById('filter-controls');
    filterControls.addEventListener('click', (e) => {
        if (e.target.matches('.filter-btn')) {
            const filter = e.target.dataset.filter;
            if (filter === currentFilter) return;

            // Update state
            currentFilter = filter;

            // Update UI
            filterControls.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('btn-active');
            });
            e.target.classList.add('btn-active');

            // Re-render
            renderContent();
        }
    });
}

function updateFavoriteGlow(mediaItem) {
    const modalContent = document.querySelector('.movie-modal-content');
    const movieCard = document.querySelector(`.movie-card[data-tmdb-id="${mediaItem.tmdb_id}"]`);

    const favoritedBy = mediaItem.favorited_by || [];
    const favoritedByJuainny = favoritedBy.includes('juainny');
    const favoritedByErick = favoritedBy.includes('erick');

    [modalContent, movieCard].forEach(el => {
        if (!el) return;
        el.classList.remove('favorite-glow', 'super-favorite-glow');
        if (favoritedByJuainny && favoritedByErick) {
            el.classList.add('super-favorite-glow');
        } else if (favoritedByJuainny || favoritedByErick) {
            el.classList.add('favorite-glow');
        }
    });
}

function setupFavoriteButton() {
    const favoriteBtn = document.getElementById('favorite-btn');
    const userMenu = document.getElementById('user-selection-menu');

    favoriteBtn.addEventListener('click', () => {
        userMenu.classList.toggle('hidden');
    });

    userMenu.addEventListener('click', async (e) => {
        if (e.target.matches('button')) {
            const userId = e.target.id.replace('-btn', ''); // 'user1', 'user2', 'remove-all'
            const tmdbId = currentMediaItem.tmdb_id;
            let currentFavorites = currentMediaItem.favorited_by || [];

            if (userId === 'remove-all') {
                currentFavorites = [];
            } else if (userId === 'user1') {
                const isFavorited = currentFavorites.includes('juainny');
                currentFavorites = currentFavorites.filter(u => u !== 'juainny');
                if (!isFavorited) {
                    currentFavorites.push('juainny');
                }
            } else if (userId === 'user2') {
                const isFavorited = currentFavorites.includes('erick');
                currentFavorites = currentFavorites.filter(u => u !== 'erick');
                if (!isFavorited) {
                    currentFavorites.push('erick');
                }
            }

            const { data, error } = await supabase
                .from('media')
                .update({ favorited_by: currentFavorites })
                .eq('tmdb_id', tmdbId)
                .select()
                .single();

            if (error) {
                console.error('Error updating favorites:', error);
            } else {
                currentMediaItem = data;
                updateFavoriteGlow(currentMediaItem);
            }
            userMenu.classList.add('hidden');
        }
    });
}

function updateWatchedButtonUI(mediaItem) {
    const watchedBtn = document.getElementById('toggle-watched-btn');

    if (mediaItem.watched) {
        watchedBtn.textContent = 'Mark as Unwatched';
        watchedBtn.classList.replace('bg-success', 'bg-gray-600');
    } else {
        watchedBtn.textContent = 'Mark as Watched';
        watchedBtn.classList.replace('bg-gray-600', 'bg-success');
    }
}

function setupWatchedButtons() {
    const watchedBtn = document.getElementById('toggle-watched-btn');
    const rejectedBtn = document.getElementById('toggle-rejected-btn');

    const handleWatchedToggle = async (isReject) => {
        const tmdbId = currentMediaItem.tmdb_id;
        const newWatchedStatus = isReject ? false : !currentMediaItem.watched;

        const { data, error } = await supabase
            .from('media')
            .update({ watched: newWatchedStatus })
            .eq('tmdb_id', tmdbId)
            .select()
            .single();

        if (error) {
            console.error('Error updating watched status:', error);
        } else {
            currentMediaItem = data;
            updateWatchedButtonUI(currentMediaItem);
            // We need to update the `allMedia` array as well so the main view updates
            const index = allMedia.findIndex(item => item.tmdb_id === tmdbId);
            if (index > -1) {
                allMedia[index].watched = newWatchedStatus;
            }
            renderContent();
        }
    };

    watchedBtn.addEventListener('click', () => handleWatchedToggle(false));
    rejectedBtn.addEventListener('click', () => handleWatchedToggle(true));
}

function setupTooltips() {
    const tooltipElement = document.getElementById('tooltip');

    document.addEventListener('mouseover', (e) => {
        if (e.target.matches('[title]')) {
            const title = e.target.getAttribute('title');
            e.target.setAttribute('data-original-title', title);
            e.target.removeAttribute('title');

            tooltipElement.textContent = title;
            tooltipElement.classList.remove('hidden');

            const rect = e.target.getBoundingClientRect();
            tooltipElement.style.left = `${rect.left + (rect.width / 2) - (tooltipElement.offsetWidth / 2)}px`;
            tooltipElement.style.top = `${rect.top - tooltipElement.offsetHeight - 5}px`;
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.matches('[data-original-title]')) {
            e.target.setAttribute('title', e.target.getAttribute('data-original-title'));
            e.target.removeAttribute('data-original-title');
            tooltipElement.classList.add('hidden');
        }
    });
}

function setupViewControls() {
    const viewControls = document.getElementById('view-controls');
    viewControls.addEventListener('click', (e) => {
        const button = e.target.closest('.view-btn');
        if (button) {
            const view = button.dataset.view;
            if (view === currentView) return;

            // Update state
            currentView = view;

            // Update UI
            viewControls.querySelectorAll('.view-btn').forEach(btn => {
                btn.classList.remove('btn-active');
            });
            button.classList.add('btn-active');

            // Re-render
            renderContent();
        }
    });
}

// --- INITIALIZATION ---

async function initializeApp() {
    try {
    console.log('Initializing app...');
    const urlParams = new URLSearchParams(window.location.search);
    const shouldHardReset = urlParams.get('hardrefresh') === 'true';

    if (shouldHardReset) {
        await seedDatabaseFromLocal();
        // Clean the URL to prevent re-seeding on refresh
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Show a loading indicator while we fetch and sync
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) loadingSpinner.style.display = 'flex';

    // Fetch the initial watchlist
    let watchlistMedia = await getWatchlistMedia();

    // Sync data with TMDB
    watchlistMedia = await syncWithTMDB(watchlistMedia);

    // Store the synced media
    allMedia = watchlistMedia;
    console.log('Synced Media:', allMedia);
    currentMedia = allMedia; // Set currentMedia to the full list initially

    // Initial render
    renderContent();

    // Hide the loading spinner
    if (loadingSpinner) loadingSpinner.style.display = 'none';

    // Setup search bar
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', async (e) => {
        const searchTerm = e.target.value.trim();
        if (searchTerm === '') {
            currentMedia = allMedia; // If search is cleared, show original watchlist
        } else {
            const searchResults = await searchTMDB(searchTerm);
            currentMedia = searchResults; // Update currentMedia with search results
        }
        renderContent(); // Re-render with the new media (and current filter/view)
    });

    // Setup other UI elements
    setupModalCloseButton();
    setupRatingAndNotesListeners();
    setupFilterControls();
    setupViewControls();
    setupFeelingLuckyButton();
    setupTooltips();
    setupFavoriteButton();
    setupWatchedButtons();
    initializeSettings();
    loadAndApplySettings();
    setupUserMenu();
    } catch (error) {
        console.error('Error during app initialization:', error);
    }
}

/**
 * Sets up the event listener for the user menu button.
 */
function setupUserMenu() {
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userMenu = document.getElementById('user-menu');

    if (userMenuBtn && userMenu) {
        userMenuBtn.addEventListener('click', () => {
            userMenu.classList.toggle('hidden');
        });
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);

if (import.meta.hot) {
    import.meta.hot.on('vite:error', (err) => {
        console.error(err);
    });
}
