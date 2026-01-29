import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { renderTemplate, renderSubject } from '@/lib/email-renderer';
import { saveInquiry, saveEmailLog, generateId, getEmailTemplates, type Inquiry, type EmailLog } from '@/lib/database';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_PASSWORD = process.env.EMAIL_ADMIN_PASSWORD || 'yourlovefilms';

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
    const formData = await request.json();
    
    console.log('Manual enrollment received:', formData);

    // Validate required fields
    if (!formData.name || !formData.email) {
      return NextResponse.json({ 
        error: 'Name and email are required' 
      }, { status: 400 });
    }

    // Save as inquiry to database with special status
    const inquiryId = generateId();
    const inquiry: Inquiry = {
      id: inquiryId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '',
      fianceName: formData.instagramName || '',
      weddingDate: formData.weddingDate || '',
      venue: formData.venue || '',
      status: 'contacted', // Mark as contacted since this is manual enrollment
      createdAt: new Date().toISOString(),
      isManualEnrollment: true, // Mark as manual enrollment to use separate automation
    };
    await saveInquiry(inquiry);
    console.log('Manual enrollment saved to database:', inquiryId);

    // Load email templates
    const templates = await getEmailTemplates();
    
    if (!templates) {
      console.error('Email templates not found');
      return NextResponse.json({ 
        error: 'Email templates not configured' 
      }, { status: 500 });
    }

    // Send emails using Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const emailData = {
          name: formData.name,
          fianceName: formData.instagramName || '',
          weddingDate: formData.weddingDate || '',
          venue: formData.venue || '',
          formData: formData
        };

        // Send custom welcome email for manual enrollments (using manualWelcome template)
        if (templates.manualWelcome && templates.manualWelcome.enabled) {
          const welcomeHtml = renderTemplate(templates.manualWelcome, emailData);
          const welcomeSubject = renderSubject(templates.manualWelcome.subject, emailData);
          
          try {
            await resend.emails.send({
              from: 'Your Love Films <hi@yourlovefilms.com>',
              to: formData.email,
              subject: welcomeSubject,
              html: welcomeHtml,
            });

            // Log email
            const log: EmailLog = {
              id: generateId(),
              inquiryId: inquiryId,
              recipientEmail: formData.email,
              recipientName: formData.name,
              templateType: 'manual-welcome',
              subject: welcomeSubject,
              sentAt: new Date().toISOString(),
              status: 'sent',
            };
            await saveEmailLog(log);
            
            console.log('Manual welcome email sent');
          } catch (error) {
            console.error('Failed to send manual welcome email:', error);
            const log: EmailLog = {
              id: generateId(),
              inquiryId: inquiryId,
              recipientEmail: formData.email,
              recipientName: formData.name,
              templateType: 'manual-welcome',
              subject: welcomeSubject,
              sentAt: new Date().toISOString(),
              status: 'failed',
              error: String(error),
            };
            await saveEmailLog(log);
          }
        }

        // Also send admin notification about manual enrollment
        if (templates.manualAdmin && templates.manualAdmin.enabled) {
          const adminHtml = renderTemplate(templates.manualAdmin, emailData);
          const adminSubject = renderSubject(templates.manualAdmin.subject, emailData);
          
          try {
            await resend.emails.send({
              from: 'Manual Enrollments <hi@yourlovefilms.com>',
              to: 'hi@yourlovefilms.com',
              subject: adminSubject,
              html: adminHtml,
            });

            // Log email
            const log: EmailLog = {
              id: generateId(),
              inquiryId: inquiryId,
              recipientEmail: 'hi@yourlovefilms.com',
              recipientName: 'Admin',
              templateType: 'manual-admin',
              subject: adminSubject,
              sentAt: new Date().toISOString(),
              status: 'sent',
            };
            await saveEmailLog(log);
          } catch (error) {
            console.error('Failed to send admin notification:', error);
          }
        }

      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Continue even if email fails - person is still enrolled
      }
    } else {
      console.warn('RESEND_API_KEY not set - email not sent');
    }
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully enrolled in manual automation',
      inquiryId: inquiryId
    }, { status: 200 });
    
  } catch (error) {
    console.error('Manual enrollment error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
