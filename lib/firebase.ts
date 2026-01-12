import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (server-side only)
if (!getApps().length) {
  try {
    // For Vercel deployment, use environment variables
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      console.log('Firebase initialized with environment variables');
    } 
    // For local development, use service account JSON file
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH && typeof window === 'undefined') {
      // Only try to load file in Node.js environment, not during build
      try {
        const fs = require('fs');
        const path = require('path');
        const serviceAccountPath = path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
        if (fs.existsSync(serviceAccountPath)) {
          const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
          initializeApp({
            credential: cert(serviceAccount),
          });
          console.log('Firebase initialized with service account file');
        } else {
          console.warn('Firebase service account file not found:', serviceAccountPath);
        }
      } catch (fileError) {
        console.warn('Could not load Firebase service account file:', fileError);
      }
    } else {
      console.warn('Firebase not configured - falling back to local JSON files');
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    // Don't throw - allow fallback to JSON files
  }
}

export const db = getApps().length > 0 ? getFirestore() : null;

// Firestore collection names
export const COLLECTIONS = {
  INQUIRIES: 'inquiries',
  EMAIL_LOGS: 'email_logs',
  AUTOMATION_SETTINGS: 'automation_settings',
  EMAIL_TEMPLATES: 'email_templates',
  SCHEDULED_EMAILS: 'scheduled_emails',
} as const;

// Single document IDs for global settings
export const AUTOMATION_SETTINGS_DOC_ID = 'global_settings';
// Note: Email templates are now stored as individual documents, not a single global document
