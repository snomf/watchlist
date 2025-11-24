import { supabase } from './supabase-client.js';
import { setupEasterEggs } from './features/easter-eggs.js';

let allMediaForWallpapers = [];

/**
 * Opens the settings modal and populates it with current data.
 */
export async function openSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    if (!settingsModal) {
        console.error('Settings modal element not found!');
        return;
    }

    try {
        await populateWallpaperSelector();
        await loadAndApplySettings();
    } catch (error) {
        console.error('Error preparing settings modal:', error);
        // Continue opening modal even if prep fails
    }

    // Prevent background scrolling (matches other modals and might trigger layout fix)
    document.body.style.overflow = 'hidden';

    settingsModal.classList.remove('hidden');
    settingsModal.classList.remove('modal-hidden');
    settingsModal.classList.add('flex');

    // Add listeners to theme buttons for instant wallpaper preview/selection
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Visual selection update
            themeBtns.forEach(b => b.classList.remove('border-accent-primary'));
            btn.classList.add('border-accent-primary');

            // Special logic for Smiling Friends
            if (btn.dataset.theme === 'smiling-friends') {
                const bannerSelect = document.getElementById('movie-banner-select');
                // Set to a specific Smiling Friends wallpaper if available, or a default URL
                // Since we don't have the URL in the dropdown, we might need to add it or just set the value
                // Let's assume we want to set a custom URL.
                // But the select box only allows options that exist.
                // We can add an option dynamically.

                const sfWallpaperUrl = 'https://images6.alphacoders.com/134/1346437.png'; // Smiling Friends Wallpaper

                // Check if option exists
                let option = Array.from(bannerSelect.options).find(o => o.value === sfWallpaperUrl);
                if (!option) {
                    option = document.createElement('option');
                    option.value = sfWallpaperUrl;
                    option.textContent = 'Smiling Friends (Theme Default)';
                    bannerSelect.appendChild(option);
                }
                bannerSelect.value = sfWallpaperUrl;
            }
        });
    });
}

/**
 * Closes the settings modal.
 */
export function closeSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal) {
        settingsModal.classList.add('hidden');
        settingsModal.classList.add('modal-hidden');
        settingsModal.classList.remove('flex');
        // Restore background scrolling
        document.body.style.overflow = '';
    }
}

/**
 * Fetches all media to populate the wallpaper selector.
 */
async function fetchAllMediaForWallpapers() {
    if (allMediaForWallpapers.length > 0) return; // Avoid re-fetching
    const { data, error } = await supabase.from('media').select('title, backdrop_path');
    if (error) {
        console.error('Error fetching media for wallpapers:', error);
        return;
    }
    allMediaForWallpapers = data.filter(item => item.backdrop_path);
}

/**
 * Sets up the wallpaper modal selector
 */
function setupWallpaperModal() {
    const wallpaperBtn = document.getElementById('wallpaper-btn');
    const modal = document.getElementById('wallpaper-modal');
    const closeBtn = document.getElementById('close-wallpaper-modal');
    const searchInput = document.getElementById('wallpaper-search');

    if (!wallpaperBtn || !modal) return;

    wallpaperBtn.addEventListener('click', async () => {
        modal.classList.remove('hidden');
        await loadWallpaperOptions();
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
        filterWallpaperOptions(e.target.value);
    });
}

async function loadWallpaperOptions() {
    if (allMediaForWallpapers.length === 0) {
        const { data, error } = await supabase.from('media').select('title, backdrop_path');
        if (error) {
            console.error('Error fetching media for wallpapers:', error);
            return;
        }
        allMediaForWallpapers = data.filter(item => item.backdrop_path);
    }
    renderWallpaperOptions(allMediaForWallpapers);
}

function renderWallpaperOptions(media) {
    const grid = document.getElementById('wallpaper-grid');
    if (!grid) return;
    grid.innerHTML = '';

    media.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cursor-pointer rounded-lg overflow-hidden transition hover:scale-105';
        div.style.border = '2px solid var(--color-border-primary)';

        const backdropUrl = `https://image.tmdb.org/t/p/original${item.backdrop_path}`;

        div.innerHTML = `
            <img src="${backdropUrl}" class="w-full h-24 object-cover">
            <div class="p-2" style="background-color: var(--color-bg-tertiary);">
                <p class="text-sm font-semibold truncate" style="color: var(--color-text-primary);">${item.title}</p>
            </div>
        `;

        div.addEventListener('click', async () => {
            selectedWallpaper = backdropUrl;
            await saveSettings();
            document.getElementById('wallpaper-modal').classList.add('hidden');
        });

        grid.appendChild(div);
    });
}

