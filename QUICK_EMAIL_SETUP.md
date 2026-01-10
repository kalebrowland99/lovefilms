# ⚡ Quick Email Automation Setup

## 🚀 Get Started in 3 Steps

### Step 1: Add Environment Variables

Create/edit `.env.local` in your project root:

```bash
RESEND_API_KEY=re_your_api_key_here
EMAIL_ADMIN_PASSWORD=yourlovefilms2026
CRON_SECRET=generate_a_random_secret_here
```

**Generate CRON_SECRET:** Run `openssl rand -base64 32` or use any random string

### Step 2: Test Locally

```bash
npm run dev
```

Visit: `http://localhost:3000/crm`  
Login with: `yourlovefilms2026`

Test by:
1. Filling out contact form
2. Checking Logs tab to see it was logged

### Step 3: Deploy to Vercel

```bash
git add .
git commit -m "Add email automation system"
git push
```

Then in Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add all 3 variables from Step 1
3. Redeploy

**Done!** 🎉

---

## 📧 What You Get

✅ **Instant Emails**
- Welcome email to inquirer (immediate)
- Notification to you (immediate)

✅ **Automated Follow-Ups**
- Day 1 follow-up (24 hours later)
- Day 3 follow-up (72 hours later)

✅ **Email Log Dashboard**
- View all sent emails at `/crm`
- See success/failure rates
- Track email history

✅ **Easy Editing**
- Edit ALL email content from UI
- No code needed
- Changes save instantly

---

## 📱 Access Your Dashboard

**Local:** `http://localhost:3000/crm`  
**Production:** `https://yourlovefilms.com/crm`

**Password:** `yourlovefilms2026` (change in `.env.local`)

---

## 🎨 Customize Emails

1. Go to `/crm`
2. Login
3. Click on any email template
4. Edit text, subject, buttons, etc.
5. Click "Save Changes"
6. Done! Next email uses your changes

---

## 📊 View Email History

1. Go to `/crm`
2. Click "Logs" tab
3. See all sent emails and texts with:
   - Date & time
   - Recipient
   - Template type
   - Success/failure status

---

## ⏰ Follow-Up Schedule

Cron runs daily at **9:00 AM UTC**

- **Day 1:** 24 hours after inquiry
- **Day 3:** 72 hours after inquiry

Only sends if inquiry status is still "new"

---

## 🆘 Need Help?

See full documentation: `EMAIL_AUTOMATION_SETUP.md`

**Common Issues:**
- Emails not sending? → Check `RESEND_API_KEY`
- Can't login? → Check `EMAIL_ADMIN_PASSWORD`
- Cron not running? → Check `CRON_SECRET` in Vercel

---

**That's it! Your automated email system is ready to capture and nurture wedding inquiries! 💍🎥**

