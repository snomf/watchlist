import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://wuaoaeadrjewtyhvxyno.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1YW9hZWFkcmpld3R5aHZ4eW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjc4MjMsImV4cCI6MjA3ODc0MzgyM30.9wymTewNn9AvnK2H6Spi7hE6n3wj_IBGljHjbAxRnY0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function syncDatabase() {
    try {
        const filePath = path.join('src', 'watchednotes.json');
        const data = fs.readFileSync(filePath, 'utf8');
        const mediaData = JSON.parse(data);

        const { data: existingMedia, error: fetchError } = await supabase
            .from('media')
            .select('title');

        if (fetchError) {
            console.error('Error fetching existing media:', fetchError.message);
            return;
        }

        const existingTitles = existingMedia.map(item => item.title);

        for (const item of mediaData) {
            if (item.title && item.type) {
                if (existingTitles.includes(item.title)) {
                    // Update existing record
                    const { error } = await supabase
                        .from('media')
                        .update({ type: item.type, tmdb_id: item.tmdb_id })
                        .match({ title: item.title });

                    if (error) {
                        console.error(`Error updating ${item.title}:`, error.message);
                    } else {
                        console.log(`Updated ${item.title}`);
                    }
                } else {
                    // Insert new record
                    const { error } = await supabase
                        .from('media')
                        .insert({ title: item.title, type: item.type, tmdb_id: item.tmdb_id });

                    if (error) {
                        console.error(`Error inserting ${item.title}:`, error.message);
                    } else {
                        console.log(`Inserted ${item.title}`);
                    }
                }
            }
        }
        console.log('Database sync complete.');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
}

syncDatabase();
