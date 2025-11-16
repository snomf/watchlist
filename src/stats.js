import '@fortawesome/fontawesome-free/css/all.min.css';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAI, getGenerativeModel } from "firebase/ai";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// --- CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyB7ijoC19A2krXR4kchbLEK_OZy_I53hsY",
  authDomain: "marvelmarathon.firebaseapp.com",
  projectId: "marvelmarathon",
  storageBucket: "marvelmarathon.appspot.com",
  messagingSenderId: "436493932151",
  appId: "1:436493932151:web:3db786130c2e7ba0159872"
};

// --- INITIALIZATION ---
const app = initializeApp(firebaseConfig);
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LebxYsrAAAAAF0FNbAiFp-uA7kjHZJT3i3hr6co'),
  isTokenAutoRefreshEnabled: true
});
const db = getFirestore(app);
const ai = getAI(app);
const model = getGenerativeModel(ai, { model: "gemini-2.5-flash-lite" });
const appId = 'marvel-marathon-default';
const SECRET_KEY = "':7:}lb1m/8F17;1%A&65";

// --- APP STATE ---
let marathonState = { items: [] };
let userSettings = {};

/**
 * Main function to initialize the stats page.
 * Fetches data from Firestore and then calls functions to render the page.
 */
async function initializeStatsPage() {
    console.log("Initializing Stats Page...");
    try {
        // Fetch marathon data and user settings in parallel
        const [marathonDoc, settingsDoc] = await Promise.all([
            getDoc(doc(db, "marathon-data", appId)),
            getDoc(doc(db, "settings", "main"))
        ]);

        if (marathonDoc.exists()) {
            marathonState = marathonDoc.data();
            console.log("Marathon data loaded:", marathonState);
        } else {
            console.error("Marathon data not found!");
            document.getElementById('loading-spinner').innerHTML = "Error: Marathon data not found.";
            return;
        }

        if (settingsDoc.exists()) {
            userSettings = settingsDoc.data();
            console.log("User settings loaded:", userSettings);
        } else {
            console.warn("User settings not found, using defaults.");
            // Define defaults if settings are missing
            userSettings = {
                quotaConservation: true,
                aiDisabled: false,
                wallpaper: null,
            };
        }

        const stats = calculateAllStats(marathonState.items);
        console.log("Calculated Stats:", stats);

        renderStats(stats);
        renderAISection(stats);
        applyTheme();

        document.getElementById('loading-spinner').style.display = 'none';

    } catch (error) {
        console.error("Error initializing stats page:", error);
        document.getElementById('loading-spinner').innerHTML = "Error loading page data. Please refresh.";
    }
}

// --- STATS CALCULATION ---

/**
 * Calculates all statistics based on the marathon data.
 * @param {Array} items - The array of marathon items.
 * @returns {Object} An object containing all calculated stats.
 */
function calculateAllStats(items) {
    const watchedItems = items.filter(item => item.watched === true);

    const juainnyRatings = watchedItems.map(item => item.ratings.user1).filter(r => r !== null && r !== undefined);
    const erickRatings = watchedItems.map(item => item.ratings.user2).filter(r => r !== null && r !== undefined);

    const juainnyAvg = juainnyRatings.reduce((a, b) => a + b, 0) / (juainnyRatings.length || 1);
    const erickAvg = erickRatings.reduce((a, b) => a + b, 0) / (erickRatings.length || 1);
    const combinedAvg = (juainnyAvg + erickAvg) / 2;

    return {
        ratingBreakdown: {
            combinedAvg: combinedAvg,
            juainnyAvg: juainnyAvg,
            erickAvg: erickAvg,
            tougherCritic: determineTougherCritic(juainnyAvg, erickAvg),
        },
        marathonAwards: {
            mvp: findMvp(watchedItems),
            greatDivide: findGreatDivide(watchedItems),
            juainnyFavorite: findFavorite(watchedItems, 'user1'),
            erickFavorite: findFavorite(watchedItems, 'user2'),
            juainnyLeastFavorite: findLeastFavorite(watchedItems, 'user1'),
            erickLeastFavorite: findLeastFavorite(watchedItems, 'user2'),
            underdog: findUnderdog(watchedItems),
        },
        aiData: {
            unwatchedCount: items.filter(item => !item.watched && !item.rejected).length,
            nextUpTitle: items.find(item => !item.watched && !item.rejected)?.title || "N/A",
        }
    };
}

