# ⚡ Quick Email Automation Setup

## 🚀 Get Started in 3 Steps

### Step 1: Add Environment Variables

Create/edit `.env.local` in your project root:

```bash
# Required
RESEND_API_KEY=re_your_api_key_here
EMAIL_ADMIN_PASSWORD=yourlovefilms2026
CRON_SECRET=generate_a_random_secret_here

# Optional: Twilio SMS (can also be set in Vercel or in CRM)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

**Generate CRON_SECRET:** Run `openssl rand -base64 32` or use any random string

**Twilio Credentials:** Can be set here, in Vercel environment variables (recommended), or in the CRM UI (fallback)

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
2. Add required variables:
   - `RESEND_API_KEY`
   - `EMAIL_ADMIN_PASSWORD`
   - `CRON_SECRET`
3. **(Recommended)** Add Twilio SMS variables:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`
4. Redeploy

**Done!** 🎉

> **💡 Pro Tip:** Setting Twilio credentials in Vercel environment variables is more secure than entering them in the CRM UI. The system will prioritize environment variables over CRM settings.

---

## 📧 What You Get

✅ **Instant Emails**
- Pricing & Availability email to inquirer (5 minutes after inquiry)
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
6. **Important:** Commit and push your changes to Git so they persist across deployments:
   ```bash
   git add data/email-templates.json
   git commit -m "Update email templates"
   git push
   ```
7. Done! Your customizations are now permanent

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

