export type RecordStatus = 'idle' | 'recording' | 'processing' | 'ended';

export type TranscriptUtterance = {
  id: string;
  text: string;
  speaker: string;
  startMs: number;
  endMs: number;
  at: number;
};

export type ActionItem = {
  text: string;
  owner?: string;
};

export type OutlineSection = {
  heading: string;
  startMs: number;
  bullets: string[];
};

export type OtterNotes = {
  title: string;
  summary: string;
  eventDetails: { label: string; value: string }[];
  keyTakeaways: string[];
  actionItems: ActionItem[];
  outline: OutlineSection[];
  source: 'llm' | 'extractive';
};

export type PeerSignal = {
  peerId: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  hostIce: RTCIceCandidateInit[];
  listenerIce: RTCIceCandidateInit[];
};

export type LiveRecordSession = {
  id: string;
  hostId: string;
  title: string;
  status: Exclude<RecordStatus, 'idle'>;
  startedAt: number;
  updatedAt: number;
  hostHeartbeatAt: number;
  endedAt?: number;
  utterances: TranscriptUtterance[];
  interim: string;
  interimSpeaker: string;
  listeners: string[];
  notes: OtterNotes | null;
  transcriber: 'deepgram' | 'browser' | 'unknown';
  audioUrl?: string;
  audioPath?: string;
};

export type RecordCapabilities = {
  deepgram: boolean;
  llm: boolean;
  llmProvider: 'openai' | 'groq' | 'anthropic' | null;
};

export type RecordSnapshot = {
  session: LiveRecordSession | null;
  signals: PeerSignal | null;
  capabilities: RecordCapabilities;
  history: RecordHistoryItem[];
};

export type RecordHistoryItem = {
  id: string;
  title: string;
  startedAt: number;
  endedAt: number;
  durationMs: number;
  utteranceCount: number;
  notes: OtterNotes | null;
  transcript: TranscriptUtterance[];
  audioUrl?: string;
};
