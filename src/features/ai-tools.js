import { supabase } from '../supabase-client.js';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Tool definitions for Gemini function calling.
 */
export const tools = [
    {
        name: "get_activity_log",
        description: "Fetches the most recent activity logs from the database to see what users have been doing (watching, rating, etc.).",
        parameters: {
            type: "object",
            properties: {
                limit: {
                    type: "number",
                    description: "The number of activity logs to fetch (default 10, max 50)."
                }
            }
        }
    },
    {
        name: "get_user_settings",
        description: "Fetches the current user settings, including themes, bios, avatars, and wallpapers.",
        parameters: {
            type: "object",
            properties: {}
        }
    },
    {
        name: "search_media",
        description: "Searches the media table in the database for specific titles.",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "The title to search for."
                }
            },
            required: ["query"]
        }
    },
    {
        name: "get_media_flairs",
        description: "Fetches the flairs assigned to a specific media item.",
        parameters: {
            type: "object",
            properties: {
                media_id: {
                    type: "number",
                    description: "The ID of the media item in the database (not TMDB ID)."
                }
            },
            required: ["media_id"]
        }
    },
    {
        name: "get_tv_progress",
        description: "Fetches the watching progress for a TV show (seasons/episodes).",
        parameters: {
            type: "object",
            properties: {
                tmdb_id: {
                    type: "number",
                    description: "The TMDB ID of the TV show."
                }
            },
            required: ["tmdb_id"]
        }
    },
    {
        name: "add_to_watchlist",
        description: "Adds a movie or TV show to the user's watchlist (marks as 'Want to Watch').",
        parameters: {
            type: "object",
            properties: {
                tmdb_id: {
                    type: "number",
                    description: "The TMDB ID of the media."
                },
                type: {
                    type: "string",
                    description: "The type of media ('movie' or 'tv')."
                },
                title: {
                    type: "string",
                    description: "The title of the media."
                }
            },
            required: ["tmdb_id", "type", "title"]
        }
    },
    {
        name: "rate_media",
        description: "Updates the rating for a media item for a specific user.",
        parameters: {
            type: "object",
            properties: {
                tmdb_id: {
                    type: "number",
                    description: "The TMDB ID of the media."
                },
                rating: {
                    type: "number",
                    description: "The rating value (1-10)."
                },
                user: {
                    type: "string",
                    description: "The user rating the item ('juainny' or 'erick')."
                }
            },
            required: ["tmdb_id", "rating", "user"]
        }
    },
    {
        name: "update_media_notes",
        description: "Updates the notes for a media item for a specific user.",
        parameters: {
            type: "object",
            properties: {
                tmdb_id: {
                    type: "number",
                    description: "The TMDB ID of the media."
                },
                note: {
                    type: "string",
                    description: "The content of the note."
                },
                user: {
                    type: "string",
                    description: "The user adding the note ('juainny' or 'erick')."
                }
            },
            required: ["tmdb_id", "note", "user"]
        }
    },
    {
        name: "get_media_notes",
        description: "Retrieves the notes and ratings for a specific media item by title.",
        parameters: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    description: "The title of the media to get notes for."
                }
            },
            required: ["title"]
        }
    },
    {
        name: "mark_watched",
        description: "Marks a media item as watched.",
        parameters: {
            type: "object",
            properties: {
                tmdb_id: {
                    type: "number",
                    description: "The TMDB ID of the media."
                }
            },
            required: ["tmdb_id"]
        }
    },
    {
        name: "get_media_by_status",
        description: "Fetches media items based on their status (watched, want_to_watch, currently_watching).",
        parameters: {
            type: "object",
            properties: {
                status: {
                    type: "string",
                    description: "The status to filter by: 'watched', 'want_to_watch', or 'currently_watching'.",
                    enum: ["watched", "want_to_watch", "currently_watching"]
                },
                limit: {
                    type: "number",
                    description: "The maximum number of items to return (default 10)."
                }
            },
            required: ["status"]
        }
    }
];

/**
 * Implementation of the tools.
 */
