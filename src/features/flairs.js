import { supabase } from '../supabase-client.js';

/**
 * Fetches all available flairs.
 * @returns {Promise<Array>} List of flairs.
 */
export async function fetchAllFlairs() {
    const { data, error } = await supabase
        .from('flairs')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching flairs:', error);
        return [];
    }
    return data;
}

/**
 * Fetches flairs assigned to a specific media item.
 * @param {number} mediaId - The ID of the media item (from the media table, NOT TMDB ID).
 * @returns {Promise<Array>} List of assigned flairs.
 */
export async function fetchMediaFlairs(mediaId) {
    const { data, error } = await supabase
        .from('media_flairs')
        .select(`
            flair_id,
            flairs (
                id,
                name,
                color,
                icon,
                description
            )
        `)
        .eq('media_id', mediaId);

    if (error) {
        console.error('Error fetching media flairs:', error);
        return [];
    }
    // Flatten the structure
    return data.map(item => item.flairs);
}

/**
 * Creates a new flair.
 * @param {Object} flairData - { name, color, icon, description }
 * @returns {Promise<Object|null>} The created flair or null on error.
 */
export async function createFlair(flairData) {
    const { data, error } = await supabase
        .from('flairs')
        .insert([flairData])
        .select()
        .single();

    if (error) {
        console.error('Error creating flair:', error);
        return null;
    }
    return data;
}

/**
 * Assigns a flair to a media item.
 * Checks if the media already has 2 flairs.
 * @param {number} mediaId - The ID of the media item.
 * @param {string} flairId - The UUID of the flair.
 * @returns {Promise<Object>} { success: boolean, message: string }
 */
export async function assignFlairToMedia(mediaId, flairId) {
    // Check current count
    const currentFlairs = await fetchMediaFlairs(mediaId);
    if (currentFlairs.length >= 2) {
        return { success: false, message: 'Max 2 flairs per media item.' };
    }

    // Check if already assigned
    if (currentFlairs.find(f => f.id === flairId)) {
        return { success: false, message: 'Flair already assigned.' };
    }

    const { error } = await supabase
        .from('media_flairs')
        .insert([{ media_id: mediaId, flair_id: flairId }]);

    if (error) {
        console.error('Error assigning flair:', error);
        return { success: false, message: 'Failed to assign flair.' };
    }

    return { success: true, message: 'Flair assigned.' };
}

/**
 * Removes a flair from a media item.
 * @param {number} mediaId 
 * @param {string} flairId 
 * @returns {Promise<boolean>} Success status.
 */
export async function removeFlairFromMedia(mediaId, flairId) {
    const { error } = await supabase
        .from('media_flairs')
        .delete()
        .eq('media_id', mediaId)
        .eq('flair_id', flairId);

    if (error) {
        console.error('Error removing flair:', error);
        return false;
    }
    return true;
}

/**
 * Updates an existing flair.
 * @param {string} flairId - The ID of the flair to update.
 * @param {Object} updates - Object containing fields to update (name, color, icon).
 * @returns {Promise<Object|null>} The updated flair or null on error.
 */
export async function updateFlair(flairId, updates) {
    const { data, error } = await supabase
        .from('flairs')
        .update(updates)
        .eq('id', flairId)
        .select()
        .single();

    if (error) {
        console.error('Error updating flair:', error);
        return null;
    }
    return data;
}

/**
 * Deletes a flair permanently.
 * @param {string} flairId - The ID of the flair to delete.
 * @returns {Promise<boolean>} Success status.
 */
export async function deleteFlair(flairId) {
    const { error } = await supabase
        .from('flairs')
        .delete()
        .eq('id', flairId);

    if (error) {
        console.error('Error deleting flair:', error);
        return false;
    }
    return true;
}

/**
 * Helper to render a flair badge HTML.
 * @param {Object} flair - The flair object.
 * @param {string} sizeClass - Tailwind classes for size (e.g., 'text-xs px-2 py-1').
 * @returns {string} HTML string.
 */
export function renderFlairBadge(flair, sizeClass = 'text-xs px-2 py-0.5') {
    // Determine text color based on background brightness (simple heuristic)
    // For now, let's assume white text with a text-shadow or just white.
    // Or we can use the color as background and white text.
    let iconHtml = '';
    if (flair.icon) {
        if (flair.icon.startsWith('fa')) {
            iconHtml = `<i class="${flair.icon}"></i>`;
        } else {
            iconHtml = `<span>${flair.icon}</span>`;
        }
    }

    return `
        <span class="inline-flex items-center gap-1 rounded-full font-semibold shadow-sm ${sizeClass} transform transition-transform hover:scale-105 cursor-default border border-white/20" 
              style="background-color: ${flair.color}; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
            ${iconHtml}
            <span>${flair.name}</span>
        </span>
    `;
}
