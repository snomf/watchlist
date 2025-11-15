// Import Supabase
import { supabase } from './supabaseClient';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AvatarPicker from './avatar-picker.js';
import MoodModal from './mood-modal.js';
import confetti from 'canvas-confetti';


const TMDB_API_KEY = "25e3d089cc8e37a56bf6a1984daf3c5c";
const snapSound = new Audio('/snap.mp3');



// App state variables
let userId;
let marathonState = { items: [] };
let userSettings = {
    theme: 'dark',
    avatars: {
        user1: null,
        user2: null
    }
};
let isInitializing = false;
let currentView = 'grid';
let currentFilter = 'all';
let currentModalId = null;
let moodModal = null;

// Initialize Supabase Auth
async function initializeAppAndAuth() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
      setupMarathonListener();
      setupUserSettingsListener();
      applyUserSettings();
    } else {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      userId = data.user.id;
      setupMarathonListener();
      setupUserSettingsListener();
      applyUserSettings();
    }
  } catch (error) {
    console.error("Supabase initialization failed:", error);
    document.getElementById('loading-spinner').innerHTML = "Error connecting to services. Please refresh.";
  }
}

async function setupUserSettingsListener() {
    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();

    if (data) {
        userSettings = data;
    } else {
        await supabase.from('settings').insert([userSettings]);
    }
    applyUserSettings();

    supabase
        .channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'settings' },
            (payload) => {
                userSettings = payload.new;
                applyUserSettings();
            }
        )
        .subscribe();
}

async function updateUserSettings(settings) {
    userSettings = { ...userSettings, ...settings };
    await supabase.from('settings').upsert(userSettings);
}

function updateTheme(newTheme) {
    updateUserSettings({ theme: newTheme });
}

import { renderAvatar } from './avatar-renderer.js';

function applyTheme(theme) {
    const body = document.body;
    // Remove any existing theme classes that start with "theme-"
    const themeClasses = Array.from(body.classList).filter(c => c.startsWith('theme-'));
    body.classList.remove(...themeClasses);

    // Add the new theme class
    body.classList.add(`theme-${theme || 'dark'}`);
}

function applyUserSettings() {
    applyTheme(userSettings.theme);

    // Apply avatars
    if (userSettings.avatars) {
        const user1Preview = document.getElementById('user1-avatar-preview');
        const user2Preview = document.getElementById('user2-avatar-preview');
        const juainnyAvatar = document.getElementById('juainny-avatar');
        const erickAvatar = document.getElementById('erick-avatar');
        const user1Nav = document.getElementById('user1-avatar-nav');
        const user2Nav = document.getElementById('user2-avatar-nav');

        if(user1Preview && user2Preview && juainnyAvatar && erickAvatar) {
            renderAvatar(user1Preview, 'user1', userSettings, { extraClasses: ['mt-2'] });
            renderAvatar(user2Preview, 'user2', userSettings, { extraClasses: ['mt-2'] });
            renderAvatar(juainnyAvatar, 'user1', userSettings, { extraClasses: ['mr-3'] });
            renderAvatar(erickAvatar, 'user2', userSettings, { extraClasses: ['mr-3'] });
            renderAvatar(user1Nav, 'user1', userSettings, {});
            renderAvatar(user2Nav, 'user2', userSettings, {});
        }
    }

    renderUI();
}

