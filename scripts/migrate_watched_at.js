const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wuaoaeadrjewtyhvxyno.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1YW9hZWFkcmpld3R5aHZ4eW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjc4MjMsImV4cCI6MjA3ODc0MzgyM30.9wymTewNn9AvnK2H6Spi7hE6n3wj_IBGljHjbAxRnY0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log('Starting migration...');

    // 1. Add watched_at column?
    // Supabase JS client cannot alter table schema for postgres directly unless using rpc or if allowed by API.
    // However, if we just try to update a column that doesn't exist, it might fail.
    // We assume the user has to run the SQL or we can't do it via JS client easily without admin rights or SQL editor.
    // BUT the prompt implies I should try to do it.
    // If I can't run SQL, I rely on the user running the SQL I provided in the implementation plan or I try to "backfill" assuming column exists.
    // Wait, the user approved the plan which included "Run the SQL script (or execute equivalent code)".
    // If I cannot Execute SQL via JS client (requires postgres connection or RPC), I might be stuck on schema change.
    // Let's assume the schema change needs to happen via SQL Editor or I use a clever trick if possible.
    // OR I just backfill and hope the column exists? No that will fail.
    //
    // Actually, I wrote a `migrations/add_watched_at.sql` file.
    // I should notify the user to run that SQL?
    // Or can I use `supabase.rpc` if there is a function to run sql? Unlikely.
    //
    // Let's TRY to run the backfill. If it fails, I'll know the column is missing.
    // But I can't add the column via JS Client Standard API.
    //
    // WAIT. If I can't add the column, I can't fix the issue fully without user intervention.
    // I should have asked the user to run the SQL in the plan.
    // But I can verify if the column exists by selecting it.

    // Check if column exists by selecting it from one row
    const { data: check, error: checkError } = await supabase.from('media').select('watched_at').limit(1);
    if (checkError) {
        console.error('Column watched_at likely missing or other error:', checkError.message);
        console.log('IMPORTANT: You must run the SQL in migrations/add_watched_at.sql to add the column first!');
        return;
    }

    console.log('Column watched_at exists. Proceeding with backfill...');

    // 2. Fetch all watched media
    const { data: watchedMedia, error: fetchError } = await supabase
        .from('media')
        .select('id, watched, watched_at')
        .eq('watched', true);

    if (fetchError) {
        console.error('Error fetching media:', fetchError);
        return;
    }

    console.log(`Found ${watchedMedia.length} watched items.`);

    // 3. For each, find latest activity log
    for (const item of watchedMedia) {
        if (item.watched_at) continue; // Already has date

        const { data: activities, error: actError } = await supabase
            .from('activity_log')
            .select('created_at')
            .eq('media_id', item.id)
            .eq('action_type', 'watched')
            .order('created_at', { ascending: false })
            .limit(1);

        let watchedDate = new Date().toISOString(); // Default to now if no log

        if (!activities || activities.length === 0) {
            // Fallback: try created_at from media logic? I don't have it here unless I select it.
            // Let's just use "now" or maybe I should fetch created_at.
            // Let's fetch created_at for fallback.
            const { data: mediaDetails } = await supabase.from('media').select('created_at').eq('id', item.id).single();
            if (mediaDetails) watchedDate = mediaDetails.created_at;
        } else {
            watchedDate = activities[0].created_at;
        }

        const { error: updateError } = await supabase
            .from('media')
            .update({ watched_at: watchedDate })
            .eq('id', item.id);

        if (updateError) {
            console.error(`Failed to update media ${item.id}:`, updateError);
        } else {
            // console.log(`Updated media ${item.id} with watched_at: ${watchedDate}`);
        }
    }

    console.log('Migration complete.');
}

migrate();
