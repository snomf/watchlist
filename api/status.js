import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://wuaoaeadrjewtyhvxyno.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1YW9hZWFkcmpld3R5aHZ4eW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjc4MjMsImV4cCI6MjA3ODc0MzgyM30.9wymTewNn9AvnK2H6Spi7hE6n3wj_IBGljHjbAxRnY0';

const supabase = createClient(supabaseUrl, supabaseKey);

const TMDB_API_KEY = process.env.VITE_TMDB_API_KEY || '25e3d089cc8e37a56bf6a1984daf3c5c';

const VALID_STATUSES = ['want_to_watch', 'watching', 'watched'];

/**
 * Vercel serverless function to handle watch status API
 * GET /api/status?tmdb_id=XXXX&season=Y&episode=Z
 * POST /api/status - body: { tmdb_id, season, episode, status }
 */
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') return res.status(204).end();

    try {
        if (req.method === 'GET') {
            const { tmdb_id, season, episode } = req.query;
            if (!tmdb_id) return res.status(400).json({ error: 'tmdb_id is required' });

            const tmdbIdNum = parseInt(tmdb_id, 10);
            const seasonNum = parseInt(season || '0', 10);
            const episodeNum = parseInt(episode || '0', 10);

            // 1. Check the dedicated watch_status table (Dumb store)
            const { data: apiData } = await supabase
                .from('watch_status')
                .select('status')
                .eq('tmdb_id', tmdbIdNum)
                .eq('season_number', seasonNum)
                .eq('episode_number', episodeNum)
                .single();

            if (apiData) {
                return res.status(200).json({ tmdb_id: tmdbIdNum, season: seasonNum, episode: episodeNum, status: apiData.status, source: 'api_table' });
            }

            // 2. Smart Fallback: Check the main watchlist tables
            const { data: mainMedia } = await supabase
                .from('media')
                .select('id, watched, currently_watching, want_to_watch')
                .eq('tmdb_id', tmdbIdNum)
                .single();

            if (mainMedia) {
                if (seasonNum > 0 || episodeNum > 0) {
                    // Check episode progress fallback
                    const { data: epProgress } = await supabase
                        .from('episode_progress')
                        .select('watched')
                        .eq('media_id', mainMedia.id)
                        .eq('season_number', seasonNum)
                        .eq('episode_number', episodeNum)
                        .eq('watched', true)
                        .limit(1)
                        .maybeSingle();

                    if (epProgress) {
                        return res.status(200).json({ tmdb_id: tmdbIdNum, season: seasonNum, episode: episodeNum, status: 'watched', source: 'main_db' });
                    }
                } else {
                    // General item status
                    let status = 'unknown';
                    if (mainMedia.watched) status = 'watched';
                    else if (mainMedia.currently_watching) status = 'watching';
                    else if (mainMedia.want_to_watch) status = 'want_to_watch';

                    return res.status(200).json({ tmdb_id: tmdbIdNum, season: seasonNum, episode: episodeNum, status, source: 'main_db' });
                }
            }

            // 3. Not found anywhere
            return res.status(200).json({ tmdb_id: tmdbIdNum, season: seasonNum, episode: episodeNum, status: 'unknown' });
        }

        if (req.method === 'POST') {
            const { tmdb_id, season, episode, status } = req.body;
            if (!tmdb_id || !status) return res.status(400).json({ error: 'tmdb_id and status are required' });
            if (!VALID_STATUSES.includes(status)) return res.status(400).json({ error: 'invalid status' });

            const tmdbIdNum = parseInt(tmdb_id, 10);
            const seasonNum = parseInt(season || '0', 10);
            const episodeNum = parseInt(episode || '0', 10);

            // 1. Update the "Dumb" watch_status table (Master record)
            const { data, error } = await supabase
                .from('watch_status')
                .upsert({
                    tmdb_id: tmdbIdNum,
                    season_number: seasonNum,
                    episode_number: episodeNum,
                    status,
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;

            // 2. Sync-Back Logic: check if item is in main watchlist
            let { data: mainMedia } = await supabase
                .from('media')
                .select('id')
                .eq('tmdb_id', tmdbIdNum)
                .single();

            // AUTO-ADD LOGIC: If watched but not in media table
            if (!mainMedia && status === 'watched' && seasonNum === 0 && episodeNum === 0) {
                try {
                    // Attempt to fetch as Movie first
                    let tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/${tmdbIdNum}?api_key=${TMDB_API_KEY}`);
                    let type = 'movie';
                    if (!tmdbRes.ok) {
                        // Try TV
                        tmdbRes = await fetch(`https://api.themoviedb.org/3/tv/${tmdbIdNum}?api_key=${TMDB_API_KEY}`);
                        type = 'series';
                    }

                    if (tmdbRes.ok) {
                        const tmdbData = await tmdbRes.json();
                        const yearStr = tmdbData.release_date || tmdbData.first_air_date || '';
                        const { data: newItem } = await supabase
                            .from('media')
                            .insert({
                                tmdb_id: tmdbIdNum,
                                type: type,
                                title: tmdbData.title || tmdbData.name,
                                poster_path: tmdbData.poster_path,
                                backdrop_path: tmdbData.backdrop_path,
                                release_year: yearStr ? parseInt(yearStr.split('-')[0]) : null,
                                source: 'api_sync',
                                watched: true,
                                currently_watching: false,
                                want_to_watch: false,
                                runtime: tmdbData.runtime || (tmdbData.episode_run_time ? tmdbData.episode_run_time[0] : 0)
                            })
                            .select('id')
                            .single();
                        mainMedia = newItem;
                    }
                } catch (err) {
                    console.error('Auto-add failed:', err);
                }
            }

            if (mainMedia) {
                // Item is tracked (or just added)! Sync the progress
                if (seasonNum > 0 || episodeNum > 0) {
                    // Sync Episode/Season Progress
                    const isWatched = status === 'watched';
                    const upserts = ['user1', 'user2'].map(viewer => ({
                        media_id: mainMedia.id,
                        viewer: viewer,
                        season_number: seasonNum,
                        episode_number: episodeNum,
                        watched: isWatched
                    }));

                    await supabase.from('episode_progress').upsert(upserts, {
                        onConflict: 'media_id,viewer,season_number,episode_number'
                    });
                } else {
                    // Sync Movie/Series Flags
                    await supabase
                        .from('media')
                        .update({
                            watched: status === 'watched',
                            currently_watching: status === 'watching',
                            want_to_watch: status === 'want_to_watch'
                        })
                        .eq('id', mainMedia.id);
                }
            }

            return res.status(200).json({
                tmdb_id: data.tmdb_id,
                season: data.season_number,
                episode: data.episode_number,
                status: data.status,
                synced: !!mainMedia
            });
        }

        return res.status(405).json({ error: 'method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'internal server error' });
    }
}