export const toolImplementations = {
    async get_activity_log({ limit = 10 }) {
        const safeLimit = Math.min(Math.max(limit, 1), 50);
        const { data, error } = await supabase
            .from('activity_log')
            .select(`
                *,
                media:media_id (title, name)
            `)
            .order('created_at', { ascending: false })
            .limit(safeLimit);

        if (error) return `Error fetching activity log: ${error.message}`;
        return JSON.stringify(data);
    },

    async get_user_settings() {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .single();

        if (error) return `Error fetching settings: ${error.message}`;
        return JSON.stringify(data);
    },

    async search_media({ query }) {
        const { data, error } = await supabase
            .from('media')
            .select('*')
            .ilike('title', `%${query}%`) // Assuming 'title' column exists and holds the name
            .limit(5);

        if (error) return `Error searching media: ${error.message}`;
        if (!data || data.length === 0) return "No media found matching that query.";
        return JSON.stringify(data);
    },

    async get_media_flairs({ media_id }) {
        const { data, error } = await supabase
            .from('media_flairs')
            .select(`
                *,
                flair:flair_id (label, icon, color)
            `)
            .eq('media_id', media_id);

        if (error) return `Error fetching flairs: ${error.message}`;
        return JSON.stringify(data);
    },

    async get_tv_progress({ tmdb_id }) {
        // This would ideally query a 'progress' table if it existed.
        // For now, we'll check the 'media' table for any stored progress or return a placeholder.
        // Based on user request, this is for "Episode and season progress".
        // Since we don't have a specific table structure for granular progress in the prompt,
        // we will return the 'last_watched_episode' if available in 'media' or generic info.

        const { data, error } = await supabase
            .from('media')
            .select('*')
            .eq('tmdb_id', tmdb_id)
            .single();

        if (error) return `Error fetching TV progress: ${error.message}`;

        // Mocking detailed progress if not in DB, or returning what we have
        return JSON.stringify({
            status: data.currently_watching ? "Currently Watching" : (data.watched ? "Watched" : "Not Started"),
            // Add more fields if the DB supports them later
            details: "Detailed episode progress tracking is not fully implemented in the database yet."
        });
    },

    async add_to_watchlist({ tmdb_id, type, title }) {
        // Check if it exists first
        const { data: existing } = await supabase
            .from('media')
            .select('id')
            .eq('tmdb_id', tmdb_id)
            .single();

        if (existing) {
            const { error } = await supabase
                .from('media')
                .update({ want_to_watch: true })
                .eq('id', existing.id);
            if (error) return `Error updating watchlist: ${error.message}`;
            return `Updated '${title}' to be in the watchlist.`;
        } else {
            // Insert new
            const { error } = await supabase
                .from('media')
                .insert([{
                    tmdb_id,
                    type,
                    title, // or name, handled by DB trigger or app logic usually
                    want_to_watch: true
                }]);
            if (error) return `Error adding to watchlist: ${error.message}`;
            return `Added '${title}' to the watchlist.`;
        }
    },

    async rate_media({ tmdb_id, rating, user }) {
        const column = user.toLowerCase() === 'juainny' ? 'juainny_rating' : 'erick_rating';

        // Check if exists
        const { data: existing } = await supabase
            .from('media')
            .select('id')
            .eq('tmdb_id', tmdb_id)
            .single();

        if (!existing) return "Media item not found in database. Please add it first.";

        const { error } = await supabase
            .from('media')
            .update({ [column]: rating })
            .eq('id', existing.id);

        if (error) return `Error rating media: ${error.message}`;
        return `Rated '${tmdb_id}' as ${rating}/10 for ${user}.`;
    },

    async update_media_notes({ tmdb_id, note, user }) {
        const column = user.toLowerCase() === 'juainny' ? 'juainny_notes' : 'erick_notes';

        const { data: existing } = await supabase
            .from('media')
            .select('id')
            .eq('tmdb_id', tmdb_id)
            .single();

        if (!existing) return "Media item not found in database. Please add it first.";

        const { error } = await supabase
            .from('media')
            .update({ [column]: note })
            .eq('id', existing.id);

        if (error) return `Error updating notes: ${error.message}`;
        return `Updated notes for '${tmdb_id}' for ${user}.`;
    },

    async get_media_notes({ title }) {
        const { data, error } = await supabase
            .from('media')
            .select('title, juainny_notes, erick_notes, juainny_rating, erick_rating')
            .ilike('title', `%${title}%`)
            .limit(1)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return `No media found with title matching "${title}".`;
            }
            return `Error fetching notes: ${error.message}`;
        }

        return JSON.stringify({
            title: data.title,
            juainny: {
                notes: data.juainny_notes || "No notes yet",
                rating: data.juainny_rating || "Not rated"
            },
            erick: {
                notes: data.erick_notes || "No notes yet",
                rating: data.erick_rating || "Not rated"
            }
        });
    },

    async mark_watched({ tmdb_id }) {
        const { data: existing } = await supabase
            .from('media')
            .select('id, title')
            .eq('tmdb_id', tmdb_id)
            .single();

        if (!existing) return "Media item not found. Please add it first.";

        const { error } = await supabase
            .from('media')
            .update({
                watched: true,
                want_to_watch: false,
                currently_watching: false
            })
            .eq('id', existing.id);

        if (error) return `Error marking media as watched: ${error.message}`;
        return `Marked '${existing.title}' as watched.`;
    },

    async get_media_by_status({ status, limit = 10 }) {
        const validStatuses = ['watched', 'want_to_watch', 'currently_watching'];
        if (!validStatuses.includes(status)) {
            return `Invalid status. Must be one of: ${validStatuses.join(', ')}`;
        }

        const safeLimit = Math.min(Math.max(limit, 1), 50);
        const { data, error } = await supabase
            .from('media')
            .select('title, type, release_year')
            .eq(status, true)
            .order('updated_at', { ascending: false }) // Assuming updated_at exists, otherwise created_at
            .limit(safeLimit);

        if (error) return `Error fetching media by status: ${error.message}`;
        if (!data || data.length === 0) return `No media found with status '${status}'.`;

        return JSON.stringify(data);
    }
};
