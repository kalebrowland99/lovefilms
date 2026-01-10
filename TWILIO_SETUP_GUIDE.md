# 📱 Twilio SMS Setup Guide

## Quick Start (5 Minutes)

### Step 1: Sign Up for Twilio

1. Go to https://www.twilio.com/try-twilio
2. Create a free account
3. Verify your email and phone number

**You get $15 free credit** (~1,900 text messages!)

---

### Step 2: Get a Phone Number

1. In Twilio Console, go to: **Phone Numbers** → **Manage** → **Buy a number**
2. Search for a local number in your area code (looks more professional)
3. Make sure it has **SMS** capabilities
4. Buy the number (costs ~$1.15/month)

**Your Twilio Phone Number:** Save this - you'll need it!

---

### Step 3: Get Your API Credentials

1. In Twilio Console, go to **Dashboard** (or **Account** → **API keys & tokens**)
2. You'll see:
   - **Account SID** (starts with "AC...")
   - **Auth Token** (click to reveal)

**Copy both** - you'll paste these into your CRM

---

### Step 4: Add Credentials to Your Site

**🔒 Option A: Vercel Environment Variables (Recommended - More Secure)**

1. Go to your Vercel Dashboard
2. Navigate to: **Project Settings** → **Environment Variables**
3. Add three new variables:
   - `TWILIO_ACCOUNT_SID` = your Account SID
   - `TWILIO_AUTH_TOKEN` = your Auth Token
   - `TWILIO_PHONE_NUMBER` = +16155551234 (your Twilio number with +1)
4. Click **Save**
5. Redeploy your site

**✅ That's it!** Your credentials are now stored securely in Vercel.

---

**Option B: Enter in CRM UI (Fallback)**

If you prefer to manage credentials in the CRM:

1. Go to: `https://yourlovefilms.com/crm`
2. Login with your password
3. Click: **Text Automation** tab
4. Scroll to: **Twilio API Credentials** section
5. Paste:
   - Account SID
   - Auth Token
   - Twilio Phone Number (with +1, like: +16155551234)
6. Enable SMS (toggle switch)
7. Click: **Manual Save**

> **Note:** The system will prioritize environment variables over CRM settings for better security.

---

### Step 5: Customize Your SMS Templates

In the same SMS section, you'll see 3 text templates with **hardcoded timing**:

**Day 0: Welcome Text** (sends 45 seconds after inquiry)
- Default: Good as-is
- Timing: Fixed at 45 seconds, cannot be changed
- Edit if you want different tone

**Day 2: Call Preference** (sends on Day 2 at 9 AM UTC)
- Edit to match your availability/process
- Timing: Fixed at Day 2, cannot be changed

**Day 4: Date Hold** (sends on Day 4 at 9 AM UTC)
- Adjust urgency level if needed
- Timing: Fixed at Day 4, cannot be changed

**Keep under 160 characters!** Otherwise it splits into 2 texts (costs double).

**Note:** SMS timing is hardcoded for optimal engagement. You can only enable/disable and edit the message content.

---

### Step 6: Test It!

1. Submit a test inquiry on your contact form
2. Use your real phone number
3. You should receive a text within 5 minutes
4. Check: `/crm` → **Email Logs** → Look for SMS entries

---

## Pricing

**Twilio Costs:**
- Phone Number: ~$1.15/month
- SMS (US): ~$0.0079 per message sent
- SMS (US): ~$0.0040 per message received

**Example Monthly Cost:**
- 50 inquiries × 2 texts each = 100 texts
- 100 × $0.0079 = **$0.79/month** (plus $1.15 for number)
- **Total: ~$2/month for SMS**

**ROI:**
- If SMS helps book even 1 extra wedding = $2,000-$5,000+ value
- Worth it? Absolutely.

---

## Troubleshooting

### ❌ SMS Not Sending

**Check:**
1. SMS is **enabled** in CRM settings
2. All 3 credentials are correct (SID, token, number)
3. Twilio phone number includes **+1** country code
4. Inquirer provided phone number in form
5. You have Twilio credit remaining

**View Logs:**
- Go to Twilio Console → **Monitor** → **Logs** → **Messaging**
- See all sent/failed messages

---

### ❌ "Permission Denied" Error

**Issue:** Twilio trial accounts can only send to verified numbers

**Solution:**
1. Verify your test phone numbers in Twilio Console
2. OR upgrade to paid account (no credit card needed if using free credit)

---

### ❌ Messages Split Into Multiple Texts

**Issue:** Template is over 160 characters

**Solution:**
1. Go to CRM → Text Automation tab
2. Edit template to be shorter
3. Check character count (shown below each template)
4. Save

---

### ❌ Messages Sent to Wrong Number

**Issue:** Phone number formatting

**Solution:**
- System auto-formats US numbers
- Ensure Twilio number is: `+16155551234` (with +1)
- Inquirer's number can be: `(615) 555-1234` or `615-555-1234` (will auto-format)

---

## Best Practices

### ✅ DO:
- Use first name only ({{name}} → "Sarah", not "Sarah & Mike")
- Keep under 160 characters
- Include your business name at end
- Make it easy to respond (yes/no questions)
- Send from a local area code number

### ❌ DON'T:
- Don't spam (1-3 texts total is plenty)
- Don't use all caps or excessive emojis
- Don't send after 9 PM or before 9 AM (respect timezones)
- Don't send if they unsubscribe or say "stop"
- Don't use link shorteners (looks spammy)

---

## Advanced: Auto-Replies

Want to respond to incoming texts automatically?

**Option 1: Twilio Studio (Free)**
- Visual flow builder
- Auto-reply to common keywords ("STOP", "YES", "NO")
- Forward texts to your email

**Option 2: Webhook (Custom)**
- Add webhook endpoint to your site
- Respond programmatically
- Update inquiry status based on reply

*(Let me know if you want to implement this!)*

---

## Compliance & Legal

### CAN-SPAM & TCPA:
- ✅ Only text people who gave you their number
- ✅ Include business name in message
- ✅ Honor "STOP" requests immediately
- ✅ Provide way to opt-out

**Twilio handles "STOP" automatically** - messages won't send to opted-out numbers.

---

## That's It!

You're now set up to send automated SMS texts to wedding inquiries. This typically **doubles response rates** compared to email-only follow-ups.

**Questions?** Check Twilio docs or your CRM Email Logs for delivery status.

**Happy texting! 📱**

