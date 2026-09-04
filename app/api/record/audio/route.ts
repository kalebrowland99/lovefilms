import { NextResponse } from 'next/server';
import { attachRecordingAudio } from '@/lib/record-store';
import type { RecordHistoryItem } from '@/lib/record-types';

export const maxDuration = 60;

const ADMIN_PASSWORD = process.env.EMAIL_ADMIN_PASSWORD || 'ylf';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || authHeader.replace('Bearer ', '') !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const recordingId = String(form.get('recordingId') || '');
    const file = form.get('file');
    if (!recordingId) {
      return NextResponse.json({ error: 'recordingId required' }, { status: 400 });
    }
    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'Audio file required' }, { status: 400 });
    }

    const recording: RecordHistoryItem = await attachRecordingAudio(recordingId, {
      data: Buffer.from(await file.arrayBuffer()),
      contentType: file.type || 'audio/webm',
      filename: file.name || 'recording.webm',
    });
    return NextResponse.json({ recording });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save audio';
    console.error('POST /api/record/audio', error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