function filterWallpaperOptions(query) {
    const filtered = allMediaForWallpapers.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );
    renderWallpaperOptions(filtered);
}

let selectedWallpaper = null;

/**
 * Saves the selected theme and wallpaper to Supabase.
 */
/**
 * Saves the selected theme and wallpaper to Supabase.
 * @param {boolean} closeModal - Whether to close the settings modal after saving. Default true.
 */
async function saveSettings(closeModal = true) {
    // Get selected theme from the button that has the border class
    const selectedThemeBtn = document.querySelector('.theme-btn.border-accent-primary');
    const selectedTheme = selectedThemeBtn ? selectedThemeBtn.dataset.theme : 'night';

    // Get wallpaper URL from selectedWallpaper (set by modal selection)
    // IMPORTANT: If selectedWallpaper is null, it might mean "no change" or "remove".
    // But here we want to persist whatever is currently active if selectedWallpaper hasn't been explicitly set to something new.
    // However, selectedWallpaper is our "staging" variable.
    // If it's null, we should probably check if we want to keep the existing one?
    // Actually, let's make sure selectedWallpaper is initialized with the current value on load.

    const wallpaperUrl = selectedWallpaper;

    // Device Name
    const deviceNameInput = document.getElementById('device-name-input');
    const deviceName = deviceNameInput ? deviceNameInput.value.trim() : '';

    // Save device name to localStorage
    if (deviceName) {
        localStorage.setItem('device_name', deviceName);
    }

    const deviceNameDisplay = document.getElementById('device-name');
    if (deviceNameDisplay) deviceNameDisplay.textContent = deviceName || 'User';

    const { error } = await supabase.from('settings').update({
        theme: selectedTheme,
        wallpaper_url: wallpaperUrl
    }).eq('id', 1);

    if (error) {
        console.error('Error saving settings:', error);
    } else {
        await loadAndApplySettings(); // Re-apply settings after saving
        if (closeModal) {
            closeSettingsModal();
        }
    }
}

/**
 * Loads settings from Supabase and applies them to the UI.
 */
