import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://wuaoaeadrjewtyhvxyno.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1YW9hZWFkcmpld3R5aHZ4eW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjc4MjMsImV4cCI6MjA3ODc0MzgyM30.9wymTewNn9AvnK2H6Spi7hE6n3wj_IBGljHjbAxRnY0';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Vercel serverless function to handle watchlist API
 * GET /api/lists?type=want_to_watch|currently_watching
 */
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') return res.status(204).end();

    try {
        if (req.method === 'GET') {
            const { type } = req.query;


            if (type === 'want_to_watch' || !type || type === 'all') {
                // Fetch all items marked as want_to_watch
                const { data: items, error } = await supabase
                    .from('media')
                    .select('*')
                    .eq('want_to_watch', true)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (type === 'want_to_watch') {
                    return res.status(200).json({
                        type: 'want_to_watch',
                        count: items?.length || 0,
                        items: items || []
                    });
                }

                // For mass report, store it
                var wantToWatch = items || [];
            }

            if (type === 'currently_watching' || !type || type === 'all') {
                // Fetch all items marked as currently_watching
                const { data: items, error } = await supabase
                    .from('media')
                    .select('*')
                    .eq('currently_watching', true);

                if (error) throw error;

                // For TV shows, fetch the last watched episode
                const enrichedItems = items ? await Promise.all(items.map(async (item) => {
                    // Only fetch episode info for TV shows
                    if (item.type === 'tv' || item.type === 'series') {
                        // Get the latest watched episode for this show
                        const { data: episodes, error: epError } = await supabase
                            .from('episode_progress')
                            .select('season_number, episode_number, watched')
                            .eq('media_id', item.id)
                            .eq('watched', true)
                            .order('season_number', { ascending: false })
                            .order('episode_number', { ascending: false })
                            .limit(1);

                        if (!epError && episodes && episodes.length > 0) {
                            const lastEpisode = episodes[0];
                            return {
                                ...item,
                                last_watched_episode: {
                                    season: lastEpisode.season_number,
                                    episode: lastEpisode.episode_number
                                }
                            };
                        }
                    }

                    // For movies or shows without episode data, return as-is
                    return item;
                })) : [];

                if (type === 'currently_watching') {
                    return res.status(200).json({
                        type: 'currently_watching',
                        count: enrichedItems.length,
                        items: enrichedItems
                    });
                }

                // For mass report, store it
                var currentlyWatching = enrichedItems;
            }

            if (!type || type === 'all') {
                return res.status(200).json({
                    want_to_watch: {
                        count: wantToWatch.length,
                        items: wantToWatch
                    },
                    currently_watching: {
                        count: currentlyWatching.length,
                        items: currentlyWatching
                    }
                });
            }

            return res.status(400).json({ error: 'Invalid type. Use want_to_watch or currently_watching' });

        }

        return res.status(405).json({ error: 'method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'internal server error', details: error.message });
    }
}