function determineTougherCritic(juainnyAvg, erickAvg) {
    if (juainnyAvg === erickAvg) return "It's a tie!";
    return juainnyAvg < erickAvg ? "Juainny" : "Erick";
}

function findMvp(watchedItems) {
    let maxAvg = -1;
    let mvps = [];

    watchedItems.forEach(item => {
        const r1 = item.ratings.user1;
        const r2 = item.ratings.user2;
        if (r1 !== null && r2 !== null) {
            const avg = (r1 + r2) / 2;
            const winner = { title: item.title, score: avg, backdrop_path: item.backdrop_path };
            if (avg > maxAvg) {
                maxAvg = avg;
                mvps = [winner];
            } else if (avg === maxAvg) {
                mvps.push(winner);
            }
        }
    });
    return mvps;
}

function findGreatDivide(watchedItems) {
    let maxDiff = -1;
    let dividers = [];

    watchedItems.forEach(item => {
        const r1 = item.ratings.user1;
        const r2 = item.ratings.user2;
        if (r1 !== null && r2 !== null) {
            const diff = Math.abs(r1 - r2);
            const winner = { title: item.title, difference: diff, backdrop_path: item.backdrop_path };
            if (diff > maxDiff) {
                maxDiff = diff;
                dividers = [winner];
            } else if (diff === maxDiff) {
                dividers.push(winner);
            }
        }
    });
    return dividers;
}

function findFavorite(watchedItems, userKey) {
    let maxRating = -1;
    let favorites = [];

    watchedItems.forEach(item => {
        const rating = item.ratings[userKey];
        if (rating !== null) {
            const winner = { title: item.title, score: rating, backdrop_path: item.backdrop_path };
            if (rating > maxRating) {
                maxRating = rating;
                favorites = [winner];
            } else if (rating === maxRating) {
                favorites.push(winner);
            }
        }
    });
    return favorites;
}

function findUnderdog(watchedItems) {
    const underdogs = watchedItems.filter(item => item.vote_average && item.vote_average < 7.0);
    if (underdogs.length === 0) return [];

    let maxUserAvg = -1;
    let topUnderdogs = [];

    underdogs.forEach(item => {
        const r1 = item.ratings.user1;
        const r2 = item.ratings.user2;
        if (r1 !== null && r2 !== null) {
            const avg = (r1 + r2) / 2;
            const winner = { title: item.title, userScore: avg, publicScore: item.vote_average, backdrop_path: item.backdrop_path };
            if (avg > maxUserAvg) {
                maxUserAvg = avg;
                topUnderdogs = [winner];
            } else if (avg === maxUserAvg) {
                topUnderdogs.push(winner);
            }
        }
    });
    return topUnderdogs;
}

function findLeastFavorite(watchedItems, userKey) {
    let minRating = 11; // Start with a value higher than any possible rating
    let leastFavorites = [];

    watchedItems.forEach(item => {
        const rating = item.ratings[userKey];
        if (rating !== null && rating !== undefined) {
            const winner = { title: item.title, score: rating, backdrop_path: item.backdrop_path };
            if (rating < minRating) {
                minRating = rating;
                leastFavorites = [winner];
            } else if (rating === minRating) {
                leastFavorites.push(winner);
            }
        }
    });
    return leastFavorites;
}


// --- RENDER FUNCTIONS ---

/**
 * Populates the DOM with the calculated stats.
 * @param {Object} stats - The object containing all calculated stats.
 */
function renderStats(stats) {
    const { ratingBreakdown, marathonAwards } = stats;
    const container = document.getElementById('stat-bar');
    if (!container) return;

    const keyStats = [
        {
            label: 'Combined Average',
            value: ratingBreakdown.combinedAvg.toFixed(2),
            color: 'text-text-primary'
        },
        {
            label: "Juainny's Average",
            value: ratingBreakdown.juainnyAvg.toFixed(2),
            color: 'text-green-400'
        },
        {
            label: "Erick's Average",
            value: ratingBreakdown.erickAvg.toFixed(2),
            color: 'text-purple-400'
        },
        {
            label: 'Tougher Critic',
            value: ratingBreakdown.tougherCritic,
            color: 'text-danger'
        }
    ];

    let html = '<div class="grid grid-cols-2 md:grid-cols-4 gap-4">';
    for (const stat of keyStats) {
        const valueClass = stat.label === 'Tougher Critic' ? 'text-2xl' : 'text-3xl';
        html += `
            <div class="stat-card text-center p-4 rounded-lg bg-bg-tertiary border border-border-primary">
                <p class="${valueClass} font-bold ${stat.color}">${stat.value}</p>
                <p class="text-text-muted mt-1 text-xs">${stat.label}</p>
            </div>
        `;
    }
    html += '</div>';
    container.innerHTML = html;

    // Render Marathon Awards
    renderAwards(marathonAwards);
}

