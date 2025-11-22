import { supabase } from './supabase-client.js';

let currentUserView = 'juainny'; // Default view
// Override with URL query param if present
const urlParams = new URLSearchParams(window.location.search);
const userParam = urlParams.get('user');
if (userParam && (userParam === 'juainny' || userParam === 'erick')) {
    currentUserView = userParam;
}
let userAvatars = { juainny: null, erick: null };

// Minimal settings loader for profile page (avoids importing settings.js which triggers app init)
async function loadSettings() {
    const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (settings) {
        // Apply theme
        const theme = settings.theme || 'night';
        document.documentElement.setAttribute('data-theme', theme);

        // Apply wallpaper
        const wallpaperOverlay = document.getElementById('wallpaper-overlay');
        if (settings.wallpaper_url) {
            document.body.style.backgroundImage = `url('${settings.wallpaper_url}')`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundAttachment = 'fixed';
            if (wallpaperOverlay) {
                wallpaperOverlay.style.display = theme === 'smiling-friends' ? 'none' : 'block';
            }
        }

        // Load avatars - properly parse JSONB data
        if (settings.juainny_avatar) {
            userAvatars.juainny = typeof settings.juainny_avatar === 'string'
                ? JSON.parse(settings.juainny_avatar)
                : settings.juainny_avatar;
        }
        if (settings.erick_avatar) {
            userAvatars.erick = typeof settings.erick_avatar === 'string'
                ? JSON.parse(settings.erick_avatar)
                : settings.erick_avatar;
        }

        // Set device name
        const savedDeviceName = localStorage.getItem('device_name');
        const deviceNameDisplay = document.getElementById('device-name');
        if (deviceNameDisplay) deviceNameDisplay.textContent = savedDeviceName || 'User';
    }
    return settings;
}

function getAvatarHTML(user, sizeClass = '') {
    const avatar = userAvatars[user];
    if (!avatar) {
        const color = user === 'juainny' ? 'bg-purple-500' : 'bg-blue-500';
        return `<div class="${sizeClass} rounded-full ${color} flex items-center justify-center text-white font-bold">${user[0].toUpperCase()}</div>`;
    }

    const { type, color1, color2, icon, imageUrl } = avatar;

    if (type === 'image' && imageUrl) {
        return `
            <div class="${sizeClass} rounded-full relative overflow-hidden">
                <img src="${imageUrl}" class="w-full h-full object-cover">
            </div>
        `;
    }

    return `
        <div class="${sizeClass} rounded-full flex items-center justify-center relative overflow-hidden"
             style="background: linear-gradient(135deg, ${color1}, ${color2});">
            <img src="avatars/${icon}" class="w-[60%] h-[60%] object-contain drop-shadow-sm">
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    setupUserSwitcher();
    setupBannerSelector();
    await loadProfile(currentUserView);
});

let allMediaForBanners = [];

function setupBannerSelector() {
    const editBannerBtn = document.getElementById('edit-banner-btn');
    const modal = document.getElementById('banner-modal');
    const closeBtn = document.getElementById('close-banner-modal');
    const searchInput = document.getElementById('banner-search');

    editBannerBtn.addEventListener('click', async () => {
        modal.classList.remove('hidden');
        await loadBannerOptions();
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    searchInput.addEventListener('input', (e) => {
        filterBannerOptions(e.target.value);
    });
}

async function loadBannerOptions() {
    if (allMediaForBanners.length === 0) {
        const { data, error } = await supabase.from('media').select('title, backdrop_path');
        if (error) {
            console.error('Error fetching media for banners:', error);
            return;
        }
        allMediaForBanners = data.filter(item => item.backdrop_path);
    }
    renderBannerOptions(allMediaForBanners);
}

function renderBannerOptions(media) {
    const grid = document.getElementById('banner-grid');
    grid.innerHTML = '';

    media.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cursor-pointer rounded-lg overflow-hidden transition hover:scale-105';
        div.style.border = '2px solid var(--color-border-primary)';

        const backdropUrl = `https://image.tmdb.org/t/p/w500${item.backdrop_path}`;

        div.innerHTML = `
            <img src="${backdropUrl}" class="w-full h-24 object-cover">
            <div class="p-2" style="background-color: var(--color-bg-tertiary);">
                <p class="text-sm font-semibold truncate" style="color: var(--color-text-primary);">${item.title}</p>
            </div>
        `;

        div.addEventListener('click', async () => {
            await saveBanner(backdropUrl);
        });

        grid.appendChild(div);
    });
}

