import { supabase } from './supabase-client.js';
import './firebase-client.js';
import { seedDatabaseFromLocal } from './seeder.js';
import { initializeSettings, loadAndApplySettings, getAvatarHTML } from './settings.js';
import { initializeStarRating } from './features/ratings.js';
import { fetchAllFlairs, fetchMediaFlairs, createFlair, assignFlairToMedia, removeFlairFromMedia, renderFlairBadge } from './features/flairs.js';
import { generateMediaSummary, chatWithWillow } from './features/ai.js';
import { setupAllenEasterEgg } from './features/easter-eggs.js';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Fetches the user's watchlist from Supabase, only including items with an
 * approved source.
 */

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
            // Add append_to_response to get complete metadata
            const appendToResponse = 'release_dates,content_ratings,external_ids';
            const tmdbUrl = `https://api.themoviedb.org/3/${endpoint}/${item.tmdb_id}?api_key=${TMDB_API_KEY}&append_to_response=${appendToResponse}`;

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

                // Update poster and title
                if (item.poster_path !== tmdbData.poster_path) updates.poster_path = tmdbData.poster_path;
                if (item.title !== tmdbTitle) updates.title = tmdbTitle;

                // Extract and update release_year
                const releaseDate = tmdbData.release_date || tmdbData.first_air_date || '';
                const releaseYear = releaseDate ? parseInt(releaseDate.split('-')[0]) : null;
                if (releaseYear && (!item.release_year || item.release_year !== releaseYear)) {
                    updates.release_year = releaseYear;
                }

                // Extract and update runtime
                let runtime = tmdbData.runtime || (tmdbData.episode_run_time && tmdbData.episode_run_time.length > 0 ? tmdbData.episode_run_time[0] : 0);
                // Fallback for TV runtime if still 0
                // Handle both 'tv' and 'series' types
                const isTVShow = item.type === 'tv' || item.type === 'series';
                if (isTVShow && !runtime) {
                    if (tmdbData.last_episode_to_air && tmdbData.last_episode_to_air.runtime) {
                        runtime = tmdbData.last_episode_to_air.runtime;
                    } else if (tmdbData.next_episode_to_air && tmdbData.next_episode_to_air.runtime) {
                        runtime = tmdbData.next_episode_to_air.runtime;
                    }
                }
                // Update runtime if we have a value and it's different (or current is 0/null)
                if (runtime && (item.runtime === 0 || !item.runtime || item.runtime !== runtime)) {
                    updates.runtime = runtime;
                }

                // Extract and update content_rating
                let contentRating = 'N/A';
                if (item.type === 'movie' && tmdbData.release_dates) {
                    const usRelease = tmdbData.release_dates.results.find(r => r.iso_3166_1 === 'US');
                    if (usRelease) {
                        const rating = usRelease.release_dates.find(rd => rd.certification !== '');
                        if (rating) contentRating = rating.certification;
                    }
                } else if (isTVShow) {
                    if (tmdbData.content_ratings && tmdbData.content_ratings.results) {
                        const usRating = tmdbData.content_ratings.results.find(r => r.iso_3166_1 === 'US');
                        if (usRating) {
                            contentRating = usRating.rating;
                        } else if (tmdbData.content_ratings.results.length > 0) {
                            contentRating = tmdbData.content_ratings.results[0].rating;
                        }
                    }
                }
                if (contentRating !== 'N/A' && (!item.content_rating || item.content_rating === 'N/A' || item.content_rating !== contentRating)) {
                    updates.content_rating = contentRating;
                }

                // Extract and update imdb_id
                const imdbId = tmdbData.external_ids?.imdb_id;
                if (imdbId && (!item.imdb_id || item.imdb_id !== imdbId)) {
                    updates.imdb_id = imdbId;
                }

                // Update database if there are changes
                if (Object.keys(updates).length > 0) {
                    const { error } = await supabase.from('media').update(updates).eq('id', item.id);
                    if (error) {
                        console.error(`Error updating Supabase for ${item.title}:`, error);
                        errorCount++;
                        return item;
                    }
                    console.log(`✓ Updated ${item.title}:`, Object.keys(updates).join(', '));
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
let currentSort = 'default';
let allFlairs = []; // Store all available flairs
let mediaFlairsMap = new Map(); // Store flairs for each media item (mediaId -> flairs[])

// --- RENDERING ---

async function searchTMDB(query) {
    if (!query || query.trim() === '') return [];
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

        if (settings?.hide_search_results_without_images) {
            results = results.filter(item => item.poster_path);
        }

        console.log('TMDB Search Results:', results.length); // DEBUG
        return results;
    } catch (error) {
        console.error('Error searching TMDB:', error);
        return [];
    }
}

function renderContent() {
    console.log('Rendering content. Current Filter:', currentFilter, 'Media Count:', currentMedia.length); // DEBUG
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
            if (currentFilter === 'watched') {
                return item.watched === true; // Explicitly check watched property
            }
            if (currentFilter === 'rejected') {
                return item.rejected === true;
            }
            return false;
        });
    }

    // 2. Sort the media
    sortMedia();

    // 3. Render based on the current view
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
    // console.log('Creating card for:', title, tmdbId); // DEBUG - Commented out to avoid spam, uncomment if needed
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card relative rounded-lg shadow-lg overflow-hidden cursor-pointer group';
    if (isWatched) {
        movieCard.classList.add('watched');
    }
    movieCard.dataset.tmdbId = tmdbId;
    movieCard.dataset.type = type;

    // Apply favorite glow
    const favoritedBy = allMedia.find(item => item.tmdb_id == tmdbId)?.favorited_by || [];
    if (favoritedBy.length > 1) {
        movieCard.classList.add('super-favorite-glow');
    } else if (favoritedBy.length > 0) {
        movieCard.classList.add('favorite-glow');
    }

    movieCard.innerHTML = `
        <img src="${posterUrl}" alt="${title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">
        
        <!-- Reactions Overlay -->
        <div class="absolute top-2 left-2 flex flex-col gap-1 z-10">
            ${allMedia.find(item => item.tmdb_id == tmdbId)?.juainny_reaction ? `
                <div class="relative w-8 h-8 group/reaction cursor-pointer reaction-item" data-user="Juainny" data-reaction="${allMedia.find(item => item.tmdb_id == tmdbId).juainny_reaction}">
                    <img src="moods/${allMedia.find(item => item.tmdb_id == tmdbId).juainny_reaction}" class="w-full h-full object-contain drop-shadow-md">
                    <div class="absolute -bottom-1 -right-1 w-4 h-4">
                        ${getAvatarHTML('juainny', 'w-full h-full')}
                    </div>
                </div>
            ` : ''}
            ${allMedia.find(item => item.tmdb_id == tmdbId)?.erick_reaction ? `
                <div class="relative w-8 h-8 group/reaction cursor-pointer reaction-item" data-user="Erick" data-reaction="${allMedia.find(item => item.tmdb_id == tmdbId).erick_reaction}">
                    <img src="moods/${allMedia.find(item => item.tmdb_id == tmdbId).erick_reaction}" class="w-full h-full object-contain drop-shadow-md">
                    <div class="absolute -bottom-1 -right-1 w-4 h-4">
                        ${getAvatarHTML('erick', 'w-full h-full')}
                    </div>
                </div>
            ` : ''}
        </div>

        <div class="absolute bottom-2 left-2 flex flex-col gap-1 z-10 items-start pointer-events-none">
            <!-- Flairs Container -->
             ${(mediaFlairsMap.get(allMedia.find(i => i.tmdb_id == tmdbId)?.id) || []).map(flair => renderFlairBadge(flair, 'text-[10px] px-1.5 py-0.5 shadow-md')).join('')}
        </div>
        <div class="absolute bottom-0 left-0 right-0 p-4">
            <!-- Title removed as per user request -->
        </div>
        <button class="bookmark-icon absolute bottom-2 right-2 text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
            <i class="fas fa-bookmark"></i>
        </button>
    `;

    // Add hover event listeners to reactions
    movieCard.querySelectorAll('.reaction-item').forEach(reactionEl => {
        reactionEl.addEventListener('mouseenter', (e) => {
            showReactionTooltip(e.currentTarget);
        });
        reactionEl.addEventListener('mouseleave', () => {
            hideReactionTooltip();
        });
        // Add click for mobile (also prevents modal from opening)
        reactionEl.addEventListener('click', (e) => {
            toggleReactionTooltip(e.currentTarget, e);
        });
    });

    // Stop propagation on the bookmark icon to prevent the modal from opening
    const bookmarkBtn = movieCard.querySelector('.bookmark-icon');
    bookmarkBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const posterPath = posterUrl.includes('image.tmdb.org') ? posterUrl.replace('https://image.tmdb.org/t/p/w500', '') : null;
        const mediaItem = await ensureMediaItemExists(tmdbId, type, title, posterPath);
        if (!mediaItem) return;

        // Update local map if needed (though ensureMediaItemExists returns the item, we might need to re-fetch flairs if it was just created)
        if (!mediaFlairsMap.has(mediaItem.id)) {
            mediaFlairsMap.set(mediaItem.id, []);
        }

        const newWantToWatch = !mediaItem.want_to_watch;
        const updates = { want_to_watch: newWantToWatch };
        if (newWantToWatch) {
            updates.currently_watching = false;
        }

        const { error } = await supabase.from('media').update(updates).eq('id', item.id);

        if (error) {
            console.error('Error updating bookmark from grid:', error);
        } else {
            // Visually update the icon
            bookmarkBtn.classList.toggle('text-accent-primary', newWantToWatch);
        }
    });

    movieCard.addEventListener('click', (e) => {
        console.log('Movie card clicked:', title); // DEBUG
        openMovieModal(tmdbId, type);
    });
    grid.appendChild(movieCard);
}

/**
 * Fetches media items that are marked as 'currently_watching', sorted by last activity.
 */
async function getCurrentlyWatchingMedia() {
    const { data: mediaItems, error } = await supabase
        .from('media')
        .select('*')
        .eq('currently_watching', true);

    if (error) {
        console.error('Error fetching currently watching media:', error);
        return [];
    }

    if (!mediaItems || mediaItems.length === 0) return [];

    // Fetch latest activity for these items to sort them
    const mediaIds = mediaItems.map(item => item.id);
    const { data: activities, error: activityError } = await supabase
        .from('activity_log')
        .select('media_id, created_at')
        .in('media_id', mediaIds)
        .order('created_at', { ascending: false });

    if (activityError) {
        console.error('Error fetching activity logs for sorting:', activityError);
        // Fallback to default order (likely ID or created_at of media)
        return mediaItems;
    }

    // Create a map of media_id -> latest timestamp
    const lastActivityMap = {};
    activities.forEach(act => {
        if (!lastActivityMap[act.media_id]) {
            lastActivityMap[act.media_id] = new Date(act.created_at).getTime();
        }
    });

    // Sort media items
    return mediaItems.sort((a, b) => {
        const timeA = lastActivityMap[a.id] || 0;
        const timeB = lastActivityMap[b.id] || 0;
        return timeB - timeA; // Descending order (newest first)
    });
}

/**
 * Fetches media items that are marked as 'want_to_watch'.
 */
async function getWantToWatchMedia() {
    const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('want_to_watch', true)
        .order('created_at', { ascending: false }); // Newest first (left)
    if (error) {
        console.error('Error fetching want to watch media:', error);
        return [];
    }
    return data;
}

/**
 * Renders a carousel with the given media items.
 * @param {string} containerId - The ID of the carousel container element.
 * @param {Array} mediaItems - The array of media items to render.
 */
/**
 * Renders a carousel with the given media items.
 * @param {string} containerId - The ID of the carousel container element.
 * @param {Array} mediaItems - The array of media items to render.
 */
