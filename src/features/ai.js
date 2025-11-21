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
 * @returns {Promise<{ route: string, text: string }>} - The AI's response, including the determined route.
 */
export async function chatWithWillow(query, allMedia) {
    // Today's date for context
    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Step 1: AI decides which method to use (~100 tokens)
    const routingPrompt = `Today: ${today}
Query: "${query}"

Choose ONE:
A) DATABASE - if asking about Juainny/Erick's watchlist, ratings, or what they've watched
B) WEB - if asking about releases, cast, new content, or current info
C) CHAT - if general question or recommendation

Reply with ONLY: A, B, or C`;

    let route;
    try {
        const decision = await model.generateContent(routingPrompt);
        const response = await decision.response.text().trim();
        route = response.includes('A') ? 'DATABASE' :
            response.includes('B') ? 'WEB' : 'CHAT';
    } catch (error) {
        console.error("Routing error:", error);
        route = 'CHAT'; // Fallback
    }

    // Step 2: Execute based on route
    if (route === 'DATABASE') {
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
            cw: i.currently_watching ? 1 : 0
        }));

        const prompt = `Today: ${today}
Stats: ${JSON.stringify(stats)}
Titles: ${JSON.stringify(titles)}

Q: ${query}

Rules: Ratings are /10. Use **markdown**. Brief.`;

        try {
            const result = await model.generateContent(prompt);
            return { route: 'DATABASE', text: result.response.text() };
        } catch (error) {
            console.error("Database error:", error);
            return { route: 'ERROR', text: "Database error!" };
        }

    } else if (route === 'WEB') {
        const prompt = `Today: ${today}

${query}

Use Google Search. Be concise. Use **markdown**.`;

        try {
            // Use Firebase Gemini Developer API grounding syntax
            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                tools: [{ googleSearch: {} }]  // ✅ Correct Firebase syntax
            });
            return { route: 'WEB', text: result.response.text() };
        } catch (error) {
            console.error("Web error:", error);
            try {
                const fallback = await model.generateContent(prompt);
                return { route: 'KNOWLEDGE', text: fallback.response.text() };
            } catch (err) {
                return { route: 'ERROR', text: "Web error!" };
            }
        }

    } else {
        const prompt = `Today: ${today}

${query}

Conversational, brief, **markdown**. Max 100 words.`;

        try {
            const result = await model.generateContent(prompt);
            return { route: 'CHAT', text: result.response.text() };
        } catch (error) {
            console.error("Chat error:", error);
            return { route: 'ERROR', text: "Error!" };
        }
    }
}
