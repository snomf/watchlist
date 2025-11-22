import { model } from '../firebase-client.js';

/**
 * Generates a summary for a media item based on user notes and ratings.
 * @param {Object} mediaItem - The media item object.
 * @param {Object} userRatings - Object containing user ratings (e.g., { user1: 4, user2: 5 }).
 * @param {Object} userNotes - Object containing user notes (e.g., { user1: "Great!", user2: "Okay." }).
 * @returns {Promise<string>} - The generated summary.
 */
export async function generateMediaSummary(mediaItem, userRatings, userNotes) {
    // Build comprehensive context from the full database row
    const mediaContext = {
        title: mediaItem.title || mediaItem.name,
        type: mediaItem.type, // movie, tv, song, etc.
        year: mediaItem.release_year,
        rating: mediaItem.content_rating,
        runtime: mediaItem.runtime,
        overview: mediaItem.overview,
        genres: mediaItem.genres
    };

    const prompt = `Summarize opinions on this ${mediaContext.type || 'media'}:

**Title:** ${mediaContext.title}
**Type:** ${mediaContext.type || 'Unknown'}
${mediaContext.year ? `**Year:** ${mediaContext.year}` : ''}
${mediaContext.overview ? `**Overview:** ${mediaContext.overview.substring(0, 200)}...` : ''}

**Juainny:** ${userRatings.user1 || 'Not rated'}/10 - ${userNotes.user1 || 'No notes'}
**Erick:** ${userRatings.user2 || 'Not rated'}/10 - ${userNotes.user2 || 'No notes'}

Rules:
- Use **markdown** (bold, italic, lists)
- Max 60 words
- Highlight agreement/disagreement
- No greetings
- Be accurate about the media type`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating summary:", error);
        return "Unable to generate summary at this time.";
    }
}

/**
 * Starts a new chat session with Willow
 * @param {Array} allMedia - The entire array of media items for context
 * @returns {Object} - Chat session object
 */
export function startWillowChat(allMedia) {
    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Build context for the session
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

    const systemContext = `Today: ${today}

You are Willow, an AI assistant for Juainny and Erick's watchlist app.

**Database Context:**
Stats: ${JSON.stringify(stats)}
Titles: ${JSON.stringify(titles)}

**Important:**
- You can access database (stats/titles above), web search, or general knowledge
- Choose the best source based on the question
- Maintain conversation context across messages
- Ratings are out of 10
- Use **markdown** formatting
- Be conversational and helpful`;

    // Start chat session with system context
    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: systemContext }]
            },
            {
                role: "model",
                parts: [{ text: "Hello! I'm Willow, your watchlist assistant. I have access to your watchlist database, web search, and general knowledge. How can I help you today?" }]
            }
        ],
        generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.9
        }
    });

    return chat;
}

/**
 * Send a message in an existing chat session
 * @param {Object} chat - The chat session
 * @param {string} query - The user's message
 * @returns {Promise<{ route: string, text: string }>} - The AI's response with route
 */
export async function chatWithWillow(chat, query) {
    try {
        // console.log('Sending message to chat:', query);

        // Send message to chat session
        const result = await chat.sendMessage(query);

        // console.log('Full result object:', result);
        // console.log('Response object:', result.response);
        // console.log('Response candidates:', result.response.candidates);
        // console.log('Prompt feedback:', result.response.promptFeedback);

        const responseText = result.response.text();

        // console.log('Response text length:', responseText.length);
        // console.log('Response text:', responseText);

        // Check if response is blocked
        if (!responseText || responseText.trim().length === 0) {
            // console.warn('Empty response detected! Checking for blocks...');

            if (result.response.promptFeedback?.blockReason) {
                console.error('Response blocked:', result.response.promptFeedback.blockReason);
                return {
                    route: 'ERROR',
                    text: `Response blocked: ${result.response.promptFeedback.blockReason}`
                };
            }

            if (result.response.candidates && result.response.candidates[0]?.finishReason) {
                console.error('Finish reason:', result.response.candidates[0].finishReason);
                return {
                    route: 'ERROR',
                    text: `Generation stopped: ${result.response.candidates[0].finishReason}`
                };
            }

            return {
                route: 'ERROR',
                text: 'Received empty response. Please try again.'
            };
        }

        // Detect route based on response content or keywords (for badge display)
        let route = 'CHAT';
        if (/database|watchlist|stats|titles/i.test(responseText)) {
            route = 'DATABASE';
        } else if (/search|web|google|found|according to/i.test(responseText)) {
            route = 'WEB';
        }

        return { route, text: responseText };
    } catch (error) {
        console.error("Chat error details:", error);
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Full error:", JSON.stringify(error, null, 2));

        return {
            route: 'ERROR',
            text: `Error: ${error.message || 'Unknown error occurred'}. Try refreshing the page.`
        };
    }
}
