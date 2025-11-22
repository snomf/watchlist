import { model } from '../firebase-client.js';
import { tools, toolImplementations } from './ai-tools.js';

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
 * @param {string} userName - The name of the user chatting ('juainny' or 'erick')
 * @returns {Object} - Chat session object
 */
export function startAiChat(allMedia, userName = null) {
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

    // We can reduce the titles context since we have search tools now, 
    // but keeping a lightweight list helps with quick context.
    const titles = allMedia.map(i => ({
        t: i.title || i.name,
        w: i.watched ? 1 : 0,
        cw: i.currently_watching ? 1 : 0
    }));

    const userContext = userName
        ? `\n**Current User:** You are chatting with ${userName.charAt(0).toUpperCase() + userName.slice(1)}. When they say "my notes" or "my rating", they mean ${userName}'s notes/rating. Personalize your responses accordingly.`
        : '';

    const systemContext = `Today: ${today}

You are Mr. W, an AI assistant for Juainny and Erick's watchlist app.${userContext}

**Database Context:**
Stats: ${JSON.stringify(stats)}
Titles (Sample): ${JSON.stringify(titles.slice(0, 50))}... (Use search_media tool for more)

**Important:**
- You have access to tools to query the database and perform actions.
- **ALWAYS** use the \`search_media\` tool if the user asks about a specific movie/show that isn't in your immediate context.
- **ALWAYS** use \`get_activity_log\` if the user asks about recent activity.
- **ALWAYS** use \`get_user_settings\` if the user asks about themes, bios, or avatars.
- **ALWAYS** use \`get_media_flairs\` if the user asks about flairs for a specific item.
- **ALWAYS** use \`get_tv_progress\` if the user asks about episode/season progress.
- **ALWAYS** use \`get_media_notes\` when asked about notes or ratings for a specific title.
- **ALWAYS** use \`get_media_by_status\` if the user asks "What am I watching?" (status='currently_watching') or "What do I want to watch?" (status='want_to_watch').
- Use \`add_to_watchlist\`, \`rate_media\`, \`update_media_notes\`, or \`mark_watched\` when explicitly asked to perform these actions.
- **IMPORTANT:** If asked to update notes, ALWAYS confirm the content with the user before saving.
- Maintain conversation context across messages.
- Ratings are out of 10.
- Use **markdown** formatting.
- Be conversational and helpful.`;

    // Start chat session with system context and tools
    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: systemContext }]
            },
            {
                role: "model",
                parts: [{ text: "Hello! I'm Willow. I can help you manage your watchlist, check your activity, and more. How can I help you today?" }]
            }
        ],
        generationConfig: {
            maxOutputTokens: 1000, // Increased for tool use
            temperature: 0.7
        },
        tools: [
            {
                functionDeclarations: tools
            }
        ]
    });

    return chat;
}

/**
 * Send a message in an existing chat session
 * @param {Object} chat - The chat session
 * @param {string} query - The user's message
 * @returns {Promise<{ route: string, text: string }>} - The AI's response with route
 */
export async function chatWithAi(chat, query) {
    try {
        // console.log('Sending message to chat:', query);

        // Send message to chat session
        let result = await chat.sendMessage(query);
        let response = await result.response;
        let text = response.text();

        // Handle function calls loop
        // The model might want to call multiple functions or call functions and then reply.
        // We need to check for function calls in the candidates.

        // Note: The Firebase JS SDK for Gemini handles function calling slightly differently than the REST API.
        // We need to check `functionCalls()` on the response.

        let functionCalls = response.functionCalls();

        while (functionCalls && functionCalls.length > 0) {
            // console.log('Function calls detected:', functionCalls);

            const functionResponses = [];

            for (const call of functionCalls) {
                const name = call.name;
                const args = call.args;

                // console.log(`Executing tool: ${name} with args:`, args);

                if (toolImplementations[name]) {
                    try {
                        const functionResult = await toolImplementations[name](args);
                        // console.log(`Tool result for ${name}:`, functionResult);

                        functionResponses.push({
                            functionResponse: {
                                name: name,
                                response: {
                                    name: name,
                                    content: functionResult
                                }
                            }
                        });
                    } catch (err) {
                        console.error(`Error executing tool ${name}:`, err);
                        functionResponses.push({
                            functionResponse: {
                                name: name,
                                response: {
                                    name: name,
                                    content: `Error executing tool: ${err.message}`
                                }
                            }
                        });
                    }
                } else {
                    console.error(`Tool ${name} not found.`);
                    functionResponses.push({
                        functionResponse: {
                            name: name,
                            response: {
                                name: name,
                                content: `Error: Tool ${name} not found.`
                            }
                        }
                    });
                }
            }

            // Send function responses back to the model
            // console.log('Sending function responses back to model:', functionResponses);
            result = await chat.sendMessage(functionResponses);
            response = await result.response;
            text = response.text();
            functionCalls = response.functionCalls();
        }

        // Check if response is blocked
        if (!text || text.trim().length === 0) {
            if (response.promptFeedback?.blockReason) {
                return {
                    route: 'ERROR',
                    text: `Response blocked: ${response.promptFeedback.blockReason}`
                };
            }
            return {
                route: 'ERROR',
                text: 'Received empty response. Please try again.'
            };
        }

        // Detect route based on response content or keywords (for badge display)
        let route = 'CHAT';
        if (/database|watchlist|stats|titles/i.test(text)) {
            route = 'DATABASE';
        } else if (/search|web|google|found|according to/i.test(text)) {
            route = 'WEB';
        }

        return { route, text: text };
    } catch (error) {
        console.error("Chat error details:", error);
        return {
            route: 'ERROR',
            text: `Error: ${error.message || 'Unknown error occurred'}. Try refreshing the page.`
        };
    }
}
