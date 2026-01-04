# Domain Verification for Email Sending

## Current Status
- Emails are currently being sent to: **kalebrowland99@gmail.com** (test mode)
- Target email: **hi@yourlovefilms.com**

## To Enable Production Email Sending:

### Step 1: Verify Domain in Resend

1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter: `yourlovefilms.com`
4. You'll receive DNS records to add

### Step 2: Add DNS Records to Your Domain

Add these records to your domain registrar (GoDaddy, Namecheap, etc.):
- SPF record
- DKIM record
- DMARC record (optional but recommended)

Resend will show you exactly what to add.

### Step 3: Update the Code

After domain verification, update `/app/api/contact/route.ts`:

Change:
```typescript
from: 'Wedding Inquiries <onboarding@resend.dev>',
to: 'kalebrowland99@gmail.com',
```

To:
```typescript
from: 'Wedding Inquiries <contact@yourlovefilms.com>',
to: 'hi@yourlovefilms.com',
```

### Step 4: Test

Submit a form and check hi@yourlovefilms.com!

---

## Alternative: Use Gmail Forwarding (Quick Fix)

If you don't want to verify the domain yet, you can:
1. Keep sending to kalebrowland99@gmail.com
2. Set up Gmail forwarding to hi@yourlovefilms.com
