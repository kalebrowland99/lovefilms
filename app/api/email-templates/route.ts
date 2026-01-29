import { NextResponse } from 'next/server';
import { getEmailTemplates, saveEmailTemplates, type EmailTemplates, type EmailTemplate } from '@/lib/database';
import fs from 'fs';
import path from 'path';

const ADMIN_PASSWORD = process.env.EMAIL_ADMIN_PASSWORD || 'yourlovefilms';

// Helper to check password
function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const password = authHeader.replace('Bearer ', '');
  return password === ADMIN_PASSWORD;
}

// Convert old format (with paragraph1, paragraph2, etc.) to new format (single content string)
function convertToNewFormat(templates: any): EmailTemplates {
  const converted: EmailTemplates = {};
  
  console.log('🔄 Converting templates to new format...');
  
  for (const [key, template] of Object.entries(templates)) {
    const t = template as any;
    console.log(`  📝 Converting ${key}:`, {
      callToAction: t.callToAction,
      callToActionUrl: t.callToActionUrl,
      contentType: typeof t.content
    });
    let contentText = '';
    
    // Handle old format with paragraphs
    if (t.content && typeof t.content === 'object') {
      if (t.content.greeting) contentText += `${t.content.greeting}\n\n`;
      if (t.content.heading) contentText += `${t.content.heading}\n\n`;
      
      for (let i = 1; i <= 10; i++) {
        if (t.content[`paragraph${i}`]) {
          contentText += `${t.content[`paragraph${i}`]}\n\n`;
        }
      }
      
      if (t.content.footer) contentText += t.content.footer;
      
      // Add button/URL markers if they exist in old format
      if (t.content.callToAction) {
        contentText += `\n\n[Button: ${t.content.callToAction}]`;
        if (t.content.callToActionUrl) {
          contentText += `\n[URL: ${t.content.callToActionUrl}]`;
        }
      }
      
      contentText = contentText.trim();
    } else if (typeof t.content === 'string') {
      // Already in new format - use as-is without adding button markers
      contentText = t.content;
    }
    
    // Extract callToAction and callToActionUrl ONLY from content markers
    let callToAction = '';
    let callToActionUrl = '';
    
    // Extract from content text if present in markers
    if (contentText.includes('[Button:')) {
      const buttonMatch = contentText.match(/\[Button:([^\]]+)\]/);
      if (buttonMatch) {
        callToAction = buttonMatch[1].trim();
      }
    }
    if (contentText.includes('[URL:')) {
      const urlMatch = contentText.match(/\[URL:([^\]]+)\]/);
      if (urlMatch) {
        callToActionUrl = urlMatch[1].trim();
      }
    }
    
    // Remove button/URL markers from content text - they're stored separately
    contentText = contentText.replace(/\[Button:[^\]]+\]/g, '').trim();
    contentText = contentText.replace(/\[URL:[^\]]+\]/g, '').trim();
    
    console.log(`  ✅ Converted ${key} result:`, {
      callToAction: callToAction || '(empty)',
      callToActionUrl: callToActionUrl || '(empty)'
    });
    
    converted[key] = {
      name: t.name || '',
      subject: t.subject || '',
      enabled: t.enabled ?? true,
      sendTo: t.sendTo || 'inquirer',
      timing: t.timing || '',
      content: contentText,
      callToAction: callToAction,
      callToActionUrl: callToActionUrl,
      attachmentUrl: (t.content && typeof t.content === 'object' ? t.content.attachmentUrl : undefined) || t.attachmentUrl,
      showDetails: (t.content && typeof t.content === 'object' ? t.content.showDetails : undefined) || t.showDetails,
    };
  }
  
  return converted;
}

