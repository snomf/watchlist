import { supabase } from './supabase-client.js';
import Papa from 'papaparse';
import { auth } from './auth.js';

// --- CONFIG ---
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '25e3d089cc8e37a56bf6a1984daf3c5c';

// --- STATE ---
let currentUser = null;
let userAvatars = {};

// --- DOM ELEMENTS ---
const profileButtons = document.querySelectorAll('.profile-btn');
const juainnyAvatarSync = document.getElementById('juainny-avatar-sync');
const erickAvatarSync = document.getElementById('erick-avatar-sync');

const traktStatusEl = document.getElementById('trakt-status');
const traktSyncBtn = document.getElementById('trakt-sync-btn');
const traktAuthContainer = document.getElementById('trakt-auth-container');
const traktLastSyncEl = document.getElementById('trakt-last-sync');

const watchlistFileLink = document.getElementById('imdb-watchlist-file');
const ratingsFileLink = document.getElementById('imdb-ratings-file');
const checkinsFileLink = document.getElementById('imdb-checkins-file');
const importBtn = document.getElementById('import-imdb-btn');

const importProgressContainer = document.getElementById('import-progress-container');
const importProgressBar = document.getElementById('import-progress-bar');
const importStatusText = document.getElementById('import-status-text');
const importPercentage = document.getElementById('import-percentage');
const importLog = document.getElementById('import-log');

const compareBtn = document.getElementById('compare-imdb-btn');
const comparisonResults = document.getElementById('comparison-results');
const missingGrid = document.getElementById('missing-grid');
const missingCount = document.getElementById('missing-count');

// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Auth
    currentUser = await auth.init();

    // 2. Fetch Avatars for the UI
    await fetchUserAvatars();
    renderAvatars();

    // 3. Setup UI Listeners
    setupProfileSwitcher();
    setupTraktUI();
    setupImdbUI();
    setupCompareUI();

    // Update active profile UI
    if (currentUser) {
        updateActiveProfileUI(currentUser.handle);
    } else {
        // Default to juainny if none selected, or just wait for user to pick
        handleProfileSwitch('juainny');
    }
});

// --- USER & AVATAR LOGIC ---

async function fetchUserAvatars() {
    const { data, error } = await supabase
        .from('settings')
        .select('juainny_avatar, erick_avatar')
        .eq('id', 1)
        .single();

    if (data) {
        userAvatars['juainny'] = data.juainny_avatar;
        userAvatars['erick'] = data.erick_avatar;
    }
}

function getAvatarHTML(user, sizeClass = 'w-full h-full') {
    const avatar = userAvatars[user];
    if (!avatar) {
        const color = user === 'juainny' ? 'bg-purple-500' : 'bg-blue-500';
        return `<div class="${sizeClass} rounded-full ${color} flex items-center justify-center text-white font-bold">${user[0].toUpperCase()}</div>`;
    }

    const { type, color1, color2, icon, imageUrl } = avatar;
    if (type === 'image' && imageUrl) {
        return `<img src="${imageUrl}" class="w-full h-full object-cover">`;
    }
    return `
        <div class="w-full h-full flex items-center justify-center" style="background: linear-gradient(135deg, ${color1}, ${color2});">
            <img src="avatars/${icon}" class="w-[60%] h-[60%] object-contain drop-shadow-sm">
        </div>
    `;
}

function renderAvatars() {
    if (juainnyAvatarSync) juainnyAvatarSync.innerHTML = getAvatarHTML('juainny');
    if (erickAvatarSync) erickAvatarSync.innerHTML = getAvatarHTML('erick');
}

function setupProfileSwitcher() {
    profileButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const handle = btn.dataset.handle;
            handleProfileSwitch(handle);
        });
    });
}

async function handleProfileSwitch(handle) {
    try {
        currentUser = await auth.login(handle);
        updateActiveProfileUI(handle);
        updateTraktStatus();
        log(`Switched to profile: ${handle}`);
    } catch (error) {
        console.error('Error switching profile:', error);
    }
}

