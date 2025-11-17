import { supabase } from './supabase-client.js';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Deletes all records from the 'media' table that do not have 'fetched' as their source.
 * This is a critical step to remove any old, corrupt, or unlabeled data.
 */
async function deleteUnlabeledData() {
    console.log("Deleting all media that isn't labeled as 'fetched'...");
    const { data, error } = await supabase
        .from('media')
        .delete()
        .not('source', 'eq', 'fetched');

    if (error) {
        console.error('Error deleting unlabeled data:', error);
    } else {
        console.log('Successfully deleted unlabeled data.');
    }
}

/**
 * Finds and removes duplicate entries from the database based on 'tmdb_id'.
 * It keeps the first entry it finds and deletes the rest.
 */
async function deduplicateFetchedData() {
    console.log('Checking for and removing duplicate entries...');
    const { data: media, error } = await supabase
        .from('media')
        .select('id, tmdb_id')
        .eq('source', 'fetched');

    if (error) {
        console.error('Error fetching media for de-duplication:', error);
        return;
    }

    const tmdbIdMap = new Map();
    const idsToDelete = [];

    for (const item of media) {
        if (tmdbIdMap.has(item.tmdb_id)) {
            // If we've seen this tmdb_id before, this is a duplicate.
            idsToDelete.push(item.id);
        } else {
            // Otherwise, it's the first time we're seeing it.
            tmdbIdMap.set(item.tmdb_id, item.id);
        }
    }

    if (idsToDelete.length > 0) {
        console.log(`Found and removing ${idsToDelete.length} duplicate(s).`);
        const { error: deleteError } = await supabase
            .from('media')
            .delete()
            .in('id', idsToDelete);

        if (deleteError) {
            console.error('Error deleting duplicates:', deleteError);
        } else {
            console.log('Successfully removed duplicates.');
        }
    } else {
        console.log('No duplicates found.');
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
            // Prefer movies or TV shows to avoid incorrect matches like persons
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

/**
 * Seeds the Supabase database from the local `watchednotes.json` file.
 * It clears the table, fetches TMDB IDs, and inserts the new data.
 */
export async function seedDatabaseFromLocal() {
    // Step 1: Aggressively clean the database
    await deleteUnlabeledData();
    await deduplicateFetchedData();

    // Step 2: Fetch the ground truth from the local file
    const mediaData = await fetchLocalMediaData();
    if (!mediaData.length) return;

    console.log(`Starting to seed/update ${mediaData.length} items from watchednotes.json...`);

    // Step 3: Upsert data to ensure it's all correct
    for (const item of mediaData) {
        const tmdb_id = await getTmdbId(item.title);
        if (tmdb_id) {
            const { error } = await supabase
                .from('media')
                .upsert(
                    { title: item.title, type: item.type, tmdb_id, source: 'fetched' },
                    { onConflict: 'tmdb_id' }
                );
            if (error) {
                console.error(`Error upserting '${item.title}':`, error);
            }
        }
    }
    console.log('Database seeding from local file complete.');
}
