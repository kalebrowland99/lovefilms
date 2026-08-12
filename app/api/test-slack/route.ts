import { NextResponse } from 'next/server';
import { notifyNewInquiry, isSlackConfigured } from '@/lib/slack';
import type { Inquiry } from '@/lib/database';

const ADMIN_PASSWORD = process.env.EMAIL_ADMIN_PASSWORD || 'ylf';

function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  return authHeader.replace('Bearer ', '') === ADMIN_PASSWORD;
}

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSlackConfigured()) {
    return NextResponse.json(
      { error: 'SLACK_BOT_TOKEN is not set in environment variables' },
      { status: 400 }
    );
  }

  const testInquiry: Inquiry = {
    id: 'test-' + Date.now(),
    name: 'Test Couple',
    email: 'test@example.com',
    phone: '(615) 555-0100',
    fianceName: '@testcouple',
    weddingDate: 'June 15, 2027',
    venue: 'The Bell Tower',
    referralSource: 'Instagram',
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  const result = await notifyNewInquiry(testInquiry);

  if (result.success) {
    return NextResponse.json({
      success: true,
      message: `Test notification sent to ${process.env.SLACK_SALES_CHANNEL || '#sales'}`,
    });
  }

  return NextResponse.json(
    { error: result.error || 'Failed to send Slack notification' },
    { status: 500 }
  );
}