function updateActiveProfileUI(handle) {
    profileButtons.forEach(btn => {
        if (btn.dataset.handle === handle) {
            btn.classList.add('border-accent-primary', 'bg-bg-tertiary');
            btn.classList.remove('border-border-primary');
        } else {
            btn.classList.remove('border-accent-primary', 'bg-bg-tertiary');
            btn.classList.add('border-border-primary');
        }
    });
}

// --- TRAKT SYNC ---

async function setupTraktUI() {
    traktSyncBtn.addEventListener('click', async () => {
        if (!currentUser) {
            alert("Please select a profile first.");
            return;
        }

        traktSyncBtn.disabled = true;
        traktSyncBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing...';

        try {
            // Updated to /api/trakt-sync as per vercel.json cleanup
            const response = await fetch('/api/trakt-sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: currentUser.id })
            });
            const result = await response.json();

            if (result.success) {
                import('./trakt-sync.js').then(({ traktSync }) => {
                    traktSync.notify("Trakt sync completed successfully!");
                });
                updateTraktStatus();
            } else {
                throw new Error(result.error || "Unknown error");
            }
        } catch (error) {
            console.error(error);
            import('./trakt-sync.js').then(({ traktSync }) => {
                traktSync.notify("Sync failed: " + error.message, "error");
            });
        } finally {
            traktSyncBtn.disabled = false;
            traktSyncBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Sync Now';
        }
    });

    if (currentUser) updateTraktStatus();
}

async function updateTraktStatus() {
    if (!currentUser) {
        traktStatusEl.textContent = 'Select Profile';
        traktStatusEl.className = 'px-3 py-1 rounded-full text-sm font-semibold bg-bg-tertiary text-text-muted';
        traktAuthContainer.innerHTML = '';
        traktLastSyncEl.classList.add('hidden');
        return;
    }

    const { data: integration } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('provider', 'trakt')
        .maybeSingle();

    if (integration && integration.access_token) {
        traktStatusEl.textContent = 'Connected';
        traktStatusEl.className = 'px-3 py-1 rounded-full text-sm font-semibold bg-green-900/30 text-green-400 border border-green-500/30';

        if (integration.last_sync_at) {
            traktLastSyncEl.classList.remove('hidden');
            traktLastSyncEl.textContent = `Last synced: ${new Date(integration.last_sync_at).toLocaleString()}`;
        } else {
            traktLastSyncEl.classList.add('hidden');
        }
        traktAuthContainer.innerHTML = '';
    } else {
        traktStatusEl.textContent = 'Disconnected';
        traktStatusEl.className = 'px-3 py-1 rounded-full text-sm font-semibold bg-red-900/30 text-red-400 border border-red-500/30';

        const clientId = import.meta.env.VITE_TRAKT_CLIENT_ID || '29c90ce71a39987699554ed7238b63cad28426f5b697cba738011db637de6cba';
        const redirectUri = import.meta.env.VITE_TRAKT_REDIRECT_URI || window.location.origin + '/callback.html';
        const state = currentUser.id;

        traktAuthContainer.innerHTML = `
            <a href="https://trakt.tv/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}" 
               class="text-accent-primary hover:underline text-sm font-semibold">
                Connect Trakt
            </a>
        `;
        traktLastSyncEl.classList.add('hidden');
    }
}


// --- IMDB IMPORT ---

function setupImdbUI() {
    [watchlistFileLink, ratingsFileLink, checkinsFileLink].forEach(input => {
        input.addEventListener('change', (e) => {
            const fileNameSpan = document.getElementById(input.id.replace('imdb-', '').replace('-file', '-file-name'));
            if (e.target.files.length > 0) {
                fileNameSpan.textContent = e.target.files[0].name;
                fileNameSpan.classList.add('text-text-primary');
            } else {
                fileNameSpan.textContent = "No file chosen";
                fileNameSpan.classList.remove('text-text-primary');
            }
        });
    });

    importBtn.addEventListener('click', startImport);
}