// Default templates structure (loaded from example file as fallback)
function getDefaultTemplates(): any {
  try {
    const examplePath = path.join(process.cwd(), 'data', 'email-templates.example.json');
    if (fs.existsSync(examplePath)) {
      const data = fs.readFileSync(examplePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading default templates:', error);
  }
  
  // Fallback if example file doesn't exist (old format - will be converted)
  return {
  "inquiry": {
    "name": "New Inquiry Notification (Admin)",
    "subject": "New Wedding Inquiry: {{name}} & {{fianceName}} - {{weddingDate}}",
    "enabled": true,
    "sendTo": "admin",
    "timing": "immediate",
    "content": {
      "greeting": "New inquiry received!",
      "paragraph1": "Name: {{name}}",
      "paragraph2": "Email: {{formData.email}}",
      "paragraph3": "Phone: {{formData.phone}}",
      "paragraph4": "Instagram: {{fianceName}}",
      "paragraph5": "Wedding Date: {{weddingDate}}",
      "paragraph6": "Venue: {{venue}}",
      "footer": "Log in to CRM to respond."
    }
  },
  "availabilityday0": {
    "name": "Day 0: Pricing & Availability (5 minutes after)",
    "subject": "AWESOME NEWS: {{weddingDate}} is available! 🎉",
    "enabled": true,
    "sendTo": "inquirer",
    "timing": "5 minutes after inquiry",
    "content": {
      "greeting": "AWESOME NEWS FOR YOU: {{weddingDate}} is available for you! 🎉",
      "paragraph1": "I'd love to hear more—let's schedule a time to meet over a video call so we can connect \"in person\" and make sure we're the perfect fit! Feel free to bring any questions. Here's a scheduling link where you can pick a day and time that works best for you, or message me if you need a time outside the available slots:",
      "callToAction": "Schedule Your Call",
      "callToActionUrl": "https://yourlovefilms.com/contact",
      "paragraph2": "If you'd like to review my package and pricing info before our call, you can find my Price and Info Guide attached to this email. We'll also go over it together during our call! I've included both desktop and mobile versions for easy viewing.",
      "paragraph3": "*A quick note: I cannot hold your date until a contract is signed and the booking is made. I book dates as they come and do not disclose info about other inquiries for the same date—so to avoid any disappointment, let's schedule that call and get started as soon as you can to secure your date and those dreamy films!",
      "paragraph4": "I'm so excited to get started!",
      "footer": "Thank you for reaching out, {{name}}, and I can't wait to work with you!\n\nBest,\nYour Love Films",
        "attachmentUrl": ""
    }
    },
  "manualWelcome": {
    "name": "Manual Enrollment Welcome",
    "subject": "Welcome, {{name}}! 🎥",
    "enabled": true,
    "sendTo": "inquirer",
    "timing": "immediate",
    "content": {
      "greeting": "Hi {{name}},",
      "paragraph1": "Thank you for your interest in Your Love Films! I'm excited to connect with you about capturing your special day.",
      "paragraph2": "I specialize in creating cinematic wedding films that tell your unique love story. My approach is all about capturing authentic moments and emotions that you'll cherish forever.",
      "paragraph3": "I'd love to learn more about your wedding plans and see if we're the perfect fit. Feel free to reply to this email with any questions, or we can schedule a quick call to chat!",
      "callToAction": "Schedule a Call",
      "callToActionUrl": "https://calendly.com/kalebrowland99/personal-wedding-call",
      "footer": "Looking forward to hearing from you!\n\nBest,\nYour Love Films"
    }
  },
  "manualAdmin": {
    "name": "Manual Enrollment Admin Notification",
    "subject": "Manual Enrollment: {{name}}",
    "enabled": true,
    "sendTo": "admin",
    "timing": "immediate",
    "content": {
      "greeting": "New manual enrollment added!",
      "paragraph1": "Name: {{name}}",
      "paragraph2": "Email: {{formData.email}}",
      "paragraph3": "Phone: {{formData.phone}}",
      "paragraph4": "Instagram: {{fianceName}}",
      "paragraph5": "Wedding Date: {{weddingDate}}",
      "paragraph6": "Venue: {{venue}}",
      "footer": "This person was manually enrolled via the CRM."
    }
  }
  };
}

// GET - Load templates
export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let templates = await getEmailTemplates();
    
    if (!templates) {
      // No templates exist yet, save defaults and return them
      console.log('No email templates found, creating defaults...');
      const defaultTemplates = getDefaultTemplates();
      const converted = convertToNewFormat(defaultTemplates);
      await saveEmailTemplates(converted);
      return NextResponse.json(converted);
    }
    
    // Convert to new format if needed (for backward compatibility)
    const converted = convertToNewFormat(templates);
    
    // If conversion changed anything, save the converted version
    if (JSON.stringify(templates) !== JSON.stringify(converted)) {
      await saveEmailTemplates(converted);
      return NextResponse.json(converted);
    }
    
    return NextResponse.json(converted);
  } catch (error) {
    console.error('Error reading templates:', error);
    // Return defaults if there's an error
    const defaultTemplates = getDefaultTemplates();
    return NextResponse.json(convertToNewFormat(defaultTemplates));
  }
}

// POST - Save templates
export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const templates = await request.json();
    console.log('Received templates to save:', Object.keys(templates));
    
    // Ensure templates are in new format before saving
    const converted = convertToNewFormat(templates);
    console.log('Converted templates:', Object.keys(converted));
    
    await saveEmailTemplates(converted);
    
    return NextResponse.json({ success: true, message: 'Templates saved successfully' });
  } catch (error: any) {
    console.error('Error saving templates:', error);
    console.error('Error stack:', error?.stack);
    return NextResponse.json({ 
      error: 'Failed to save templates',
      details: error?.message || String(error)
    }, { status: 500 });
  }
}
