import type { LiveRecordSession, PeerSignal, RecordCapabilities, RecordHistoryItem } from '@/lib/record-types';
import { filenameForAudioType } from '@/lib/record-audio-format';
import { assertPlayableAudioBlob } from '@/lib/record-health';
import { deletePendingRecording, pendingBlob, type PendingRecording } from '@/lib/record-idb';

export type RecordApiSession = LiveRecordSession;

export type RecordPoll = {
  session: RecordApiSession | null;
  signals: PeerSignal | null;
  signalsByPeer: Record<string, PeerSignal> | null;
  capabilities: RecordCapabilities;
  history: RecordHistoryItem[];
};

const DIRECT_UPLOAD_LIMIT = 3_500_000;
const CHUNK_SIZE = 256 * 1024;

function authHeader(password: string) {
  return { Authorization: `Bearer ${password}` };
}

async function parse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  }
  return data as T;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function pollRecord(input: {
  password: string;
  peerId?: string;
  role: 'host' | 'listener';
}): Promise<RecordPoll> {
  const params = new URLSearchParams({
    role: input.role,
  });
  if (input.peerId) params.set('peerId', input.peerId);
  const res = await fetch(`/api/record?${params.toString()}`, {
    headers: authHeader(input.password),
    cache: 'no-store',
  });
  return parse<RecordPoll>(res);
}

export async function postRecord<T = { session: LiveRecordSession | null }>(
  password: string,
  body: Record<string, unknown>,
): Promise<T> {
  const res = await fetch('/api/record', {
    method: 'POST',
    headers: { ...authHeader(password), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return parse<T>(res);
}

async function postFile(password: string, recordingId: string, audio: Blob) {
  const filename = filenameForAudioType(audio.type);
  const file = new File([audio], filename, { type: audio.type || 'audio/webm' });
  const form = new FormData();
  form.append('recordingId', recordingId);
  form.append('file', file, filename);
  const res = await fetch('/api/record/audio', {
    method: 'POST',
    headers: { Authorization: `Bearer ${password}` },
    body: form,
  });
  return parse<{ recording: RecordHistoryItem }>(res);
}

async function uploadChunked(password: string, recordingId: string, audio: Blob) {
  const beginRes = await fetch('/api/record/audio', {
    method: 'POST',
    headers: { ...authHeader(password), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'begin',
      recordingId,
      contentType: audio.type || 'audio/webm',
      byteLength: audio.size,
    }),
  });
  await parse<{ session: { recordingId: string } }>(beginRes);

  for (let start = 0; start < audio.size; start += CHUNK_SIZE) {
    const slice = audio.slice(start, Math.min(start + CHUNK_SIZE, audio.size));
    const form = new FormData();
    form.append('action', 'chunk');
    form.append('recordingId', recordingId);
    form.append('start', String(start));
    form.append('chunk', slice, 'chunk');
    const chunkRes = await fetch('/api/record/audio', {
      method: 'POST',
      headers: { Authorization: `Bearer ${password}` },
      body: form,
    });
    await parse(chunkRes);
  }

  const finishRes = await fetch('/api/record/audio', {
    method: 'POST',
    headers: { ...authHeader(password), 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'finish', recordingId }),
  });
  return parse<{ recording: RecordHistoryItem }>(finishRes);
}

export async function uploadRecordingAudio(password: string, recordingId: string, audio: Blob) {
  await assertPlayableAudioBlob(audio);
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (audio.size <= DIRECT_UPLOAD_LIMIT) {
        return await postFile(password, recordingId, audio);
      }
      return await uploadChunked(password, recordingId, audio);
    } catch (error) {
      lastError = error;
      await sleep(600 * 2 ** attempt);
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Audio failed to save after retries');
}

export async function finishRecording(
  password: string,
  input: {
    hostId: string;
    utterances: unknown[];
    title: string;
    startedAt: number;
    sessionId?: string;
    audio?: Blob;
    skipStop?: boolean;
    recordingId?: string;
  },
) {
  let session: LiveRecordSession | undefined;
  if (!input.skipStop) {
    const stopped = await postRecord<{ session: LiveRecordSession }>(password, {
      action: 'stop',
      hostId: input.hostId,
      utterances: input.utterances,
      title: input.title,
      startedAt: input.startedAt,
      sessionId: input.sessionId,
    });
    session = stopped.session;
  }

  const recordingId = input.recordingId || session?.id;
  if (!recordingId) {
    throw new Error('Recording id missing; transcript and audio were not linked.');
  }

  if (!input.audio) {
    return {
      session: session || null,
      audioError: 'No audio blob was produced. The recorder may have been stopped by the browser.',
    };
  }

  try {
    const data = await uploadRecordingAudio(password, recordingId, input.audio);
    return { session: session || null, recording: data.recording };
  } catch (error) {
    console.error('Audio attach failed; transcript was still saved:', error);
    return {
      session: session || null,
      audioError: error instanceof Error ? error.message : 'Audio failed to save',
    };
  }
}

export async function recoverPendingRecording(password: string, pending: PendingRecording) {
  const blob = pendingBlob(pending);
  const saved = await finishRecording(password, {
    hostId: pending.hostId,
    utterances: pending.utterances,
    title: pending.title,
    startedAt: pending.startedAt,
    sessionId: pending.id,
    recordingId: pending.complete ? pending.id : undefined,
    skipStop: pending.complete,
    audio: blob,
  });
  if (!saved.audioError) {
    await deletePendingRecording(pending.id).catch(() => undefined);
  }
  return saved;
}

export function getOrCreateClientId() {
  if (typeof window === 'undefined') return '';
  const key = 'ylfRecordClientId';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}