function setupCompareUI() {
    compareBtn.addEventListener('click', startComparison);
}

async function startComparison() {
    if (!ratingsFileLink.files.length) {
        alert("Please upload your IMDB Ratings CSV first.");
        return;
    }

    if (!currentUser) {
        alert("Please select a profile first.");
        return;
    }

    compareBtn.disabled = true;
    compareBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Comparing...';
    comparisonResults.classList.add('hidden');
    missingGrid.innerHTML = '';

    try {
        // 1. Parse IMDB CSV
        const file = ratingsFileLink.files[0];
        const results = await parseCSV(file);
        const imdbIdsInCSV = new Set(results.data.map(item => item['Const'] || item['const']).filter(Boolean));

        // 2. Fetch App Items for active user
        // We look for items where they have a rating or are marked as watched
        const ratingCol = `${currentUser.handle}_rating`;
        const { data: libraryItems, error } = await supabase
            .from('media')
            .select(`id, title, tmdb_id, imdb_id, poster_path, ${ratingCol}, watched`)
            .or(`watched.eq.true,${ratingCol}.not.is.null`);

        if (error) throw error;

        // 3. Filter for missing items
        const missingItems = libraryItems.filter(item => {
            if (!item.imdb_id) return true; // Missing IMDB ID in our DB = likely missing on IMDB too or untracked
            return !imdbIdsInCSV.has(item.imdb_id);
        });

        // 4. Render Results
        if (missingItems.length > 0) {
            missingCount.textContent = `${missingItems.length} items`;
            comparisonResults.classList.remove('hidden');

            missingItems.forEach(item => {
                renderMissingItem(item);
            });
        } else {
            alert("No missing items found! Your IMDB ratings are up to date with your Trakt/Watchlist library.");
        }

    } catch (err) {
        console.error(err);
        alert("Comparison failed: " + err.message);
    } finally {
        compareBtn.disabled = false;
        compareBtn.innerHTML = '<i class="fas fa-search"></i> Compare with IMDB';
    }
}

function renderMissingItem(item) {
    const card = document.createElement('div');
    card.className = 'bg-bg-tertiary rounded-lg overflow-hidden border border-border-primary hover:border-accent-primary transition group relative';

    const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : 'https://placehold.co/200x300?text=No+Poster';

    card.innerHTML = `
        <div class="aspect-[2/3] relative">
            <img src="${posterUrl}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div class="p-2">
            <h4 class="text-xs font-bold truncate" title="${item.title}">${item.title}</h4>
            <div class="flex items-center justify-between mt-1">
                <span class="text-[10px] text-text-muted">${item.imdb_id || 'No IMDB ID'}</span>
                ${item.watched ? '<i class="fas fa-check-circle text-[10px] text-green-500" title="Watched"></i>' : ''}
            </div>
        </div>
    `;

    missingGrid.appendChild(card);
}

