import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { Platform } from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics: any = null;

// Initialize Analytics only if supported (usually only web in Expo without native modules)
if (Platform.OS === 'web') {
    isSupported().then((supported) => {
        if (supported) {
          analytics = getAnalytics(app);
        }
    });
}

export const auth = getAuth(app);
export const db = getFirestore(app);

export { app, analytics };
