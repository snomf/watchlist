import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://wuaoaeadrjewtyhvxyno.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1YW9hZWFkcmpld3R5aHZ4eW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjc4MjMsImV4cCI6MjA3ODc0MzgyM30.9wymTewNn9AvnK2H6Spi7hE6n3wj_IBGljHjbAxRnY0';
const supabase = createClient(supabaseUrl, supabaseKey);

const mcuTitles = [
    "Spider-Man: Homecomingg",
    "Black Panther",
    "Doctor Strange",
    "Black Widow",
    "Captain America: Civil War",
    "Ant-Man",
    "Avengers: Age of Ultron",
    "Guardians of the Galaxy Vol. 2",
    "Guardians of the Galaxy",
    "Captain America: The Winter Soldier",
    "Iron Man 3",
    "Thor: The Dark World",
    "The Avengers",
    "Thor",
    "The Incredible Hulk",
    "Iron Man 2",
    "Iron Man",
    "Captain Marvel",
    "Captain America: The First Avenger",
    "Wandavision",
    "Deadpool & Wolverine",
    "Agatha All Along",
    "Spider-Man: No Way Home",
    "Spider-Man: Far From Home",
    "Spider-Man: Homecoming",
];

async function seedDatabase() {
    try {
        const data = fs.readFileSync('src/watchednotes.json', 'utf8');
        const mediaData = JSON.parse(data);

        const nonMcuMedia = mediaData.filter(item => !mcuTitles.includes(item.title));

        for (const item of nonMcuMedia) {
            const { data, error } = await supabase
                .from('media')
                .insert([
                    { title: item.title, type: item.type }
                ]);

            if (error) {
                console.error('Error inserting data:', error);
            } else {
                console.log('Inserted:', data);
            }
        }
        console.log('Database seeding complete.');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seedDatabase();
