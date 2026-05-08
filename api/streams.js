export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { tmdbId, type, season, episode } = req.query;

    if (!tmdbId || !type) {
        return res.status(400).json({ error: 'Missing tmdbId or type' });
    }

    let AIOSTREAMS_URL = process.env.AIOSTREAMS_URL;

    if (!AIOSTREAMS_URL) {
        console.error('AIOSTREAMS_URL is missing in environment variables.');
        return res.status(500).json({ error: 'AIOSTREAMS_URL is not configured.' });
    }

    // Clean up base URL
    if (AIOSTREAMS_URL.endsWith('/')) AIOSTREAMS_URL = AIOSTREAMS_URL.slice(0, -1);
    if (AIOSTREAMS_URL.endsWith('/manifest.json')) AIOSTREAMS_URL = AIOSTREAMS_URL.replace('/manifest.json', '');

    try {
        let streamUrl = '';
        if (type === 'movie') {
            streamUrl = `${AIOSTREAMS_URL}/stream/movie/tmdb:${tmdbId}.json`;
        } else if (type === 'tv' || type === 'series') {
            streamUrl = `${AIOSTREAMS_URL}/stream/series/tmdb:${tmdbId}:${season || 1}:${episode || 1}.json`;
        } else {
            return res.status(400).json({ error: 'Invalid type. Use movie or tv.' });
        }

        console.log(`Fetching streams from AIOStreams: ${streamUrl}`);
        
        const response = await fetch(streamUrl);
        if (!response.ok) {
            throw new Error(`AIOStreams responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data && data.streams && data.streams.length > 0) {
            // Filter and sort streams here if necessary, or let frontend do it
            return res.status(200).json({ streams: data.streams });
        } else {
            return res.status(404).json({ error: 'No streams found', streams: [] });
        }

    } catch (error) {
        console.error('Error in /api/streams:', error);
        return res.status(500).json({ error: error.message });
    }
}
