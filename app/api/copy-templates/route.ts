import { NextResponse } from 'next/server';
import { getEmailTemplates, saveEmailTemplates } from '@/lib/database';

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
    // Load existing templates
    const templates = await getEmailTemplates();
    
    if (!templates) {
      return NextResponse.json({ 
        error: 'Email templates not found' 
      }, { status: 404 });
    }

    // Copy form templates to IG DM templates
    const updatedTemplates = { ...templates };

    // Copy welcome email (availabilityday0 → manualWelcome)
    if (templates.availabilityday0) {
      updatedTemplates.manualWelcome = {
        ...templates.availabilityday0,
        name: "IG DM Welcome Email",
        timing: "immediate"
      };
    }

    // Copy follow-up emails
    const followUpMapping = [
      { from: 'followupDay1', to: 'manualFollowupDay1', name: 'IG DM Follow-up Day 1' },
      { from: 'followupDay3', to: 'manualFollowupDay3', name: 'IG DM Follow-up Day 3' },
      { from: 'followupDay6', to: 'manualFollowupDay6', name: 'IG DM Follow-up Day 6' },
      { from: 'followupDay10', to: 'manualFollowupDay10', name: 'IG DM Follow-up Day 10' },
      { from: 'followupDay14', to: 'manualFollowupDay14', name: 'IG DM Follow-up Day 14' }
    ];

    for (const mapping of followUpMapping) {
      if (templates[mapping.from]) {
        updatedTemplates[mapping.to] = {
          ...templates[mapping.from],
          name: mapping.name,
          timing: mapping.to.replace('manualFollowup', '').replace('Day', ' day after manual enrollment')
        };
      }
    }

    // Keep the admin notification as is
    if (!updatedTemplates.manualAdmin) {
      updatedTemplates.manualAdmin = {
        name: "IG DM Admin Notification",
        subject: "Manual Enrollment: {{name}}",
        enabled: true,
        sendTo: "admin",
        timing: "immediate",
        content: "New manual enrollment added!\n\nName: {{name}}\nEmail: {{email}}\nPhone: {{phone}}\nInstagram: {{fianceName}}\nWedding Date: {{weddingDate}}\nVenue: {{venue}}\n\nThis person was manually enrolled via the CRM.",
        callToAction: "",
        callToActionUrl: ""
      };
    }

    // Save updated templates
    await saveEmailTemplates(updatedTemplates);

    return NextResponse.json({ 
      success: true, 
      message: 'Form templates copied to IG DM templates successfully!',
      copied: followUpMapping.length + 1
    });

  } catch (error) {
    console.error('Error copying templates:', error);
    return NextResponse.json({ 
      error: 'Failed to copy templates',
      details: String(error)
    }, { status: 500 });
  }
}
