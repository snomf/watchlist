import { model } from '../firebase-client.js';

/**
 * Generates a summary for a media item based on user notes and ratings.
 * @param {Object} mediaItem - The media item object.
 * @param {Object} userRatings - Object containing user ratings (e.g., { user1: 4, user2: 5 }).
 * @param {Object} userNotes - Object containing user notes (e.g., { user1: "Great!", user2: "Okay." }).
 * @returns {Promise<string>} - The generated summary.
 */
export async function generateMediaSummary(mediaItem, userRatings, userNotes) {
    const prompt = `
    You are Willow, a friendly and helpful AI assistant for a movie/show watchlist.
    
    Task: Generate a brief, engaging summary of the users' opinions on the following media item.
    
    Media Title: ${mediaItem.title || mediaItem.name}
    Overview: ${mediaItem.overview}
    
    User 1 (Juainny):
    - Rating: ${userRatings.user1 || 'N/A'}/5
    - Notes: ${userNotes.user1 || 'No notes'}
    
    User 2 (Erick):
    - Rating: ${userRatings.user2 || 'N/A'}/5
    - Notes: ${userNotes.user2 || 'No notes'}
    
    Instructions:
    - Synthesize the ratings and notes into a cohesive paragraph.
    - If notes are missing, focus on the ratings or the media overview.
    - Keep it under 100 words.
    - Be friendly and use the persona of "Willow".
    - If both users liked it, mention that. If they disagreed, highlight the contrast playfully.
    `;

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
    // Prepare context from allMedia (simplified to save tokens)
    const context = allMedia.map(item => ({
        title: item.title || item.name,
        type: item.type,
        watched: item.watched,
        want_to_watch: item.want_to_watch,
        currently_watching: item.currently_watching,
        ratings: {
            juainny: item.user1_rating,
            erick: item.user2_rating
        },
        notes: {
            juainny: item.user1_notes,
            erick: item.user2_notes
        }
    }));

    const prompt = `
    You are Willow, the AI assistant for Juainny and Erick's watchlist.
    
    Context: You have access to their entire watchlist database.
    Database Summary: ${JSON.stringify(context)}
    
    User Question: ${query}
    
    Instructions:
    - Answer the question based on the provided database.
    - You can recommend things to watch from their "want_to_watch" list.
    - You can summarize what they have watched.
    - Be friendly, helpful, and concise.
    - If the answer isn't in the database, use your general knowledge but mention that it's not in their list.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error chatting with Willow:", error);
        return "I'm feeling a bit overwhelmed with all this data. Ask me again in a moment!";
    }
}