function renderCarousel(containerId, mediaItems) {
    const carouselContainer = document.getElementById(containerId);
    if (!carouselContainer) return;

    // Reset container classes to prevent shrinking issues from HTML
    carouselContainer.className = 'relative group/carousel w-full overflow-hidden';
    carouselContainer.innerHTML = ''; // Clear existing content

    if (mediaItems.length === 0) {
        carouselContainer.innerHTML = '<p class="text-text-muted text-center w-full">Nothing here yet!</p>';
        return;
    }

    // Wrapper for the carousel to handle arrows
    // We don't strictly need a wrapper if we use the container itself, but let's keep it for structure if needed.
    // Actually, let's simplify. The container IS the wrapper now.

    // Scroll Container
    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'flex gap-4 scroll-smooth pb-4 px-1 scrollbar-hide snap-x snap-mandatory';
    scrollContainer.style.cssText = 'overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; max-width: 100%; width: 100%;';

    const style = document.createElement('style');
    style.textContent = `
        #${containerId} .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
    `;
    carouselContainer.appendChild(style);


    // Left Arrow
    const leftArrow = document.createElement('div');
    leftArrow.className = 'absolute left-0 top-0 bottom-0 z-20 flex items-center px-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity';

    const leftBtn = document.createElement('button');
    leftBtn.type = 'button';
    leftBtn.className = 'bg-black/50 hover:bg-black/80 text-white p-2 rounded-full cursor-pointer transition-colors';
    leftBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    leftBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const scrollAmount = scrollContainer.clientWidth * 0.8;
        scrollContainer.scrollTo({
            left: scrollContainer.scrollLeft - scrollAmount,
            behavior: 'smooth'
        });
    });
    leftArrow.appendChild(leftBtn);

    // Right Arrow
    const rightArrow = document.createElement('div');
    rightArrow.className = 'absolute right-0 top-0 bottom-0 z-20 flex items-center px-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity';

    const rightBtn = document.createElement('button');
    rightBtn.type = 'button';
    rightBtn.className = 'bg-black/50 hover:bg-black/80 text-white p-2 rounded-full cursor-pointer transition-colors';
    rightBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    rightBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const scrollAmount = scrollContainer.clientWidth * 0.8;
        scrollContainer.scrollTo({
            left: scrollContainer.scrollLeft + scrollAmount,
            behavior: 'smooth'
        });
    });
    rightArrow.appendChild(rightBtn);

    carouselContainer.appendChild(leftArrow);
    carouselContainer.appendChild(scrollContainer);
    carouselContainer.appendChild(rightArrow);

    mediaItems.forEach(item => {
        const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://placehold.co/500x750?text=No+Image';
        const title = item.title || item.name;
        const type = item.type || item.media_type;
        const tmdbId = item.tmdb_id || item.id;

        const card = document.createElement('div');
        // Responsive width to match grid
        card.className = 'flex-shrink-0 w-32 sm:w-36 md:w-44 lg:w-48 movie-card relative rounded-lg shadow-lg overflow-hidden cursor-pointer group snap-start';
        // Removed fixed width/aspect-ratio inline styles to allow classes to work
        card.style.cssText = 'flex-shrink: 0;';
        card.dataset.tmdbId = tmdbId;
        card.dataset.type = type;

        // Apply Favorite Glow
        let favoritedBy = item.favorited_by || [];
        if (typeof favoritedBy === 'string') {
            try { favoritedBy = JSON.parse(favoritedBy); } catch { favoritedBy = []; }
        }

        const favoritedByJuainny = favoritedBy.includes('user1');
        const favoritedByErick = favoritedBy.includes('user2');

        if (favoritedByJuainny && favoritedByErick) {
            card.classList.add('rainbow-glow');
        } else if (favoritedByJuainny || favoritedByErick) {
            card.classList.add('favorite-glow');
        }

        card.innerHTML = `
            <img src="${posterUrl}" alt="${title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">
            <!-- Removed gradient overlay as per request -->
            
            <!-- Reactions Overlay -->
            <div class="absolute top-2 left-2 flex flex-col gap-1 z-10">
                ${item.juainny_reaction ? `
                    <div class="relative w-8 h-8 group/reaction cursor-pointer reaction-item" data-user="Juainny" data-reaction="${item.juainny_reaction}">
                        <img src="moods/${item.juainny_reaction}" class="w-full h-full object-contain drop-shadow-md">
                        <div class="absolute -bottom-1 -right-1 w-4 h-4">
                            ${getAvatarHTML('juainny', 'w-full h-full')}
                        </div>
                    </div>
                ` : ''}
                ${item.erick_reaction ? `
                    <div class="relative w-8 h-8 group/reaction cursor-pointer reaction-item" data-user="Erick" data-reaction="${item.erick_reaction}">
                        <img src="moods/${item.erick_reaction}" class="w-full h-full object-contain drop-shadow-md">
                        <div class="absolute -bottom-1 -right-1 w-4 h-4">
                            ${getAvatarHTML('erick', 'w-full h-full')}
                        </div>
                    </div>
                ` : ''}
            </div>

            <div class="absolute bottom-0 left-0 right-0 p-2">
                 <!-- Title removed -->
            </div>
            
            <div class="absolute bottom-2 left-2 flex flex-col gap-1 z-10 items-start pointer-events-none">
                <!-- Flairs Container -->
                 ${(mediaFlairsMap.get(item.id) || []).map(flair => renderFlairBadge(flair, 'text-[10px] px-1.5 py-0.5 shadow-md')).join('')}
            </div>
        `;

        // Add hover event listeners to reactions
        card.querySelectorAll('.reaction-item').forEach(reactionEl => {
            reactionEl.addEventListener('mouseenter', (e) => {
                showReactionTooltip(e.currentTarget);
            });
            reactionEl.addEventListener('mouseleave', () => {
                hideReactionTooltip();
            });
            // Add click for mobile (also prevents modal from opening)
            reactionEl.addEventListener('click', (e) => {
                toggleReactionTooltip(e.currentTarget, e);
            });
        });

        card.addEventListener('click', () => openMovieModal(tmdbId, type));
        scrollContainer.appendChild(card);
    });
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

    // Declare manageFlairsBtn at function scope to avoid redeclaration
    let manageFlairsBtn;

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';

    // Hide footer
    const footer = document.querySelector('footer');
    if (footer) footer.classList.add('hidden');

    // --- TV Progress ---
    const tvProgressSection = document.getElementById('tv-progress-section');
    const tvWarningSection = document.getElementById('tv-warning-section'); // New warning section

    // Helper to check if media is tracked
    const isTracked = (item) => {
        if (!item) return false;
        return item.watched || item.currently_watching || item.want_to_watch;
    };

    // Check if we have a tracked item in our preloaded data or allMedia
    const trackedItem = allMedia.find(i => i.tmdb_id == tmdbId);
    const isItemTracked = isTracked(trackedItem);
    console.log('OpenModal - TMDB ID:', tmdbId, 'Tracked Item:', trackedItem, 'Is Tracked:', isItemTracked); // DEBUG

    if (type === 'tv' || type === 'series') {
        tvProgressSection.classList.remove('hidden');

        // Create warning section if it doesn't exist
        if (!tvWarningSection) {
            const warningDiv = document.createElement('div');
            warningDiv.id = 'tv-warning-section';
            warningDiv.className = 'hidden text-center py-8 px-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 my-4';
            warningDiv.innerHTML = `
                <i class="fas fa-lock text-yellow-500 text-3xl mb-3"></i>
                <p class="text-text-primary font-semibold">Episode Guide Locked</p>
                <p class="text-text-muted text-sm mt-2">You can't see the episode carousel until you add this as "Watched", "Watching", or "Want to Watch".</p>
             `;
            // Insert after progress section
            tvProgressSection.parentNode.insertBefore(warningDiv, tvProgressSection.nextSibling);
        }

        if (isItemTracked) {
            // Show progress, hide warning
            tvProgressSection.classList.remove('hidden');
            const existingWarning = document.getElementById('tv-warning-section');
            if (existingWarning) existingWarning.classList.add('hidden');

            const endpoint = type === 'movie' ? 'movie' : 'tv';
            const appendToResponse = 'credits,images,videos,release_dates,external_ids';
            const tmdbUrl = `https://api.themoviedb.org/3/${endpoint}/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=${appendToResponse}`;
            const response = await fetch(tmdbUrl);
            const data = await response.json();
            await renderTVProgress(tmdbId, data.seasons);
        } else {
            // Hide progress, show warning
            tvProgressSection.classList.add('hidden');
            const existingWarning = document.getElementById('tv-warning-section');
            if (existingWarning) existingWarning.classList.remove('hidden');
        }
    } else {
        tvProgressSection.classList.add('hidden');
        const existingWarning = document.getElementById('tv-warning-section');
        if (existingWarning) existingWarning.classList.add('hidden');
    }

    // Store the tmdbId in the modal for later use
    modal.dataset.tmdbId = tmdbId;

    // --- Optimistic Render (Performance) ---
    // Try to find data in allMedia or currentMediaItem to render immediately
    const preloadedData = allMedia.find(i => i.tmdb_id == tmdbId) || (currentMediaItem && currentMediaItem.tmdb_id == tmdbId ? currentMediaItem : null);

    if (preloadedData) {
        document.getElementById('modal-overview').textContent = preloadedData.overview || 'Loading...';
        document.getElementById('modal-title').textContent = preloadedData.title || preloadedData.name || 'Loading...';
        const releaseDate = preloadedData.release_date || preloadedData.first_air_date || '';
        document.getElementById('modal-release-year').textContent = releaseDate.substring(0, 4);

        // Show modal immediately with available data
        modal.classList.remove('hidden');
        modal.classList.remove('modal-hidden');
        modal.classList.add('flex');
    }

    const endpoint = type === 'movie' ? 'movie' : 'tv';
    const appendToResponse = 'credits,images,videos,release_dates,external_ids,content_ratings'; // Added content_ratings explicitly
    const tmdbUrl = `https://api.themoviedb.org/3/${endpoint}/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=${appendToResponse}`;

    let data; // Declare data here to be accessible by the click handler
    try {
        const response = await fetch(tmdbUrl);
        if (!response.ok) throw new Error('Failed to fetch modal data.');

        data = await response.json();

        // Update currentMediaItem with fresh data (merging with existing if possible to keep DB fields)
        // But wait, data is from TMDB, it doesn't have our DB fields (reactions, etc.)
        // We should merge it carefully or just use it for display.
        // Actually, let's just use it for display and keep currentMediaItem as the DB source of truth if possible.
        // But we need to update the modal with the rich data.

        // --- Basic Info ---
        document.getElementById('modal-overview').textContent = data.overview;

        // --- Logo ---
        const titleElement = document.getElementById('modal-title');
        titleElement.innerHTML = ''; // Clear previous content
        const bestLogo = data.images?.logos?.find(logo => logo.iso_639_1 === 'en' && !logo.file_path.endsWith('.svg')) || data.images?.logos?.[0];

        if (bestLogo) {
            const logoUrl = `https://image.tmdb.org/t/p/w500${bestLogo.file_path}`;
            // Using inline style for max-width to ensure it applies
            titleElement.innerHTML = `<img src="${logoUrl}" alt="${data.title || data.name} Logo" class="max-h-20 object-contain" style="max-width: 14.4rem;">`;
        } else {
            titleElement.textContent = data.title || data.name;
        }

        const releaseDate = data.release_date || data.first_air_date || '';
        const releaseYear = preloadedData?.release_year || releaseDate.substring(0, 4);
        document.getElementById('modal-release-year').textContent = releaseYear;

        // Prefer DB runtime, fallback to TMDB
        let runtime = preloadedData?.runtime || data.runtime || (data.episode_run_time && data.episode_run_time.length > 0 ? data.episode_run_time[0] : 0);

        // Fallback for TV runtime if still 0
        if (type === 'tv' && !runtime) {
            if (data.last_episode_to_air && data.last_episode_to_air.runtime) {
                runtime = data.last_episode_to_air.runtime;
            } else if (data.next_episode_to_air && data.next_episode_to_air.runtime) {
                runtime = data.next_episode_to_air.runtime;
            }
        }

        document.getElementById('modal-runtime').textContent = formatRuntime(runtime);

        // --- End Time Calculator ---
        updateEndTime(runtime);


        // --- Content Rating ---
        // Prefer DB content_rating, fallback to TMDB
        let contentRating = preloadedData?.content_rating || 'N/A';

        if (contentRating === 'N/A') {
            if (type === 'movie' && data.release_dates) {
                const usRelease = data.release_dates.results.find(r => r.iso_3166_1 === 'US');
                if (usRelease) {
                    const rating = usRelease.release_dates.find(rd => rd.certification !== '');
                    if (rating) contentRating = rating.certification;
                }
            } else if (type === 'tv') {
                // Check content_ratings from append_to_response
                if (data.content_ratings && data.content_ratings.results) {
                    const usRating = data.content_ratings.results.find(r => r.iso_3166_1 === 'US');
                    if (usRating) {
                        contentRating = usRating.rating;
                    } else if (data.content_ratings.results.length > 0) {
                        contentRating = data.content_ratings.results[0].rating;
                    }
                }
            }
        }

        document.getElementById('modal-content-rating').textContent = contentRating;

        // --- Title Tooltip ---
        const tooltipIcon = document.getElementById('title-tooltip');
        if (tooltipIcon) {
            // Use DB title if available, otherwise API title
            const displayTitle = preloadedData?.title || preloadedData?.name || data.title || data.name;
            tooltipIcon.setAttribute('title', displayTitle);

            // Also ensure the tooltip works with the browser's native behavior by setting title on the icon itself
            // But user asked for "classic hover browser box", which is the 'title' attribute.
        }

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

        // --- Auto-Save Missing Metadata (Runtime, Year, Rating) ---
        // Only if we have a tracked item in the DB
        if (isItemTracked && trackedItem && trackedItem.id) {
            const updates = {};

            // --- Willow's Thoughts (AI Summary) ---
            const summarySection = document.getElementById('willow-summary-section');
            const summaryText = document.getElementById('willow-summary-text');
            const regenerateBtn = document.getElementById('regenerate-summary-btn');

            // Show section if tracked
            summarySection.classList.remove('hidden');

            // Check if we already have a cached summary
            if (trackedItem.ai_summary) {
                summaryText.innerHTML = renderMarkdown(trackedItem.ai_summary);
            } else {
                // No cached summary, generate and save
                const generateAndCache = async () => {
                    summaryText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Willow is thinking...';

                    const user1Rating = document.querySelector('#juainny-rating-container .stars')?.dataset.rating || trackedItem.user1_rating;
                    const user1Notes = document.getElementById('juainny-notes').innerText;
                    const user2Rating = document.querySelector('#erick-rating-container .stars')?.dataset.rating || trackedItem.user2_rating;
                    const user2Notes = document.getElementById('erick-notes').innerText;

                    const ratings = { user1: user1Rating, user2: user2Rating };
                    const notes = { user1: user1Notes, user2: user2Notes };

                    const summary = await generateMediaSummary(trackedItem, ratings, notes);
                    summaryText.innerHTML = renderMarkdown(summary);

                    // Save to database
                    await supabase.from('media').update({ ai_summary: summary }).eq('tmdb_id', tmdbId);
                    trackedItem.ai_summary = summary; // Update local copy
                };
                generateAndCache();
            }

            // Regenerate button - creates new summary and saves it
            regenerateBtn.onclick = async () => {
                summaryText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Willow is thinking...';

                const user1Rating = document.querySelector('#juainny-rating-container .stars')?.dataset.rating || trackedItem.user1_rating;
                const user1Notes = document.getElementById('juainny-notes').innerText;
                const user2Rating = document.querySelector('#erick-rating-container .stars')?.dataset.rating || trackedItem.user2_rating;
                const user2Notes = document.getElementById('erick-notes').innerText;

                const ratings = { user1: user1Rating, user2: user2Rating };
                const notes = { user1: user1Notes, user2: user2Notes };

                const summary = await generateMediaSummary(trackedItem, ratings, notes);
                summaryText.innerHTML = renderMarkdown(summary);

                // Save new summary to database
                await supabase.from('media').update({ ai_summary: summary }).eq('tmdb_id', tmdbId);
                trackedItem.ai_summary = summary; // Update local copy
            };

        } else {
            document.getElementById('willow-summary-section').classList.add('hidden');
        }

        // --- Auto-Save Missing Metadata (Runtime, Year, Rating) ---
        // Only if we have a tracked item in the DB
        if (isItemTracked && trackedItem && trackedItem.id) {
            const updates = {};
            if (!trackedItem.release_year && releaseYear) updates.release_year = parseInt(releaseYear);
            if (!trackedItem.runtime && runtime) updates.runtime = runtime;
            if ((!trackedItem.content_rating || trackedItem.content_rating === 'N/A') && contentRating !== 'N/A') updates.content_rating = contentRating;
            if (!trackedItem.imdb_id && imdbId) updates.imdb_id = imdbId;

            if (Object.keys(updates).length > 0) {
                supabase
                    .from('media')
                    .update(updates)
                    .eq('tmdb_id', tmdbId)
                    .then(({ error }) => {
                        if (error) console.error('Error auto-saving metadata:', error);
                    });
            }
        }


        // --- Backdrop Image ---
        const backdropUrl = data.backdrop_path ? `https://image.tmdb.org/t/p/w780${data.backdrop_path}` : 'https://placehold.co/800x400?text=No+Image';
        document.getElementById('modal-backdrop-image').src = backdropUrl;

        // --- Fetch and Display User Ratings & Notes ---
        const { data: mediaItem, error } = await supabase
            .from('media')
            .select('*')
            .eq('tmdb_id', tmdbId)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') { // PGRST116 = 'Not a single row was found'
            console.error('Error fetching media item for ratings:', error);
        }

        currentMediaItem = mediaItem || {
            tmdb_id: tmdbId,
            type: type,
            title: data.title || data.name,
            poster_path: data.poster_path,
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

        // --- Update Avatars in Ratings Section ---
        const updateRatingAvatar = (user, elementId) => {
            const el = document.getElementById(elementId);
            if (el) {
                const newHTML = getAvatarHTML(user, 'w-10 h-10 mr-3');
                // We need to preserve the ID
                const temp = document.createElement('div');
                temp.innerHTML = newHTML;
                const newEl = temp.firstElementChild;
                newEl.id = elementId;
                el.replaceWith(newEl);
            }
        };
        updateRatingAvatar('juainny', 'juainny-avatar');
        updateRatingAvatar('erick', 'erick-avatar');

        // --- Favorites ---
        updateFavoriteGlow(currentMediaItem);

        // --- Watched Status ---
        updateWatchedButtonUI(currentMediaItem);

        // --- Rich Text Toolbar for Notes ---
        const setupNotesToolbar = (userId, notesId) => {
            const notesInput = document.getElementById(notesId);
            if (!notesInput) return;

            // Remove existing toolbar if any
            const existingToolbar = notesInput.previousElementSibling;
            if (existingToolbar && existingToolbar.classList.contains('notes-toolbar')) {
                existingToolbar.remove();
            }

            const toolbar = document.createElement('div');
            toolbar.className = 'flex gap-2 mb-2 notes-toolbar';
            toolbar.innerHTML = `
                <button type="button" data-format="bold" class="p-2 hover:bg-gray-700 rounded text-white" style="font-weight: bold;">B</button>
                <button type="button" data-format="italic" class="p-2 hover:bg-gray-700 rounded text-white" style="font-style: italic;">I</button>
                <button type="button" data-format="underline" class="p-2 hover:bg-gray-700 rounded text-white" style="text-decoration: underline;">U</button>
            `;

            notesInput.parentNode.insertBefore(toolbar, notesInput);

            toolbar.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const format = btn.dataset.format;

                    // Use document.execCommand for contenteditable
                    if (format === 'bold') document.execCommand('bold', false, null);
                    if (format === 'italic') document.execCommand('italic', false, null);
                    if (format === 'underline') document.execCommand('underline', false, null);

                    notesInput.focus();
                });
            });

            // Load existing notes as HTML
            const existingNotes = currentMediaItem?.[`${userId}_notes`] || '';
            notesInput.innerHTML = existingNotes;
        };

        setupNotesToolbar('juainny', 'juainny-notes');
        setupNotesToolbar('erick', 'erick-notes');

        // Show the notes section
        document.getElementById('notes-section').classList.remove('hidden');

        // --- Update Supabase with backdrop path ---
        if (mediaItem && data.backdrop_path && mediaItem.backdrop_path !== data.backdrop_path) {
            const { error: updateError } = await supabase
                .from('media')
                .update({ backdrop_path: data.backdrop_path })
                .eq('tmdb_id', tmdbId);
            if (updateError) console.error('Error updating backdrop path:', updateError);
        }

        // --- Reactions Setup ---
        updateModalReactionDisplay();

        const addMoodBtn = document.getElementById('add-mood-btn');
        if (addMoodBtn) {
            addMoodBtn.onclick = (e) => {
                e.preventDefault();
                openReactionSelector(tmdbId);
            };
        }

        // --- Render Flairs in Modal ---
        const modalFlairsContainer = document.getElementById('modal-flairs-container');
        if (modalFlairsContainer) {
            const assignedFlairs = (mediaItem && mediaFlairsMap.get(mediaItem.id)) || [];
            modalFlairsContainer.innerHTML = assignedFlairs.map(flair => renderFlairBadge(flair, 'text-xs px-2 py-1')).join('');
        }

        // --- Manage Flairs Button ---
        manageFlairsBtn = document.getElementById('manage-flairs-btn');
        if (manageFlairsBtn) {
            // Hide flair button if item is not tracked (not watched, want_to_watch, or currently_watching)
            if (isItemTracked) {
                manageFlairsBtn.classList.remove('hidden');
                manageFlairsBtn.onclick = async (e) => {
                    e.preventDefault();
                    // Ensure media exists first
                    const mediaItem = await ensureMediaItemExists(tmdbId, type, data.title || data.name, data.poster_path);
                    if (mediaItem) {
                        openFlairModal(mediaItem.id);
                    }
                };
            } else {
                manageFlairsBtn.classList.add('hidden');
            }
        }

        // --- Marvel Marathon Logic ---
        const marvelFlairId = '45991eb5-21e1-40ee-8bde-5beee11a7dff';
        const assignedFlairs = (mediaItem && mediaFlairsMap.get(mediaItem.id)) || [];
        const isMarvelMovie = assignedFlairs.some(f => f.id === marvelFlairId || f.name === 'MCU');

        const marvelDisplay = document.getElementById('marvel-marathon-display');
        const normalContent = document.getElementById('normal-modal-content');
        const moodControls = document.getElementById('mood-controls');

        if (isMarvelMovie) {
            if (marvelDisplay) marvelDisplay.classList.remove('hidden');
            if (marvelDisplay) marvelDisplay.classList.add('flex');
            if (normalContent) normalContent.classList.add('hidden');
            if (moodControls) moodControls.classList.add('hidden');
        } else {
            if (marvelDisplay) marvelDisplay.classList.add('hidden');
            if (marvelDisplay) marvelDisplay.classList.remove('flex');
            if (normalContent) normalContent.classList.remove('hidden');
            if (moodControls) moodControls.classList.remove('hidden');
        }

        // --- Show Modal ---
        modal.classList.remove('hidden');
        modal.classList.remove('modal-hidden');
        modal.classList.add('flex');

        // --- Scroll Detection for Sticky Header Fade Animation ---
        const modalScrollableContent = document.getElementById('movie-modal-scrollable-content');
        // manageFlairsBtn already declared at function scope

        if (modalScrollableContent && manageFlairsBtn) {
            const handleScroll = () => {
                if (modalScrollableContent.scrollTop > 20) {
                    // Scrolled down - fade out manage flairs button
                    manageFlairsBtn.style.opacity = '0';
                    manageFlairsBtn.style.pointerEvents = 'none';
                } else {
                    // At top - fade in manage flairs button
                    manageFlairsBtn.style.opacity = '1';
                    manageFlairsBtn.style.pointerEvents = 'auto';
                }
            };

            // Remove any existing scroll listener first
            modalScrollableContent.removeEventListener('scroll', handleScroll);
            // Add scroll listener
            modalScrollableContent.addEventListener('scroll', handleScroll);
        }

        // --- Triple Click Stats Update ---
        const statsPill = document.getElementById('modal-stats-pill');
        if (statsPill) {
            let clickCount = 0;
            let clickTimer = null;

            statsPill.onclick = async () => {
                clickCount++;
                if (clickCount === 1) {
                    clickTimer = setTimeout(() => {
                        clickCount = 0;
                    }, 500); // Reset after 500ms
                } else if (clickCount === 3) {
                    clearTimeout(clickTimer);
                    clickCount = 0;

                    // Trigger Update
                    // Use the data object from the modal scope which contains the fresh API response

                    // 1. Runtime Calculation
                    let runtimeMinutes = data.runtime || (data.episode_run_time && data.episode_run_time.length > 0 ? data.episode_run_time[0] : 0);
                    if (type === 'tv' && !runtimeMinutes) {
                        if (data.last_episode_to_air && data.last_episode_to_air.runtime) {
                            runtimeMinutes = data.last_episode_to_air.runtime;
                        } else if (data.next_episode_to_air && data.next_episode_to_air.runtime) {
                            runtimeMinutes = data.next_episode_to_air.runtime;
                        }
                    }

                    // 2. Year Calculation
                    const releaseDateStr = data.release_date || data.first_air_date || '';
                    const releaseYear = releaseDateStr ? parseInt(releaseDateStr.split('-')[0]) : null;

                    // 3. Content Rating Calculation
                    let contentRating = 'N/A';
                    if (type === 'movie' && data.release_dates) {
                        const usRelease = data.release_dates.results.find(r => r.iso_3166_1 === 'US');
                        if (usRelease) {
                            const rating = usRelease.release_dates.find(rd => rd.certification !== '');
                            if (rating) contentRating = rating.certification;
                        }
                    } else if (type === 'tv') {
                        if (data.content_ratings && data.content_ratings.results) {
                            const usRating = data.content_ratings.results.find(r => r.iso_3166_1 === 'US');
                            if (usRating) {
                                contentRating = usRating.rating;
                            } else if (data.content_ratings.results.length > 0) {
                                contentRating = data.content_ratings.results[0].rating;
                            }
                        }
                    }

                    if (confirm(`Update database with:\nYear: ${releaseYear}\nRuntime: ${runtimeMinutes}m\nRating: ${contentRating}`)) {
                        const { error } = await supabase
                            .from('media')
                            .update({
                                release_year: releaseYear,
                                runtime: runtimeMinutes,
                                content_rating: contentRating
                            })
                            .eq('tmdb_id', tmdbId);

                        if (error) {
                            alert('Failed to update stats.');
                            console.error(error);
                        } else {
                            alert('Updated database with runtime, year date, and rating.');
                        }
                    }
                }
            };
        }

    } catch (error) {
        console.error('Error opening movie modal:', error);
    }
}