export async function loadAndApplySettings() {
    const { data, error } = await supabase
        .from('settings')
        .select('theme, wallpaper_url, hide_search_results_without_images, juainny_avatar, erick_avatar')
        .eq('id', 1)
        .single();

    if (error || !data) {
        console.error('Error loading settings:', error);
        // Fallback to a default theme if settings are not found
        document.documentElement.setAttribute('data-theme', 'night');
        return;
    }

    // Apply Theme
    const { theme, wallpaper_url, hide_search_results_without_images, juainny_avatar, erick_avatar } = data;
    document.documentElement.setAttribute('data-theme', theme || 'night');

    // Initialize selectedWallpaper with current DB value so we don't lose it on save
    if (selectedWallpaper === null) {
        selectedWallpaper = wallpaper_url;
    }

    // Update Avatar Cache
    if (juainny_avatar) userAvatars['juainny'] = juainny_avatar;
    if (erick_avatar) userAvatars['erick'] = erick_avatar;

    // Update Avatar Previews in Settings Modal
    const updateSettingsPreview = (user, elementId) => {
        const container = document.getElementById(elementId);
        if (container) {
            container.innerHTML = getAvatarHTML(user, 'w-full h-full');
        }
    };
    updateSettingsPreview('juainny', 'user1-avatar-preview');
    updateSettingsPreview('erick', 'user2-avatar-preview');

    // Update Theme Picker UI
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        if (btn.dataset.theme === (theme || 'night')) {
            btn.classList.add('border-accent-primary');
        } else {
            btn.classList.remove('border-accent-primary');
        }
    });

    // Set the toggle
    document.getElementById('hide-search-images-toggle').checked = hide_search_results_without_images;

    // Apply wallpaper
    const wallpaperOverlay = document.getElementById('wallpaper-overlay');
    if (wallpaper_url) {
        document.body.style.backgroundImage = `url('${wallpaper_url}')`;
        document.body.style.backgroundSize = 'cover';
        // Use better positioning for mobile
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        document.body.style.backgroundPosition = isMobile ? 'center top' : 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';
        // Hide overlay for Smiling Friends theme, show for others
        if (wallpaperOverlay) {
            if (theme === 'smiling-friends') {
                wallpaperOverlay.style.display = 'none';
            } else {
                wallpaperOverlay.style.display = 'block';
            }
        }
    } else {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundSize = '';
        document.body.style.backgroundPosition = '';
        document.body.style.backgroundRepeat = '';
        document.body.style.backgroundAttachment = '';
        if (wallpaperOverlay) wallpaperOverlay.style.display = 'none';
    }

    // Trigger Easter Egg check
    if (typeof setupEasterEggs === 'function') {
        setupEasterEggs();
    }

    // Set the selected option in the dropdown
    const bannerSelect = document.getElementById('movie-banner-select');
    if (bannerSelect) bannerSelect.value = wallpaper_url || '';

    // Set device name from localStorage
    const savedDeviceName = localStorage.getItem('device_name');
    const deviceNameInput = document.getElementById('device-name-input');
    const deviceNameDisplay = document.getElementById('device-name');
    if (deviceNameInput) deviceNameInput.value = savedDeviceName || '';
    if (deviceNameDisplay) deviceNameDisplay.textContent = savedDeviceName || 'User';

    // Update Top Bar Avatars (if elements exist)
    const navUser1 = document.getElementById('user1-avatar-nav');
    const navUser2 = document.getElementById('user2-avatar-nav');
    if (navUser1) navUser1.innerHTML = getAvatarHTML('juainny', 'w-full h-full');
    if (navUser2) navUser2.innerHTML = getAvatarHTML('erick', 'w-full h-full');
}

/**
 * Initializes the settings functionality and event listeners.
 */
