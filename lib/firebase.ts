import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (server-side only)
if (!getApps().length) {
  try {
    // For Vercel deployment, use environment variables
    if (process.env.FIREBASE_PROJECT_ID) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      console.log('Firebase initialized with environment variables');
    } 
    // For local development, use service account JSON file
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log('Firebase initialized with service account file');
    } else {
      console.warn('Firebase not configured - falling back to local JSON files');
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
}

export const db = getApps().length > 0 ? getFirestore() : null;

// Firestore collection names
export const COLLECTIONS = {
  INQUIRIES: 'inquiries',
  EMAIL_LOGS: 'email_logs',
  AUTOMATION_SETTINGS: 'automation_settings',
} as const;

