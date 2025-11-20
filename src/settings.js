import { supabase } from './supabase-client.js';
import { setupAllenEasterEgg } from './app.js'; // Import the function

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
    // Get selected theme from the button that has the border class
    // Note: The click listener we added above handles the class toggling visually, 
    // but we need to ensure we grab the right one.
    // If no button has the class (initial load), we might need a fallback or check the current attribute.
    // Actually, the existing code relied on `border-accent-primary` being present. 
    // We need to make sure `loadAndApplySettings` sets this class on open.

    const selectedThemeBtn = document.querySelector('.theme-btn.border-accent-primary');
    const selectedTheme = selectedThemeBtn ? selectedThemeBtn.dataset.theme : 'night';

    const selectedWallpaper = document.getElementById('movie-banner-select').value;
    const hideImages = document.getElementById('hide-search-images-toggle').checked;

    const { error } = await supabase
        .from('settings')
        .update({
            theme: selectedTheme,
            wallpaper_url: selectedWallpaper,
            hide_search_results_without_images: hideImages,
        })
        .eq('id', 1);

    // Save device name to localStorage
    const deviceName = document.getElementById('device-name-input').value;
    localStorage.setItem('device_name', deviceName);

    // Update UI immediately
    const deviceNameDisplay = document.getElementById('device-name');
    if (deviceNameDisplay) deviceNameDisplay.textContent = deviceName || 'User';

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
        .select('theme, wallpaper_url, hide_search_results_without_images')
        .eq('id', 1)
        .single();

    if (error || !data) {
        console.error('Error loading settings:', error);
        // Fallback to a default theme if settings are not found
        document.documentElement.setAttribute('data-theme', 'night');
        return;
    }

    // Apply Theme
    const { theme, wallpaper_url, hide_search_results_without_images } = data;
    document.documentElement.setAttribute('data-theme', theme || 'night');

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
        // Hide overlay for Smiling Friends theme, show for others
        if (theme === 'smiling-friends') {
            wallpaperOverlay.style.display = 'none';
        } else {
            wallpaperOverlay.style.display = 'block';
        }
    } else {
        document.body.style.backgroundImage = 'none';
        wallpaperOverlay.style.display = 'none';
    }

    // Trigger Easter Egg check
    if (typeof setupAllenEasterEgg === 'function') {
        setupAllenEasterEgg();
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

            // Immediately apply the theme
            document.documentElement.setAttribute('data-theme', selectedTheme);

            // Update the UI to show the active theme
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('border-accent-primary'));
            btn.classList.add('border-accent-primary');

            // Trigger save
            saveSettings();
        });
    });

    if (removeWallpaperBtn) {
        removeWallpaperBtn.addEventListener('click', () => {
            const bannerSelect = document.getElementById('movie-banner-select');
            if (bannerSelect) bannerSelect.value = '';
        });
    }
}