export function initializeSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings-modal-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const removeWallpaperBtn = document.getElementById('remove-wallpaper-btn');

    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            openSettingsModal(e);
        });
    } else {
        console.error('Settings button NOT found in DOM during initialization.');
    }

    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettingsModal);
    if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveSettings);

    // Refresh Buttons
    const softRefreshBtn = document.getElementById('soft-refresh-btn');
    const emergencyRefreshBtn = document.getElementById('emergency-refresh-btn');

    if (softRefreshBtn) {
        softRefreshBtn.addEventListener('click', () => {
            const url = new URL(window.location.href);
            url.searchParams.set('refresh', 'true');
            window.location.href = url.toString();
        });
    }

    if (emergencyRefreshBtn) {
        emergencyRefreshBtn.addEventListener('click', () => {
            const url = new URL(window.location.href);
            url.searchParams.set('hardrefresh', 'true');
            window.location.href = url.toString();
        });
    }

    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedTheme = btn.dataset.theme;

            // Immediately apply the theme visually
            document.documentElement.setAttribute('data-theme', selectedTheme);

            // Update the UI to show the active theme
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('border-accent-primary'));
            btn.classList.add('border-accent-primary');

            // Show the Theme Change Modal instead of saving immediately
            const themeChangeModal = document.getElementById('theme-change-modal');
            if (themeChangeModal) {
                themeChangeModal.classList.remove('hidden');
                themeChangeModal.classList.add('flex');
            } else {
                // Fallback if modal is missing
                saveSettings(false);
            }
        });
    });

    // Theme Change Modal Listeners
    const themeChangeNewBtn = document.getElementById('theme-change-new-wallpaper-btn');
    const themeChangeNoBtn = document.getElementById('theme-change-no-wallpaper-btn');
    const themeChangeCancelBtn = document.getElementById('theme-change-cancel-btn');
    const themeChangeModal = document.getElementById('theme-change-modal');

    if (themeChangeNewBtn) {
        themeChangeNewBtn.addEventListener('click', async () => {
            // Close theme modal
            themeChangeModal.classList.add('hidden');
            themeChangeModal.classList.remove('flex');

            // Save theme first (keep settings open)
            await saveSettings(false);

            // Open wallpaper picker
            const wallpaperBtn = document.getElementById('wallpaper-btn');
            if (wallpaperBtn) wallpaperBtn.click();
        });
    }

    if (themeChangeNoBtn) {
        themeChangeNoBtn.addEventListener('click', async () => {
            // Remove wallpaper
            selectedWallpaper = null;

            // Close theme modal
            themeChangeModal.classList.add('hidden');
            themeChangeModal.classList.remove('flex');

            // Save settings (theme + no wallpaper) and keep settings open
            await saveSettings(false);
        });
    }

    if (themeChangeCancelBtn) {
        themeChangeCancelBtn.addEventListener('click', async () => {
            // Close theme modal
            themeChangeModal.classList.add('hidden');
            themeChangeModal.classList.remove('flex');

            // Save theme only (keep existing wallpaper) and keep settings open
            await saveSettings(false);
        });
    }

    // Setup Wallpaper Modal
    setupWallpaperModal();

    if (removeWallpaperBtn) {
        removeWallpaperBtn.addEventListener('click', async () => {
            selectedWallpaper = null;
            await saveSettings();
        });
    }

    // Avatar Picker Buttons in Settings Modal
    const user1AvatarBtn = document.getElementById('avatar-picker-user1-btn');
    const user2AvatarBtn = document.getElementById('avatar-picker-user2-btn');

    if (user1AvatarBtn) {
        user1AvatarBtn.addEventListener('click', () => openAvatarModal('juainny'));
    }
    if (user2AvatarBtn) {
        user2AvatarBtn.addEventListener('click', () => openAvatarModal('erick'));
    }

    // Avatar Modal Controls
    const closeAvatarBtn = document.getElementById('close-avatar-modal-btn');
    const closeAvatarBackdrop = document.getElementById('close-avatar-modal-backdrop');
    const saveAvatarBtn = document.getElementById('save-avatar-btn');

    if (closeAvatarBtn) closeAvatarBtn.addEventListener('click', closeAvatarModal);
    if (closeAvatarBackdrop) closeAvatarBackdrop.addEventListener('click', closeAvatarModal);
    if (saveAvatarBtn) saveAvatarBtn.addEventListener('click', saveAvatar);

    // User Switcher in Avatar Modal
    document.querySelectorAll('.avatar-user-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentAvatarState.user = btn.dataset.user;
            // Reset to gradient mode on user switch if no image
            if (!userAvatars[currentAvatarState.user]?.imageUrl) {
                currentAvatarState.mode = 'gradient';
            } else {
                currentAvatarState.mode = userAvatars[currentAvatarState.user].type || 'gradient';
            }
            updateAvatarModalUI();
        });
    });

    // Mode Switcher
    document.querySelectorAll('.avatar-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentAvatarState.mode = btn.dataset.mode;
            updateAvatarModalUI();
        });
    });

    // File Input Handler
    const fileInput = document.getElementById('avatar-file-input');
    if (fileInput) {
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                document.getElementById('avatar-file-name').textContent = file.name;
                document.getElementById('avatar-file-name').classList.remove('hidden');

                // Upload immediately to preview? Or wait for save?
                // Let's upload immediately to get URL for preview
                const publicUrl = await uploadAvatarImage(file);
                if (publicUrl) {
                    currentAvatarState.imageUrl = publicUrl;
                    renderAvatarPreview();
                }
            }
        });
    }

    // URL Input Handler
    const urlInput = document.getElementById('avatar-url-input');
    if (urlInput) {
        urlInput.addEventListener('input', (e) => {
            const url = e.target.value.trim();
            if (url) {
                // Clear file input
                if (fileInput) fileInput.value = '';
                document.getElementById('avatar-file-name').textContent = '';
                document.getElementById('avatar-file-name').classList.add('hidden');

                currentAvatarState.imageUrl = url;
                renderAvatarPreview();
            }
        });
    }
}

// --- AVATAR LOGIC ---

const AVATAR_COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16',
    '#10b981', '#06b6d4', '#3b82f6', '#6366f1',
    '#8b5cf6', '#d946ef', '#f43f5e', '#1f2937'
];

const AVATAR_ICONS = [
    'cat.png', 'headphones.png', 'sofa.png', 'spider.png', 'ticket.png'
];

