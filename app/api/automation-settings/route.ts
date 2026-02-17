import { NextResponse } from 'next/server';
import { getAutomationSettings, saveAutomationSettings, type AutomationSettings } from '@/lib/database';

const ADMIN_PASSWORD = process.env.EMAIL_ADMIN_PASSWORD || 'ylf';

// Helper to check password
function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const password = authHeader.replace('Bearer ', '');
  return password === ADMIN_PASSWORD;
}

// Default settings structure
const DEFAULT_SETTINGS: AutomationSettings = {
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
    day4: {
      enabled: true,
      delayInDays: 4,
      name: "Day 4: $100 Deposit Lock",
      description: "Create urgency with $100 retainer to secure date"
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
    // Don't store credentials in database - use environment variables
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || "",
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || "",
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER || "",
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
    const settings = await getAutomationSettings();
    
    if (!settings) {
      // No settings exist yet, save defaults and return them
      console.log('No automation settings found, creating defaults...');
      await saveAutomationSettings(DEFAULT_SETTINGS);
      return NextResponse.json(DEFAULT_SETTINGS);
    }
    
    // Merge with defaults to ensure all fields exist and inject env var credentials
    const mergedSettings: AutomationSettings = {
      ...DEFAULT_SETTINGS,
      ...settings,
      sms: {
        ...DEFAULT_SETTINGS.sms,
        ...settings.sms,
        // Always use environment variables for Twilio credentials (more secure)
        twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || settings.sms.twilioAccountSid || "",
        twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || settings.sms.twilioAuthToken || "",
        twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER || settings.sms.twilioPhoneNumber || "",
      }
    };
    
    return NextResponse.json(mergedSettings);
  } catch (error) {
    console.error('Error reading automation settings:', error);
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
    
    // Don't store Twilio credentials in database if they're in environment variables
    const settingsToSave: AutomationSettings = {
      ...settings,
      sms: {
        ...settings.sms,
        // Remove credentials if they match env vars (prefer env vars)
        twilioAccountSid: process.env.TWILIO_ACCOUNT_SID ? "" : settings.sms.twilioAccountSid,
        twilioAuthToken: process.env.TWILIO_AUTH_TOKEN ? "" : settings.sms.twilioAuthToken,
        twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER ? "" : settings.sms.twilioPhoneNumber,
      }
    };
    
    await saveAutomationSettings(settingsToSave);
    
    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error saving automation settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
