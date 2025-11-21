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
    // Simple keyword detection for smart routing (saves tokens!)
    const lowerQuery = query.toLowerCase();

    // Database keywords
    const needsDatabase =
        /\b(watched|rated|favorite|note|list|recommend from|what did|how many|we watched|we rated|our)\b/i.test(query) ||
        /\b(juainny|erick|both of)\b/i.test(query);

    // Web search keywords
    const needsWeb =
        /\b(when (is|will)|release|coming out|new|latest|2024|2025|streaming|where to watch|trailer)\b/i.test(query) ||
        /\b(who (is|plays|starred)|cast|director|about|plot)\b/i.test(query);

    if (needsDatabase) {
        // DATABASE QUERY - Use our watchlist data
        const stats = {
            total: allMedia.length,
            watched: allMedia.filter(i => i.watched).length,
            want_to_watch: allMedia.filter(i => i.want_to_watch).length,
            currently_watching: allMedia.filter(i => i.currently_watching).length,
            favorited: allMedia.filter(i => i.favorited_by?.length > 0).length
        };

        const titles = allMedia.map(i => ({
            t: i.title || i.name,
            w: i.watched ? 1 : 0,
            id: i.tmdb_id
        }));

        const prompt = `Database query for Juainny & Erick's watchlist.

**Stats:** ${JSON.stringify(stats)}
**Titles:** ${JSON.stringify(titles)}
**Question:** ${query}

**Rules:**
- Ratings are /10
- Use **markdown**
- Be brief
- Answer from database only`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return `🗄️ ${response.text()}`; // Database icon
        } catch (error) {
            console.error("Error with database query:", error);
            return "Database access failed. Try asking differently!";
        }

    } else if (needsWeb) {
        // WEB SEARCH - Use Gemini with grounding
        const prompt = `${query}

Use Google Search to find current, accurate information. Be concise and use **markdown** formatting.`;

        try {
            // Enable grounding for web search (Gemini 2.0 feature)
            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                tools: [{
                    googleSearchRetrieval: {
                        dynamicRetrievalConfig: {
                            mode: 'MODE_DYNAMIC',
                            dynamicThreshold: 0.3
                        }
                    }
                }]
            });
            const response = await result.response;
            return `🌐 ${response.text()}`; // Web icon
        } catch (error) {
            console.error("Error with web search:", error);
            // Fallback to regular generation if grounding not available
            try {
                const fallback = await model.generateContent(prompt);
                const response = await fallback.response;
                return `💭 ${response.text()}`; // Thinking icon (no web access)
            } catch (err) {
                return "Couldn't search the web right now. Try again!";
            }
        }

    } else {
        // CONVERSATIONAL - General knowledge, no database/web needed
        const prompt = `${query}

Be conversational, brief, and use **markdown**. Keep it under 100 words.`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return `💭 ${response.text()}`; // Thinking icon
        } catch (error) {
            console.error("Error in conversation:", error);
            return "I'm having trouble thinking right now!";
        }
    }
}

