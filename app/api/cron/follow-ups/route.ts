import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import { renderTemplate, renderSubject } from '@/lib/email-renderer';
import { sendSMS, renderSMSTemplate, formatPhoneNumber, isSMSConfigured } from '@/lib/sms';
import { 
  getInquiries, 
  updateInquiry, 
  saveEmailLog, 
  generateId,
  type Inquiry,
  type EmailLog 
} from '@/lib/database';

const resend = new Resend(process.env.RESEND_API_KEY);

// This endpoint will be called daily by Vercel Cron
export async function GET(request: Request) {
  // Verify the request is from Vercel Cron (security)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('Running follow-up cron job...');

  try {
    // Load email templates
    const templatesPath = path.join(process.cwd(), 'data', 'email-templates.json');
    const fileContents = fs.readFileSync(templatesPath, 'utf8');
    const templates = JSON.parse(fileContents);

    // Load automation settings
    const settingsPath = path.join(process.cwd(), 'data', 'automation-settings.json');
    let settings: any = {
      followUpDelays: {
        day1: { enabled: true, delayInDays: 1 },
        day3: { enabled: true, delayInDays: 3 }
      }
    };
    
    try {
      const settingsContents = fs.readFileSync(settingsPath, 'utf8');
      settings = JSON.parse(settingsContents);
    } catch (error) {
      console.warn('Could not load automation settings, using defaults');
    }

    // Get all inquiries
    const inquiries = getInquiries();
    const now = new Date();
    
    const emailsSent: Record<string, number> = {
      day1: 0,
      day3: 0,
      day6: 0,
      day10: 0,
      day14: 0
    };
    
    const smsSent: Record<string, number> = {
      day2: 0,
      day4: 0
    };

    // Map of follow-up keys to template keys
    const followUpMap: Record<string, { templateKey: string; emailType: string }> = {
      day1: { templateKey: 'followupDay1', emailType: 'followup-day1' },
      day3: { templateKey: 'followupDay3', emailType: 'followup-day3' },
      day6: { templateKey: 'followupDay6', emailType: 'followup-day6' },
      day10: { templateKey: 'followupDay10', emailType: 'followup-day10' },
      day14: { templateKey: 'followupDay14', emailType: 'followup-day14' }
    };

    for (const inquiry of inquiries) {
      // Skip if not in 'new' or 'contacted' status
      // 'booked' and 'dead' stop all automation
      if (inquiry.status !== 'new' && inquiry.status !== 'contacted') continue;

      const createdAt = new Date(inquiry.createdAt);
      const daysSinceCreated = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

      // Process each email follow-up dynamically
      for (const [followUpKey, config] of Object.entries(settings.followUpDelays)) {
        const delay = (config as any).delayInDays;
        const mapping = followUpMap[followUpKey];
        
        if (!mapping) continue; // Skip if no mapping exists
        
        // Check if this follow-up should be sent
        if ((config as any).enabled && 
            daysSinceCreated >= delay && 
            daysSinceCreated < delay + 1 && 
            !inquiry.followUpSentAt?.[followUpKey as keyof typeof inquiry.followUpSentAt]) {
          
          const template = templates[mapping.templateKey];
          if (template && template.enabled) {
            await sendFollowUp(
              inquiry, 
              template, 
              mapping.emailType as any, 
              followUpKey as any
            );
            emailsSent[followUpKey as keyof typeof emailsSent]++;
          }
        }
      }
      
      // Process SMS follow-ups (Day 2 and Day 4)
      if (inquiry.phone && settings.sms && isSMSConfigured(settings)) {
        // Day 2: Call Preference
        if (settings.sms.templates.day2?.enabled && 
            daysSinceCreated >= 2 && 
            daysSinceCreated < 3 && 
            !inquiry.smsSentAt?.day2) {
          await sendSMSFollowUp(inquiry, settings, 'day2');
          smsSent.day2++;
        }
        
        // Day 4: Date Hold Text
        if (settings.sms.templates.day4?.enabled && 
            daysSinceCreated >= 4 && 
            daysSinceCreated < 5 && 
            !inquiry.smsSentAt?.day4) {
          await sendSMSFollowUp(inquiry, settings, 'day4');
          smsSent.day4++;
        }
      }
    }

    console.log(`Follow-up cron completed. Emails:`, emailsSent, 'SMS:', smsSent);

    return NextResponse.json({
      success: true,
      message: `Processed ${inquiries.length} inquiries`,
      sent: { emails: emailsSent, sms: smsSent }
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 });
  }
}

