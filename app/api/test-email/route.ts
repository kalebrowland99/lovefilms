import { NextResponse } from 'next/server';
import { renderTemplate } from '@/lib/email-renderer';
import nodemailer from 'nodemailer';
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

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { templateKey, testEmail } = await request.json();

    // Load templates
    const templatesPath = path.join(process.cwd(), 'data', 'email-templates.json');
    const templatesData = fs.readFileSync(templatesPath, 'utf8');
    const templates = JSON.parse(templatesData);
    
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

    // Configure email transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_SERVER || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `Your Love Films <hi@yourlovefilms.com>`,
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

