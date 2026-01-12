import { NextResponse } from 'next/server';
import { getEmailLogs } from '@/lib/database';

const ADMIN_PASSWORD = process.env.EMAIL_ADMIN_PASSWORD || 'yourlovefilms';

// Helper to check password
function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const password = authHeader.replace('Bearer ', '');
  return password === ADMIN_PASSWORD;
}

// GET - Load email logs
export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const logs = await getEmailLogs();
    
    // Sort by most recent first
    logs.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error reading email logs:', error);
    return NextResponse.json({ error: 'Failed to load email logs' }, { status: 500 });
  }
}

