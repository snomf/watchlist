// Import Firebase and Gemini AI Logic modules
import { initializeApp } from "firebase/app";
import '@fortawesome/fontawesome-free/css/all.min.css';
import AvatarPicker from './avatar-picker.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import MoodModal from './mood-modal.js';
import confetti from 'canvas-confetti';


const SECRET_KEY = "':7:}lb1m/8F17;1%A&65";
const TMDB_API_KEY = "25e3d089cc8e37a56bf6a1984daf3c5c";
const snapSound = new Audio('/snap.mp3');

// --- CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyB7ijoC19A2krXR4kchbLEK_OZy_I53hsY",
  authDomain: "marvelmarathon.firebaseapp.com",
  projectId: "marvelmarathon",
  storageBucket: "marvelmarathon.appspot.com",
  messagingSenderId: "436493932151",
  appId: "1:436493932151:web:3db786130c2e7ba0159872"
};

const app = initializeApp(firebaseConfig);
// After initializing your app:
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LebxYsrAAAAAF0FNbAiFp-uA7kjHZJT3i3hr6co'),
  isTokenAutoRefreshEnabled: true
});
const urlParams = new URLSearchParams(window.location.search);
const appId = urlParams.get('id') || 'marvel-marathon-default';
const ai = getAI(app);
const model = getGenerativeModel(ai, { model: "gemini-2.5-flash-lite" }); // or "gemini-pro"



// App state variables (no duplicate app/model)
let auth, db, storage, userId;
let marathonState = { items: [] };
let userSettings = {
    quotaConservation: true,
    aiDisabled: false,
    wallpaper: null,
    nextUpWallpaperEnabled: false,
    nextUpWallpaperType: 'all',
    nextUpWallpaperIncludeNonMCU: true,
    nextUpWallpaperIncludeTV: true,
    theme: 'dark',
    avatars: {
        user1: null,
        user2: null
    },
    aiHeading: null,
    aiHeadingTimestamp: null
};
let unsubscribe;
let isInitializing = false;
let factInterval = null;
let currentView = 'grid';
let currentFilter = 'movie'; // Default filter to movie
let showOnlyNonMCU = false;
let currentModalId = null;
let nextUpId = null;
let lastNextUpId = null;
let moodModal = null;

let notifications = [];

const marvelFacts = [
    "The first Marvel comic was published in 1939, called “Marvel Comics #1.”",
    "Stan Lee’s real name is Stanley Martin Lieber.",
    "Spider-Man once teamed up with the cast of Saturday Night Live in a comic.",
    "The X-Men’s original uniforms were all yellow and blue.",
    "Black Panther debuted in Fantastic Four #52 in 1966.",
    "The character Squirrel Girl has defeated Thanos and Doctor Doom in the comics.",
    "Deadpool’s first appearance was in “The New Mutants” #98 (1991).",
    "Magneto is the father of Quicksilver and Scarlet Witch in the comics.",
    "The Hulk was originally grey, not green.",
    "Wolverine’s first appearance was in “The Incredible Hulk” #180 (1974).",
    "The character Howard the Duck has run for President in the comics.",
    "She-Hulk was a member of both the Avengers and the Fantastic Four.",
    "The villain MODOK stands for “Mental Organism Designed Only for Killing.”",
    "The Punisher first appeared in “The Amazing Spider-Man” #129 (1974).",
    "The character Moon Knight has multiple personalities.",
    "The superhero team Alpha Flight is Canada’s official superhero group.",
    "The original Captain Marvel was a Kree alien named Mar-Vell.",
    "The character Beta Ray Bill once wielded Thor’s hammer.",
    "The villain Kang the Conqueror is a descendant of Reed Richards.",
    "The superhero Dazzler was created as a cross-promotion with a record company.",
    "The X-Men’s mansion is located in Westchester County, New York.",
    "The character Namor the Sub-Mariner is one of Marvel’s oldest heroes.",
    "Doctor Doom is the ruler of the fictional country Latveria.",
    "The character Jubilee was introduced in the late 1980s as a mall-loving teen.",
    "The villain Taskmaster can copy any fighting style he sees.",
    "The superhero team Runaways consists of teens who discover their parents are supervillains.",
    "The character Cloak and Dagger gained their powers from experimental drugs.",
    "The villain Mephisto is Marvel’s version of the devil.",
    "The superhero Ms. Marvel was originally Carol Danvers before becoming Captain Marvel.",
    "The character Spider-Ham is a pig version of Spider-Man from an alternate universe.",
    "The superhero team Excalibur is based in the UK and features Captain Britain.",
    "The villain Arcade runs a deadly amusement park called Murderworld.",
    "The character Shatterstar is from the Mojoverse, a dimension obsessed with TV ratings.",
    "The superhero Sentry has the power of “a million exploding suns.”",
    "The villain The Beyonder once turned the Marvel Universe upside down in “Secret Wars.”",
    "The superhero Northstar was one of the first openly gay Marvel characters.",
    "The character Silver Surfer was originally a herald for Galactus.",
    "The villain The Mandarin uses ten powerful rings, each with a different ability.",
    "The superhero team The New Warriors debuted in 1989.",
    "The character Spider-Woman was created to secure the copyright for the name.",
    "The villain Absorbing Man can take on the properties of anything he touches.",
    "The superhero team Power Pack consists of four siblings with superpowers.",
    "The character Man-Thing burns those who feel fear.",
    "The villain Mister Sinister is obsessed with mutant genetics.",
    "The superhero team The Great Lakes Avengers is a parody group based in Wisconsin.",
    "The character Adam Warlock was created to be the perfect human.",
    "The villain The High Evolutionary experiments on animals to create new species.",
    "The superhero Nova is a member of the intergalactic Nova Corps.",
    "The character Elsa Bloodstone is a monster hunter.",
    "The villain Fin Fang Foom is a giant dragon who wears purple shorts."
];

// Initialize Firebase Auth, Firestore, Storage
async function initializeAppAndAuth() {
  try {
    const factElement = document.getElementById('loading-fact');
    if (factElement) {
        const setRandomFact = () => {
            const randomIndex = Math.floor(Math.random() * marvelFacts.length);
            factElement.textContent = marvelFacts[randomIndex];
        };
        setRandomFact(); // Set a fact immediately
        factInterval = setInterval(setRandomFact, 3000);
    }

    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    onAuthStateChanged(auth, user => {
      if (user) {
        userId = user.uid;
        setTimeout(() => {
            setupMarathonListener();
            setupUserSettingsListener();
            setupNotificationsListener();
            applyUserSettings();
            softRefresh(); // Automatically refresh on load
        }, 2000); // Delay for 2 seconds
      } else {
        signInAnonymously(auth).catch(error => {
          console.error("Anonymous sign-in failed:", error);
          document.getElementById('loading-spinner').innerText = "Authentication Error.";
        });
      }
    });
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    document.getElementById('loading-spinner').innerHTML = "Error connecting to services. Please refresh.";
  }
}

async function setupUserSettingsListener() {
    const settingsRef = doc(db, "settings", "main");
    onSnapshot(settingsRef, (docSnap) => {
        if (docSnap.exists()) {
            userSettings = docSnap.data();
        } else {
            // If no settings doc exists, create one with default values
            setDoc(settingsRef, userSettings);
        }
        applyUserSettings();
    });
}

async function updateUserSettings(settings) {
    const settingsRef = doc(db, "settings", "main");
    // Optimistically update local state
    userSettings = { ...userSettings, ...settings };
    // Then, update Firestore
    const settingsWithAuth = { ...settings, authKey: SECRET_KEY };
    await setDoc(settingsRef, settingsWithAuth, { merge: true });
}

function updateTheme(newTheme) {
    updateUserSettings({ theme: newTheme });
}

import { renderAvatar } from './avatar-renderer.js';

function applyTheme(theme) {
    const body = document.body;
    // Remove any existing theme classes that start with "theme-"
    const themeClasses = Array.from(body.classList).filter(c => c.startsWith('theme-'));
    body.classList.remove(...themeClasses);

    // Add the new theme class
    body.classList.add(`theme-${theme || 'dark'}`);
}

function applyUserSettings() {
    applyTheme(userSettings.theme);

    // Apply avatars
    if (userSettings.avatars) {
        const user1Preview = document.getElementById('user1-avatar-preview');
        const user2Preview = document.getElementById('user2-avatar-preview');
        const juainnyAvatar = document.getElementById('juainny-avatar');
        const erickAvatar = document.getElementById('erick-avatar');
        const user1Nav = document.getElementById('user1-avatar-nav');
        const user2Nav = document.getElementById('user2-avatar-nav');

        if(user1Preview && user2Preview && juainnyAvatar && erickAvatar) {
            renderAvatar(user1Preview, 'user1', userSettings, { extraClasses: ['mt-2'] });
            renderAvatar(user2Preview, 'user2', userSettings, { extraClasses: ['mt-2'] });
            renderAvatar(juainnyAvatar, 'user1', userSettings, { extraClasses: ['mr-3'] });
            renderAvatar(erickAvatar, 'user2', userSettings, { extraClasses: ['mr-3'] });
            renderAvatar(user1Nav, 'user1', userSettings, {});
            renderAvatar(user2Nav, 'user2', userSettings, {});
        }
    }

    const quotaConservationToggle = document.getElementById('quota-conservation-toggle');
    const aiDisabledToggle = document.getElementById('ai-disabled-toggle');

    quotaConservationToggle.checked = userSettings.quotaConservation;
    aiDisabledToggle.checked = userSettings.aiDisabled;

    // Manually trigger the change event to update the visual state of the toggles
    quotaConservationToggle.dispatchEvent(new Event('change'));
    aiDisabledToggle.dispatchEvent(new Event('change'));

    // Apply the AI disabled setting
    const aiFeatures = document.querySelectorAll('.ai-feature');
    aiFeatures.forEach(feature => {
        feature.style.display = userSettings.aiDisabled ? 'none' : '';
    });

    // Refresh the Next Up teaser to apply the new settings
    if (marathonState.items && marathonState.items.length > 0) {
        let itemsToRender = marathonState.items;
        if (currentFilter === 'movie') {
            itemsToRender = itemsToRender.filter(item => item.type === 'movie');
        } else if (currentFilter === 'tv') {
            itemsToRender = itemsToRender.filter(item => ['tv', 'one-shot'].includes(item.type));
        }
        if (currentFilter !== 'tv' && !showOnlyNonMCU) {
            itemsToRender = itemsToRender.filter(item => !item.not_mcu);
        }
        updateNextUpTeaser(itemsToRender);
    }
    updateNextUpTeaser(marathonState.items);

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
    updateAIHeading();
    renderUI();
}

// Gemini AI Logic function
async function generateHypeSentence(movieTitle, movieOverview, watchedMovies) {
  const watchedTitles = watchedMovies.map(m => m.title).join(', ');
  const prompt = `You are a Jarvis a movie "Next Up" generator for a web app for Juainny and Erick. Looking at the movies that have been watched: ${watchedTitles}.
Generate a 2-3 sentence teaser for the next movie that also incorporates what happened in the last MCU movie: '${movieTitle}'. The movie's description is: '${movieOverview}'.
Your tone should be a throwback to the movies already watched, but also a look into what's next. Do not refer to anyone by name. Sound a bit robotic. Use markdown for emphasis, like **bold** for movie titles.`;
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text.replace(/"/g, ''); // Clean up any quotation marks from the response
  } catch (error) {
    console.error("AI hype generation failed:", error);
    // Return a fun fallback sentence if the AI fails
    return "This next one's a mystery... hope you're ready!";
  }
}

async function getOrGenerateHypeSentence(item, force = false) {
    const cacheKey = `${currentFilter}_${showOnlyNonMCU ? 'non_mcu' : 'mcu'}`;
    if (!force && userSettings.quotaConservation && typeof item.nextUpHype === 'object' && item.nextUpHype && item.nextUpHype[cacheKey]) {
        return item.nextUpHype[cacheKey];
    }

    const watchedMovies = marathonState.items.filter(item => item.watched);
    const hypeSentence = await generateHypeSentence(item.title, item.overview, watchedMovies);

    if (userSettings.quotaConservation) {
        const itemIndex = marathonState.items.findIndex(i => i.id === item.id);
        if (itemIndex > -1) {
            if (typeof marathonState.items[itemIndex].nextUpHype !== 'object' || marathonState.items[itemIndex].nextUpHype === null) {
                marathonState.items[itemIndex].nextUpHype = {};
            }
            marathonState.items[itemIndex].nextUpHype[cacheKey] = hypeSentence;
            updateFirestoreState();
        }
    }

    return hypeSentence;
}