async function startImport() {
    if (!currentUser) {
        alert("Please select a profile first.");
        return;
    }

    if (!watchlistFileLink.files.length && !ratingsFileLink.files.length && !checkinsFileLink.files.length) {
        alert("Please select at least one CSV file to import.");
        return;
    }

    importBtn.disabled = true;
    importProgressContainer.classList.remove('hidden');
    importLog.classList.remove('hidden');
    importLog.innerHTML = '';

    const files = [
        { type: 'watchlist', file: watchlistFileLink.files[0] },
        { type: 'ratings', file: ratingsFileLink.files[0] },
        { type: 'checkins', file: checkinsFileLink.files[0] }
    ].filter(f => f.file);

    let totalItems = 0;
    let processedItems = 0;

    log(`Importing to profile: ${currentUser.handle}`);
    log("Reading files...");

    const parsedData = [];
    for (const f of files) {
        const results = await parseCSV(f.file);
        parsedData.push({ type: f.type, data: results.data });
        totalItems += results.data.length;
        log(`Parsed ${f.type}: ${results.data.length} items.`);
    }

    if (totalItems === 0) {
        log("No items found in files.");
        importBtn.disabled = false;
        return;
    }

    log(`Starting import of ${totalItems} items...`);

    for (const group of parsedData) {
        log(`Processing group: ${group.type}...`);

        for (const item of group.data) {
            try {
                const imdbId = item['Const'] || item['const'];
                if (!imdbId) continue;

                const title = item['Title'] || item['title'] || imdbId;

                let mediaId = null;
                const { data: existingMedia } = await supabase
                    .from('media')
                    .select('id, tmdb_id')
                    .eq('imdb_id', imdbId)
                    .maybeSingle();

                if (existingMedia) {
                    mediaId = existingMedia.id;
                } else {
                    // RESOLVE via TMDB
                    const findUrl = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
                    const findRes = await fetch(findUrl);
                    if (!findRes.ok) {
                        if (findRes.status === 429) {
                            await new Promise(r => setTimeout(r, 1000));
                        }
                        continue;
                    }
                    const findData = await findRes.json();

                    let result = null;
                    let type = null;
                    if (findData.movie_results?.length > 0) {
                        result = findData.movie_results[0];
                        type = 'movie';
                    } else if (findData.tv_results?.length > 0) {
                        result = findData.tv_results[0];
                        type = 'tv';
                    }

                    if (result) {
                        const { data: inserted } = await supabase
                            .from('media')
                            .insert({
                                tmdb_id: result.id,
                                imdb_id: imdbId,
                                type: type,
                                title: result.title || result.name,
                                poster_path: result.poster_path,
                                release_year: parseInt((result.release_date || result.first_air_date || '').substring(0, 4)) || null
                            })
                            .select('id')
                            .single();
                        if (inserted) mediaId = inserted.id;
                    }
                }

                if (!mediaId) {
                    log(`Could not resolve ${title}`);
                    continue;
                }

                // --- APPLY UPDATES ---
                const updateObj = {};
                if (group.type === 'watchlist') {
                    updateObj.want_to_watch = true;
                } else if (group.type === 'ratings' || group.type === 'checkins') {
                    updateObj.watched = true;
                    if (group.type === 'ratings') {
                        const rating = parseFloat(item['Your Rating'] || item['You rated']);
                        if (rating) updateObj[`${currentUser.handle}_rating`] = rating;
                        const dateRated = item['Date Rated'];
                        if (dateRated) updateObj.watched_at = new Date(dateRated).toISOString();
                    } else if (group.type === 'checkins') {
                        const dateWatched = item['Created'];
                        if (dateWatched) updateObj.watched_at = new Date(dateWatched).toISOString();
                    }
                }

                if (Object.keys(updateObj).length > 0) {
                    await supabase.from('media').update(updateObj).eq('id', mediaId);
                }

            } catch (err) {
                console.error(err);
                log(`Error processing ${item['Title'] || 'unknown'}: ${err.message}`);
            }

            processedItems++;
            updateProgress(processedItems, totalItems);

            if (processedItems % 20 === 0) await new Promise(r => setTimeout(r, 200));
        }
    }

    log("Import complete!");
    importBtn.disabled = false;
    alert("Import complete!");
}

function parseCSV(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => resolve(results),
            error: (err) => reject(err)
        });
    });
}

function log(msg) {
    const div = document.createElement('div');
    div.textContent = `> ${msg}`;
    importLog.appendChild(div);
    importLog.scrollTop = importLog.scrollHeight;
}

function updateProgress(current, total) {
    const pct = Math.round((current / total) * 100);
    importProgressBar.style.width = `${pct}%`;
    importPercentage.textContent = `${pct}%`;
    importStatusText.textContent = `Processed ${current} of ${total}`;
}