function renderAwards(marathonAwards) {
    const container = document.getElementById('awards-container');
    if (!container) return;

    const awards = [
        {
            id: 'mvp',
            title: 'Our Marathon MVP',
            description: 'Highest combined average rating.',
            winners: marathonAwards.mvp,
            scoreLabel: 'Score',
            scoreKey: 'score',
            precision: 1,
            color: 'text-yellow-400'
        },
        {
            id: 'greatDivide',
            title: 'The Great Divide',
            description: 'Largest difference between ratings.',
            winners: marathonAwards.greatDivide,
            scoreLabel: 'Difference',
            scoreKey: 'difference',
            precision: 1,
            color: 'text-blue-400'
        },
        {
            id: 'juainnyFavorite',
            title: "Juainny's Favorite",
            description: 'Highest personal rating from Juainny.',
            winners: marathonAwards.juainnyFavorite,
            scoreLabel: 'Score',
            scoreKey: 'score',
            precision: 0,
            color: 'text-green-400'
        },
        {
            id: 'erickFavorite',
            title: "Erick's Favorite",
            description: 'Highest personal rating from Erick.',
            winners: marathonAwards.erickFavorite,
            scoreLabel: 'Score',
            scoreKey: 'score',
            precision: 0,
            color: 'text-purple-400'
        },
        {
            id: 'juainnyLeastFavorite',
            title: "Juainny's Least Favorite",
            description: 'Lowest personal rating from Juainny.',
            winners: marathonAwards.juainnyLeastFavorite,
            scoreLabel: 'Score',
            scoreKey: 'score',
            precision: 0,
            color: 'text-gray-500'
        },
        {
            id: 'erickLeastFavorite',
            title: "Erick's Least Favorite",
            description: 'Lowest personal rating from Erick.',
            winners: marathonAwards.erickLeastFavorite,
            scoreLabel: 'Score',
            scoreKey: 'score',
            precision: 0,
            color: 'text-gray-500'
        },
        {
            id: 'underdog',
            title: 'The Underdog Award',
            description: 'Highest user-rated film with a low public score.',
            winners: marathonAwards.underdog,
            scoreLabel: 'User Score',
            scoreKey: 'userScore',
            precision: 1,
            color: 'text-teal-400'
        }
    ];

    let html = '';
    for (const award of awards) {
        if (award.winners.length > 0) {
            const winner = award.winners[0];
            const imageUrl = winner.backdrop_path ? `https://image.tmdb.org/t/p/w500${winner.backdrop_path}` : 'https://placehold.co/500x281/1f2937/ffffff?text=No+Backdrop';
            const movieTitle = award.winners.map(w => w.title).join(' & ');
            let scoreText;
            if (award.id === 'underdog') {
                scoreText = `User: ${winner.userScore.toFixed(1)} | Public: ${winner.publicScore.toFixed(1)}`;
            } else {
                scoreText = `${award.scoreLabel}: ${winner[award.scoreKey].toFixed(award.precision)}`;
            }

            html += `
                <div class="award-tile bg-bg-tertiary rounded-lg shadow-lg overflow-hidden">
                    <div class="relative">
                        <img src="${imageUrl}" alt="${movieTitle}" class="w-full h-48 object-cover">
                        <div class="absolute inset-0 bg-gradient-to-t from-bg-tertiary to-transparent"></div>
                    </div>
                    <div class="p-4 -mt-10 relative z-10">
                        <h3 class="text-lg font-black ${award.color}">${award.title}</h3>
                        <p class="text-xs text-text-muted italic mb-2">${award.description}</p>
                        <p class="text-md font-semibold text-text-primary truncate" title="${movieTitle}">${movieTitle}</p>
                        <p class="text-text-muted text-xs">${scoreText}</p>
                    </div>
                </div>
            `;
        }
    }
    container.innerHTML = html;
}


