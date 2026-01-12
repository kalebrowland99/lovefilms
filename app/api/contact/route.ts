import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { renderTemplate, renderSubject } from '@/lib/email-renderer';
import { saveInquiry, saveEmailLog, generateId, getAutomationSettings, getEmailTemplates, saveScheduledEmail, type Inquiry, type EmailLog, type ScheduledEmail } from '@/lib/database';
import { sendSMS, renderSMSTemplate, formatPhoneNumber, isSMSConfigured, getSMSConfig } from '@/lib/sms';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  console.log('API route hit!');
  
  try {
    const formData = await request.json();
    
    console.log('Form data received:', formData);

    // Save inquiry to database
    const inquiryId = generateId();
    const inquiry: Inquiry = {
      id: inquiryId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      fianceName: formData.fianceName,
      weddingDate: formData.weddingDate,
      venue: formData.venue,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    await saveInquiry(inquiry);
    console.log('Inquiry saved to database:', inquiryId);

    // Load email templates from Firebase
    const templates = await getEmailTemplates();
    
    if (!templates) {
      console.error('Email templates not found in Firebase');
      return NextResponse.json({ 
        error: 'Email templates not configured' 
      }, { status: 500 });
    }

    // Load automation settings from Firebase (for SMS and test mode)
    const automationSettings = await getAutomationSettings();

    const isTestMode = automationSettings?.testMode || false;
    console.log('Test Mode:', isTestMode);

    // Send emails using Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const emailData = {
          name: formData.name,
          fianceName: formData.fianceName,
          weddingDate: formData.weddingDate,
          venue: formData.venue,
          formData: formData
        };

        // Send inquiry notification email to admin
        if (templates.inquiry && templates.inquiry.enabled) {
          const inquiryHtml = renderTemplate(templates.inquiry, emailData);
          const inquirySubject = renderSubject(templates.inquiry.subject, emailData);
          
          try {
            await resend.emails.send({
              from: 'Wedding Inquiries <hi@yourlovefilms.com>',
              to: 'hi@yourlovefilms.com',
              subject: inquirySubject,
              html: inquiryHtml,
            });

            // Log email
            const log: EmailLog = {
              id: generateId(),
              inquiryId: inquiryId,
              recipientEmail: 'hi@yourlovefilms.com',
              recipientName: 'Admin',
              templateType: 'inquiry',
              subject: inquirySubject,
              sentAt: new Date().toISOString(),
              status: 'sent',
            };
            await saveEmailLog(log);
          } catch (error) {
            console.error('Failed to send inquiry notification:', error);
            const log: EmailLog = {
              id: generateId(),
              inquiryId: inquiryId,
              recipientEmail: 'hi@yourlovefilms.com',
              recipientName: 'Admin',
              templateType: 'inquiry',
              subject: inquirySubject,
              sentAt: new Date().toISOString(),
              status: 'failed',
              error: String(error),
            };
            await saveEmailLog(log);
          }
        }

            // Schedule availability/pricing email to be sent after 3 minutes (or 10 seconds in test mode)
            if (templates.availabilityday0 && templates.availabilityday0.enabled) {
              try {
                const availabilityDelayMs = isTestMode ? 10000 : 180000; // 10 seconds vs 3 minutes
                const sendAt = new Date(Date.now() + availabilityDelayMs).toISOString();
                
                const scheduledEmail: ScheduledEmail = {
                  id: generateId(),
                  inquiryId: inquiryId,
                  recipientEmail: formData.email,
                  recipientName: formData.name,
                  templateKey: 'availabilityday0',
                  sendAt: sendAt,
                  emailData: emailData,
                  attachmentUrl: templates.availabilityday0.attachmentUrl || undefined,
                  status: 'pending',
                  createdAt: new Date().toISOString()
                };
                
                await saveScheduledEmail(scheduledEmail);
                console.log(`✅ Availability email queued to send in ${isTestMode ? '10 seconds' : '3 minutes'} at ${sendAt}`);
              } catch (scheduleError) {
                console.error('❌ Failed to schedule availability email:', scheduleError);
                // Don't fail the whole request if scheduling fails
              }
            } else {
              console.warn('⚠️ availabilityday0 template not found or disabled:', {
                exists: !!templates.availabilityday0,
                enabled: templates.availabilityday0?.enabled,
                templateKeys: Object.keys(templates)
              });
            }

            // Send welcome SMS after 45 seconds (or 20 seconds in test mode) if enabled and phone provided
            if (formData.phone && automationSettings && isSMSConfigured(automationSettings)) {
              // Ensure SMS templates structure exists
              const smsTemplate = automationSettings.sms?.templates?.day0;
              const isSMSTemplateEnabled = smsTemplate?.enabled !== false; // Default to true if undefined
              
              if (smsTemplate && isSMSTemplateEnabled) {
                // Schedule SMS to send after 45 seconds (or 20 seconds in test mode)
                const day0SMSDelay = isTestMode ? 20000 : 45000; // 20 seconds vs 45 seconds
                setTimeout(async () => {
                  try {
                    const smsData = {
                      name: formData.name.split(' ')[0], // First name only for SMS
                      fianceName: formData.fianceName ? formData.fianceName.split(' ')[0] : '',
                      weddingDate: formData.weddingDate,
                      venue: formData.venue
                    };
                    
                    const smsMessage = renderSMSTemplate(smsTemplate.message, smsData);
                    const formattedPhone = formatPhoneNumber(formData.phone);
                    
                    const smsConfig = getSMSConfig(automationSettings);
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
                      inquiryId: inquiryId,
                      recipientEmail: formData.phone, // Store phone in email field
                      recipientName: formData.name,
                      templateType: 'sms' as any,
                      subject: 'Welcome SMS (Day 0)',
                      sentAt: new Date().toISOString(),
                      status: smsResult.success ? 'sent' : 'failed',
                      error: smsResult.error,
                      messageType: 'sms'
                    };
                    await saveEmailLog(smsLog);
                    
                    if (smsResult.success) {
                      console.log('Welcome SMS sent after 45 seconds:', smsResult.sid);
                    } else {
                      console.error('SMS failed:', smsResult.error);
                    }
                  } catch (smsError) {
                    console.error('SMS error:', smsError);
                  }
                }, day0SMSDelay);
                
                console.log(`Welcome SMS scheduled to send in ${isTestMode ? '20 seconds' : '45 seconds'}`);
              }
            }

        // Commented out the welcome email block above - it's now disabled
        // }

            // TEST MODE: Send all follow-up emails and SMS immediately with 10-second intervals
            if (isTestMode) {
              console.log('🧪 TEST MODE: Sending all follow-ups rapidly...');
              
              // Helper function to send follow-up emails in test mode
              const sendTestFollowUp = async (templateKey: string, templateType: string, delay: number) => {
                setTimeout(async () => {
                  const template = templates[templateKey];
                  if (template && template.enabled) {
                    try {
                      const followUpHtml = renderTemplate(template, emailData);
                      const followUpSubject = renderSubject(template.subject, emailData);
                      
                      await resend.emails.send({
                        from: 'Your Love Films <hi@yourlovefilms.com>',
                        to: formData.email,
                        subject: followUpSubject,
                        html: followUpHtml,
                      });

                      // Log email
                      const log: EmailLog = {
                        id: generateId(),
                        inquiryId: inquiryId,
                        recipientEmail: formData.email,
                        recipientName: formData.name,
                        templateType: templateType as any,
                        subject: followUpSubject,
                        sentAt: new Date().toISOString(),
                        status: 'sent',
                      };
                      await saveEmailLog(log);
                      
                      console.log(`✅ TEST MODE: Sent ${templateKey}`);
                    } catch (error) {
                      console.error(`❌ TEST MODE: Failed to send ${templateKey}:`, error);
                    }
                  }
                }, delay);
              };

              // Helper function to send SMS in test mode
              const sendTestSMS = async (smsKey: string, delay: number) => {
                setTimeout(async () => {
                  const smsTemplate = automationSettings?.sms?.templates?.[smsKey];
                  if (smsTemplate && smsTemplate.enabled && formData.phone && automationSettings && isSMSConfigured(automationSettings)) {
                    try {
                      const smsData = {
                        name: formData.name.split(' ')[0],
                        fianceName: formData.fianceName ? formData.fianceName.split(' ')[0] : '',
                        weddingDate: formData.weddingDate,
                        venue: formData.venue
                      };
                      
                      const smsMessage = renderSMSTemplate(smsTemplate.message, smsData);
                      const formattedPhone = formatPhoneNumber(formData.phone);
                      
                      const smsConfig = getSMSConfig(automationSettings);
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
                        inquiryId: inquiryId,
                        recipientEmail: formData.phone,
                        recipientName: formData.name,
                        templateType: 'sms' as any,
                        subject: `SMS: ${smsTemplate.name}`,
                        sentAt: new Date().toISOString(),
                        status: smsResult.success ? 'sent' : 'failed',
                        error: smsResult.error,
                        messageType: 'sms'
                      };
                      await saveEmailLog(smsLog);
                      
                      console.log(`✅ TEST MODE: Sent SMS ${smsKey}`);
                    } catch (error) {
                      console.error(`❌ TEST MODE: Failed to send SMS ${smsKey}:`, error);
                    }
                  }
                }, delay);
              };

              // Schedule all follow-up emails (10 seconds apart)
              sendTestFollowUp('followupDay1', 'followup-day1', 30000);   // 30 seconds
              sendTestFollowUp('followupDay3', 'followup-day3', 50000);   // 50 seconds
              sendTestFollowUp('followupDay6', 'followup-day6', 70000);   // 70 seconds
              sendTestFollowUp('followupDay10', 'followup-day10', 80000); // 80 seconds
              sendTestFollowUp('followupDay14', 'followup-day14', 90000); // 90 seconds

              // Schedule follow-up SMS (10 seconds apart)
              sendTestSMS('day2', 40000); // 40 seconds
              sendTestSMS('day4', 60000); // 60 seconds
              
              console.log('🧪 TEST MODE: All messages scheduled (0-90 seconds)');
            }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Continue even if email fails
      }
    } else {
      console.warn('RESEND_API_KEY not set - email not sent');
    }
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Thank you! We\'ll be in touch within 30 minutes!' 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again or email us directly at hi@yourlovefilms.com' },
      { status: 500 }
    );
  }
}

// Add OPTIONS method for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