// --- FLAIR MANAGEMENT ---

async function openFlairModal(mediaId) {
    const modal = document.getElementById('flair-modal');
    const closeBtn = document.getElementById('close-flair-modal-btn');
    const currentList = document.getElementById('current-flairs-list');
    const availableList = document.getElementById('available-flairs-list');
    const toggleCreateBtn = document.getElementById('toggle-create-flair-btn');
    const createForm = document.getElementById('create-flair-form');
    const saveNewBtn = document.getElementById('save-new-flair-btn');

    if (!modal) return;

    // Reset UI
    createForm.classList.add('hidden');

    const deleteBtn = document.getElementById('delete-flair-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-flair-btn');
    const formTitle = document.getElementById('flair-form-title');
    const editIdInput = document.getElementById('edit-flair-id');
    const nameInput = document.getElementById('new-flair-name');
    const colorInput = document.getElementById('new-flair-color');
    const iconInput = document.getElementById('new-flair-icon');

    // Reset form state
    const resetForm = () => {
        createForm.classList.add('hidden');
        editIdInput.value = '';
        nameInput.value = '';
        colorInput.value = '#ef4444';
        iconInput.value = '';
        formTitle.textContent = 'NEW FLAIR';
        saveNewBtn.textContent = 'Create Flair';
        deleteBtn.classList.add('hidden');
        cancelEditBtn.classList.add('hidden');
    };

    const renderLists = () => {
        // Current Flairs
        currentList.innerHTML = '';
        const assignedFlairs = mediaFlairsMap.get(mediaId) || [];

        assignedFlairs.forEach(flair => {
            const badge = document.createElement('div');
            badge.className = 'relative group cursor-pointer';
            badge.innerHTML = renderFlairBadge(flair, 'text-sm px-3 py-1');

            // Remove overlay
            const removeOverlay = document.createElement('div');
            removeOverlay.className = 'absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs';
            removeOverlay.innerHTML = '<i class="fas fa-times"></i>';
            removeOverlay.onclick = async (e) => {
                e.stopPropagation();
                await removeFlairFromMedia(mediaId, flair.id);
                // Update local state
                const updated = mediaFlairsMap.get(mediaId).filter(f => f.id !== flair.id);
                mediaFlairsMap.set(mediaId, updated);
                renderLists();
                renderContent(); // Update grid

                // Update modal flairs display if open
                const modalFlairsContainer = document.getElementById('modal-flairs-container');
                if (modalFlairsContainer) {
                    modalFlairsContainer.innerHTML = updated.map(f => renderFlairBadge(f, 'text-xs px-2 py-1')).join('');
                }
            };
            badge.appendChild(removeOverlay);
            currentList.appendChild(badge);
        });

        // Available Flairs
        availableList.innerHTML = '';
        allFlairs.forEach(flair => {
            // Skip if already assigned
            if (assignedFlairs.find(f => f.id === flair.id)) return;

            const container = document.createElement('div');
            container.className = 'flex items-center gap-2 group';

            const badge = document.createElement('div');
            badge.className = 'cursor-pointer hover:opacity-80';
            badge.innerHTML = renderFlairBadge(flair, 'text-sm px-3 py-1');

            badge.onclick = async () => {
                if (assignedFlairs.length >= 2) {
                    alert('Max 2 flairs per item!');
                    return;
                }
                const result = await assignFlairToMedia(mediaId, flair.id);
                if (result.success) {
                    if (!mediaFlairsMap.has(mediaId)) mediaFlairsMap.set(mediaId, []);
                    mediaFlairsMap.get(mediaId).push(flair);
                    renderLists();
                    renderContent(); // Update grid

                    // Update modal flairs display if open
                    const modalFlairsContainer = document.getElementById('modal-flairs-container');
                    if (modalFlairsContainer) {
                        const current = mediaFlairsMap.get(mediaId);
                        modalFlairsContainer.innerHTML = current.map(f => renderFlairBadge(f, 'text-xs px-2 py-1')).join('');
                    }
                } else {
                    alert(result.message);
                }
            };

            // Edit Button
            const editBtn = document.createElement('button');
            editBtn.className = 'text-xs text-text-muted hover:text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity';
            editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
            editBtn.onclick = (e) => {
                e.stopPropagation();
                // Populate form
                editIdInput.value = flair.id;
                nameInput.value = flair.name;
                colorInput.value = flair.color;
                iconInput.value = flair.icon || '';

                formTitle.textContent = 'EDIT FLAIR';
                saveNewBtn.textContent = 'Update Flair';
                deleteBtn.classList.remove('hidden');
                cancelEditBtn.classList.remove('hidden');
                createForm.classList.remove('hidden');
            };

            container.appendChild(badge);
            container.appendChild(editBtn);
            availableList.appendChild(container);
        });
    };

    renderLists();

    // Event Listeners
    closeBtn.onclick = () => {
        modal.classList.add('hidden');
        modal.classList.add('modal-hidden');
        resetForm();
    };

    // Close on click outside
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            modal.classList.add('modal-hidden');
            resetForm();
        }
    };

    toggleCreateBtn.onclick = () => {
        if (!createForm.classList.contains('hidden') && !editIdInput.value) {
            createForm.classList.add('hidden');
        } else {
            resetForm(); // Ensure clean state
            createForm.classList.remove('hidden');
        }
    };

    cancelEditBtn.onclick = () => {
        resetForm();
    };

    deleteBtn.onclick = async () => {
        const id = editIdInput.value;
        if (!id) return;
        if (confirm('Are you sure you want to delete this flair? This will remove it from all media items.')) {
            const success = await deleteFlair(id);
            if (success) {
                allFlairs = allFlairs.filter(f => f.id !== id);
                // Also remove from all media maps
                for (let [mid, flairs] of mediaFlairsMap) {
                    mediaFlairsMap.set(mid, flairs.filter(f => f.id !== id));
                }
                resetForm();
                renderLists();
                renderContent();
            } else {
                alert('Failed to delete flair.');
            }
        }
    };

    saveNewBtn.onclick = async () => {
        const name = nameInput.value.trim();
        const color = colorInput.value;
        const icon = iconInput.value.trim();
        const editId = editIdInput.value;

        if (!name) {
            alert('Name is required');
            return;
        }

        if (editId) {
            // Update existing
            const updated = await updateFlair(editId, { name, color, icon });
            if (updated) {
                // Update local state
                const index = allFlairs.findIndex(f => f.id === editId);
                if (index !== -1) allFlairs[index] = updated;

                // Update maps - Update this flair in all media items that have it
                for (let [mid, flairs] of mediaFlairsMap) {
                    const fIndex = flairs.findIndex(f => f.id === editId);
                    if (fIndex !== -1) {
                        flairs[fIndex] = updated;
                    }
                }

                resetForm();
                renderLists();

                // Refresh UI
                renderContent();
                const [cw, ww] = await Promise.all([getCurrentlyWatchingMedia(), getWantToWatchMedia()]);
                renderCarousel('currently-watching-carousel', cw);
                renderCarousel('want-to-watch-carousel', ww);

                // Update modal if open
                const modalFlairsContainer = document.getElementById('modal-flairs-container');
                if (modalFlairsContainer) {
                    const current = mediaFlairsMap.get(mediaId) || [];
                    modalFlairsContainer.innerHTML = current.map(f => renderFlairBadge(f, 'text-xs px-2 py-1')).join('');
                }
            } else {
                alert('Failed to update flair.');
            }
        } else {
            // Create new
            const newFlair = await createFlair({ name, color, icon });
            if (newFlair) {
                allFlairs.push(newFlair);
                resetForm();
                renderLists();

                // Refresh UI (though creating a flair doesn't assign it yet, so maybe not strictly needed here, but good for consistency if we add auto-assign later)
                // Actually, this is just creating a flair definition. Assigning is done via checkboxes in renderLists -> toggleFlair.
                // So we need to check where assignment happens.
            } else {
                alert('Failed to create flair.');
            }
        }
    };

    modal.classList.remove('hidden');
    modal.classList.remove('modal-hidden');
    modal.classList.add('flex');
}

