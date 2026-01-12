import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { renderTemplate, renderSubject } from '@/lib/email-renderer';
import { getPendingScheduledEmails, updateScheduledEmailStatus, saveEmailLog, getEmailTemplates, generateId, type ScheduledEmail, type EmailLog } from '@/lib/database';

const resend = new Resend(process.env.RESEND_API_KEY);
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron (security)
  const authHeader = request.headers.get('authorization');
  
  // If CRON_SECRET is set, verify it matches
  if (CRON_SECRET) {
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      console.error('❌ Unauthorized cron request. Auth header:', authHeader);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else {
    console.warn('⚠️ CRON_SECRET not set - cron endpoint is not secured!');
  }

  console.log('🔄 Running scheduled emails cron job...');

  try {
    // Get all scheduled emails that are ready to send
    const scheduledEmails = await getPendingScheduledEmails();
    
    if (scheduledEmails.length === 0) {
      console.log('📭 No scheduled emails to send');
      return NextResponse.json({ 
        success: true, 
        message: 'No emails to send',
        sent: 0
      });
    }

    console.log(`📬 Found ${scheduledEmails.length} scheduled emails to send`);

    // Load templates
    const templates = await getEmailTemplates();
    if (!templates) {
      console.error('Email templates not found');
      return NextResponse.json({ 
        error: 'Email templates not configured',
        sent: 0
      }, { status: 500 });
    }

    let sentCount = 0;
    let failedCount = 0;

    // Process each scheduled email
    for (const scheduledEmail of scheduledEmails) {
      try {
        const template = templates[scheduledEmail.templateKey];
        
        if (!template) {
          console.error(`Template ${scheduledEmail.templateKey} not found`);
          await updateScheduledEmailStatus(scheduledEmail.id, 'failed', 'Template not found');
          failedCount++;
          continue;
        }

        // Render email
        const emailHtml = renderTemplate(template, scheduledEmail.emailData);
        const emailSubject = renderSubject(template.subject, scheduledEmail.emailData);
        
        // Prepare email options
        const emailOptions: any = {
          from: 'Your Love Films <hi@yourlovefilms.com>',
          to: scheduledEmail.recipientEmail,
          subject: emailSubject,
          html: emailHtml,
        };

        // Add attachment if URL is provided
        if (scheduledEmail.attachmentUrl && scheduledEmail.attachmentUrl.trim()) {
          try {
            const attachmentUrl = scheduledEmail.attachmentUrl.trim();
            const response = await fetch(attachmentUrl);
            const buffer = await response.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            
            // Extract filename from URL or use default
            const urlParts = attachmentUrl.split('/');
            const filename = urlParts[urlParts.length - 1] || 'Pricing-Guide.pdf';
            
            emailOptions.attachments = [{
              filename: filename,
              content: base64,
            }];
            
            console.log('📎 PDF attachment added to email');
          } catch (attachError) {
            console.error('Failed to fetch PDF attachment:', attachError);
            // Continue sending email without attachment
          }
        }
        
        // Send email via Resend
        const { data, error } = await resend.emails.send(emailOptions);

        if (error) {
          console.error(`❌ Failed to send scheduled email ${scheduledEmail.id}:`, error);
          await updateScheduledEmailStatus(scheduledEmail.id, 'failed', String(error));
          failedCount++;
          
          // Log failed email
          const log: EmailLog = {
            id: generateId(),
            inquiryId: scheduledEmail.inquiryId,
            recipientEmail: scheduledEmail.recipientEmail,
            recipientName: scheduledEmail.recipientName,
            templateType: scheduledEmail.templateKey as any,
            subject: emailSubject,
            sentAt: new Date().toISOString(),
            status: 'failed',
            error: String(error),
          };
          await saveEmailLog(log);
        } else {
          console.log(`✅ Sent scheduled email ${scheduledEmail.id} to ${scheduledEmail.recipientEmail}`);
          await updateScheduledEmailStatus(scheduledEmail.id, 'sent');
          sentCount++;
          
          // Log successful email
          const log: EmailLog = {
            id: generateId(),
            inquiryId: scheduledEmail.inquiryId,
            recipientEmail: scheduledEmail.recipientEmail,
            recipientName: scheduledEmail.recipientName,
            templateType: scheduledEmail.templateKey as any,
            subject: emailSubject,
            sentAt: new Date().toISOString(),
            status: 'sent',
          };
          await saveEmailLog(log);
        }

      } catch (error) {
        console.error(`Error processing scheduled email ${scheduledEmail.id}:`, error);
        await updateScheduledEmailStatus(scheduledEmail.id, 'failed', String(error));
        failedCount++;
      }
    }

    console.log(`✅ Scheduled emails cron completed. Sent: ${sentCount}, Failed: ${failedCount}`);

    return NextResponse.json({
      success: true,
      message: `Processed ${scheduledEmails.length} emails`,
      sent: sentCount,
      failed: failedCount
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ 
      success: false, 
      error: String(error),
      sent: 0
    }, { status: 500 });
  }
}

