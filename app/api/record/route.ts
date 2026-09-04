import { NextResponse } from 'next/server';
import { llmProvider } from '@/lib/record-summary';
import {
  addSignal,
  appendTranscript,
  getAllSignals,
  getLiveSession,
  getPeerSignal,
  getRecording,
  heartbeat,
  joinListener,
  leaveListener,
  listHistory,
  startSession,
  stopSession,
} from '@/lib/record-store';
import type { RecordCapabilities } from '@/lib/record-types';

export const maxDuration = 60;

const ADMIN_PASSWORD = process.env.EMAIL_ADMIN_PASSWORD || 'ylf';

function checkAuth(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  return authHeader.replace('Bearer ', '') === ADMIN_PASSWORD;
}

function capabilities(): RecordCapabilities {
  const provider = llmProvider();
  return {
    deepgram: Boolean(process.env.DEEPGRAM_API_KEY),
    llm: Boolean(provider),
    llmProvider: provider,
  };
}

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET(request: Request) {
  if (!checkAuth(request)) return unauthorized();

  const url = new URL(request.url);
  const peerId = url.searchParams.get('peerId') || undefined;
  const role = url.searchParams.get('role') === 'host' ? 'host' : 'listener';

  try {
    const recordingId = url.searchParams.get('id');
    if (recordingId) {
      const recording = await getRecording(recordingId);
      return NextResponse.json({
        recording,
        capabilities: capabilities(),
      });
    }

    const session = await getLiveSession();
    const roleIsHost = role === 'host';
    if (roleIsHost && peerId && session?.hostId === peerId &&
      (session.status === 'recording' || session.status === 'processing')) {
      await heartbeat(peerId);
    }

    const history = await listHistory();
    const live = session?.status === 'recording' || session?.status === 'processing' ? session : null;
    const signals = peerId ? await getPeerSignal(peerId) : null;
    const signalsByPeer = roleIsHost ? await getAllSignals() : null;

    return NextResponse.json({
      session: live,
      signals,
      signalsByPeer,
      capabilities: capabilities(),
      history,
    });
  } catch (error) {
    console.error('GET /api/record', error);
    return NextResponse.json({ error: 'Failed to load session' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!checkAuth(request)) return unauthorized();

  try {
    const body = await request.json();
    const action = body.action as string;

    if (action === 'start') {
      const session = await startSession({
        hostId: String(body.hostId || ''),
        title: String(body.title || ''),
        transcriber: 'browser',
      });
      return NextResponse.json({ session, capabilities: capabilities() });
    }

    if (action === 'heartbeat') {
      const session = await heartbeat(String(body.hostId || ''));
      return NextResponse.json({ session });
    }

    if (action === 'join') {
      const session = await joinListener(String(body.peerId || ''));
      return NextResponse.json({ session });
    }

    if (action === 'leave') {
      await leaveListener(String(body.peerId || ''));
      return NextResponse.json({ ok: true });
    }

    if (action === 'transcript') {
      const session = await appendTranscript({
        utterance: body.utterance,
        interim: body.interim,
        interimSpeaker: body.interimSpeaker,
      });
      return NextResponse.json({ session });
    }

    if (action === 'signal') {
      const signals = await addSignal({
        peerId: String(body.peerId || ''),
        from: body.from === 'listener' ? 'listener' : 'host',
        offer: body.offer,
        answer: body.answer,
        ice: body.ice,
      });
      return NextResponse.json({ signals });
    }

    if (action === 'stop') {
      const session = await stopSession(String(body.hostId || ''), {
        utterances: Array.isArray(body.utterances) ? body.utterances : undefined,
        title: body.title ? String(body.title) : undefined,
        startedAt: typeof body.startedAt === 'number' ? body.startedAt : undefined,
        sessionId: body.sessionId ? String(body.sessionId) : undefined,
      });
      return NextResponse.json({ session });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Request failed';
    const status = message.includes('already in progress') ? 409 : 400;
    console.error('POST /api/record', error);
    return NextResponse.json({ error: message }, { status });
  }
}
