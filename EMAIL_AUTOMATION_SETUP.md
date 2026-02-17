# 🎯 Email Automation System

## Overview

Your email system now includes **automated follow-up emails** that send automatically to inquiries who haven't responded!

## 📧 How It Works

When someone fills out your contact form:

1. ✅ **Immediate** - Welcome email sent to inquirer
2. ✅ **Immediate** - Notification sent to you (hi@yourlovefilms.com)
3. ✅ **After 24 hours** - Day 1 follow-up sent automatically (if status is still "new")
4. ✅ **After 72 hours** - Day 3 follow-up sent automatically (if status is still "new")

All emails are **logged** and you can view the history at `/crm` → **Email Logs** tab.

---

## 🚀 Setup Instructions

### Step 1: Environment Variables

Add these to your `.env.local` file:

```bash
# Required - Your Resend API Key
RESEND_API_KEY=re_your_api_key_here

# Required - Email Admin Password
EMAIL_ADMIN_PASSWORD=yourlovefilms2026

# Required - Cron Job Security Secret (generate a random string)
CRON_SECRET=your_random_secret_here_make_it_long_and_secure
```

**To generate a CRON_SECRET:**
- Use a password generator or run: `openssl rand -base64 32`
- Example: `CRON_SECRET=8xK2mP9qL5vN3zR7wE1jS6tY4uB0hC8d`

### Step 2: Deploy to Vercel

1. Push your code to GitHub
2. Deploy to Vercel (or redeploy if already deployed)
3. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
4. Add all three environment variables above
5. Redeploy

### Step 3: Verify Cron Job is Running

Vercel will automatically run the cron job daily at **9:00 AM UTC**.

To check if it's working:
- Go to Vercel Dashboard → Your Project → Deployments → Functions
- Look for `/api/cron/follow-ups` in the function logs

---

## 📊 Email Log Dashboard

Visit: **yourlovefilms.com/crm**

### Features:

✅ **Email Templates Tab** - Edit all your email content  
✅ **Email Logs Tab** - View all sent emails  

### Email Logs Shows:
- Date & time each email was sent
- Recipient name and email
- Email template type (Welcome, Follow-up Day 1, etc.)
- Subject line
- Status (Sent ✓ or Failed ✗)
- Stats: Total emails, success rate, today's count

---

## 📝 Email Templates Available

### 1. **Welcome Email (DISABLED)**
- ~~Sent immediately when form is submitted~~
- ~~Goes to the inquirer~~
- ~~Confirms receipt of their inquiry~~
- **Status:** Currently disabled - only pricing email is sent

### 2. **Admin Notification**
- Sent immediately when form is submitted
- Goes to hi@yourlovefilms.com
- Contains all form details

### 3. **Pricing & Availability Email**
- Sent 5 minutes after form is submitted
- Goes to the inquirer
- Contains pricing info and availability confirmation

### 4. **Day 1 Follow-Up**
- Sent automatically 24 hours after inquiry
- Only if inquiry status is still "new" or "contacted"
- Gentle reminder with CTA

### 5. **Day 3 Follow-Up**
- Sent automatically 72 hours after inquiry
- Only if inquiry status is still "new" or "contacted"
- Social proof story

### 6. **Day 4 Follow-Up**
- Sent automatically 96 hours (4 days) after inquiry
- Only if inquiry status is still "new" or "contacted"
- $100 retainer urgency

### 7. **Day 6 Follow-Up**
- Sent automatically 6 days after inquiry
- Only if inquiry status is still "new" or "contacted"
- Helpful guidance + soft date hold

### 8. **Day 10 Follow-Up**
- Sent automatically 10 days after inquiry
- Only if inquiry status is still "new" or "contacted"
- Gentle boundary - hold or release date

### 9. **Day 14 Follow-Up**
- Sent automatically 14 days after inquiry
- Only if inquiry status is still "new" or "contacted"
- Final breakup email

All templates can be **edited from the UI** at `/crm`!

---

## ⚙️ How Automated Follow-Ups Work

### Daily Cron Job

Every day at 9:00 AM UTC, Vercel runs `/api/cron/follow-ups` which:

1. Loads all inquiries from Firebase or local JSON
2. Checks each inquiry's creation date
3. For inquiries matching each follow-up day (1, 3, 4, 6, 10, 14):
   - Checks if that specific follow-up has already been sent
   - If not sent and inquiry status is "new" or "contacted":
     - Sends the follow-up email
     - Logs the email
     - Marks follow-up as sent with timestamp

### Preventing Duplicate Sends

- Each inquiry has a `followUpSentAt` field
- Once a follow-up is sent, it's marked with a timestamp
- Cron job checks this before sending
- **Result:** No duplicate follow-ups! 🎉

---

## 🗄️ Data Storage

All data is stored in JSON files (no external database needed):

- **Inquiries:** `/data/inquiries.json` (gitignored - not tracked)
- **Email Logs:** `/data/email-logs.json` (gitignored - not tracked)
- **Automation Settings:** `/data/automation-settings.json` (gitignored - not tracked)
- **Email Templates:** `/data/email-templates.json` ⚠️ **TRACKED IN GIT** - commit changes to persist!

**Important:** Email templates are tracked in Git so your customizations persist across deployments. After editing templates in the CRM, commit and push:

```bash
git add data/email-templates.json
git commit -m "Update email templates"
git push
```

---

## 🎨 Customizing Follow-Up Timing

Want to send follow-ups at different times? Edit the cron job logic:

**File:** `/app/api/cron/follow-ups/route.ts`

Change these conditions:
```typescript
// Day 1 Follow-Up (currently 24-48 hours)
if (daysSinceCreated >= 1 && daysSinceCreated < 2)

// Day 3 Follow-Up (currently 72-96 hours)
if (daysSinceCreated >= 3 && daysSinceCreated < 4)
```

You can also change the cron schedule in `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/follow-ups",
      "schedule": "0 9 * * *"  // 9 AM UTC daily
    }
  ]
}
```

**Cron Schedule Format:** `minute hour day month weekday`
- `0 9 * * *` = 9:00 AM daily
- `0 9,17 * * *` = 9:00 AM and 5:00 PM daily
- `0 9 * * 1-5` = 9:00 AM weekdays only

---

## 🧪 Testing Locally

To test the cron job on your local machine:

```bash
# Start dev server
npm run dev

# In another terminal, trigger cron manually:
curl http://localhost:3000/api/cron/follow-ups \
  -H "Authorization: Bearer your_cron_secret_here"
```

This will process all inquiries and send any pending follow-ups.

---

## 📈 Monitoring

### Check Email Logs
- Go to `/crm` → Email Logs tab
- See all sent emails with timestamps
- Check for failed sends

### Check Vercel Logs
- Vercel Dashboard → Your Project → Functions
- Filter by `/api/cron/follow-ups`
- See cron execution logs

### Check Resend Dashboard
- Go to resend.com → Your account
- See all emails sent
- Check delivery rates

---

## 🔐 Security

- Cron endpoint requires `CRON_SECRET` header
- Only Vercel can call the cron (with correct secret)
- Email admin requires password
- All environment variables are private

---

## ❓ FAQ

**Q: What if someone responds after Day 1 follow-up?**  
A: Right now, the system will still send Day 3 follow-up. In the future, we can add a webhook to mark inquiries as "contacted" when you reply.

**Q: Can I stop follow-ups for specific people?**  
A: Yes! In the CRM, change their status to "booked", "paid", or "dead" to stop all automation.

**Q: What if I want to add a Day 7 follow-up?**  
A: 1. Add a new template in `email-templates.json`, 2. Update the cron job to check for 7-day-old inquiries, 3. Add the sending logic. I can help with this!

**Q: Does this cost extra?**  
A: No! Cron jobs are free on Vercel. Emails count toward your Resend limit (3,000/month free).

**Q: Can I change the follow-up email content?**  
A: Yes! Go to `/crm`, log in, and edit the "Day 1 Follow-Up" and "Day 3 Follow-Up" templates.

**Q: Can I change how many days between follow-up emails?**  
A: The email timing is set automatically (Day 1, Day 3, Day 6, Day 10, Day 14). You can edit the email content in `/crm` → Email Automation tab.

---

## 🎉 That's It!

Your automated email system is ready to go. Every inquiry will automatically receive follow-ups, and you can track everything in the Email Logs dashboard.

**Need help?** All the code is in your project and fully customizable!

