import { supabase } from './supabase-client.js';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryType = urlParams.get('type');
    const titleEl = document.getElementById('category-title');
    const gridEl = document.getElementById('category-movie-grid');
    const spinner = document.getElementById('loading-spinner');

    if (!categoryType) {
        titleEl.textContent = 'Category Not Found';
        spinner.style.display = 'none';
        return;
    }

    let filterCol = '';
    let categoryName = '';

    switch (categoryType) {
        case 'currently-watching':
            filterCol = 'currently_watching';
            categoryName = 'Currently Watching';
            break;
        case 'want-to-watch':
            filterCol = 'want_to_watch';
            categoryName = 'Want to Watch';
            break;
        case 'paused':
            filterCol = 'paused';
            categoryName = 'Paused';
            break;
        default:
            titleEl.textContent = 'Unknown Category';
            spinner.style.display = 'none';
            return;
    }

    titleEl.textContent = categoryName;

    try {
        const { data: mediaItems, error } = await supabase
            .from('media')
            .select('*')
            .eq(filterCol, true)
            .order('updated_at', { ascending: false });

        if (error) throw error;

        spinner.style.display = 'none';

        if (!mediaItems || mediaItems.length === 0) {
            gridEl.innerHTML = '<p class="text-white col-span-full text-center mt-10">No items found in this category.</p>';
            return;
        }

        mediaItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'movie-card relative group cursor-pointer aspect-[2/3] rounded-lg overflow-hidden bg-bg-secondary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105';
            
            const posterUrl = item.poster_path
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : 'https://placehold.co/500x750/111827/ef4444?text=No+Poster';
            
            card.innerHTML = `
                <img src="${posterUrl}" alt="${item.title || item.name || 'Unknown'}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 class="text-white font-bold text-sm md:text-base line-clamp-2">${item.title || item.name || 'Unknown'}</h3>
                </div>
            `;

            // On click, navigate to main page with a deep link to open the modal
            card.addEventListener('click', () => {
                window.location.href = `/?tmdb_id=${item.tmdb_id}&type=${item.type || 'movie'}`;
            });

            gridEl.appendChild(card);
        });

    } catch (err) {
        console.error('Error loading category:', err);
        gridEl.innerHTML = '<p class="text-red-500 col-span-full text-center mt-10">Error loading items.</p>';
        spinner.style.display = 'none';
    }
});
