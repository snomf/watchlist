/**
 * player.js — Full-screen embedded media player for Watchlist
 * Uses TMDB IDs to build embed URLs across multiple sources.
 * No sandbox attribute on iframes.
 */

import { supabase } from './supabase-client.js';

// ── Sources ─────────────────────────────────────────────────────────────────
const SOURCES = [
    { name: 'VidSrc', id: 'vidsrc' },
    { name: 'RiveStream', id: 'rivestream' },
    { name: '2Embed', id: '2embed' },
    { name: 'MoviesAPI', id: 'moviesapi' },
    { name: 'MultiEmbed', id: 'multiembed' },
    { name: 'SmashyStream', id: 'smashystream' },
];

let activeSource = SOURCES[0];
let currentItem = null; // { tmdbId, type, title, season, episode, internalId }

// ── Build Embed URL ──────────────────────────────────────────────────────────
function buildEmbedUrl(source, item) {
    const { tmdbId, type, season = 1, episode = 1 } = item;
    const isMovie = type === 'movie';

    switch (source.id) {
        case 'vidsrc':
            return isMovie
                ? `https://vidsrc.xyz/embed/movie?tmdb=${tmdbId}`
                : `https://vidsrc.xyz/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;

        case 'rivestream':
            return isMovie
                ? `https://rivestream.net/embed?type=movie&id=${tmdbId}`
                : `https://rivestream.net/embed?type=tv&id=${tmdbId}&season=${season}&episode=${episode}`;

        case '2embed':
            return isMovie
                ? `https://www.2embed.cc/embed/${tmdbId}`
                : `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`;

        case 'moviesapi':
            return isMovie
                ? `https://moviesapi.club/movie/${tmdbId}`
                : `https://moviesapi.club/tv/${tmdbId}-${season}-${episode}`;

        case 'multiembed':
            return isMovie
                ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`
                : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`;

        case 'smashystream': {
            let url = `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}`;
            if (!isMovie) url += `&season=${season}&episode=${episode}`;
            return url;
        }

        default:
            return '';
    }
}

// ── DOM Helpers ──────────────────────────────────────────────────────────────
function getOverlay() { return document.getElementById('media-player-overlay'); }
function getIframe() { return document.getElementById('media-player-iframe'); }

function updateIframeSrc() {
    const iframe = getIframe();
    if (!iframe || !currentItem) return;
    iframe.src = buildEmbedUrl(activeSource, currentItem);
}

function updateSourceMenu() {
    const list = document.getElementById('player-source-list');
    if (!list) return;
    list.innerHTML = SOURCES.map(s => `
    <button
      data-source="${s.id}"
      class="player-source-btn w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition hover:bg-white/10
             ${activeSource.id === s.id ? 'text-orange-400 font-bold bg-orange-500/10' : 'text-gray-300'}"
    >
      <i class="fas fa-tv text-xs ${activeSource.id === s.id ? 'text-orange-400' : 'text-gray-500'}"></i>
      ${s.name}
    </button>
  `).join('');

    list.querySelectorAll('.player-source-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            activeSource = SOURCES.find(s => s.id === btn.dataset.source) || SOURCES[0];
            const labelEl = document.getElementById('player-source-label');
            if (labelEl) labelEl.textContent = activeSource.name;
            updateIframeSrc();
            updateSourceMenu();
            closeSourceMenu();
        });
    });
}

function openSourceMenu() {
    const menu = document.getElementById('player-source-menu');
    if (menu) menu.classList.remove('hidden');
    updateSourceMenu();
}

function closeSourceMenu() {
    const menu = document.getElementById('player-source-menu');
    if (menu) menu.classList.add('hidden');
}

// ── Open Player ──────────────────────────────────────────────────────────────
export function openPlayer(item) {
    // item: { tmdbId, type, title, season, episode, internalId }
    currentItem = item;
    activeSource = SOURCES[0];

    const overlay = getOverlay();
    if (!overlay) return;

    // Set title
    const titleEl = document.getElementById('player-title');
    if (titleEl) {
        const episodeInfo = (item.type !== 'movie' && item.season && item.episode)
            ? ` — S${String(item.season).padStart(2, '0')}E${String(item.episode).padStart(2, '0')}`
            : '';
        titleEl.textContent = (item.title || '') + episodeInfo;
    }

    updateIframeSrc();
    updateSourceMenu();

    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Show/Hide Nav Controls
    const navControls = document.getElementById('player-nav-controls');
    if (navControls) {
        if (item.type === 'tv' && item.season && item.episode) {
            navControls.classList.remove('hidden');
        } else {
            navControls.classList.add('hidden');
        }
    }

    // Hide dock while player is open
    if (window.dockHide) window.dockHide();
}

// ── Close Player ─────────────────────────────────────────────────────────────
function closePlayer() {
    const overlay = getOverlay();
    if (!overlay) return;

    // Nuke the iframe src to stop playback/buffering
    const iframe = getIframe();
    if (iframe) iframe.src = 'about:blank';

    overlay.classList.add('hidden');
    document.body.style.overflow = '';

    // Restore dock
    if (window.dockShow) window.dockShow();

    // Show save toast
    if (currentItem) showSaveToast(currentItem);
}

