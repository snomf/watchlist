import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TRAKT_CLIENT_ID = process.env.VITE_TRAKT_CLIENT_ID;
const TRAKT_CLIENT_SECRET = process.env.TRAKT_CLIENT_SECRET;

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

    try {
        // 1. Get Integration Token
        let { data: integration, error: intError } = await supabase
            .from('integrations')
            .select('*')
            .eq('user_id', user_id)
            .eq('provider', 'trakt')
            .single();

        if (intError || !integration) throw new Error('Trakt integration not found for this user');

        let accessToken = integration.access_token;

        // 2. Check if token expired and refresh
        const now = Math.floor(Date.now() / 1000);
        const expiresAt = integration.expires_at ? new Date(integration.expires_at).getTime() / 1000 : 0;

        if (expiresAt < now + 300) { // Refresh if expires in less than 5 minutes
            const refreshResponse = await fetch('https://api.trakt.tv/oauth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    refresh_token: integration.refresh_token,
                    client_id: TRAKT_CLIENT_ID,
                    client_secret: TRAKT_CLIENT_SECRET,
                    redirect_uri: req.headers.origin + '/callback.html',
                    grant_type: 'refresh_token'
                })
            });

            const refreshData = await refreshResponse.json();
            if (!refreshResponse.ok) throw new Error('Failed to refresh Trakt token');

            accessToken = refreshData.access_token;
            const newExpiresAt = new Date(Date.now() + refreshData.expires_in * 1000).toISOString();

            await supabase
                .from('integrations')
                .update({
                    access_token: accessToken,
                    refresh_token: refreshData.refresh_token,
                    expires_at: newExpiresAt,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', user_id)
                .eq('provider', 'trakt');
        }

        // 3. Fetch Local Data to Sync
        // A. Ratings
        const { data: actions } = await supabase
            .from('user_media_actions')
            .select('rating, media(tmdb_id, type, title)')
            .eq('user_id', user_id)
            .neq('rating', null);

        // B. Watched, Currently Watching, Want to Watch (Shared & Personal)
        const { data: mediaItems } = await supabase
            .from('media')
            .select('*')
            .or(`owner_id.eq.${user_id},owner_id.is.null`);

        // 4. Format for Trakt
        const syncData = {
            history: { movies: [], shows: [] },
            ratings: { movies: [], shows: [] },
            watchlist: { movies: [], shows: [] }
            // Note: Trakt doesn't have a direct "currently watching" sync endpoint like this, 
            // usually handled via checkins or scrobbling. We'll skip currently_watching for now 
            // or put it in watchlist if appropriate. Actually, Trakt's "collection" or just skip.
        };

        // Process Ratings
        actions?.forEach(act => {
            if (!act.media || !act.media.tmdb_id) return;
            const item = {
                rating: act.rating,
                ids: { tmdb: parseInt(act.media.tmdb_id) }
            };
            if (act.media.type === 'movie') syncData.ratings.movies.push(item);
            else syncData.ratings.shows.push(item);
        });

        // Process Media Items
        mediaItems?.forEach(m => {
            if (!m.tmdb_id) return;
            const tmdbId = parseInt(m.tmdb_id);
            const item = { ids: { tmdb: tmdbId } };

            if (m.watched) {
                if (m.type === 'movie') syncData.history.movies.push(item);
                else syncData.history.shows.push(item);
            }

            if (m.want_to_watch) {
                if (m.type === 'movie') syncData.watchlist.movies.push(item);
                else syncData.watchlist.shows.push(item);
            }
        });

        // 5. POST to Trakt
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'trakt-api-version': '2',
            'trakt-api-key': TRAKT_CLIENT_ID
        };

        const pushSync = async (path, data) => {
            if (data.movies.length === 0 && data.shows.length === 0) return;
            const res = await fetch(`https://api.trakt.tv/sync/${path}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data)
            });
            return res.json();
        };

        await Promise.all([
            pushSync('history', syncData.history),
            pushSync('ratings', syncData.ratings),
            pushSync('watchlist', syncData.watchlist)
        ]);

        // 6. Update Sync Timestamp
        await supabase
            .from('integrations')
            .update({ last_sync_at: new Date().toISOString() })
            .eq('user_id', user_id)
            .eq('provider', 'trakt');

        return res.status(200).json({ success: true });

    } catch (err) {
        console.error('Trakt Sync Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