/**
 * Sets up the event listener for the modal's close button.
 */
function setupModalCloseButton() {
    const closeBtn = document.getElementById('close-modal-btn');
    const modal = document.getElementById('movie-modal');

    const closeModal = () => {
        modal.classList.add('hidden');
        modal.classList.add('modal-hidden');
        modal.classList.remove('flex');
        // Restore background scrolling
        document.body.style.overflow = '';

        // Show footer
        const footer = document.querySelector('footer');
        if (footer) footer.classList.remove('hidden');

        // Stop the Iron Man walker if it's walking
        const walker = document.getElementById('iron-man-walker');
        if (walker) {
            walker.classList.remove('walk');
            walker.classList.add('hidden');
        }
    };

    if (closeBtn) {
        closeBtn.onclick = closeModal;
    }

    // Close on click outside
    if (modal) {
        modal.onclick = (event) => {
            if (event.target === modal) {
                closeModal();
            }
        };
    }
}

function formatRuntime(minutes) {
    if (!minutes || minutes === 0) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    let result = '';
    if (hours > 0) {
        result += `${hours}h `;
    }
    if (remainingMinutes > 0) {
        result += `${remainingMinutes}m`;
    }
    return result.trim();
}

function updateEndTime(runtime) {
    const startTimeHourEl = document.getElementById('start-time-hour');
    const startTimeMinuteEl = document.getElementById('start-time-minute');
    const endTimeEl = document.getElementById('end-time');
    const endTimeCalculatorEl = document.getElementById('end-time-calculator');

    if (!runtime || runtime === 0) {
        endTimeCalculatorEl.classList.add('hidden');
        return;
    }
    endTimeCalculatorEl.classList.remove('hidden');


    let now = new Date();
    let startHour = now.getHours();
    let startMinute = now.getMinutes();

    const calculateAndDisplayEndTime = () => {
        const endDate = new Date();
        endDate.setHours(startHour, startMinute, 0, 0);
        endDate.setMinutes(endDate.getMinutes() + runtime);
        const endHour = endDate.getHours().toString().padStart(2, '0');
        const endMinute = endDate.getMinutes().toString().padStart(2, '0');
        endTimeEl.textContent = `${endHour}:${endMinute}`;
        startTimeHourEl.textContent = startHour.toString().padStart(2, '0');
        startTimeMinuteEl.textContent = startMinute.toString().padStart(2, '0');
    };

    startTimeHourEl.onclick = () => {
        startHour = (startHour + 1) % 24;
        calculateAndDisplayEndTime();
    };
    startTimeMinuteEl.onclick = () => {
        startMinute = (startMinute + 1) % 60;
        calculateAndDisplayEndTime();
    };

    calculateAndDisplayEndTime();
}

let currentEpisodeProgress = [];
let currentSeasons = [];
let currentSeasonNumber = 1;
let isEditMode = false;
let currentTmdbId = null; // For TMDB API calls
let currentInternalMediaId = null; // For database calls

async function renderTVProgress(tmdbId, seasons) {
    const container = document.getElementById('tv-progress-container');
    container.innerHTML = '<div class="text-center">Loading progress...</div>';
    currentSeasons = seasons.filter(s => s.season_number > 0 && s.episode_count > 0);
    currentTmdbId = tmdbId; // Store for later use

    try {
        // First, get the internal media.id from the media table
        const { data: mediaData, error: mediaError } = await supabase
            .from('media')
            .select('id')
            .eq('tmdb_id', tmdbId)
            .single();

        if (mediaError) {
            // Plan 2: Media not in database yet - Fetch from TMDB and save it!
            console.log('Media not in DB. Executing Plan 2: Fetch and Save.');

            try {
                // Fetch details from TMDB to get necessary info for DB
                const tmdbResponse = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=content_ratings`);
                if (!tmdbResponse.ok) throw new Error('Failed to fetch TV details from TMDB');
                const tmdbData = await tmdbResponse.json();

                const releaseYear = tmdbData.first_air_date ? parseInt(tmdbData.first_air_date.split('-')[0]) : null;

                let contentRating = 'N/A';
                if (tmdbData.content_ratings && tmdbData.content_ratings.results) {
                    const usRating = tmdbData.content_ratings.results.find(r => r.iso_3166_1 === 'US');
                    if (usRating) contentRating = usRating.rating;
                    else if (tmdbData.content_ratings.results.length > 0) contentRating = tmdbData.content_ratings.results[0].rating;
                }

                // Insert into Supabase
                const { data: newItem, error: insertError } = await supabase
                    .from('media')
                    .insert({
                        tmdb_id: tmdbId,
                        type: 'series',
                        title: tmdbData.name,
                        poster_path: tmdbData.poster_path,
                        backdrop_path: tmdbData.backdrop_path,
                        release_year: releaseYear,
                        source: 'fetched', // Mark as fetched so it doesn't clutter main view if filtered
                        runtime: tmdbData.episode_run_time?.[0] || 0,
                        content_rating: contentRating
                    })
                    .select('id')
                    .single();

                if (insertError) throw insertError;

                currentInternalMediaId = newItem.id;
                console.log('Plan 2 Successful: Media saved to DB with ID:', currentInternalMediaId);

            } catch (err) {
                console.error('Plan 2 Failed:', err);
                container.innerHTML = `
                    <div class="text-center py-8 px-4">
                        <i class="fas fa-exclamation-circle text-danger text-3xl mb-3"></i>
                        <p class="text-text-muted">Failed to sync TV show data.</p>
                        <p class="text-text-muted text-sm mt-2">Please try adding it to your watchlist manually first.</p>
                    </div>
                `;
                return;
            }
        } else {
            currentInternalMediaId = mediaData.id; // Store for later use
        }

        // Query for each viewer separately and merge results
        const [juainnyResponse, erickResponse] = await Promise.all([
            supabase
                .from('episode_progress')
                .select('*')
                .eq('media_id', currentInternalMediaId)
                .eq('viewer', 'user1'),
            supabase
                .from('episode_progress')
                .select('*')
                .eq('media_id', currentInternalMediaId)
                .eq('viewer', 'user2')
        ]);

        if (juainnyResponse.error) throw juainnyResponse.error;
        if (erickResponse.error) throw erickResponse.error;

        currentEpisodeProgress = [
            ...(juainnyResponse.data || []),
            ...(erickResponse.data || [])
        ];

        // Initial Render of Structure
        container.innerHTML = `
            <div class="flex justify-between items-center sticky top-0 z-40 bg-bg-tertiary/95 backdrop-blur-md py-3 px-4 border-b border-white/5 mb-4 rounded-t-lg">
                <div class="relative group">
                    <select id="season-select" class="appearance-none bg-black/20 hover:bg-black/40 text-text-primary py-2 pl-4 pr-10 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-accent-primary cursor-pointer transition-all border border-white/10">
                        ${currentSeasons.map(s => `<option value="${s.season_number}">Season ${s.season_number}</option>`).join('')}
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted group-hover:text-text-primary transition-colors">
                        <i class="fas fa-chevron-down text-xs"></i>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                     <button id="mark-season-watched-btn" class="text-xs py-2 px-4 rounded-full bg-accent-secondary/20 text-accent-secondary hover:bg-accent-secondary hover:text-white border border-accent-secondary/50 transition font-semibold flex items-center gap-2">
                        <i class="fas fa-check"></i> Season Watched
                    </button>
                    <button id="edit-episodes-btn" class="text-text-muted hover:text-text-primary transition p-2 rounded-full hover:bg-white/10" title="Edit Watched Status">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                </div>
            </div>

            <div id="episodes-carousel-wrapper" class="relative pb-4" style="overflow: hidden;">
                <!-- Episodes carousel will be loaded here -->
                <div class="text-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary mx-auto"></div></div>
            </div>
        `;

        // Setup Season Select Listener
        document.getElementById('season-select').addEventListener('change', (e) => {
            currentSeasonNumber = parseInt(e.target.value);
            renderSeasonEpisodes(currentSeasonNumber);
        });

        // Setup Mark Season Watched Listener
        document.getElementById('mark-season-watched-btn').addEventListener('click', () => handleMarkSeasonWatched());

        // Setup Edit Mode Listener
        document.getElementById('edit-episodes-btn').addEventListener('click', toggleEpisodesEditMode);

        // Initial Load
        // Initial Load
        if (currentSeasons.length > 0) {
            // Default to first season
            let targetSeason = currentSeasons[0].season_number;

            // Check activity log for last watched episode to determine "last edited" season
            const { data: lastActivity } = await supabase
                .from('activity_log')
                .select('details')
                .eq('media_id', currentInternalMediaId)
                .eq('action_type', 'watched_episode')
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (lastActivity && lastActivity.details && lastActivity.details.season) {
                const lastSeason = lastActivity.details.season;
                // Verify this season exists in currentSeasons
                if (currentSeasons.some(s => s.season_number === lastSeason)) {
                    targetSeason = lastSeason;
                }
            }

            currentSeasonNumber = targetSeason;

            // Update select dropdown to match
            const seasonSelect = document.getElementById('season-select');
            if (seasonSelect) seasonSelect.value = currentSeasonNumber;

            await renderSeasonEpisodes(currentSeasonNumber);
        } else {
            container.innerHTML = '<div class="text-center">No seasons found.</div>';
        }

    } catch (error) {
        console.error('Error rendering TV progress:', error);
        container.innerHTML = '<div class="text-center text-danger">Failed to load progress.</div>';
    }
}

async function renderSeasonEpisodes(seasonNumber) {
    const wrapper = document.getElementById('episodes-carousel-wrapper');
    if (!wrapper) return;

    // Show loading spinner
    wrapper.innerHTML = '<div class="text-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary mx-auto"></div></div>';

    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${currentTmdbId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch season details');
        const seasonDetails = await response.json();

        if (!seasonDetails || !seasonDetails.episodes) {
            wrapper.innerHTML = '<div class="text-center">No episodes found.</div>';
            return;
        }

        // Create carousel structure - properly constrained to prevent page-wide scrolling
        wrapper.innerHTML = `
            <div class="episodes-carousel-container relative px-2 sm:px-12" style="position: relative;">
                <button class="episodes-nav-btn episodes-nav-left absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 sm:p-3 rounded-full transition-all shadow-lg hidden sm:block" style="position: absolute;">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div id="episodes-carousel" class="flex overflow-x-auto gap-3 sm:gap-4 pb-4 px-1 sm:px-2 scroll-smooth snap-x snap-mandatory" style="touch-action: pan-x; overscroll-behavior-x: contain; overscroll-behavior-y: none;">
                    <!-- Episodes will be inserted here -->
                </div>
                <button class="episodes-nav-btn episodes-nav-right absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 sm:p-3 rounded-full transition-all shadow-lg hidden sm:block" style="position: absolute;">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;

        const carousel = document.getElementById('episodes-carousel');

        // Prevent scrolling from affecting parent modal
        carousel.addEventListener('wheel', (e) => {
            const isScrollingVertically = Math.abs(e.deltaY) > Math.abs(e.deltaX);

            if (isScrollingVertically) {
                // Convert vertical scroll to horizontal scroll
                const scrollAmount = e.deltaY;
                carousel.scrollLeft += scrollAmount;
                e.preventDefault();
                e.stopPropagation();
            } else {
                // Allow horizontal scroll but prevent it from bubbling to parent
                e.stopPropagation();
            }
        }, { passive: false });

        seasonDetails.episodes.forEach(episode => {
            // Check if BOTH users have watched this episode
            const juainnyWatched = currentEpisodeProgress.some(ep =>
                ep.season_number === seasonNumber &&
                ep.episode_number === episode.episode_number &&
                ep.viewer === 'user1' &&
                ep.watched
            );
            const erickWatched = currentEpisodeProgress.some(ep =>
                ep.season_number === seasonNumber &&
                ep.episode_number === episode.episode_number &&
                ep.viewer === 'user2' &&
                ep.watched
            );
            const isWatched = juainnyWatched && erickWatched;
            const stillUrl = episode.still_path ? `https://image.tmdb.org/t/p/w500${episode.still_path}` : 'https://placehold.co/500x281?text=No+Image';

            const card = document.createElement('div');
            card.className = `episode-card flex-shrink-0 w-[calc(100vw-4rem)] sm:w-72 md:w-80 relative rounded-lg overflow-hidden shadow-md bg-bg-primary cursor-pointer snap-start ${isWatched && isEditMode ? 'shake' : ''}`;
            card.style.maxWidth = '400px'; // Cap maximum width
            card.dataset.episodeNumber = episode.episode_number;
            card.dataset.seasonNumber = seasonNumber;

            card.innerHTML = `
                <div class="relative aspect-video">
                    <img src="${stillUrl}" alt="${episode.name}" class="w-full h-full object-cover transition-opacity duration-300 ${isWatched ? 'opacity-50' : 'opacity-100'}">
                    <div class="absolute top-0 left-0 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded-br-lg z-20">
                        E${episode.episode_number}
                    </div>
                    ${isWatched ? `
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <i class="fas fa-check text-success text-4xl drop-shadow-lg"></i>
                        </div>
                    ` : ''}
                    <button class="unwatch-btn absolute top-2 right-2 bg-danger text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-700 transition z-30 ${isWatched && isEditMode ? '' : 'hidden'}">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>
                <div class="p-3">
                    <h4 class="font-semibold text-sm truncate" title="${episode.name}">${episode.name}</h4>
                    <p class="text-xs text-text-muted line-clamp-2 mt-1">${episode.overview || 'No description available.'}</p>
                </div>
            `;

            // Click listener for the card to toggle watch (only if NOT in edit mode)
            card.addEventListener('click', (e) => {
                if (e.target.closest('.unwatch-btn')) return;
                if (isEditMode) return;
                if (!isWatched) {
                    toggleEpisodeWatched(seasonNumber, episode.episode_number, true);
                }
            });

            // Click listener for unwatch button
            const unwatchBtn = card.querySelector('.unwatch-btn');
            unwatchBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleEpisodeWatched(seasonNumber, episode.episode_number, false);
            });

            carousel.appendChild(card);
        });

        // Setup carousel navigation
        const leftBtn = wrapper.querySelector('.episodes-nav-left');
        const rightBtn = wrapper.querySelector('.episodes-nav-right');

        leftBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -carousel.clientWidth, behavior: 'smooth' });
        });

        rightBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: carousel.clientWidth, behavior: 'smooth' });
        });

        updateSeasonWatchedButtonState(seasonDetails.episodes.length);

    } catch (error) {
        console.error('Error rendering season episodes:', error);
        wrapper.innerHTML = '<div class="text-center text-danger">Failed to load episodes.</div>';
    }
}

