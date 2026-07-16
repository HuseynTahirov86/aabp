import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Handling multiline private key from environment variables
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

let _adminAuth: ReturnType<typeof getAuth> | undefined;
let _adminDb: ReturnType<typeof getFirestore> | undefined;

if (getApps().length > 0) {
  _adminAuth = getAuth();
  _adminDb = getFirestore();
}

export const adminAuth = _adminAuth;
export const adminDb = _adminDb;
