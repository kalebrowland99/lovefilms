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
    const existingTemplates = await getEmailTemplates() || {};
    
    // Add manual enrollment templates if they don't exist
    const manualTemplates = {
      manualAdmin: {
        name: "Manual Enrollment Admin Notification",
        subject: "Manual Enrollment: {{name}}",
        enabled: true,
        sendTo: "admin",
        timing: "immediate",
        content: "New manual enrollment added!\n\nName: {{name}}\nEmail: {{email}}\nPhone: {{phone}}\nInstagram: {{fianceName}}\nWedding Date: {{weddingDate}}\nVenue: {{venue}}\n\nThis person was manually enrolled via the CRM.",
        callToAction: "",
        callToActionUrl: ""
      },
      manualFollowupDay1: {
        name: "Manual Follow-up Day 1",
        subject: "Quick follow-up, {{name}}!",
        enabled: true,
        sendTo: "inquirer",
        timing: "1 day after manual enrollment",
        content: "Hi {{name}},\n\nJust wanted to follow up from yesterday and see if you have any questions about my wedding videography services!\n\nI'd love to learn more about your wedding plans and see how I can help capture your special day.\n\nLooking forward to connecting!\n\nBest,\nYour Love Films",
        callToAction: "Schedule a Call",
        callToActionUrl: "https://calendly.com/kalebrowland99/personal-wedding-call"
      },
      manualFollowupDay3: {
        name: "Manual Follow-up Day 3",
        subject: "Still thinking about your wedding video?",
        enabled: true,
        sendTo: "inquirer",
        timing: "3 days after manual enrollment",
        content: "Hi {{name}},\n\nI wanted to reach out again and see if you're still considering videography for your wedding.\n\nI know planning a wedding can be overwhelming with so many decisions to make! I'm here to answer any questions and make this process as easy as possible for you.\n\nWould love to chat more about your vision for the day!\n\nBest,\nYour Love Films",
        callToAction: "Let's Talk",
        callToActionUrl: "https://calendly.com/kalebrowland99/personal-wedding-call"
      },
      manualFollowupDay6: {
        name: "Manual Follow-up Day 6",
        subject: "Your wedding date is booking up...",
        enabled: true,
        sendTo: "inquirer",
        timing: "6 days after manual enrollment",
        content: "Hi {{name}},\n\nJust wanted to give you a heads up that wedding dates are filling up quickly, especially for {{weddingDate}}!\n\nI'd hate for you to miss out on having your wedding day captured beautifully. If you're still interested, I'd love to get you on my calendar.\n\nNo pressure at all - just want to make sure you have all the information you need to make the best decision for your big day.\n\nBest wishes,\nYour Love Films",
        callToAction: "Check My Availability",
        callToActionUrl: "https://calendly.com/kalebrowland99/personal-wedding-call"
      },
      manualFollowupDay10: {
        name: "Manual Follow-up Day 10",
        subject: "Last chance to secure your date, {{name}}",
        enabled: true,
        sendTo: "inquirer",
        timing: "10 days after manual enrollment",
        content: "Hi {{name}},\n\nI wanted to reach out one more time about videography for your wedding.\n\nI'm still here to answer any questions you might have, and I'd love to help you capture your special day!\n\nIf now isn't the right time or you've decided to go in a different direction, I completely understand. Just wanted to make sure I followed up!\n\nWishing you all the best with your wedding planning!\n\nBest,\nYour Love Films",
        callToAction: "",
        callToActionUrl: ""
      },
      manualFollowupDay14: {
        name: "Manual Follow-up Day 14",
        subject: "Final follow-up from Your Love Films",
        enabled: true,
        sendTo: "inquirer",
        timing: "14 days after manual enrollment",
        content: "Hi {{name}},\n\nThis will be my last follow-up email - I don't want to be a bother!\n\nIf you're still interested in wedding videography, my door is always open. Feel free to reach out anytime if your plans change or if you have questions down the road.\n\nI wish you nothing but the best for your wedding day and hope it's everything you've dreamed of!\n\nWarmest regards,\nYour Love Films",
        callToAction: "",
        callToActionUrl: ""
      }
    };

    // Merge with existing templates
    const updatedTemplates = {
      ...existingTemplates,
      ...manualTemplates
    };

    // Save to Firebase
    await saveEmailTemplates(updatedTemplates);

    return NextResponse.json({ 
      success: true, 
      message: 'Manual enrollment templates initialized successfully',
      templatesAdded: Object.keys(manualTemplates)
    });

  } catch (error) {
    console.error('Error initializing manual templates:', error);
    return NextResponse.json({ 
      error: 'Failed to initialize templates',
      details: String(error)
    }, { status: 500 });
  }
}
