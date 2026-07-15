import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { Platform } from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADUe66C0DZHcqdYINsqpBlKytwEF2lpqE",
  authDomain: "tirupur-ai.firebaseapp.com",
  projectId: "tirupur-ai",
  storageBucket: "tirupur-ai.firebasestorage.app",
  messagingSenderId: "899404628699",
  appId: "1:899404628699:web:72aa13f261ba86ffed02fe",
  measurementId: "G-T45M2QY90K"
};

// Initialize Firebase (Modular)
const app = initializeApp(firebaseConfig);

// Initialize Firebase (Compat) for expo-firebase-recaptcha
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

let analytics: any = null;

// Initialize Analytics only if supported (usually only web in Expo without native modules)
if (Platform.OS === 'web') {
    isSupported().then((supported) => {
        if (supported) {
          analytics = getAnalytics(app);
        }
    });
}

import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()})
});
export const functions = getFunctions(app, 'us-central1');

// Connect to Local Emulator for Functions (Bypassing Blaze plan requirement)
connectFunctionsEmulator(functions, '127.0.0.1', 5001);

export { app, analytics };
