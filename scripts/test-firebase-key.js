#!/usr/bin/env node
/**
 * Test script to verify Firebase private key format
 * 
 * Usage: node scripts/test-firebase-key.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Firebase Private Key Format...\n');

// Load service account
const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ firebase-service-account.json not found!');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Test 1: Check if private_key exists
if (!serviceAccount.private_key) {
  console.error('❌ private_key not found in service account!');
  process.exit(1);
}
console.log('✅ private_key field exists');

// Test 2: Check if it starts/ends correctly
const key = serviceAccount.private_key;
if (!key.startsWith('-----BEGIN PRIVATE KEY-----')) {
  console.error('❌ private_key does not start with BEGIN marker!');
  process.exit(1);
}
console.log('✅ private_key starts with BEGIN marker');

if (!key.includes('-----END PRIVATE KEY-----')) {
  console.error('❌ private_key does not end with END marker!');
  process.exit(1);
}
console.log('✅ private_key ends with END marker');

// Test 3: Check newline format
if (key.includes('\\n')) {
  console.log('✅ Key uses escaped newlines (\\n) - GOOD for Vercel env vars');
  console.log('\n📋 Copy this EXACT value to Vercel:');
  console.log('─────────────────────────────────────────');
  console.log(key);
  console.log('─────────────────────────────────────────\n');
} else if (key.includes('\n')) {
  console.log('⚠️  Key uses actual newlines - Need to convert to \\n for Vercel');
  console.log('\n📋 Use this converted value for Vercel:');
  console.log('─────────────────────────────────────────');
  const converted = key.replace(/\n/g, '\\n');
  console.log(converted);
  console.log('─────────────────────────────────────────\n');
}

// Test 4: Try to initialize Firebase Admin
console.log('🔥 Testing Firebase Admin SDK initialization...');
try {
  const admin = require('firebase-admin');
  
  // Initialize with the key
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'), // Convert escaped newlines
    }),
  });
  
  console.log('✅ Firebase Admin SDK initialized successfully!');
  console.log('\n🎉 Your private key format is CORRECT!');
  
} catch (error) {
  console.error('❌ Firebase Admin SDK initialization failed:');
  console.error(error.message);
  process.exit(1);
}

