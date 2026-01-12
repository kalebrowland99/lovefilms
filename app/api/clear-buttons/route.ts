import { NextResponse } from 'next/server';
import { getEmailTemplates, saveEmailTemplates } from '@/lib/database';

const ADMIN_PASSWORD = process.env.EMAIL_ADMIN_PASSWORD || 'yourlovefilms';

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
    console.log('🧹 Clearing all button values from all templates...');
    
    // Load templates from Firebase
    const templates = await getEmailTemplates();
    
    if (!templates) {
      return NextResponse.json({ 
        error: 'No templates found in Firebase' 
      }, { status: 404 });
    }
    
    console.log('📋 Templates before clearing:', Object.keys(templates));
    
    // Clear all button values
    const clearedTemplates: any = {};
    Object.keys(templates).forEach(key => {
      clearedTemplates[key] = {
        ...templates[key],
        callToAction: '',
        callToActionUrl: ''
      };
      console.log(`  ✂️  Cleared buttons from: ${key}`);
    });
    
    // Save back to Firebase
    await saveEmailTemplates(clearedTemplates);
    
    console.log('✅ All buttons cleared successfully!');
    
    return NextResponse.json({ 
      success: true,
      message: 'All buttons cleared from all templates',
      clearedTemplates: Object.keys(clearedTemplates)
    });
    
  } catch (error: any) {
    console.error('Error clearing buttons:', error);
    return NextResponse.json({ 
      error: 'Failed to clear buttons', 
      details: error.message 
    }, { status: 500 });
  }
}

