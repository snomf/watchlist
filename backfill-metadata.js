import { supabase } from './src/supabase-client.js';

const TMDB_API_KEY = process.env.VITE_TMDB_API_KEY;

/**
 * Backfills runtime, content_rating, and release_year for all media items in the database.
 * This script fetches data from TMDB and updates the Supabase database.
 */
async function backfillMetadata() {
    console.log('Starting metadata backfill...');

    // Fetch all media items
    const { data: allMedia, error: fetchError } = await supabase
        .from('media')
        .select('*');

    if (fetchError) {
        console.error('Error fetching media:', fetchError);
        return;
    }

    console.log(`Found ${allMedia.length} media items to process.`);

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    // Process in batches to avoid rate limiting
    const BATCH_SIZE = 10;
    const DELAY_MS = 500; // Delay between batches

    for (let i = 0; i < allMedia.length; i += BATCH_SIZE) {
        const batch = allMedia.slice(i, i + BATCH_SIZE);

        const batchPromises = batch.map(async (item) => {
            if (!item.tmdb_id || !item.type) {
                console.log(`Skipping ${item.title} - missing tmdb_id or type`);
                skippedCount++;
                return;
            }

            try {
                const endpoint = item.type === 'movie' ? 'movie' : 'tv';
                const appendToResponse = 'release_dates,content_ratings';
                const tmdbUrl = `https://api.themoviedb.org/3/${endpoint}/${item.tmdb_id}?api_key=${TMDB_API_KEY}&append_to_response=${appendToResponse}`;

                const response = await fetch(tmdbUrl);
                if (!response.ok) {
                    console.error(`Failed to fetch TMDB data for ${item.title} (${item.tmdb_id}): ${response.status}`);
                    errorCount++;
                    return;
                }

                const data = await response.json();
                const updates = {};

                // Runtime
                if (item.type === 'movie') {
                    if (data.runtime) {
                        updates.runtime = data.runtime;
                    }
                } else if (item.type === 'series' || item.type === 'tv') {
                    // For TV, use episode_run_time or fallback to last/next episode
                    if (data.episode_run_time && data.episode_run_time.length > 0) {
                        updates.runtime = data.episode_run_time[0];
                    } else if (data.last_episode_to_air && data.last_episode_to_air.runtime) {
                        updates.runtime = data.last_episode_to_air.runtime;
                    } else if (data.next_episode_to_air && data.next_episode_to_air.runtime) {
                        updates.runtime = data.next_episode_to_air.runtime;
                    }
                }

                // Content Rating
                if (item.type === 'movie' && data.release_dates) {
                    const usRelease = data.release_dates.results.find(r => r.iso_3166_1 === 'US');
                    if (usRelease) {
                        const rating = usRelease.release_dates.find(rd => rd.certification !== '');
                        if (rating) {
                            updates.content_rating = rating.certification;
                        }
                    }
                } else if ((item.type === 'series' || item.type === 'tv') && data.content_ratings) {
                    const usRating = data.content_ratings.results.find(r => r.iso_3166_1 === 'US');
                    if (usRating) {
                        updates.content_rating = usRating.rating;
                    } else if (data.content_ratings.results.length > 0) {
                        updates.content_rating = data.content_ratings.results[0].rating;
                    }
                }

                // Release Year
                const releaseDate = data.release_date || data.first_air_date;
                if (releaseDate) {
                    updates.release_year = parseInt(releaseDate.substring(0, 4));
                }

                // Update database if we have any changes
                if (Object.keys(updates).length > 0) {
                    const { error: updateError } = await supabase
                        .from('media')
                        .update(updates)
                        .eq('id', item.id);

                    if (updateError) {
                        console.error(`Error updating ${item.title}:`, updateError);
                        errorCount++;
                    } else {
                        console.log(`✓ Updated ${item.title} with:`, updates);
                        successCount++;
                    }
                } else {
                    console.log(`No updates needed for ${item.title}`);
                    skippedCount++;
                }

            } catch (error) {
                console.error(`Error processing ${item.title}:`, error);
                errorCount++;
            }
        });

        await Promise.all(batchPromises);

        // Delay between batches
        if (i + BATCH_SIZE < allMedia.length) {
            console.log(`Processed batch ${Math.floor(i / BATCH_SIZE) + 1}, waiting ${DELAY_MS}ms...`);
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        }
    }

    console.log('\n=== Backfill Complete ===');
    console.log(`Total items: ${allMedia.length}`);
    console.log(`Successfully updated: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Skipped: ${skippedCount}`);
}

// Run the backfill
backfillMetadata().catch(console.error);