function filterBannerOptions(query) {
    const filtered = allMediaForBanners.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );
    renderBannerOptions(filtered);
}

async function saveBanner(bannerUrl) {
    const column = `${currentUserView}_banner`;
    const updateObj = {};
    updateObj[column] = bannerUrl;

    const { error } = await supabase.from('settings').update(updateObj).eq('id', 1);

    if (error) {
        console.error('Error saving banner:', error);
        alert('Failed to save banner.');
        return;
    }

    // Update UI
    const bannerImg = document.getElementById('profile-banner');
    const bannerPlaceholder = document.getElementById('profile-banner-placeholder');

    bannerImg.src = bannerUrl;
    bannerImg.classList.remove('hidden');
    bannerPlaceholder.classList.add('hidden');

    // Close modal
    document.getElementById('banner-modal').classList.add('hidden');
}

function setupUserSwitcher() {
    const btnJuainny = document.getElementById('view-juainny-btn');
    const btnErick = document.getElementById('view-erick-btn');

    btnJuainny.addEventListener('click', () => switchUser('juainny'));
    btnErick.addEventListener('click', () => switchUser('erick'));
}

async function switchUser(user) {
    if (currentUserView === user) return;
    currentUserView = user;
    await loadProfile(user);
}

async function loadProfile(user) {
    // Update Buttons State
    const btnJuainny = document.getElementById('view-juainny-btn');
    const btnErick = document.getElementById('view-erick-btn');

    // Reset classes - swapped so inactive is more prominent
    const inactiveClasses = ['bg-accent-primary', 'text-white', 'border-transparent', 'shadow-lg', 'scale-105'];
    const activeClasses = ['bg-bg-tertiary', 'text-text-primary', 'border-border-primary', 'hover:bg-bg-primary', 'opacity-50'];

    if (user === 'juainny') {
        btnJuainny.classList.add(...activeClasses);
        btnJuainny.classList.remove(...inactiveClasses);

        btnErick.classList.remove(...activeClasses);
        btnErick.classList.add(...inactiveClasses);
    } else {
        btnErick.classList.add(...activeClasses);
        btnErick.classList.remove(...inactiveClasses);

        btnJuainny.classList.remove(...activeClasses);
        btnJuainny.classList.add(...inactiveClasses);
    }

    // Update Profile Info
    const nameEl = document.getElementById('profile-name');
    const bioEl = document.getElementById('profile-bio');
    const avatarContainer = document.getElementById('profile-avatar-container');
    const bannerImg = document.getElementById('profile-banner');
    const bannerPlaceholder = document.getElementById('profile-banner-placeholder');

    nameEl.textContent = user === 'juainny' ? 'Juainny' : 'Erick';

    // Get Bio from Settings
    const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).single();

    if (settings) {
        const bio = user === 'juainny' ? settings.juainny_bio : settings.erick_bio;
        bioEl.textContent = bio || `No bio yet for ${user === 'juainny' ? 'Juainny' : 'Erick'}.`;

        // Banner handling
        const bannerUrl = user === 'juainny' ? settings.juainny_banner : settings.erick_banner;
        if (bannerUrl) {
            bannerImg.src = bannerUrl;
            bannerImg.classList.remove('hidden');
            bannerPlaceholder.classList.add('hidden');
        } else {
            bannerImg.classList.add('hidden');
            bannerPlaceholder.classList.remove('hidden');
        }
    }

    // Avatar - make sure userAvatars is populated from settings
    // Update header avatars too
    const navUser1 = document.getElementById('user1-avatar-nav');
    const navUser2 = document.getElementById('user2-avatar-nav');
    if (navUser1) navUser1.innerHTML = getAvatarHTML('juainny', 'w-full h-full');
    if (navUser2) navUser2.innerHTML = getAvatarHTML('erick', 'w-full h-full');

    avatarContainer.innerHTML = getAvatarHTML(user, 'w-full h-full');

    // Setup Bio Editing
    setupBioEditing(user);

    // Load Activity Feed
    await loadActivityFeed(user);
}

