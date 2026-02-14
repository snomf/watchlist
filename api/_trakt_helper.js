import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://wuaoaeadrjewtyhvxyno.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1YW9hZWFkcmpld3R5aHZ4eW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjc4MjMsImV4cCI6MjA3ODc0MzgyM30.9wymTewNn9AvnK2H6Spi7hE6n3wj_IBGljHjbAxRnY0';
const supabase = createClient(supabaseUrl, supabaseKey);

const TRAKT_CLIENT_ID = process.env.VITE_TRAKT_CLIENT_ID;
const TRAKT_CLIENT_SECRET = process.env.TRAKT_CLIENT_SECRET;

/**
 * Shared Trakt Helper
 */
export const traktHelper = {
    /**
     * Refreshes Trakt token if needed
     */
    async getValidToken(user_id) {
        let { data: integration, error } = await supabase
            .from('integrations')
            .select('*')
            .eq('user_id', user_id)
            .eq('provider', 'trakt')
            .single();

        if (error || !integration) return null;

        const now = Math.floor(Date.now() / 1000);
        const expiresAt = integration.expires_at ? Math.floor(new Date(integration.expires_at).getTime() / 1000) : 0;

        if (expiresAt < now + 900) {
            try {
                const refreshResponse = await fetch('https://api.trakt.tv/oauth/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        refresh_token: integration.refresh_token,
                        client_id: TRAKT_CLIENT_ID,
                        client_secret: TRAKT_CLIENT_SECRET,
                        grant_type: 'refresh_token'
                    })
                });

                const refreshData = await refreshResponse.json();
                if (!refreshResponse.ok) throw new Error(refreshData.error_description || refreshData.error);

                const newExpiresAt = new Date(Date.now() + refreshData.expires_in * 1000).toISOString();

                await supabase
                    .from('integrations')
                    .update({
                        access_token: refreshData.access_token,
                        refresh_token: refreshData.refresh_token,
                        expires_at: newExpiresAt
                    })
                    .eq('user_id', user_id)
                    .eq('provider', 'trakt');

                return refreshData.access_token;
            } catch (err) {
                console.error('Token refresh failed for user:', user_id, err);
                return null;
            }
        }

        return integration.access_token;
    },

    /**
     * Pushes a single item state to Trakt
     */
    async pushToTrakt(accessToken, tmdbId, type, status, season = 0, episode = 0) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'trakt-api-version': '2',
            'trakt-api-key': TRAKT_CLIENT_ID
        };

        const isShow = type === 'tv' || type === 'series';
        const key = isShow ? 'shows' : 'movies';
        const itemIds = { ids: { tmdb: parseInt(tmdbId) } };

        try {
            if (status === 'watched') {
                if (season > 0 || episode > 0) {
                    // Episode history
                    const payload = {
                        shows: [{
                            ...itemIds,
                            seasons: [{
                                number: season,
                                episodes: [{ number: episode, watched_at: new Date().toISOString() }]
                            }]
                        }]
                    };
                    await fetch('https://api.trakt.tv/sync/history', { method: 'POST', headers, body: JSON.stringify(payload) });
                } else {
                    // Movie or whole Show history
                    const payload = { [key]: [{ ...itemIds, watched_at: new Date().toISOString() }] };
                    await fetch('https://api.trakt.tv/sync/history', { method: 'POST', headers, body: JSON.stringify(payload) });
                }
            } else if (status === 'want_to_watch') {
                const payload = { [key]: [itemIds] };
                await fetch('https://api.trakt.tv/sync/watchlist', { method: 'POST', headers, body: JSON.stringify(payload) });
            }
            return true;
        } catch (err) {
            console.error('Trakt push failed:', err);
            return false;
        }
    },

    /**
     * Logic for syncing a single item for ALL relevant users
     */
    async syncItemForAllUsers(tmdbId, status, season = 0, episode = 0) {
        // 1. Find all users with Trakt integrations
        const { data: integrations } = await supabase
            .from('integrations')
            .select('user_id, sync_mode')
            .eq('provider', 'trakt');

        if (!integrations || integrations.length === 0) return;

        // 2. Fetch media info to determine type
        const { data: media } = await supabase
            .from('media')
            .select('id, type')
            .eq('tmdb_id', parseInt(tmdbId))
            .maybeSingle();

        if (!media) return;

        // 3. For each user, check if they "ignore" this item
        for (const integration of integrations) {
            if (integration.sync_mode === 'none' || integration.sync_mode === 'down_only') continue;

            const { data: action } = await supabase
                .from('user_media_actions')
                .select('ignore_trakt')
                .eq('user_id', integration.user_id)
                .eq('media_id', media.id)
                .maybeSingle();

            if (action?.ignore_trakt) continue;

            // 4. Trigger push
            const token = await this.getValidToken(integration.user_id);
            if (token) {
                await this.pushToTrakt(token, tmdbId, media.type, status, season, episode);
            }
        }
    }
};
