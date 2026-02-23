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

    // Show save prompt
    if (currentItem) showSavePrompt(currentItem);
}

// ── Save Prompt ──────────────────────────────────────────────────────────────
function showSavePrompt(item) {
    const modal = document.getElementById('player-save-modal');
    if (!modal) return;

    const msgEl = document.getElementById('player-save-message');
    if (msgEl) {
        const isTV = item.type !== 'movie';
        msgEl.textContent = isTV
            ? `Did you finish S${String(item.season).padStart(2, '0')}E${String(item.episode).padStart(2, '0')} of "${item.title}"? Save it as watched?`
            : `Finished watching "${item.title}"? Mark it as watched?`;
    }

    modal.classList.remove('hidden');
}

async function handleSaveWatched() {
    const modal = document.getElementById('player-save-modal');
    if (modal) modal.classList.add('hidden');

    if (!currentItem) return;

    try {
        if (currentItem.type === 'movie') {
            // Mark the movie as watched in the media table
            if (currentItem.internalId) {
                await supabase.from('media').update({ watched: true }).eq('id', currentItem.internalId);
            }
        } else {
            // Mark the specific episode as watched for both users
            if (currentItem.internalId && currentItem.season && currentItem.episode) {
                const upserts = ['user1', 'user2'].map(viewer => ({
                    media_id: currentItem.internalId,
                    viewer,
                    season_number: currentItem.season,
                    episode_number: currentItem.episode,
                    watched: true,
                }));
                await supabase.from('episode_progress').upsert(upserts, {
                    onConflict: 'media_id,viewer,season_number,episode_number'
                });
            }
        }
        // Notify the app to re-render if possible
        document.dispatchEvent(new CustomEvent('player:saved', { detail: currentItem }));
    } catch (err) {
        console.error('[Player] Failed to save watch progress:', err);
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

    // Save prompt buttons
    const saveYes = document.getElementById('player-save-yes');
    if (saveYes) saveYes.addEventListener('click', handleSaveWatched);

    const saveNo = document.getElementById('player-save-no');
    if (saveNo) saveNo.addEventListener('click', () => {
        const modal = document.getElementById('player-save-modal');
        if (modal) modal.classList.add('hidden');
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !getOverlay()?.classList.contains('hidden')) {
            closePlayer();
        }
    });
}
