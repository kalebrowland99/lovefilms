#!/usr/bin/env ts-node
/**
 * Migration script to move data from JSON files to Firebase Firestore
 * 
 * Usage:
 *   npm run migrate-to-firebase
 * 
 * This will:
 * 1. Read data from data/inquiries.json and data/email-logs.json
 * 2. Upload them to Firebase Firestore
 * 3. Preserve all existing data structure
 */

import * as fs from 'fs';
import * as path from 'path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Types
interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  fianceName: string;
  weddingDate: string;
  venue: string;
  videographer?: string;
  status: 'new' | 'contacted' | 'booked' | 'paid' | 'dead';
  createdAt: string;
  isManualEnrollment?: boolean;
  followUpSentAt?: {
    day1?: string;
    day3?: string;
    day6?: string;
    day10?: string;
    day14?: string;
  };
  manualFollowUpSentAt?: {
    day1?: string;
    day3?: string;
    day6?: string;
    day10?: string;
    day14?: string;
  };
  smsSentAt?: {
    day0?: string;
    day2?: string;
    day4?: string;
  };
}

interface EmailLog {
  id: string;
  inquiryId: string;
  recipientEmail: string;
  recipientName: string;
  templateType: string;
  subject: string;
  sentAt: string;
  status: 'sent' | 'failed';
  error?: string;
  messageType?: 'email' | 'sms';
}

async function migrate() {
  console.log('🔥 Starting Firebase migration...\n');

  // Initialize Firebase
  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
                                 path.join(process.cwd(), 'firebase-service-account.json');
    
    if (!fs.existsSync(serviceAccountPath)) {
      console.error('❌ Firebase service account file not found at:', serviceAccountPath);
      console.error('\nPlease:');
      console.error('1. Download your service account key from Firebase Console');
      console.error('2. Save it as firebase-service-account.json in project root');
      console.error('3. Or set FIREBASE_SERVICE_ACCOUNT_PATH environment variable');
      process.exit(1);
    }

    const serviceAccount = require(serviceAccountPath);
    initializeApp({
      credential: cert(serviceAccount),
    });

    console.log('✅ Firebase initialized\n');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error);
    process.exit(1);
  }

  const db = getFirestore();

  // Migrate Inquiries
  const inquiriesPath = path.join(process.cwd(), 'data', 'inquiries.json');
  if (fs.existsSync(inquiriesPath)) {
    console.log('📥 Reading inquiries from', inquiriesPath);
    const inquiriesData = JSON.parse(fs.readFileSync(inquiriesPath, 'utf8'));
    const inquiries: Inquiry[] = Array.isArray(inquiriesData) ? inquiriesData : [];
    
    console.log(`Found ${inquiries.length} inquiries to migrate`);
    
    if (inquiries.length > 0) {
      const batch = db.batch();
      let count = 0;
      
      for (const inquiry of inquiries) {
        const docRef = db.collection('inquiries').doc(inquiry.id);
        batch.set(docRef, inquiry);
        count++;
        
        // Firestore batch limit is 500
        if (count === 500) {
          await batch.commit();
          console.log(`  ✓ Migrated ${count} inquiries...`);
          count = 0;
        }
      }
      
      if (count > 0) {
        await batch.commit();
      }
      
      console.log(`✅ Successfully migrated ${inquiries.length} inquiries\n`);
    }
  } else {
    console.log('⚠️  No inquiries file found, skipping\n');
  }

  // Migrate Email Logs
  const logsPath = path.join(process.cwd(), 'data', 'email-logs.json');
  if (fs.existsSync(logsPath)) {
    console.log('📥 Reading email logs from', logsPath);
    const logsData = JSON.parse(fs.readFileSync(logsPath, 'utf8'));
    const logs: EmailLog[] = Array.isArray(logsData) ? logsData : [];
    
    console.log(`Found ${logs.length} email logs to migrate`);
    
    if (logs.length > 0) {
      const batch = db.batch();
      let count = 0;
      
      for (const log of logs) {
        const docRef = db.collection('email_logs').doc(log.id);
        batch.set(docRef, log);
        count++;
        
        // Firestore batch limit is 500
        if (count === 500) {
          await batch.commit();
          console.log(`  ✓ Migrated ${count} email logs...`);
          count = 0;
        }
      }
      
      if (count > 0) {
        await batch.commit();
      }
      
      console.log(`✅ Successfully migrated ${logs.length} email logs\n`);
    }
  } else {
    console.log('⚠️  No email logs file found, skipping\n');
  }

  console.log('🎉 Migration complete!');
  console.log('\nNext steps:');
  console.log('1. Set up Firebase environment variables in Vercel');
  console.log('2. Deploy your app with: git push');
  console.log('3. Your data is now persistent across deployments!\n');
}

// Run migration
migrate().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});

