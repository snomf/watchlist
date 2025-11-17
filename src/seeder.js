import { supabase } from './supabase-client.js';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Performs a "hard reset" of the media table. It deletes all existing
 * data and then re-populates it from the local watchednotes.json file.
 * This is the most reliable way to ensure the database is in a clean state.
 */
export async function seedDatabaseFromLocal() {
    // Step 1: Delete EVERYTHING from the media table.
    console.log('Performing a hard reset. Deleting all media data...');
    const { error: deleteError } = await supabase.from('media').delete().neq('id', 0); // A trick to delete all rows

    if (deleteError) {
        console.error('CRITICAL: Failed to delete data. Check your RLS policies.', deleteError);
        // We stop here because if we can't delete, we'll just create duplicates.
        return;
    }
    console.log('All existing media has been deleted.');

    // Step 2: Fetch the ground truth from the local file.
    const mediaData = await fetchLocalMediaData();
    if (!mediaData.length) return;

    console.log(`Starting to seed ${mediaData.length} items from watchednotes.json...`);

    // Step 3: Insert the clean data.
    for (const item of mediaData) {
        const tmdb_id = await getTmdbId(item.title);
        if (tmdb_id) {
            const { error: insertError } = await supabase
                .from('media')
                .insert({
                    title: item.title,
                    type: item.type,
                    tmdb_id,
                    source: 'fetched' // Standardizing to the 'fetched' source
                });
            if (insertError) {
                console.error(`Error inserting '${item.title}':`, insertError);
            }
        }
    }
    console.log('Database hard reset and seeding complete.');
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
            const media = data.results.find(r => r.media_type === 'movie' || r.media_type === 'tv');
            if (media) return media.id;
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
