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
    async pushRating(mediaItem, rating) {
        if (!mediaItem || !rating) return;

        const currentUser = JSON.parse(localStorage.getItem('activeUser') || '{}');
        if (!currentUser.id) return;

        // 1. Get Trakt Token for this user
        const { data: integration, error } = await supabase
            .from('integrations')
            .select('*')
            .eq('user_id', currentUser.id)
            .eq('provider', 'trakt')
            .maybeSingle();

        if (error || !integration) {
            console.log('Trakt not connected for user', currentUser.handle);
            return;
        }

        // 2. Prepare Payload
        // Trakt ratings are 1-10. Our system uses 1-10 stars (based on 0.5 increments usually, but let's check).
        // If our star component returns 1-5, we multiply by 2.
        const traktRating = Math.round(rating); // Trakt expect integer 1-10

        const type = mediaItem.type === 'tv' || mediaItem.type === 'series' ? 'shows' : 'movies';
        const payload = {
            [type]: [
                {
                    ids: { tmdb: mediaItem.tmdb_id },
                    rating: traktRating
                }
            ]
        };

        try {
            const response = await fetch(`${TRAKT_API_URL}/sync/ratings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${integration.access_token}`,
                    'trakt-api-version': '2',
                    'trakt-api-key': TRAKT_CLIENT_ID
                },
                body: JSON.stringify(payload)
            });

            if (response.status === 401) {
                // Token might be expired. We should ideally refresh here.
                console.warn('Trakt token expired or invalid.');
                return;
            }

            const result = await response.json();
            console.log('Trakt sync result:', result);
            return result;
        } catch (err) {
            console.error('Error syncing with Trakt:', err);
        }
    }
};
