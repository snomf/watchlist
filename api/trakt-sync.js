import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://wuaoaeadrjewtyhvxyno.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1YW9hZWFkcmpld3R5aHZ4eW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjc4MjMsImV4cCI6MjA3ODc0MzgyM30.9wymTewNn9AvnK2H6Spi7hE6n3wj_IBGljHjbAxRnY0';
const supabase = createClient(supabaseUrl, supabaseKey);

const TRAKT_CLIENT_ID = process.env.VITE_TRAKT_CLIENT_ID;
const TRAKT_CLIENT_SECRET = process.env.TRAKT_CLIENT_SECRET;

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { user_id, tmdb_id: targetTmdbId, direction } = req.body;
    if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

    try {
        // 1. Get User info to determine handle and columns
        const { data: userInfo, error: userError } = await supabase
            .from('users')
            .select('handle')
            .eq('id', user_id)
            .single();

        if (userError || !userInfo) throw new Error('User not found');
        const handle = userInfo.handle;
        const viewer = handle === 'juainny' ? 'user1' : 'user2';
        const ratingColumn = `${handle}_rating`;

        // 2. Get Integration Token & Sync Mode
        let { data: integration, error: intError } = await supabase
            .from('integrations')
            .select('*')
            .eq('user_id', user_id)
            .eq('provider', 'trakt')
            .single();

        if (intError || !integration) throw new Error('Trakt integration not found');

        // Use provided direction or fallback to integration's sync_mode
        let syncMode = direction || integration.sync_mode || 'both';
        if (syncMode === 'push') syncMode = 'up_only';
        if (syncMode === 'pull') syncMode = 'down_only';

        let accessToken = integration.access_token;

        // 3. Check if token expired and refresh (if expires in < 15 mins)
        const now = Math.floor(Date.now() / 1000);
        const expiresAt = integration.expires_at ? Math.floor(new Date(integration.expires_at).getTime() / 1000) : 0;

        if (expiresAt < now + 900) {
            const refreshResponse = await fetch('https://api.trakt.tv/oauth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    refresh_token: integration.refresh_token,
                    client_id: TRAKT_CLIENT_ID,
                    client_secret: TRAKT_CLIENT_SECRET,
                    redirect_uri: (req.headers.origin || 'https://marvel-marathon.vercel.app') + '/callback.html',
                    grant_type: 'refresh_token'
                })
            });

            const refreshData = await refreshResponse.json();
            if (!refreshResponse.ok) throw new Error('Failed to refresh Trakt token: ' + (refreshData.error_description || refreshData.error));

            accessToken = refreshData.access_token;
            const newExpiresAt = new Date(Date.now() + refreshData.expires_in * 1000).toISOString();

            await supabase
                .from('integrations')
                .update({
                    access_token: accessToken,
                    refresh_token: refreshData.refresh_token,
                    expires_at: newExpiresAt
                })
                .eq('user_id', user_id)
                .eq('provider', 'trakt');
        }

        // 4. Fetch Local Data
        // A. Ratings
        let ratingsQuery = supabase
            .from('media')
            .select(`id, tmdb_id, type, ${ratingColumn}`)
            .not(ratingColumn, 'is', null);
        if (targetTmdbId) ratingsQuery = ratingsQuery.eq('tmdb_id', targetTmdbId);
        const { data: ratedMedia } = await ratingsQuery;

        // B. Episode Progress
        let episodeQuery = supabase
            .from('episode_progress')
            .select('media_id, season_number, episode_number, watched, media:media_id(tmdb_id, source)')
            .eq('viewer', viewer)
            .eq('watched', true);
        if (targetTmdbId) episodeQuery = episodeQuery.filter('media.tmdb_id', 'eq', targetTmdbId);
        const { data: episodeProgress } = await episodeQuery;

        // C. Watched/Watchlist Media
        let mediaQuery = supabase
            .from('media')
            .select('*')
            .or(`owner_id.eq.${user_id},owner_id.is.null`);
        if (targetTmdbId) mediaQuery = mediaQuery.eq('tmdb_id', targetTmdbId);
        const { data: mediaItems } = await mediaQuery;

        // D. Ignore Items
        let ignoreQuery = supabase
            .from('user_media_actions')
            .select('media_id')
            .eq('user_id', user_id)
            .eq('ignore_trakt', true);
        const { data: ignoreActions } = await ignoreQuery;
        const ignoredIds = new Set(ignoreActions?.map(a => a.media_id) || []);

        // 5. Format for Trakt
        const syncData = {
            history: { movies: [], shows: [] },
            ratings: { movies: [], shows: [] },
            watchlist: { movies: [], shows: [] }
        };

        // Process Ratings
        ratedMedia?.forEach(m => {
            if (ignoredIds.has(m.id) || !m.tmdb_id) return;
            const ratingValue = Math.round(m[ratingColumn]);
            if (!ratingValue) return;

            const item = {
                rating: ratingValue,
                ids: { tmdb: parseInt(m.tmdb_id) }
            };
            if (m.type === 'movie') syncData.ratings.movies.push(item);
            else syncData.ratings.shows.push(item);
        });

        // Process History (Movies & Shows)
        const showHistoryMap = new Map();

        // Group Episodes
        episodeProgress?.forEach(ep => {
            if (ignoredIds.has(ep.media_id) || !ep.media?.tmdb_id) return;
            const tmdbId = parseInt(ep.media.tmdb_id);
            if (!showHistoryMap.has(tmdbId)) showHistoryMap.set(tmdbId, new Map());

            const seasonMap = showHistoryMap.get(tmdbId);
            if (!seasonMap.has(ep.season_number)) seasonMap.set(ep.season_number, []);
            seasonMap.get(ep.season_number).push({ number: ep.episode_number });
        });

        // Process Whole Media Items (Movies + Watchlist)
        mediaItems?.forEach(m => {
            if (ignoredIds.has(m.id) || !m.tmdb_id) return;
            const tmdbId = parseInt(m.tmdb_id);
            const item = { ids: { tmdb: tmdbId } };

            if (m.watched) {
                if (m.type === 'movie') {
                    syncData.history.movies.push({ ...item, watched_at: m.watched_at || m.updated_at });
                } else {
                    if (!showHistoryMap.has(tmdbId)) {
                        syncData.history.shows.push({ ...item, watched_at: m.watched_at || m.updated_at });
                    }
                }
            }

            if (m.want_to_watch) {
                if (m.type === 'movie') syncData.watchlist.movies.push(item);
                else syncData.watchlist.shows.push(item);
            }
        });

        for (const [tmdbId, seasons] of showHistoryMap.entries()) {
            const showItem = {
                ids: { tmdb: tmdbId },
                seasons: Array.from(seasons.entries()).map(([num, eps]) => ({
                    number: num,
                    episodes: eps
                }))
            };
            syncData.history.shows.push(showItem);
        }

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

        if (syncMode === 'both' || syncMode === 'up_only') {
            await Promise.all([
                pushSync('history', syncData.history),
                pushSync('ratings', syncData.ratings),
                pushSync('watchlist', syncData.watchlist)
            ]);
        }

        // 7. PULL Logic (Trakt -> App)
        if (syncMode === 'both' || syncMode === 'down_only') {
            const fetchTrakt = async (path) => {
                const res = await fetch(`https://api.trakt.tv/sync/${path}`, { headers });
                return res.json();
            };

            const [traktHistory, traktRatings, traktWatchlist] = await Promise.all([
                fetchTrakt('watched/movies'),
                fetchTrakt('ratings/movies'),
                fetchTrakt('watchlist/movies')
            ]);
            const traktShows = await fetchTrakt('watched/shows');

            const filterTrakt = (list, key) => targetTmdbId ? list.filter(i => (i[key]?.ids?.tmdb || i[key]?.tmdb) == targetTmdbId) : list;

            const filteredMovies = filterTrakt(traktHistory, 'movie');
            const filteredShows = filterTrakt(traktShows, 'show');

            for (const item of filteredMovies) {
                if (!item.movie?.ids?.tmdb) continue;
                const { data: m } = await supabase.from('media')
                    .select('id, watched, source')
                    .eq('tmdb_id', item.movie.ids.tmdb)
                    .maybeSingle();

                if (m && m.source !== 'added' && !m.watched) {
                    await supabase.from('media').update({ watched: true }).eq('id', m.id);
                }
            }

            const allEpisodesToUpsert = [];
            for (const show of filteredShows) {
                if (!show.show?.ids?.tmdb) continue;
                const { data: m } = await supabase.from('media')
                    .select('id, source')
                    .eq('tmdb_id', show.show.ids.tmdb)
                    .maybeSingle();

                if (!m || m.source === 'added') continue;

                for (const season of show.seasons) {
                    for (const ep of season.episodes) {
                        allEpisodesToUpsert.push({
                            media_id: m.id,
                            viewer: viewer,
                            season_number: season.number,
                            episode_number: ep.number,
                            watched: true
                        });
                    }
                }
            }

            if (allEpisodesToUpsert.length > 0) {
                const chunkSize = 500;
                for (let i = 0; i < allEpisodesToUpsert.length; i += chunkSize) {
                    const chunk = allEpisodesToUpsert.slice(i, i + chunkSize);
                    await supabase.from('episode_progress').upsert(chunk, {
                        onConflict: 'media_id,viewer,season_number,episode_number'
                    });
                }
            }

            const ratingsToReconcile = targetTmdbId ? [...traktRatings, ...(await fetchTrakt('ratings/shows'))].filter(r => (r.movie?.ids?.tmdb || r.show?.ids?.tmdb) == targetTmdbId) : [...traktRatings, ...(await fetchTrakt('ratings/shows'))];

            for (const r of ratingsToReconcile) {
                const tmdbId = r.movie?.ids?.tmdb || r.show?.ids?.tmdb;
                if (!tmdbId) continue;

                const { data: m } = await supabase.from('media')
                    .select('id, source, ' + ratingColumn)
                    .eq('tmdb_id', tmdbId)
                    .maybeSingle();

                if (m && m.source !== 'added' && m[ratingColumn] !== r.rating) {
                    const updates = {};
                    updates[ratingColumn] = r.rating;
                    await supabase.from('media').update(updates).eq('id', m.id);
                }
            }
        }

        await supabase
            .from('integrations')
            .update({ last_sync_at: new Date().toISOString() })
            .eq('user_id', user_id)
            .eq('provider', 'trakt');

        return res.status(200).json({ success: true, mode: syncMode });

    } catch (err) {
        console.error('Trakt Sync Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
