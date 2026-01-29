# Manual Email Enrollment Feature

## Overview
The Manual Enrollment tab in the CRM allows you to add people to a **separate** email automation flow. This is different from the regular inquiry automation that triggers when someone fills out your website forms.

## Use Cases
- People you meet at wedding shows or events
- Referrals from other vendors
- Past clients you want to re-engage
- People who reached out via social media or phone
- Anyone you want to add to your email list manually

## How It Works

### 1. Access the Feature
1. Go to your CRM at `/crm`
2. Log in with your admin password
3. Click the **"✉️ Manual Enrollment"** tab

### 2. Enter Contact Information
Required fields:
- **Name** - The person's full name
- **Email** - Their email address (required for email automation)

Optional fields:
- **Phone Number** - For your records
- **Instagram Name** - Their Instagram handle
- **Wedding Date** - If known
- **Wedding Venue** - If known

### 3. What Happens When You Enroll Someone

**Immediate Actions:**
1. Person is saved to your database with "contacted" status and marked as manual enrollment
2. They receive a custom welcome email (using `manualWelcome` template)
3. You receive an admin notification email

**Separate Automation:**
- This uses **completely different email templates** than your regular inquiry flow
- Manual enrollments have their own set of follow-up emails:
  - `manualWelcome` - Welcome email (sent immediately)
  - `manualAdmin` - Admin notification (sent immediately)
  - `manualFollowupDay1` - First follow-up (1 day after enrollment)
  - `manualFollowupDay3` - Second follow-up (3 days after enrollment)
  - `manualFollowupDay6` - Third follow-up (6 days after enrollment)
  - `manualFollowupDay10` - Fourth follow-up (10 days after enrollment)
  - `manualFollowupDay14` - Final follow-up (14 days after enrollment)
- You can customize all these templates directly in the Manual Enrollment tab

### 4. Customizing the Templates

In the **Manual Enrollment tab**, scroll down to see the template editor with all manual enrollment templates:

#### Available Templates:

1. **Manual Enrollment Welcome** (`manualWelcome`)
   - **Sent To:** The enrolled person
   - **When:** Immediately after enrollment
   - **Purpose:** Welcome them and invite them to schedule a call

2. **Manual Enrollment Admin Notification** (`manualAdmin`)
   - **Sent To:** You (hi@yourlovefilms.com)
   - **When:** Immediately after enrollment
   - **Purpose:** Notify you that someone was manually enrolled

3. **Manual Follow-up Day 1** (`manualFollowupDay1`)
   - **Sent To:** The enrolled person
   - **When:** 1 day after enrollment
   - **Purpose:** Quick follow-up to see if they have questions

4. **Manual Follow-up Day 3** (`manualFollowupDay3`)
   - **Sent To:** The enrolled person
   - **When:** 3 days after enrollment
   - **Purpose:** Check in about their wedding video plans

5. **Manual Follow-up Day 6** (`manualFollowupDay6`)
   - **Sent To:** The enrolled person
   - **When:** 6 days after enrollment
   - **Purpose:** Remind them dates are filling up

6. **Manual Follow-up Day 10** (`manualFollowupDay10`)
   - **Sent To:** The enrolled person
   - **When:** 10 days after enrollment
   - **Purpose:** Last chance to secure their date

7. **Manual Follow-up Day 14** (`manualFollowupDay14`)
   - **Sent To:** The enrolled person
   - **When:** 14 days after enrollment
   - **Purpose:** Final follow-up

You can edit all templates directly in the Manual Enrollment tab - no need to switch between tabs!

## Differences from Regular Inquiry Automation

| Feature | Regular Inquiry | Manual Enrollment |
|---------|----------------|-------------------|
| Trigger | Form submission | Manual CRM entry |
| Status | Starts as "new" | Starts as "contacted" |
| Welcome Email | `availabilityday0` template | `manualWelcome` template |
| Follow-ups | `followupDay1-14` templates | `manualFollowupDay1-14` templates |
| Admin Notification | `inquiry` template | `manualAdmin` template |
| Template Location | Email Automation tab | Manual Enrollment tab |
| Tracking | `followUpSentAt` field | `manualFollowUpSentAt` field |

## Follow-Up Automation

People enrolled manually receive **completely separate** follow-up emails from regular inquiries:

- **Day 1:** Quick follow-up to see if they have questions
- **Day 3:** Check in about their wedding video plans
- **Day 6:** Remind them dates are filling up
- **Day 10:** Last chance to secure their date
- **Day 14:** Final follow-up

These follow-ups will continue **unless** you:
1. Change their status to "booked" or "dead" (which stops all automation)
2. Disable specific follow-up templates in the Manual Enrollment tab

## Tracking

- All enrolled people appear in the **Leads** tab
- All emails sent appear in the **Logs** tab
- They're marked with status "contacted" by default
- You can update their status anytime in the Leads tab

## Tips

1. **Add context:** Use the Instagram Name or Venue fields to remember where you met them
2. **Keep it organized:** Update their status as you follow up
3. **Customize the welcome:** Edit the `manualWelcome` template to mention where you met or why they're receiving the email
4. **Track in Logs:** Check the Logs tab to confirm emails were sent successfully

## Template Variables

When customizing the manual enrollment templates, you can use these variables:

- `{{name}}` - Their full name
- `{{fianceName}}` - Instagram name
- `{{email}}` - Email address
- `{{phone}}` - Phone number
- `{{weddingDate}}` - Wedding date
- `{{venue}}` - Wedding venue

## Example Use Case

**Scenario:** You meet someone at a bridal show who's interested but doesn't have their phone to fill out your form.

**Steps:**
1. Get their name and email
2. Later, go to CRM → Manual Enrollment tab
3. Enter their info: "Sarah Johnson, sarah@example.com"
4. Add note in Instagram field: "Met at Nashville Bridal Show 2026"
5. Click "Enroll in Manual Automation"
6. They immediately receive your custom welcome email
7. You get a notification that they were enrolled
8. Follow up with them using the lead tracking in CRM

---

## Need Help?

If you need to customize this feature further or add different automation flows for manual enrollments, you can:
- Edit the templates in the Email Automation tab
- Modify the automation timing in the Text Automation tab
- Adjust follow-up schedules for specific leads