async function sendFollowUp(
  inquiry: Inquiry,
  template: any,
  templateType: 'followup-day1' | 'followup-day3',
  followUpDay: 'day1' | 'day3'
) {
  try {
    const emailData = {
      name: inquiry.name,
      fianceName: inquiry.fianceName,
      weddingDate: inquiry.weddingDate,
      venue: inquiry.venue,
      formData: inquiry
    };

    const emailHtml = renderTemplate(template, emailData);
    const emailSubject = renderSubject(template.subject, emailData);

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Your Love Films <contact@yourlovefilms.com>',
      to: inquiry.email,
      subject: emailSubject,
      html: emailHtml,
      replyTo: 'hi@yourlovefilms.com',
    });

    if (error) {
      console.error(`Failed to send ${followUpDay} follow-up to ${inquiry.email}:`, error);
      
      // Log failed email
      const log: EmailLog = {
        id: generateId(),
        inquiryId: inquiry.id,
        recipientEmail: inquiry.email,
        recipientName: inquiry.name,
        templateType: templateType,
        subject: emailSubject,
        sentAt: new Date().toISOString(),
        status: 'failed',
        error: String(error),
      };
      saveEmailLog(log);
      
      return;
    }

    // Log successful email
    const log: EmailLog = {
      id: generateId(),
      inquiryId: inquiry.id,
      recipientEmail: inquiry.email,
      recipientName: inquiry.name,
      templateType: templateType,
      subject: emailSubject,
      sentAt: new Date().toISOString(),
      status: 'sent',
    };
    saveEmailLog(log);

    // Update inquiry with follow-up timestamp
    const updates: Partial<Inquiry> = {
      followUpSentAt: {
        ...inquiry.followUpSentAt,
        [followUpDay]: new Date().toISOString()
      }
    };
    updateInquiry(inquiry.id, updates);

    console.log(`Sent ${followUpDay} follow-up to ${inquiry.email}`);

  } catch (error) {
    console.error(`Error sending follow-up to ${inquiry.email}:`, error);
  }
}

async function sendSMSFollowUp(
  inquiry: Inquiry,
  settings: any,
  smsDay: 'day2' | 'day4'
) {
  try {
    const smsTemplate = settings.sms.templates[smsDay];
    if (!smsTemplate) return;
    
    const smsData = {
      name: inquiry.name.split(' ')[0], // First name only for SMS
      fianceName: inquiry.fianceName ? inquiry.fianceName.split(' ')[0] : '',
      weddingDate: inquiry.weddingDate,
      venue: inquiry.venue
    };
    
    const smsMessage = renderSMSTemplate(smsTemplate.message, smsData);
    const formattedPhone = formatPhoneNumber(inquiry.phone);
    
    const smsResult = await sendSMS(
      formattedPhone,
      smsMessage,
      {
        accountSid: settings.sms.twilioAccountSid,
        authToken: settings.sms.twilioAuthToken,
        fromNumber: settings.sms.twilioPhoneNumber
      }
    );
    
    // Log SMS
    const smsLog: EmailLog = {
      id: generateId(),
      inquiryId: inquiry.id,
      recipientEmail: inquiry.phone, // Store phone in email field
      recipientName: inquiry.name,
      templateType: 'sms' as any,
      subject: `SMS: ${smsTemplate.name}`,
      sentAt: new Date().toISOString(),
      status: smsResult.success ? 'sent' : 'failed',
      error: smsResult.error,
      messageType: 'sms'
    };
    saveEmailLog(smsLog);
    
    if (smsResult.success) {
      // Update inquiry with SMS timestamp
      const updates: Partial<Inquiry> = {
        smsSentAt: {
          ...inquiry.smsSentAt,
          [smsDay]: new Date().toISOString()
        }
      };
      updateInquiry(inquiry.id, updates);
      console.log(`Sent ${smsDay} SMS to ${inquiry.phone}`);
    } else {
      console.error(`SMS ${smsDay} failed for ${inquiry.phone}:`, smsResult.error);
    }
  } catch (error) {
    console.error(`Error sending SMS to ${inquiry.phone}:`, error);
  }
}