async function renderAISection(stats) {
    const aiSection = document.getElementById('ai-analysis');

    if (userSettings.aiDisabled) {
        aiSection.style.display = 'none';
        return;
    }
    aiSection.style.display = 'block';

    const aiContentArea = document.getElementById('ai-content-area');
    const showReloadButton = userSettings.quotaConservation;

    if (userSettings.quotaConservation) {
        const analysisRef = doc(db, "stats-analysis", appId);
        try {
            const analysisDoc = await getDoc(analysisRef);
            if (analysisDoc.exists() && analysisDoc.data().htmlContent) {
                console.log("Found saved AI analysis. Rendering from Firestore.");
                displayAITake(analysisDoc.data().htmlContent, stats, true);
            } else {
                console.log("No saved AI analysis found. Generating new take.");
                generateMarathonAnalysis(stats, true);
            }
        } catch (error) {
            console.error("Error fetching saved AI analysis:", error);
            generateMarathonAnalysis(stats, true);
        }
    } else {
        // If conservation is off, always generate and don't show the reload button
        generateMarathonAnalysis(stats, false);
    }
}

function displayAITake(htmlContent, stats, showReloadButton) {
    const aiContentArea = document.getElementById('ai-content-area');
    const titleContainer = document.getElementById('ai-title-container');
    if (!aiContentArea || !titleContainer) return;

    // --- 1. Fix Reload Button ---
    const oldReloadBtn = titleContainer.querySelector('#ai-reload-btn');
    if (oldReloadBtn) oldReloadBtn.remove();

    if (showReloadButton) {
        const reloadBtn = document.createElement('button');
        reloadBtn.id = 'ai-reload-btn';
        reloadBtn.className = 'absolute top-0 right-0 text-gray-400 hover:text-white transition';
        reloadBtn.innerHTML = `<i class="fas fa-sync-alt"></i>`;
        reloadBtn.onclick = () => generateMarathonAnalysis(stats, true);
        titleContainer.appendChild(reloadBtn);
    }

    // --- 2. Implement Collapsible Content (Robustly) ---
    aiContentArea.innerHTML = ''; // Clear previous content

    // Create wrapper for collapsible content
    const contentWrapper = document.createElement('div');
    contentWrapper.id = 'ai-content-wrapper';
    contentWrapper.className = 'ai-content-wrapper';

    // Create the div to hold the actual AI response
    const aiTextDiv = document.createElement('div');
    aiTextDiv.className = 'text-left';
    // Convert markdown bold to HTML strong tags
    const formattedContent = htmlContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    aiTextDiv.innerHTML = formattedContent;
    contentWrapper.appendChild(aiTextDiv);

    // Create the container for the expand button
    const expandBtnContainer = document.createElement('div');
    expandBtnContainer.className = 'flex justify-center mt-2';

    // Create the expand button
    const expandBtn = document.createElement('button');
    expandBtn.id = 'ai-expand-btn';
    expandBtn.className = 'text-red-500 hover:text-red-600 transition';
    expandBtn.innerHTML = `<i class="fas fa-chevron-down"></i>`;

    expandBtnContainer.appendChild(expandBtn);

    // Append new elements to the content area
    aiContentArea.appendChild(contentWrapper);
    aiContentArea.appendChild(expandBtnContainer);

    // --- 3. Add Event Listener for Expand Button ---
    contentWrapper.style.transition = 'max-height 0.5s ease-in-out';

    expandBtn.addEventListener('click', () => {
        expandBtn.classList.toggle('expanded');
        if (contentWrapper.style.maxHeight) {
            // If it's expanded, collapse it
            contentWrapper.style.maxHeight = null;
        } else {
            // If it's collapsed, expand it to its full scroll height
            contentWrapper.style.maxHeight = contentWrapper.scrollHeight + "px";
        }
    });
}

