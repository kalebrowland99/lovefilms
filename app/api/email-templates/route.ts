import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TEMPLATES_PATH = path.join(process.cwd(), 'data', 'email-templates.json');
const ADMIN_PASSWORD = process.env.EMAIL_ADMIN_PASSWORD || 'yourlovefilms2026';

// Helper to check password
function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const password = authHeader.replace('Bearer ', '');
  return password === ADMIN_PASSWORD;
}

// GET - Load templates
export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const fileContents = fs.readFileSync(TEMPLATES_PATH, 'utf8');
    const templates = JSON.parse(fileContents);
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error reading templates:', error);
    return NextResponse.json({ error: 'Failed to load templates' }, { status: 500 });
  }
}

// POST - Save templates
export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const templates = await request.json();
    
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write templates to file
    fs.writeFileSync(TEMPLATES_PATH, JSON.stringify(templates, null, 2));
    
    return NextResponse.json({ success: true, message: 'Templates saved successfully' });
  } catch (error) {
    console.error('Error saving templates:', error);
    return NextResponse.json({ error: 'Failed to save templates' }, { status: 500 });
  }
}