async function setupMarathonListener() {
    // First, load the local JSON data
    try {
        const response = await fetch('/src/watchednotes.json');
        const localItems = await response.json();
        marathonState.items = localItems.map((item, index) => ({
            id: index,
            ...item,
            watched: true, // Mark all items from watchednotes.json as watched
            want_to_watch: false
        }));
        renderUI();
        document.getElementById('loading-spinner').style.display = 'none';
    } catch (error) {
        console.error("Error loading local watched notes:", error);
    }

    // Then, fetch data from Supabase and merge it with the local data
    const { data, error } = await supabase.from('media').select('*');
    if (data) {
        data.forEach(supabaseItem => {
            const existingItemIndex = marathonState.items.findIndex(localItem => localItem.title === supabaseItem.title);
            if (existingItemIndex > -1) {
                // Update existing item with Supabase data
                marathonState.items[existingItemIndex] = { ...marathonState.items[existingItemIndex], ...supabaseItem };
            } else {
                // Add new item from Supabase
                marathonState.items.push(supabaseItem);
            }
        });
        renderUI();
    }

    // Listen for real-time updates from Supabase
    supabase
        .channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'media' },
            (payload) => {
                const updatedItem = payload.new;
                const itemIndex = marathonState.items.findIndex(item => item.id === updatedItem.id);
                if (itemIndex > -1) {
                    marathonState.items[itemIndex] = updatedItem;
                } else {
                    marathonState.items.push(updatedItem);
                }
                renderUI();
            }
        )
        .subscribe();
}

        async function updateSupabaseState() {
            if (!userId) return;
            const { error } = await supabase.from('media').upsert(marathonState.items);
            if (error) {
                console.error("Error updating Supabase:", error);
            }
        }

        function renderUI() {
            if (!marathonState || !marathonState.items) return;

            let itemsToRender = marathonState.items;

            if (currentFilter === 'watched') {
                itemsToRender = itemsToRender.filter(item => item.watched);
            } else if (currentFilter === 'want-to-watch') {
                itemsToRender = itemsToRender.filter(item => item.want_to_watch);
            }
            
            const filteredItems = itemsToRender;

            if (currentView === 'grid') {
                renderGridView(filteredItems);
                document.getElementById('movie-grid').classList.remove('hidden');
                document.getElementById('movie-list').classList.add('hidden');
            } else {
                renderListView(filteredItems);
                document.getElementById('movie-grid').classList.add('hidden');
                document.getElementById('movie-list').classList.remove('hidden');
            }
            updateStats();
            if (userSettings.nextUpWallpaperEnabled) {
                updateNextUpWallpaper();
            }
        }

        function renderGridView(items) {
            const gridEl = document.getElementById('movie-grid');
            gridEl.innerHTML = items.map(item => {
                const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : `https://placehold.co/500x750/1f2937/ef4444?text=${encodeURIComponent(item.title)}`;
                let overlayClass = '';
                if (item.watched) {
                    overlayClass = 'watched';
                } else if (item.rejected) {
                    overlayClass = 'rejected';
                }
                let overlayIcon = '';
                if (item.watched) {
                    overlayIcon = 'fa-check-circle text-green-500';
                } else if (item.rejected) {
                    overlayIcon = 'fa-times-circle text-red-500';
                }
                let favoriteClass = '';
                if (item.favoritedBy) {
                    if (item.favoritedBy.includes('user1') && item.favoritedBy.includes('user2')) {
                        favoriteClass = 'super-favorite-glow glossy-overlay';
                    } else if (item.favoritedBy.length > 0) {
                        favoriteClass = 'favorite-glow';
                    }
                } else {
                    favoriteClass = '';
                }

                let moodEmojis = '';
                if (item.moods) {
                    const user1Mood = item.moods.user1;
                    const user2Mood = item.moods.user2;
                    if (user1Mood) {
                        moodEmojis += `<div class="mood-emoji-container" data-user="Juainny" data-mood="${user1Mood.name}" data-movie="${item.title}"><img src="/moods/${user1Mood.image}" alt="${user1Mood.name}" class="w-8 h-8"></div>`;
                    }
                    if (user2Mood) {
                        moodEmojis += `<div class="mood-emoji-container" data-user="Erick" data-mood="${user2Mood.name}" data-movie="${item.title}"><img src="/moods/${user2Mood.image}" alt="${user2Mood.name}" class="w-8 h-8"></div>`;
                    }
                }

                return `
                    <div data-item-id="${item.id}" class="movie-card relative rounded-lg overflow-hidden cursor-pointer shadow-lg transition-transform duration-200 ${overlayClass} ${favoriteClass}" onclick="openModal(${item.id})">
                        <div class="emoji-banner absolute top-0 left-0 w-full h-12 bg-transparent z-10 flex justify-between items-center px-2">${moodEmojis}</div>
                        <img src="${posterUrl}" alt="${item.title}" class="w-full h-full object-cover" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/500x750/1f2937/ef4444?text=No+Poster';">
                        <div class="absolute inset-0 bg-black bg-opacity-50" style="opacity: ${item.watched || item.rejected ? 0.7 : 0}; transition: opacity 0.3s;"></div>
                        <div class="status-overlay absolute inset-0 flex justify-center items-center">
                            <i class="fas ${overlayIcon} fa-4x"></i>
                        </div>
                        ${!item.poster_path ? `
                         <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                            <h3 class="font-bold text-sm text-white text-shadow-lg">${item.title}</h3>
                        </div>` : ''}
                    </div>`;
            }).join('');
        }

        function renderListView(items) {
            const listEl = document.getElementById('movie-list');
            listEl.innerHTML = items.map(item => {
                const avgRating = item.ratings ? (Object.values(item.ratings).filter(r => r !== null).reduce((a, b) => a + b, 0) / Object.values(item.ratings).filter(r => r !== null).length) || 0 : 0;
                let ratingStars = '';
                for (let i = 1; i <= 10; i++) {
                    if (avgRating >= i) {
                        ratingStars += '<i class="fa-solid fa-star"></i>';
                    } else if (avgRating === i - 0.5) {
                        ratingStars += '<i class="fa-solid fa-star-half-alt"></i>';
                    } else {
                        ratingStars += '<i class="fa-regular fa-star"></i>';
                    }
                }
                let rowClass = 'opacity-100';
                if (item.watched) rowClass = 'opacity-50';
                if (item.rejected) rowClass = 'opacity-50 rejected-list-item';
                let favoriteClass = '';
                if (item.favoritedBy) {
                    if (item.favoritedBy.includes('user1') && item.favoritedBy.includes('user2')) {
                        favoriteClass = 'super-favorite-glow glossy-overlay';
                    } else if (item.favoritedBy.length > 0) {
                        favoriteClass = 'favorite-glow';
                    }
                } else {
                    favoriteClass = '';
                }
                return `
                <div data-item-id="${item.id}" class="bg-gray-800 rounded-lg p-3 flex items-center gap-4 transition-opacity ${rowClass} ${favoriteClass}">
                    <div class="flex-shrink-0 w-10 text-center">
                        <input type="checkbox" ${item.watched ? 'checked' : ''} ${item.rejected ? 'disabled' : ''} class="w-6 h-6 rounded bg-gray-700 border-gray-600 text-red-600 focus:ring-red-500 cursor-pointer" onchange="toggleWatchedStatus(${item.id}, this.checked)">
                    </div>
                    <div class="flex-grow">
                        <p class="font-bold">${item.rejected ? `<s>${item.title}</s>` : item.title}</p>
                        <p class="text-sm text-gray-400">${item.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="star-container text-lg" title="Average Rating: ${avgRating.toFixed(1)}">${ratingStars}</div>
                        <button class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm font-semibold" onclick="openModal(${item.id})">Details</button>
                    </div>
                </div>`;
            }).join('');
        }

        function updateStats() {
            if (!marathonState.items || marathonState.items.length === 0) return;
            const itemsToConsider = marathonState.items.filter(item => {
                if (currentFilter === 'all') return true;
                if (currentFilter === 'tv') return ['tv', 'one-shot'].includes(item.type);
                return item.type === currentFilter;
            });
            const watchedItems = itemsToConsider.filter(i => i.watched);
            const totalRuntime = itemsToConsider.reduce((sum, i) => sum + (i.runtime || 0), 0);
            const watchedRuntime = watchedItems.reduce((sum, i) => sum + (i.runtime || 0), 0);
            const percentage = itemsToConsider.length > 0 ? Math.round((watchedItems.length / itemsToConsider.length) * 100) : 0;
            
            document.getElementById('hours-watched').textContent = formatTime(watchedRuntime);
            document.getElementById('hours-left').textContent = formatTime(totalRuntime - watchedRuntime);
            document.getElementById('movies-watched').textContent = `${watchedItems.length} / ${itemsToConsider.length}`;
            document.getElementById('progress-bar').style.width = `${percentage}%`;
            document.getElementById('progress-percent').textContent = `${percentage}%`;

            updateNextUpTeaser(itemsToConsider);
            updateExtendedStats(itemsToConsider);
            if (userSettings.nextUpWallpaperEnabled) {
                updateNextUpWallpaper();
            }
        }

        function updateNextUpTeaser(items) {
            let potentialNextItems = items.filter(item => !item.watched && !item.rejected);

            if (currentFilter === 'movie') {
                potentialNextItems = potentialNextItems.filter(item => item.type === 'movie');
            } else if (currentFilter === 'tv') {
                potentialNextItems = potentialNextItems.filter(item => ['tv', 'one-shot'].includes(item.type));
            }

            if (!showOnlyNonMCU) {
                potentialNextItems = potentialNextItems.filter(item => !item.not_mcu);
            }

            const nextItem = potentialNextItems[0];
            const teaserEl = document.getElementById('next-up-teaser');
            const hypeEl = document.getElementById('next-up-hype');

            if (nextItem) {
                nextUpId = nextItem.id;
                if (lastNextUpId === nextUpId) return;
                lastNextUpId = nextUpId;

                const posterUrl = nextItem.poster_path ? `https://image.tmdb.org/t/p/w500${nextItem.poster_path}` : `https://placehold.co/500x750/1f2937/ef4444?text=${encodeURIComponent(nextItem.title)}`;
                document.getElementById('next-up-poster').src = posterUrl;
                document.getElementById('next-up-title').textContent = nextItem.title;
                document.getElementById('next-up-runtime').textContent = formatTime(nextItem.runtime || 0);
                
                if (userSettings.aiDisabled) {
                    hypeEl.textContent = nextItem.overview;
                    document.getElementById('next-up-refresh-btn').style.display = 'none';
                    document.querySelector('#next-up-teaser img[alt="Jarvis"]').style.display = 'none';
                    teaserEl.classList.remove('hidden');
                    return;
                } else {
                    document.querySelector('#next-up-teaser img[alt="Jarvis"]').style.display = 'inline-block';
                }

                const generateAndSetHype = async (force = false) => {
                    hypeEl.innerHTML = 'Jarvis is thinking...';
                    const hypeSentence = await getOrGenerateHypeSentence(nextItem, force);
                    hypeEl.innerHTML = parseMarkdown(hypeSentence);
                };

                generateAndSetHype();

                const refreshBtn = document.getElementById('next-up-refresh-btn');
                let isCoolingDown = false;
                refreshBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (isCoolingDown) {
                        hypeEl.textContent = 'Jarvis is cooling down...';
                        return;
                    }
                    generateAndSetHype(true);
                    if (!userSettings.quotaConservation) {
                        isCoolingDown = true;
                        setTimeout(() => {
                            isCoolingDown = false;
                        }, 2000);
                    }
                };
                refreshBtn.style.display = 'inline-block';
                
                teaserEl.classList.remove('hidden');
            } else {
                nextUpId = null;
                lastNextUpId = null;
                teaserEl.classList.add('hidden');
            }
        }

        function updateExtendedStats(items) {
            const extendedStatsEl = document.getElementById('extended-stats');
            const phaseProgress = {};

            for (const phase in marvelPhases) {
                const phaseTitles = marvelPhases[phase];
                const phaseItems = items.filter(item => phaseTitles.includes(item.title));
                const watchedPhaseItems = phaseItems.filter(item => item.watched);
                const percentage = phaseItems.length > 0 ? Math.round((watchedPhaseItems.length / phaseItems.length) * 100) : 0;

                if (phaseItems.length > 0) {
                    phaseProgress[phase] = {
                        percentage,
                        watched: watchedPhaseItems.length,
                        total: phaseItems.length,
                    };
                }
            }

            extendedStatsEl.innerHTML = Object.entries(phaseProgress).map(([phase, progress]) => `
                <div class="mb-4">
                    <div class="flex justify-between items-center mb-1">
                        <span class="font-semibold text-text-primary">Phase ${phase}</span>
                        <span class="text-sm text-text-muted">${progress.watched} / ${progress.total}</span>
                    </div>
                    <div class="w-full bg-bg-tertiary rounded-full h-2.5">
                        <div class="bg-accent-primary h-2.5 rounded-full" style="width: ${progress.percentage}%"></div>
                    </div>
                </div>
            `).join('');
        }
        
        function formatTime(totalMinutes) {
            if (isNaN(totalMinutes) || totalMinutes < 0) return '0h 0m';
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${hours}h ${minutes}m`;
        }

        const modalElements = {
            modal: document.getElementById('movie-modal'),
            backdrop: document.getElementById('modal-backdrop-image'),
            logoContainer: document.getElementById('modal-logo-container'),
            title: document.getElementById('modal-title'),
            releaseYear: document.getElementById('modal-release-year'),
            contentRating: document.getElementById('modal-content-rating'),
            runtime: document.getElementById('modal-runtime'),
            overview: document.getElementById('modal-overview'),
            imdbLink: document.getElementById('modal-imdb-link'),
            score: document.getElementById('modal-score'),
            toggleWatchedBtn: document.getElementById('toggle-watched-btn'),
            toggleRejectedBtn: document.getElementById('toggle-rejected-btn'),
            juainnyRating: document.getElementById('juainny-rating'),
            erickRating: document.getElementById('erick-rating'),
            removeRatingBtn: document.getElementById('remove-rating-btn'),
            notesSection: document.getElementById('notes-section'),
            juainnyNotes: document.getElementById('juainny-notes'),
            erickNotes: document.getElementById('erick-notes'),
            jarvisSection: document.getElementById('jarvis-summary-section'),
            jarvisSummaryText: document.getElementById('jarvis-summary-text'),
            addMoodBtn: document.getElementById('add-mood-btn'),
            moodDisplay: document.getElementById('modal-mood-display'),
            favoriteBtn: document.getElementById('favorite-btn')
        };

        function getScrollbarWidth() {
            return window.innerWidth - document.documentElement.clientWidth;
        }

        window.closeModal = () => {
            document.body.style.paddingRight = '';
            document.body.classList.remove('body-no-scroll');
            modalElements.modal.classList.add('modal-hidden');
            currentModalId = null;
        }

        let startTime = new Date();

        function updateEndTime(runtime) {
            const endTimeCalculator = document.getElementById('end-time-calculator');
            if (!endTimeCalculator) return;

            const hourSpan = document.getElementById('start-time-hour');
            const minuteSpan = document.getElementById('start-time-minute');
            const endTimeSpan = document.getElementById('end-time');

            const end = new Date(startTime.getTime() + runtime * 60000);

            hourSpan.textContent = String(startTime.getHours()).padStart(2, '0');
            minuteSpan.textContent = String(startTime.getMinutes()).padStart(2, '0');
            endTimeSpan.textContent = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
        }

        window.openModal = async (itemId) => {
            currentModalId = itemId;
            const item = marathonState.items.find(i => i.id === itemId);
            if (!item) return;

            console.log('Opening modal for item:', item.title);

            const modalContent = modalElements.modal.querySelector('.movie-modal-content');

            const [images, releaseDates, imdbData] = await Promise.all([
                fetchTMDbImages(item.tmdbId, item.type),
                item.type === 'movie' ? fetchTMDbReleaseDates(item.tmdbId) : Promise.resolve(null),
                fetch(`https://theapache64.com/movie_db/search?keyword=${encodeURIComponent(item.title)}`).then(res => res.json())
            ]);

            const englishLogo = images?.logos?.find(logo => logo.iso_639_1 === 'en');
            const logoToUse = englishLogo || images?.logos?.[0];

            const usRelease = releaseDates?.results?.find(r => r.iso_3166_1 === 'US');
            const certification = usRelease?.release_dates[0]?.certification || 'N/A';

            // --- Preload images ---
            const backdropUrl = item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : 'https://placehold.co/1280x720/111827/ef4444?text=Image+Not+Found';
            const preloadImage = (url, callback) => {
                const img = new Image();
                img.src = url;
                img.onload = () => callback(img);
                img.onerror = () => callback(null); // Pass null on error
            };

            preloadImage(backdropUrl, (img) => {
                // Use requestAnimationFrame to ensure smooth UI updates
                requestAnimationFrame(() => {
                    modalElements.backdrop.src = img ? backdropUrl : 'https://placehold.co/1280x720/111827/ef4444?text=Image+Not+Found';

                    // --- Logo and Title ---
                    modalElements.title.textContent = item.title; // Always set the title for accessibility
                    if (logoToUse) {
                        const logoUrl = `https://image.tmdb.org/t/p/original${logoToUse.file_path}`;
                        modalElements.logoContainer.innerHTML = `<img src="${logoUrl}" alt="${item.title} Logo" class="max-h-24" style="filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.9));">`;
                        modalElements.title.classList.add('hidden'); // Hide text title if logo is present
                    } else {
                        modalElements.logoContainer.innerHTML = ''; // Clear any previous logo
                        modalElements.title.classList.remove('hidden');
                    }

                    // --- Info Pills ---
                    modalElements.releaseYear.textContent = (item.release_date || 'N/A').split('-')[0];
                    modalElements.runtime.textContent = formatTime(item.runtime || 0);
                    modalElements.contentRating.textContent = certification;

                    const infoPill = modalElements.releaseYear.parentElement;

                    // Remove old genres to avoid duplication on re-renders
                    infoPill.querySelectorAll('.genre').forEach(el => el.remove());
                    infoPill.querySelectorAll('.genre-separator').forEach(el => el.remove());

                    if (item.genres && item.genres.length > 0) {
                        item.genres.slice(0, 2).forEach(genre => {
                            const separator = document.createElement('span');
                            separator.className = 'genre-separator';
                            separator.textContent = ' • ';
                            infoPill.appendChild(separator);

                            const genreEl = document.createElement('span');
                            genreEl.className = 'genre';
                            genreEl.textContent = genre.name;
                            infoPill.appendChild(genreEl);
                        });
                    }

                    document.getElementById('title-tooltip').setAttribute('title', item.title);

                    // --- Overview and Links ---
                    modalElements.overview.textContent = item.overview || 'No overview available.';
                    startTime = new Date();
                    updateEndTime(item.runtime);

                    const endTimeCalculator = document.getElementById('end-time-calculator');
                    if (item.watched) {
                        endTimeCalculator.classList.add('hidden');
                    } else {
                        endTimeCalculator.classList.remove('hidden');
                    }

                    modalElements.imdbLink.href = `https://www.imdb.com/title/${item.imdbId}/`;
                    modalElements.score.textContent = imdbData.data ? `${imdbData.data.rating} / 10` : (item.vote_average ? `${item.vote_average.toFixed(1)} / 10` : 'N/A');

                    // --- Buttons and Toggles ---
                    modalElements.toggleWatchedBtn.textContent = item.watched ? 'Unwatch' : 'Mark as Watched';
                    modalElements.toggleWatchedBtn.className = `w-full text-text-primary font-bold py-3 px-4 rounded-lg transition ${item.watched ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-success hover:opacity-80'}`;

                    modalElements.toggleRejectedBtn.innerHTML = item.rejected ? 'Undo Reject' : '<i class="fas fa-times"></i>';
                    modalElements.toggleRejectedBtn.className = `w-[30%] text-text-primary font-bold py-3 px-4 rounded-lg transition ${item.rejected ? 'bg-bg-tertiary hover:opacity-80' : 'bg-danger hover:opacity-80'}`;

                    // --- Ratings ---
                    if (!item.ratings) item.ratings = { user1: null, user2: null };
                    updateRatingStars('juainny-rating', item.ratings.user1);
                    updateRatingStars('erick-rating', item.ratings.user2);
                    document.getElementById('juainny-rating-input').value = item.ratings.user1;
                    document.getElementById('erick-rating-input').value = item.ratings.user2;
                    modalElements.removeRatingBtn.classList.toggle('hidden', !item.ratings.user1 && !item.ratings.user2);

                    // --- Notes and Jarvis ---
                    const removeMoodBtn = document.getElementById('remove-mood-btn');
                    removeMoodBtn.classList.toggle('hidden', !item.moods || (!item.moods.user1 && !item.moods.user2));

                    if (item.watched) {
                        modalElements.notesSection.classList.remove('hidden');
                        modalElements.juainnyNotes.value = item.notes?.user1 || '';
                        modalElements.erickNotes.value = item.notes?.user2 || '';

                        if (userSettings.aiDisabled) {
                            modalElements.jarvisSection.classList.add('hidden');
                        } else {
                            modalElements.jarvisSection.classList.remove('hidden');
                            updateJarvisSummary(item);
                            document.getElementById('jarvis-summary-refresh-btn').onclick = () => {
                                updateJarvisSummary(item, true);
                            };
                        }
                    } else {
                        modalElements.notesSection.classList.add('hidden');
                        modalElements.jarvisSection.classList.add('hidden');
                    }

                    // --- Final UI updates ---
                    updateFavoriteButton(item);
                    updateMoodDisplay(item);
                    const scrollbarWidth = getScrollbarWidth();
                    document.body.style.paddingRight = `${scrollbarWidth}px`;
                    document.body.classList.add('body-no-scroll');
                    modalElements.modal.classList.remove('hidden');
                    modalElements.modal.classList.remove('modal-hidden');
                });
            });
        }

        async function updateJarvisSummary(item, force = false) {
            const summaryEl = document.getElementById('jarvis-summary-text');
            if (!summaryEl) return;

            if (!force && item.jarvisSummary) {
                summaryEl.innerHTML = parseMarkdown(item.jarvisSummary);
                return;
            }

            summaryEl.innerHTML = '<i>Jarvis is thinking...</i>';

            const summary = await generateJarvisSummary(item.title, item.ratings, item.notes, item.moods);
            const itemIndex = marathonState.items.findIndex(i => i.id === item.id);
            if (itemIndex > -1) {
                marathonState.items[itemIndex].jarvisSummary = summary;
                updateFirestoreState();
            }
            summaryEl.innerHTML = parseMarkdown(summary);
        }

        function renderItem(item) {
            const container = document.querySelector(`[data-item-id="${item.id}"]`);
            if (!container) return;

            if (currentView === 'grid') {
                const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : `https://placehold.co/500x750/1f2937/ef4444?text=${encodeURIComponent(item.title)}`;
                const overlayClass = item.watched ? 'watched' : (item.rejected ? 'rejected' : '');
                const overlayIcon = item.watched ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-500';

                container.innerHTML = `
                        <img src="${posterUrl}" alt="${item.title}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='https://placehold.co/500x750/1f2937/ef4444?text=No+Poster';">
                        <div class="absolute inset-0 bg-black bg-opacity-50" style="opacity: ${item.watched || item.rejected ? 0.7 : 0}; transition: opacity 0.3s;"></div>
                        <div class="status-overlay absolute inset-0 flex justify-center items-center">
                            <i class="fas ${overlayIcon} fa-4x"></i>
                        </div>
                         <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                            <h3 class="font-bold text-sm text-white text-shadow-lg">${item.title}</h3>
                        </div>`;
                container.className = `movie-card relative rounded-lg overflow-hidden cursor-pointer shadow-lg transition-transform duration-200 ${overlayClass}`;
            } else {
                const avgRating = item.ratings ? (Object.values(item.ratings).filter(r => r !== null).reduce((a, b) => a + b, 0) / Object.values(item.ratings).filter(r => r !== null).length) || 0 : 0;
                const ratingStars = [...Array(10)].map((_, i) => `<i class="fa-${avgRating > i ? 'solid' : 'regular'} fa-star"></i>`).join('');
                let rowClass = 'opacity-100';
                if (item.watched) rowClass = 'opacity-50';
                if (item.rejected) rowClass = 'opacity-50 rejected-list-item';

                container.innerHTML = `
                    <div class="flex-shrink-0 w-10 text-center">
                        <input type="checkbox" ${item.watched ? 'checked' : ''} ${item.rejected ? 'disabled' : ''} class="w-6 h-6 rounded bg-gray-700 border-gray-600 text-red-600 focus:ring-red-500 cursor-pointer" onchange="toggleWatchedStatus(${item.id}, this.checked)">
                    </div>
                    <div class="flex-grow">
                        <p class="font-bold">${item.rejected ? `<s>${item.title}</s>` : item.title}</p>
                        <p class="text-sm text-gray-400">${item.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="text-yellow-400 text-lg" title="Average Rating: ${avgRating.toFixed(1)}">${ratingStars}</div>
                        <button class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm font-semibold" onclick="openModal(${item.id})">Details</button>
                    </div>`;
                container.className = `bg-gray-800 rounded-lg p-3 flex items-center gap-4 transition-opacity ${rowClass}`;
            }
        }

        window.closeModal = () => {
            document.body.classList.remove('body-no-scroll');
            modalElements.modal.classList.add('modal-hidden');
            currentModalId = null;
        }

        function updateCard(item) {
            const card = document.querySelector(`.movie-card[data-item-id="${item.id}"]`);
            if (card) {
                const overlayClass = item.watched ? 'watched' : (item.rejected ? 'rejected' : '');
                card.className = `movie-card relative rounded-lg overflow-hidden cursor-pointer shadow-lg transition-transform duration-200 ${overlayClass}`;
                const overlay = card.querySelector('.bg-black');
                overlay.style.opacity = item.watched || item.rejected ? 0.7 : 0;
                const icon = card.querySelector('.status-overlay i');
                icon.className = `fas ${item.watched ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-500'} fa-4x`;
            }
        }

        window.toggleWatchedStatus = (itemId, isChecked, fromModal = false) => {
            const itemIndex = marathonState.items.findIndex(i => i.id === itemId);
            if (itemIndex > -1) {
                const item = marathonState.items[itemIndex];
                item.watched = typeof isChecked === 'boolean' ? isChecked : !item.watched;
                if (item.watched) {
                    item.rejected = false; // Cannot be watched and rejected
                    item.watched_timestamp = new Date().toISOString();
                } else {
                    // Also clear timestamp when un-watching
                    item.watched_timestamp = null;
                }
                updateCard(item);
                updateStats();
                document.getElementById('save-banner').classList.remove('hidden');
                if (fromModal) {
                    openModal(itemId); // Re-open to refresh the state
                } else if (currentModalId === itemId) {
                    closeModal();
                }
            }
        }

        window.toggleRejectedStatus = (itemId) => {
            const itemIndex = marathonState.items.findIndex(i => i.id === itemId);
            if (itemIndex > -1) {
                const item = marathonState.items[itemIndex];
                item.rejected = !item.rejected;
                if (item.rejected) item.watched = false; // Cannot be watched and rejected
                updateCard(item);
                updateStats();
                updateFirestoreState();
                if (currentModalId === itemId) closeModal();
            }
        }
        
        function updateRatingStars(containerId, rating) {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`[updateRatingStars] Container with id "${containerId}" not found.`);
                return;
            }
            container.innerHTML = ''; // Clear existing stars
            const starContainer = document.createElement('div');
            starContainer.className = 'star-container';
            for (let i = 1; i <= 10; i++) {
                const star = document.createElement('i');
                star.dataset.value = i;
                if (rating >= i) {
                    star.className = 'fa-solid fa-star star filled';
                } else if (rating === i - 0.5) {
                    star.className = 'fa-solid fa-star-half-alt star half-filled';
                } else {
                    star.className = 'fa-regular fa-star star';
                }
                if (window.innerWidth < 768) {
                    star.classList.add('text-sm');
                }
                starContainer.appendChild(star);
            }
            container.appendChild(starContainer);
        }
        
        function handleSetRating(user, rating) {
            if (currentModalId === null) return;

            const itemIndex = marathonState.items.findIndex(i => i.id === currentModalId);
            if (itemIndex > -1) {
                const item = marathonState.items[itemIndex];
                if (!item.ratings) item.ratings = { user1: null, user2: null };

                const newRating = rating;
                item.ratings[user] = newRating;
                item.jarvisSummary = null; // Invalidate summary
                if (newRating !== null) {
                    item.watched = true;
                }

                const containerId = user === 'user1' ? 'juainny-rating' : 'erick-rating';
                const inputId = user === 'user1' ? 'juainny-rating-input' : 'erick-rating-input';
                updateRatingStars(containerId, rating);
                document.getElementById(inputId).value = rating;


                document.getElementById('remove-rating-btn').classList.toggle('hidden', !item.ratings.user1 && !item.ratings.user2);
                updateFirestoreState();

                // Trigger confetti
                if (rating) {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
            }
        }
        
        function autoResizeTextarea(element) {
            if (element && element.style.display !== 'none') {
                element.style.height = 'auto';
                element.style.height = (element.scrollHeight) + 'px';
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const searchBar = document.getElementById('search-bar');
            searchBar.addEventListener('input', handleSearch);

            const exportBtn = document.getElementById('export-btn');
            exportBtn.addEventListener('click', exportList);

            modalElements.modal.addEventListener('transitionend', () => {
                if (modalElements.modal.classList.contains('modal-hidden')) {
                    modalElements.modal.classList.add('hidden');
                }
            });

            document.getElementById('close-modal-btn').addEventListener('click', closeModal);

            document.getElementById('movie-modal').addEventListener('click', (e) => {
                // We only close the modal if the click is on the backdrop itself
                if (e.target.id === 'movie-modal') {
                    closeModal();
                }
            });

            document.getElementById('toggle-watched-btn').addEventListener('click', () => toggleWatchedStatus(currentModalId, !marathonState.items.find(i => i.id === currentModalId).watched, true));
            document.getElementById('toggle-rejected-btn').addEventListener('click', () => toggleRejectedStatus(currentModalId));
            
            document.getElementById('juainny-rating').addEventListener('click', (e) => {
                const star = e.target.closest('.star');
                if (star) {
                    const rect = star.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const rating = parseInt(star.dataset.value);
                    const newRating = clickX < rect.width / 2 ? rating - 0.5 : rating;
                    handleSetRating('user1', newRating);
                }
            });

            document.getElementById('erick-rating').addEventListener('click', (e) => {
                const star = e.target.closest('.star');
                if (star) {
                    const rect = star.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const rating = parseInt(star.dataset.value);
                    const newRating = clickX < rect.width / 2 ? rating - 0.5 : rating;
                    handleSetRating('user2', newRating);
                }
            });

            document.getElementById('juainny-rating-input').addEventListener('change', (e) => {
                handleSetRating('user1', parseFloat(e.target.value));
            });
            document.getElementById('erick-rating-input').addEventListener('change', (e) => {
                handleSetRating('user2', parseFloat(e.target.value));
            });
            document.getElementById('remove-rating-btn').addEventListener('click', () => {
                handleSetRating('user1', null);
                handleSetRating('user2', null);
            });

            document.getElementById('remove-mood-btn').addEventListener('click', () => {
                if (currentModalId !== null) {
                    const itemIndex = marathonState.items.findIndex(i => i.id === currentModalId);
                    if (itemIndex > -1) {
                        marathonState.items[itemIndex].moods = {};
                        updateFirestoreState();
                        openModal(currentModalId);
                    }
                }
            });

            document.getElementById('filter-controls').addEventListener('click', (e) => {
                const button = e.target.closest('.filter-btn');
                if (button) {
                    document.querySelector('.filter-btn.btn-active').classList.remove('btn-active');
                    button.classList.add('btn-active');
                    currentFilter = button.dataset.filter;

                    const nonMcuBtn = document.getElementById('non-mcu-filter-btn');
                    nonMcuBtn.style.display = (currentFilter === 'tv') ? 'none' : 'block';
                    renderUI();
                }
            });

            const nonMcuBtn = document.getElementById('non-mcu-filter-btn');
            nonMcuBtn.classList.toggle('btn-active', showOnlyNonMCU);

            nonMcuBtn.addEventListener('click', (e) => {
                showOnlyNonMCU = !showOnlyNonMCU;
                e.currentTarget.classList.toggle('btn-active', showOnlyNonMCU);
                renderUI();
            });

            document.getElementById('view-controls').addEventListener('click', (e) => {
                if (e.target.closest('.view-btn')) {
                    const btn = e.target.closest('.view-btn');
                    document.querySelector('.view-btn.btn-active').classList.remove('btn-active');
                    btn.classList.add('btn-active');
                    currentView = btn.dataset.view;
                    renderUI();
                }
            });

            document.getElementById('random-movie-btn').addEventListener('click', () => {
                const unwatchedItems = marathonState.items.filter(item => !item.watched);
                if (unwatchedItems.length > 0) {
                    const button = document.getElementById('random-movie-btn');
                    button.disabled = true;
                    let shuffles = 0;
                    const maxShuffles = 10;
                    const interval = setInterval(() => {
                        const randomItem = unwatchedItems[Math.floor(Math.random() * unwatchedItems.length)];
                        document.getElementById('next-up-poster').src = randomItem.poster_path ? `https://image.tmdb.org/t/p/w500${randomItem.poster_path}` : `https://placehold.co/500x750/1f2937/ef4444?text=${encodeURIComponent(randomItem.title)}`;
                        document.getElementById('next-up-title').textContent = randomItem.title;

                        shuffles++;
                        if (shuffles >= maxShuffles) {
                            clearInterval(interval);
                            const finalItem = unwatchedItems[Math.floor(Math.random() * unwatchedItems.length)];
                            openModal(finalItem.id);
                            button.disabled = false;
                        }
                    }, 100);
                }
            });

            document.getElementById('extend-stats-btn').addEventListener('click', (e) => {
                const extendedStats = document.getElementById('extended-stats');
                const icon = e.currentTarget.querySelector('i');
                extendedStats.classList.toggle('hidden');
                icon.classList.toggle('rotate-180');
            });

            document.getElementById('next-up-teaser').addEventListener('click', () => {
                if (nextUpId !== null) {
                    openModal(nextUpId);
                }
            });

            const juainnyNotes = document.getElementById('juainny-notes');
            const erickNotes = document.getElementById('erick-notes');

            juainnyNotes.addEventListener('input', () => autoResizeTextarea(juainnyNotes));
            erickNotes.addEventListener('input', () => autoResizeTextarea(erickNotes));

            juainnyNotes.addEventListener('change', (e) => {
                if (currentModalId === null) return;
                const itemIndex = marathonState.items.findIndex(i => i.id === currentModalId);
                if (itemIndex > -1) {
                    if (!marathonState.items[itemIndex].notes) marathonState.items[itemIndex].notes = { user1: "", user2: "" };
                    marathonState.items[itemIndex].notes.user1 = e.target.value;
                    marathonState.items[itemIndex].jarvisSummary = null; // Invalidate summary
                    updateFirestoreState();
                }
            });

            erickNotes.addEventListener('change', (e) => {
                if (currentModalId === null) return;
                const itemIndex = marathonState.items.findIndex(i => i.id === currentModalId);
                if (itemIndex > -1) {
                    if (!marathonState.items[itemIndex].notes) marathonState.items[itemIndex].notes = { user1: "", user2: "" };
                    marathonState.items[itemIndex].notes.user2 = e.target.value;
                    marathonState.items[itemIndex].jarvisSummary = null; // Invalidate summary
                    updateFirestoreState();
                }
            });

    const userMenuBtn = document.getElementById('user-menu-btn');
    const userMenu = document.getElementById('user-menu');
    const notificationBtn = document.getElementById('notification-btn');
    const notificationModal = document.getElementById('notification-modal');
    const closeNotificationModalBtn = document.getElementById('close-notification-modal-btn');

    userMenuBtn.addEventListener('click', () => {
        userMenu.classList.toggle('hidden');
    });

    notificationBtn.addEventListener('click', () => {
        notificationModal.classList.remove('hidden');
        notificationModal.classList.add('flex');
    });

    window.closeNotificationModal = () => {
        notificationModal.classList.add('hidden');
        notificationModal.classList.remove('flex');
    }

    closeNotificationModalBtn.addEventListener('click', closeNotificationModal);
    document.getElementById('settings-btn').addEventListener('click', () => {
        openSettingsModal();
        userMenu.classList.add('hidden');
    });
    document.getElementById('close-settings-modal-btn').addEventListener('click', closeSettingsModal);

    document.getElementById('theme-picker').addEventListener('click', (e) => {
        const themeBtn = e.target.closest('.theme-btn');
        if (themeBtn) {
            const newTheme = themeBtn.dataset.theme;
            updateTheme(newTheme);
        }
    });

    const avatarPicker = new AvatarPicker((user, avatarData) => {
        if (!userSettings.avatars) {
            userSettings.avatars = {};
        }
        userSettings.avatars[user] = avatarData;
        updateUserSettings({ avatars: userSettings.avatars });
    });
    window.avatarPicker = avatarPicker; // Make it globally accessible

    document.getElementById('avatar-picker-user1-btn').addEventListener('click', () => {
        avatarPicker.open();
    });
    document.getElementById('avatar-picker-user2-btn').addEventListener('click', () => {
        avatarPicker.open();
    });

    document.getElementById('movie-banner-select').addEventListener('change', handleMovieBannerSelect);
            document.getElementById('remove-wallpaper-btn').addEventListener('click', handleRemoveWallpaper);
            document.getElementById('next-up-wallpaper-toggle').addEventListener('change', handleNextUpWallpaperToggle);
            document.getElementById('next-up-wallpaper-type').addEventListener('change', handleNextUpWallpaperTypeChange);
            document.getElementById('next-up-wallpaper-non-mcu').addEventListener('change', handleNextUpWallpaperNonMCUChange);
            document.getElementById('soft-refresh-btn').addEventListener('click', softRefresh);
            document.getElementById('emergency-refresh-btn').addEventListener('click', emergencyRefresh);
            document.getElementById('favorite-btn').addEventListener('click', () => {
                const menu = document.getElementById('user-selection-menu');
                menu.classList.toggle('hidden');
            });

            document.getElementById('user1-btn').addEventListener('click', () => {
                handleFavorite('user1');
                document.getElementById('user-selection-menu').classList.add('hidden');
            });

            document.getElementById('user2-btn').addEventListener('click', () => {
                handleFavorite('user2');
                document.getElementById('user-selection-menu').classList.add('hidden');
            });

            document.getElementById('remove-all-btn').addEventListener('click', () => {
                const item = marathonState.items.find(i => i.id === currentModalId);
                if (item && item.favoritedBy) {
                    item.favoritedBy = [];
                }
                updateFirestoreState();
                openModal(currentModalId);
                document.getElementById('user-selection-menu').classList.add('hidden');
            });

            document.getElementById('mark-all-as-read-btn').addEventListener('click', () => {
                notifications.forEach(n => {
                    if (!n.unreadBy.includes(userId)) {
                        n.unreadBy.push(userId);
                    }
                });
                updateFirestoreNotifications();
            });

            document.getElementById('add-notification-btn').addEventListener('click', async () => {
                const newId = `notif-${Date.now()}`;
                const newNotification = {
                    id: newId,
                    type: 'announcement',
                    title: 'New Notification',
                    summary: 'This is a new notification that you can edit.',
                    description: 'Click the pencil icon to start editing.',
                    date: new Date().toISOString().split('T')[0],
                    unreadBy: []
                };

                notifications.unshift(newNotification);

                try {
                    await updateFirestoreNotifications();
                    showPopup('Notification added!');
                    renderNotifications();
                } catch (error) {
                    console.error("Error updating Firestore:", error);
                    showPopup('Error adding notification. See console for details.');
                    notifications.shift();
                    renderNotifications();
                }
            });

            const deviceNameInput = document.getElementById('device-name-input');
            deviceNameInput.addEventListener('change', (e) => {
                localStorage.setItem('deviceName', e.target.value);
                loadDeviceName();
            });

            const resetDeviceNameBtn = document.getElementById('reset-device-name-btn');
            resetDeviceNameBtn.addEventListener('click', () => {
                localStorage.removeItem('deviceName');
                loadDeviceName();
            });

            const notificationFilterBar = document.getElementById('notification-filter-bar');
            notificationFilterBar.addEventListener('click', (e) => {
                const button = e.target.closest('.notification-filter-btn');
                if (button) {
                    document.querySelector('.notification-filter-btn.btn-active').classList.remove('btn-active');
                    button.classList.add('btn-active');
                    renderNotifications(button.dataset.filter);
                }
            });
            
            initializeAppAndAuth();
            initializeMoodModal();
            initializeTooltip();
            renderNotifications();
            loadDeviceName();

            const infoIcon = document.getElementById('info-tooltip-icon');
            const infoTooltip = document.getElementById('info-tooltip');

            infoIcon.addEventListener('mouseenter', () => {
                infoTooltip.classList.remove('hidden');
                const rect = infoIcon.getBoundingClientRect();
                infoTooltip.style.left = `${rect.left}px`;
                infoTooltip.style.top = `${rect.bottom + 5}px`;
            });

            infoIcon.addEventListener('mouseleave', () => {
                infoTooltip.classList.add('hidden');
            });

            document.getElementById('start-time-hour').addEventListener('click', () => {
                const newHour = prompt('Enter new hour (0-23):', startTime.getHours());
                if (newHour !== null && !isNaN(newHour) && newHour >= 0 && newHour <= 23) {
                    startTime.setHours(newHour);
                    const item = marathonState.items.find(i => i.id === currentModalId);
                    if(item) updateEndTime(item.runtime);
                }
            });

            document.getElementById('start-time-minute').addEventListener('click', () => {
                const newMinute = prompt('Enter new minute (0-59):', startTime.getMinutes());
                if (newMinute !== null && !isNaN(newMinute) && newMinute >= 0 && newMinute <= 59) {
                    startTime.setMinutes(newMinute);
                    const item = marathonState.items.find(i => i.id === currentModalId);
                    if(item) updateEndTime(item.runtime);
                }
            });
        });

function parseMarkdown(text) {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

async function setupNotificationsListener() {
    const notificationsRef = doc(db, "notifications", "main");
    onSnapshot(notificationsRef, (docSnap) => {
        if (docSnap.exists() && docSnap.data().notifications) {
            notifications = docSnap.data().notifications;
        } else {
            notifications = []; // Ensure notifications is always an array
        }
        renderNotifications();
    });
}

async function updateFirestoreNotifications() {
    console.log('Updating Firestore with notifications:', notifications);
    const notificationsRef = doc(db, "notifications", "main");
    const notificationsWithAuth = { notifications, authKey: SECRET_KEY };
    await setDoc(notificationsRef, notificationsWithAuth, { merge: true });
    console.log('Firestore update call finished.');
}

function renderNotifications(filter = 'all') {
    const notificationList = document.getElementById('notification-list');
    const notificationCount = document.getElementById('notification-count');
    const unreadCount = document.getElementById('unread-count');

    notificationList.innerHTML = '';
    let unread = 0;

    const filteredNotifications = notifications.sort((a, b) => new Date(b.date) - new Date(a.date)).filter(notification => {
        if (filter === 'all') {
            return true;
        }
        return notification.type.startsWith(filter);
    });

    filteredNotifications.forEach(notification => {
        const isUnread = !notification.unreadBy.includes(userId);
        if (isUnread) {
            unread++;
        }
        const item = document.createElement('div');
        item.className = `notification-card ${isUnread ? 'unread' : ''}`;
        item.dataset.id = notification.id;
        item.innerHTML = `
            <div class="flex items-center">
                <div class="dot ${notification.type}"></div>
                <div class="flex-grow">
                    <h3 class="font-bold" contenteditable="false">${notification.title}</h3>
                    <p class="text-sm text-text-muted" contenteditable="false">${notification.type}</p>
                </div>
                <button class="ml-auto text-xs text-accent-primary hover:underline mark-as-read-btn">${isUnread ? 'Mark as read' : 'Mark as unread'}</button>
                <button class="ml-2 text-xs text-accent-primary hover:underline edit-notification-btn"><i class="fas fa-pencil-alt"></i></button>
                <i class="fas fa-chevron-right arrow ml-4"></i>
            </div>
            <div class="summary">
                <p class="text-sm" contenteditable="false">${notification.summary}</p>
            </div>
            <div class="description">
                <p class="text-sm" contenteditable="false">${notification.description}</p>
            </div>
            <p class="text-xs text-text-muted mt-2">${notification.date}</p>
        `;
        notificationList.appendChild(item);

        item.addEventListener('click', (e) => {
            if (e.target.closest('.mark-as-read-btn')) {
                e.stopPropagation();
                const index = notification.unreadBy.indexOf(userId);
                if (index > -1) {
                    notification.unreadBy.splice(index, 1);
                } else {
                    notification.unreadBy.push(userId);
                }
                updateFirestoreNotifications();
            } else if (!e.target.closest('.edit-notification-btn')) {
                item.classList.toggle('expanded');
            }
        });

        item.querySelector('.edit-notification-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const h3 = item.querySelector('h3');
            const summaryP = item.querySelector('.summary p');
            const descriptionP = item.querySelector('.description p');
            const typeP = item.querySelector('.text-sm.text-text-muted');

            const isEditing = h3.contentEditable === 'true';
            h3.contentEditable = !isEditing;
            summaryP.contentEditable = !isEditing;
            descriptionP.contentEditable = !isEditing;
            typeP.contentEditable = !isEditing;

            if (isEditing) {
                // Save changes
                notification.title = h3.textContent;
                notification.summary = summaryP.textContent;
                notification.description = descriptionP.textContent;
                notification.type = typeP.textContent;
                updateFirestoreNotifications();
                item.querySelector('.edit-notification-btn').innerHTML = '<i class="fas fa-pencil-alt"></i>';
                h3.classList.remove('editing');
                summaryP.classList.remove('editing');
                descriptionP.classList.remove('editing');
                typeP.classList.remove('editing');

            } else {
                // Enter edit mode
                item.querySelector('.edit-notification-btn').innerHTML = '<i class="fas fa-save"></i>';
                h3.classList.add('editing');
                summaryP.classList.add('editing');
                descriptionP.classList.add('editing');
                typeP.classList.add('editing');
                h3.focus();
            }
        });
    });

    if (unread > 0) {
        notificationCount.textContent = unread;
        notificationCount.style.display = 'inline-flex';
        unreadCount.textContent = `${unread} unread notifications`;
    } else {
        notificationCount.style.display = 'none';
        unreadCount.textContent = 'No unread notifications';
    }
}

function loadDeviceName() {
    const deviceName = localStorage.getItem('deviceName');
    const deviceNameEl = document.getElementById('device-name');
    const deviceNameInput = document.getElementById('device-name-input');
    if (deviceName) {
        deviceNameEl.textContent = deviceName;
        deviceNameInput.value = deviceName;
    } else {
        deviceNameEl.textContent = 'User';
        deviceNameInput.value = '';
    }
}

        function updateFavoriteButton(item) {
            if (!item.favoritedBy) item.favoritedBy = [];
            if (item.favoritedBy.includes('user1') && item.favoritedBy.includes('user2')) {
                modalElements.favoriteBtn.classList.add('favorited');
                modalElements.favoriteBtn.querySelector('span').textContent = 'Favorited by Both';
            } else if (item.favoritedBy.includes('user1')) {
                modalElements.favoriteBtn.classList.add('favorited');
                modalElements.favoriteBtn.querySelector('span').textContent = 'Favorited by Juainny';
            } else if (item.favoritedBy.includes('user2')) {
                modalElements.favoriteBtn.classList.add('favorited');
                modalElements.favoriteBtn.querySelector('span').textContent = 'Favorited by Erick';
            } else {
                modalElements.favoriteBtn.classList.remove('favorited');
                modalElements.favoriteBtn.querySelector('span').textContent = 'Favorite';
            }
        }

        function handleFavorite(user) {
            if (currentModalId === null) return;
            const itemIndex = marathonState.items.findIndex(i => i.id === currentModalId);
            if (itemIndex > -1) {
                const item = marathonState.items[itemIndex];
                if (!item.favoritedBy) {
                    item.favoritedBy = [];
                }

                const userIndex = item.favoritedBy.indexOf(user);

                if (userIndex > -1) {
                    item.favoritedBy.splice(userIndex, 1);
                } else {
                    const currentFavorite = marathonState.items.find(i => i.favoritedBy && i.favoritedBy.includes(user));
                    if (currentFavorite) {
                        const index = currentFavorite.favoritedBy.indexOf(user);
                        currentFavorite.favoritedBy.splice(index, 1);
                    }
                    item.favoritedBy.push(user);
                }

                updateFirestoreState();
                openModal(currentModalId);
            }
        }

        document.getElementById('save-changes-banner-btn').addEventListener('click', () => {
            updateFirestoreState();
            document.getElementById('save-banner').classList.add('hidden');
        });

        document.getElementById('discard-changes-banner-btn').addEventListener('click', () => {
            softRefresh();
            document.getElementById('save-banner').classList.add('hidden');
        });

        const quotaConservationToggle = document.getElementById('quota-conservation-toggle');
        const aiDisabledToggle = document.getElementById('ai-disabled-toggle');

        quotaConservationToggle.addEventListener('change', () => {
            if (quotaConservationToggle.checked) {
                aiDisabledToggle.checked = false;
            }
        });

        aiDisabledToggle.addEventListener('change', () => {
            if (aiDisabledToggle.checked) {
                quotaConservationToggle.checked = false;
            }
        });

        document.getElementById('save-settings-btn').addEventListener('click', () => {
            const nextUpWallpaperToggle = document.getElementById('next-up-wallpaper-toggle');
            const nextUpWallpaperType = document.getElementById('next-up-wallpaper-type');
            const nextUpWallpaperNonMcu = document.getElementById('next-up-wallpaper-non-mcu');
            const nextUpWallpaperTV = document.getElementById('next-up-wallpaper-tv');

            const newSettings = {
                quotaConservation: quotaConservationToggle.checked,
                aiDisabled: aiDisabledToggle.checked,
                nextUpWallpaperEnabled: nextUpWallpaperToggle.checked,
                nextUpWallpaperType: nextUpWallpaperType.value,
                nextUpWallpaperIncludeNonMCU: nextUpWallpaperNonMcu.checked,
                nextUpWallpaperIncludeTV: nextUpWallpaperTV.checked
            };

            updateUserSettings(newSettings);
            closeSettingsModal();
        });

        function openSettingsModal() {
            const modal = document.getElementById('settings-modal');
            const select = document.getElementById('movie-banner-select');
            const nextUpWallpaperToggle = document.getElementById('next-up-wallpaper-toggle');
            const nextUpWallpaperType = document.getElementById('next-up-wallpaper-type');
            const nextUpWallpaperNonMcu = document.getElementById('next-up-wallpaper-non-mcu');
            const nextUpWallpaperTV = document.getElementById('next-up-wallpaper-tv');

            nextUpWallpaperToggle.checked = userSettings.nextUpWallpaperEnabled || false;
            nextUpWallpaperType.value = userSettings.nextUpWallpaperType || 'all';
            nextUpWallpaperNonMcu.checked = userSettings.nextUpWallpaperIncludeNonMCU === undefined ? true : userSettings.nextUpWallpaperIncludeNonMCU;
            nextUpWallpaperTV.checked = userSettings.nextUpWallpaperIncludeTV === undefined ? true : userSettings.nextUpWallpaperIncludeTV;

            select.innerHTML = '<option value="">-- Select a Movie --</option>';
            marathonState.items.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.title;
                select.appendChild(option);
            });

            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => modal.classList.remove('modal-hidden'), 10);
        }

        window.closeSettingsModal = () => {
            const modal = document.getElementById('settings-modal');
            modal.classList.add('modal-hidden');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }, 300);
        }

        function openWallpaperModal() {
            const modal = document.getElementById('wallpaper-modal');
            const select = document.getElementById('movie-banner-select');
            const toggle = document.getElementById('next-up-wallpaper-toggle');
            const typeSelect = document.getElementById('next-up-wallpaper-type');
            const nonMcuToggle = document.getElementById('next-up-wallpaper-non-mcu');
            toggle.checked = userSettings.nextUpWallpaperEnabled || false;
            typeSelect.value = userSettings.nextUpWallpaperType || 'all';
            nonMcuToggle.checked = userSettings.nextUpWallpaperIncludeNonMCU === undefined ? true : userSettings.nextUpWallpaperIncludeNonMCU;
            select.innerHTML = '<option value="">-- Select a Movie --</option>';
            marathonState.items.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.title;
                select.appendChild(option);
            });
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => modal.classList.remove('modal-hidden'), 10);
        }

        function closeWallpaperModal() {
            const modal = document.getElementById('wallpaper-modal');
            modal.classList.add('modal-hidden');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }, 300);
        }

        function handleMovieBannerSelect(e) {
            const selectedId = e.target.value;
            if (!selectedId) return;

            const item = marathonState.items.find(i => i.id == selectedId);
            if (item && item.backdrop_path) {
                const wallpaperUrl = `https://image.tmdb.org/t/p/original${item.backdrop_path}`;
                updateUserSettings({ wallpaper: wallpaperUrl, nextUpWallpaperEnabled: false });
                document.getElementById('next-up-wallpaper-toggle').checked = false;
            }
        }

        function handleRemoveWallpaper() {
            updateUserSettings({ wallpaper: null });
            document.body.style.backgroundImage = '';
            document.getElementById('wallpaper-overlay').style.display = 'none';
            closeSettingsModal();
        }

        function handleNextUpWallpaperToggle(e) {
            updateUserSettings({ nextUpWallpaperEnabled: e.target.checked });
            if (e.target.checked) {
                updateNextUpWallpaper();
            }
        }

        function handleNextUpWallpaperTypeChange(e) {
            updateUserSettings({ nextUpWallpaperType: e.target.value });
            if (userSettings.nextUpWallpaperEnabled) {
                updateNextUpWallpaper();
            }
        }

        function handleNextUpWallpaperNonMCUChange(e) {
            updateUserSettings({ nextUpWallpaperIncludeNonMCU: e.target.checked });
            if (userSettings.nextUpWallpaperEnabled) {
                updateNextUpWallpaper();
            }
        }

        function updateNextUpWallpaper() {
            if (!userSettings.nextUpWallpaperEnabled) return;

            const type = userSettings.nextUpWallpaperType || 'all';
            const includeNonMCU = userSettings.nextUpWallpaperIncludeNonMCU === undefined ? true : userSettings.nextUpWallpaperIncludeNonMCU;
            const includeTV = userSettings.nextUpWallpaperIncludeTV === undefined ? true : userSettings.nextUpWallpaperIncludeTV;
            let itemsToFilter = marathonState.items;

            if (!includeNonMCU) {
                itemsToFilter = itemsToFilter.filter(item => !item.not_mcu);
            }

            if (!includeTV) {
                itemsToFilter = itemsToFilter.filter(item => item.type !== 'tv');
            }

            if (type === 'movie') {
                itemsToFilter = itemsToFilter.filter(item => item.type === 'movie');
            } else if (type === 'tv') {
                itemsToFilter = itemsToFilter.filter(item => ['tv', 'one-shot'].includes(item.type));
            }

            const nextItem = itemsToFilter.find(item => !item.watched && !item.rejected);
            if (nextItem && nextItem.backdrop_path) {
                const wallpaperUrl = `https://image.tmdb.org/t/p/original${nextItem.backdrop_path}`;
                // Only update if the wallpaper is different
                if (userSettings.wallpaper !== wallpaperUrl) {
                    updateUserSettings({ wallpaper: wallpaperUrl });
                }
            }
        }

        async function softRefresh() {
            console.log("Starting soft refresh...");
            document.getElementById('loading-spinner').style.display = 'flex';

            const marathonRef = doc(db, "marathon-data", appId);
            const docSnap = await getDoc(marathonRef);

            if (!docSnap.exists()) {
                console.warn("No existing data found. Performing emergency refresh instead.");
                await emergencyRefresh();
                return;
            }

            const existingItems = docSnap.data().items || [];
            const existingItemsMap = new Map(existingItems.map(item => [item.title, item]));
            const newChronology = marvelUniverseChronology;

            const itemsToFetchApiData = newChronology.filter(item => !existingItemsMap.has(item.title));

            console.log(`Found ${existingItems.length} existing items.`);
            console.log(`New chronology has ${newChronology.length} items.`);
            console.log(`${itemsToFetchApiData.length} new items to fetch from API.`);

            const newApiDetails = await Promise.all(itemsToFetchApiData.map(item => getTMDbDetailsWithCache(item, true)));
            const newApiDetailsMap = new Map(itemsToFetchApiData.map((item, i) => [item.title, newApiDetails[i]]));

            const updatedItems = newChronology.map((newItemTemplate, index) => {
                const existingItemData = existingItemsMap.get(newItemTemplate.title);

                if (existingItemData) {
                    // Merge, preserving user data
                    return {
                        ...existingItemData,
                        id: index, // Ensure ID is updated to new chronological order
                        type: newItemTemplate.type,
                        tmdbId: newItemTemplate.tmdbId,
                        imdbId: newItemTemplate.imdbId,
                        not_mcu: newItemTemplate.not_mcu,
                        phase: newItemTemplate.phase
                    };
                } else {
                    // This is a new item, create it from scratch
                    const details = newApiDetailsMap.get(newItemTemplate.title) || {};
                    let finalRuntime = 0;
                     if (details.runtime) {
                        finalRuntime = details.runtime;
                    } else if (Array.isArray(details.episode_run_time) && details.episode_run_time.length > 0) {
                        finalRuntime = details.episode_run_time[0];
                    } else if (newItemTemplate.type === 'one-shot') {
                        finalRuntime = 10;
                    } else {
                        finalRuntime = 45;
                    }

                    return {
                        id: index,
                        tmdbId: newItemTemplate.tmdbId || null,
                        imdbId: newItemTemplate.imdbId || null,
                        title: newItemTemplate.title || "Unknown Title",
                        type: newItemTemplate.type || "movie",
                        not_mcu: newItemTemplate.not_mcu || false,
                        phase: newItemTemplate.phase || null,
                        poster_path: details.poster_path || null,
                        backdrop_path: details.backdrop_path || null,
                        release_date: details.release_date || details.first_air_date || 'N/A',
                        runtime: finalRuntime || 0,
                        vote_average: details.vote_average || 0,
                        overview: details.overview || 'No overview available.',
                        watched: false,
                        rejected: false,
                        ratings: { user1: null, user2: null },
                        notes: { user1: "", user2: "" },
                        jarvisSummary: null,
                        nextUpHype: null
                    };
                }
            });

            console.log(`Final list has ${updatedItems.length} items. Saving to Firestore.`);

            updatedItems.forEach((item, index) => {
                for (const key in item) {
                    if (item[key] === undefined) {
                        console.error(`Item at index ${index} (${item.title}) has an undefined value for key: ${key}`);
                    }
                }
            });

            marathonState.items = updatedItems;
            await updateFirestoreState();

            document.getElementById('loading-spinner').style.display = 'none';
            console.log("Soft refresh complete. Firestore updated, UI will now sync.");
        }

        async function emergencyRefresh() {
            if (confirm("Are you sure you want to perform an Emergency Refresh? This will reset ALL watched progress and ratings for this marathon. This action cannot be undone.")) {
                console.log("Performing emergency refresh. ALL USER DATA WILL BE RESET.");
                await initializeNewMarathon(doc(db, "marathon-data", appId));
            }
        }

