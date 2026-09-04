import type { LiveRecordSession, PeerSignal, RecordCapabilities, RecordHistoryItem } from '@/lib/record-types';

export type RecordApiSession = LiveRecordSession;

export type RecordPoll = {
  session: RecordApiSession | null;
  signals: PeerSignal | null;
  signalsByPeer: Record<string, PeerSignal> | null;
  capabilities: RecordCapabilities;
  history: RecordHistoryItem[];
};

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
