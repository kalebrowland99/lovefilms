import { db, COLLECTIONS } from '@/lib/firebase';
import { generateOtterNotes } from '@/lib/record-summary';
import type {
  LiveRecordSession,
  PeerSignal,
  RecordHistoryItem,
  TranscriptUtterance,
} from '@/lib/record-types';

const LIVE_DOC = 'live';
const SIGNALS_DOC = 'signals';
const HOST_TIMEOUT_MS = 12_000;
const MAX_UTTERANCES = 2500;
const MAX_HISTORY = 40;

type SignalMap = Record<string, PeerSignal>;

type MemoryStore = {
  live: LiveRecordSession | null;
  signals: SignalMap;
  history: RecordHistoryItem[];
};

const g = globalThis as typeof globalThis & { __ylfLiveRecord?: MemoryStore };
if (!g.__ylfLiveRecord) {
  g.__ylfLiveRecord = { live: null, signals: {}, history: [] };
}

function memory() {
  return g.__ylfLiveRecord!;
}

function newId() {
  return crypto.randomUUID();
}

function historyFromSession(session: LiveRecordSession): RecordHistoryItem {
  return {
    id: session.id,
    title: session.title,
    startedAt: session.startedAt,
    endedAt: session.endedAt ?? Date.now(),
    durationMs: (session.endedAt ?? Date.now()) - session.startedAt,
    utteranceCount: session.utterances.length,
    notes: session.notes,
    transcript: session.utterances,
  };
}

function plain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

async function readLiveFromFirebase(): Promise<LiveRecordSession | null> {
  if (!db) return memory().live;
  const snap = await db.collection(COLLECTIONS.RECORD_SESSIONS).doc(LIVE_DOC).get();
  if (!snap.exists) return null;
  return snap.data() as LiveRecordSession;
}

async function writeLiveToFirebase(session: LiveRecordSession | null) {
  if (!db) {
    memory().live = session;
    return;
  }
  const ref = db.collection(COLLECTIONS.RECORD_SESSIONS).doc(LIVE_DOC);
  if (!session) {
    await ref.delete().catch(() => undefined);
    return;
  }
  await ref.set(plain(session));
}

async function readSignals(): Promise<SignalMap> {
  if (!db) return memory().signals;
  const snap = await db.collection(COLLECTIONS.RECORD_SESSIONS).doc(SIGNALS_DOC).get();
  if (!snap.exists) return {};
  return ((snap.data() as { peers?: SignalMap })?.peers ?? {}) as SignalMap;
}

async function writeSignals(signals: SignalMap) {
  if (!db) {
    memory().signals = signals;
    return;
  }
  await db.collection(COLLECTIONS.RECORD_SESSIONS).doc(SIGNALS_DOC).set(plain({ peers: signals }));
}

async function readHistory(): Promise<RecordHistoryItem[]> {
  if (!db) return memory().history;
  try {
    const snap = await db
      .collection(COLLECTIONS.RECORDINGS)
      .orderBy('endedAt', 'desc')
      .limit(MAX_HISTORY)
      .get();
    return snap.docs.map((d) => d.data() as RecordHistoryItem);
  } catch (error) {
    console.error('Error reading recording history:', error);
    return [];
  }
}

async function archiveSession(session: LiveRecordSession) {
  const item = historyFromSession(session);
  if (!db) {
    memory().history = [item, ...memory().history].slice(0, MAX_HISTORY);
    return;
  }
  await db.collection(COLLECTIONS.RECORDINGS).doc(item.id).set(plain(item));
}

function expireIfNeeded(session: LiveRecordSession | null): LiveRecordSession | null {
  if (!session || session.status !== 'recording') return session;
  if (Date.now() - session.hostHeartbeatAt < HOST_TIMEOUT_MS) return session;
  return {
    ...session,
    status: 'ended',
    endedAt: Date.now(),
    updatedAt: Date.now(),
    interim: '',
  };
}

export async function getLiveSession(): Promise<LiveRecordSession | null> {
  const raw = await readLiveFromFirebase();
  const live = expireIfNeeded(raw);
  if (raw && live && raw.status === 'recording' && live.status === 'ended') {
    await writeLiveToFirebase(live);
  }
  return live;
}

export async function startSession(input: {
  hostId: string;
  title: string;
  transcriber: LiveRecordSession['transcriber'];
}): Promise<LiveRecordSession> {
  const existing = expireIfNeeded(await readLiveFromFirebase());
  if (existing?.status === 'recording' && existing.hostId !== input.hostId) {
    throw new Error('A live recording is already in progress. Join as a listener.');
  }
  if (existing && existing.status !== 'recording') {
    await archiveSession(existing);
  }

  const now = Date.now();
  const session: LiveRecordSession = {
    id: newId(),
    hostId: input.hostId,
    title: input.title.trim() || 'Consultation call',
    status: 'recording',
    startedAt: now,
    updatedAt: now,
    hostHeartbeatAt: now,
    utterances: [],
    interim: '',
    interimSpeaker: 'Speaker 1',
    listeners: [],
    notes: null,
    transcriber: input.transcriber,
  };
  await writeLiveToFirebase(session);
  await writeSignals({});
  return session;
}

