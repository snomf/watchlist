import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCmAiYHJ77vZCNzP1juaeU4xQ_KV6kc5h4",
    authDomain: "watchlist-b2fd0.firebaseapp.com",
    projectId: "watchlist-b2fd0",
    storageBucket: "watchlist-b2fd0.firebasestorage.app",
    messagingSenderId: "917010956394",
    appId: "1:917010956394:web:6ed1aa6e057ceced48ca13",
    measurementId: "G-ZZFBMG2K1G"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Analytics
const analytics = getAnalytics(firebaseApp);

// Initialize App Check
if (typeof window !== 'undefined') {
    const appCheck = initializeAppCheck(firebaseApp, {
        provider: new ReCaptchaV3Provider('6LdRTRQsAAAAAK07rxxw0rG2s7iBlrx_zLaLs4u5'),
        isTokenAutoRefreshEnabled: true
    });
}

// Initialize the Gemini Developer API backend service
const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });

// Create a GenerativeModel instance
const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

export { firebaseApp as app, analytics, model };
