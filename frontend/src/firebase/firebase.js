import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, setLogLevel } from 'firebase/firestore';

// 1. Configuration Check - Prioritize Canvas Global Config or use user's fallback
let firebaseConfig;

if (typeof __firebase_config !== 'undefined') {
    // Use the config injected by the Canvas environment (highest priority)
    firebaseConfig = JSON.parse(__firebase_config);
} else {
    // Fallback to the configuration provided by the user (simulating .env file structure)
    // NOTE: In a standard React setup, this would look like:
    // firebaseConfig = { apiKey: import.meta.env.VITE_FIREBASE_API_KEY, ... }
    firebaseConfig = {
        apiKey: "AIzaSyCiuxg7AZ_A3lXGo86ZWROlSi4Oh4anQ8I",
        authDomain: "todoapp-36817.firebaseapp.com",
        projectId: "todoapp-36817",
        storageBucket: "todoapp-36817.firebasestorage.app",
        appId: "1:328079058364:web:50e9bb424de6afe7c7f7b9",
    };
}


// 2. Initialize Firebase Services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Ensure Auth is initialized

// Set log level for debugging
setLogLevel('debug');

/**
 * Initializes authentication using a custom token or anonymously.
 * This is MANDATORY for Canvas environment to establish a user session.
 * @param {string} customToken - The initial auth token provided by the environment.
 * @returns {Promise<string>} The authenticated user's ID.
 */
export const initAuthAndGetUserId = async (customToken) => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in (either via custom token or anonymously)
                const userId = user.uid;
                unsubscribe();
                resolve(userId);
            } else {
                // Attempt to sign in
                try {
                    if (customToken) {
                        // Use provided token for authentication
                        await signInWithCustomToken(auth, customToken);
                    } else {
                        // Fallback to anonymous sign-in
                        await signInAnonymously(auth);
                    }
                } catch (error) {
                    console.error("Firebase Auth Error: Failed to sign in.", error);
                    // If sign-in fails, still resolve with a random ID to allow local testing
                    resolve(crypto.randomUUID());
                }
            }
        });
    });
};

export { db, auth };