# Email Admin Panel Setup

## Access the Admin Panel

Visit: **https://yourlovefilms.com/crm** (or `http://localhost:3000/crm` locally)

## Default Login

- **Password:** `yourlovefilms2026`

## Change the Password

To change the admin password, add this to your `.env.local` file:

```
EMAIL_ADMIN_PASSWORD=your_custom_password_here
```

Then restart your development server or redeploy.

## What You Can Do

✅ Edit email templates with a visual UI  
✅ Change subject lines, greetings, paragraphs, buttons, footers  
✅ Enable/disable specific emails  
✅ Preview emails before saving  
✅ Use dynamic variables like `{{name}}` and `{{weddingDate}}`  

## Available Email Templates

### 1. **Welcome Email (Sent to Inquirer)**
- Automatically sent to the person who fills out your contact form
- Confirms you received their inquiry
- Can include links to your portfolio, booking calendar, etc.

### 2. **Admin Notification (Sent to You)**
- Sent to hi@yourlovefilms.com
- Contains all the form submission details
- Alerts you when you have a new inquiry

## Dynamic Variables

You can use these variables in your email content:

- `{{name}}` - The inquirer's name
- `{{weddingDate}}` - Their wedding date

## How It Works

1. Someone fills out your contact form
2. The system loads the email templates from `data/crm-templates.json`
3. It replaces `{{variables}}` with actual data
4. Sends the personalized emails via Resend
5. You can edit templates anytime at `/crm`

## Technical Details

- Templates are stored in: `data/crm-templates.json`
- This file is tracked in Git, so changes persist across deployments
- Authentication is session-based (stored in browser)
- Changes take effect immediately after saving

## Security Notes

- The admin panel is password-protected
- Always change the default password in production
- Keep your `RESEND_API_KEY` and `EMAIL_ADMIN_PASSWORD` secure
- Never commit `.env.local` to Git

## Need Help?

- Templates not saving? Check file permissions on `data/` folder
- Emails not sending? Verify `RESEND_API_KEY` is set
- Can't login? Check `EMAIL_ADMIN_PASSWORD` in your environment