function initializeMoodModal() {
    const moods = [
        { name: 'Satisfied', image: 'satisfied.png' },
        { name: 'Thinking', image: 'thinking.png' },
        { name: 'Afraid', image: 'afraid.png' },
        { name: 'Neutral', image: 'neutral.png' },
        { name: 'Happy', image: 'happy.png' },
        { name: 'Disgusted', image: 'disgusted.png' },
        { name: 'Angry', image: 'angry.png' },
        { name: 'Surprised', image: 'surprised.png' },
        { name: 'Crying', image: 'crying.png' },
        { name: 'Bored', image: 'bored.png' },
        { name: 'Celebratory', image: 'celebratory.png' },
        { name: 'Melted', image: 'melted.png' },
        { name: 'Amazed', image: 'amazed.png' },
        { name: 'Sad', image: 'sad.png' },
        { name: 'Sexy', image: 'sexy.png' },
        { name: 'Not a Fan', image: 'not-a-fan.png' },
        { name: 'Crazy', image: 'crazy.png' },
        { name: 'labubu', image: '24klabubu.png' }
    ];

    moodModal = new MoodModal(moods, (selectedUser, selectedMood) => {
        if (currentModalId !== null) {
            const itemIndex = marathonState.items.findIndex(i => i.id === currentModalId);
            if (itemIndex > -1) {
                const item = marathonState.items[itemIndex];
                if (!item.moods) {
                    item.moods = {};
                }
                item.moods[selectedUser] = selectedMood;

                const movieTitle = item.title;
                console.log(`${selectedUser} reacted ${selectedMood.name} to ${movieTitle}!`);

                updateFirestoreState();
                openModal(currentModalId); // Refresh modal to show new mood
            }
        }
    }, userSettings);

    document.getElementById('add-mood-btn').addEventListener('click', () => {
        const item = marathonState.items.find(i => i.id === currentModalId);
        if (item) {
            moodModal.open(item.moods);
        }
    });
}

