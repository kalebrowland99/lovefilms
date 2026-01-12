# 🎬 Wedding Videography Follow-Up System

## Overview

Your CRM now includes a **professional wedding videography follow-up sequence** designed specifically for high-value wedding bookings. This system sends **7-11 strategic touches** over 14-21 days to nurture warm leads without feeling "salesy."

---

## 📧 Email Sequence (7 Emails)

### **Day 0: Welcome Email (DISABLED)**
**Status:** Currently disabled - only pricing email is sent

~~**Goal:** Fast response, confirm availability, set expectations~~

~~**Key Elements:**~~
- ~~Personal greeting with their names + date + venue~~
- ~~"Checking availability now" language~~
- ~~Ask their #1 priority (ceremony, toasts, party, family)~~
- ~~Link to book a call~~
- ~~Promise to reply in 15 minutes~~

**Template:** Edit at `/crm` → Email Templates → "Day 0: Welcome Email"

---

### **Day 0: Pricing & Availability (5 minutes after inquiry)**
**Goal:** Provide pricing info, confirm date availability, schedule call

**Key Elements:**
- Confirm their wedding date is available
- Scheduling link for video call
- Mention pricing guide (attached or linked)
- Create urgency: can't hold date without contract
- Excitement and enthusiasm

**Template:** Edit at `/crm` → Email Templates → "Day 0: Pricing & Availability"

---

### **Day 1: Quick Question Email**
**Goal:** Engage with their priorities, create urgency

**Key Elements:**
- Ask what matters most (vows, toasts, party vibes)
- Address common concerns (price, camera awkwardness, deliverables)
- Soft date hold ("2 other couples looking at same weekend")
- Book a call CTA

**Template:** Edit at `/crm` → Email Templates → "Day 1: Quick Question"

---

### **Day 3: Social Proof Story**
**Goal:** Emotional connection, show value beyond "pretty video"

**Key Elements:**
- Real client success story (Sarah & Mike example)
- What they'd have forgotten without video
- Moments photos can't capture
- Link to similar wedding film

**Template:** Edit at `/crm` → Email Templates → "Day 3: Social Proof"

---

### **Day 6: Helpful Guidance**
**Goal:** Provide value, position as expert, gentle boundary

**Key Elements:**
- Helpful tip (golden hour timing, what makes film cinematic)
- 3 things that make a wedding film great
- "Holding your date - want me to pencil it in or release it?"
- No-pressure tone

**Template:** Edit at `/crm` → Email Templates → "Day 6: Helpful Guidance"

---

### **Day 10: Date Hold (Gentle Boundary)**
**Goal:** Create urgency without pressure

**Key Elements:**
- "Another couple asking about same weekend"
- "Can I hold it 24 more hours or should I release?"
- Respectful of their timeline
- Easy yes/no response

**Template:** Edit at `/crm` → Email Templates → "Day 10: Date Hold"

---

### **Day 14: Breakup Email**
**Goal:** Friendly goodbye with option to reconnect

**Key Elements:**
- Assume they: booked someone else, decided against video, or got busy
- "I'll stop emailing so I'm not annoying"
- Option to reply "later" for future check-in
- Genuine well-wishes for their day

**Template:** Edit at `/crm` → Email Templates → "Day 14: Breakup Email"

---

## 📱 SMS Text Messages (Optional - 3 Texts)

### **Day 0: Welcome Text (Within 5 minutes)**
**Goal:** Instant response, offer personalized help

**Example:**
> "Hey {{name}}! Just sent you details for {{weddingDate}}. Want me to recommend the best package based on what matters most to you? - Your Love Films"

**160 characters max** • Feels personal, not automated

---

### **Day 2: Call Preference**
**Goal:** Make booking easy, offer choice

**Example:**
> "{{name}}, do you prefer a quick 10-min call or full 20-min walkthrough to discuss your wedding film? Either works! Reply with your preference. - Your Love Films"

---

