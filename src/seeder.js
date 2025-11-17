import { supabase } from './supabase-client.js';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Deletes all existing records from the 'media' table.
 */
async function clearMediaTable() {
    console.log('Clearing the media table...');
    const { error } = await supabase.from('media').delete().neq('id', 0); // Deletes all rows
    if (error) {
        console.error('Error clearing media table:', error);
    } else {
        console.log('Media table cleared.');
    }
}

/**
 * Fetches the TMDB ID for a given title.
 * @param {string} title - The title of the movie or TV show.
 * @returns {number|null} - The TMDB ID or null if not found.
 */
async function getTmdbId(title) {
    const searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`;
    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return data.results[0].id;
        }
        console.warn(`TMDB ID not found for: ${title}`);
        return null;
    } catch (error) {
        console.error(`Error fetching TMDB ID for ${title}:`, error);
        return null;
    }
}

/**
 * Fetches media data from a local JSON file.
 * @returns {Array} - The list of media items.
 */
async function fetchLocalMediaData() {
    try {
        const response = await fetch('/watchednotes.json');
        if (!response.ok) {
            throw new Error('Failed to fetch watchednotes.json');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching local media data:', error);
        return [];
    }
}

/**
 * Seeds the Supabase database from the local `watchednotes.json` file.
 * It clears the table, fetches TMDB IDs, and inserts the new data.
 */
export async function seedDatabaseFromLocal() {
    await clearMediaTable();
    const mediaData = await fetchLocalMediaData();
    if (!mediaData.length) return;

    for (const item of mediaData) {
        const tmdb_id = await getTmdbId(item.title);
        if (tmdb_id) {
            const { data, error } = await supabase
                .from('media')
                .upsert(
                    { ...item, tmdb_id, source: 'fetched_from_json' },
                    { onConflict: 'tmdb_id' }
                );
            if (error) {
                console.error('Error upserting data:', error);
            }
        }
    }
    console.log('Database seeding from local file complete.');
}