async function generateAIHeading() {
    const prompt = `You are Jarvis. Your task is to generate a single, fun, welcoming sentence for a Marvel movie marathon website. The sentence must be less than 10 words. Do not use any markdown or formatting characters like * or #. For example: "Your Marvel journey awaits."`;
    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        let text = response.text();
        // Safeguard against markdown and lists
        text = text.split('\n')[0]; // Take only the first line
        text = text.replace(/[\*#]/g, ''); // Remove markdown characters
        text = text.replace(/"/g, ''); // Remove quotes
        return text.trim();
    } catch (error) {
        console.error("AI heading generation failed:", error);
        return "Welcome, Marvel Fan!";
    }
}

async function updateAIHeading() {
    const headingEl = document.getElementById('ai-heading');
    if (!headingEl) return;

    const now = Date.now();
    const lastUpdate = userSettings.aiHeadingTimestamp || 0;
    const cooldown = 10 * 1000; // 10 seconds

    if (now - lastUpdate > cooldown) {
        const newHeading = await generateAIHeading();
        headingEl.textContent = newHeading;
        updateUserSettings({ aiHeading: newHeading, aiHeadingTimestamp: now });
    } else {
        headingEl.textContent = userSettings.aiHeading || 'Welcome, Marvel Fan!';
    }
}

async function generateJarvisSummary(title, ratings, notes, moods) {
    let prompt = `You are Jarvis a summarizer. Based on the following ratings (out of 10) and notes for the movie "${title}", create a short, smart summary of what the Watchers thought. Juainny gave it a ${ratings.user1} and said: "${notes.user1}". Erick, gave it a ${ratings.user2} and said: "${notes.user2}".`;

    if (moods) {
        if (moods.user1) {
            prompt += ` Juainny felt ${moods.user1.name}.`;
        }
        if (moods.user2) {
            prompt += ` Erick felt ${moods.user2.name}.`;
        }
    }

    prompt += " Summarize, and use their names. Give both users equal summary amounts. Sound a bit robotic. Use markdown for emphasis, like **bold** for names.";

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        return text.replace(/"/g, ''); // Clean up quotes
    } catch (error) {
        console.error("AI summary generation failed:", error);
        return "Looks like the notes are still processing...";
    }
}

        // --- MCU DATA (with your latest ID updates) ---
        const marvelPhases = {
            1: ["Iron Man", "The Incredible Hulk", "Iron Man 2", "Thor", "Captain America: The First Avenger", "The Avengers"],
            2: ["Iron Man 3", "Thor: The Dark World", "Captain America: The Winter Soldier", "Guardians of the Galaxy", "Avengers: Age of Ultron", "Ant-Man"],
            3: ["Captain America: Civil War", "Doctor Strange", "Guardians of the Galaxy Vol. 2", "Spider-Man: Homecoming", "Thor: Ragnarok", "Black Panther", "Avengers: Infinity War", "Ant-Man and the Wasp", "Captain Marvel", "Avengers: Endgame", "Spider-Man: Far From Home"],
            4: ["WandaVision", "The Falcon and the Winter Soldier", "Loki Season 1", "Black Widow", "What If…?", "Shang-Chi and the Legend of the Ten Rings", "Eternals", "Hawkeye", "Spider-Man: No Way Home", "Moon Knight", "Doctor Strange in the Multiverse of Madness", "Ms. Marvel", "Thor: Love and Thunder", "I Am Groot", "She-Hulk: Attorney at Law", "Werewolf by Night", "Black Panther: Wakanda Forever", "The Guardians of the Galaxy Holiday Special"],
            5: ["Ant-Man and the Wasp: Quantumania", "Guardians of the Galaxy Vol. 3", "Secret Invasion", "Loki Season 2", "The Marvels", "What If…? Season 2", "Echo", "Deadpool & Wolverine", "Agatha All Along", "What If…? Season 3", "Captain America: Brave New World", "Daredevil: Born Again", "Thunderbolts", "Ironheart"],
            6: ["The Fantastic Four: First Steps", "Avengers: Doomsday", "Avengers: Secret Wars"]
        };

        const marvelUniverseChronology = [
          { "title": "Captain America: The First Avenger", "type": "movie", "tmdbId": 1771, "imdbId": "tt0458339", "phase": 1, "not_mcu": false },
          { "title": "Agent Carter (One-Shot)", "type": "one-shot", "tmdbId": 211387, "imdbId": "tt3067038", "phase": 1, "not_mcu": false },
          { "title": "Agent Carter (S1 & S2)", "type": "tv", "tmdbId": 61550, "imdbId": "tt3475734", "phase": 1, "not_mcu": false },
          { "title": "Captain Marvel", "type": "movie", "tmdbId": 299537, "imdbId": "tt4154664", "phase": 1, "not_mcu": false },
          { "title": "X-Men", "type": "movie", "tmdbId": 36657, "imdbId": "tt0120903", "imdbScore": 7.3, "phase": 0, "not_mcu": true },
          { "title": "Iron Man", "type": "movie", "tmdbId": 1726, "imdbId": "tt0371746", "phase": 1, "not_mcu": false },
          { "title": "Iron Man 2", "type": "movie", "tmdbId": 10138, "imdbId": "tt1228705", "phase": 1, "not_mcu": false },
          { "title": "The Incredible Hulk", "type": "movie", "tmdbId": 1724, "imdbId": "tt0800080", "phase": 1, "not_mcu": false },
          { "title": "X2: X-Men United", "type": "movie", "tmdbId": 36658, "imdbId": "tt0290334", "imdbScore": 7.4, "phase": 0, "not_mcu": true },
          { "title": "The Consultant (One-Shot)", "type": "one-shot", "tmdbId": 76122, "imdbId": "tt2011118", "phase": 1, "not_mcu": false },
          { "title": "A Funny Thing Happened on the Way to Thor's Hammer", "type": "one-shot", "tmdbId": 76535, "imdbId": "tt2011109", "phase": 1, "not_mcu": false },
          { "title": "Thor", "type": "movie", "tmdbId": 10195, "imdbId": "tt0800369", "phase": 1, "not_mcu": false },
          { "title": "Fantastic Four", "type": "movie", "tmdbId": 9738, "imdbId": "tt0120667", "imdbScore": 5.7, "phase": 0, "not_mcu": true },
          { "title": "X-Men: The Last Stand", "type": "movie", "tmdbId": 36668, "imdbId": "tt0376994", "imdbScore": 6.7, "phase": 0, "not_mcu": true },
          { "title": "Fantastic Four: Rise of the Silver Surfer", "type": "movie", "tmdbId": 1979, "imdbId": "tt0486576", "imdbScore": 5.6, "phase": 0, "not_mcu": true },
          { "title": "The Avengers", "type": "movie", "tmdbId": 24428, "imdbId": "tt0848228", "phase": 1, "not_mcu": false },
          { "title": "X-Men Origins: Wolverine", "type": "movie", "tmdbId": 2080, "imdbId": "tt0458525", "imdbScore": 6.5, "phase": 0, "not_mcu": true },
          { "title": "X-Men: First Class", "type": "movie", "tmdbId": 49538, "imdbId": "tt1270797", "imdbScore": 7.7, "phase": 0, "not_mcu": true },
          { "title": "Item 47 (One-Shot)", "type": "one-shot", "tmdbId": 119569, "imdbId": "tt2247732", "phase": 2, "not_mcu": false },
          { "title": "The Wolverine", "type": "movie", "tmdbId": 76170, "imdbId": "tt1430132", "imdbScore": 6.2, "phase": 0, "not_mcu": true },
          { "title": "Agents of S.H.I.E.L.D. (S1, E1-7)", "type": "tv", "tmdbId": 1403, "imdbId": "tt2364582", "phase": 2, "not_mcu": false },
          { "title": "Thor: The Dark World", "type": "movie", "tmdbId": 76338, "imdbId": "tt1981115", "phase": 2, "not_mcu": false },
          { "title": "Agents of S.H.I.E.L.D. (S1, E8-16)", "type": "tv", "tmdbId": 1403, "imdbId": "tt2364582", "phase": 2, "not_mcu": false },
          { "title": "Iron Man 3", "type": "movie", "tmdbId": 68721, "imdbId": "tt1300854", "phase": 2, "not_mcu": false },
          { "title": "All Hail the King (One-Shot)", "type": "one-shot", "tmdbId": 253980, "imdbId": "tt3438640", "phase": 2, "not_mcu": false },
          { "title": "Captain America: The Winter Soldier", "type": "movie", "tmdbId": 100402, "imdbId": "tt1843866", "phase": 2, "not_mcu": false },
          { "title": "Agents of S.H.I.E.L.D. (S1, E17-22)", "type": "tv", "tmdbId": 1403, "imdbId": "tt2364582", "phase": 2, "not_mcu": false },
          { "title": "X-Men: Days of Future Past", "type": "movie", "tmdbId": 127585, "imdbId": "tt1877832", "imdbScore": 7.9, "phase": 0, "not_mcu": true },
          { "title": "Guardians of the Galaxy", "type": "movie", "tmdbId": 118340, "imdbId": "tt2015381", "phase": 2, "not_mcu": false },
          { "title": "Guardians of the Galaxy Vol. 2", "type": "movie", "tmdbId": 283995, "imdbId": "tt3896198", "phase": 2, "not_mcu": false },
          { "title": "I Am Groot (S1 & S2)", "type": "tv", "tmdbId": 232125, "imdbId": "tt13623148", "phase": 2, "not_mcu": false },
          { "title": "Fantastic Four", "type": "movie", "tmdbId": 166424, "imdbId": "tt1502712", "imdbScore": 4.3, "phase": 0, "not_mcu": true },
          { "title": "Daredevil (S1)", "type": "tv", "tmdbId": 61889, "imdbId": "tt3322312", "phase": 2, "not_mcu": false },
          { "title": "Agents of S.H.I.E.L.D. (S2, E1-10)", "type": "tv", "tmdbId": 1403, "imdbId": "tt2364582", "phase": 2, "not_mcu": false },
          { "title": "Jessica Jones (S1)", "type": "tv", "tmdbId": 38472, "imdbId": "tt2357547", "phase": 2, "not_mcu": false },
          { "title": "Agents of S.H.I.E.L.D. (S2, E11-19)", "type": "tv", "tmdbId": 1403, "imdbId": "tt2364582", "phase": 2, "not_mcu": false },
          { "title": "Avengers: Age of Ultron", "type": "movie", "tmdbId": 99861, "imdbId": "tt2395427", "phase": 2, "not_mcu": false },
          { "title": "Agents of S.H.I.E.L.D. (S2, E20-22)", "type": "tv", "tmdbId": 1403, "imdbId": "tt2364582", "phase": 2, "not_mcu": false },
          { "title": "Ant-Man", "type": "movie", "tmdbId": 102899, "imdbId": "tt0478970", "phase": 2, "not_mcu": false },
          { "title": "Deadpool", "type": "movie", "tmdbId": 293660, "imdbId": "tt1431045", "imdbScore": 8.0, "phase": 0, "not_mcu": true },
          { "title": "Daredevil (S2)", "type": "tv", "tmdbId": 61889, "imdbId": "tt3322312", "phase": 2, "not_mcu": false },
          { "title": "X-Men: Apocalypse", "type": "movie", "tmdbId": 246655, "imdbId": "tt3385516", "imdbScore": 6.9, "phase": 0, "not_mcu": true },
          { "title": "Luke Cage (S1)", "type": "tv", "tmdbId": 62126, "imdbId": "tt3322314", "phase": 2, "not_mcu": false },
          { "title": "Agents of S.H.I.E.L.D. (S3, E1-19)", "type": "tv", "tmdbId": 1403, "imdbId": "tt2364582", "phase": 3, "not_mcu": false },
          { "title": "Iron Fist (S1)", "type": "tv", "tmdbId": 62127, "imdbId": "tt3322310", "phase": 3, "not_mcu": false },
          { "title": "Captain America: Civil War", "type": "movie", "tmdbId": 271110, "imdbId": "tt3498820", "phase": 3, "not_mcu": false },
          { "title": "Team Thor (One-Shot)", "type": "one-shot", "tmdbId": 413279, "imdbId": "tt6016776", "phase": 3, "not_mcu": false },
          { "title": "Team Thor: Part 2 (One-Shot)", "type": "one-shot", "tmdbId": 441829, "imdbId": "tt6598232", "phase": 3, "not_mcu": false },
          { "title": "Black Widow", "type": "movie", "tmdbId": 497698, "imdbId": "tt3480822", "phase": 3, "not_mcu": false },
          { "title": "Agents of S.H.I.E.L.D. (S3, E20-22)", "type": "tv", "tmdbId": 1403, "imdbId": "tt2364582", "phase": 3, "not_mcu": false },
          { "title": "The Defenders (S1)", "type": "tv", "tmdbId": 62285, "imdbId": "tt4230076", "phase": 3, "not_mcu": false },
          { "title": "Logan", "type": "movie", "tmdbId": 263115, "imdbId": "tt3315342", "imdbScore": 8.1, "phase": 0, "not_mcu": true },
          { "title": "Agents of S.H.I.E.L.D. (S4, E1-6)", "type": "tv", "tmdbId": 1403, "imdbId": "tt2364582", "phase": 3, "not_mcu": false },
          { "title": "Doctor Strange", "type": "movie", "tmdbId": 284052, "imdbId": "tt1211837", "phase": 3, "not_mcu": false },
          { "title": "Black Panther", "type": "movie", "tmdbId": 284054, "imdbId": "tt1825683", "phase": 3, "not_mcu": false },
          { "title": "Agents of S.H.I.E.L.D. (S4, E7-8)", "type": "tv", "tmdbId": 1403, "imdbId": "tt2364582", "phase": 3, "not_mcu": false },
          { "title": "Agents of S.H.I.E.L.D.: Slingshot", "type": "tv", "tmdbId": 69088, "imdbId": "tt6246992", "phase": 3, "not_mcu": false },
          { "title": "Agents of S.H.I.E.L.D. (S4, E9-22)", "type": "tv", "tmdbId": 1403, "imdbId": "tt2364582", "phase": 3, "not_mcu": false },
          { "title": "Spider-Man: Homecoming", "type": "movie", "tmdbId": 315635, "imdbId": "tt2250912", "phase": 3, "not_mcu": false },
          { "title": "Thor: Ragnarok", "type": "movie", "tmdbId": 284053, "imdbId": "tt3501632", "phase": 3, "not_mcu": false },
          { "title": "Team Darryl (One-Shot)", "type": "one-shot", "tmdbId": 505945, "imdbId": "tt7940558", "phase": 3, "not_mcu": false },
          { "title": "Inhumans (S1)", "type": "tv", "tmdbId": 68716, "imdbId": "tt4154858", "phase": 3, "not_mcu": false },
          { "title": "The Punisher (S1)", "type": "tv", "tmdbId": 67178, "imdbId": "tt5675620", "phase": 3, "not_mcu": false },
          { "title": "Runaways (S1)", "type": "tv", "tmdbId": 67466, "imdbId": "tt1236246", "phase": 3, "not_mcu": false },
          { "title": "Agents of S.H.I.E.L.D. (S5, E1-10)", "type": "tv", "tmdbId": 1403, "imdbId": "tt2364582", "phase": 3, "not_mcu": false },
          { "title": "Jessica Jones (S2)", "type": "tv", "tmdbId": 38472, "imdbId": "tt2357547", "phase": 3, "not_mcu": false },
          { "title": "Deadpool 2", "type": "movie", "tmdbId": 383498, "imdbId": "tt5463162", "imdbScore": 7.7, "phase": 0, "not_mcu": true },
          { "title": "Agents of S.H.I.E.L.D. (S5, E11-18)", "type": "tv", "tmdbId": 1403, "imdbId": "tt2364582", "phase": 3, "not_mcu": false },
          { "title": "Cloak & Dagger (S1 & S2)", "type": "tv", "tmdbId": 66190, "imdbId": "tt5614844", "phase": 3, "not_mcu": false },
          { "title": "Luke Cage (S2)", "type": "tv", "tmdbId": 62126, "imdbId": "tt3322314", "phase": 3, "not_mcu": false },
          { "title": "Iron Fist (S2)", "type": "tv", "tmdbId": 62127, "imdbId": "tt3322310", "phase": 3, "not_mcu": false },
          { "title": "Daredevil (S3)", "type": "tv", "tmdbId": 61889, "imdbId": "tt3322312", "phase": 3, "not_mcu": false },
          { "title": "Runaways (S2)", "type": "tv", "tmdbId": 67466, "imdbId": "tt1236246", "phase": 3, "not_mcu": false },
          { "title": "The Punisher (S2)", "type": "tv", "tmdbId": 67178, "imdbId": "tt5675620", "phase": 3, "not_mcu": false },
          { "title": "Jessica Jones (S3)", "type": "tv", "tmdbId": 38472, "imdbId": "tt2357547", "phase": 3, "not_mcu": false },
          { "title": "X-Men: Dark Phoenix", "type": "movie", "tmdbId": 320288, "imdbId": "tt6565702", "imdbScore": 5.7, "phase": 0, "not_mcu": true },
          { "title": "Ant-Man and the Wasp", "type": "movie", "tmdbId": 363088, "imdbId": "tt5095030", "phase": 3, "not_mcu": false },
          { "title": "Avengers: Infinity War", "type": "movie", "tmdbId": 299536, "imdbId": "tt4154756", "phase": 3, "not_mcu": false },
          { "title": "Agents of S.H.I.E.L.D. (S5 - S7)", "type": "tv", "tmdbId": 1403, "imdbId": "tt2364582", "phase": 4, "not_mcu": false },
          { "title": "Runaways (S3)", "type": "tv", "tmdbId": 67466, "imdbId": "tt1236246", "phase": 4, "not_mcu": false },
          { "title": "Avengers: Endgame", "type": "movie", "tmdbId": 299534, "imdbId": "tt4154796", "phase": 4, "not_mcu": false },
          { "title": "Spider-Man: Far From Home", "type": "movie", "tmdbId": 429617, "imdbId": "tt6320628", "phase": 4, "not_mcu": false },
          { "title": "The New Mutants", "type": "movie", "tmdbId": 340102, "imdbId": "tt4682266", "imdbScore": 5.3, "phase": 0, "not_mcu": true },
          { "title": "WandaVision", "type": "tv", "tmdbId": 85271, "imdbId": "tt9140560", "phase": 4, "not_mcu": false },
          { "title": "The Falcon and the Winter Soldier", "type": "tv", "tmdbId": 88396, "imdbId": "tt9208876", "phase": 4, "not_mcu": false },
          { "title": "Loki (S1)", "type": "tv", "tmdbId": 84958, "imdbId": "tt9140554", "phase": 4, "not_mcu": false },
          { "title": "What If...? (S1)", "type": "tv", "tmdbId": 91363, "imdbId": "tt10168312", "phase": 4, "not_mcu": false },
          { "title": "Shang-Chi and the Legend of the Ten Rings", "type": "movie", "tmdbId": 566525, "imdbId": "tt9376612", "phase": 4, "not_mcu": false },
          { "title": "Eternals", "type": "movie", "tmdbId": 524434, "imdbId": "tt9032400", "phase": 4, "not_mcu": false },
          { "title": "Hawkeye", "type": "tv", "tmdbId": 88329, "imdbId": "tt10160804", "phase": 4, "not_mcu": false },
          { "title": "Spider-Man: No Way Home", "type": "movie", "tmdbId": 634649, "imdbId": "tt10872600", "phase": 4, "not_mcu": false },
          { "title": "Moon Knight", "type": "tv", "tmdbId": 92749, "imdbId": "tt10234724", "phase": 4, "not_mcu": false },
          { "title": "Doctor Strange in the Multiverse of Madness", "type": "movie", "tmdbId": 453395, "imdbId": "tt9419884", "phase": 4, "not_mcu": false },
          { "title": "Ms. Marvel", "type": "tv", "tmdbId": 92782, "imdbId": "tt10857164", "phase": 4, "not_mcu": false },
          { "title": "Thor: Love and Thunder", "type": "movie", "tmdbId": 616037, "imdbId": "tt10648342", "phase": 4, "not_mcu": false },
          { "title": "She-Hulk: Attorney at Law", "type": "tv", "tmdbId": 92783, "imdbId": "tt10857160", "phase": 4, "not_mcu": false },
          { "title": "Werewolf by Night", "type": "movie", "tmdbId": 15318872, "imdbId": "tt15318878", "phase": 4, "not_mcu": false },
          { "title": "Black Panther: Wakanda Forever", "type": "movie", "tmdbId": 505642, "imdbId": "tt9114286", "phase": 4, "not_mcu": false },
          { "title": "The Guardians of the Galaxy Holiday Special", "type": "movie", "tmdbId": 774752, "imdbId": "tt13623136", "phase": 4, "not_mcu": false },
          { "title": "Ant-Man and the Wasp: Quantumania", "type": "movie", "tmdbId": 640146, "imdbId": "tt10954600", "phase": 5, "not_mcu": false },
          { "title": "Guardians of the Galaxy Vol. 3", "type": "movie", "tmdbId": 447365, "imdbId": "tt6791350", "phase": 5, "not_mcu": false },
          { "title": "Secret Invasion", "type": "tv", "tmdbId": 114472, "imdbId": "tt13157618", "phase": 5, "not_mcu": false },
          { "title": "Loki (S2)", "type": "tv", "tmdbId": 84958, "imdbId": "tt9140554", "phase": 5, "not_mcu": false },
          { "title": "The Marvels", "type": "movie", "tmdbId": 609681, "imdbId": "tt10676048", "phase": 5, "not_mcu": false },
          { "title": "What If…? Season 2", "type": "tv", "tmdbId": 91363, "imdbId": "tt10168312", "phase": 5, "not_mcu": false },
          { "title": "Echo", "type": "tv", "tmdbId": 122226, "imdbId": "tt13966962", "phase": 5, "not_mcu": false },
          { "title": "Deadpool & Wolverine", "type": "movie", "tmdbId": 533535, "imdbId": "tt6263850", "imdbScore": 7.7, "phase": 0, "not_mcu": true },
          { "title": "Agatha All Along", "type": "tv", "tmdbId": 138501, "imdbId": "tt14552042", "phase": 5, "not_mcu": false },
          { "title": "Ironheart", "type": "tv", "tmdbId": 114471, "imdbId": "tt13622776", "phase": 5, "not_mcu": false },
          { "title": "Daredevil: Born Again", "type": "tv", "tmdbId": 202555, "imdbId": "tt20934948", "phase": 5, "not_mcu": false },
          { "title": "What If…? Season 3", "type": "tv", "tmdbId": 91363, "imdbId": "tt10168312", "phase": 5, "not_mcu": false },
          { "title": "Captain America: Brave New World", "type": "movie", "tmdbId": 822119, "imdbId": "tt14510208", "phase": 5, "not_mcu": false },
          { "title": "Thunderbolts", "type": "movie", "tmdbId": 986056, "imdbId": "tt20969586", "phase": 5, "not_mcu": false },
          { "title": "The Fantastic Four: First Steps", "type": "movie", "tmdbId": 617126, "imdbId": "tt10676052", "phase": 6, "not_mcu": false },
          { "title": "Spider-Man: Brand New Day", "type": "movie", "tmdbId": 969681, "imdbId": "tt22084616", "phase": 6, "not_mcu": false },
          { "title": "Avengers: Doomsday", "type": "movie", "tmdbId": 1003596, "imdbId": "tt21357150", "phase": 6, "not_mcu": false },
          { "title": "Avengers: Secret Wars", "type": "movie", "tmdbId": 1003598, "imdbId": "tt21361444", "phase": 6, "not_mcu": false }
        ];


        async function setupMarathonListener() {
            if (unsubscribe) unsubscribe();
            const marathonRef = doc(db, "marathon-data", appId);
            unsubscribe = onSnapshot(marathonRef, (docSnap) => {
                // Check if the data exists and has at least the number of items we expect
                if (docSnap.exists() && docSnap.data().items && docSnap.data().items.length >= marvelUniverseChronology.length) {
                    marathonState = docSnap.data();
                    renderUI();
                    if (factInterval) {
                        clearInterval(factInterval);
                        factInterval = null;
                    }
                    document.getElementById('loading-spinner').style.display = 'none';
                } else if (!isInitializing) { // If it doesn't exist or is incomplete, initialize it
                    initializeNewMarathon(marathonRef);
                }
            }, (error) => {
                console.error("Error listening to marathon state:", error);
                document.getElementById('loading-spinner').innerText = "Error fetching data.";
            });
        }

        async function initializeNewMarathon(docRef) {
            isInitializing = true;
            document.getElementById('loading-spinner').style.display = 'flex';
            console.log("INITIALIZING MARATHON! Force Refresh: " + shouldRefreshCache);
            
            const detailsList = await Promise.all(marvelUniverseChronology.map(item => getTMDbDetailsWithCache(item, shouldRefreshCache)));
            
            const initialState = {
                items: marvelUniverseChronology.map((item, index) => {
                    const details = detailsList[index];
                    const effectiveDetails = details || {};

                    let finalRuntime = 0;
                    if (effectiveDetails.runtime) {
                        finalRuntime = effectiveDetails.runtime;
                    } else if (Array.isArray(effectiveDetails.episode_run_time) && effectiveDetails.episode_run_time.length > 0) {
                        finalRuntime = effectiveDetails.episode_run_time[0];
                    } else if (item.type === 'one-shot') {
                        finalRuntime = 10;
                    } else {
                        finalRuntime = 45;
                    }
                    
                    return {
                        id: index,
                        tmdbId: item.tmdbId || null,
                        imdbId: item.imdbId || null,
                        title: item.title,
                        type: item.type,
                        not_mcu: item.not_mcu || false,
                        phase: item.phase || null,
                        poster_path: effectiveDetails.poster_path || null,
                        backdrop_path: effectiveDetails.backdrop_path || null,
                        release_date: effectiveDetails.release_date || effectiveDetails.first_air_date || 'N/A',
                        runtime: finalRuntime,
                        vote_average: effectiveDetails.vote_average || 0,
                        overview: effectiveDetails.overview || 'No overview available.',
                        genres: effectiveDetails.genres || [],
                        watched: false,
                        rejected: false, // Add the new 'rejected' field
                        ratings: { user1: null, user2: null },
                        notes: { user1: "", user2: "" },
                        jarvisSummary: null,
                        nextUpHype: null,
                        favoritedBy: []
                    };
                })
            };
            
            try {
                const initialStateWithAuth = { ...initialState, authKey: SECRET_KEY };
                await setDoc(docRef, initialStateWithAuth);
                console.log("Successfully initialized new marathon data.");
                if (shouldRefreshCache) {
                    window.location.href = window.location.pathname;
                }
            } catch (error) {
                console.error("Firebase setDoc failed:", error);
                 document.getElementById('loading-spinner').innerHTML = `Failed to save initial data. <br>Error: ${error.message}. <br>Please check console for details.`;
            }
            
            isInitializing = false;
        }

        async function getTMDbDetailsWithCache(item, forceRefresh = false) {
             if (!item.tmdbId) {
                return { title: item.title, runtime: 10 };
            }
            const cacheRef = doc(db, "tmdb-cache", `${item.tmdbId}`);

            if (!forceRefresh) {
                try {
                    const docSnap = await getDoc(cacheRef);
                    if (docSnap.exists()) {
                        return docSnap.data();
                    }
                } catch (e) { console.error("Cache read failed:", e); }
            }
            
            const details = await fetchTMDbDetails(item.tmdbId, item.type);
            if (details) {
                try {
                    const detailsWithAuth = { ...details, authKey: SECRET_KEY };
                    await setDoc(cacheRef, detailsWithAuth);
                } catch (e) { console.error("Cache write failed:", e); }
            }
            return details;
        }
        
        async function fetchTMDbDetails(id, type) {
            if (!TMDB_API_KEY) return null;
            const endpoint = (type === 'movie' || type === 'one-shot') ? 'movie' : 'tv';
            const url = `https://api.themoviedb.org/3/${endpoint}/${id}?api_key=${TMDB_API_KEY}`;
            try {
                const res = await fetch(url);
                if (!res.ok) return null;
                return await res.json();
            } catch (e) {
                return null;
            }
        }

        async function fetchTMDbImages(id, type) {
            if (!TMDB_API_KEY) return null;
            const endpoint = (type === 'movie' || type === 'one-shot') ? 'movie' : 'tv';
            const url = `https://api.themoviedb.org/3/${endpoint}/${id}/images?api_key=${TMDB_API_KEY}`;
            try {
                const res = await fetch(url);
                if (!res.ok) return null;
                return await res.json();
            } catch (e) {
                return null;
            }
        }

        async function fetchTMDbReleaseDates(id) {
            if (!TMDB_API_KEY) return null;
            const url = `https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${TMDB_API_KEY}`;
            try {
                const res = await fetch(url);
                if (!res.ok) return null;
                return await res.json();
            } catch (e) {
                return null;
            }
        }

        async function updateFirestoreState() {
            if (!userId) return;
            const marathonRef = doc(db, "marathon-data", appId);
    const stateWithAuth = { ...marathonState, authKey: SECRET_KEY };
    await setDoc(marathonRef, stateWithAuth, { merge: true });
        }

        function renderUI() {
            if (!marathonState || !marathonState.items) return;

            let itemsToRender = marathonState.items;

            if (currentFilter === 'movie') {
                itemsToRender = itemsToRender.filter(item => item.type === 'movie');
            } else if (currentFilter === 'tv') {
                itemsToRender = itemsToRender.filter(item => ['tv', 'one-shot'].includes(item.type));
            }

            if (currentFilter !== 'tv' && !showOnlyNonMCU) {
                itemsToRender = itemsToRender.filter(item => !item.not_mcu);
            }
            
            const filteredItems = itemsToRender;

            if (currentView === 'grid') {
                renderGridView(filteredItems);
                document.getElementById('movie-grid').classList.remove('hidden');
                document.getElementById('movie-list').classList.add('hidden');
            } else {
                renderListView(filteredItems);
                document.getElementById('movie-grid').classList.add('hidden');
                document.getElementById('movie-list').classList.remove('hidden');
            }
            updateStats();
            if (userSettings.nextUpWallpaperEnabled) {
                updateNextUpWallpaper();
            }
        }

        function renderGridView(items) {
            const gridEl = document.getElementById('movie-grid');
            gridEl.innerHTML = items.map(item => {
                const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : `https://placehold.co/500x750/1f2937/ef4444?text=${encodeURIComponent(item.title)}`;
                let overlayClass = '';
                if (item.watched) {
                    overlayClass = 'watched';
                } else if (item.rejected) {
                    overlayClass = 'rejected';
                }
                let overlayIcon = '';
                if (item.watched) {
                    overlayIcon = 'fa-check-circle text-green-500';
                } else if (item.rejected) {
                    overlayIcon = 'fa-times-circle text-red-500';
                }
                let favoriteClass = '';
                if (item.favoritedBy) {
                    if (item.favoritedBy.includes('user1') && item.favoritedBy.includes('user2')) {
                        favoriteClass = 'super-favorite-glow glossy-overlay';
                    } else if (item.favoritedBy.length > 0) {
                        favoriteClass = 'favorite-glow';
                    }
                } else {
                    favoriteClass = '';
                }

                let moodEmojis = '';
                if (item.moods) {
                    const user1Mood = item.moods.user1;
                    const user2Mood = item.moods.user2;
                    if (user1Mood) {
                        moodEmojis += `<div class="mood-emoji-container" data-user="Juainny" data-mood="${user1Mood.name}" data-movie="${item.title}"><img src="/moods/${user1Mood.image}" alt="${user1Mood.name}" class="w-8 h-8"></div>`;
                    }
                    if (user2Mood) {
                        moodEmojis += `<div class="mood-emoji-container" data-user="Erick" data-mood="${user2Mood.name}" data-movie="${item.title}"><img src="/moods/${user2Mood.image}" alt="${user2Mood.name}" class="w-8 h-8"></div>`;
                    }
                }

                return `
                    <div data-item-id="${item.id}" class="movie-card relative rounded-lg overflow-hidden cursor-pointer shadow-lg transition-transform duration-200 ${overlayClass} ${favoriteClass}" onclick="openModal(${item.id})">
                        <div class="emoji-banner absolute top-0 left-0 w-full h-12 bg-transparent z-10 flex justify-between items-center px-2">${moodEmojis}</div>
                        <img src="${posterUrl}" alt="${item.title}" class="w-full h-full object-cover" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/500x750/1f2937/ef4444?text=No+Poster';">
                        <div class="absolute inset-0 bg-black bg-opacity-50" style="opacity: ${item.watched || item.rejected ? 0.7 : 0}; transition: opacity 0.3s;"></div>
                        <div class="status-overlay absolute inset-0 flex justify-center items-center">
                            <i class="fas ${overlayIcon} fa-4x"></i>
                        </div>
                        ${!item.poster_path ? `
                         <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                            <h3 class="font-bold text-sm text-white text-shadow-lg">${item.title}</h3>
                        </div>` : ''}
                    </div>`;
            }).join('');
        }

        function renderListView(items) {
            const listEl = document.getElementById('movie-list');
            listEl.innerHTML = items.map(item => {
                const avgRating = item.ratings ? (Object.values(item.ratings).filter(r => r !== null).reduce((a, b) => a + b, 0) / Object.values(item.ratings).filter(r => r !== null).length) || 0 : 0;
                let ratingStars = '';
                for (let i = 1; i <= 10; i++) {
                    if (avgRating >= i) {
                        ratingStars += '<i class="fa-solid fa-star"></i>';
                    } else if (avgRating === i - 0.5) {
                        ratingStars += '<i class="fa-solid fa-star-half-alt"></i>';
                    } else {
                        ratingStars += '<i class="fa-regular fa-star"></i>';
                    }
                }
                let rowClass = 'opacity-100';
                if (item.watched) rowClass = 'opacity-50';
                if (item.rejected) rowClass = 'opacity-50 rejected-list-item';
                let favoriteClass = '';
                if (item.favoritedBy) {
                    if (item.favoritedBy.includes('user1') && item.favoritedBy.includes('user2')) {
                        favoriteClass = 'super-favorite-glow glossy-overlay';
                    } else if (item.favoritedBy.length > 0) {
                        favoriteClass = 'favorite-glow';
                    }
                } else {
                    favoriteClass = '';
                }
                return `
                <div data-item-id="${item.id}" class="bg-gray-800 rounded-lg p-3 flex items-center gap-4 transition-opacity ${rowClass} ${favoriteClass}">
                    <div class="flex-shrink-0 w-10 text-center">
                        <input type="checkbox" ${item.watched ? 'checked' : ''} ${item.rejected ? 'disabled' : ''} class="w-6 h-6 rounded bg-gray-700 border-gray-600 text-red-600 focus:ring-red-500 cursor-pointer" onchange="toggleWatchedStatus(${item.id}, this.checked)">
                    </div>
                    <div class="flex-grow">
                        <p class="font-bold">${item.rejected ? `<s>${item.title}</s>` : item.title}</p>
                        <p class="text-sm text-gray-400">${item.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="star-container text-lg" title="Average Rating: ${avgRating.toFixed(1)}">${ratingStars}</div>
                        <button class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm font-semibold" onclick="openModal(${item.id})">Details</button>
                    </div>
                </div>`;
            }).join('');
        }

        function updateStats() {
            if (!marathonState.items || marathonState.items.length === 0) return;
            const itemsToConsider = marathonState.items.filter(item => {
                if (currentFilter === 'all') return true;
                if (currentFilter === 'tv') return ['tv', 'one-shot'].includes(item.type);
                return item.type === currentFilter;
            });
            const watchedItems = itemsToConsider.filter(i => i.watched);
            const totalRuntime = itemsToConsider.reduce((sum, i) => sum + (i.runtime || 0), 0);
            const watchedRuntime = watchedItems.reduce((sum, i) => sum + (i.runtime || 0), 0);
            const percentage = itemsToConsider.length > 0 ? Math.round((watchedItems.length / itemsToConsider.length) * 100) : 0;
            
            document.getElementById('hours-watched').textContent = formatTime(watchedRuntime);
            document.getElementById('hours-left').textContent = formatTime(totalRuntime - watchedRuntime);
            document.getElementById('movies-watched').textContent = `${watchedItems.length} / ${itemsToConsider.length}`;
            document.getElementById('progress-bar').style.width = `${percentage}%`;
            document.getElementById('progress-percent').textContent = `${percentage}%`;

            updateNextUpTeaser(itemsToConsider);
            updateExtendedStats(itemsToConsider);
            if (userSettings.nextUpWallpaperEnabled) {
                updateNextUpWallpaper();
            }
        }

        function updateNextUpTeaser(items) {
            let potentialNextItems = items.filter(item => !item.watched && !item.rejected);

            if (currentFilter === 'movie') {
                potentialNextItems = potentialNextItems.filter(item => item.type === 'movie');
            } else if (currentFilter === 'tv') {
                potentialNextItems = potentialNextItems.filter(item => ['tv', 'one-shot'].includes(item.type));
            }

            if (!showOnlyNonMCU) {
                potentialNextItems = potentialNextItems.filter(item => !item.not_mcu);
            }

            const nextItem = potentialNextItems[0];
            const teaserEl = document.getElementById('next-up-teaser');
            const hypeEl = document.getElementById('next-up-hype');

            if (nextItem) {
                nextUpId = nextItem.id;
                if (lastNextUpId === nextUpId) return;
                lastNextUpId = nextUpId;

                const posterUrl = nextItem.poster_path ? `https://image.tmdb.org/t/p/w500${nextItem.poster_path}` : `https://placehold.co/500x750/1f2937/ef4444?text=${encodeURIComponent(nextItem.title)}`;
                document.getElementById('next-up-poster').src = posterUrl;
                document.getElementById('next-up-title').textContent = nextItem.title;
                document.getElementById('next-up-runtime').textContent = formatTime(nextItem.runtime || 0);
                
                if (userSettings.aiDisabled) {
                    hypeEl.textContent = nextItem.overview;
                    document.getElementById('next-up-refresh-btn').style.display = 'none';
                    document.querySelector('#next-up-teaser img[alt="Jarvis"]').style.display = 'none';
                    teaserEl.classList.remove('hidden');
                    return;
                } else {
                    document.querySelector('#next-up-teaser img[alt="Jarvis"]').style.display = 'inline-block';
                }

                const generateAndSetHype = async (force = false) => {
                    hypeEl.innerHTML = 'Jarvis is thinking...';
                    const hypeSentence = await getOrGenerateHypeSentence(nextItem, force);
                    hypeEl.innerHTML = parseMarkdown(hypeSentence);
                };

                generateAndSetHype();

                const refreshBtn = document.getElementById('next-up-refresh-btn');
                let isCoolingDown = false;
                refreshBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (isCoolingDown) {
                        hypeEl.textContent = 'Jarvis is cooling down...';
                        return;
                    }
                    generateAndSetHype(true);
                    if (!userSettings.quotaConservation) {
                        isCoolingDown = true;
                        setTimeout(() => {
                            isCoolingDown = false;
                        }, 2000);
                    }
                };
                refreshBtn.style.display = 'inline-block';
                
                teaserEl.classList.remove('hidden');
            } else {
                nextUpId = null;
                lastNextUpId = null;
                teaserEl.classList.add('hidden');
            }
        }

        function updateExtendedStats(items) {
            const extendedStatsEl = document.getElementById('extended-stats');
            const phaseProgress = {};

            for (const phase in marvelPhases) {
                const phaseTitles = marvelPhases[phase];
                const phaseItems = items.filter(item => phaseTitles.includes(item.title));
                const watchedPhaseItems = phaseItems.filter(item => item.watched);
                const percentage = phaseItems.length > 0 ? Math.round((watchedPhaseItems.length / phaseItems.length) * 100) : 0;

                if (phaseItems.length > 0) {
                    phaseProgress[phase] = {
                        percentage,
                        watched: watchedPhaseItems.length,
                        total: phaseItems.length,
                    };
                }
            }

            extendedStatsEl.innerHTML = Object.entries(phaseProgress).map(([phase, progress]) => `
                <div class="mb-4">
                    <div class="flex justify-between items-center mb-1">
                        <span class="font-semibold text-text-primary">Phase ${phase}</span>
                        <span class="text-sm text-text-muted">${progress.watched} / ${progress.total}</span>
                    </div>
                    <div class="w-full bg-bg-tertiary rounded-full h-2.5">
                        <div class="bg-accent-primary h-2.5 rounded-full" style="width: ${progress.percentage}%"></div>
                    </div>
                </div>
            `).join('');
        }
        
        function formatTime(totalMinutes) {
            if (isNaN(totalMinutes) || totalMinutes < 0) return '0h 0m';
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${hours}h ${minutes}m`;
        }

        const modalElements = {
            modal: document.getElementById('movie-modal'),
            backdrop: document.getElementById('modal-backdrop-image'),
            logoContainer: document.getElementById('modal-logo-container'),
            title: document.getElementById('modal-title'),
            releaseYear: document.getElementById('modal-release-year'),
            contentRating: document.getElementById('modal-content-rating'),
            runtime: document.getElementById('modal-runtime'),
            overview: document.getElementById('modal-overview'),
            imdbLink: document.getElementById('modal-imdb-link'),
            score: document.getElementById('modal-score'),
            toggleWatchedBtn: document.getElementById('toggle-watched-btn'),
            toggleRejectedBtn: document.getElementById('toggle-rejected-btn'),
            juainnyRating: document.getElementById('juainny-rating'),
            erickRating: document.getElementById('erick-rating'),
            removeRatingBtn: document.getElementById('remove-rating-btn'),
            notesSection: document.getElementById('notes-section'),
            juainnyNotes: document.getElementById('juainny-notes'),
            erickNotes: document.getElementById('erick-notes'),
            jarvisSection: document.getElementById('jarvis-summary-section'),
            jarvisSummaryText: document.getElementById('jarvis-summary-text'),
            addMoodBtn: document.getElementById('add-mood-btn'),
            moodDisplay: document.getElementById('modal-mood-display'),
            favoriteBtn: document.getElementById('favorite-btn')
        };

        function getScrollbarWidth() {
            return window.innerWidth - document.documentElement.clientWidth;
        }

        window.closeModal = () => {
            document.body.style.paddingRight = '';
            document.body.classList.remove('body-no-scroll');
            modalElements.modal.classList.add('modal-hidden');
            currentModalId = null;
        }

        let startTime = new Date();

        function updateEndTime(runtime) {
            const endTimeCalculator = document.getElementById('end-time-calculator');
            if (!endTimeCalculator) return;

            const hourSpan = document.getElementById('start-time-hour');
            const minuteSpan = document.getElementById('start-time-minute');
            const endTimeSpan = document.getElementById('end-time');

            const end = new Date(startTime.getTime() + runtime * 60000);

            hourSpan.textContent = String(startTime.getHours()).padStart(2, '0');
            minuteSpan.textContent = String(startTime.getMinutes()).padStart(2, '0');
            endTimeSpan.textContent = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
        }

        window.openModal = async (itemId) => {
            currentModalId = itemId;
            const item = marathonState.items.find(i => i.id === itemId);
            if (!item) return;

            console.log('Opening modal for item:', item.title);

            const modalContent = modalElements.modal.querySelector('.movie-modal-content');
            const ironManWalker = document.getElementById('iron-man-walker');
            const backdropGradient = modalElements.modal.querySelector('.bg-gradient-to-t');
            if (modalContent) {
                modalContent.classList.remove('endgame-theme');
                if(backdropGradient) backdropGradient.classList.remove('endgame-gradient');
                ironManWalker.classList.add('hidden');
                ironManWalker.classList.remove('walk');
                if (item.title === 'Avengers: Endgame') {
                    modalContent.classList.add('endgame-theme');
                    if(backdropGradient) backdropGradient.classList.add('endgame-gradient');
                    snapSound.play();
                    ironManWalker.classList.remove('hidden');
                    ironManWalker.classList.add('walk');
                }
            }
            console.log('Item genres:', item.genres);

            // --- Fetch additional data ---
            const [images, releaseDates] = await Promise.all([
                fetchTMDbImages(item.tmdbId, item.type),
                item.type === 'movie' ? fetchTMDbReleaseDates(item.tmdbId) : Promise.resolve(null)
            ]);

            const englishLogo = images?.logos?.find(logo => logo.iso_639_1 === 'en');
            const logoToUse = englishLogo || images?.logos?.[0];

            const usRelease = releaseDates?.results?.find(r => r.iso_3166_1 === 'US');
            const certification = usRelease?.release_dates[0]?.certification || 'N/A';

            // --- Preload images ---
            const backdropUrl = item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : 'https://placehold.co/1280x720/111827/ef4444?text=Image+Not+Found';
            const preloadImage = (url, callback) => {
                const img = new Image();
                img.src = url;
                img.onload = () => callback(img);
                img.onerror = () => callback(null); // Pass null on error
            };

            preloadImage(backdropUrl, (img) => {
                // Use requestAnimationFrame to ensure smooth UI updates
                requestAnimationFrame(() => {
                    modalElements.backdrop.src = img ? backdropUrl : 'https://placehold.co/1280x720/111827/ef4444?text=Image+Not+Found';

                    // --- Logo and Title ---
                    modalElements.title.textContent = item.title; // Always set the title for accessibility
                    if (logoToUse) {
                        const logoUrl = `https://image.tmdb.org/t/p/original${logoToUse.file_path}`;
                        modalElements.logoContainer.innerHTML = `<img src="${logoUrl}" alt="${item.title} Logo" class="max-h-24" style="filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.9));">`;
                        modalElements.title.classList.add('hidden'); // Hide text title if logo is present
                    } else {
                        modalElements.logoContainer.innerHTML = ''; // Clear any previous logo
                        modalElements.title.classList.remove('hidden');
                    }

                    // --- Info Pills ---
                    modalElements.releaseYear.textContent = (item.release_date || 'N/A').split('-')[0];
                    modalElements.runtime.textContent = formatTime(item.runtime || 0);
                    modalElements.contentRating.textContent = certification;

                    const infoPill = modalElements.releaseYear.parentElement;

                    // Remove old genres to avoid duplication on re-renders
                    infoPill.querySelectorAll('.genre').forEach(el => el.remove());
                    infoPill.querySelectorAll('.genre-separator').forEach(el => el.remove());

                    if (item.genres && item.genres.length > 0) {
                        item.genres.slice(0, 2).forEach(genre => {
                            const separator = document.createElement('span');
                            separator.className = 'genre-separator';
                            separator.textContent = ' • ';
                            infoPill.appendChild(separator);

                            const genreEl = document.createElement('span');
                            genreEl.className = 'genre';
                            genreEl.textContent = genre.name;
                            infoPill.appendChild(genreEl);
                        });
                    }

                    document.getElementById('title-tooltip').setAttribute('title', item.title);

                    // --- Overview and Links ---
                    modalElements.overview.textContent = item.overview || 'No overview available.';
                    startTime = new Date();
                    updateEndTime(item.runtime);

                    const endTimeCalculator = document.getElementById('end-time-calculator');
                    if (item.watched) {
                        endTimeCalculator.classList.add('hidden');
                    } else {
                        endTimeCalculator.classList.remove('hidden');
                    }

                    modalElements.imdbLink.href = `https://www.imdb.com/title/${item.imdbId}/`;
                    modalElements.score.textContent = item.vote_average ? `${item.vote_average.toFixed(1)} / 10` : 'N/A';

                    // --- Buttons and Toggles ---
                    modalElements.toggleWatchedBtn.textContent = item.watched ? 'Unwatch' : 'Mark as Watched';
                    modalElements.toggleWatchedBtn.className = `w-full text-text-primary font-bold py-3 px-4 rounded-lg transition ${item.watched ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-success hover:opacity-80'}`;

                    modalElements.toggleRejectedBtn.innerHTML = item.rejected ? 'Undo Reject' : '<i class="fas fa-times"></i>';
                    modalElements.toggleRejectedBtn.className = `w-[30%] text-text-primary font-bold py-3 px-4 rounded-lg transition ${item.rejected ? 'bg-bg-tertiary hover:opacity-80' : 'bg-danger hover:opacity-80'}`;

                    // --- Ratings ---
                    if (!item.ratings) item.ratings = { user1: null, user2: null };
                    updateRatingStars('juainny-rating', item.ratings.user1);
                    updateRatingStars('erick-rating', item.ratings.user2);
                    document.getElementById('juainny-rating-input').value = item.ratings.user1;
                    document.getElementById('erick-rating-input').value = item.ratings.user2;
                    modalElements.removeRatingBtn.classList.toggle('hidden', !item.ratings.user1 && !item.ratings.user2);

                    // --- Notes and Jarvis ---
                    const removeMoodBtn = document.getElementById('remove-mood-btn');
                    removeMoodBtn.classList.toggle('hidden', !item.moods || (!item.moods.user1 && !item.moods.user2));

                    if (item.watched) {
                        modalElements.notesSection.classList.remove('hidden');
                        modalElements.juainnyNotes.value = item.notes?.user1 || '';
                        modalElements.erickNotes.value = item.notes?.user2 || '';

                        if (userSettings.aiDisabled) {
                            modalElements.jarvisSection.classList.add('hidden');
                        } else {
                            modalElements.jarvisSection.classList.remove('hidden');
                            updateJarvisSummary(item);
                            document.getElementById('jarvis-summary-refresh-btn').onclick = () => {
                                updateJarvisSummary(item, true);
                            };
                        }
                    } else {
                        modalElements.notesSection.classList.add('hidden');
                        modalElements.jarvisSection.classList.add('hidden');
                    }

                    // --- Final UI updates ---
                    updateFavoriteButton(item);
                    updateMoodDisplay(item);
                    const scrollbarWidth = getScrollbarWidth();
                    document.body.style.paddingRight = `${scrollbarWidth}px`;
                    document.body.classList.add('body-no-scroll');
                    modalElements.modal.classList.remove('hidden');
                    modalElements.modal.classList.remove('modal-hidden');
                });
            });
        }

        async function updateJarvisSummary(item, force = false) {
            const summaryEl = document.getElementById('jarvis-summary-text');
            if (!summaryEl) return;

            if (!force && item.jarvisSummary) {
                summaryEl.innerHTML = parseMarkdown(item.jarvisSummary);
                return;
            }

            summaryEl.innerHTML = '<i>Jarvis is thinking...</i>';

            const summary = await generateJarvisSummary(item.title, item.ratings, item.notes, item.moods);
            const itemIndex = marathonState.items.findIndex(i => i.id === item.id);
            if (itemIndex > -1) {
                marathonState.items[itemIndex].jarvisSummary = summary;
                updateFirestoreState();
            }
            summaryEl.innerHTML = parseMarkdown(summary);
        }

        function renderItem(item) {
            const container = document.querySelector(`[data-item-id="${item.id}"]`);
            if (!container) return;

            if (currentView === 'grid') {
                const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : `https://placehold.co/500x750/1f2937/ef4444?text=${encodeURIComponent(item.title)}`;
                const overlayClass = item.watched ? 'watched' : (item.rejected ? 'rejected' : '');
                const overlayIcon = item.watched ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-500';

                container.innerHTML = `
                        <img src="${posterUrl}" alt="${item.title}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='https://placehold.co/500x750/1f2937/ef4444?text=No+Poster';">
                        <div class="absolute inset-0 bg-black bg-opacity-50" style="opacity: ${item.watched || item.rejected ? 0.7 : 0}; transition: opacity 0.3s;"></div>
                        <div class="status-overlay absolute inset-0 flex justify-center items-center">
                            <i class="fas ${overlayIcon} fa-4x"></i>
                        </div>
                         <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                            <h3 class="font-bold text-sm text-white text-shadow-lg">${item.title}</h3>
                        </div>`;
                container.className = `movie-card relative rounded-lg overflow-hidden cursor-pointer shadow-lg transition-transform duration-200 ${overlayClass}`;
            } else {
                const avgRating = item.ratings ? (Object.values(item.ratings).filter(r => r !== null).reduce((a, b) => a + b, 0) / Object.values(item.ratings).filter(r => r !== null).length) || 0 : 0;
                const ratingStars = [...Array(10)].map((_, i) => `<i class="fa-${avgRating > i ? 'solid' : 'regular'} fa-star"></i>`).join('');
                let rowClass = 'opacity-100';
                if (item.watched) rowClass = 'opacity-50';
                if (item.rejected) rowClass = 'opacity-50 rejected-list-item';

                container.innerHTML = `
                    <div class="flex-shrink-0 w-10 text-center">
                        <input type="checkbox" ${item.watched ? 'checked' : ''} ${item.rejected ? 'disabled' : ''} class="w-6 h-6 rounded bg-gray-700 border-gray-600 text-red-600 focus:ring-red-500 cursor-pointer" onchange="toggleWatchedStatus(${item.id}, this.checked)">
                    </div>
                    <div class="flex-grow">
                        <p class="font-bold">${item.rejected ? `<s>${item.title}</s>` : item.title}</p>
                        <p class="text-sm text-gray-400">${item.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="text-yellow-400 text-lg" title="Average Rating: ${avgRating.toFixed(1)}">${ratingStars}</div>
                        <button class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm font-semibold" onclick="openModal(${item.id})">Details</button>
                    </div>`;
                container.className = `bg-gray-800 rounded-lg p-3 flex items-center gap-4 transition-opacity ${rowClass}`;
            }
        }

        window.closeModal = () => {
            document.body.classList.remove('body-no-scroll');
            modalElements.modal.classList.add('modal-hidden');
            currentModalId = null;
        }

        function updateCard(item) {
            const card = document.querySelector(`.movie-card[data-item-id="${item.id}"]`);
            if (card) {
                const overlayClass = item.watched ? 'watched' : (item.rejected ? 'rejected' : '');
                card.className = `movie-card relative rounded-lg overflow-hidden cursor-pointer shadow-lg transition-transform duration-200 ${overlayClass}`;
                const overlay = card.querySelector('.bg-black');
                overlay.style.opacity = item.watched || item.rejected ? 0.7 : 0;
                const icon = card.querySelector('.status-overlay i');
                icon.className = `fas ${item.watched ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-500'} fa-4x`;
            }
        }

        window.toggleWatchedStatus = (itemId, isChecked, fromModal = false) => {
            const itemIndex = marathonState.items.findIndex(i => i.id === itemId);
            if (itemIndex > -1) {
                const item = marathonState.items[itemIndex];
                item.watched = typeof isChecked === 'boolean' ? isChecked : !item.watched;
                if (item.watched) {
                    item.rejected = false; // Cannot be watched and rejected
                    item.watched_timestamp = new Date().toISOString();
                } else {
                    // Also clear timestamp when un-watching
                    item.watched_timestamp = null;
                }
                updateCard(item);
                updateStats();
                document.getElementById('save-banner').classList.remove('hidden');
                if (fromModal) {
                    openModal(itemId); // Re-open to refresh the state
                } else if (currentModalId === itemId) {
                    closeModal();
                }
            }
        }

        window.toggleRejectedStatus = (itemId) => {
            const itemIndex = marathonState.items.findIndex(i => i.id === itemId);
            if (itemIndex > -1) {
                const item = marathonState.items[itemIndex];
                item.rejected = !item.rejected;
                if (item.rejected) item.watched = false; // Cannot be watched and rejected
                updateCard(item);
                updateStats();
                updateFirestoreState();
                if (currentModalId === itemId) closeModal();
            }
        }
        
        function updateRatingStars(containerId, rating) {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`[updateRatingStars] Container with id "${containerId}" not found.`);
                return;
            }
            container.innerHTML = ''; // Clear existing stars
            const starContainer = document.createElement('div');
            starContainer.className = 'star-container';
            for (let i = 1; i <= 10; i++) {
                const star = document.createElement('i');
                star.dataset.value = i;
                if (rating >= i) {
                    star.className = 'fa-solid fa-star star filled';
                } else if (rating === i - 0.5) {
                    star.className = 'fa-solid fa-star-half-alt star half-filled';
                } else {
                    star.className = 'fa-regular fa-star star';
                }
                if (window.innerWidth < 768) {
                    star.classList.add('text-sm');
                }
                starContainer.appendChild(star);
            }
            container.appendChild(starContainer);
        }
        
        function handleSetRating(user, rating) {
            if (currentModalId === null) return;

            const itemIndex = marathonState.items.findIndex(i => i.id === currentModalId);
            if (itemIndex > -1) {
                const item = marathonState.items[itemIndex];
                if (!item.ratings) item.ratings = { user1: null, user2: null };

                const newRating = rating;
                item.ratings[user] = newRating;
                item.jarvisSummary = null; // Invalidate summary
                if (newRating !== null) {
                    item.watched = true;
                }

                const containerId = user === 'user1' ? 'juainny-rating' : 'erick-rating';
                const inputId = user === 'user1' ? 'juainny-rating-input' : 'erick-rating-input';
                updateRatingStars(containerId, rating);
                document.getElementById(inputId).value = rating;


                document.getElementById('remove-rating-btn').classList.toggle('hidden', !item.ratings.user1 && !item.ratings.user2);
                updateFirestoreState();

                // Trigger confetti
                if (rating) {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
            }
        }
        
        function autoResizeTextarea(element) {
            if (element && element.style.display !== 'none') {
                element.style.height = 'auto';
                element.style.height = (element.scrollHeight) + 'px';
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            modalElements.modal.addEventListener('transitionend', () => {
                if (modalElements.modal.classList.contains('modal-hidden')) {
                    modalElements.modal.classList.add('hidden');
                }
            });

            document.getElementById('close-modal-btn').addEventListener('click', closeModal);

            document.getElementById('movie-modal').addEventListener('click', (e) => {
                // We only close the modal if the click is on the backdrop itself
                if (e.target.id === 'movie-modal') {
                    closeModal();
                }
            });

            document.getElementById('toggle-watched-btn').addEventListener('click', () => toggleWatchedStatus(currentModalId, !marathonState.items.find(i => i.id === currentModalId).watched, true));
            document.getElementById('toggle-rejected-btn').addEventListener('click', () => toggleRejectedStatus(currentModalId));
            
            document.getElementById('juainny-rating').addEventListener('click', (e) => {
                const star = e.target.closest('.star');
                if (star) {
                    const rect = star.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const rating = parseInt(star.dataset.value);
                    const newRating = clickX < rect.width / 2 ? rating - 0.5 : rating;
                    handleSetRating('user1', newRating);
                }
            });

            document.getElementById('erick-rating').addEventListener('click', (e) => {
                const star = e.target.closest('.star');
                if (star) {
                    const rect = star.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const rating = parseInt(star.dataset.value);
                    const newRating = clickX < rect.width / 2 ? rating - 0.5 : rating;
                    handleSetRating('user2', newRating);
                }
            });

            document.getElementById('juainny-rating-input').addEventListener('change', (e) => {
                handleSetRating('user1', parseFloat(e.target.value));
            });
            document.getElementById('erick-rating-input').addEventListener('change', (e) => {
                handleSetRating('user2', parseFloat(e.target.value));
            });
            document.getElementById('remove-rating-btn').addEventListener('click', () => {
                handleSetRating('user1', null);
                handleSetRating('user2', null);
            });

            document.getElementById('remove-mood-btn').addEventListener('click', () => {
                if (currentModalId !== null) {
                    const itemIndex = marathonState.items.findIndex(i => i.id === currentModalId);
                    if (itemIndex > -1) {
                        marathonState.items[itemIndex].moods = {};
                        updateFirestoreState();
                        openModal(currentModalId);
                    }
                }
            });

            document.getElementById('filter-controls').addEventListener('click', (e) => {
                const button = e.target.closest('.filter-btn');
                if (button) {
                    document.querySelector('.filter-btn.btn-active').classList.remove('btn-active');
                    button.classList.add('btn-active');
                    currentFilter = button.dataset.filter;

                    const nonMcuBtn = document.getElementById('non-mcu-filter-btn');
                    nonMcuBtn.style.display = (currentFilter === 'tv') ? 'none' : 'block';
                    renderUI();
                }
            });

            const nonMcuBtn = document.getElementById('non-mcu-filter-btn');
            nonMcuBtn.classList.toggle('btn-active', showOnlyNonMCU);

            nonMcuBtn.addEventListener('click', (e) => {
                showOnlyNonMCU = !showOnlyNonMCU;
                e.currentTarget.classList.toggle('btn-active', showOnlyNonMCU);
                renderUI();
            });

            document.getElementById('view-controls').addEventListener('click', (e) => {
                if (e.target.closest('.view-btn')) {
                    const btn = e.target.closest('.view-btn');
                    document.querySelector('.view-btn.btn-active').classList.remove('btn-active');
                    btn.classList.add('btn-active');
                    currentView = btn.dataset.view;
                    renderUI();
                }
            });

            document.getElementById('random-movie-btn').addEventListener('click', () => {
                const unwatchedItems = marathonState.items.filter(item => !item.watched);
                if (unwatchedItems.length > 0) {
                    const button = document.getElementById('random-movie-btn');
                    button.disabled = true;
                    let shuffles = 0;
                    const maxShuffles = 10;
                    const interval = setInterval(() => {
                        const randomItem = unwatchedItems[Math.floor(Math.random() * unwatchedItems.length)];
                        document.getElementById('next-up-poster').src = randomItem.poster_path ? `https://image.tmdb.org/t/p/w500${randomItem.poster_path}` : `https://placehold.co/500x750/1f2937/ef4444?text=${encodeURIComponent(randomItem.title)}`;
                        document.getElementById('next-up-title').textContent = randomItem.title;

                        shuffles++;
                        if (shuffles >= maxShuffles) {
                            clearInterval(interval);
                            const finalItem = unwatchedItems[Math.floor(Math.random() * unwatchedItems.length)];
                            openModal(finalItem.id);
                            button.disabled = false;
                        }
                    }, 100);
                }
            });

            document.getElementById('extend-stats-btn').addEventListener('click', (e) => {
                const extendedStats = document.getElementById('extended-stats');
                const icon = e.currentTarget.querySelector('i');
                extendedStats.classList.toggle('hidden');
                icon.classList.toggle('rotate-180');
            });

            document.getElementById('next-up-teaser').addEventListener('click', () => {
                if (nextUpId !== null) {
                    openModal(nextUpId);
                }
            });

            const juainnyNotes = document.getElementById('juainny-notes');
            const erickNotes = document.getElementById('erick-notes');

            juainnyNotes.addEventListener('input', () => autoResizeTextarea(juainnyNotes));
            erickNotes.addEventListener('input', () => autoResizeTextarea(erickNotes));

            juainnyNotes.addEventListener('change', (e) => {
                if (currentModalId === null) return;
                const itemIndex = marathonState.items.findIndex(i => i.id === currentModalId);
                if (itemIndex > -1) {
                    if (!marathonState.items[itemIndex].notes) marathonState.items[itemIndex].notes = { user1: "", user2: "" };
                    marathonState.items[itemIndex].notes.user1 = e.target.value;
                    marathonState.items[itemIndex].jarvisSummary = null; // Invalidate summary
                    updateFirestoreState();
                }
            });

            erickNotes.addEventListener('change', (e) => {
                if (currentModalId === null) return;
                const itemIndex = marathonState.items.findIndex(i => i.id === currentModalId);
                if (itemIndex > -1) {
                    if (!marathonState.items[itemIndex].notes) marathonState.items[itemIndex].notes = { user1: "", user2: "" };
                    marathonState.items[itemIndex].notes.user2 = e.target.value;
                    marathonState.items[itemIndex].jarvisSummary = null; // Invalidate summary
                    updateFirestoreState();
                }
            });

    const userMenuBtn = document.getElementById('user-menu-btn');
    const userMenu = document.getElementById('user-menu');
    const notificationBtn = document.getElementById('notification-btn');
    const notificationModal = document.getElementById('notification-modal');
    const closeNotificationModalBtn = document.getElementById('close-notification-modal-btn');

    userMenuBtn.addEventListener('click', () => {
        userMenu.classList.toggle('hidden');
    });

    notificationBtn.addEventListener('click', () => {
        notificationModal.classList.remove('hidden');
        notificationModal.classList.add('flex');
    });

    window.closeNotificationModal = () => {
        notificationModal.classList.add('hidden');
        notificationModal.classList.remove('flex');
    }

    closeNotificationModalBtn.addEventListener('click', closeNotificationModal);
    document.getElementById('settings-btn').addEventListener('click', () => {
        openSettingsModal();
        userMenu.classList.add('hidden');
    });
    document.getElementById('close-settings-modal-btn').addEventListener('click', closeSettingsModal);

    document.getElementById('theme-picker').addEventListener('click', (e) => {
        const themeBtn = e.target.closest('.theme-btn');
        if (themeBtn) {
            const newTheme = themeBtn.dataset.theme;
            updateTheme(newTheme);
        }
    });

    const avatarPicker = new AvatarPicker((user, avatarData) => {
        if (!userSettings.avatars) {
            userSettings.avatars = {};
        }
        userSettings.avatars[user] = avatarData;
        updateUserSettings({ avatars: userSettings.avatars });
    });
    window.avatarPicker = avatarPicker; // Make it globally accessible

    document.getElementById('avatar-picker-user1-btn').addEventListener('click', () => {
        avatarPicker.open();
    });
    document.getElementById('avatar-picker-user2-btn').addEventListener('click', () => {
        avatarPicker.open();
    });

    document.getElementById('movie-banner-select').addEventListener('change', handleMovieBannerSelect);
            document.getElementById('remove-wallpaper-btn').addEventListener('click', handleRemoveWallpaper);
            document.getElementById('next-up-wallpaper-toggle').addEventListener('change', handleNextUpWallpaperToggle);
            document.getElementById('next-up-wallpaper-type').addEventListener('change', handleNextUpWallpaperTypeChange);
            document.getElementById('next-up-wallpaper-non-mcu').addEventListener('change', handleNextUpWallpaperNonMCUChange);
            document.getElementById('soft-refresh-btn').addEventListener('click', softRefresh);
            document.getElementById('emergency-refresh-btn').addEventListener('click', emergencyRefresh);
            document.getElementById('favorite-btn').addEventListener('click', () => {
                const menu = document.getElementById('user-selection-menu');
                menu.classList.toggle('hidden');
            });

            document.getElementById('user1-btn').addEventListener('click', () => {
                handleFavorite('user1');
                document.getElementById('user-selection-menu').classList.add('hidden');
            });

            document.getElementById('user2-btn').addEventListener('click', () => {
                handleFavorite('user2');
                document.getElementById('user-selection-menu').classList.add('hidden');
            });

            document.getElementById('remove-all-btn').addEventListener('click', () => {
                const item = marathonState.items.find(i => i.id === currentModalId);
                if (item && item.favoritedBy) {
                    item.favoritedBy = [];
                }
                updateFirestoreState();
                openModal(currentModalId);
                document.getElementById('user-selection-menu').classList.add('hidden');
            });

            document.getElementById('mark-all-as-read-btn').addEventListener('click', () => {
                notifications.forEach(n => {
                    if (!n.unreadBy.includes(userId)) {
                        n.unreadBy.push(userId);
                    }
                });
                updateFirestoreNotifications();
            });

            document.getElementById('add-notification-btn').addEventListener('click', async () => {
                const newId = `notif-${Date.now()}`;
                const newNotification = {
                    id: newId,
                    type: 'announcement',
                    title: 'New Notification',
                    summary: 'This is a new notification that you can edit.',
                    description: 'Click the pencil icon to start editing.',
                    date: new Date().toISOString().split('T')[0],
                    unreadBy: []
                };

                notifications.unshift(newNotification);

                try {
                    await updateFirestoreNotifications();
                    showPopup('Notification added!');
                    renderNotifications();
                } catch (error) {
                    console.error("Error updating Firestore:", error);
                    showPopup('Error adding notification. See console for details.');
                    notifications.shift();
                    renderNotifications();
                }
            });

            const deviceNameInput = document.getElementById('device-name-input');
            deviceNameInput.addEventListener('change', (e) => {
                localStorage.setItem('deviceName', e.target.value);
                loadDeviceName();
            });

            const resetDeviceNameBtn = document.getElementById('reset-device-name-btn');
            resetDeviceNameBtn.addEventListener('click', () => {
                localStorage.removeItem('deviceName');
                loadDeviceName();
            });

            const notificationFilterBar = document.getElementById('notification-filter-bar');
            notificationFilterBar.addEventListener('click', (e) => {
                const button = e.target.closest('.notification-filter-btn');
                if (button) {
                    document.querySelector('.notification-filter-btn.btn-active').classList.remove('btn-active');
                    button.classList.add('btn-active');
                    renderNotifications(button.dataset.filter);
                }
            });
            
            initializeAppAndAuth();
            initializeMoodModal();
            initializeTooltip();
            renderNotifications();
            loadDeviceName();

            const infoIcon = document.getElementById('info-tooltip-icon');
            const infoTooltip = document.getElementById('info-tooltip');

            infoIcon.addEventListener('mouseenter', () => {
                infoTooltip.classList.remove('hidden');
                const rect = infoIcon.getBoundingClientRect();
                infoTooltip.style.left = `${rect.left}px`;
                infoTooltip.style.top = `${rect.bottom + 5}px`;
            });

            infoIcon.addEventListener('mouseleave', () => {
                infoTooltip.classList.add('hidden');
            });

            document.getElementById('start-time-hour').addEventListener('click', () => {
                const newHour = prompt('Enter new hour (0-23):', startTime.getHours());
                if (newHour !== null && !isNaN(newHour) && newHour >= 0 && newHour <= 23) {
                    startTime.setHours(newHour);
                    const item = marathonState.items.find(i => i.id === currentModalId);
                    if(item) updateEndTime(item.runtime);
                }
            });

            document.getElementById('start-time-minute').addEventListener('click', () => {
                const newMinute = prompt('Enter new minute (0-59):', startTime.getMinutes());
                if (newMinute !== null && !isNaN(newMinute) && newMinute >= 0 && newMinute <= 59) {
                    startTime.setMinutes(newMinute);
                    const item = marathonState.items.find(i => i.id === currentModalId);
                    if(item) updateEndTime(item.runtime);
                }
            });
        });

function parseMarkdown(text) {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

async function setupNotificationsListener() {
    const notificationsRef = doc(db, "notifications", "main");
    onSnapshot(notificationsRef, (docSnap) => {
        if (docSnap.exists() && docSnap.data().notifications) {
            notifications = docSnap.data().notifications;
        } else {
            notifications = []; // Ensure notifications is always an array
        }
        renderNotifications();
    });
}

async function updateFirestoreNotifications() {
    console.log('Updating Firestore with notifications:', notifications);
    const notificationsRef = doc(db, "notifications", "main");
    const notificationsWithAuth = { notifications, authKey: SECRET_KEY };
    await setDoc(notificationsRef, notificationsWithAuth, { merge: true });
    console.log('Firestore update call finished.');
}

function renderNotifications(filter = 'all') {
    const notificationList = document.getElementById('notification-list');
    const notificationCount = document.getElementById('notification-count');
    const unreadCount = document.getElementById('unread-count');

    notificationList.innerHTML = '';
    let unread = 0;

    const filteredNotifications = notifications.sort((a, b) => new Date(b.date) - new Date(a.date)).filter(notification => {
        if (filter === 'all') {
            return true;
        }
        return notification.type.startsWith(filter);
    });

    filteredNotifications.forEach(notification => {
        const isUnread = !notification.unreadBy.includes(userId);
        if (isUnread) {
            unread++;
        }
        const item = document.createElement('div');
        item.className = `notification-card ${isUnread ? 'unread' : ''}`;
        item.dataset.id = notification.id;
        item.innerHTML = `
            <div class="flex items-center">
                <div class="dot ${notification.type}"></div>
                <div class="flex-grow">
                    <h3 class="font-bold" contenteditable="false">${notification.title}</h3>
                    <p class="text-sm text-text-muted" contenteditable="false">${notification.type}</p>
                </div>
                <button class="ml-auto text-xs text-accent-primary hover:underline mark-as-read-btn">${isUnread ? 'Mark as read' : 'Mark as unread'}</button>
                <button class="ml-2 text-xs text-accent-primary hover:underline edit-notification-btn"><i class="fas fa-pencil-alt"></i></button>
                <i class="fas fa-chevron-right arrow ml-4"></i>
            </div>
            <div class="summary">
                <p class="text-sm" contenteditable="false">${notification.summary}</p>
            </div>
            <div class="description">
                <p class="text-sm" contenteditable="false">${notification.description}</p>
            </div>
            <p class="text-xs text-text-muted mt-2">${notification.date}</p>
        `;
        notificationList.appendChild(item);

        item.addEventListener('click', (e) => {
            if (e.target.closest('.mark-as-read-btn')) {
                e.stopPropagation();
                const index = notification.unreadBy.indexOf(userId);
                if (index > -1) {
                    notification.unreadBy.splice(index, 1);
                } else {
                    notification.unreadBy.push(userId);
                }
                updateFirestoreNotifications();
            } else if (!e.target.closest('.edit-notification-btn')) {
                item.classList.toggle('expanded');
            }
        });

        item.querySelector('.edit-notification-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const h3 = item.querySelector('h3');
            const summaryP = item.querySelector('.summary p');
            const descriptionP = item.querySelector('.description p');
            const typeP = item.querySelector('.text-sm.text-text-muted');

            const isEditing = h3.contentEditable === 'true';
            h3.contentEditable = !isEditing;
            summaryP.contentEditable = !isEditing;
            descriptionP.contentEditable = !isEditing;
            typeP.contentEditable = !isEditing;

            if (isEditing) {
                // Save changes
                notification.title = h3.textContent;
                notification.summary = summaryP.textContent;
                notification.description = descriptionP.textContent;
                notification.type = typeP.textContent;
                updateFirestoreNotifications();
                item.querySelector('.edit-notification-btn').innerHTML = '<i class="fas fa-pencil-alt"></i>';
                h3.classList.remove('editing');
                summaryP.classList.remove('editing');
                descriptionP.classList.remove('editing');
                typeP.classList.remove('editing');

            } else {
                // Enter edit mode
                item.querySelector('.edit-notification-btn').innerHTML = '<i class="fas fa-save"></i>';
                h3.classList.add('editing');
                summaryP.classList.add('editing');
                descriptionP.classList.add('editing');
                typeP.classList.add('editing');
                h3.focus();
            }
        });
    });

    if (unread > 0) {
        notificationCount.textContent = unread;
        notificationCount.style.display = 'inline-flex';
        unreadCount.textContent = `${unread} unread notifications`;
    } else {
        notificationCount.style.display = 'none';
        unreadCount.textContent = 'No unread notifications';
    }
}

function loadDeviceName() {
    const deviceName = localStorage.getItem('deviceName');
    const deviceNameEl = document.getElementById('device-name');
    const deviceNameInput = document.getElementById('device-name-input');
    if (deviceName) {
        deviceNameEl.textContent = deviceName;
        deviceNameInput.value = deviceName;
    } else {
        deviceNameEl.textContent = 'User';
        deviceNameInput.value = '';
    }
}

        function updateFavoriteButton(item) {
            if (!item.favoritedBy) item.favoritedBy = [];
            if (item.favoritedBy.includes('user1') && item.favoritedBy.includes('user2')) {
                modalElements.favoriteBtn.classList.add('favorited');
                modalElements.favoriteBtn.querySelector('span').textContent = 'Favorited by Both';
            } else if (item.favoritedBy.includes('user1')) {
                modalElements.favoriteBtn.classList.add('favorited');
                modalElements.favoriteBtn.querySelector('span').textContent = 'Favorited by Juainny';
            } else if (item.favoritedBy.includes('user2')) {
                modalElements.favoriteBtn.classList.add('favorited');
                modalElements.favoriteBtn.querySelector('span').textContent = 'Favorited by Erick';
            } else {
                modalElements.favoriteBtn.classList.remove('favorited');
                modalElements.favoriteBtn.querySelector('span').textContent = 'Favorite';
            }
        }

        function handleFavorite(user) {
            if (currentModalId === null) return;
            const itemIndex = marathonState.items.findIndex(i => i.id === currentModalId);
            if (itemIndex > -1) {
                const item = marathonState.items[itemIndex];
                if (!item.favoritedBy) {
                    item.favoritedBy = [];
                }

                const userIndex = item.favoritedBy.indexOf(user);

                if (userIndex > -1) {
                    item.favoritedBy.splice(userIndex, 1);
                } else {
                    const currentFavorite = marathonState.items.find(i => i.favoritedBy && i.favoritedBy.includes(user));
                    if (currentFavorite) {
                        const index = currentFavorite.favoritedBy.indexOf(user);
                        currentFavorite.favoritedBy.splice(index, 1);
                    }
                    item.favoritedBy.push(user);
                }

                updateFirestoreState();
                openModal(currentModalId);
            }
        }

        document.getElementById('save-changes-banner-btn').addEventListener('click', () => {
            updateFirestoreState();
            document.getElementById('save-banner').classList.add('hidden');
        });

        document.getElementById('discard-changes-banner-btn').addEventListener('click', () => {
            softRefresh();
            document.getElementById('save-banner').classList.add('hidden');
        });

        const quotaConservationToggle = document.getElementById('quota-conservation-toggle');
        const aiDisabledToggle = document.getElementById('ai-disabled-toggle');

        quotaConservationToggle.addEventListener('change', () => {
            if (quotaConservationToggle.checked) {
                aiDisabledToggle.checked = false;
            }
        });

        aiDisabledToggle.addEventListener('change', () => {
            if (aiDisabledToggle.checked) {
                quotaConservationToggle.checked = false;
            }
        });

        document.getElementById('save-settings-btn').addEventListener('click', () => {
            const nextUpWallpaperToggle = document.getElementById('next-up-wallpaper-toggle');
            const nextUpWallpaperType = document.getElementById('next-up-wallpaper-type');
            const nextUpWallpaperNonMcu = document.getElementById('next-up-wallpaper-non-mcu');
            const nextUpWallpaperTV = document.getElementById('next-up-wallpaper-tv');

            const newSettings = {
                quotaConservation: quotaConservationToggle.checked,
                aiDisabled: aiDisabledToggle.checked,
                nextUpWallpaperEnabled: nextUpWallpaperToggle.checked,
                nextUpWallpaperType: nextUpWallpaperType.value,
                nextUpWallpaperIncludeNonMCU: nextUpWallpaperNonMcu.checked,
                nextUpWallpaperIncludeTV: nextUpWallpaperTV.checked
            };

            updateUserSettings(newSettings);
            closeSettingsModal();
        });

        function openSettingsModal() {
            const modal = document.getElementById('settings-modal');
            const select = document.getElementById('movie-banner-select');
            const nextUpWallpaperToggle = document.getElementById('next-up-wallpaper-toggle');
            const nextUpWallpaperType = document.getElementById('next-up-wallpaper-type');
            const nextUpWallpaperNonMcu = document.getElementById('next-up-wallpaper-non-mcu');
            const nextUpWallpaperTV = document.getElementById('next-up-wallpaper-tv');

            nextUpWallpaperToggle.checked = userSettings.nextUpWallpaperEnabled || false;
            nextUpWallpaperType.value = userSettings.nextUpWallpaperType || 'all';
            nextUpWallpaperNonMcu.checked = userSettings.nextUpWallpaperIncludeNonMCU === undefined ? true : userSettings.nextUpWallpaperIncludeNonMCU;
            nextUpWallpaperTV.checked = userSettings.nextUpWallpaperIncludeTV === undefined ? true : userSettings.nextUpWallpaperIncludeTV;

            select.innerHTML = '<option value="">-- Select a Movie --</option>';
            marathonState.items.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.title;
                select.appendChild(option);
            });

            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => modal.classList.remove('modal-hidden'), 10);
        }

        window.closeSettingsModal = () => {
            const modal = document.getElementById('settings-modal');
            modal.classList.add('modal-hidden');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }, 300);
        }

        function openWallpaperModal() {
            const modal = document.getElementById('wallpaper-modal');
            const select = document.getElementById('movie-banner-select');
            const toggle = document.getElementById('next-up-wallpaper-toggle');
            const typeSelect = document.getElementById('next-up-wallpaper-type');
            const nonMcuToggle = document.getElementById('next-up-wallpaper-non-mcu');
            toggle.checked = userSettings.nextUpWallpaperEnabled || false;
            typeSelect.value = userSettings.nextUpWallpaperType || 'all';
            nonMcuToggle.checked = userSettings.nextUpWallpaperIncludeNonMCU === undefined ? true : userSettings.nextUpWallpaperIncludeNonMCU;
            select.innerHTML = '<option value="">-- Select a Movie --</option>';
            marathonState.items.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.title;
                select.appendChild(option);
            });
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => modal.classList.remove('modal-hidden'), 10);
        }

        function closeWallpaperModal() {
            const modal = document.getElementById('wallpaper-modal');
            modal.classList.add('modal-hidden');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }, 300);
        }

        function handleMovieBannerSelect(e) {
            const selectedId = e.target.value;
            if (!selectedId) return;

            const item = marathonState.items.find(i => i.id == selectedId);
            if (item && item.backdrop_path) {
                const wallpaperUrl = `https://image.tmdb.org/t/p/original${item.backdrop_path}`;
                updateUserSettings({ wallpaper: wallpaperUrl, nextUpWallpaperEnabled: false });
                document.getElementById('next-up-wallpaper-toggle').checked = false;
            }
        }

        function handleRemoveWallpaper() {
            updateUserSettings({ wallpaper: null });
            document.body.style.backgroundImage = '';
            document.getElementById('wallpaper-overlay').style.display = 'none';
            closeSettingsModal();
        }

        function handleNextUpWallpaperToggle(e) {
            updateUserSettings({ nextUpWallpaperEnabled: e.target.checked });
            if (e.target.checked) {
                updateNextUpWallpaper();
            }
        }

        function handleNextUpWallpaperTypeChange(e) {
            updateUserSettings({ nextUpWallpaperType: e.target.value });
            if (userSettings.nextUpWallpaperEnabled) {
                updateNextUpWallpaper();
            }
        }

        function handleNextUpWallpaperNonMCUChange(e) {
            updateUserSettings({ nextUpWallpaperIncludeNonMCU: e.target.checked });
            if (userSettings.nextUpWallpaperEnabled) {
                updateNextUpWallpaper();
            }
        }

        function updateNextUpWallpaper() {
            if (!userSettings.nextUpWallpaperEnabled) return;

            const type = userSettings.nextUpWallpaperType || 'all';
            const includeNonMCU = userSettings.nextUpWallpaperIncludeNonMCU === undefined ? true : userSettings.nextUpWallpaperIncludeNonMCU;
            const includeTV = userSettings.nextUpWallpaperIncludeTV === undefined ? true : userSettings.nextUpWallpaperIncludeTV;
            let itemsToFilter = marathonState.items;

            if (!includeNonMCU) {
                itemsToFilter = itemsToFilter.filter(item => !item.not_mcu);
            }

            if (!includeTV) {
                itemsToFilter = itemsToFilter.filter(item => item.type !== 'tv');
            }

            if (type === 'movie') {
                itemsToFilter = itemsToFilter.filter(item => item.type === 'movie');
            } else if (type === 'tv') {
                itemsToFilter = itemsToFilter.filter(item => ['tv', 'one-shot'].includes(item.type));
            }

            const nextItem = itemsToFilter.find(item => !item.watched && !item.rejected);
            if (nextItem && nextItem.backdrop_path) {
                const wallpaperUrl = `https://image.tmdb.org/t/p/original${nextItem.backdrop_path}`;
                // Only update if the wallpaper is different
                if (userSettings.wallpaper !== wallpaperUrl) {
                    updateUserSettings({ wallpaper: wallpaperUrl });
                }
            }
        }

        async function softRefresh() {
            console.log("Starting soft refresh...");
            document.getElementById('loading-spinner').style.display = 'flex';

            const marathonRef = doc(db, "marathon-data", appId);
            const docSnap = await getDoc(marathonRef);

            if (!docSnap.exists()) {
                console.warn("No existing data found. Performing emergency refresh instead.");
                await emergencyRefresh();
                return;
            }

            const existingItems = docSnap.data().items || [];
            const existingItemsMap = new Map(existingItems.map(item => [item.title, item]));
            const newChronology = marvelUniverseChronology;

            const itemsToFetchApiData = newChronology.filter(item => !existingItemsMap.has(item.title));

            console.log(`Found ${existingItems.length} existing items.`);
            console.log(`New chronology has ${newChronology.length} items.`);
            console.log(`${itemsToFetchApiData.length} new items to fetch from API.`);

            const newApiDetails = await Promise.all(itemsToFetchApiData.map(item => getTMDbDetailsWithCache(item, true)));
            const newApiDetailsMap = new Map(itemsToFetchApiData.map((item, i) => [item.title, newApiDetails[i]]));

            const updatedItems = newChronology.map((newItemTemplate, index) => {
                const existingItemData = existingItemsMap.get(newItemTemplate.title);

                if (existingItemData) {
                    // Merge, preserving user data
                    return {
                        ...existingItemData,
                        id: index, // Ensure ID is updated to new chronological order
                        type: newItemTemplate.type,
                        tmdbId: newItemTemplate.tmdbId,
                        imdbId: newItemTemplate.imdbId,
                        not_mcu: newItemTemplate.not_mcu,
                        phase: newItemTemplate.phase
                    };
                } else {
                    // This is a new item, create it from scratch
                    const details = newApiDetailsMap.get(newItemTemplate.title) || {};
                    let finalRuntime = 0;
                     if (details.runtime) {
                        finalRuntime = details.runtime;
                    } else if (Array.isArray(details.episode_run_time) && details.episode_run_time.length > 0) {
                        finalRuntime = details.episode_run_time[0];
                    } else if (newItemTemplate.type === 'one-shot') {
                        finalRuntime = 10;
                    } else {
                        finalRuntime = 45;
                    }

                    return {
                        id: index,
                        tmdbId: newItemTemplate.tmdbId || null,
                        imdbId: newItemTemplate.imdbId || null,
                        title: newItemTemplate.title || "Unknown Title",
                        type: newItemTemplate.type || "movie",
                        not_mcu: newItemTemplate.not_mcu || false,
                        phase: newItemTemplate.phase || null,
                        poster_path: details.poster_path || null,
                        backdrop_path: details.backdrop_path || null,
                        release_date: details.release_date || details.first_air_date || 'N/A',
                        runtime: finalRuntime || 0,
                        vote_average: details.vote_average || 0,
                        overview: details.overview || 'No overview available.',
                        watched: false,
                        rejected: false,
                        ratings: { user1: null, user2: null },
                        notes: { user1: "", user2: "" },
                        jarvisSummary: null,
                        nextUpHype: null
                    };
                }
            });

            console.log(`Final list has ${updatedItems.length} items. Saving to Firestore.`);

            updatedItems.forEach((item, index) => {
                for (const key in item) {
                    if (item[key] === undefined) {
                        console.error(`Item at index ${index} (${item.title}) has an undefined value for key: ${key}`);
                    }
                }
            });

            marathonState.items = updatedItems;
            await updateFirestoreState();

            document.getElementById('loading-spinner').style.display = 'none';
            console.log("Soft refresh complete. Firestore updated, UI will now sync.");
        }

        async function emergencyRefresh() {
            if (confirm("Are you sure you want to perform an Emergency Refresh? This will reset ALL watched progress and ratings for this marathon. This action cannot be undone.")) {
                console.log("Performing emergency refresh. ALL USER DATA WILL BE RESET.");
                await initializeNewMarathon(doc(db, "marathon-data", appId));
            }
        }

