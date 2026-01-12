import { NextResponse } from 'next/server';
import { renderTemplate } from '@/lib/email-renderer';
import { Resend } from 'resend';
import { getEmailTemplates } from '@/lib/database';

const ADMIN_PASSWORD = process.env.EMAIL_ADMIN_PASSWORD || 'yourlovefilms';
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper to check password
function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const password = authHeader.replace('Bearer ', '');
  return password === ADMIN_PASSWORD;
}

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { templateKey, testEmail } = await request.json();

    // Load templates from Firebase
    const templates = await getEmailTemplates();
    
    if (!templates) {
      return NextResponse.json({ 
        error: 'Templates not found. Please save your templates first in the Email Automation tab.' 
      }, { status: 404 });
    }
    
    const template = templates[templateKey];
    if (!template) {
      return NextResponse.json({ 
        error: `Template "${templateKey}" not found. Available templates: ${Object.keys(templates).join(', ')}` 
      }, { status: 404 });
    }
    
    console.log('Loaded template:', template.name);

    // Sample data for test - covers all possible template variables
    const sampleData = {
      name: 'John Smith',
      email: testEmail,
      phone: '(615) 555-1234',
      fianceName: 'Jane Doe',
      weddingDate: 'June 15, 2026',
      venue: 'The Hermitage Hotel, Nashville',
      videographer: 'Not Yet',
      formData: {
        name: 'John Smith',
        email: testEmail,
        phone: '(615) 555-1234',
        fianceName: 'Jane Doe',
        weddingDate: 'June 15, 2026',
        venue: 'The Hermitage Hotel, Nashville',
        videographer: 'Not Yet'
      }
    };

    // Render email HTML
    console.log('Rendering template:', templateKey);
    const emailHtml = renderTemplate(template, sampleData);
    
    // Render subject with all possible variables
    let subject = template.subject;
    subject = subject.replace(/\{\{name\}\}/g, sampleData.name);
    subject = subject.replace(/\{\{email\}\}/g, sampleData.email);
    subject = subject.replace(/\{\{phone\}\}/g, sampleData.phone);
    subject = subject.replace(/\{\{fianceName\}\}/g, sampleData.fianceName);
    subject = subject.replace(/\{\{weddingDate\}\}/g, sampleData.weddingDate);
    subject = subject.replace(/\{\{venue\}\}/g, sampleData.venue);

    console.log('Sending email to:', testEmail);
    console.log('Subject:', subject);

    // Send email via Resend
    const result = await resend.emails.send({
      from: 'Your Love Films <hi@yourlovefilms.com>',
      to: testEmail,
      subject: `[TEST] ${subject}`,
      html: emailHtml,
    });

    console.log('Resend API response:', result);

    // Check if the result has an error
    if (result.error) {
      console.error('Resend API error:', result.error);
      return NextResponse.json({ 
        error: 'Failed to send test email',
        details: result.error.message || 'Unknown Resend API error',
        hint: result.error.message?.includes('invalid') ? 'Your RESEND_API_KEY may be invalid or expired. Please check your .env.local file or Vercel environment variables.' : undefined
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Test email sent to ${testEmail}`,
      emailId: result.data?.id 
    });
  } catch (error: any) {
    console.error('Error sending test email:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ 
      error: 'Failed to send test email', 
      details: error.message || String(error),
      hint: 'Check your RESEND_API_KEY in .env.local or Vercel environment variables'
    }, { status: 500 });
  }
}