async function generateMarathonAnalysis(stats, showReloadButton) {
    const aiContentArea = document.getElementById('ai-content-area');
    aiContentArea.innerHTML = `
        <div class="flex flex-col items-center justify-center p-6">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
            <p class="text-gray-400">Jarvis is analyzing your marathon data...</p>
        </div>`;

    const prompt = buildAIPrompt(stats);

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const htmlResponse = response.text();

        displayAITake(htmlResponse, stats, showReloadButton);

        // If in conservation mode, save the result to Firestore
        if (userSettings.quotaConservation) {
            const analysisRef = doc(db, "stats-analysis", appId);
            await setDoc(analysisRef, {
                generatedAt: new Date().toISOString(),
                htmlContent: htmlResponse,
                authKey: SECRET_KEY
            });
            console.log("AI analysis saved to Firestore.");
        }

    } catch (error) {
        console.error("AI analysis generation failed:", error);
        aiContentArea.innerHTML = `<p class="text-red-500 p-6">Sorry, there was an error getting Jarvis's take. Please try again later.</p>`;
    }
}

function buildAIPrompt(stats) {
    const { ratingBreakdown, marathonAwards, aiData } = stats;

    // Helper to format award winners for the prompt
    const formatWinners = (winners) => winners.map(w => w.title).join(' & ');

    const mvpTitle = formatWinners(marathonAwards.mvp);
    const divideTitle = formatWinners(marathonAwards.greatDivide);
    const underdogTitle = formatWinners(marathonAwards.underdog);
    const juainnyFave = formatWinners(marathonAwards.juainnyFavorite);
    const erickFave = formatWinners(marathonAwards.erickFavorite);

    const data = {
        "Marathon MVP Title": mvpTitle,
        "Underdog Award Title": underdogTitle,
        "Great Divide Title": divideTitle,
        "Tougher Critic's Name": ratingBreakdown.tougherCritic,
        "Juainny's Favorite Title": juainnyFave,
        "Erick's Favorite Title": erickFave,
        "unwatchedCount": aiData.unwatchedCount,
        "nextUpTitle": aiData.nextUpTitle,
        "juainnyAvgRating": ratingBreakdown.juainnyAvg,
        "erickAvgRating": ratingBreakdown.erickAvg
    };

    return `
You are "Jarvis", a data-savvy, and insightful AI companion. Your purpose is to analyze the Marvel marathon viewing history of a couple, Juainny and Erick, and present them with a fun, personalized "Marathon Report Card" narrative.

INSTRUCTIONS:
- Analyze the provided JSON data.
- Your tone should be conversational, encouraging, and a little bit cheeky. Use their names to make it personal.
- Your entire response should be plain text, suitable for direct display.
- You are allowed to use markdown for bolding text by wrapping it in double asterisks, like **this**. Do not use any other markdown or any HTML tags.
- Do NOT spoil any movies or shows that are not in the provided data.

DATA:
${JSON.stringify(data, null, 2)}

Here is a loose structure to follow for your narrative:

**Our Marathon Report Card**
Start with a fun, introductory sentence about their journey so far.

**Your Overall Taste Profile**
Generate a 1-2 sentence summary of their combined taste. Analyze if they prefer grounded stories, cosmic adventures, ensemble films, or solo outings based on their highest-rated movies.

**The Marathon Awards**
- Comment on "${mvpTitle}", their highest-rated film, and why it's a deserving champion.
- Comment on "${underdogTitle}", congratulating them on spotting a hidden gem that the public may have overlooked.
- Comment on "${divideTitle}", the movie with the biggest rating difference between Juainny and Erick. Write a playful sentence about their fun disagreement.

**Head-to-Head Analysis**
- Based on the data, announce who the "Tougher Critic" is.
- Comment on their individual favorites, Juainny's being ${juainnyFave} and Erick's being ${erickFave}. Add a short, insightful sentence comparing these two choices.

**A Look Ahead**
- Mention that they have ${aiData.unwatchedCount} items left and that their next item is ${aiData.nextUpTitle}. Add a fun, non-spoilery comment about it.
`;
}


function applyTheme() {
    // Apply color theme
    const body = document.body;
    const theme = userSettings.theme || 'dark';
    const themeClasses = Array.from(body.classList).filter(c => c.startsWith('theme-'));
    body.classList.remove(...themeClasses);
    body.classList.add(`theme-${theme}`);

    // Apply wallpaper
    if (userSettings.wallpaper) {
        document.body.style.backgroundImage = `url(${userSettings.wallpaper})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
        document.getElementById('wallpaper-overlay').style.display = 'block';
    } else {
        document.body.style.backgroundImage = '';
        document.getElementById('wallpaper-overlay').style.display = 'none';
    }
}

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', initializeStatsPage);