async function toggleEpisodeWatched(seasonNumber, episodeNumber, watched) {
    // Update local state for BOTH users
    ['user1', 'user2'].forEach(viewer => {
        const existingIndex = currentEpisodeProgress.findIndex(ep =>
            ep.season_number === seasonNumber &&
            ep.episode_number === episodeNumber &&
            ep.viewer === viewer
        );
        if (existingIndex >= 0) {
            currentEpisodeProgress[existingIndex].watched = watched;
        } else {
            currentEpisodeProgress.push({
                media_id: currentInternalMediaId,
                season_number: seasonNumber,
                episode_number: episodeNumber,
                watched: watched,
                viewer: viewer
            });
        }
    });

    // Smoothly update UI without full re-render
    updateEpisodeCardVisuals(seasonNumber, episodeNumber, watched);
    updateSeasonWatchedButtonState(document.querySelectorAll('.episode-card').length);

    // Save to database for BOTH users
    const upserts = ['user1', 'user2'].map(viewer => ({
        media_id: currentInternalMediaId,
        viewer: viewer,
        season_number: seasonNumber,
        episode_number: episodeNumber,
        watched: watched,
    }));

    const { error } = await supabase.from('episode_progress').upsert(upserts, {
        onConflict: 'media_id,viewer,season_number,episode_number'
    });

    if (error) {
        console.error('Error updating episode progress:', error);
        // Revert on error
        renderSeasonEpisodes(currentSeasonNumber); // Re-render current season to reflect actual state
    } else {
        // LOG ACTIVITY
        // Since this updates for both users, we log for 'both'
        if (watched) {
            await logActivity('watched_episode', 'both', currentMediaItem, {
                season: seasonNumber,
                episode: episodeNumber
            });
        }
    }
}

async function handleMarkSeasonWatched() {
    const cards = document.querySelectorAll('.episode-card');
    if (cards.length === 0) return;

    // Check if ALL episodes are watched by BOTH users
    const allWatched = Array.from(cards).every(card => {
        const epNum = parseInt(card.dataset.episodeNumber);
        const juainnyWatched = currentEpisodeProgress.some(ep =>
            ep.season_number === currentSeasonNumber &&
            ep.episode_number === epNum &&
            ep.viewer === 'user1' &&
            ep.watched
        );
        const erickWatched = currentEpisodeProgress.some(ep =>
            ep.season_number === currentSeasonNumber &&
            ep.episode_number === epNum &&
            ep.viewer === 'user2' &&
            ep.watched
        );
        return juainnyWatched && erickWatched;
    });

    const shouldWatchAll = !allWatched;

    // Update local state
    const upserts = [];
    cards.forEach(card => {
        const epNum = parseInt(card.dataset.episodeNumber);
        ['user1', 'user2'].forEach(viewer => {
            const existingIndex = currentEpisodeProgress.findIndex(ep =>
                ep.season_number === currentSeasonNumber &&
                ep.episode_number === epNum &&
                ep.viewer === viewer
            );

            if (existingIndex >= 0) {
                currentEpisodeProgress[existingIndex].watched = shouldWatchAll;
            } else {
                currentEpisodeProgress.push({
                    media_id: currentInternalMediaId,
                    season_number: currentSeasonNumber,
                    episode_number: epNum,
                    watched: shouldWatchAll,
                    viewer: viewer
                });
            }

            upserts.push({
                media_id: currentInternalMediaId,
                viewer: viewer,
                season_number: currentSeasonNumber,
                episode_number: epNum,
                watched: shouldWatchAll
            });
        });
    });

    renderSeasonEpisodes(currentSeasonNumber);

    const { error } = await supabase.from('episode_progress').upsert(upserts, {
        onConflict: 'media_id,viewer,season_number,episode_number'
    });
    if (error) console.error('Error updating season progress:', error);
}

