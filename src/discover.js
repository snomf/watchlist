import { supabase } from './supabase-client.js';
import { auth } from './auth.js';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Auth
    const user = await auth.init();
    if (user) {
        document.getElementById('device-name').textContent = user.handle || 'User';
    } else {
        document.getElementById('device-name').textContent = 'Guest';
    }

    // 2. Load Theme Settings
    const { data: settings } = await supabase.from('settings').select('theme').eq('id', 1).single();
    if (settings && settings.theme) {
        document.documentElement.setAttribute('data-theme', settings.theme);
    }

    // 3. Setup Kino Live Indicator
    setupKinoIndicator();

    // 4. Fetch Discover Content
    await loadDiscoverContent();
    
    // Show main
    document.getElementById('discover-main').classList.remove('opacity-0');
});

async function setupKinoIndicator() {
    const banner = document.getElementById('kino-banner');
    const usersSpan = document.getElementById('kino-users');
    const joinBtn = document.getElementById('join-kino-btn');
    const navIndicator = document.getElementById('kino-live-indicator-nav'); // On index.html usually, but let's check
    
    const updateBanner = async () => {
        // Fetch active sessions
        const { data: sessions } = await supabase
            .from('kino_sessions')
            .select('*')
            .eq('is_active', true)
            .order('updated_at', { ascending: false });

        if (sessions && sessions.length > 0) {
            if (banner) banner.classList.remove('hidden');
            if (navIndicator) navIndicator.classList.remove('hidden');
            
            // Collect unique active users
            const activeUsers = sessions.filter(s => {
                const lastUpdated = new Date(s.updated_at).getTime();
                const now = new Date().getTime();
                return (now - lastUpdated) < 5 * 60 * 1000; // Active within 5 mins
            }).map(s => s.user_handle);
            
            if (usersSpan && activeUsers.length > 0) {
                usersSpan.textContent = `(${activeUsers.join(', ')})`;
            } else if (usersSpan) {
                usersSpan.textContent = '';
            }
        } else {
            if (banner) banner.classList.add('hidden');
            if (navIndicator) navIndicator.classList.add('hidden');
        }
    };

    await updateBanner();

    // Subscribe to realtime changes
    supabase
        .channel('kino-tracker')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'kino_sessions' }, updateBanner)
        .subscribe();

    if (joinBtn) {
        joinBtn.onclick = () => window.open('https://kino.juainny.com', '_blank');
    }
}

async function fetchTMDB(endpoint) {
    const response = await fetch(`https://api.themoviedb.org/3${endpoint}&api_key=${TMDB_API_KEY}`);
    return await response.json();
}

async function loadDiscoverContent() {
    try {
        const [trendingRes, moviesRes, tvRes] = await Promise.all([
            fetchTMDB('/trending/all/day?language=en-US'),
            fetchTMDB('/discover/movie?language=en-US&sort_by=popularity.desc'),
            fetchTMDB('/discover/tv?language=en-US&sort_by=popularity.desc')
        ]);

        const trending = trendingRes.results.filter(item => item.backdrop_path && item.poster_path);
        const movies = moviesRes.results.filter(item => item.backdrop_path && item.poster_path);
        const tv = tvRes.results.filter(item => item.backdrop_path && item.poster_path);

        if (trending.length > 0) {
            // Pick a random trending item for the hero section
            const heroItem = trending[Math.floor(Math.random() * Math.min(5, trending.length))];
            renderHero(heroItem);
        }

        const listsContainer = document.getElementById('discover-lists');
        listsContainer.innerHTML = ''; // Clear

        renderRow('Trending Today', trending, listsContainer);
        renderRow('Popular Movies', movies, listsContainer, 'movie');
        renderRow('Popular TV Shows', tv, listsContainer, 'tv');

    } catch (error) {
        console.error('Error loading discover content:', error);
    }
}

function renderHero(item) {
    const heroSection = document.getElementById('hero-section');
    const titleEl = document.getElementById('hero-title');
    const overviewEl = document.getElementById('hero-overview');
    const typeEl = document.getElementById('hero-type');
    const playBtn = document.getElementById('hero-play-btn');
    const addBtn = document.getElementById('hero-add-btn');

    const type = item.media_type || 'movie';
    const title = item.title || item.name;
    const backdrop = `https://image.tmdb.org/t/p/original${item.backdrop_path}`;

    heroSection.style.backgroundImage = `url('${backdrop}')`;
    titleEl.textContent = title;
    overviewEl.textContent = item.overview;
    typeEl.textContent = type === 'tv' ? 'TV Series' : 'Movie';

    playBtn.onclick = () => {
        window.location.href = `/?play=${item.id}&type=${type}`;
    };

    addBtn.onclick = () => {
        window.location.href = `/?tmdb_id=${item.id}&type=${type}`;
    };
}

function renderRow(title, items, container, forceType = null) {
    const rowWrapper = document.createElement('div');
    rowWrapper.className = 'flex flex-col mb-8';

    const header = document.createElement('h2');
    header.className = 'text-2xl font-bold mb-4 text-white pl-2 border-l-4 border-accent-primary';
    header.textContent = title;

    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'flex gap-4 overflow-x-auto hide-scrollbar pb-4 pt-2 px-2';
    scrollContainer.style.scrollSnapType = 'x mandatory';
    
    // Add scroll shadows
    const scrollWrapper = document.createElement('div');
    scrollWrapper.className = 'relative group';
    
    const leftBtn = document.createElement('button');
    leftBtn.className = 'absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white w-10 h-10 rounded-full hidden items-center justify-center transition opacity-0 group-hover:opacity-100 backdrop-blur-sm -ml-4';
    leftBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    const rightBtn = document.createElement('button');
    rightBtn.className = 'absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100 backdrop-blur-sm -mr-4';
    rightBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';

    items.forEach(item => {
        const type = item.media_type || forceType || 'movie';
        const itemTitle = item.title || item.name;
        const poster = `https://image.tmdb.org/t/p/w500${item.poster_path}`;

        const card = document.createElement('div');
        card.className = 'discover-card flex-none w-36 md:w-48 relative rounded-lg overflow-hidden cursor-pointer bg-bg-secondary aspect-[2/3] shadow-md';
        card.style.scrollSnapAlign = 'start';
        card.innerHTML = `
            <img src="${poster}" alt="${itemTitle}" class="w-full h-full object-cover" loading="lazy">
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p class="text-white font-bold text-sm leading-tight line-clamp-2">${itemTitle}</p>
                <div class="flex items-center gap-2 mt-2">
                    <span class="text-xs text-yellow-400 font-bold"><i class="fas fa-star mr-1"></i>${item.vote_average ? item.vote_average.toFixed(1) : 'NR'}</span>
                </div>
            </div>
        `;

        card.onclick = () => {
            window.location.href = `/?tmdb_id=${item.id}&type=${type}`;
        };

        scrollContainer.appendChild(card);
    });

    leftBtn.onclick = () => scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
    rightBtn.onclick = () => scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });

    scrollContainer.addEventListener('scroll', () => {
        if (scrollContainer.scrollLeft > 0) leftBtn.classList.remove('hidden');
        else leftBtn.classList.add('hidden');
        
        if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10) rightBtn.classList.add('hidden');
        else rightBtn.classList.remove('hidden');
    });

    scrollWrapper.appendChild(leftBtn);
    scrollWrapper.appendChild(scrollContainer);
    scrollWrapper.appendChild(rightBtn);

    rowWrapper.appendChild(header);
    rowWrapper.appendChild(scrollWrapper);

    container.appendChild(rowWrapper);
}
