import { supabase } from './supabase-client.js';

let currentUserView = 'juainny'; // Default view
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

        // Load avatars
        userAvatars.juainny = settings.user1_avatar;
        userAvatars.erick = settings.user2_avatar;

        // Set device name
        const savedDeviceName = localStorage.getItem('device_name');
        const deviceNameDisplay = document.getElementById('device-name');
        if (deviceNameDisplay) deviceNameDisplay.textContent = savedDeviceName || 'User';
    }
    return settings;
}

function getAvatarHTML(user, classes = '') {
    const avatar = userAvatars[user];
    if (!avatar) {
        return `<div class="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">${user.charAt(0).toUpperCase()}</div>`;
    }

    if (avatar.startsWith('emoji:')) {
        const emoji = avatar.replace('emoji:', '');
        return `<div class="${classes} flex items-center justify-center text-4xl">${emoji}</div>`;
    }

    return `<img src="${avatar}" class="${classes} object-cover" alt="${user} avatar">`;
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    setupUserSwitcher();
    await loadProfile(currentUserView);
});

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

    if (user === 'juainny') {
        btnJuainny.classList.add('bg-accent-primary', 'text-white', 'border-transparent');
        btnJuainny.classList.remove('bg-bg-tertiary', 'text-text-primary', 'border-border-primary');

        btnErick.classList.remove('bg-accent-primary', 'text-white', 'border-transparent');
        btnErick.classList.add('bg-bg-tertiary', 'text-text-primary', 'border-border-primary');
    } else {
        btnErick.classList.add('bg-accent-primary', 'text-white', 'border-transparent');
        btnErick.classList.remove('bg-bg-tertiary', 'text-text-primary', 'border-border-primary');

        btnJuainny.classList.remove('bg-accent-primary', 'text-white', 'border-transparent');
        btnJuainny.classList.add('bg-bg-tertiary', 'text-text-primary', 'border-border-primary');
    }

    // Update Profile Info
    const nameEl = document.getElementById('profile-name');
    const handleEl = document.getElementById('profile-handle');
    const bioEl = document.getElementById('profile-bio');
    const avatarContainer = document.getElementById('profile-avatar-container');
    const bannerImg = document.getElementById('profile-banner');
    const bannerPlaceholder = document.getElementById('profile-banner-placeholder');

    nameEl.textContent = user === 'juainny' ? 'Juainny' : 'Erick';
    handleEl.textContent = user === 'juainny' ? '@juainny' : '@erick';

    // Get Bio from Settings (already loaded into DOM inputs by loadAndApplySettings, or we can fetch again/use global state if we had one)
    // Since loadAndApplySettings populates inputs in the modal (which isn't here), we should probably export the data or fetch it.
    // Actually, loadAndApplySettings in settings.js fetches data but only populates elements if they exist.
    // Let's just fetch the settings directly here to be safe and clean.

    const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).single();

    if (settings) {
        const bio = user === 'juainny' ? settings.juainny_bio : settings.erick_bio;
        bioEl.textContent = bio || `No bio yet for ${user === 'juainny' ? 'Juainny' : 'Erick'}.`;

        // Banner (using wallpaper for now, or we could add specific profile banners later)
        // For now, let's use the main wallpaper if set, or a default color
        if (settings.wallpaper_url) {
            bannerImg.src = settings.wallpaper_url;
            bannerImg.classList.remove('hidden');
            bannerPlaceholder.classList.add('hidden');
        } else {
            bannerImg.classList.add('hidden');
            bannerPlaceholder.classList.remove('hidden');
        }
    }

    // Avatar
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
                title, name, poster_path, backdrop_path, media_type
            )
        `)
        .or(`user_id.eq.${user},user_id.eq.both`)
        .order('created_at', { ascending: false })
        .limit(20);

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

    activities.forEach(activity => {
        const item = createActivityItem(activity, user);
        feedContainer.appendChild(item);
    });
}

function createActivityItem(activity, viewUser) {
    const { action_type, details, created_at, media } = activity;
    const date = new Date(created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    const div = document.createElement('div');
    div.className = 'p-4 hover:bg-bg-tertiary/50 transition flex gap-4 items-start';

    // Icon based on action
    let iconClass = 'fa-circle';
    let iconColor = 'text-text-muted';
    let actionText = 'did something with';

    switch (action_type) {
        case 'watched':
            iconClass = 'fa-check-circle';
            iconColor = 'text-success';
            actionText = 'watched';
            break;
        case 'want_to_watch':
            iconClass = 'fa-bookmark';
            iconColor = 'text-info';
            actionText = 'wants to watch';
            break;
        case 'favorite':
            iconClass = 'fa-star';
            iconColor = 'text-yellow-500';
            actionText = 'favorited';
            break;
        case 'reaction':
            iconClass = 'fa-face-smile';
            iconColor = 'text-accent-primary';
            actionText = 'reacted to';
            break;
        case 'note_added':
            iconClass = 'fa-sticky-note';
            iconColor = 'text-warning';
            actionText = 'added a note to';
            break;
        case 'rate':
            iconClass = 'fa-star-half-alt';
            iconColor = 'text-orange-400';
            actionText = 'rated';
            break;
    }

    const posterUrl = media.poster_path
        ? `https://image.tmdb.org/t/p/w92${media.poster_path}`
        : 'https://placehold.co/92x138?text=No+Image';

    const title = media.title || media.name || 'Unknown Title';

    div.innerHTML = `
        <div class="flex-shrink-0 mt-1">
            <i class="fas ${iconClass} ${iconColor} text-xl"></i>
        </div>
        <div class="flex-grow">
            <div class="flex justify-between items-start">
                <p class="text-text-primary">
                    <span class="font-semibold">${viewUser === 'juainny' ? 'Juainny' : 'Erick'}</span>
                    <span class="text-text-muted">${actionText}</span>
                    <span class="font-semibold text-accent-primary">${title}</span>
                </p>
                <span class="text-xs text-text-muted whitespace-nowrap ml-2">${date}</span>
            </div>
            ${details && details.reaction ? `
                <div class="mt-2 bg-bg-primary p-2 rounded-lg inline-block border border-border-primary">
                    <img src="moods/${details.reaction}" class="w-8 h-8 object-contain" alt="Reaction">
                </div>
            ` : ''}
            ${details && details.note ? `
                <div class="mt-2 bg-bg-primary p-3 rounded-lg border border-border-primary text-sm italic text-text-secondary">
                    "${details.note}"
                </div>
            ` : ''}
             ${details && details.rating ? `
                <div class="mt-2 text-yellow-400 text-sm">
                    ${'★'.repeat(Math.round(details.rating))} <span class="text-text-muted">(${details.rating}/5)</span>
                </div>
            ` : ''}
        </div>
        <div class="flex-shrink-0 w-12 h-18 rounded overflow-hidden shadow-sm ml-2">
            <img src="${posterUrl}" class="w-full h-full object-cover" alt="${title}">
        </div>
    `;

    return div;
}
