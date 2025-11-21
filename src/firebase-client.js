import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyB7ijoC19A2krXR4kchbLEK_OZy_I53hsY",
    authDomain: "marvelmarathon.firebaseapp.com",
    projectId: "marvelmarathon",
    storageBucket: "marvelmarathon.firebasestorage.app",
    messagingSenderId: "436493932151",
    appId: "1:436493932151:web:9e2907b98d3132bf159872"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize App Check
if (typeof window !== 'undefined') {
    // Using the reCAPTCHA site key provided by the user
    const appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider('6LdRTRQsAAAAAK07rxxw0rG2s7iBlrx_zLaLs4u5'),
        isTokenAutoRefreshEnabled: true
    });
}

// Initialize Vertex AI
const vertexAI = getVertexAI(app);

// Initialize Gemini 2.5 Flash Model
const model = getGenerativeModel(vertexAI, { model: "gemini-2.5-flash" });

export { app, vertexAI, model };