function setupBioEditing(user) {
    const editBtn = document.getElementById('edit-bio-btn');
    const displayContainer = document.getElementById('bio-display-container');
    const editContainer = document.getElementById('bio-edit-container');
    const bioInput = document.getElementById('bio-input');
    const cancelBtn = document.getElementById('cancel-bio-btn');
    const saveBtn = document.getElementById('save-bio-btn');
    const bioEl = document.getElementById('profile-bio');

    // Reset state
    displayContainer.classList.remove('hidden');
    editContainer.classList.add('hidden');

    // Clone and replace buttons to remove old listeners (simple way to avoid duplicates on user switch)
    const newEditBtn = editBtn.cloneNode(true);
    editBtn.parentNode.replaceChild(newEditBtn, editBtn);

    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    // Add Listeners
    newEditBtn.addEventListener('click', () => {
        bioInput.value = bioEl.textContent.trim() === `No bio yet for ${user === 'juainny' ? 'Juainny' : 'Erick'}.` ? '' : bioEl.textContent.trim();
        displayContainer.classList.add('hidden');
        editContainer.classList.remove('hidden');
        bioInput.focus();
    });

    newCancelBtn.addEventListener('click', () => {
        displayContainer.classList.remove('hidden');
        editContainer.classList.add('hidden');
    });

    newSaveBtn.addEventListener('click', async () => {
        const newBio = bioInput.value.trim();

        // Optimistic Update
        bioEl.textContent = newBio || `No bio yet for ${user === 'juainny' ? 'Juainny' : 'Erick'}.`;
        displayContainer.classList.remove('hidden');
        editContainer.classList.add('hidden');

        // Save to DB
        const updateObj = {};
        updateObj[`${user}_bio`] = newBio;

        const { error } = await supabase
            .from('settings')
            .update(updateObj)
            .eq('id', 1);

        if (error) {
            console.error('Error saving bio:', error);
            alert('Failed to save bio. Please try again.');
            // Revert on error (could be fancier but this is fine for now)
            // We'd need to fetch again to revert accurately
        }
    });
}

async function loadActivityFeed(user) {
    const feedContainer = document.getElementById('activity-feed');
    feedContainer.innerHTML = '<div class="p-8 text-center text-text-muted"><i class="fas fa-spinner fa-spin text-2xl mb-2"></i><p>Loading activity...</p></div>';

    // Fetch activity from activity_log
    // We want activities where user_id is 'both' OR the specific user
    const { data: activities, error } = await supabase
        .from('activity_log')
        .select(`
            *,
            media:media_id (
                title, poster_path, backdrop_path, type
            )
        `)
        .or(`user_id.eq.${user},user_id.eq.both`)
        .order('created_at', { ascending: false })
        .limit(50); // Increased limit to allow for grouping

    if (error) {
        console.error('Error fetching activity:', error);
        feedContainer.innerHTML = '<div class="p-4 text-center text-danger">Failed to load activity.</div>';
        return;
    }

    if (!activities || activities.length === 0) {
        feedContainer.innerHTML = '<div class="p-8 text-center text-text-muted">No recent activity.</div>';
        return;
    }

    feedContainer.innerHTML = '';

    // Group activities
    const groupedActivities = groupActivities(activities);

    groupedActivities.forEach(group => {
        const item = createActivityItem(group, user);
        feedContainer.appendChild(item);
    });
}

function groupActivities(activities) {
    const grouped = [];
    if (activities.length === 0) return grouped;

    let currentGroup = {
        ...activities[0],
        count: 1,
        timestamps: [activities[0].created_at]
    };

    for (let i = 1; i < activities.length; i++) {
        const activity = activities[i];
        const prevActivity = currentGroup;

        // Check if same user, action, and media
        const isSameUser = activity.user_id === prevActivity.user_id;
        const isSameAction = activity.action_type === prevActivity.action_type;
        const isSameMedia = activity.media_id === prevActivity.media_id;

        // Check if within a reasonable time window (e.g., same day)
        const date1 = new Date(activity.created_at).toDateString();
        const date2 = new Date(prevActivity.created_at).toDateString();
        const isSameDay = date1 === date2;

        if (isSameUser && isSameAction && isSameMedia && isSameDay) {
            currentGroup.count++;
            currentGroup.timestamps.push(activity.created_at);
            // Keep the latest details if they differ, or merge them if needed
            // For notes, we might want to show the latest note or indicate multiple notes
        } else {
            grouped.push(currentGroup);
            currentGroup = {
                ...activity,
                count: 1,
                timestamps: [activity.created_at]
            };
        }
    }
    grouped.push(currentGroup);
    return grouped;
}

