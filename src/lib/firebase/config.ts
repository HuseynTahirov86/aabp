import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length
  ? getApp()
  : process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    ? initializeApp(firebaseConfig)
    : null;

let _auth: Auth | null = null;
let _db: Firestore | null = null;
let analytics: ReturnType<typeof getAnalytics> | null = null;

if (app) {
  _auth = getAuth(app);
  _db = getFirestore(app);

  if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    });
  }
}

export { app, analytics };

export function getAuthInstance(): Auth {
  if (!_auth) throw new Error("Firebase Auth not initialized. Check NEXT_PUBLIC_FIREBASE_* env vars.");
  return _auth;
}

export function getDb(): Firestore {
  if (!_db) throw new Error("Firestore not initialized. Check NEXT_PUBLIC_FIREBASE_* env vars.");
  return _db;
}