let currentAvatarState = {
    user: 'juainny', // 'juainny' or 'erick'
    mode: 'gradient', // 'gradient' or 'image'
    color1: '#3b82f6',
    color2: '#8b5cf6',
    icon: 'cat.png',
    imageUrl: null
};

// Cache for avatars to avoid constant DB fetching
export let userAvatars = {};

async function openAvatarModal(user) {
    const modal = document.getElementById('avatar-modal');
    if (!modal) return;

    // Load current settings for this user
    await loadAndApplySettings();

    const existingAvatar = userAvatars[user];
    if (existingAvatar) {
        currentAvatarState = {
            ...existingAvatar,
            user,
            mode: existingAvatar.type || 'gradient'
        };
    } else {
        // Defaults
        currentAvatarState = {
            user,
            mode: 'gradient',
            color1: user === 'juainny' ? '#8b5cf6' : '#3b82f6',
            color2: user === 'juainny' ? '#d946ef' : '#06b6d4',
            icon: 'cat.png',
            imageUrl: null
        };
    }

    renderColorPickers();
    renderIconPicker();
    updateAvatarModalUI();

    // Reset file input
    const fileInput = document.getElementById('avatar-file-input');
    if (fileInput) fileInput.value = '';
    document.getElementById('avatar-file-name').textContent = '';
    document.getElementById('avatar-file-name').classList.add('hidden');

    modal.classList.remove('hidden');
    modal.classList.remove('modal-hidden');
    modal.classList.add('flex');
}

function closeAvatarModal() {
    const modal = document.getElementById('avatar-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.add('modal-hidden');
        modal.classList.remove('flex');
    }
}

function updateAvatarModalUI() {
    // Update User Buttons
    document.querySelectorAll('.avatar-user-btn').forEach(btn => {
        if (btn.dataset.user === currentAvatarState.user) {
            btn.classList.add('border-accent-primary', 'bg-bg-tertiary');
        } else {
            btn.classList.remove('border-accent-primary', 'bg-bg-tertiary');
        }
    });

    // Update Mode Buttons
    document.querySelectorAll('.avatar-mode-btn').forEach(btn => {
        if (btn.dataset.mode === currentAvatarState.mode) {
            btn.classList.add('bg-bg-secondary', 'text-text-primary', 'shadow-sm');
            btn.classList.remove('text-text-muted', 'hover:text-text-primary');
        } else {
            btn.classList.remove('bg-bg-secondary', 'text-text-primary', 'shadow-sm');
            btn.classList.add('text-text-muted', 'hover:text-text-primary');
        }
    });

    // Show/Hide Controls based on Mode
    const gradientControls = document.getElementById('avatar-gradient-controls');
    const imageControls = document.getElementById('avatar-image-controls');

    if (currentAvatarState.mode === 'gradient') {
        gradientControls.classList.remove('hidden');
        imageControls.classList.add('hidden');
    } else {
        gradientControls.classList.add('hidden');
        imageControls.classList.remove('hidden');
    }

    // Update Color Pickers Selection
    document.querySelectorAll('.color-option').forEach(btn => {
        const type = btn.dataset.type; // 'color1' or 'color2'
        const color = btn.dataset.color;
        if (currentAvatarState[type] === color) {
            btn.classList.add('ring-2', 'ring-white');
        } else {
            btn.classList.remove('ring-2', 'ring-white');
        }
    });

    // Update Icon Picker Selection
    document.querySelectorAll('.icon-option').forEach(btn => {
        if (btn.dataset.icon === currentAvatarState.icon) {
            btn.classList.add('border-accent-primary', 'bg-bg-tertiary');
        } else {
            btn.classList.remove('border-accent-primary', 'bg-bg-tertiary');
        }
    });

    renderAvatarPreview();
}

function renderColorPickers() {
    const renderPicker = (elementId, type) => {
        const container = document.getElementById(elementId);
        if (!container) return;
        container.innerHTML = '';
        AVATAR_COLORS.forEach(color => {
            const btn = document.createElement('button');
            btn.className = 'color-option w-8 h-8 rounded-full cursor-pointer transition transform hover:scale-110';
            btn.style.backgroundColor = color;
            btn.dataset.color = color;
            btn.dataset.type = type;
            btn.addEventListener('click', () => {
                currentAvatarState[type] = color;
                updateAvatarModalUI();
            });
            container.appendChild(btn);
        });
    };

    renderPicker('color-picker-1', 'color1');
    renderPicker('color-picker-2', 'color2');
}