export async function heartbeat(hostId: string) {
  const live = await readLiveFromFirebase();
  if (!live || live.hostId !== hostId || live.status !== 'recording') return live;
  const next = { ...live, hostHeartbeatAt: Date.now(), updatedAt: Date.now() };
  await writeLiveToFirebase(next);
  return next;
}

export async function joinListener(peerId: string) {
  const live = expireIfNeeded(await readLiveFromFirebase());
  if (!live || live.status !== 'recording') {
    throw new Error('No live recording to join.');
  }
  const listeners = live.listeners.includes(peerId) ? live.listeners : [...live.listeners, peerId];
  const next = { ...live, listeners, updatedAt: Date.now() };
  await writeLiveToFirebase(next);

  const signals = await readSignals();
  if (!signals[peerId]) {
    signals[peerId] = { peerId, hostIce: [], listenerIce: [] };
    await writeSignals(signals);
  }
  return next;
}

export async function leaveListener(peerId: string) {
  const live = await readLiveFromFirebase();
  if (live) {
    await writeLiveToFirebase({
      ...live,
      listeners: live.listeners.filter((id) => id !== peerId),
      updatedAt: Date.now(),
    });
  }
  const signals = await readSignals();
  if (signals[peerId]) {
    delete signals[peerId];
    await writeSignals(signals);
  }
}

export async function appendTranscript(input: {
  utterance?: Omit<TranscriptUtterance, 'id' | 'at'> & { id?: string; at?: number };
  interim?: string;
  interimSpeaker?: string;
}) {
  const live = await readLiveFromFirebase();
  if (!live || live.status !== 'recording') return live;

  let utterances = live.utterances;
  if (input.utterance?.text.trim()) {
    const nextU: TranscriptUtterance = {
      id: input.utterance.id || newId(),
      text: input.utterance.text.trim(),
      speaker: input.utterance.speaker || 'Speaker 1',
      startMs: input.utterance.startMs,
      endMs: input.utterance.endMs,
      at: input.utterance.at || Date.now(),
    };
    utterances = [...utterances, nextU].slice(-MAX_UTTERANCES);
  }

  const next: LiveRecordSession = {
    ...live,
    utterances,
    interim: input.interim ?? live.interim,
    interimSpeaker: input.interimSpeaker ?? live.interimSpeaker,
    updatedAt: Date.now(),
    hostHeartbeatAt: Date.now(),
  };
  await writeLiveToFirebase(next);
  return next;
}

export async function addSignal(input: {
  peerId: string;
  from: 'host' | 'listener';
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  ice?: RTCIceCandidateInit;
}) {
  const signals = await readSignals();
  const current: PeerSignal = signals[input.peerId] ?? {
    peerId: input.peerId,
    hostIce: [],
    listenerIce: [],
  };
  if (input.offer) current.offer = plain(input.offer);
  if (input.answer) current.answer = plain(input.answer);
  if (input.ice) {
    const ice = plain(input.ice);
    if (input.from === 'host') current.hostIce = [...current.hostIce, ice].slice(-40);
    else current.listenerIce = [...current.listenerIce, ice].slice(-40);
  }
  signals[input.peerId] = current;
  await writeSignals(signals);
  return current;
}

export async function drainIce(peerId: string, role: 'host' | 'listener') {
  const signals = await readSignals();
  const current = signals[peerId];
  if (!current) return null;
  if (role === 'host') current.listenerIce = [];
  else current.hostIce = [];
  signals[peerId] = current;
  await writeSignals(signals);
  return current;
}

export async function getPeerSignal(peerId: string) {
  const signals = await readSignals();
  return signals[peerId] ?? null;
}

export async function getAllSignals() {
  return readSignals();
}

export async function stopSession(hostId: string) {
  const live = await readLiveFromFirebase();
  if (!live) throw new Error('No live recording.');
  if (live.hostId !== hostId) throw new Error('Only the recorder can stop this call.');

  const processing: LiveRecordSession = {
    ...live,
    status: 'processing',
    updatedAt: Date.now(),
    interim: '',
  };
  await writeLiveToFirebase(processing);

  const notes = await generateOtterNotes(live.title, live.utterances);
  const ended: LiveRecordSession = {
    ...processing,
    status: 'ended',
    endedAt: Date.now(),
    updatedAt: Date.now(),
    notes,
  };
  await writeLiveToFirebase(ended);
  await archiveSession(ended);
  await writeSignals({});
  return ended;
}

export async function listHistory() {
  return readHistory();
}