function initializeMoodModal() {
    const moods = [
        { name: 'Satisfied', image: 'satisfied.png' },
        { name: 'Thinking', image: 'thinking.png' },
        { name: 'Afraid', image: 'afraid.png' },
        { name: 'Neutral', image: 'neutral.png' },
        { name: 'Happy', image: 'happy.png' },
        { name: 'Disgusted', image: 'disgusted.png' },
        { name: 'Angry', image: 'angry.png' },
        { name: 'Surprised', image: 'surprised.png' },
        { name: 'Crying', image: 'crying.png' },
        { name: 'Bored', image: 'bored.png' },
        { name: 'Celebratory', image: 'celebratory.png' },
        { name: 'Melted', image: 'melted.png' },
        { name: 'Amazed', image: 'amazed.png' },
        { name: 'Sad', image: 'sad.png' },
        { name: 'Sexy', image: 'sexy.png' },
        { name: 'Not a Fan', image: 'not-a-fan.png' },
        { name: 'Crazy', image: 'crazy.png' },
        { name: 'labubu', image: '24klabubu.png' }
    ];

    moodModal = new MoodModal(moods, (selectedUser, selectedMood) => {
        if (currentModalId !== null) {
            const itemIndex = marathonState.items.findIndex(i => i.id === currentModalId);
            if (itemIndex > -1) {
                const item = marathonState.items[itemIndex];
                if (!item.moods) {
                    item.moods = {};
                }
                item.moods[selectedUser] = selectedMood;

                const movieTitle = item.title;
                console.log(`${selectedUser} reacted ${selectedMood.name} to ${movieTitle}!`);

                updateFirestoreState();
                openModal(currentModalId); // Refresh modal to show new mood
            }
        }
    }, userSettings);

    document.getElementById('add-mood-btn').addEventListener('click', () => {
        const item = marathonState.items.find(i => i.id === currentModalId);
        if (item) {
            moodModal.open(item.moods);
        }
    });
}

