// Twilio SMS helper functions

interface SMSConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

// Replace template variables in SMS message
export function renderSMSTemplate(template: string, data: any): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    // Handle special combined variables for couples
    if (key === 'coupleNames' || key === 'coupleName') {
      const name1 = data.name || '';
      const name2 = data.fianceName || '';
      if (name1 && name2) {
        return `${name1} & ${name2}`;
      }
      return name1 || name2 || match;
    }
    
    return data[key] || match;
  });
}

// Send SMS via Twilio
export async function sendSMS(
  to: string,
  message: string,
  config: SMSConfig
): Promise<{ success: boolean; error?: string; sid?: string }> {
  try {
    // Twilio REST API endpoint
    const url = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`;
    
    // Create form data
    const formData = new URLSearchParams();
    formData.append('To', to);
    formData.append('From', config.fromNumber);
    formData.append('Body', message);
    
    // Send request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${config.accountSid}:${config.authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });
    
    const result = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        sid: result.sid
      };
    } else {
      return {
        success: false,
        error: result.message || 'Failed to send SMS'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: String(error)
    };
  }
}

// Get SMS config from environment variables or settings
export function getSMSConfig(settings?: any): SMSConfig | null {
  // Priority 1: Environment variables (Vercel)
  const envAccountSid = process.env.TWILIO_ACCOUNT_SID;
  const envAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const envFromNumber = process.env.TWILIO_PHONE_NUMBER;
  
  if (envAccountSid && envAuthToken && envFromNumber) {
    console.log('Using Twilio from env vars:', { 
      accountSid: envAccountSid.substring(0, 8) + '...', 
      fromNumber: envFromNumber 
    });
    return {
      accountSid: envAccountSid,
      authToken: envAuthToken,
      fromNumber: envFromNumber
    };
  }
  
  // Priority 2: CRM settings (fallback)
  if (settings?.sms?.twilioAccountSid && settings?.sms?.twilioAuthToken && settings?.sms?.twilioPhoneNumber) {
    console.log('Using Twilio from CRM settings');
    return {
      accountSid: settings.sms.twilioAccountSid,
      authToken: settings.sms.twilioAuthToken,
      fromNumber: settings.sms.twilioPhoneNumber
    };
  }
  
  console.warn('Twilio SMS not configured - missing credentials');
  return null;
}

// Check if SMS is configured
export function isSMSConfigured(settings: any): boolean {
  // Check environment variables first
  const hasEnvVars = !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  );
  
  // If we have env vars, check if SMS is enabled (must be explicitly true or undefined, not false)
  if (hasEnvVars) {
    // If SMS settings exist and enabled is explicitly false, return false
    if (settings?.sms && settings.sms.enabled === false) {
      return false;
    }
    // If no SMS settings or enabled is not false, allow env vars to work
    return true;
  }
  
  // Fallback to CRM settings
  return !!(
    settings?.sms?.enabled &&
    settings?.sms?.twilioAccountSid &&
    settings?.sms?.twilioAuthToken &&
    settings?.sms?.twilioPhoneNumber
  );
}

// Format phone number for Twilio (E.164 format)
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it's a 10-digit US number, add +1
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  
  // If it already has country code
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+${cleaned}`;
  }
  
  // If it starts with +, assume it's already formatted
  if (phone.startsWith('+')) {
    return phone.replace(/\D/g, '').replace(/^/, '+');
  }
  
  // Default: return as-is with +
  return `+${cleaned}`;
}

