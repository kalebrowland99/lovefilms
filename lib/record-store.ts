import { db, COLLECTIONS } from '@/lib/firebase';
import { generateOtterNotes } from '@/lib/record-summary';
import { saveRecordingAudio } from '@/lib/record-audio';
import { diarizeRecordingAudio } from '@/lib/record-diarize';
import type {
  LiveRecordSession,
  PeerSignal,
  RecordHistoryItem,
  TranscriptUtterance,
} from '@/lib/record-types';

const LIVE_DOC = 'live';
const SIGNALS_DOC = 'signals';
const HOST_TIMEOUT_MS = 60_000;
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
    audioUrl: session.audioUrl,
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
    await archiveSession(live);
    await writeLiveToFirebase(null);
    await writeSignals({});
    return null;
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
  if (!live || live.hostId !== hostId) return live;
  if (live.status !== 'recording' && live.status !== 'processing') return live;
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

async function writeHistoryItem(item: RecordHistoryItem) {
  if (!db) {
    memory().history = [item, ...memory().history.filter((row) => row.id !== item.id)].slice(
      0,
      MAX_HISTORY,
    );
    return;
  }
  await db.collection(COLLECTIONS.RECORDINGS).doc(item.id).set(plain(item));
}

export async function stopSession(
  hostId: string,
  extra?: {
    utterances?: TranscriptUtterance[];
    title?: string;
    startedAt?: number;
    sessionId?: string;
  },
) {
  const existing = await readLiveFromFirebase();
  const clientUtterances = extra?.utterances?.filter((u) => u?.text?.trim()) ?? [];

  let live = existing && existing.hostId === hostId ? existing : null;
  if (!live) {
    live = {
      id: extra?.sessionId || newId(),
      hostId,
      title: (extra?.title || '').trim() || 'Consultation call',
      status: 'processing',
      startedAt: extra?.startedAt || Date.now(),
      updatedAt: Date.now(),
      hostHeartbeatAt: Date.now(),
      utterances: clientUtterances,
      interim: '',
      interimSpeaker: 'Speaker 1',
      listeners: [],
      notes: null,
      transcriber: 'browser',
    };
  } else if (clientUtterances.length >= live.utterances.length) {
    live = { ...live, utterances: clientUtterances };
  }

  const processing: LiveRecordSession = {
    ...live,
    status: 'processing',
    updatedAt: Date.now(),
    hostHeartbeatAt: Date.now(),
    interim: '',
  };
  await writeLiveToFirebase(processing);

  let notes = processing.notes;
  try {
    notes = await generateOtterNotes(processing.title, processing.utterances);
    if (processing.title && processing.title !== 'Consultation call') {
      notes = { ...notes, title: processing.title };
    }
  } catch (error) {
    console.error('Notes failed; saving transcript anyway:', error);
    notes = {
      title: processing.title,
      summary:
        processing.utterances.map((u) => u.text).join(' ').slice(0, 800) || 'Recording saved.',
      eventDetails: [],
      keyTakeaways: [],
      actionItems: [],
      outline: [],
      source: 'extractive',
    };
  }

  const ended: LiveRecordSession = {
    ...processing,
    status: 'ended',
    endedAt: Date.now(),
    updatedAt: Date.now(),
    notes,
  };
  await archiveSession(ended);
  await writeLiveToFirebase(null);
  await writeSignals({});
  return ended;
}

export async function attachRecordingAudio(
  recordingId: string,
  audio: { data: Buffer; contentType: string; filename: string },
) {
  const existing = await getRecording(recordingId);
  if (!existing) throw new Error('Recording not found.');

  let audioUrl = existing.audioUrl;
  try {
    const saved = await saveRecordingAudio(recordingId, audio.data, audio.contentType);
    if (saved) audioUrl = saved.audioUrl;
  } catch (error) {
    console.error('Audio upload failed:', error);
  }

  let transcript = existing.transcript;
  let notes = existing.notes;
  try {
    const diarized = await diarizeRecordingAudio(audio.data, audio.filename, audio.contentType);
    if (diarized?.length) {
      transcript = diarized;
      notes = await generateOtterNotes(existing.title, transcript);
      if (existing.title && existing.title !== 'Consultation call') {
        notes = { ...notes, title: existing.title };
      }
    }
  } catch (error) {
    console.error('Speaker diarization skipped:', error);
  }

  const next: RecordHistoryItem = {
    ...existing,
    audioUrl,
    transcript,
    notes,
    utteranceCount: transcript.length,
  };
  await writeHistoryItem(next);
  return next;
}

export async function getRecording(id: string) {
  if (!db) return memory().history.find((item) => item.id === id) ?? null;
  try {
    const snap = await db.collection(COLLECTIONS.RECORDINGS).doc(id).get();
    if (snap.exists) return snap.data() as RecordHistoryItem;
  } catch (error) {
    console.error('Error reading recording:', error);
  }
  return memory().history.find((item) => item.id === id) ?? null;
}

export async function listHistory() {
  return readHistory();
}