// ── Save Toast ──────────────────────────────────────────────────────────────
function showSaveToast(item) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const isTV = item.type !== 'movie';
    const message = isTV
        ? `Did you finish S${String(item.season).padStart(2, '0')}E${String(item.episode).padStart(2, '0')}?`
        : `Did you finish "${item.title}"?`;

    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto bg-gray-900/95 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-6 min-w-[300px] animate-fade-in-up';
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <i class="fas fa-check text-green-500 text-sm"></i>
            </div>
            <div>
                <p class="text-white text-sm font-semibold">${message}</p>
                <p class="text-white/50 text-[10px]">Mark as watched in your library</p>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <button class="toast-no px-3 py-1.5 rounded-lg text-white/50 hover:text-white text-xs transition">No</button>
            <button class="toast-yes px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition">Yes</button>
        </div>
    `;

    container.appendChild(toast);

    const removeToast = () => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('.toast-yes').addEventListener('click', async () => {
        await handleSaveWatched(item);
        removeToast();
    });

    toast.querySelector('.toast-no').addEventListener('click', removeToast);

    // Auto-remove after 10 seconds if no action
    setTimeout(removeToast, 10000);
}

async function handleSaveWatched(item) {
    if (!item) return;

    try {
        if (item.type === 'movie') {
            if (item.internalId) {
                await supabase.from('media').update({ watched: true }).eq('id', item.internalId);
            }
        } else {
            if (item.internalId && item.season && item.episode) {
                const upserts = ['user1', 'user2'].map(viewer => ({
                    media_id: item.internalId,
                    viewer,
                    season_number: item.season,
                    episode_number: item.episode,
                    watched: true,
                }));
                await supabase.from('episode_progress').upsert(upserts, {
                    onConflict: 'media_id,viewer,season_number,episode_number'
                });
            }
        }
        document.dispatchEvent(new CustomEvent('player:saved', { detail: item }));
    } catch (err) {
        console.error('[Player] Failed to save watch progress:', err);
    }
}

async function markAsWatched(item) {
    if (!item) return;
    try {
        if (item.type === 'movie' && item.internalId) {
            await supabase.from('media').update({ watched: true }).eq('id', item.internalId);
        } else if (item.internalId && item.season && item.episode) {
            const upserts = ['user1', 'user2'].map(viewer => ({
                media_id: item.internalId,
                viewer,
                season_number: item.season,
                episode_number: item.episode,
                watched: true,
            }));
            await supabase.from('episode_progress').upsert(upserts, {
                onConflict: 'media_id,viewer,season_number,episode_number'
            });
        }
    } catch (err) {
        console.error('[Player] Failed to auto-save watch progress:', err);
    }
}

async function playNextEpisode() {
    if (!currentItem || currentItem.type !== 'tv') return;
    // Mark current as watched before switching
    await markAsWatched(currentItem);

    // Increment episode
    const nextItem = { ...currentItem, episode: currentItem.episode + 1 };
    openPlayer(nextItem);
    // Note: This doesn't handle season rollover yet as we don't have the episode count here.
    // However, the user can use the modal to switch seasons.
}

async function playPrevEpisode() {
    if (!currentItem || currentItem.type !== 'tv' || currentItem.episode <= 1) return;
    const prevItem = { ...currentItem, episode: currentItem.episode - 1 };
    openPlayer(prevItem);
}

function toggleFullscreen() {
    const overlay = getOverlay();
    if (!overlay) return;

    const header = overlay.querySelector('.flex-none'); // The header div

    if (!document.fullscreenElement) {
        overlay.requestFullscreen().then(() => {
            if (header) header.classList.add('hidden');
        }).catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
        if (header) header.classList.remove('hidden');
    }
}

// ── Init ─────────────────────────────────────────────────────────────────────
export function initPlayer() {
    const overlay = getOverlay();
    if (!overlay) return;

    // Close button
    const closeBtn = document.getElementById('player-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closePlayer);

    // Source menu toggle
    const sourceToggle = document.getElementById('player-source-toggle');
    if (sourceToggle) {
        sourceToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const menu = document.getElementById('player-source-menu');
            if (menu?.classList.contains('hidden')) openSourceMenu();
            else closeSourceMenu();
        });
    }

    // Close source menu on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#player-source-toggle') && !e.target.closest('#player-source-menu')) {
            closeSourceMenu();
        }
    });

    // Nav Buttons
    const prevBtn = document.getElementById('player-prev-btn');
    if (prevBtn) prevBtn.addEventListener('click', playPrevEpisode);

    const nextBtn = document.getElementById('player-next-btn');
    if (nextBtn) nextBtn.addEventListener('click', playNextEpisode);

    // Fullscreen Button
    const fsBtn = document.getElementById('player-fullscreen-btn');
    if (fsBtn) fsBtn.addEventListener('click', toggleFullscreen);

    // ESC or 's' key
    document.addEventListener('keydown', (e) => {
        const overlayVisible = !getOverlay()?.classList.contains('hidden');
        if (!overlayVisible) return;

        if (e.key === 'Escape') {
            closePlayer();
        } else if (e.key.toLowerCase() === 's') {
            toggleFullscreen();
        }
    });

    // Handle fullscreen change to show/hide header
    document.addEventListener('fullscreenchange', () => {
        const overlay = getOverlay();
        if (overlay) {
            const header = overlay.querySelector('.flex-none');
            if (header) {
                if (document.fullscreenElement) header.classList.add('hidden');
                else header.classList.remove('hidden');
            }
        }
    });
}
