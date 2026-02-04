// Conditional Firebase imports to prevent build errors when Firebase is not installed
let initializeApp: any, getFirestore: any, getAuth: any, getStorage: any, getFunctions: any;
let connectFirestoreEmulator: any, connectAuthEmulator: any, connectStorageEmulator: any, connectFunctionsEmulator: any;

try {
  const firebaseApp = require('firebase/app');
  const firebaseFirestore = require('firebase/firestore');
  const firebaseAuth = require('firebase/auth');
  const firebaseStorage = require('firebase/storage');
  const firebaseFunctions = require('firebase/functions');

  initializeApp = firebaseApp.initializeApp;
  getFirestore = firebaseFirestore.getFirestore;
  connectFirestoreEmulator = firebaseFirestore.connectFirestoreEmulator;
  getAuth = firebaseAuth.getAuth;
  connectAuthEmulator = firebaseAuth.connectAuthEmulator;
  getStorage = firebaseStorage.getStorage;
  connectStorageEmulator = firebaseStorage.connectStorageEmulator;
  getFunctions = firebaseFunctions.getFunctions;
  connectFunctionsEmulator = firebaseFunctions.connectFunctionsEmulator;
} catch (error) {
  // Firebase not installed - provide mock functions
  console.warn('Firebase not installed. Using mock functions.');
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only if available
let app: any = null;
let db: any = null;
let auth: any = null;
let storage: any = null;
let functions: any = null;

if (initializeApp && getFirestore && getAuth && getStorage && getFunctions) {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);

    // Initialize Firebase services
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    functions = getFunctions(app);

    // Connect to emulators in development
    if (process.env.NODE_ENV === 'development') {
      // Uncomment these lines if you want to use Firebase emulators
      // connectFirestoreEmulator(db, 'localhost', 8080);
      // connectAuthEmulator(auth, 'http://localhost:9099');
      // connectStorageEmulator(storage, 'localhost', 9199);
      // connectFunctionsEmulator(functions, 'localhost', 5001);
    }
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
}

export { db, auth, storage, functions };
export default app;