function createActivityItem(activity, viewUser) {
    const { action_type, details, created_at, media, count } = activity;
    const date = new Date(created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    const div = document.createElement('div');
    div.className = 'p-4 transition flex gap-4 items-start';
    div.style.borderBottom = '1px solid var(--color-border-primary)';
    div.addEventListener('mouseenter', () => {
        div.style.backgroundColor = 'var(--color-bg-tertiary)';
    });
    div.addEventListener('mouseleave', () => {
        div.style.backgroundColor = '';
    });

    // Icon based on action
    let iconClass = 'fa-circle';
    let iconColor = 'var(--color-text-muted)';
    let actionText = 'interacted with';

    switch (action_type) {
        case 'watched':
            iconClass = 'fa-check-circle';
            iconColor = 'var(--color-accent-primary)';
            actionText = 'watched';
            break;
        case 'want_to_watch':
            iconClass = 'fa-bookmark';
            iconColor = '#fbbf24'; // yellow-400
            actionText = 'wants to watch';
            break;
        case 'currently_watching':
            iconClass = 'fa-play-circle';
            iconColor = '#3b82f6'; // blue-500
            actionText = 'is watching';
            break;
        case 'rating':
            iconClass = 'fa-star';
            iconColor = '#f59e0b'; // yellow-500
            actionText = 'rated';
            break;
        case 'review':
            iconClass = 'fa-comment-alt';
            iconColor = '#10b981'; // green-500
            actionText = 'reviewed';
            break;
        case 'favorite':
            iconClass = 'fa-heart';
            iconColor = '#ef4444'; // red-500
            actionText = 'favorited';
            break;
        case 'note_added':
            iconClass = 'fa-sticky-note';
            iconColor = '#f59e0b';
            actionText = count > 1 ? `added ${count} notes to` : 'added a note to';
            break;
        case 'rate': // This case was 'rate' in the original, now it's 'rating' above. Keeping for backward compatibility if needed, but 'rating' is preferred.
            iconClass = 'fa-star-half-alt';
            iconColor = '#fb923c';
            actionText = 'rated';
            break;
    }

    const posterUrl = media.poster_path
        ? `https://image.tmdb.org/t/p/w92${media.poster_path}`
        : 'https://placehold.co/92x138?text=No+Image';

    const title = media.title || 'Unknown Title';

    div.innerHTML = `
        <div class="flex-shrink-0 mt-1">
            <i class="fas ${iconClass} text-xl" style="color: ${iconColor};"></i>
        </div>
        <div class="flex-grow">
            <div class="flex justify-between items-start">
                <p style="color: var(--color-text-primary);">
                    <span class="font-semibold">${viewUser === 'juainny' ? 'Juainny' : 'Erick'}</span>
                    <span style="color: var(--color-text-muted);">${actionText}</span>
                    <span class="font-semibold" style="color: var(--color-accent-primary);">${title}</span>
                </p>
                <span class="text-xs whitespace-nowrap ml-2" style="color: var(--color-text-muted);">${date}</span>
            </div>
            ${details && details.reaction ? `
                <div class="mt-2 p-2 rounded-lg inline-block" style="background-color: var(--color-bg-primary); border: 1px solid var(--color-border-primary);">
                    <img src="moods/${details.reaction}" class="w-8 h-8 object-contain" alt="Reaction">
                </div>
            ` : ''}
            ${details && details.note ? `
                <div class="mt-2 p-3 rounded-lg text-sm italic" style="background-color: var(--color-bg-primary); border: 1px solid var(--color-border-primary); color: var(--color-text-secondary);">
                    "${details.note}"
                    ${count > 1 ? `<span class="text-xs text-text-muted block mt-1">(and ${count - 1} more updates)</span>` : ''}
                </div>
            ` : ''}
             ${details && details.rating ? `
                <div class="mt-2 text-sm" style="color: var(--color-star-filled);">
                    ${'★'.repeat(Math.round(details.rating))} <span style="color: var(--color-text-muted);">(${details.rating}/5)</span>
                </div>
            ` : ''}
        </div>
        <div class="flex-shrink-0 w-12 h-18 rounded overflow-hidden shadow-sm ml-2">
            <img src="${posterUrl}" class="w-full h-full object-cover" alt="${title}">
        </div>
    `;

    return div;
}
