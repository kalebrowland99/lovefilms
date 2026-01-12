# 🔥 Firebase Setup Guide

## Why Firebase?

Your customer inquiries and email logs were being stored in `/tmp` on Vercel, which gets **wiped on every deployment**. Firebase Firestore provides persistent, reliable database storage with a generous free tier.

---

## 📋 Prerequisites

- Google account
- ~15 minutes

---

## 🚀 Step-by-Step Setup

### Step 1: Create or Select Firebase Project

#### Option A: Use Existing Project (Recommended if you have one)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click on your existing project (e.g., `lovefilms`)
3. Skip to **Step 2** below

#### Option B: Create New Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `yourlovefilms` (or any name)
4. Disable Google Analytics (optional, not needed)
5. Click **"Create project"**

### Step 2: Enable Firestore Database

1. In Firebase Console (with your project open), click **"Firestore Database"** in left sidebar

#### If Firestore Doesn't Exist Yet:
2. Click **"Create database"**
3. Choose **"Start in production mode"**
4. Select location closest to your users (e.g., `us-central` for USA)
5. Click **"Enable"**

#### If Firestore Already Exists:
2. Great! You'll see your existing database
3. Skip to **Step 3** below

### Step 3: Set Up Security Rules

1. In Firestore, click the **"Rules"** tab
2. Replace the default rules with:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Only server-side (Admin SDK) can read/write
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **"Publish"**

> **Why these rules?** Your Next.js API routes use Firebase Admin SDK, which bypasses these rules. This prevents direct access from browsers.

### Step 4: Generate Service Account Key

1. Click the **⚙️ gear icon** → **"Project settings"**
2. Go to **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** → Downloads a JSON file
5. **Rename it to:** `firebase-service-account.json`
6. **Save it in your project root** (it's already in `.gitignore`)

---

## 🔑 Step 5: Configure Environment Variables

### For Local Development:

Create/edit `.env.local`:

```bash
# Firebase Configuration (use service account file path)
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json

# Existing variables (keep these)
RESEND_API_KEY=re_your_key
EMAIL_ADMIN_PASSWORD=yourlovefilms2026
CRON_SECRET=your_secret
```

### For Vercel Production:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these 3 variables (from your `firebase-service-account.json`):

```
FIREBASE_PROJECT_ID = your-project-id
FIREBASE_CLIENT_EMAIL = firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n
```

> **Important:** For `FIREBASE_PRIVATE_KEY`, copy the ENTIRE value including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`. The `\n` characters should be literal `\n` (Vercel handles this correctly).

---

## 📦 Step 6: Migrate Existing Data (Optional)

If you have existing inquiries/logs in JSON files:

1. Make sure `firebase-service-account.json` is in your project root
2. Run the migration script:

```bash
npm run migrate-to-firebase
```

Or using ts-node directly:

```bash
npx ts-node scripts/migrate-to-firebase.ts
```

This will upload all your existing data to Firestore.

---

## ✅ Step 7: Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` and submit a test inquiry.

Check the terminal for:
```
✅ Using Firebase Firestore for data storage
```

If you see this, Firebase is working! ✨

---

## 🚀 Step 8: Deploy to Vercel

```bash
git add .
git commit -m "Add Firebase Firestore integration"
git push
```

Vercel will auto-deploy. Your data will now persist across deployments! 🎉

---

## 🔍 Verify Firebase is Working

### Check Firestore Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **"Firestore Database"**
4. You should see collections:
   - `inquiries` - Customer form submissions
   - `email_logs` - Email and SMS history

### Check Your CRM:

1. Go to `https://yourlovefilms.com/crm`
2. Login with your password
3. Check **"Leads"** and **"Logs"** tabs
4. Data should be there even after deployments!

---

## 🆘 Troubleshooting

### "Firebase not configured - using local JSON files"

**Cause:** Environment variables not set correctly

**Solution:**
- Local: Check `.env.local` has `FIREBASE_SERVICE_ACCOUNT_PATH`
- Vercel: Check all 3 Firebase env vars are set in Vercel dashboard

### "Error initializing Firebase"

**Cause:** Invalid service account credentials

**Solution:**
- Re-download service account JSON from Firebase Console
- Make sure `FIREBASE_PRIVATE_KEY` includes `\n` characters (literal backslash-n)
- Verify `FIREBASE_CLIENT_EMAIL` matches the service account

### "Insufficient permissions"

**Cause:** Firestore security rules too restrictive

**Solution:**
- Verify Firestore rules allow Admin SDK access
- The default rules block everything except Admin SDK
- Make sure you're using Firebase Admin SDK (not client SDK)

### Migration script fails

**Cause:** Service account file not found

**Solution:**
```bash
export FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
npm run migrate-to-firebase
```

---

## 💰 Firebase Free Tier Limits

Firebase Spark (Free) plan includes:

- **Storage:** 1 GB (you'll use ~1 MB max)
- **Reads:** 50,000/day (plenty for your use case)
- **Writes:** 20,000/day (more than enough)
- **Deletes:** 20,000/day

**You'll never hit these limits** for a wedding videography business. If you somehow do, Firebase Blaze (pay-as-you-go) costs ~$0.06 per 100k reads.

---

## 🎯 What Changed in Your Code

### Before (JSON Files):
```typescript
// Data stored in /tmp - lost on deployment
const DATA_DIR = '/tmp/data';
fs.writeFileSync(path.join(DATA_DIR, 'inquiries.json'), ...);
```

### After (Firebase):
```typescript
// Data stored in Firebase - persists forever
await db.collection('inquiries').doc(inquiry.id).set(inquiry);
```

### Backwards Compatible:
If Firebase isn't configured, the app **falls back to JSON files** automatically. No breaking changes!

---

## 📝 Summary

✅ Inquiries and logs now persist across deployments  
✅ No more data loss when you push to GitHub  
✅ Generous free tier (1 GB storage, 50k reads/day)  
✅ Backwards compatible (falls back to JSON files if not configured)  
✅ All existing code continues to work  

---

## 🔗 Useful Links

- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

---

**Questions? Check the Firebase Console for your data, or run the migration script if you have existing inquiries to preserve!**

