import { NextResponse } from 'next/server';
import { beginAudioUpload, putResumableChunk, readUploadSession } from '@/lib/record-audio';
import { attachPublishedAudio, attachRecordingAudio } from '@/lib/record-store';
import type { RecordHistoryItem } from '@/lib/record-types';

export const maxDuration = 60;

const ADMIN_PASSWORD = process.env.EMAIL_ADMIN_PASSWORD || 'ylf';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

function asBlob(value: FormDataEntryValue | null): Blob | null {
  if (!value || typeof value === 'string' || typeof (value as Blob).arrayBuffer !== 'function') {
    return null;
  }
  return value as Blob;
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || authHeader.replace('Bearer ', '') !== ADMIN_PASSWORD) {
    return unauthorized();
  }

  const contentType = request.headers.get('content-type') || '';

  try {
    if (contentType.includes('application/json')) {
      const body = (await request.json()) as {
        action?: string;
        recordingId?: string;
        contentType?: string;
        byteLength?: number;
      };
      const recordingId = String(body.recordingId || '');
      if (!recordingId) return NextResponse.json({ error: 'recordingId required' }, { status: 400 });

      if (body.action === 'begin') {
        const session = await beginAudioUpload({
          recordingId,
          contentType: body.contentType || 'audio/webm',
          byteLength: Number(body.byteLength || 0),
          origin: request.headers.get('origin'),
        });
        return NextResponse.json({ session });
      }

      if (body.action === 'finish') {
        const recording = await attachPublishedAudio(recordingId);
        return NextResponse.json({ recording });
      }

      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    const form = await request.formData();
    const recordingId = String(form.get('recordingId') || '');
    const action = String(form.get('action') || 'upload');
    if (!recordingId) {
      return NextResponse.json({ error: 'recordingId required' }, { status: 400 });
    }

    if (action === 'chunk') {
      const session = await readUploadSession(recordingId);
      if (!session) return NextResponse.json({ error: 'Upload session missing' }, { status: 400 });
      const chunk = asBlob(form.get('chunk'));
      const start = Number(form.get('start') || 0);
      if (!chunk || chunk.size === 0) {
        return NextResponse.json({ error: 'Audio chunk required' }, { status: 400 });
      }
      await putResumableChunk({
        uri: session.uri,
        chunk: Buffer.from(await chunk.arrayBuffer()),
        start,
        total: session.byteLength,
        contentType: session.contentType,
      });
      return NextResponse.json({ ok: true, start, bytes: chunk.size });
    }

    const blob = asBlob(form.get('file'));
    if (!blob || blob.size === 0) {
      return NextResponse.json({ error: 'Audio file required' }, { status: 400 });
    }

    const filename =
      'name' in blob && typeof (blob as File).name === 'string' && (blob as File).name
        ? (blob as File).name
        : 'recording.webm';
    const recording: RecordHistoryItem = await attachRecordingAudio(recordingId, {
      data: Buffer.from(await blob.arrayBuffer()),
      contentType: blob.type || 'audio/webm',
      filename,
    });
    return NextResponse.json({ recording });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save audio';
    console.error('POST /api/record/audio', error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