function renderIconPicker() {
    const container = document.getElementById('icon-picker');
    if (!container) return;
    container.innerHTML = '';

    // Add "No Icon" option (optional, but good to have)
    // Actually user requirement implies an icon is chosen. 
    // But let's stick to the list.

    AVATAR_ICONS.forEach(icon => {
        const btn = document.createElement('button');
        btn.className = 'icon-option p-2 rounded-lg border-2 border-transparent hover:bg-bg-tertiary transition flex items-center justify-center';
        btn.dataset.icon = icon;
        btn.innerHTML = `<img src="avatars/${icon}" class="w-8 h-8 object-contain">`;
        btn.addEventListener('click', () => {
            currentAvatarState.icon = icon;
            updateAvatarModalUI();
        });
        container.appendChild(btn);
    });
}

function renderAvatarPreview() {
    const previewContainer = document.getElementById('avatar-preview-display');
    if (!previewContainer) return;

    const { color1, color2, icon, user, mode, imageUrl } = currentAvatarState;

    if (mode === 'image' && imageUrl) {
        previewContainer.style.background = 'none';
        previewContainer.innerHTML = `<img src="${imageUrl}" class="w-full h-full object-cover">`;
    } else {
        previewContainer.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
        if (icon) {
            previewContainer.innerHTML = `<img src="avatars/${icon}" class="w-16 h-16 object-contain drop-shadow-md">`;
        } else {
            previewContainer.innerHTML = `<span class="text-4xl font-bold text-white drop-shadow-md">${user[0].toUpperCase()}</span>`;
        }
    }
}

async function uploadAvatarImage(file) {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
        .from('images')
        .upload(`avatars/${fileName}`, file);

    if (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
        return null;
    }

    const { data: publicData } = supabase.storage
        .from('images')
        .getPublicUrl(`avatars/${fileName}`);

    return publicData.publicUrl;
}

async function saveAvatar() {
    const { user, mode, color1, color2, icon, imageUrl } = currentAvatarState;

    const avatarData = {
        type: mode,
        color1,
        color2,
        icon,
        imageUrl
    };

    // Update local cache
    userAvatars[user] = avatarData;

    // Update Supabase (Separate Columns)
    const updateObj = {};
    updateObj[`${user}_avatar`] = avatarData;

    const { error } = await supabase
        .from('settings')
        .update(updateObj)
        .eq('id', 1);

    if (error) {
        console.error('Error saving avatar:', error);
        alert('Failed to save avatar. Please try again.');
    } else {
        // Update UI across the app
        await loadAndApplySettings();

        // Refresh all reaction avatars immediately
        const { refreshAllReactionAvatars } = await import('./app.js');
        refreshAllReactionAvatars();

        closeAvatarModal();
    }
}

/**
 * Helper to get the avatar HTML for a user.
 * Can be used by other parts of the app.
 */
export function getAvatarHTML(user, sizeClass = 'w-8 h-8') {
    const avatar = userAvatars[user];
    if (!avatar) {
        // Fallback
        const color = user === 'juainny' ? 'bg-purple-500' : 'bg-blue-500';
        return `<div class="${sizeClass} rounded-full ${color} flex items-center justify-center text-white font-bold border border-white/20 overflow-hidden">${user[0].toUpperCase()}</div>`;
    }

    const { type, color1, color2, icon, imageUrl } = avatar;

    if (type === 'image' && imageUrl) {
        return `
            <div class="${sizeClass} rounded-full border border-white/20 relative overflow-hidden">
                <img src="${imageUrl}" class="w-full h-full object-cover">
            </div>
        `;
    }

    return `
        <div class="${sizeClass} rounded-full flex items-center justify-center border border-white/20 relative overflow-hidden" 
             style="background: linear-gradient(135deg, ${color1}, ${color2});">
            <img src="avatars/${icon}" class="w-[60%] h-[60%] object-contain drop-shadow-sm">
        </div>
    `;
}
