import { model } from '../firebase-client.js';

/**
 * Generates a summary for a media item based on user notes and ratings.
 * @param {Object} mediaItem - The media item object.
 * @param {Object} userRatings - Object containing user ratings (e.g., { user1: 4, user2: 5 }).
 * @param {Object} userNotes - Object containing user notes (e.g., { user1: "Great!", user2: "Okay." }).
 * @returns {Promise<string>} - The generated summary.
 */
export async function generateMediaSummary(mediaItem, userRatings, userNotes) {
    const prompt = `Summarize Juainny and Erick's opinions on "${mediaItem.title || mediaItem.name}" based on:

**Juainny:** ${userRatings.user1 || 'No rating'}/5 - ${userNotes.user1 || 'No notes'}
**Erick:** ${userRatings.user2 || 'No rating'}/5 - ${userNotes.user2 || 'No notes'}

**Overview:** ${mediaItem.overview}

Rules:
- Use **markdown** formatting (bold, italic, lists)
- Be concise (max 80 words)
- Highlight agreement or disagreement
- Skip greetings/introductions
- Be insightful and engaging`;

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
    // Prepare comprehensive context from allMedia  
    const context = allMedia.map(item => ({
        title: item.title || item.name,
        type: item.type,
        year: item.release_year,
        rating: item.content_rating,
        runtime: item.runtime,
        watched: item.watched,
        want_to_watch: item.want_to_watch,
        currently_watching: item.currently_watching,
        favorited_by: item.favorited_by,
        ratings: {
            juainny: item.user1_rating,
            erick: item.user2_rating
        },
        notes: {
            juainny: item.user1_notes,
            erick: item.user2_notes
        },
        reactions: {
            juainny: item.juainny_reaction,
            erick: item.erick_reaction
        }
    }));

    const prompt = `You're Willow, Juainny and Erick's watchlist AI.

**Database:** ${JSON.stringify(context, null, 2)}

**Question:** ${query}

**Rules:**
- Answer directly using the database
- Use **markdown** (bold, lists, etc.)
- Be concise and informative
- Skip introductions (no "Hey!" or "As Willow...")
- Recommend from want_to_watch list when relevant
- If not in database, say so briefly then use general knowledge`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error chatting with Willow:", error);
        return "I'm feeling a bit overwhelmed with all this data. Ask me again in a moment!";
    }
}