function updateMoodDisplay(item) {
    const modalMoodDisplay = document.getElementById('modal-mood-display');
    modalMoodDisplay.innerHTML = '';

    if (item.moods) {
        const user1Mood = item.moods.user1;
        const user2Mood = item.moods.user2;

        if (user1Mood) {
            modalMoodDisplay.innerHTML += `<div class="mood-emoji-container" data-user="Juainny" data-mood="${user1Mood.name}" data-movie="${item.title}"><img src="/moods/${user1Mood.image}" alt="${user1Mood.name}" class="w-10 h-10"></div>`;
        }
        if (user2Mood) {
            modalMoodDisplay.innerHTML += `<div class="mood-emoji-container" data-user="Erick" data-mood="${user2Mood.name}" data-movie="${item.title}"><img src="/moods/${user2Mood.image}" alt="${user2Mood.name}" class="w-10 h-10"></div>`;
        }
    }
}

function initializeTooltip() {
    const tooltip = document.getElementById('tooltip');
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.emoji-banner')) {
            e.stopPropagation();
        }
        const target = e.target.closest('.mood-emoji-container');
        if (target) {
            const user = target.dataset.user;
            const mood = target.dataset.mood;

            const avatarContainer = document.createElement('div');
            const userKey = user === 'Juainny' ? 'user1' : 'user2';
            renderAvatar(avatarContainer, userKey, userSettings, { size: 'small', extraClasses: ['mr-2'] });

            tooltip.innerHTML = `<div class="flex items-center">${avatarContainer.outerHTML}<span>${user} reacted with ${mood}</span></div>`;
            tooltip.classList.remove('hidden');
            const rect = target.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX}px`;
            tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
        } else {
            tooltip.classList.add('hidden');
        }
    }, true);
}

function showPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50';
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
    }, 3000);
}

async function handleSearch(event) {
    const query = event.target.value;
    if (query.length < 3) {
        // Hide search results if query is too short
        return;
    }

    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${query}`);
    const data = await response.json();

    const searchResults = document.createElement('div');
    searchResults.className = 'absolute z-10 w-full bg-bg-secondary rounded-lg shadow-lg';
    searchResults.innerHTML = data.results.map(item => `
        <div class="p-2 hover:bg-bg-tertiary cursor-pointer" data-tmdb-id="${item.id}" data-type="${item.media_type}">
            ${item.title || item.name}
        </div>
    `).join('');

    const searchBar = document.getElementById('search-bar');
    searchBar.parentNode.appendChild(searchResults);

    searchResults.addEventListener('click', async (event) => {
        const target = event.target;
        const tmdbId = target.dataset.tmdbId;
        const type = target.dataset.type;

        await addWantToWatch(tmdbId, type);
        searchResults.remove();
        searchBar.value = '';
    });
}

async function addWantToWatch(tmdbId, type) {
    const response = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=${TMDB_API_KEY}`);
    const details = await response.json();

    const newItem = {
        title: details.title || details.name,
        type: type,
        tmdb_id: tmdbId,
        want_to_watch: true,
        watched: false,
        poster_path: details.poster_path,
        overview: details.overview,
        release_year: (details.release_date || details.first_air_date).split('-')[0],
    };

    marathonState.items.push(newItem);
    await updateSupabaseState();
    renderUI();
}

function exportList() {
    let itemsToExport = marathonState.items;
    if (currentFilter === 'watched') {
        itemsToExport = itemsToExport.filter(item => item.watched);
    } else if (currentFilter === 'want-to-watch') {
        itemsToExport = itemsToExport.filter(item => item.want_to_watch);
    }

    const listContent = itemsToExport.map(item => `- ${item.title}`).join('\n');
    const blob = new Blob([listContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentFilter}-list.txt`;
    a.click();
    URL.revokeObjectURL(url);
}
