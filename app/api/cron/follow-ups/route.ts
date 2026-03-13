import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import { renderTemplate, renderSubject } from '@/lib/email-renderer';
import { sendSMS, renderSMSTemplate, formatPhoneNumber, isSMSConfigured, getSMSConfig } from '@/lib/sms';
import { 
  getInquiries, 
  updateInquiry, 
  saveEmailLog, 
  generateId,
  getAutomationSettings,
  getEmailTemplates,
  type Inquiry,
  type EmailLog 
} from '@/lib/database';

const resend = new Resend(process.env.RESEND_API_KEY);

// This endpoint will be called daily by Vercel Cron
export async function GET(request: Request) {
  // Verify the request is from Vercel Cron (security)
  const authHeader = request.headers.get('authorization');
  const CRON_SECRET = process.env.CRON_SECRET;
  
  // If CRON_SECRET is set, verify it matches
  if (CRON_SECRET) {
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      console.error('❌ Unauthorized cron request. Auth header:', authHeader);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else {
    console.warn('⚠️ CRON_SECRET not set - cron endpoint is not secured!');
  }

  console.log('Running follow-up cron job...');

  try {
    // Load email templates from Firebase
    const templates = await getEmailTemplates();
    
    if (!templates) {
      console.error('Email templates not found in Firebase');
      return NextResponse.json({ 
        error: 'Email templates not configured',
        sent: { emails: 0, sms: 0 } 
      }, { status: 500 });
    }

    // Load automation settings from Firebase
    let settings = await getAutomationSettings();
    
    if (!settings) {
      console.error('Automation settings not found in Firebase');
      return NextResponse.json({ 
        error: 'Automation settings not configured',
        sent: { emails: 0, sms: 0 } 
      }, { status: 500 });
    }

    // Ensure followUpDelays exists (e.g. old DB documents may lack it) so manual + form follow-ups run
    const defaultFollowUpDelays: Record<string, { enabled: boolean; delayInDays: number; name: string; description: string }> = {
      day1: { enabled: true, delayInDays: 1, name: 'Day 1', description: '' },
      day3: { enabled: true, delayInDays: 3, name: 'Day 3', description: '' },
      day4: { enabled: true, delayInDays: 4, name: 'Day 4', description: '' },
      day6: { enabled: true, delayInDays: 6, name: 'Day 6', description: '' },
      day10: { enabled: true, delayInDays: 10, name: 'Day 10', description: '' },
      day14: { enabled: true, delayInDays: 14, name: 'Day 14', description: '' },
    };
    if (!settings.followUpDelays || Object.keys(settings.followUpDelays).length === 0) {
      console.warn('followUpDelays missing in automation settings, using defaults');
      settings = { ...settings, followUpDelays: defaultFollowUpDelays };
    }

    // Get all inquiries
    const inquiries = await getInquiries();
    const now = new Date();
    
    const emailsSent: Record<string, number> = {
      day1: 0,
      day3: 0,
      day4: 0,
      day6: 0,
      day10: 0,
      day14: 0
    };
    
    const smsSent: Record<string, number> = {
      day2: 0,
      day4: 0
    };

    // Map of follow-up keys to template keys (for regular inquiries)
    const followUpMap: Record<string, { templateKey: string; emailType: string }> = {
      day1: { templateKey: 'followupDay1', emailType: 'followup-day1' },
      day3: { templateKey: 'followupDay3', emailType: 'followup-day3' },
      day4: { templateKey: 'followupDay4', emailType: 'followup-day4' },
      day6: { templateKey: 'followupDay6', emailType: 'followup-day6' },
      day10: { templateKey: 'followupDay10', emailType: 'followup-day10' },
      day14: { templateKey: 'followupDay14', emailType: 'followup-day14' }
    };

    // Map for manual enrollment follow-ups (separate templates)
    const manualFollowUpMap: Record<string, { templateKey: string; emailType: string }> = {
      day1: { templateKey: 'manualFollowupDay1', emailType: 'manual-followup-day1' },
      day3: { templateKey: 'manualFollowupDay3', emailType: 'manual-followup-day3' },
      day4: { templateKey: 'manualFollowupDay4', emailType: 'manual-followup-day4' },
      day6: { templateKey: 'manualFollowupDay6', emailType: 'manual-followup-day6' },
      day10: { templateKey: 'manualFollowupDay10', emailType: 'manual-followup-day10' },
      day14: { templateKey: 'manualFollowupDay14', emailType: 'manual-followup-day14' }
    };

    for (const inquiry of inquiries) {
      // Skip if not in 'new' or 'contacted' status
      // 'booked', 'paid', and 'dead' stop all automation
      if (inquiry.status !== 'new' && inquiry.status !== 'contacted') continue;

      const createdAt = new Date(inquiry.createdAt);
      const daysSinceCreated = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

      // Determine which template map and tracking field to use
      const isManual = inquiry.isManualEnrollment === true;
      const templateMap = isManual ? manualFollowUpMap : followUpMap;
      const trackingField = isManual ? 'manualFollowUpSentAt' : 'followUpSentAt';

      // Process each email follow-up dynamically
      for (const [followUpKey, config] of Object.entries(settings.followUpDelays)) {
        const delay = (config as any).delayInDays;
        const mapping = templateMap[followUpKey];
        
        if (!mapping) continue; // Skip if no mapping exists
        
        // Check if this follow-up should be sent
        const alreadySent = isManual 
          ? inquiry.manualFollowUpSentAt?.[followUpKey as keyof typeof inquiry.manualFollowUpSentAt]
          : inquiry.followUpSentAt?.[followUpKey as keyof typeof inquiry.followUpSentAt];
        
        if ((config as any).enabled && 
            daysSinceCreated >= delay && 
            daysSinceCreated < delay + 1 && 
            !alreadySent) {
          
          const template = templates[mapping.templateKey];
          if (template && template.enabled) {
            await sendFollowUp(
              inquiry, 
              template, 
              mapping.emailType as any, 
              followUpKey as any,
              trackingField
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
  templateType: 'followup-day1' | 'followup-day3' | 'followup-day4' | 'followup-day6' | 'followup-day10' | 'followup-day14' | 'manual-followup-day1' | 'manual-followup-day3' | 'manual-followup-day4' | 'manual-followup-day6' | 'manual-followup-day10' | 'manual-followup-day14',
  followUpDay: 'day1' | 'day3' | 'day4' | 'day6' | 'day10' | 'day14',
  trackingField: 'followUpSentAt' | 'manualFollowUpSentAt' = 'followUpSentAt'
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
      from: 'Your Love Films <hi@yourlovefilms.com>',
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
      await saveEmailLog(log);
      
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
    await saveEmailLog(log);

    // Update inquiry with follow-up timestamp (use correct tracking field)
    const updates: Partial<Inquiry> = trackingField === 'manualFollowUpSentAt' ? {
      manualFollowUpSentAt: {
        ...inquiry.manualFollowUpSentAt,
        [followUpDay]: new Date().toISOString()
      }
    } : {
      followUpSentAt: {
        ...inquiry.followUpSentAt,
        [followUpDay]: new Date().toISOString()
      }
    };
    await updateInquiry(inquiry.id, updates);

    console.log(`Sent ${followUpDay} ${trackingField === 'manualFollowUpSentAt' ? 'manual' : 'regular'} follow-up to ${inquiry.email}`);

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
    
    const smsConfig = getSMSConfig(settings);
    if (!smsConfig) {
      console.error('SMS config not available');
      return;
    }
    
    const smsResult = await sendSMS(
      formattedPhone,
      smsMessage,
      smsConfig
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
    await saveEmailLog(smsLog);
    
    if (smsResult.success) {
      // Update inquiry with SMS timestamp
      const updates: Partial<Inquiry> = {
        smsSentAt: {
          ...inquiry.smsSentAt,
          [smsDay]: new Date().toISOString()
        }
      };
      await updateInquiry(inquiry.id, updates);
      console.log(`Sent ${smsDay} SMS to ${inquiry.phone}`);
    } else {
      console.error(`SMS ${smsDay} failed for ${inquiry.phone}:`, smsResult.error);
    }
  } catch (error) {
    console.error(`Error sending SMS to ${inquiry.phone}:`, error);
  }
}

