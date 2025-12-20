import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://wuaoaeadrjewtyhvxyno.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1YW9hZWFkcmpld3R5aHZ4eW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjc4MjMsImV4cCI6MjA3ODc0MzgyM30.9wymTewNn9AvnK2H6Spi7hE6n3wj_IBGljHjbAxRnY0';

const supabase = createClient(supabaseUrl, supabaseKey);

const VALID_STATUSES = ['want_to_watch', 'watching', 'watched'];

/**
 * Vercel serverless function to handle watch status API
 * GET /api/status?tmdb_id=XXXX - Get status for a TMDB ID
 * POST /api/status - Set/update status for a TMDB ID
 */
export default async function handler(req, res) {
    // CORS headers for cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    // Handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    try {
        // GET /api/status?tmdb_id=XXXX
        if (req.method === 'GET') {
            const tmdbId = req.query.tmdb_id;

            // Validate TMDB ID
            if (!tmdbId) {
                return res.status(400).json({ error: 'tmdb_id query parameter is required' });
            }

            const tmdbIdNum = parseInt(tmdbId, 10);
            if (isNaN(tmdbIdNum)) {
                return res.status(400).json({ error: 'tmdb_id must be a valid integer' });
            }

            // Query database
            const { data, error } = await supabase
                .from('watch_status')
                .select('tmdb_id, status')
                .eq('tmdb_id', tmdbIdNum)
                .single();

            if (error) {
                // If record doesn't exist, return "unknown" status
                if (error.code === 'PGRST116') {
                    return res.status(200).json({
                        tmdb_id: tmdbIdNum,
                        status: 'unknown',
                    });
                }

                // Other database errors
                console.error('Database error:', error);
                return res.status(500).json({ error: 'Database error occurred' });
            }

            // Return the status
            return res.status(200).json({
                tmdb_id: data.tmdb_id,
                status: data.status,
            });
        }

        // POST /api/status
        if (req.method === 'POST') {
            const { tmdb_id, status } = req.body;

            // Validate TMDB ID
            if (!tmdb_id) {
                return res.status(400).json({ error: 'tmdb_id is required in request body' });
            }

            const tmdbIdNum = parseInt(tmdb_id, 10);
            if (isNaN(tmdbIdNum)) {
                return res.status(400).json({ error: 'tmdb_id must be a valid integer' });
            }

            // Validate status
            if (!status) {
                return res.status(400).json({ error: 'status is required in request body' });
            }

            if (!VALID_STATUSES.includes(status)) {
                return res.status(400).json({
                    error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
                });
            }

            // Upsert the record (insert or update)
            const { data, error } = await supabase
                .from('watch_status')
                .upsert(
                    {
                        tmdb_id: tmdbIdNum,
                        status: status,
                        updated_at: new Date().toISOString(),
                    },
                    {
                        onConflict: 'tmdb_id',
                    }
                )
                .select('tmdb_id, status')
                .single();

            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ error: 'Failed to update status' });
            }

            // Return the updated status
            return res.status(200).json({
                tmdb_id: data.tmdb_id,
                status: data.status,
            });
        }

        // Method not allowed
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    } catch (error) {
        console.error('Function error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
