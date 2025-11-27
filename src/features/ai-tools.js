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
        name: "get_list_by_status",
        description: "Fetches a list of media items filtered by their status (watched, want_to_watch, currently_watching).",
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
                    description: "The number of items to fetch (default 20)."
                }
            },
            required: ["status"]
        }
    },
    {
        name: "search_tmdb",
        description: "Searches for movies or TV shows in the global TMDB database (online search). Use this when the user asks for something not in their watchlist.",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "The movie or TV show title to search for."
                }
            },
            required: ["query"]
        }
    },
    {
        name: "search_media",
        description: "Searches the LOCAL watchlist database for specific titles. Use this first to see if they already have it.",
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
        name: "get_watched_media",
        description: "Fetches all media items marked as 'watched' by a specific user. Supports filtering by media type and rating status.",
        parameters: {
            type: "object",
            properties: {
                user: {
                    type: "string",
                    description: "The user whose watchlist to fetch ('juainny' or 'erick')."
                },
                type: {
                    type: "string",
                    description: "Optional. Filter by media type: 'movie' or 'tv'."
                },
                unrated_only: {
                    type: "boolean",
                    description: "Optional. If true, only return items that the user hasn't rated yet."
                }
            },
            required: ["user"]
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
        name: "update_media_status",
        description: "Updates the status of a media item (watched, want_to_watch, or currently_watching). Use this when the user wants to change what status an item has.",
        parameters: {
            type: "object",
            properties: {
                tmdb_id: {
                    type: "number",
                    description: "The TMDB ID of the media."
                },
                status: {
                    type: "string",
                    description: "The status to set: 'watched', 'want_to_watch', or 'currently_watching'.",
                    enum: ["watched", "want_to_watch", "currently_watching"]
                }
            },
            required: ["tmdb_id", "status"]
        }
    },
    {
        name: "mark_currently_watching",
        description: "Marks a media item as currently watching. This is a convenience wrapper for update_media_status.",
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
        name: "request_user_rating",
        description: "Ask the user to rate a movie or TV show. Use this when the user wants to rate something or you need their opinion. The UI will show a star rating input.",
        parameters: {
            type: "object",
            properties: {
                tmdb_id: {
                    type: "integer",
                    description: "The TMDB ID of the media to rate."
                }
            },
            required: ["tmdb_id"]
        }
    },
    {
        name: "start_trivia",
        description: "Start a trivia game about a specific movie or TV show. The UI will show a trivia card with a question and options.",
        parameters: {
            type: "object",
            properties: {
                tmdb_id: {
                    type: "integer",
                    description: "The TMDB ID of the media to quiz on."
                }
            },
            required: ["tmdb_id"]
        }
    },
    {
        name: "analyze_taste",
        description: "Analyze the user's recently watched/rated items and 'roast' or compliment their taste. Use this when the user asks to roast their taste or analyze their profile.",
        parameters: {
            type: "object",
            properties: {
                user_id: {
                    type: "string",
                    description: "The user ID to analyze (e.g., 'juainny' or 'erick')."
                }
            },
            required: ["user_id"]
        }
    },
    {
        name: "recommend_by_vibe",
        description: "Find a movie from the user's *existing* watchlist (or new ones) that matches a specific mood/vibe. Use this when the user says 'I want to cry', 'I want adrenaline', etc.",
        parameters: {
            type: "object",
            properties: {
                vibe: {
                    type: "string",
                    description: "The mood or vibe to match (e.g., 'sad', 'exciting', 'cozy')."
                },
                genre: {
                    type: "string",
                    description: "Optional genre filter."
                }
            },
            required: ["vibe"]
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

    async get_list_by_status({ status, limit = 20 }) {
        const safeLimit = Math.min(Math.max(limit, 1), 50);
        let query = supabase.from('media').select('title, type, release_year, tmdb_id');

        if (status === 'watched') {
            query = query.eq('watched', true);
        } else if (status === 'want_to_watch') {
            query = query.eq('want_to_watch', true);
        } else if (status === 'currently_watching') {
            query = query.eq('currently_watching', true);
        } else {
            return "Invalid status. Please use 'watched', 'want_to_watch', or 'currently_watching'.";
        }

        const { data, error } = await query.limit(safeLimit);

        if (error) return `Error fetching list: ${error.message}`;
        if (!data || data.length === 0) return `No items found in '${status}' list.`;

        return JSON.stringify(data);
    },

    async search_tmdb({ query }) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`);
            if (!response.ok) {
                return "Error searching TMDB.";
            }
            const data = await response.json();
            const results = data.results.slice(0, 5).map(item => ({
                title: item.title || item.name,
                type: item.media_type,
                year: item.release_date || item.first_air_date,
                overview: item.overview,
                tmdb_id: item.id
            }));

            if (results.length === 0) return "No results found online.";
            return JSON.stringify(results);
        } catch (err) {
            return `Error connecting to TMDB: ${err.message}`;
        }
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

    async analyze_taste({ user_id }) {
        // Fetch recent activity for the user
        const { data: history, error } = await supabase
            .from('activity_log')
            .select('*, media(*)')
            .eq('user_id', user_id.toLowerCase())
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw new Error(`Failed to fetch history: ${error.message}`);
        if (!history || history.length === 0) return "No recent history found to analyze.";

        // Format for AI
        const items = history.map(h => {
            const title = h.media?.title || h.media?.name || 'Unknown Title';
            const action = h.action_type;
            const rating = h.details?.rating ? `rated ${h.details.rating} stars` : '';
            return `- ${action} "${title}" ${rating}`;
        }).join('\n');

        return `Here is ${user_id}'s recent activity:\n${items}\n\nPlease analyze this taste profile. Be sassy, funny, and slightly judgmental (a "roast"). Point out patterns (e.g., "too many rom-coms", "pretentious sci-fi").`;
    },

    async get_watched_media({ user, type, unrated_only }) {
        const { data, error } = await supabase
            .from('media')
            .select('*')
            .eq('watched', true);

        if (error) throw new Error(`Failed to fetch watched media: ${error.message}`);
        if (!data || data.length === 0) return `${user} hasn't marked any items as watched yet.`;

        let filteredData = data;

        // Filter by media type if specified
        if (type) {
            filteredData = filteredData.filter(item => item.type === type);
        }

        // Filter by unrated status if specified
        if (unrated_only) {
            const ratingColumn = user.toLowerCase() === 'juainny' ? 'juainny_rating' : 'erick_rating';
            filteredData = filteredData.filter(item => !item[ratingColumn] || item[ratingColumn] === 0);
        }

        if (filteredData.length === 0) {
            return `No items found matching your criteria.`;
        }

        const items = filteredData.map(item => {
            const title = item.title || item.name;
            const year = item.release_year || '';
            const mediaType = item.type === 'movie' ? '🎬' : '📺';
            const ratingColumn = user.toLowerCase() === 'juainny' ? 'juainny_rating' : 'erick_rating';
            const rating = item[ratingColumn] ? `⭐ ${item[ratingColumn]}/10` : '(unrated)';
            return `${mediaType} ${title} ${year ? `(${year})` : ''} - ${rating}`;
        }).slice(0, 50).join('\n');

        const total = filteredData.length;
        const showing = Math.min(50, total);
        return `Here are ${user}'s watched items (showing ${showing} of ${total}):\n\n${items}${total > 50 ? '\n\n...and more. Let me know if you need a specific subset.' : ''}`;
    },
    async recommend_by_vibe({ vibe, genre }) {
        // Fetch all media from database
        const { data: allMedia, error } = await supabase
            .from('media')
            .select('*');

        if (error) throw new Error(`Failed to fetch media: ${error.message}`);
        if (!allMedia || allMedia.length === 0) return "No media found in database.";

        // Filter by genre if provided (simple string match for now, ideally would use genre IDs)
        // Since we don't have genre names easily, we'll skip genre filtering in DB and let AI do it if needed,
        // or we can rely on the AI to pick from the list we send.

        // We can't do semantic search here easily without embeddings.
        // So we will send a random sample of unwatched items to the AI and ask IT to pick the best match.
        // This is a "RAG-lite" approach.

        const unwatched = allMedia.filter(m => !m.watched);
        const sampleSize = 30;
        const sample = unwatched.sort(() => 0.5 - Math.random()).slice(0, sampleSize);

        const items = sample.map(m => `- ${m.title || m.name} (Overview: ${m.overview?.substring(0, 100)}...)`).join('\n');

        return `The user wants a recommendation with this vibe: "${vibe}"${genre ? ` and genre: ${genre}` : ''}.
        
Here is a sample of items from their watchlist they haven't watched yet:
${items}

Please pick the BEST match from this list. Explain why it fits the vibe perfectly. If none fit well, say so.`;
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

    async update_media_status({ tmdb_id, status }) {
        const { data: existing } = await supabase
            .from('media')
            .select('id, title')
            .eq('tmdb_id', tmdb_id)
            .single();

        if (!existing) return "Media item not found. Please add it first.";

        // Set all status fields to false first, then set the requested one to true
        const updates = {
            watched: status === 'watched',
            want_to_watch: status === 'want_to_watch',
            currently_watching: status === 'currently_watching'
        };

        const { error } = await supabase
            .from('media')
            .update(updates)
            .eq('id', existing.id);

        if (error) return `Error updating media status: ${error.message}`;

        const statusMap = {
            'watched': 'watched',
            'want_to_watch': 'want to watch',
            'currently_watching': 'currently watching'
        };

        return `Updated '${existing.title}' status to ${statusMap[status]}.`;
    },

    async mark_currently_watching({ tmdb_id }) {
        const { data: existing } = await supabase
            .from('media')
            .select('id, title')
            .eq('tmdb_id', tmdb_id)
            .single();

        if (!existing) return "Media item not found. Please add it first.";

        const { error } = await supabase
            .from('media')
            .update({
                currently_watching: true,
                watched: false,
                want_to_watch: false
            })
            .eq('id', existing.id);

        if (error) return `Error marking media as currently watching: ${error.message}`;
        return `Marked '${existing.title}' as currently watching.`;
    }
};
