import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { renderTemplate, renderSubject } from '@/lib/email-renderer';
import { getEmailLog, getInquiry, saveEmailLog, generateId, getEmailTemplates, type EmailLog } from '@/lib/database';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_PASSWORD = process.env.EMAIL_ADMIN_PASSWORD || 'ylf';

// Helper to check password
function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const password = authHeader.replace('Bearer ', '');
  return password === ADMIN_PASSWORD;
}

export async function POST(request: Request) {
  // Check authentication
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { logId } = await request.json();
    
    if (!logId) {
      return NextResponse.json({ error: 'Log ID is required' }, { status: 400 });
    }

    // Get the failed email log
    const log = await getEmailLog(logId);
    if (!log) {
      return NextResponse.json({ error: 'Email log not found' }, { status: 404 });
    }

    // Get the inquiry associated with this log
    const inquiry = await getInquiry(log.inquiryId);
    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    // Get email templates
    const templates = await getEmailTemplates();
    if (!templates) {
      return NextResponse.json({ error: 'Email templates not found' }, { status: 500 });
    }

    // Find the template based on the log's templateType
    let templateKey: string = log.templateType;
    
    // Map old template types to keys
    const templateTypeMap: Record<string, string> = {
      'inquiry': 'inquiry',
      'availabilityday0': 'availabilityday0',
      'followup-day1': 'followupDay1',
      'followup-day3': 'followupDay3',
      'followup-day6': 'followupDay6',
      'followup-day10': 'followupDay10',
      'followup-day14': 'followupDay14',
      'manual-welcome': 'manualWelcome',
      'manual-admin': 'manualAdmin',
      'manual-followup-day1': 'manualFollowupDay1',
      'manual-followup-day3': 'manualFollowupDay3',
      'manual-followup-day6': 'manualFollowupDay6',
      'manual-followup-day10': 'manualFollowupDay10',
      'manual-followup-day14': 'manualFollowupDay14'
    };

    if (templateTypeMap[log.templateType]) {
      templateKey = templateTypeMap[log.templateType];
    }

    const template = templates[templateKey];
    if (!template) {
      return NextResponse.json({ 
        error: `Template "${templateKey}" not found. Available: ${Object.keys(templates).join(', ')}` 
      }, { status: 404 });
    }

    // Prepare email data
    const emailData = {
      name: inquiry.name,
      fianceName: inquiry.fianceName,
      weddingDate: inquiry.weddingDate,
      venue: inquiry.venue,
      formData: inquiry
    };

    // Render email
    const emailHtml = renderTemplate(template, emailData);
    const emailSubject = renderSubject(template.subject, emailData);

    // Determine recipient based on template type
    const recipient = log.templateType === 'inquiry' || log.templateType === 'manual-admin' 
      ? 'hi@yourlovefilms.com' 
      : inquiry.email;

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Your Love Films <hi@yourlovefilms.com>',
      to: recipient,
      subject: emailSubject,
      html: emailHtml,
      replyTo: 'hi@yourlovefilms.com',
    });

    if (error) {
      console.error('Failed to retry email:', error);
      
      // Log the retry failure
      const newLog: EmailLog = {
        id: generateId(),
        inquiryId: inquiry.id,
        recipientEmail: recipient,
        recipientName: log.recipientName,
        templateType: log.templateType,
        subject: `[RETRY] ${emailSubject}`, // Keep [RETRY] in logs for tracking
        sentAt: new Date().toISOString(),
        status: 'failed',
        error: String(error),
      };
      await saveEmailLog(newLog);
      
      return NextResponse.json({ 
        error: 'Failed to send email',
        details: String(error)
      }, { status: 500 });
    }

    // Log successful retry
    const newLog: EmailLog = {
      id: generateId(),
      inquiryId: inquiry.id,
      recipientEmail: recipient,
      recipientName: log.recipientName,
      templateType: log.templateType,
      subject: `[RETRY] ${emailSubject}`, // Keep [RETRY] in logs for tracking
      sentAt: new Date().toISOString(),
      status: 'sent',
    };
    await saveEmailLog(newLog);

    console.log(`Successfully retried email for ${recipient}`);

    return NextResponse.json({ 
      success: true,
      message: 'Email resent successfully',
      emailId: data?.id
    });

  } catch (error) {
    console.error('Retry email error:', error);
    return NextResponse.json({ 
      error: 'Failed to retry email',
      details: String(error)
    }, { status: 500 });
  }
}
