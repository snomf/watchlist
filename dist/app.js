import { supabase } from './supabase-client.js';

async function getMedia() {
    const { data: media, error } = await supabase
        .from('media')
        .select('*');

    if (error) {
        console.error('Error fetching media:', error);
        return;
    }

    const movieGrid = document.getElementById('movie-grid');
    if (!movieGrid) {
        console.error('Movie grid element not found!');
        return;
    }

    // Clear any existing content
    movieGrid.innerHTML = '';

    // Render each media item
    media.forEach(item => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card', 'bg-bg-secondary', 'rounded-lg', 'shadow-lg', 'overflow-hidden');

        // A simple representation for now
        movieCard.innerHTML = `
            <div class="p-4">
                <h3 class="text-white font-bold text-lg">${item.title}</h3>
                <p class="text-gray-400 text-sm">${item.type}</p>
            </div>
        `;

        movieGrid.appendChild(movieCard);
    });
}

// Run the function when the page loads
document.addEventListener('DOMContentLoaded', getMedia);
