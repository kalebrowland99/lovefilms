# Email Setup Instructions

Your contact form is now configured to send submissions to **hi@yourlovefilms.com**.

## Current Status
The form currently logs submissions to the console. To enable actual email sending, follow these steps:

## Option 1: Resend (Recommended - Free & Easy)

1. **Sign up for Resend** (free tier includes 3,000 emails/month)
   - Visit: https://resend.com
   - Create an account

2. **Get your API key**
   - Go to API Keys section
   - Create a new API key
   - Copy the key

3. **Install Resend**
   ```bash
   npm install resend
   ```

4. **Add to your .env.local file**
   ```
   RESEND_API_KEY=your_api_key_here
   ```

5. **Update `/app/api/contact/route.ts`**
   ```typescript
   import { Resend } from 'resend';
   
   const resend = new Resend(process.env.RESEND_API_KEY);
   
   // In the POST function, replace the console.log with:
   await resend.emails.send({
     from: 'Contact Form <onboarding@resend.dev>', // Change after domain verification
     to: 'hi@yourlovefilms.com',
     subject: 'New Wedding Inquiry from ' + formData.name,
     html: `
       <h2>New Wedding Inquiry</h2>
       <p><strong>Name:</strong> ${formData.name}</p>
       <p><strong>Email:</strong> ${formData.email}</p>
       <p><strong>Phone:</strong> ${formData.phone}</p>
       <p><strong>Instagram Name:</strong> ${formData.fianceName}</p>
       <p><strong>Wedding Date:</strong> ${formData.weddingDate}</p>
       <p><strong>Wedding Venue:</strong> ${formData.venue}</p>
       <p><strong>Videographer Booked:</strong> ${formData.videographer}</p>
     `
   });
   ```

## Option 2: SendGrid

1. Sign up at https://sendgrid.com
2. Install: `npm install @sendgrid/mail`
3. Add API key to `.env.local`
4. Update the API route similarly

## Option 3: Nodemailer (with Gmail)

For using your own email server or Gmail SMTP.

---

## Testing

After setup, test the form at:
- Local: http://localhost:3000/contact
- Production: https://yourlovefilms.com/contact

The form will email all submissions to **hi@yourlovefilms.com**

