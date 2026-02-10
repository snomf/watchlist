import { supabase } from './supabase-client.js';

const TRAKT_API_URL = 'https://api.trakt.tv';
const TRAKT_CLIENT_ID = import.meta.env.VITE_TRAKT_CLIENT_ID || '29c90ce71a39987699554ed7238b63cad28426f5b697cba738011db637de6cba';

/**
 * Trakt Sync Service
 */
export const traktSync = {
    /**
     * Pushes a rating to Trakt for the current user.
     * @param {string} userId - The local user handle ('juainny' or 'erick')
     * @param {object} mediaItem - The media item (must have tmdb_id and type)
     * @param {number} rating - 1-10 rating (maps from our 1-5 stars if needed, or keep 1-10 if we use 0.5 steps)
     */
    /**
     * Pushes a rating to Trakt for the current user.
     */
    async pushRating(mediaItem, rating) {
        return this._pushSingle('ratings', mediaItem, { rating: Math.round(rating) });
    },

    /**
     * Pushes a watched history item to Trakt.
     */
    async pushHistory(mediaItem, watched = true) {
        const path = watched ? 'history' : 'history/remove';
        return this._pushSingle(path, mediaItem);
    },

    /**
     * Pushes an item to the Trakt watchlist.
     */
    async pushWatchlist(mediaItem, wantToWatch = true) {
        const path = wantToWatch ? 'watchlist' : 'watchlist/remove';
        return this._pushSingle(path, mediaItem);
    },

    /**
     * Syncs a single episode to Trakt history.
     */
    async pushEpisodeHistory(showItem, season, episode, watched = true) {
        const path = watched ? 'history' : 'history/remove';
        const data = {
            shows: [{
                ids: { tmdb: showItem.tmdb_id },
                seasons: [{
                    number: season,
                    episodes: [{ number: episode }]
                }]
            }]
        };
        return this._sendRequest(`${TRAKT_API_URL}/sync/${path}`, data, `Episode S${season}E${episode}`);
    },

    /**
     * Checks in the current user to a movie or episode on Trakt.
     */
    async pushCheckin(mediaItem, appName = 'Watchlist') {
        const type = mediaItem.type === 'tv' || mediaItem.type === 'series' ? 'show' : 'movie';
        const payload = {
            [type]: { ids: { tmdb: mediaItem.tmdb_id } },
            sharing: { twitter: false, mastodon: false, tumblr: false },
            app_version: '1.0',
            app_date: new Date().toISOString().split('T')[0]
        };

        // Trakt checkin is different, it uses /checkin endpoint
        return this._sendRequest(`${TRAKT_API_URL}/checkin`, payload, 'Check-in');
    },

    /**
     * Internal helper for single item sync
     */
    async _pushSingle(path, mediaItem, extraData = {}) {
        if (!mediaItem || !mediaItem.tmdb_id) return;

        const type = mediaItem.type === 'tv' || mediaItem.type === 'series' ? 'shows' : 'movies';
        const payload = {
            [type]: [
                {
                    ids: { tmdb: parseInt(mediaItem.tmdb_id) },
                    ...extraData
                }
            ]
        };

        return this._sendRequest(`${TRAKT_API_URL}/sync/${path}`, payload, path.includes('ratings') ? 'Rating' : 'Status');
    },

    /**
     * Internal helper to send request and show notification
     */
    async _sendRequest(url, payload, label) {
        const currentUser = JSON.parse(localStorage.getItem('activeUser') || localStorage.getItem('watchlist_user') || '{}');
        if (!currentUser.id) return;

        const { data: integration } = await supabase
            .from('integrations')
            .select('*')
            .eq('user_id', currentUser.id)
            .eq('provider', 'trakt')
            .maybeSingle();

        if (!integration || !integration.access_token) return;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${integration.access_token}`,
                    'trakt-api-version': '2',
                    'trakt-api-key': TRAKT_CLIENT_ID
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                this.notify(`${label} synced to Trakt!`);
                return await response.json();
            } else if (response.status === 401) {
                console.warn('Trakt token expired.');
                this.notify('Trakt session expired. Please reconnect.', 'error');
            }
        } catch (err) {
            console.error('Trakt Sync Error:', err);
        }
    },

    /**
     * Shows a toast notification
     */
    notify(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-bg-secondary' : 'bg-danger';
        const borderColor = type === 'success' ? 'border-accent-primary' : 'border-white/20';
        const icon = type === 'success' ? 'fa-check-circle text-accent-primary' : 'fa-exclamation-circle text-white';

        toast.className = `${bgColor} border ${borderColor} text-text-primary px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 transition-all duration-300 transform translate-y-10 opacity-0 pointer-events-auto max-w-xs`;
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span class="text-sm font-medium">${message}</span>
        `;

        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-10', 'opacity-0');
        });

        // Remove after 3s
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};
