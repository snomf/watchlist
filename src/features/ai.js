import { model } from '../firebase-client.js';

/**
 * Generates a summary for a media item based on user notes and ratings.
 * @param {Object} mediaItem - The media item object.
 * @param {Object} userRatings - Object containing user ratings (e.g., { user1: 4, user2: 5 }).
 * @param {Object} userNotes - Object containing user notes (e.g., { user1: "Great!", user2: "Okay." }).
 * @returns {Promise<string>} - The generated summary.
 */
export async function generateMediaSummary(mediaItem, userRatings, userNotes) {
    const prompt = `Summarize opinions on "${mediaItem.title || mediaItem.name}":

**Juainny:** ${userRatings.user1 || 'Not rated'}/10 - ${userNotes.user1 || 'No notes'}
**Erick:** ${userRatings.user2 || 'Not rated'}/10 - ${userNotes.user2 || 'No notes'}

Rules:
- Use **markdown** (bold, italic, lists)
- Max 60 words
- Highlight agreement/disagreement
- No greetings`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating summary:", error);
        return "Willow is having trouble thinking right now. check back later!";
    }
}

/**
 * Handles a chat query using the full media database as context.
 * @param {string} query - The user's question.
 * @param {Array} allMedia - The entire array of media items.
 * @returns {Promise<string>} - The AI's response.
 */
export async function chatWithWillow(query, allMedia) {
    // Build minimal summary stats to reduce tokens
    const stats = {
        total: allMedia.length,
        watched: allMedia.filter(i => i.watched).length,
        want_to_watch: allMedia.filter(i => i.want_to_watch).length,
        currently_watching: allMedia.filter(i => i.currently_watching).length,
        favorited: allMedia.filter(i => i.favorited_by?.length > 0).length
    };

    // Only include titles for quick lookup (massive token savings!)
    const titles = allMedia.map(i => ({
        t: i.title || i.name,
        w: i.watched ? 1 : 0,
        id: i.tmdb_id
    }));

    const prompt = `Willow AI for Juainny & Erick.

**Stats:** ${JSON.stringify(stats)}
**Titles:** ${JSON.stringify(titles)}
**Question:** ${query}

**Rules:**
- Ratings are /10 not /5
- Use **markdown**
- Be brief
- No greetings
- If need details about specific title, estimate based on question
- For recommendations, suggest from titles with w:0`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error chatting with Willow:", error);
        return "I'm feeling a bit overwhelmed with all this data. Ask me again in a moment!";
    }
}