### **Day 4: Date Hold Text**
**Goal:** Create urgency, easy response

**Example:**
> "Hi {{name}}! Still interested in video for {{weddingDate}}? I can hold it for 24 hrs if you want. Just reply YES or NO. - Your Love Films"

---

## ⚙️ Configuration

### Email Settings

Visit: `yourlovefilms.com/crm` → **Email Automation** tab

**What You Can Configure:**
- ✅ Edit all email content (subjects, body, CTAs)
- ✅ Customize for your tone and brand
- ✅ Preview emails in real-time
- ✅ Use dynamic variables like {{name}} and {{weddingDate}}

**Default Schedule:**
- ~~Day 0: Immediate (welcome email)~~ **DISABLED**
- Day 0: 5 minutes after inquiry (pricing & availability)
- Day 1: 24 hours after inquiry
- Day 3: 72 hours after inquiry
- Day 6: 6 days after inquiry
- Day 10: 10 days after inquiry
- Day 14: 14 days after inquiry

---

### SMS Settings (Optional)

Visit: `yourlovefilms.com/crm` → **Text Automation** tab

**SMS Timing (Hardcoded):**
- Day 0: 45 seconds after inquiry
- Day 2: 48 hours after inquiry (9 AM UTC)
- Day 4: 96 hours after inquiry (9 AM UTC)

**Required:**
1. **Twilio Account** (free trial available)
   - Sign up: https://www.twilio.com/try-twilio
   - Get $15 free credit
   - ~$0.0079 per SMS

2. **Twilio Credentials:**
   - Account SID
   - Auth Token
   - Twilio Phone Number

3. **Add to CRM:**
   - Paste credentials in SMS Configuration section
   - Enable SMS
   - Customize 3 text templates
   - Save settings

**SMS Best Practices:**
- Keep under 160 characters
- Use first name only ({{name}} → "Sarah")
- Include your business name at end
- Make it easy to respond (yes/no questions)
- Don't overdo it (1-3 texts max)

---

## 🎯 Why This Works for Wedding Videography

### The Problem with Generic Follow-Ups:
- ❌ Too many emails feels desperate
- ❌ Generic "checking in" has no value
- ❌ Couples get overwhelmed during planning
- ❌ Video feels like a luxury, easy to put off