async function markAllEpisodesWatched(tmdbId) {
    try {
        const { data: mediaData, error: mediaError } = await supabase
            .from('media')
            .select('id')
            .eq('tmdb_id', tmdbId)
            .single();

        if (mediaError) {
            console.error('Error fetching media for markAllEpisodesWatched:', mediaError);
            throw new Error('Could not find media in database');
        }

        const internalMediaId = mediaData.id;

        const response = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch TV series details');
        const seriesDetails = await response.json();

        const allEpisodesToUpsert = [];
        for (const season of seriesDetails.seasons) {
            if (season.season_number > 0 && season.episode_count > 0) {
                const seasonResponse = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/season/${season.season_number}?api_key=${TMDB_API_KEY}`);
                if (!seasonResponse.ok) throw new Error(`Failed to fetch season ${season.season_number} details`);
                const seasonDetails = await seasonResponse.json();

                seasonDetails.episodes.forEach(episode => {
                    ['user1', 'user2'].forEach(viewer => {
                        allEpisodesToUpsert.push({
                            media_id: internalMediaId,
                            viewer: viewer,
                            season_number: season.season_number,
                            episode_number: episode.episode_number,
                            watched: true
                        });
                    });
                });
            }
        }

        if (allEpisodesToUpsert.length > 0) {
            const { error } = await supabase.from('episode_progress').upsert(allEpisodesToUpsert, {
                onConflict: 'media_id,viewer,season_number,episode_number'
            });
            if (error) {
                console.error('Error marking all episodes watched:', error);
            } else {
                console.log('All episodes marked as watched successfully.');
                // Re-fetch and re-render TV progress to update UI
                await renderTVProgress(tmdbId, seriesDetails.seasons);
            }
        }
    } catch (error) {
        console.error('Error in markAllEpisodesWatched:', error);
    }
}

function toggleEpisodesEditMode() {
    isEditMode = !isEditMode;
    const btn = document.getElementById('edit-episodes-btn');
    if (isEditMode) {
        btn.classList.add('text-accent-primary', 'animate-pulse');
    } else {
        btn.classList.remove('text-accent-primary', 'animate-pulse');
    }

    // Update existing cards without full re-render to avoid glitch
    const cards = document.querySelectorAll('.episode-card');
    cards.forEach(card => {
        const epNum = parseInt(card.dataset.episodeNumber);
        const seasonNum = parseInt(card.dataset.seasonNumber);
        const juainnyWatched = currentEpisodeProgress.some(ep =>
            ep.season_number === seasonNum &&
            ep.episode_number === epNum &&
            ep.viewer === 'user1' &&
            ep.watched
        );
        const erickWatched = currentEpisodeProgress.some(ep =>
            ep.season_number === seasonNum &&
            ep.episode_number === epNum &&
            ep.viewer === 'user2' &&
            ep.watched
        );
        const isWatched = juainnyWatched && erickWatched;

        const unwatchBtn = card.querySelector('.unwatch-btn');
        if (isWatched && isEditMode) {
            card.classList.add('shake');
            unwatchBtn.classList.remove('hidden');
        } else {
            card.classList.remove('shake');
            unwatchBtn.classList.add('hidden');
        }
    });
}

function updateEpisodeCardVisuals(seasonNumber, episodeNumber, watched) {
    const card = document.querySelector(`.episode-card[data-season-number="${seasonNumber}"][data-episode-number="${episodeNumber}"]`);
    if (!card) return;

    const img = card.querySelector('img');
    const checkIcon = card.querySelector('.fa-check')?.parentElement;
    const unwatchBtn = card.querySelector('.unwatch-btn');

    if (watched) {
        img.classList.remove('opacity-100');
        img.classList.add('opacity-50');
        if (!checkIcon) {
            const iconDiv = document.createElement('div');
            iconDiv.className = 'absolute inset-0 flex items-center justify-center pointer-events-none';
            iconDiv.innerHTML = '<i class="fas fa-check text-success text-4xl drop-shadow-lg"></i>';
            card.querySelector('.aspect-video').appendChild(iconDiv);
        }
        if (isEditMode) {
            card.classList.add('shake');
            unwatchBtn.classList.remove('hidden');
        }
    } else {
        img.classList.remove('opacity-50');
        img.classList.add('opacity-100');
        if (checkIcon) checkIcon.remove();
        card.classList.remove('shake');
        unwatchBtn.classList.add('hidden');
    }
}

function updateSeasonWatchedButtonState(totalEpisodes) {
    const btn = document.getElementById('mark-season-watched-btn');
    if (!btn) return;

    // Count episodes watched by BOTH users
    const watchedCount = [...new Set(
        currentEpisodeProgress
            .filter(ep => ep.season_number === currentSeasonNumber && ep.watched)
            .map(ep => ep.episode_number)
    )].filter(epNum => {
        const juainnyWatched = currentEpisodeProgress.some(ep =>
            ep.season_number === currentSeasonNumber &&
            ep.episode_number === epNum &&
            ep.viewer === 'user1' &&
            ep.watched
        );
        const erickWatched = currentEpisodeProgress.some(ep =>
            ep.season_number === currentSeasonNumber &&
            ep.episode_number === epNum &&
            ep.viewer === 'user2' &&
            ep.watched
        );
        return juainnyWatched && erickWatched;
    }).length;

    const isSeasonWatched = watchedCount === totalEpisodes && totalEpisodes > 0;

    if (isSeasonWatched) {
        btn.textContent = 'Season Watched';
        btn.classList.remove('bg-accent-secondary');
        btn.classList.add('bg-success');
    } else {
        btn.textContent = 'Mark Season Watched';
        btn.classList.remove('bg-success');
        btn.classList.add('bg-accent-secondary', 'text-white'); // Added text-white to fix contrast
        btn.classList.remove('text-accent-secondary'); // Remove the orange text class
    }
}

// --- DEBOUNCE UTILITY ---
function debounce(func, delay) {
    let timeout;
    return function (...args) {
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
    if (!tmdbId) {
        console.error('saveRatingsAndNotes: tmdbId not found on modal');
        return;
    }

    const juainnyRating = document.querySelector('#juainny-rating-container .rating-input-hidden').value;
    const erickRating = document.querySelector('#erick-rating-container .rating-input-hidden').value;

    const updates = {
        juainny_rating: parseFloat(juainnyRating) || null,
        juainny_notes: document.getElementById('juainny-notes').innerHTML || null,
        erick_rating: parseFloat(erickRating) || null,
        erick_notes: document.getElementById('erick-notes').innerHTML || null,
    };

    if (!tmdbId) {
        console.error('saveRatingsAndNotes: tmdbId is missing!');
        return;
    }

    // Check if the item exists in the database
    const { data: existingItem, error: fetchError } = await supabase
        .from('media')
        .select('tmdb_id')
        .eq('tmdb_id', tmdbId)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking for existing media:', fetchError);
        return;
    }

    let response;
    if (existingItem) {
        // Update existing item
        response = await supabase
            .from('media')
            .update(updates)
            .eq('tmdb_id', tmdbId)
            .select()
            .single();
    } else {
        // Don't auto-insert new items - user must explicitly add to watchlist first
        console.log('Ratings and notes not saved: item not in database. Add to watchlist first.');
        return;
    }

    const { data, error } = response;

    if (error) {
        console.error('Error saving ratings and notes:', error);
    } else {
        // Detect changes and log activity
        if (currentMediaItem) {
            // Juainny
            if (updates.juainny_rating !== currentMediaItem.juainny_rating && updates.juainny_rating !== null) {
                await logActivity('rate', 'juainny', data, { rating: updates.juainny_rating });
            }
            if (updates.juainny_notes !== currentMediaItem.juainny_notes && updates.juainny_notes !== '') {
                // Only log if note is not empty/null, or if it changed significantly
                // Simple check: if it's different
                await logActivity('note_added', 'juainny', data);
            }

            // Erick
            if (updates.erick_rating !== currentMediaItem.erick_rating && updates.erick_rating !== null) {
                await logActivity('rate', 'erick', data, { rating: updates.erick_rating });
            }
            if (updates.erick_notes !== currentMediaItem.erick_notes && updates.erick_notes !== '') {
                await logActivity('note_added', 'erick', data);
            }
        }

        // Update currentMediaItem with the latest data
        currentMediaItem = data;
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

function sortMedia() {
    switch (currentSort) {
        case 'popularity':
            filteredMedia.sort((a, b) => b.popularity - a.popularity);
            break;
        case 'alphabetical':
            filteredMedia.sort((a, b) => (a.title || a.name).localeCompare(b.title || b.name));
            break;
        case 'release_date':
            filteredMedia.sort((a, b) => {
                const dateA = new Date(a.release_date || a.first_air_date);
                const dateB = new Date(b.release_date || b.first_air_date);
                return dateB - dateA;
            });
            break;
        case 'length':
            filteredMedia.sort((a, b) => (b.runtime || b.episode_run_time?.[0] || 0) - (a.runtime || a.episode_run_time?.[0] || 0));
            break;
        case 'default':
        default:
            const fetched = filteredMedia.filter(item => item.source === 'fetched').sort((a, b) => a.id - b.id);
            const notFetched = filteredMedia.filter(item => item.source !== 'fetched').sort((a, b) => {
                const dateA = new Date(a.release_date || a.first_air_date);
                const dateB = new Date(b.release_date || b.first_air_date);
                return dateB - dateA;
            });
            filteredMedia = [...notFetched, ...fetched];
            break;
    }
}

function setupSortControls() {
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderContent();
    });
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
    const favoritedByJuainny = favoritedBy.includes('user1');
    const favoritedByErick = favoritedBy.includes('user2');

    [modalContent, movieCard].forEach(el => {
        if (!el) return;
        el.classList.remove('favorite-glow', 'rainbow-glow');
        if (favoritedByJuainny && favoritedByErick) {
            el.classList.add('rainbow-glow');
        } else if (favoritedByJuainny || favoritedByErick) {
            el.classList.add('favorite-glow');
        }
    });
}

/**
 * Logs user activity to the activity_log table.
 * @param {string} actionType - 'watched', 'want_to_watch', 'favorite', 'reaction', 'note_added', 'rate'
 * @param {string} userId - 'juainny', 'erick', 'both'
 * @param {object} mediaItem - The media item object (must have id and tmdb_id)
 * @param {object} details - Additional details (e.g., { reaction: 'happy.png' })
 */
async function logActivity(actionType, userId, mediaItem, details = {}) {
    try {
        if (!mediaItem || !mediaItem.id) {
            console.warn('Cannot log activity: Missing media ID');
            return;
        }

        const { error } = await supabase
            .from('activity_log')
            .insert({
                media_id: mediaItem.id,
                tmdb_id: mediaItem.tmdb_id,
                action_type: actionType,
                user_id: userId,
                details: details
            });

        if (error) {
            console.error('Error logging activity:', error);
        } else {
            console.log(`Activity logged: ${actionType} by ${userId}`);
        }
    } catch (err) {
        console.error('Unexpected error logging activity:', err);
    }
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
            const itemType = currentMediaItem.type || currentMediaItem.media_type;
            const title = currentMediaItem.title || currentMediaItem.name;
            const posterPath = currentMediaItem.poster_path;

            // Ensure media item exists in database
            const mediaItem = await ensureMediaItemExists(tmdbId, itemType, title, posterPath);
            if (!mediaItem) {
                console.error('Failed to ensure media item exists');
                userMenu.classList.add('hidden');
                return;
            }

            if (userId === 'remove-all') {
                // Remove all favorites for this item
                const { error } = await supabase
                    .from('media')
                    .update({ favorited_by: [] })
                    .eq('tmdb_id', tmdbId);

                if (error) console.error('Error removing all favorites:', error);
                else {
                    // Update local state
                    currentMediaItem.favorited_by = [];
                    updateFavoriteGlow(currentMediaItem);
                }
            } else {
                // Handle single user favorite
                const userKey = userId; // 'user1', 'user2'
                const userLogName = userKey === 'user1' ? 'juainny' : 'erick';

                // Check current favorite count for this user
                const { data: userFavorites, error: countError } = await supabase
                    .from('media')
                    .select('id, tmdb_id, title, poster_path, favorited_by')
                    .contains('favorited_by', [userKey]);

                if (countError) {
                    console.error('Error checking favorite count:', countError);
                    userMenu.classList.add('hidden');
                    return;
                }

                // If user already has 3 favorites and this isn't one of them, show removal modal
                if (userFavorites && userFavorites.length >= 3) {
                    const alreadyFavorited = userFavorites.some(fav => fav.tmdb_id === tmdbId);

                    if (!alreadyFavorited) {
                        // Show modal to pick which favorite to remove
                        const removedTmdbId = await showFavoriteRemovalModal(userFavorites, userLogName);
                        if (!removedTmdbId) {
                            userMenu.classList.add('hidden');
                            return; // User cancelled
                        }

                        // Remove the selected favorite
                        const itemToRemove = userFavorites.find(f => f.tmdb_id === removedTmdbId);
                        if (itemToRemove) {
                            const newFavoritedBy = (itemToRemove.favorited_by || []).filter(u => u !== userKey);
                            await supabase
                                .from('media')
                                .update({ favorited_by: newFavoritedBy })
                                .eq('tmdb_id', removedTmdbId);

                            // Update local allMedia
                            const localIndex = allMedia.findIndex(m => m.tmdb_id == removedTmdbId);
                            if (localIndex > -1) {
                                allMedia[localIndex].favorited_by = newFavoritedBy;
                            }
                        }
                    }
                }

                // Now add the new favorite
                let currentFavorites = mediaItem.favorited_by || [];
                if (typeof currentFavorites === 'string') {
                    try { currentFavorites = JSON.parse(currentFavorites); } catch { currentFavorites = []; }
                }

                // Toggle: if already favorited, remove it
                if (currentFavorites.includes(userKey)) {
                    currentFavorites = currentFavorites.filter(u => u !== userKey);
                } else {
                    currentFavorites.push(userKey);
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

                    // Update allMedia
                    const index = allMedia.findIndex(item => item.tmdb_id === tmdbId);
                    if (index > -1) allMedia[index] = data;

                    // LOG ACTIVITY (only if actually favorited, not unfavorited)
                    if (currentFavorites.includes(userKey)) {
                        await logActivity('favorite', userLogName, data);
                    }
                }
            }

            renderContent(); // Re-render to update glows on grid
            userMenu.classList.add('hidden');
        }
    });
}

async function showFavoriteRemovalModal(favorites, user) {
    return new Promise((resolve) => {
        const modal = document.getElementById('favorite-removal-modal');
        const listContainer = document.getElementById('favorite-removal-list');
        const cancelBtn = document.getElementById('cancel-favorite-removal-btn');

        // Populate list
        listContainer.innerHTML = '';
        favorites.forEach(fav => {
            const div = document.createElement('div');
            div.className = 'flex items-center gap-3 p-3 rounded-lg border border-border-primary hover:bg-bg-tertiary cursor-pointer transition';

            const posterUrl = fav.poster_path
                ? `https://image.tmdb.org/t/p/w92${fav.poster_path}`
                : 'https://placehold.co/92x138?text=No+Image';

            div.innerHTML = `
                <img src="${posterUrl}" class="w-12 h-18 object-cover rounded" alt="${fav.title}">
                <span class="flex-grow text-text-primary font-semibold">${fav.title}</span>
                <button class="remove-favorite-btn text-danger hover:text-red-400 px-3 py-1 border border-danger rounded transition" data-tmdb-id="${fav.tmdb_id}">
                    <i class="fas fa-times"></i> Remove
                </button>
            `;

            const removeBtn = div.querySelector('.remove-favorite-btn');
            removeBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                resolve(fav.tmdb_id);
            });

            listContainer.appendChild(div);
        });

        // Cancel button
        const cancelHandler = () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            resolve(null);
        };

        cancelBtn.removeEventListener('click', cancelHandler);
        cancelBtn.addEventListener('click', cancelHandler);

        // Show modal
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    });
}

function updateWatchedButtonUI(mediaItem) {
    const watchedBtn = document.getElementById('toggle-watched-btn');
    const currentlyWatchingBtn = document.getElementById('currently-watching-btn');
    const removeCurrentlyWatchingBtn = document.getElementById('remove-currently-watching-btn');
    const bookmarkBtn = document.getElementById('bookmark-btn');

    // Reset all buttons
    currentlyWatchingBtn.classList.add('hidden');
    removeCurrentlyWatchingBtn.classList.add('hidden');
    watchedBtn.classList.remove('hidden');


    // Button visibility logic
    if (mediaItem.watched) {
        watchedBtn.textContent = 'Mark as Unwatched';
        watchedBtn.classList.replace('bg-success', 'bg-gray-600');
    } else if (mediaItem.currently_watching) {
        watchedBtn.textContent = 'Mark as Watched';
        watchedBtn.classList.replace('bg-gray-600', 'bg-success');
        removeCurrentlyWatchingBtn.classList.remove('hidden');
    } else {
        watchedBtn.textContent = 'Mark as Watched';
        watchedBtn.classList.replace('bg-gray-600', 'bg-success');
        currentlyWatchingBtn.classList.remove('hidden');
    }

    // Bookmark icon state
    if (mediaItem.want_to_watch) {
        bookmarkBtn.classList.add('text-accent-primary');
    } else {
        bookmarkBtn.classList.remove('text-accent-primary');
    }
}

async function ensureMediaItemExists(tmdbId, type, title, posterPath = null) {
    let itemType = type;
    if (itemType === 'tv') itemType = 'series'; // Normalize to 'series'

    let { data: mediaItem, error } = await supabase
        .from('media')
        .select('*')
        .eq('tmdb_id', tmdbId)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error checking for media item:', error);
        return null;
    }

    // If item exists, check if it needs a poster_path update
    if (mediaItem) {
        if (posterPath && !mediaItem.poster_path) {
            const { data: updatedItem, error: updateError } = await supabase
                .from('media')
                .update({ poster_path: posterPath })
                .eq('tmdb_id', tmdbId)
                .select()
                .single();
            if (updateError) {
                console.error('Error updating poster path:', updateError);
                return mediaItem; // return original item on error
            }
            return updatedItem; // return the updated item
        }
        return mediaItem; // return existing item if no update needed
    }

    // If item does not exist, create it
    const { data: newItem, error: insertError } = await supabase
        .from('media')
        .insert({ tmdb_id: tmdbId, type: itemType, title: title, poster_path: posterPath, source: 'added' })
        .select()
        .single();

    if (insertError) {
        console.error('Error creating new media item:', insertError);
        return null;
    }
    return newItem;
}