function updateMoodDisplay(item) {
    const modalMoodDisplay = document.getElementById('modal-mood-display');
    modalMoodDisplay.innerHTML = '';

    if (item.moods) {
        const user1Mood = item.moods.user1;
        const user2Mood = item.moods.user2;

        if (user1Mood) {
            modalMoodDisplay.innerHTML += `<div class="mood-emoji-container" data-user="Juainny" data-mood="${user1Mood.name}" data-movie="${item.title}"><img src="/moods/${user1Mood.image}" alt="${user1Mood.name}" class="w-10 h-10"></div>`;
        }
        if (user2Mood) {
            modalMoodDisplay.innerHTML += `<div class="mood-emoji-container" data-user="Erick" data-mood="${user2Mood.name}" data-movie="${item.title}"><img src="/moods/${user2Mood.image}" alt="${user2Mood.name}" class="w-10 h-10"></div>`;
        }
    }
}

function initializeTooltip() {
    const tooltip = document.getElementById('tooltip');
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.emoji-banner')) {
            e.stopPropagation();
        }
        const target = e.target.closest('.mood-emoji-container');
        if (target) {
            const user = target.dataset.user;
            const mood = target.dataset.mood;

            const avatarContainer = document.createElement('div');
            const userKey = user === 'Juainny' ? 'user1' : 'user2';
            renderAvatar(avatarContainer, userKey, userSettings, { size: 'small', extraClasses: ['mr-2'] });

            tooltip.innerHTML = `<div class="flex items-center">${avatarContainer.outerHTML}<span>${user} reacted with ${mood}</span></div>`;
            tooltip.classList.remove('hidden');
            const rect = target.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX}px`;
            tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
        } else {
            tooltip.classList.add('hidden');
        }
    }, true);
}

function showPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50';
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
    }, 3000);
}
