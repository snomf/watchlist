import { supabase } from './supabase-client.js';

let allMediaForWallpapers = [];

/**
 * Opens the settings modal and populates it with current data.
 */
export async function openSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    if (!settingsModal) return;

    await populateWallpaperSelector();
    await loadAndApplySettings();

    settingsModal.classList.remove('hidden');
    settingsModal.classList.add('flex');
}

/**
 * Closes the settings modal.
 */
export function closeSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal) {
        settingsModal.classList.add('hidden');
        settingsModal.classList.remove('flex');
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
 * Populates the wallpaper dropdown in the settings modal.
 */
async function populateWallpaperSelector() {
    await fetchAllMediaForWallpapers();
    const bannerSelect = document.getElementById('movie-banner-select');
    if (!bannerSelect) return;

    bannerSelect.innerHTML = '<option value="">-- Select a Movie --</option>'; // Reset
    allMediaForWallpapers.forEach(item => {
        const option = document.createElement('option');
        option.value = `https://image.tmdb.org/t/p/original${item.backdrop_path}`;
        option.textContent = item.title;
        bannerSelect.appendChild(option);
    });
}

/**
 * Saves the selected theme and wallpaper to Supabase.
 */
async function saveSettings() {
    const selectedTheme = document.querySelector('.theme-btn.border-accent-primary')?.dataset.theme;
    const selectedWallpaper = document.getElementById('movie-banner-select').value;

    const { error } = await supabase
        .from('settings')
        .update({
            theme: selectedTheme,
            wallpaper_url: selectedWallpaper,
        })
        .eq('id', 1);

    if (error) {
        console.error('Error saving settings:', error);
    } else {
        console.log('Settings saved successfully!');
        await loadAndApplySettings(); // Re-apply settings after saving
        closeSettingsModal();
    }
}

/**
 * Loads settings from Supabase and applies them to the UI.
 */
export async function loadAndApplySettings() {
    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();

    if (error || !data) {
        console.error('Error loading settings:', error);
        return;
    }

    // Apply and set active theme
    const { theme, wallpaper_url } = data;
    document.documentElement.setAttribute('data-theme', theme || 'dark');
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('border-accent-primary', btn.dataset.theme === theme);
    });

    // Apply wallpaper
    const wallpaperOverlay = document.getElementById('wallpaper-overlay');
    if (wallpaper_url) {
        document.body.style.backgroundImage = `url('${wallpaper_url}')`;
        wallpaperOverlay.style.display = 'block';
    } else {
        document.body.style.backgroundImage = 'none';
        wallpaperOverlay.style.display = 'none';
    }

    // Set the selected option in the dropdown
    const bannerSelect = document.getElementById('movie-banner-select');
    if (bannerSelect) bannerSelect.value = wallpaper_url || '';
}

/**
 * Initializes the settings functionality and event listeners.
 */
export function initializeSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings-modal-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const removeWallpaperBtn = document.getElementById('remove-wallpaper-btn');

    if (settingsBtn) settingsBtn.addEventListener('click', openSettingsModal);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettingsModal);
    if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveSettings);

    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('border-accent-primary'));
            btn.classList.add('border-accent-primary');
        });
    });

    if (removeWallpaperBtn) {
        removeWallpaperBtn.addEventListener('click', () => {
            const bannerSelect = document.getElementById('movie-banner-select');
            if (bannerSelect) bannerSelect.value = '';
        });
    }
}
