import { NextResponse } from 'next/server';
import { stopSession } from '@/lib/record-store';

export const maxDuration = 60;

const ADMIN_PASSWORD = process.env.EMAIL_ADMIN_PASSWORD || 'ylf';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || authHeader.replace('Bearer ', '') !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const hostId = String(form.get('hostId') || '');
    const file = form.get('file');
    if (!hostId) {
      return NextResponse.json({ error: 'hostId required' }, { status: 400 });
    }

    let audio: { data: Buffer; contentType: string; filename: string } | undefined;
    if (file && file instanceof File && file.size > 0) {
      const bytes = Buffer.from(await file.arrayBuffer());
      audio = {
        data: bytes,
        contentType: file.type || 'audio/webm',
        filename: file.name || 'recording.webm',
      };
    }

    const session = await stopSession(hostId, audio);
    return NextResponse.json({ session });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to finish recording';
    console.error('POST /api/record/audio', error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