function setupWatchedButtons() {
    const watchedBtn = document.getElementById('toggle-watched-btn');
    const rejectedBtn = document.getElementById('toggle-rejected-btn');
    const currentlyWatchingBtn = document.getElementById('currently-watching-btn');
    const removeCurrentlyWatchingBtn = document.getElementById('remove-currently-watching-btn');
    const bookmarkBtn = document.getElementById('bookmark-btn');

    const handleWatchedToggle = async (isReject) => {
        const { tmdb_id, type, title, poster_path } = currentMediaItem;
        const mediaItem = await ensureMediaItemExists(tmdb_id, type, title, poster_path);
        if (!mediaItem) return;

        // Confirmation for marking a whole series as watched
        if ((type === 'tv' || type === 'series') && !currentMediaItem.watched && !isReject) {
            // Use custom modal
            const choice = await showConfirmationModal(
                "Mark Series Watched?",
                "How would you like to mark this series?"
            );

            if (choice === 'cancel') return;

            if (choice === 'all-episodes') {
                await markAllEpisodesWatched(tmdb_id);
                // We also want to mark the series itself as watched, so we continue...
            }
            // 'series-only' just continues to mark the media item as watched
        }

        const newWatchedStatus = isReject ? false : !currentMediaItem.watched;

        let updates = { watched: newWatchedStatus };
        if (isReject) {
            updates.currently_watching = false;
            updates.source = null;
        }

        if (newWatchedStatus) {
            updates.currently_watching = false;
            updates.want_to_watch = false;
        }

        const { data, error } = await supabase
            .from('media')
            .update(updates)
            .eq('tmdb_id', tmdb_id)
            .select()
            .single();

        if (error) {
            console.error('Error updating watched status:', error);
        } else {
            currentMediaItem = data;
            updateWatchedButtonUI(currentMediaItem);
            const index = allMedia.findIndex(item => item.tmdb_id === tmdb_id);
            if (index > -1) {
                allMedia[index] = data; // Replace the old item with the updated one
            } else {
                // If the item wasn't in allMedia, it's a new item from search. Add it.
                allMedia.push(data);
            }

            // LOG ACTIVITY for watched
            if (newWatchedStatus && !isReject) {
                await logActivity('watched', 'both', data);
            }
            renderContent(); // Refresh grid to reflect changes
        }
    };

    removeCurrentlyWatchingBtn.addEventListener('click', async () => {
        const { tmdb_id } = currentMediaItem;
        const { data, error } = await supabase
            .from('media')
            .update({ currently_watching: false })
            .eq('tmdb_id', tmdb_id)
            .select()
            .single();

        if (error) {
            console.error('Error removing from currently watching:', error);
        } else {
            currentMediaItem = data;
            updateWatchedButtonUI(currentMediaItem);
        }
    });

    currentlyWatchingBtn.addEventListener('click', async () => {
        const { tmdb_id, type, title, poster_path } = currentMediaItem;
        const mediaItem = await ensureMediaItemExists(tmdb_id, type, title, poster_path);
        if (!mediaItem) return;

        const updates = { currently_watching: true, want_to_watch: false, watched: false };

        const { data, error } = await supabase
            .from('media')
            .update(updates)
            .eq('tmdb_id', tmdb_id)
            .select()
            .single();

        if (error) {
            console.error('Error setting currently watching:', error);
        } else {
            currentMediaItem = data;
            updateWatchedButtonUI(currentMediaItem);

            // LOG ACTIVITY
            await logActivity('currently_watching', 'both', data);
        }
    });

    bookmarkBtn.addEventListener('click', async () => {
        const { tmdb_id, type, title, poster_path } = currentMediaItem;
        const mediaItem = await ensureMediaItemExists(tmdb_id, type, title, poster_path);
        if (!mediaItem) return;

        const newWantToWatch = !currentMediaItem.want_to_watch;
        let updates = { want_to_watch: newWantToWatch };
        if (newWantToWatch) {
            updates.currently_watching = false;
        }

        const { data, error } = await supabase
            .from('media')
            .update(updates)
            .eq('tmdb_id', tmdb_id)
            .select()
            .single();
        if (error) {
            console.error('Error updating bookmark:', error);
        } else {
            currentMediaItem = data;
            updateWatchedButtonUI(currentMediaItem);

            // LOG ACTIVITY
            if (newWantToWatch) {
                await logActivity('want_to_watch', 'both', data);
            }
        }
    });


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
        // --- 1. Load Flairs FIRST ---
        console.log('App Initializing... v2.1'); // DEBUG
        // Load flairs
        allFlairs = await fetchAllFlairs();

        // Load flairs for all media
        const { data: mediaFlairsData, error: mfError } = await supabase
            .from('media_flairs')
            .select('media_id, flairs(*)');

        if (!mfError && mediaFlairsData) {
            mediaFlairsData.forEach(item => {
                if (!mediaFlairsMap.has(item.media_id)) {
                    mediaFlairsMap.set(item.media_id, []);
                }
                mediaFlairsMap.get(item.media_id).push(item.flairs);
            });
        }

        // --- 2. Render Carousels ---
        const currentlyWatchingMedia = await getCurrentlyWatchingMedia();
        renderCarousel('currently-watching-carousel', currentlyWatchingMedia);

        const wantToWatchMedia = await getWantToWatchMedia();
        renderCarousel('want-to-watch-carousel', wantToWatchMedia);

        // Set up real-time subscriptions for carousels
        supabase
            .channel('media-carousels')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'media' }, async (payload) => {
                const [currentlyWatching, wantToWatch] = await Promise.all([
                    getCurrentlyWatchingMedia(),
                    getWantToWatchMedia()
                ]);
                renderCarousel('currently-watching-carousel', currentlyWatching);
                renderCarousel('want-to-watch-carousel', wantToWatch);
            })
            .subscribe();

        // Set up real-time subscriptions
        supabase
            .channel('media')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'media' }, async (payload) => {
                // Re-render both carousels on any change
                const [currentlyWatching, wantToWatch] = await Promise.all([
                    getCurrentlyWatchingMedia(),
                    getWantToWatchMedia()
                ]);
                renderCarousel('currently-watching-carousel', currentlyWatching);
                renderCarousel('want-to-watch-carousel', wantToWatch);
            })
            .subscribe();
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

        // (Flairs loaded at the top now)

        // Fetch all media initially
        const { data: allMediaItems, error } = await supabase.from('media').select('*');
        if (error) {
            console.error('Error fetching all media:', error);
            return;
        }

        // Sync data with TMDB
        allMedia = await syncWithTMDB(allMediaItems);

        // Main grid should only show watched media
        currentMedia = allMedia.filter(item => item.watched);

        // Initial render
        renderContent();

        // Hide the loading spinner
        if (loadingSpinner) loadingSpinner.style.display = 'none';

        // Setup search bar
        const searchBar = document.getElementById('search-bar');
        // Prevent extensions from interfering
        searchBar.setAttribute('autocomplete', 'off');
        searchBar.setAttribute('data-lpignore', 'true');
        searchBar.setAttribute('data-form-type', 'other');
        searchBar.setAttribute('spellcheck', 'false');

        const sortSelect = document.getElementById('sort-select');

        const homeBtn = document.getElementById('home-btn');
        const logoContainer = document.getElementById('logo-container');
        const currentlyWatchingSection = document.getElementById('currently-watching-section');
        const wantToWatchSection = document.getElementById('want-to-watch-section');

        const exitSearchMode = () => {
            searchBar.value = '';
            currentMedia = allMedia;
            currentFilter = 'watched'; // Reset to watched filter (default for main view)
            sortSelect.value = 'default';
            currentSort = 'default';
            sortSelect.disabled = false;
            homeBtn.classList.add('hidden');
            currentlyWatchingSection.classList.remove('hidden');
            wantToWatchSection.classList.remove('hidden');

            // Show section headers
            const watchedItemsHeader = document.getElementById('watched-items-header');
            if (watchedItemsHeader) watchedItemsHeader.classList.remove('hidden');

            renderContent();
            refreshAllReactionAvatars(); // Refresh avatars after render
        };

        // Use both 'input' and 'keyup' events for better compatibility
        const handleSearch = async (e) => {
            console.log('Search input event:', e.target.value); // DEBUG
            try {
                const searchTerm = e.target.value.trim();
                if (searchTerm === '') {
                    exitSearchMode();
                } else {
                    homeBtn.classList.remove('hidden');
                    currentlyWatchingSection.classList.add('hidden');
                    wantToWatchSection.classList.add('hidden');

                    // Hide section headers in search mode
                    const watchedItemsHeader = document.getElementById('watched-items-header');
                    if (watchedItemsHeader) watchedItemsHeader.classList.add('hidden');

                    console.log('Executing search for:', searchTerm); // DEBUG
                    const searchResults = await searchTMDB(searchTerm);
                    currentMedia = searchResults;
                    currentSort = 'popularity';
                    currentFilter = 'all'; // Fix: Reset filter to show all search results
                    sortSelect.disabled = true;
                    renderContent();
                }
            } catch (error) {
                console.error('Error in search handler:', error);
            }
        };

        // Attach multiple event listeners for resilience
        const debouncedSearch = debounce(handleSearch, 300);
        searchBar.addEventListener('input', debouncedSearch);
        // searchBar.addEventListener('keyup', handleSearch); // Input event is sufficient and better for debouncing

        // Prevent browser extensions from interfering - REMOVED as it might be causing issues
        // searchBar.addEventListener('focus', (e) => {
        //     e.stopPropagation();
        // }, true);

        homeBtn.addEventListener('click', exitSearchMode);
        logoContainer.addEventListener('click', exitSearchMode);

        // Setup other UI elements
        setupModalCloseButton();
        setupRatingAndNotesListeners();
        setupFilterControls();
        setupViewControls();
        setupFeelingLuckyButton();
        setupTooltips();
        setupFavoriteButton();
        setupWatchedButtons();
        setupSortControls();
        initializeSettings();
        await loadAndApplySettings(); // Wait for settings and avatars to load
        setupUserMenu();
        setupCarouselEditMode();

        // Refresh avatars after settings are loaded
        refreshAllReactionAvatars();

        // Setup notification button
        const notificationBtn = document.getElementById('notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                alert('Notifications Coming Soon!');
            });
        }

        // Toggle avatars for user preferences
        const avatarToggle = document.getElementById('avatar-toggle');
        if (avatarToggle) {
            avatarToggle.addEventListener('change', (e) => {
                document.body.classList.toggle('show-avatars', e.target.checked);
            });
        }

        setupAllenEasterEgg();

        // Hide tooltip when clicking anywhere else on the page
        document.addEventListener('click', (e) => {
            const tooltip = document.getElementById('reaction-tooltip');
            if (tooltip && !tooltip.classList.contains('hidden')) {
                // Check if click is not on a reaction item
                if (!e.target.closest('.reaction-item')) {
                    hideReactionTooltip();
                }
            }
        });

    } catch (error) {
        console.error('Error during app initialization:', error);
    }
}

// --- EASTER EGG ---


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

function setupCarouselEditMode() {
    const editButtons = {
        'currently-watching': document.getElementById('edit-currently-watching-btn'),
        'want-to-watch': document.getElementById('edit-want-to-watch-btn')
    };

    const carousels = {
        'currently-watching': document.getElementById('currently-watching-carousel'),
        'want-to-watch': document.getElementById('want-to-watch-carousel')
    };

    let editModeActive = {
        'currently-watching': false,
        'want-to-watch': false
    };

    const toggleEditMode = (type) => {
        editModeActive[type] = !editModeActive[type];
        const carousel = carousels[type];
        const editButton = editButtons[type];

        if (editModeActive[type]) {
            editButton.classList.add('text-accent-primary');
            carousel.querySelectorAll('.movie-card').forEach(card => {
                card.classList.add('shake');
                const removeBtn = document.createElement('button');
                removeBtn.className = 'absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center text-4xl';
                removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                removeBtn.onclick = async () => {
                    const tmdbId = card.dataset.tmdbId;
                    const updates = type === 'currently-watching' ? { currently_watching: false } : { want_to_watch: false };

                    const { error } = await supabase.from('media').update(updates).eq('tmdb_id', tmdbId);
                    if (error) {
                        console.error(`Error removing from ${type}:`, error);
                    } else {
                        card.remove();
                    }
                };
                card.appendChild(removeBtn);
            });
        } else {
            editButton.classList.remove('text-accent-primary');
            carousel.querySelectorAll('.movie-card').forEach(card => {
                card.classList.remove('shake');
                card.querySelector('button')?.remove();
            });
        }
    };

    editButtons['currently-watching'].addEventListener('click', () => toggleEditMode('currently-watching'));
    editButtons['want-to-watch'].addEventListener('click', () => toggleEditMode('want-to-watch'));
}


document.addEventListener('DOMContentLoaded', initializeApp);

if (import.meta.hot) {
    import.meta.hot.on('vite:error', (err) => {
        console.error(err);
    });
}

// --- REACTIONS FEATURE ---
const MOODS = [
    '24klabubu.png', 'afraid.png', 'amazed.png', 'angry.png', 'bored.png',
    'celebratory.png', 'crazy.png', 'crying.png', 'disgusted.png', 'happy.png',
    'melted.png', 'neutral.png', 'not-a-fan.png', 'sad.png', 'satisfied.png',
    'sexy.png', 'surprised.png', 'thinking.png', 'tea.png', 'lol.png'
];

const MOOD_LABELS = {
    'tea.png': 'Das Tea',
    'lol.png': 'Laughter',
    '24klabubu.png': '24k Labubu',
    'not-a-fan.png': 'Not A Fan'
};

function openReactionSelector(tmdbId) {
    const container = document.getElementById('mood-modal-container');
    if (!container) {
        console.error('mood-modal-container not found!');
        return;
    }
    // Force container visibility just in case
    // Apply overlay styles directly to the container
    container.style.cssText = `
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
    `;


    // Reset state
    selectedReactionUser = null;
    selectedReactionMood = null;

    container.innerHTML = `
        <div class="mood-modal" style="background-color: #1a1a1a; color: white; border-radius: 1rem; width: 95%; max-width: 40rem; max-height: 80vh; overflow-y: auto; position: relative; border: 1px solid #404040; display: flex; flex-direction: column; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
            <button id="close-mood-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.1); border-radius: 50%; padding: 0.5rem; cursor: pointer; color: white;">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div style="padding: 1.5rem;">
                <h2 class="text-2xl font-bold mb-6 text-center">How did this movie make you react?</h2>
                
                <div class="flex justify-center mb-8 gap-4">
                    <button class="user-select-btn" data-user="juainny">
                        <div class="user-avatar-preview user1-avatar-preview">J</div>
                        <span class="font-semibold">Juainny</span>
                    </button>
                    <button class="user-select-btn" data-user="erick">
                        <div class="user-avatar-preview user2-avatar-preview">E</div>
                        <span class="font-semibold">Erick</span>
                    </button>
                </div>

                <div id="mood-grid-container" class="mood-grid grayscale transition-all duration-300" style="opacity: 0.5; pointer-events: none;">
                    ${MOODS.map(mood => {
        const label = MOOD_LABELS[mood] || mood.replace('.png', '').replace(/-/g, ' ').replace(/_/g, ' ');
        return `
                        <div class="mood-option" data-mood="${mood}" role="button" aria-label="${label}">
                            <img src="moods/${mood}" alt="${label}">
                            <span class="mood-label">${label}</span>
                        </div>
                    `;
    }).join('')}
                </div>

                <div class="mt-8 text-center">
                    <button id="mood-done-btn" class="bg-accent-primary hover:bg-accent-secondary text-text-on-accent font-bold py-2 px-8 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed" disabled>Done</button>
                </div>
            </div>
        </div >
        `;

    // Event Listeners
    document.getElementById('close-mood-modal-btn').addEventListener('click', closeReactionSelector);

    // Close on overlay click (container is the overlay now)
    container.addEventListener('click', (e) => {
        if (e.target === container) closeReactionSelector();
    });

    // User Selection
    const userBtns = container.querySelectorAll('.user-select-btn');
    userBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle selection
            userBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');

            selectedReactionUser = btn.dataset.user;

            // Enable mood grid
            const grid = document.getElementById('mood-grid-container');
            grid.classList.remove('grayscale');
            grid.style.opacity = '1';
            grid.style.pointerEvents = 'auto';

            checkDoneButton();
        });
    });

    // Mood Selection
    const moodOptions = container.querySelectorAll('.mood-option');
    moodOptions.forEach(option => {
        option.addEventListener('click', () => {
            if (!selectedReactionUser) return; // Strict check
            moodOptions.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');

            selectedReactionMood = option.dataset.mood;
            checkDoneButton();
        });
    });

    // Done Button
    document.getElementById('mood-done-btn').addEventListener('click', () => {
        if (selectedReactionUser && selectedReactionMood) {
            saveReaction(tmdbId, selectedReactionUser, selectedReactionMood);
            closeReactionSelector();
        }
    });
}

