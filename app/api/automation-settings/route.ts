import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Use /tmp directory on Vercel (serverless), or local data directory in development
const IS_VERCEL = process.env.VERCEL === '1';
const DATA_DIR = IS_VERCEL ? '/tmp/data' : path.join(process.cwd(), 'data');
const SETTINGS_PATH = path.join(DATA_DIR, 'automation-settings.json');
const ADMIN_PASSWORD = process.env.EMAIL_ADMIN_PASSWORD || 'yourlovefilms2026';

// Helper to check password
function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const password = authHeader.replace('Bearer ', '');
  return password === ADMIN_PASSWORD;
}

// Default settings structure
const DEFAULT_SETTINGS = {
  followUpDelays: {
    day1: {
      enabled: true,
      delayInDays: 1,
      name: "Day 1: Quick Question",
      description: "Ask about their priorities and biggest concerns"
    },
    day3: {
      enabled: true,
      delayInDays: 3,
      name: "Day 3: Social Proof",
      description: "Share a client success story"
    },
    day6: {
      enabled: true,
      delayInDays: 6,
      name: "Day 6: Helpful Guidance",
      description: "Provide value + soft date hold"
    },
    day10: {
      enabled: true,
      delayInDays: 10,
      name: "Day 10: Date Hold",
      description: "Gentle boundary - hold or release date"
    },
    day14: {
      enabled: true,
      delayInDays: 14,
      name: "Day 14: Breakup Email",
      description: "Final friendly goodbye (option to reconnect later)"
    }
  },
  sms: {
    enabled: true,
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioPhoneNumber: "",
    templates: {
      day0: {
        enabled: true,
        delayInSeconds: 45,
        name: "Day 0: Welcome Text (45 seconds)",
        message: "Hey {{name}}! Just sent you details for {{weddingDate}}. Want me to recommend the best package based on what matters most to you? - Your Love Films"
      },
      day2: {
        enabled: true,
        delayInDays: 2,
        name: "Day 2: Call Preference",
        message: "{{name}}, do you prefer a quick 10-min call or full 20-min walkthrough to discuss your wedding film? Either works! Reply with your preference. - Your Love Films"
      },
      day4: {
        enabled: true,
        delayInDays: 4,
        name: "Day 4: Date Hold Text",
        message: "Hi {{name}}! Still interested in video for {{weddingDate}}? I can hold it for 24 hrs if you want. Just reply YES or NO. - Your Love Films"
      }
    }
  },
  testMode: false
};

// GET - Load settings
export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if file exists
    if (!fs.existsSync(SETTINGS_PATH)) {
      console.log('Settings file does not exist, creating with defaults...');
      
      // Ensure data directory exists
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      // Create file with defaults
      fs.writeFileSync(SETTINGS_PATH, JSON.stringify(DEFAULT_SETTINGS, null, 2));
      return NextResponse.json(DEFAULT_SETTINGS);
    }
    
    const fileContents = fs.readFileSync(SETTINGS_PATH, 'utf8');
    const settings = JSON.parse(fileContents);
    
    // Merge with defaults to ensure all fields exist
    const mergedSettings = {
      ...DEFAULT_SETTINGS,
      ...settings,
      sms: {
        ...DEFAULT_SETTINGS.sms,
        ...settings.sms
      }
    };
    
    return NextResponse.json(mergedSettings);
  } catch (error) {
    console.error('Error reading automation settings:', error);
    // Return defaults if there's an error
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

// POST - Save settings
export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await request.json();
    
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write settings to file
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
    
    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error saving automation settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}

