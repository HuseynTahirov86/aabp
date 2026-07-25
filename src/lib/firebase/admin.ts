import type { Firestore } from "firebase-admin/firestore";
import type { Auth } from "firebase-admin/auth";

let _adminDb: Firestore | null = null;
let _adminAuth: Auth | null = null;
let _initPromise: Promise<void> | null = null;

async function ensureAdmin() {
  if (_adminDb) return;
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    const { initializeApp, getApps, cert } = await import("firebase-admin/app");
    const { getAuth } = await import("firebase-admin/auth");
    const { getFirestore } = await import("firebase-admin/firestore");

    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });
    }

    _adminAuth = getAuth();
    _adminDb = getFirestore();
  })();

  return _initPromise;
}

export async function getAdminDb(): Promise<Firestore | null> {
  await ensureAdmin();
  return _adminDb;
}

export async function getAdminAuth(): Promise<Auth | null> {
  await ensureAdmin();
  return _adminAuth;
}
