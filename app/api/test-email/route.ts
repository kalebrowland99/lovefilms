import { NextResponse } from 'next/server';
import { renderTemplate } from '@/lib/email-renderer';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const ADMIN_PASSWORD = process.env.EMAIL_ADMIN_PASSWORD || 'yourlovefilms';
const resend = new Resend(process.env.RESEND_API_KEY);

// Use /tmp directory on Vercel (serverless), or local data directory in development
const IS_VERCEL = process.env.VERCEL === '1';
const DATA_DIR = IS_VERCEL ? '/tmp/data' : path.join(process.cwd(), 'data');
const TEMPLATES_PATH = path.join(DATA_DIR, 'email-templates.json');

// Helper to check password
function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const password = authHeader.replace('Bearer ', '');
  return password === ADMIN_PASSWORD;
}

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { templateKey, testEmail } = await request.json();

    // Load templates
    ensureDataDir();
    
    // Check if file exists, if not use default templates from API
    let templates;
    if (fs.existsSync(TEMPLATES_PATH)) {
      const templatesData = fs.readFileSync(TEMPLATES_PATH, 'utf8');
      templates = JSON.parse(templatesData);
    } else {
      // Fallback: load from email-templates API
      const templatesResponse = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/email-templates`, {
        headers: {
          'Authorization': request.headers.get('authorization') || ''
        }
      });
      if (!templatesResponse.ok) {
        throw new Error('Could not load templates');
      }
      templates = await templatesResponse.json();
    }
    
    const template = templates[templateKey];
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Sample data for test
    const sampleData = {
      name: 'John & Jane',
      weddingDate: 'June 15, 2026',
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
    const emailHtml = renderTemplate(template, sampleData);
    const subject = template.subject
      .replace(/\{\{name\}\}/g, sampleData.name)
      .replace(/\{\{weddingDate\}\}/g, sampleData.weddingDate);

    // Send email via Resend
    await resend.emails.send({
      from: 'Your Love Films <hi@yourlovefilms.com>',
      to: testEmail,
      subject: `[TEST] ${subject}`,
      html: emailHtml,
    });

    return NextResponse.json({ 
      success: true, 
      message: `Test email sent to ${testEmail}` 
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json({ 
      error: 'Failed to send test email', 
      details: String(error) 
    }, { status: 500 });
  }
}

