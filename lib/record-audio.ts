import { getApps } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const BUCKET = process.env.FIREBASE_STORAGE_BUCKET || 'lovefilms-d618e.firebasestorage.app';

function bucket() {
  if (!getApps().length) return null;
  try {
    return getStorage().bucket(BUCKET);
  } catch (error) {
    console.error('Firebase Storage unavailable:', error);
    return null;
  }
}

function extFor(contentType: string) {
  if (contentType.includes('mp4') || contentType.includes('aac') || contentType.includes('m4a')) return 'm4a';
  return 'webm';
}

export async function saveRecordingAudio(
  recordingId: string,
  data: Buffer,
  contentType: string,
): Promise<{ path: string; audioUrl: string } | null> {
  const b = bucket();
  if (!b) return null;
  const path = `recordings/${recordingId}.${extFor(contentType)}`;
  const file = b.file(path);
  await file.save(data, {
    contentType: contentType || 'audio/webm',
    resumable: false,
    metadata: { cacheControl: 'public, max-age=31536000' },
  });
  try {
    await file.makePublic();
    return {
      path,
      audioUrl: `https://storage.googleapis.com/${b.name}/${path}`,
    };
  } catch {
    const [audioUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60 * 24 * 365,
    });
    return { path, audioUrl };
  }
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
