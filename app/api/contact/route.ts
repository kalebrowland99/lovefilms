import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import { renderTemplate, renderSubject } from '@/lib/email-renderer';
import { saveInquiry, saveEmailLog, generateId, type Inquiry, type EmailLog } from '@/lib/database';
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
    saveInquiry(inquiry);
    console.log('Inquiry saved to database:', inquiryId);

    // Load email templates
    let templates: any = {};
    try {
      const templatesPath = path.join(process.cwd(), 'data', 'email-templates.json');
      const fileContents = fs.readFileSync(templatesPath, 'utf8');
      templates = JSON.parse(fileContents);
    } catch (error) {
      console.error('Error loading email templates:', error);
    }

    // Load automation settings (for SMS and test mode)
    let automationSettings: any = {};
    try {
      const settingsPath = path.join(process.cwd(), 'data', 'automation-settings.json');
      const settingsContents = fs.readFileSync(settingsPath, 'utf8');
      automationSettings = JSON.parse(settingsContents);
    } catch (error) {
      console.error('Error loading automation settings:', error);
    }

    const isTestMode = automationSettings.testMode || false;
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

        // Send notification email to admin
        if (templates.notification && templates.notification.enabled) {
          const notificationHtml = renderTemplate(templates.notification, emailData);
          const notificationSubject = renderSubject(templates.notification.subject, emailData);
          
          try {
            await resend.emails.send({
              from: 'Wedding Inquiries <contact@yourlovefilms.com>',
              to: 'hi@yourlovefilms.com',
              subject: notificationSubject,
              html: notificationHtml,
            });

            // Log email
            const log: EmailLog = {
              id: generateId(),
              inquiryId: inquiryId,
              recipientEmail: 'hi@yourlovefilms.com',
              recipientName: 'Admin',
              templateType: 'notification',
              subject: notificationSubject,
              sentAt: new Date().toISOString(),
              status: 'sent',
            };
            saveEmailLog(log);
          } catch (error) {
            console.error('Failed to send notification:', error);
            const log: EmailLog = {
              id: generateId(),
              inquiryId: inquiryId,
              recipientEmail: 'hi@yourlovefilms.com',
              recipientName: 'Admin',
              templateType: 'notification',
              subject: notificationSubject,
              sentAt: new Date().toISOString(),
              status: 'failed',
              error: String(error),
            };
            saveEmailLog(log);
          }
        }

        // Send welcome email to inquirer
        if (templates.welcome && templates.welcome.enabled) {
          const welcomeHtml = renderTemplate(templates.welcome, emailData);
          const welcomeSubject = renderSubject(templates.welcome.subject, emailData);
          
          try {
            const { data, error } = await resend.emails.send({
              from: 'Your Love Films <contact@yourlovefilms.com>',
              to: formData.email,
              subject: welcomeSubject,
              html: welcomeHtml,
            });

            if (error) {
              console.error('Resend error:', error);
              
              // Log failed email
              const log: EmailLog = {
                id: generateId(),
                inquiryId: inquiryId,
                recipientEmail: formData.email,
                recipientName: formData.name,
                templateType: 'welcome',
                subject: welcomeSubject,
                sentAt: new Date().toISOString(),
                status: 'failed',
                error: String(error),
              };
              saveEmailLog(log);

              return NextResponse.json({ 
                success: false, 
                message: 'Failed to send email. Please email us directly at hi@yourlovefilms.com' 
              }, { status: 500 });
            }

            // Log successful email
            const log: EmailLog = {
              id: generateId(),
              inquiryId: inquiryId,
              recipientEmail: formData.email,
              recipientName: formData.name,
              templateType: 'welcome',
              subject: welcomeSubject,
              sentAt: new Date().toISOString(),
              status: 'sent',
            };
            saveEmailLog(log);

            console.log('Emails sent successfully:', data);

            // Send pricing email after 10 minutes (or 10 seconds in test mode)
            if (templates.prices && templates.prices.enabled) {
              const pricingDelay = isTestMode ? 10000 : 600000; // 10 seconds vs 10 minutes
              setTimeout(async () => {
                try {
                  const pricesHtml = renderTemplate(templates.prices, emailData);
                  const pricesSubject = renderSubject(templates.prices.subject, emailData);
                  
                  // Prepare email options
                  const emailOptions: any = {
                    from: 'Your Love Films <contact@yourlovefilms.com>',
                    to: formData.email,
                    subject: pricesSubject,
                    html: pricesHtml,
                  };

                  // Add attachment if URL is provided
                  if (templates.prices.content.attachmentUrl && templates.prices.content.attachmentUrl.trim()) {
                    try {
                      const attachmentUrl = templates.prices.content.attachmentUrl.trim();
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
                      
                      console.log('PDF attachment added to pricing email');
                    } catch (attachError) {
                      console.error('Failed to fetch PDF attachment:', attachError);
                      // Continue sending email without attachment
                    }
                  }
                  
                  const { data: pricesData, error: pricesError } = await resend.emails.send(emailOptions);

                  // Log pricing email
                  const pricesLog: EmailLog = {
                    id: generateId(),
                    inquiryId: inquiryId,
                    recipientEmail: formData.email,
                    recipientName: formData.name,
                    templateType: 'prices' as any,
                    subject: pricesSubject,
                    sentAt: new Date().toISOString(),
                    status: pricesError ? 'failed' : 'sent',
                    error: pricesError ? String(pricesError) : undefined,
                  };
                  saveEmailLog(pricesLog);

                  if (pricesData) {
                    console.log('Pricing email sent after 10 minutes:', pricesData);
                  } else {
                    console.error('Pricing email failed:', pricesError);
                  }
                } catch (pricesEmailError) {
                  console.error('Pricing email error:', pricesEmailError);
                }
              }, pricingDelay);
              
              console.log(`Pricing email scheduled to send in ${isTestMode ? '10 seconds' : '10 minutes'}`);
            }

            // Send welcome SMS after 45 seconds (or 20 seconds in test mode) if enabled and phone provided
            if (formData.phone && isSMSConfigured(automationSettings)) {
              const smsTemplate = automationSettings.sms.templates.day0;
              if (smsTemplate && smsTemplate.enabled) {
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
                    saveEmailLog(smsLog);
                    
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
                        from: 'Your Love Films <contact@yourlovefilms.com>',
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
                      saveEmailLog(log);
                      
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
                  const smsTemplate = automationSettings.sms.templates[smsKey];
                  if (smsTemplate && smsTemplate.enabled && formData.phone && isSMSConfigured(automationSettings)) {
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
                      saveEmailLog(smsLog);
                      
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
            
            // Log failed email
            const log: EmailLog = {
              id: generateId(),
              inquiryId: inquiryId,
              recipientEmail: formData.email,
              recipientName: formData.name,
              templateType: 'welcome',
              subject: welcomeSubject,
              sentAt: new Date().toISOString(),
              status: 'failed',
              error: String(emailError),
            };
            saveEmailLog(log);
          }
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

