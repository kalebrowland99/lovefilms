import { NextResponse } from 'next/server';
import { getEmailTemplates, saveEmailTemplates, type EmailTemplates } from '@/lib/database';
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

// Default templates structure (loaded from example file as fallback)
function getDefaultTemplates(): EmailTemplates {
  try {
    const examplePath = path.join(process.cwd(), 'data', 'email-templates.example.json');
    if (fs.existsSync(examplePath)) {
      const data = fs.readFileSync(examplePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading default templates:', error);
  }
  
  // Fallback if example file doesn't exist
  return {
    "welcome": {
      "name": "Day 0: Welcome Email (Immediate)",
      "subject": "{{name}}, thanks for reaching out about {{weddingDate}}!",
      "enabled": true,
      "sendTo": "inquirer",
      "timing": "immediate",
      "content": {
        "greeting": "Hey {{name}}! 🎥",
        "paragraph1": "Just got your inquiry for {{weddingDate}} at {{venue}} — love it!",
        "paragraph2": "I'm checking our availability right now. In the meantime, here's what you need to know: we create cinematic films that feel like you, not a template. Vows, toasts, the party — we capture what matters most to you two.",
        "paragraph3": "Quick question: What's the #1 moment you want on film? (The ceremony? Speeches? Dancing? Family?) Helps me recommend the right package.",
        "callToAction": "Book a Quick Call",
        "callToActionUrl": "https://yourlovefilms.com/contact",
        "footer": "I'll reply with pricing + availability in the next 15 minutes. Talk soon!"
      }
    },
    "prices": {
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
    }
  };
}

// GET - Load templates
export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const templates = await getEmailTemplates();
    
    if (!templates) {
      // No templates exist yet, save defaults and return them
      console.log('No email templates found, creating defaults...');
      const defaultTemplates = getDefaultTemplates();
      await saveEmailTemplates(defaultTemplates);
      return NextResponse.json(defaultTemplates);
    }
    
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error reading templates:', error);
    // Return defaults if there's an error
    return NextResponse.json(getDefaultTemplates());
  }
}

// POST - Save templates
export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const templates = await request.json();
    await saveEmailTemplates(templates);
    
    return NextResponse.json({ success: true, message: 'Templates saved successfully' });
  } catch (error) {
    console.error('Error saving templates:', error);
    return NextResponse.json({ error: 'Failed to save templates' }, { status: 500 });
  }
}