let selectedReactionUser = null;
let selectedReactionMood = null;

function checkDoneButton() {
    const doneBtn = document.getElementById('mood-done-btn');
    if (selectedReactionUser && selectedReactionMood) {
        doneBtn.disabled = false;
    } else {
        doneBtn.disabled = true;
    }
}

window.closeReactionSelector = function () {
    const container = document.getElementById('mood-modal-container');
    if (container) {
        container.innerHTML = '';
        container.style.cssText = ''; // Clear all inline styles
    }
    selectedReactionUser = null;
    selectedReactionMood = null;
};

async function saveReaction(tmdbId, user, mood) {
    const updates = {};
    // Handle both 'juainny'/'erick' and 'user1'/'user2' formats
    if (user === 'user1' || user === 'juainny') updates.juainny_reaction = mood;
    if (user === 'user2' || user === 'erick') updates.erick_reaction = mood;

    // Ensure item exists in DB before updating
    // We need to get the current title/poster/type if possible, but if we're in the modal, we have currentMediaItem
    let title = '';
    let poster_path = '';
    let type = 'movie'; // default

    if (currentMediaItem && currentMediaItem.tmdb_id == tmdbId) {
        title = currentMediaItem.title || currentMediaItem.name;
        poster_path = currentMediaItem.poster_path;
        type = currentMediaItem.type || (currentMediaItem.title ? 'movie' : 'tv'); // infer if missing
    } else {
        // Try to find in allMedia
        const found = allMedia.find(i => i.tmdb_id == tmdbId);
        if (found) {
            title = found.title || found.name;
            poster_path = found.poster_path;
            type = found.type;
        }
    }

    // Don't auto-create items in database - only save reactions for items that already exist
    // This prevents database bloat from just viewing/browsing items


    // Optimistic update
    if (currentMediaItem && currentMediaItem.tmdb_id == tmdbId) {
        if (user === 'user1') currentMediaItem.juainny_reaction = mood;
        if (user === 'user2') currentMediaItem.erick_reaction = mood;
        updateModalReactionDisplay();
    }

    const itemIndex = allMedia.findIndex(i => i.tmdb_id == tmdbId);
    if (itemIndex > -1) {
        allMedia[itemIndex] = { ...allMedia[itemIndex], ...updates };
        renderContent(); // Re-render grid

        // Re-render carousels to show new reaction
        const currentlyWatching = await getCurrentlyWatchingMedia();
        renderCarousel('currently-watching-carousel', currentlyWatching);
        const wantToWatch = await getWantToWatchMedia();
        renderCarousel('want-to-watch-carousel', wantToWatch);
    }

    const { data, error } = await supabase
        .from('media')
        .update(updates)
        .eq('tmdb_id', tmdbId)
        .select()
        .single();

    if (error) {
        console.error('Error saving reaction:', error);
        alert('Failed to save reaction. Please try again.');
        // Revert optimistic update if needed (omitted for brevity)
    } else {
        console.log('Reaction saved successfully to DB for TMDB ID:', tmdbId);

        // LOG ACTIVITY
        const userLogName = (user === 'user1' || user === 'juainny') ? 'juainny' : 'erick';
        if (data && mood) {
            await logActivity('reaction', userLogName, data, { reaction: mood });
        }
    }
}



function updateModalReactionDisplay() {
    const container = document.getElementById('modal-mood-display');
    const removeBtn = document.getElementById('remove-mood-btn');
    if (!container) return;

    container.innerHTML = '';
    let hasReaction = false;

    if (currentMediaItem?.juainny_reaction) {
        hasReaction = true;
        container.innerHTML += `
        <div class="relative group" title="Juainny's Reaction">
            <img src="moods/${currentMediaItem.juainny_reaction}" class="w-10 h-10 object-contain drop-shadow-md">
                <div class="absolute -bottom-1 -right-1 w-4 h-4">
                    ${getAvatarHTML('juainny', 'w-full h-full')}
                </div>
            </div>
    `;
    }
    if (currentMediaItem?.erick_reaction) {
        hasReaction = true;
        container.innerHTML += `
        <div class="relative group" title="Erick's Reaction">
            <img src="moods/${currentMediaItem.erick_reaction}" class="w-10 h-10 object-contain drop-shadow-md">
                <div class="absolute -bottom-1 -right-1 w-4 h-4">
                    ${getAvatarHTML('erick', 'w-full h-full')}
                </div>
            </div>
    `;
    }

    if (hasReaction) {
        removeBtn.classList.remove('hidden');
        removeBtn.onclick = async () => {
            if (confirm('Remove all reactions for this item?')) {
                const updates = { juainny_reaction: null, erick_reaction: null };
                currentMediaItem.juainny_reaction = null;
                currentMediaItem.erick_reaction = null;
                updateModalReactionDisplay();

                await supabase.from('media').update(updates).eq('tmdb_id', currentMediaItem.tmdb_id);
                renderContent();
            }
        };
    } else {
        removeBtn.classList.add('hidden');
    }
}

/**
 * Refreshes all reaction avatars across the page (movie cards and carousels)
 */
export function refreshAllReactionAvatars() {
    // Update all movie cards in the grid
    document.querySelectorAll('.movie-card').forEach(card => {
        const tmdbId = card.dataset.tmdbId;
        const mediaItem = allMedia.find(item => item.tmdb_id == tmdbId);

        if (mediaItem) {
            // Find reaction containers
            const reactionContainer = card.querySelector('.absolute.top-2.left-2');
            if (reactionContainer) {
                // Rebuild reaction HTML
                let reactionsHTML = '';
                if (mediaItem.juainny_reaction) {
                    reactionsHTML += `
                        <div class="relative w-8 h-8 group/reaction cursor-pointer reaction-item" data-user="Juainny" data-reaction="${mediaItem.juainny_reaction}">
                            <img src="moods/${mediaItem.juainny_reaction}" class="w-full h-full object-contain drop-shadow-md">
                            <div class="absolute -bottom-1 -right-1 w-4 h-4">
                                ${getAvatarHTML('juainny', 'w-full h-full')}
                            </div>
                        </div>
                    `;
                }
                if (mediaItem.erick_reaction) {
                    reactionsHTML += `
                        <div class="relative w-8 h-8 group/reaction cursor-pointer reaction-item" data-user="Erick" data-reaction="${mediaItem.erick_reaction}">
                            <img src="moods/${mediaItem.erick_reaction}" class="w-full h-full object-contain drop-shadow-md">
                            <div class="absolute -bottom-1 -right-1 w-4 h-4">
                                ${getAvatarHTML('erick', 'w-full h-full')}
                            </div>
                        </div>
                    `;
                }
                reactionContainer.innerHTML = reactionsHTML;

                // Re-attach event listeners
                reactionContainer.querySelectorAll('.reaction-item').forEach(reactionEl => {
                    reactionEl.addEventListener('mouseenter', (e) => {
                        showReactionTooltip(e.currentTarget);
                    });
                    reactionEl.addEventListener('mouseleave', () => {
                        hideReactionTooltip();
                    });
                    // Add click for mobile (also prevents modal from opening)
                    reactionEl.addEventListener('click', (e) => {
                        toggleReactionTooltip(e.currentTarget, e);
                    });
                });
            }
        }
    });

    // Update modal if it's open
    if (currentMediaItem) {
        updateModalReactionDisplay();
    }
}

/**
 * Shows a tooltip when hovering over a reaction
 */
let activeTooltipElement = null;

function showReactionTooltip(reactionElement) {
    const tooltip = document.getElementById('reaction-tooltip');
    const tooltipAvatar = document.getElementById('tooltip-avatar');
    const tooltipText = document.getElementById('tooltip-text');

    if (!tooltip || !tooltipAvatar || !tooltipText) return;

    const user = reactionElement.dataset.user; // "Juainny" or "Erick"
    const reactionFile = reactionElement.dataset.reaction; // e.g., "neutral.png"

    // Get reaction name
    let reactionName = MOOD_LABELS[reactionFile];

    if (!reactionName) {
        reactionName = reactionFile.replace('.png', '').replace(/_/g, ' ').replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Set avatar
    tooltipAvatar.innerHTML = getAvatarHTML(user.toLowerCase(), 'w-6 h-6');

    // Set text
    tooltipText.textContent = `${user} reacted with ${reactionName}`;

    // Position tooltip - use absolute positioning that scrolls with page
    const rect = reactionElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    tooltip.style.position = 'absolute';
    tooltip.style.left = `${rect.left + scrollLeft + rect.width / 2}px`;
    tooltip.style.top = `${rect.bottom + scrollTop + 8}px`; // 8px below the reaction
    tooltip.style.transform = 'translateX(-50%)'; // Center horizontally

    // Show tooltip
    tooltip.classList.remove('hidden');
    activeTooltipElement = reactionElement;
}

/**
 * Hides the reaction tooltip
 */
function hideReactionTooltip() {
    const tooltip = document.getElementById('reaction-tooltip');
    if (tooltip) {
        tooltip.classList.add('hidden');
        activeTooltipElement = null;
    }
}

/**
 * Toggles tooltip on click (for mobile)
 */
function toggleReactionTooltip(reactionElement, event) {
    event.stopPropagation(); // Prevent modal from opening

    if (activeTooltipElement === reactionElement) {
        hideReactionTooltip();
    } else {
        showReactionTooltip(reactionElement);
    }
}


function showConfirmationModal(title, message) {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirmation-modal');
        const titleEl = document.getElementById('confirmation-title');
        const messageEl = document.getElementById('confirmation-message');
        const seriesOnlyBtn = document.getElementById('confirm-series-only-btn');
        const allEpisodesBtn = document.getElementById('confirm-all-episodes-btn');
        const cancelBtn = document.getElementById('cancel-confirmation-btn');

        titleEl.textContent = title;
        messageEl.textContent = message;

        // Reset visibility in case it was hidden
        if (allEpisodesBtn) allEpisodesBtn.classList.remove('hidden');

        modal.classList.remove('hidden');
        modal.classList.add('flex');

        const cleanup = () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            seriesOnlyBtn.onclick = null;
            if (allEpisodesBtn) allEpisodesBtn.onclick = null;
            cancelBtn.onclick = null;
        };

        seriesOnlyBtn.onclick = () => {
            cleanup();
            resolve('series-only');
        };

        if (allEpisodesBtn) {
            allEpisodesBtn.onclick = () => {
                cleanup();
                resolve('all-episodes');
            };
        }

        cancelBtn.onclick = () => {
            cleanup();
            resolve('cancel');
        };
    });
}
// --- Willow Chat Logic ---

const willowFab = document.getElementById('willow-fab');
const willowChatModal = document.getElementById('willow-chat-modal');
const willowChatContainer = document.getElementById('willow-chat-container');
const willowChatForm = document.getElementById('willow-chat-form');
const willowChatInput = document.getElementById('willow-chat-input');
const willowChatMessages = document.getElementById('willow-chat-messages');

window.toggleWillowChat = function () {
    const isHidden = willowChatModal.classList.contains('hidden');
    if (isHidden) {
        willowChatModal.classList.remove('hidden');
        // Small delay to allow display:block to apply before transition
        setTimeout(() => {
            willowChatContainer.classList.remove('translate-y-full');
            willowChatContainer.classList.add('translate-y-0');
        }, 10);
        willowChatInput.focus();
    } else {
        willowChatContainer.classList.remove('translate-y-0');
        willowChatContainer.classList.add('translate-y-full');
        setTimeout(() => {
            willowChatModal.classList.add('hidden');
        }, 300); // Match transition duration
    }
};

if (willowFab) {
    willowFab.addEventListener('click', window.toggleWillowChat);
}

if (willowChatForm) {
    willowChatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = willowChatInput.value.trim();
        if (!query) return;

        // Add User Message
        addChatMessage(query, 'user');
        willowChatInput.value = '';
        willowChatInput.disabled = true;

        // Show Typing Indicator
        const typingId = addTypingIndicator();

        // Call AI
        // Pass allMedia as context
        const response = await chatWithWillow(query, allMedia);

        // Remove Typing Indicator
        removeChatMessage(typingId);

        // Add AI Message
        addChatMessage(response, 'ai');
        willowChatInput.disabled = false;
        willowChatInput.focus();
    });
}

// Simple markdown renderer
function renderMarkdown(text) {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.+?)\*/g, '<em>$1</em>')  // Italic
        .replace(/^- (.+)$/gm, '<li>$1</li>') // List items
        .replace(/(<li>.*<\/li>)/s, '<ul class="list-disc pl-4 space-y-1">$1</ul>') // Wrap lists
        .replace(/\n/g, '<br>'); // Line breaks
}

function addChatMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `flex items-start gap-2 ${sender === 'user' ? 'flex-row-reverse' : ''}`;

    const avatar = sender === 'ai'
        ? `<div class="w-10 h-10 flex-shrink-0 flex items-center justify-center overflow-hidden"><img src="/willow-logo.png" class="w-full h-full object-contain"></div>`
        : ''; // No user avatar

    const bubbleClass = sender === 'ai'
        ? 'bg-bg-tertiary text-text-primary rounded-tl-none'
        : 'bg-teal-600 text-white rounded-tr-none';

    const content = sender === 'ai' ? renderMarkdown(text) : text;

    div.innerHTML = `
        ${avatar}
        <div class="${bubbleClass} p-3 rounded-2xl text-sm shadow-sm max-w-[85%] markdown-content">
            ${content}
        </div>
    `;

    willowChatMessages.appendChild(div);
    willowChatMessages.scrollTop = willowChatMessages.scrollHeight;
    return div.id = 'msg-' + Date.now();
}

function addTypingIndicator() {
    const div = document.createElement('div');
    div.id = 'typing-' + Date.now();
    div.className = 'flex items-start gap-2';
    div.innerHTML = `
        <div class="w-10 h-10 flex-shrink-0 flex items-center justify-center overflow-hidden"><img src="/willow-logo.png" class="w-full h-full object-contain"></div>
        <div class="bg-bg-tertiary p-3 rounded-2xl rounded-tl-none text-text-primary text-sm shadow-sm">
            <div class="flex space-x-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
        </div>
    `;
    willowChatMessages.appendChild(div);
    willowChatMessages.scrollTop = willowChatMessages.scrollHeight;
    return div.id;
}

function removeChatMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}