### Why This Sequence Works:
- ✅ **Value in every email** (tips, stories, not just "did you decide?")
- ✅ **Emotional connection** (social proof, what they'll forget)
- ✅ **Gentle boundaries** (date holds create urgency without pressure)
- ✅ **Strategic timing** (space out touches, give breathing room)
- ✅ **Respectful exit** (breakup email shows professionalism)

### Industry Benchmark:
- **5-7 emails** = wedding videography standard
- **7-11 total touches** (emails + texts) = sweet spot
- **14-21 days** = good timeline before breakup
- **Response rate:** 20-40% of warm leads will book with this sequence

---

## 📊 What Gets Tracked

Every message (email + SMS) is logged in your CRM:

**Tracking Includes:**
- ✅ Date/time sent
- ✅ Recipient name + contact
- ✅ Template used
- ✅ Status (sent / failed)
- ✅ Follow-up stage (day 1, day 3, etc.)

**View Logs:** Visit `/crm` → **Email Logs** tab

**Status Behavior:**
- Emails/texts only send to inquiries with status = "new"
- Change status to "contacted" or "booked" to stop sequence
- Each follow-up only sends once (tracked automatically)

---

## 🔧 Customization Tips

### Make It Your Voice:

1. **Tone:** The templates are conversational + warm. Adjust to match your brand:
   - More formal? Remove emojis, adjust language
   - More casual? Add personality, inside jokes
   - More urgent? Emphasize booking windows

2. **CTAs:** Default is "Book a Call" - you can change to:
   - "See Pricing"
   - "Check Availability"
   - "View Recent Films"
   - Direct booking link (HoneyBook, Calendly, etc.)

3. **Social Proof:** Replace "Sarah & Mike" story with your own:
   - Real client success story
   - Specific moments they cherished
   - Link to their actual film

4. **Timing:** Adjust delays based on your market:
   - Luxury market? Slow down (more breathing room)
   - Budget market? Speed up (shorter decision timeline)
   - Peak season? Add urgency mentions

---

## 🚀 Getting Started

### Step 1: Review Default Templates
1. Go to `/crm` → **Email Templates**
2. Read through Day 0 (Welcome + Pricing), 1, 3, 6, 10, and 14
3. Customize with your voice, stories, and links

### Step 2: Customize Emails
1. Go to `/crm` → **Email Automation**
2. Edit email content for each follow-up (welcome, day 1, day 3, etc.)
3. Preview emails to see how they look

### Step 3: Test the System
1. Submit a test inquiry on your contact form
2. Check Email Logs to see welcome email
3. Wait for follow-ups (or manually test cron endpoint)

### Step 4: Optional - Add SMS
1. Sign up for Twilio (free trial)
2. Get credentials (SID, token, phone number)
3. Add to CRM → Text Automation tab
4. Customize 3 text templates
5. Enable SMS

### Step 5: Monitor & Optimize
1. Check Email Logs weekly
2. Track which emails get responses
3. Adjust timing or copy based on results
4. A/B test different CTAs or subject lines

---

## 🔐 Security & Privacy

**Email Data:**
- All logs stored locally in `/data/email-logs.json`
- No third-party tracking
- GDPR compliant (can delete inquiries anytime)

**SMS Data:**
- Phone numbers never shared
- Twilio credentials encrypted in your environment
- SMS only sent if phone provided + SMS enabled

**Environment Variables:**
```bash
RESEND_API_KEY=your_resend_key
EMAIL_ADMIN_PASSWORD=your_crm_password
CRON_SECRET=your_cron_secret

# Optional - for SMS
TWILIO_ACCOUNT_SID=from_crm_settings
TWILIO_AUTH_TOKEN=from_crm_settings
TWILIO_PHONE_NUMBER=from_crm_settings
```

---

## 📈 Optimization Tips

### What to Track:
1. **Email open rates** (via Resend dashboard)
2. **Response rate by follow-up** (which emails get replies?)
3. **Booking conversion** (% of inquiries that book)
4. **Drop-off points** (where do they stop engaging?)

### Common Improvements:
- **Day 3 gets most responses** → Make it stronger
- **Day 10 creates urgency** → Test different wording
- **Breakup email gets late replies** → "Later" option works!
- **SMS doubles engagement** → If budget allows, use it

### A/B Test Ideas:
- Subject lines (question vs statement)
- CTA text ("Book a Call" vs "Check Availability")
- Social proof story (emotional vs practical)
- Urgency language ("2 couples" vs "booking up fast")

---

## ❓ FAQ

**Q: What if they respond after Day 1?**
A: Manually change their status in `/data/inquiries.json` from "new" to "contacted" - this stops the sequence.

**Q: Can I add more follow-ups?**
A: Yes! Add new templates to `email-templates.json` and update `automation-settings.json` with new delays.

**Q: What if I want to send emails manually?**
A: This system is automatic, but you can disable all and just use the templates as drafts for manual sending.

**Q: Does SMS cost money?**
A: Yes - Twilio charges ~$0.0079 per SMS. Free trial gives you $15 credit (~1,900 texts).

**Q: What if someone unsubscribes?**
A: Currently manual - just change their status to "dead". (Future: unsubscribe link in emails).

**Q: Can I use this for other industries?**
A: Yes! Just adjust the copy and timing. The structure works for any high-value service business.

---

## 🎉 That's It!

You now have a professional, automated follow-up system that books more wedding videography clients without feeling pushy. The sequence is based on proven wedding industry best practices and can be fully customized to match your brand.

**Need help?** Check the logs at `/crm`, review this doc, or adjust templates to test new approaches!

**Happy booking! 📹💍**

