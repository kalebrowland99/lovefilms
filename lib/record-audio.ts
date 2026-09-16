import '@/lib/firebase';
import { db, COLLECTIONS } from '@/lib/firebase';
import { MIN_AUDIO_BYTES, looksLikeAudioContainer } from '@/lib/record-audio-format';
import { getApps } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const BUCKET = process.env.FIREBASE_STORAGE_BUCKET || 'lovefilms-d618e.firebasestorage.app';
const MIN_BYTES = MIN_AUDIO_BYTES;

export type AudioUploadSession = {
  recordingId: string;
  path: string;
  uri: string;
  contentType: string;
  byteLength: number;
};

type MemoryUploads = Record<string, AudioUploadSession>;
const g = globalThis as typeof globalThis & { __ylfAudioUploads?: MemoryUploads };
if (!g.__ylfAudioUploads) g.__ylfAudioUploads = {};

function bucket() {
  if (!getApps().length) return null;
  try {
    return getStorage().bucket(BUCKET);
  } catch (error) {
    console.error('Firebase Storage unavailable:', error);
    return null;
  }
}

function requireBucket() {
  const b = bucket();
  if (!b) {
    throw new Error('Firebase Storage is not initialized; cannot save recording audio.');
  }
  return b;
}

function extFor(contentType: string) {
  if (contentType.includes('mp4') || contentType.includes('aac') || contentType.includes('m4a')) return 'm4a';
  return 'webm';
}

export function audioObjectPath(recordingId: string, contentType: string) {
  return `recordings/${recordingId}.${extFor(contentType)}`;
}

export { looksLikeAudioContainer } from '@/lib/record-audio-format';

async function readUrlFor(path: string) {
  const b = requireBucket();
  const file = b.file(path);
  try {
    await file.makePublic();
    return `https://storage.googleapis.com/${b.name}/${path}`;
  } catch {
    const [audioUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60 * 24 * 365,
    });
    return audioUrl;
  }
}

async function writeUploadSession(session: AudioUploadSession) {
  g.__ylfAudioUploads![session.recordingId] = session;
  if (!db) return;
  await db.collection(COLLECTIONS.RECORD_UPLOADS).doc(session.recordingId).set(session);
}

export async function readUploadSession(recordingId: string): Promise<AudioUploadSession | null> {
  const mem = g.__ylfAudioUploads![recordingId];
  if (mem) return mem;
  if (!db) return null;
  const snap = await db.collection(COLLECTIONS.RECORD_UPLOADS).doc(recordingId).get();
  if (!snap.exists) return null;
  const session = snap.data() as AudioUploadSession;
  g.__ylfAudioUploads![recordingId] = session;
  return session;
}

export async function beginAudioUpload(input: {
  recordingId: string;
  contentType: string;
  byteLength: number;
  origin?: string | null;
}): Promise<AudioUploadSession> {
  if (!input.recordingId) throw new Error('recordingId required');
  if (!input.byteLength || input.byteLength < MIN_BYTES) {
    throw new Error('Audio is empty; nothing to upload.');
  }
  const contentType = input.contentType || 'audio/webm';
  const b = requireBucket();
  const path = audioObjectPath(input.recordingId, contentType);
  const file = b.file(path);
  const origin = input.origin?.trim() || undefined;
  const [uri] = await file.createResumableUpload({
    origin,
    metadata: {
      contentType,
      cacheControl: 'public, max-age=31536000',
    },
  });
  const session: AudioUploadSession = {
    recordingId: input.recordingId,
    path,
    uri,
    contentType,
    byteLength: input.byteLength,
  };
  await writeUploadSession(session);
  return session;
}

export async function putResumableChunk(input: {
  uri: string;
  chunk: Buffer;
  start: number;
  total: number;
  contentType: string;
}) {
  const end = input.start + input.chunk.length - 1;
  const res = await fetch(input.uri, {
    method: 'PUT',
    headers: {
      'Content-Length': String(input.chunk.length),
      'Content-Type': input.contentType || 'application/octet-stream',
      'Content-Range': `bytes ${input.start}-${end}/${input.total}`,
    },
    body: new Uint8Array(input.chunk),
  });
  if (!res.ok && res.status !== 308) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Storage upload failed (${res.status})`);
  }
}

export async function verifyAndPublishAudio(path: string, expectedBytes: number) {
  const b = requireBucket();
  const file = b.file(path);
  const [exists] = await file.exists();
  if (!exists) throw new Error('Audio object is missing from storage.');
  const [metadata] = await file.getMetadata();
  const size = Number(metadata.size || 0);
  if (size < MIN_BYTES) throw new Error('Stored audio is empty.');
  if (expectedBytes > 0 && size !== expectedBytes) {
    throw new Error(`Stored audio size ${size} does not match upload ${expectedBytes}.`);
  }
  const peekTo = Math.min(15, Math.max(0, size - 1));
  const [header] = await file.download({ start: 0, end: peekTo });
  if (!looksLikeAudioContainer(header)) {
    throw new Error('Stored file is not a playable audio container.');
  }
  const audioUrl = await readUrlFor(path);
  return { path, audioUrl, bytes: size };
}

export async function saveRecordingAudio(
  recordingId: string,
  data: Buffer,
  contentType: string,
): Promise<{ path: string; audioUrl: string; bytes: number }> {
  if (data.length < MIN_BYTES) throw new Error('Audio is empty; nothing to save.');
  if (!looksLikeAudioContainer(data.subarray(0, Math.min(16, data.length)))) {
    throw new Error('Captured audio is not a playable container.');
  }
  const b = requireBucket();
  const path = audioObjectPath(recordingId, contentType);
  const file = b.file(path);
  await file.save(data, {
    contentType: contentType || 'audio/webm',
    resumable: false,
    metadata: { cacheControl: 'public, max-age=31536000' },
  });
  const published = await verifyAndPublishAudio(path, data.length);
  return { path: published.path, audioUrl: published.audioUrl, bytes: published.bytes };
}

export async function downloadRecordingAudio(path: string): Promise<Buffer | null> {
  const b = bucket();
  if (!b) return null;
  try {
    const [buf] = await b.file(path).download();
    return buf;
  } catch (error) {
    console.error('Failed to download recording audio:', error);
    return null;
  }
}
