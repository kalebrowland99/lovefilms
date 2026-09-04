'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Copy,
  Headphones,
  Mic,
  Pause,
  Play,
  Radio,
  Square,
} from 'lucide-react';
import { finishRecording, getOrCreateClientId, pollRecord, postRecord } from '@/lib/record-client';
import {
  formatCallWhen,
  formatClock,
  formatDuration,
  formatFeedDate,
  iceConfig,
  pickRecorderMime,
  speakerColor,
} from '@/lib/record-media';
import type {
  LiveRecordSession,
  OtterNotes,
  PeerSignal,
  RecordHistoryItem,
  TranscriptUtterance,
} from '@/lib/record-types';

type Role = 'idle' | 'host' | 'listener';
type View = 'home' | 'live' | 'detail';
type DetailTab = 'summary' | 'transcript';

const POLL_MS = 450;
const SPEAKER_GAP_MS = 1600;

function speechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === 'undefined') return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((ev: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
};

function toHistoryItem(session: LiveRecordSession, audioUrl?: string): RecordHistoryItem {
  return {
    id: session.id,
    title: session.notes?.title || session.title,
    startedAt: session.startedAt,
    endedAt: session.endedAt ?? Date.now(),
    durationMs: (session.endedAt ?? Date.now()) - session.startedAt,
    utteranceCount: session.utterances.length,
    notes: session.notes,
    transcript: session.utterances,
    audioUrl: audioUrl || session.audioUrl,
  };
}

function avatarLetter(title: string) {
  const cleaned = title.replace(/[^A-Za-z]/g, '');
  return (cleaned[0] || 'R').toUpperCase();
}

function avatarColor(title: string) {
  return speakerColor(title || 'R');
}

function groupHistory(items: RecordHistoryItem[]) {
  const groups: { heading: string; items: RecordHistoryItem[] }[] = [];
  for (const item of items) {
    const heading = formatFeedDate(item.startedAt);
    const last = groups[groups.length - 1];
    if (last && last.heading === heading) last.items.push(item);
    else groups.push({ heading, items: [item] });
  }
  return groups;
}

export function RecordStudio() {
  const [password, setPassword] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authed, setAuthed] = useState(false);
  const [clientId, setClientId] = useState('');
  const [title, setTitle] = useState('');
  const [session, setSession] = useState<LiveRecordSession | null>(null);
  const [utterances, setUtterances] = useState<TranscriptUtterance[]>([]);
  const [interim, setInterim] = useState('');
  const [interimSpeaker, setInterimSpeaker] = useState('Speaker 1');
  const [history, setHistory] = useState<RecordHistoryItem[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [listenArmed, setListenArmed] = useState(false);
  const [view, setView] = useState<View>('home');
  const [openCall, setOpenCall] = useState<RecordHistoryItem | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('summary');
  const [elapsed, setElapsed] = useState(0);
  const [levels, setLevels] = useState<number[]>(() => Array(28).fill(4));
  const [localAudioUrl, setLocalAudioUrl] = useState<string | null>(null);

  const passwordRef = useRef('');
  const clientIdRef = useRef('');
  const streamRef = useRef<MediaStream | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const hostPcs = useRef(new Map<string, RTCPeerConnection>());
  const remoteSet = useRef(new Set<string>());
  const seenIce = useRef(new Set<string>());
  const listenerPc = useRef<RTCPeerConnection | null>(null);
  const liveAudioEl = useRef<HTMLAudioElement | null>(null);
  const listeningRef = useRef(false);
  const hostActiveRef = useRef(false);
  const transcribePosted = useRef(0);
  const speakerTurnRef = useRef(1);
  const lastFinalAtRef = useRef(0);
  const utterancesRef = useRef<TranscriptUtterance[]>([]);
  utterancesRef.current = utterances;

  useEffect(() => {
    passwordRef.current = password;
  }, [password]);

  const applyPoll = useCallback((data: Awaited<ReturnType<typeof pollRecord>>, pollRole: Role) => {
    if (data.history) setHistory(data.history);
    const live = data.session;
    if (live && (live.status === 'recording' || live.status === 'processing')) {
      setSession(live);
      if (pollRole !== 'host' || live.status !== 'recording') {
        setUtterances(live.utterances);
        setInterim(live.interim || '');
        setInterimSpeaker(live.interimSpeaker || 'Speaker 1');
      }
      if (!hostActiveRef.current && live.status === 'recording') setView('live');
      return;
    }
    setSession(null);
    if (!hostActiveRef.current) {
      setInterim('');
      if (pollRole !== 'host') setView((current) => (current === 'live' ? 'home' : current));
    }
  }, []);

  useEffect(() => {
    const id = getOrCreateClientId();
    setClientId(id);
    clientIdRef.current = id;
    const saved = sessionStorage.getItem('emailAdminPassword');
    if (saved) {
      setPassword(saved);
      passwordRef.current = saved;
      pollRecord({ password: saved, role: 'listener' })
        .then((data) => {
          setAuthed(true);
          applyPoll(data, 'listener');
        })
        .catch(() => undefined);
    }
  }, [applyPoll]);

  const role: Role = useMemo(() => {
    if (session?.status === 'recording' || session?.status === 'processing') {
      if (session.hostId === clientId || hostActiveRef.current) return 'host';
      return 'listener';
    }
    return 'idle';
  }, [session, clientId]);

  useEffect(() => {
    if (!authed || !password) return;
    let cancelled = false;

    const tick = async () => {
      try {
        const pollRole: Role = hostActiveRef.current ? 'host' : 'listener';
        const data = await pollRecord({
          password: passwordRef.current,
          role: pollRole,
          peerId: clientIdRef.current,
        });
        if (cancelled) return;
        applyPoll(data, pollRole);

        if (pollRole === 'host' && hostActiveRef.current && data.signalsByPeer) {
          await syncHostPeers(data.session?.listeners ?? [], data.signalsByPeer);
        }
        if (pollRole === 'listener' && listeningRef.current && data.signals) {
          await consumeListenerSignal(data.signals);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Sync failed';
          if (message === 'Unauthorized') {
            setAuthed(false);
            sessionStorage.removeItem('emailAdminPassword');
          }
        }
      }
    };

    tick();
    const id = window.setInterval(tick, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, password, applyPoll]);

  useEffect(() => {
    if (session?.status !== 'recording' || !session.startedAt) return;
    const id = window.setInterval(() => setElapsed(Date.now() - session.startedAt), 250);
    return () => window.clearInterval(id);
  }, [session?.status, session?.startedAt]);

  const displayedCall = openCall
    ? history.find((item) => item.id === openCall.id) || openCall
    : null;

  const drawLevels = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    const bars = 28;
    const next: number[] = [];
    const slice = Math.floor(data.length / bars);
    for (let i = 0; i < bars; i++) {
      let sum = 0;
      for (let j = 0; j < slice; j++) sum += data[i * slice + j];
      next.push(4 + (sum / slice / 255) * 36);
    }
    setLevels(next);
    rafRef.current = window.requestAnimationFrame(drawLevels);
  }, []);

  async function attachAnalyser(stream: MediaStream) {
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(drawLevels);
  }

  async function postTranscript(payload: Record<string, unknown>) {
    const now = Date.now();
    if (payload.interim !== undefined && now - transcribePosted.current < 200) return;
    transcribePosted.current = now;
    await postRecord(passwordRef.current, { action: 'transcript', ...payload });
  }

  function nextSpeaker() {
    const now = Date.now();
    if (lastFinalAtRef.current && now - lastFinalAtRef.current > SPEAKER_GAP_MS) {
      speakerTurnRef.current = speakerTurnRef.current === 1 ? 2 : 1;
    }
    lastFinalAtRef.current = now;
    return `Speaker ${speakerTurnRef.current}`;
  }

  function pushLocalUtterance(text: string, speaker: string, startMs: number, endMs: number) {
    const utterance: TranscriptUtterance = {
      id: crypto.randomUUID(),
      text,
      speaker,
      startMs,
      endMs,
      at: Date.now(),
    };
    setUtterances((prev) => [...prev, utterance]);
    setInterim('');
    void postTranscript({ utterance });
  }

  function startBrowserTranscription() {
    const Ctor = speechRecognitionCtor();
    if (!Ctor) throw new Error('Live transcription needs Chrome, Edge, or Safari, and microphone permission.');
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onresult = (event) => {
      let nextInterim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const piece = event.results[i][0].transcript.trim();
        if (!piece) continue;
        if (event.results[i].isFinal) {
          const startMs = Date.now() - startedAtRef.current;
          const speaker = nextSpeaker();
          setInterimSpeaker(speaker);
          pushLocalUtterance(piece, speaker, Math.max(0, startMs - 2500), startMs);
        } else {
          nextInterim += (nextInterim ? ' ' : '') + piece;
        }
      }
      if (nextInterim) {
        const speaker = `Speaker ${speakerTurnRef.current}`;
        setInterim(nextInterim);
        setInterimSpeaker(speaker);
        void postTranscript({ interim: nextInterim, interimSpeaker: speaker });
      }
    };
    rec.onerror = (ev) => {
      if (ev.error !== 'no-speech' && ev.error !== 'aborted') {
        setError(`Transcription: ${ev.error}`);
      }
    };
    rec.onend = () => {
      if (hostActiveRef.current) {
        try {
          rec.start();
        } catch {
          /* Chrome throws if restart is too fast */
        }
      }
    };
    rec.start();
    recognitionRef.current = rec;
  }

  async function createHostPeer(peerId: string, stream: MediaStream) {
    if (hostPcs.current.has(peerId)) return;
    const pc = new RTCPeerConnection(iceConfig());
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    pc.onicecandidate = (event) => {
      if (!event.candidate) return;
      void postRecord(passwordRef.current, {
        action: 'signal',
        peerId,
        from: 'host',
        ice: event.candidate.toJSON(),
      });
    };
    const offer = await pc.createOffer({ offerToReceiveAudio: false });
    await pc.setLocalDescription(offer);
    await postRecord(passwordRef.current, {
      action: 'signal',
      peerId,
      from: 'host',
      offer,
    });
    hostPcs.current.set(peerId, pc);
  }

  async function syncHostPeers(listeners: string[], signalsByPeer: Record<string, PeerSignal>) {
    const stream = streamRef.current;
    if (!stream) return;
    for (const peerId of listeners) {
      if (peerId === clientIdRef.current) continue;
      await createHostPeer(peerId, stream);
      const pc = hostPcs.current.get(peerId);
      const signal = signalsByPeer[peerId];
      if (!pc || !signal) continue;
      if (signal.answer && !remoteSet.current.has(peerId)) {
        try {
          await pc.setRemoteDescription(signal.answer);
          remoteSet.current.add(peerId);
        } catch {
          /* already applied */
        }
      }
      for (const ice of signal.listenerIce) {
        const key = `${peerId}-l-${ice.candidate}`;
        if (seenIce.current.has(key)) continue;
        seenIce.current.add(key);
        try {
          await pc.addIceCandidate(ice);
        } catch {
          /* duplicate */
        }
      }
    }
    for (const [id, pc] of hostPcs.current) {
      if (!listeners.includes(id)) {
        pc.close();
        hostPcs.current.delete(id);
        remoteSet.current.delete(id);
      }
    }
  }

  async function consumeListenerSignal(signal: PeerSignal) {
    const pc = listenerPc.current;
    if (!pc) return;
    if (signal.offer && pc.signalingState === 'stable' && !pc.currentRemoteDescription) {
      await pc.setRemoteDescription(signal.offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await postRecord(passwordRef.current, {
        action: 'signal',
        peerId: clientIdRef.current,
        from: 'listener',
        answer,
      });
    }
    for (const ice of signal.hostIce) {
      const key = `h-${ice.candidate}`;
      if (seenIce.current.has(key)) continue;
      seenIce.current.add(key);
      try {
        await pc.addIceCandidate(ice);
      } catch {
        /* ignore */
      }
    }
  }

  async function startListening() {
    if (listeningRef.current) return;
    listeningRef.current = true;
    setListenArmed(true);
    setError('');
    await postRecord(passwordRef.current, { action: 'join', peerId: clientIdRef.current });
    const pc = new RTCPeerConnection(iceConfig());
    pc.ontrack = (event) => {
      const media = event.streams[0] || new MediaStream([event.track]);
      if (liveAudioEl.current) {
        liveAudioEl.current.srcObject = media;
        void liveAudioEl.current.play().then(() => setListening(true));
      }
    };
    pc.onicecandidate = (event) => {
      if (!event.candidate) return;
      void postRecord(passwordRef.current, {
        action: 'signal',
        peerId: clientIdRef.current,
        from: 'listener',
        ice: event.candidate.toJSON(),
      });
    };
    listenerPc.current = pc;
  }

  async function stopListening() {
    listeningRef.current = false;
    setListening(false);
    setListenArmed(false);
    listenerPc.current?.close();
    listenerPc.current = null;
    if (liveAudioEl.current) liveAudioEl.current.srcObject = null;
    await postRecord(passwordRef.current, { action: 'leave', peerId: clientIdRef.current }).catch(() => undefined);
  }

  function teardownCapture() {
    hostActiveRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    if (recRef.current && recRef.current.state !== 'inactive') recRef.current.stop();
    recRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    for (const pc of hostPcs.current.values()) pc.close();
    hostPcs.current.clear();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    void audioCtxRef.current?.close();
    audioCtxRef.current = null;
    analyserRef.current = null;
    setLevels(Array(28).fill(4));
  }

  async function startRecording() {
    setError('');
    setBusy(true);
    setLocalAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    chunksRef.current = [];
    speakerTurnRef.current = 1;
    lastFinalAtRef.current = 0;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      startedAtRef.current = Date.now();
      hostActiveRef.current = true;
      setUtterances([]);
      setInterim('');
      setView('live');
      setOpenCall(null);

      startBrowserTranscription();

      const mime = pickRecorderMime();
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.start(1000);
      recRef.current = recorder;

      await attachAnalyser(stream);
      const { session: next } = await postRecord<{ session: LiveRecordSession }>(passwordRef.current, {
        action: 'start',
        hostId: clientIdRef.current,
        title: title.trim() || 'Consultation call',
        transcriber: 'browser',
      });
      setSession(next);
    } catch (err) {
      teardownCapture();
      setView('home');
      setError(err instanceof Error ? err.message : 'Could not start recording');
    } finally {
      setBusy(false);
    }
  }

  async function stopRecording() {
    setBusy(true);
    setError('');
    try {
      const mime = recRef.current?.mimeType || pickRecorderMime() || 'audio/webm';
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      await new Promise<void>((resolve) => {
        const rec = recRef.current;
        if (!rec || rec.state === 'inactive') {
          resolve();
          return;
        }
        rec.addEventListener('stop', () => resolve(), { once: true });
        rec.stop();
      });
      recRef.current = null;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;

      const blob = chunksRef.current.length ? new Blob(chunksRef.current, { type: mime }) : undefined;
      const blobUrl = blob ? URL.createObjectURL(blob) : null;
      setLocalAudioUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return blobUrl;
      });

      const saved = await finishRecording(passwordRef.current, {
        hostId: clientIdRef.current,
        utterances: utterancesRef.current,
        title: title.trim() || session?.title || 'Consultation call',
        startedAt: session?.startedAt || startedAtRef.current,
        sessionId: session?.id,
        audio: blob,
      });

      hostActiveRef.current = false;
      teardownCapture();

      const item =
        saved.recording ||
        toHistoryItem(saved.session, saved.session.audioUrl || blobUrl || undefined);
      setOpenCall(item);
      setHistory((prev) => [item, ...prev.filter((row) => row.id !== item.id)]);
      setSession(null);
      setView('detail');
      setDetailTab('summary');
    } catch (err) {
      teardownCapture();
      setView('home');
      setError(err instanceof Error ? err.message : 'Could not stop recording');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    return () => {
      teardownCapture();
      if (listeningRef.current) void stopListening();
    };
  }, []);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setAuthError('');
    try {
      await pollRecord({ password: passwordInput, role: 'listener' });
      sessionStorage.setItem('emailAdminPassword', passwordInput);
      setPassword(passwordInput);
      passwordRef.current = passwordInput;
      setAuthed(true);
    } catch {
      setAuthError('Incorrect password');
    }
  }

  const live = session?.status === 'recording';
  const processing = session?.status === 'processing' || busy && view === 'live' && !live;
  const listenerCount = session?.listeners.length ?? 0;
  const playUrl = displayedCall?.audioUrl || localAudioUrl;

  if (!authed) {
    return (
      <div className="min-h-screen bg-white text-[#111] flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-md border border-black/10 rounded-2xl p-8 shadow-sm">
          <p className="text-[11px] tracking-[0.2em] uppercase text-black/45">Your Love Films</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Record</h1>
          <p className="mt-3 text-sm text-black/60">Team access for live call recording, transcription, and notes.</p>
          <label className="block mt-6 text-sm">
            Password
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="mt-2 w-full rounded-lg border border-black/15 px-4 py-3 outline-none focus:border-[#1876F2]"
              required
            />
          </label>
          {authError ? <p className="mt-2 text-sm text-[#C0392B]">{authError}</p> : null}
          <button type="submit" className="mt-6 w-full bg-[#1876F2] text-white py-3 rounded-lg font-medium">
            Enter studio
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-[#111]">
      <header className="sticky top-0 z-20 border-b border-black/8 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            {view === 'detail' ? (
              <button
                onClick={() => {
                  setView('home');
                  setOpenCall(null);
                }}
                className="rounded-full p-2 text-black/60 hover:bg-black/5"
                aria-label="Back to recordings"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : (
              <Link href="/" className="text-[11px] tracking-[0.18em] uppercase text-black/40 hover:text-black">
                YLF
              </Link>
            )}
            <span className="truncate text-lg font-semibold tracking-tight">
              {view === 'detail' ? displayedCall?.title || 'Recording' : 'Recordings'}
            </span>
            {live ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C0392B] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                Live
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {live ? <span className="hidden tabular-nums text-sm text-black/55 md:inline">{formatClock(elapsed)}</span> : null}
            {role === 'host' && live ? (
              <button
                onClick={stopRecording}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-full bg-[#C0392B] px-4 py-2 text-sm font-medium text-white"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                Stop
              </button>
            ) : null}
            {view === 'home' ? (
              <button
                onClick={startRecording}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-full bg-[#1876F2] px-4 py-2 text-sm font-medium text-white"
              >
                <Mic className="h-4 w-4" />
                Record
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <audio ref={liveAudioEl} autoPlay playsInline className="hidden" />

      <main className="mx-auto max-w-5xl px-4 py-6 md:px-8">
        {error ? (
          <div className="mb-6 rounded-lg border border-[#C0392B]/20 bg-[#C0392B]/8 px-4 py-3 text-sm text-[#C0392B]">
            {error}
          </div>
        ) : null}

        {view === 'home' ? (
          <HomeFeed
            title={title}
            setTitle={setTitle}
            history={history}
            onOpen={(item) => {
              setOpenCall(item);
              setDetailTab('summary');
              setView('detail');
            }}
          />
        ) : null}

        {view === 'live' && session ? (
          <LiveCall
            session={session}
            role={role}
            live={!!live}
            processing={!!processing}
            elapsed={elapsed}
            levels={levels}
            utterances={utterances}
            interim={interim}
            interimSpeaker={interimSpeaker}
            listenerCount={listenerCount}
            listening={listening}
            listenArmed={listenArmed}
            onListen={() => void startListening()}
            onStopListen={() => void stopListening()}
          />
        ) : null}

        {view === 'detail' && displayedCall ? (
          <CallDetail
            call={displayedCall}
            tab={detailTab}
            onTab={setDetailTab}
            playUrl={playUrl}
          />
        ) : null}
      </main>
    </div>
  );
}

function HomeFeed({
  title,
  setTitle,
  history,
  onOpen,
}: {
  title: string;
  setTitle: (v: string) => void;
  history: RecordHistoryItem[];
  onOpen: (item: RecordHistoryItem) => void;
}) {
  const groups = groupHistory(history);
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 rounded-2xl border border-black/8 bg-white p-5">
        <label className="block text-sm text-black/55">
          Call title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Example: Heather and Hannah"
            className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[#1876F2]"
          />
        </label>
      </div>

      {groups.length ? (
        groups.map((group) => (
          <section key={group.heading} className="mb-8">
            <h2 className="mb-3 text-[15px] font-semibold text-black/80">{group.heading}</h2>
            <div className="space-y-3">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onOpen(item)}
                  className="flex w-full gap-4 rounded-2xl border border-black/8 bg-white p-4 text-left transition hover:border-black/20 hover:shadow-sm"
                >
                  <span
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ background: avatarColor(item.title) }}
                  >
                    {avatarLetter(item.title)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[17px] font-semibold">{item.title}</span>
                    <span className="mt-0.5 block text-[13px] text-black/45">
                      {new Date(item.startedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      {' • '}
                      {formatDuration(item.durationMs)}
                      {' • Love Films'}
                    </span>
                    {item.notes?.summary ? (
                      <span className="mt-2 block text-[14px] leading-relaxed text-black/70 line-clamp-3">
                        {item.notes.summary}
                      </span>
                    ) : null}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))
      ) : (
        <p className="py-16 text-center text-black/40">No recordings yet. Tap Record to capture a call.</p>
      )}
    </div>
  );
}

function LiveCall({
  session,
  role,
  live,
  processing,
  elapsed,
  levels,
  utterances,
  interim,
  interimSpeaker,
  listenerCount,
  listening,
  listenArmed,
  onListen,
  onStopListen,
}: {
  session: LiveRecordSession;
  role: Role;
  live: boolean;
  processing: boolean;
  elapsed: number;
  levels: number[];
  utterances: TranscriptUtterance[];
  interim: string;
  interimSpeaker: string;
  listenerCount: number;
  listening: boolean;
  listenArmed: boolean;
  onListen: () => void;
  onStopListen: () => void;
}) {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[12px] text-black/45">
            {role === 'listener' ? 'Someone is recording' : processing ? 'Writing notes…' : 'Recording'}
            {live ? ` · ${formatClock(elapsed)}` : ''}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{session.title}</h1>
          <p className="mt-2 text-sm text-black/55">
            {role === 'listener'
              ? 'Live transcript is below. Optionally listen to the room audio.'
              : 'Keep this tab open. After you stop, Speaker 1 / Speaker 2 is labeled from the audio.'}
          </p>
        </div>
        {role === 'listener' && live ? (
          listenArmed ? (
            <button
              onClick={onStopListen}
              className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-sm"
            >
              <Pause className="h-4 w-4" />
              {listening ? 'Stop listening' : 'Connecting audio…'}
            </button>
          ) : (
            <button
              onClick={onListen}
              className="inline-flex items-center gap-2 rounded-full bg-[#1876F2] px-4 py-2 text-sm font-medium text-white"
            >
              <Headphones className="h-4 w-4" />
              Listen live
            </button>
          )
        ) : null}
      </div>

      {role === 'host' && live ? (
        <div className="mb-6 flex h-12 items-end gap-[3px] rounded-xl bg-[#111] px-4 py-2">
          {levels.map((h, i) => (
            <span
              key={i}
              className="w-full rounded-full bg-white"
              style={{ height: `${h}px`, opacity: 0.35 + (h / 40) * 0.65 }}
            />
          ))}
        </div>
      ) : null}

      {listening ? (
        <p className="mb-4 inline-flex items-center gap-2 text-sm text-[#1876F2]">
          <Radio className="h-4 w-4" />
          You are listening to the live recording
        </p>
      ) : null}

      {listenerCount > 0 && live ? (
        <p className="mb-3 text-xs text-black/40">{listenerCount} on this page</p>
      ) : null}

      <TranscriptPane
        utterances={utterances}
        interim={interim}
        interimSpeaker={interimSpeaker}
        live={live}
        processing={processing}
      />
    </div>
  );
}

function CallDetail({
  call,
  tab,
  onTab,
  playUrl,
}: {
  call: RecordHistoryItem;
  tab: DetailTab;
  onTab: (tab: DetailTab) => void;
  playUrl: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const notes = call.notes;

  async function copySummary() {
    const text = [
      notes?.title || call.title,
      notes?.summary,
      notes?.eventDetails?.map((d) => `${d.label}: ${d.value}`).join('\n'),
      notes?.keyTakeaways?.map((k) => `• ${k}`).join('\n'),
    ]
      .filter(Boolean)
      .join('\n\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="pb-28">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{call.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-black/55">
          <span className="inline-flex items-center gap-2">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold text-white"
              style={{ background: avatarColor(call.title) }}
            >
              {avatarLetter(call.title)}
            </span>
            Love Films
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatCallWhen(call.startedAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {formatDuration(call.durationMs)}
          </span>
          <button
            onClick={() => void copySummary()}
            className="inline-flex items-center gap-1.5 text-black/70 hover:text-black"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? 'Copied' : 'Copy summary'}
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-6 border-b border-black/10">
        <TabLink active={tab === 'summary'} onClick={() => onTab('summary')}>
          Summary
        </TabLink>
        <TabLink active={tab === 'transcript'} onClick={() => onTab('transcript')}>
          Transcript
        </TabLink>
      </div>

      {tab === 'summary' ? (
        <NotesPane notes={notes} processing={false} />
      ) : (
        <TranscriptPane
          utterances={call.transcript}
          interim=""
          interimSpeaker="Speaker 1"
          live={false}
          processing={false}
        />
      )}

      <AudioPlayer key={playUrl || 'none'} src={playUrl} />
    </div>
  );
}

function TabLink({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px border-b-2 pb-3 text-[15px] font-medium ${
        active ? 'border-[#1876F2] text-[#1876F2]' : 'border-transparent text-black/45 hover:text-black/70'
      }`}
    >
      {children}
    </button>
  );
}

function AudioPlayer({ src }: { src: string | null }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  if (!src) {
    return (
      <div className="fixed bottom-0 left-0 right-0 border-t border-black/10 bg-white px-4 py-3 text-center text-sm text-black/40">
        Audio is still processing, or was not saved for this call.
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-black/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 md:px-8">
        <button
          type="button"
          onClick={() => {
            const el = audioRef.current;
            if (!el) return;
            if (el.paused) {
              void el.play();
              setPlaying(true);
            } else {
              el.pause();
              setPlaying(false);
            }
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1876F2] text-white"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="ml-0.5 h-5 w-5 fill-current" />}
        </button>
        <span className="w-12 tabular-nums text-xs text-black/45">{formatClock(current * 1000)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={current}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (audioRef.current) audioRef.current.currentTime = value;
            setCurrent(value);
          }}
          className="h-1.5 flex-1 accent-[#1876F2]"
        />
        <span className="w-12 text-right tabular-nums text-xs text-black/45">
          {formatClock((duration || 0) * 1000)}
        </span>
        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
          onEnded={() => setPlaying(false)}
        />
      </div>
    </div>
  );
}

function TranscriptPane({
  utterances,
  interim,
  interimSpeaker,
  live,
  processing,
}: {
  utterances: TranscriptUtterance[];
  interim: string;
  interimSpeaker: string;
  live: boolean;
  processing: boolean;
}) {
  const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (live) bottom.current?.scrollIntoView({ behavior: 'smooth' });
  }, [utterances.length, interim, live]);

  if (!utterances.length && !interim) {
    return (
      <div className="rounded-2xl border border-black/8 bg-white px-6 py-16 text-center text-black/45">
        {processing ? 'Labeling speakers and writing notes…' : live ? 'Waiting for speech…' : 'No transcript yet.'}
      </div>
    );
  }

  return (
    <div className="max-h-[70vh] space-y-5 overflow-y-auto rounded-2xl border border-black/8 bg-white p-5 md:p-8">
      {utterances.map((u) => (
        <article key={u.id} className="grid grid-cols-[72px_1fr] gap-4">
          <div className="pt-1 text-xs tabular-nums text-black/35">{formatClock(u.startMs)}</div>
          <div>
            <p className="text-xs font-semibold" style={{ color: speakerColor(u.speaker) }}>
              {u.speaker}
            </p>
            <p className="mt-1 text-[16px] leading-relaxed">{u.text}</p>
          </div>
        </article>
      ))}
      {interim ? (
        <article className="grid grid-cols-[72px_1fr] gap-4 opacity-55">
          <div className="pt-1 text-xs text-black/35">live</div>
          <div>
            <p className="text-xs font-semibold" style={{ color: speakerColor(interimSpeaker) }}>
              {interimSpeaker}
            </p>
            <p className="mt-1 text-[16px] leading-relaxed">{interim}</p>
          </div>
        </article>
      ) : null}
      <div ref={bottom} />
    </div>
  );
}

function NotesPane({ notes, processing }: { notes: OtterNotes | null; processing: boolean }) {
  if (processing && !notes) {
    return (
      <div className="rounded-2xl border border-black/8 bg-white px-6 py-16 text-center text-black/45">
        Writing notes from the transcript…
      </div>
    );
  }
  if (!notes) {
    return (
      <div className="rounded-2xl border border-black/8 bg-white px-6 py-16 text-center text-black/45">
        No summary for this recording.
      </div>
    );
  }
  return (
    <div className="space-y-8 rounded-2xl border border-black/8 bg-white p-6 md:p-8">
      <section>
        <h2 className="text-[15px] font-semibold">Overview</h2>
        <p className="mt-3 whitespace-pre-wrap text-[16px] leading-relaxed text-black/80">{notes.summary}</p>
      </section>
      {notes.eventDetails?.length ? (
        <section>
          <h3 className="text-[15px] font-semibold">Event Details</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-black/80">
            {notes.eventDetails.map((item) => (
              <li key={`${item.label}-${item.value}`}>
                <span className="font-medium">{item.label}:</span> {item.value}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {notes.keyTakeaways.length ? (
        <section>
          <h3 className="text-[15px] font-semibold">Key takeaways</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed">
            {notes.keyTakeaways.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {notes.actionItems.length ? (
        <section>
          <h3 className="text-[15px] font-semibold">Action items</h3>
          <ul className="mt-3 space-y-2">
            {notes.actionItems.map((item) => (
              <li key={item.text} className="flex gap-2 text-[15px]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-black/35" />
                <span>
                  {item.text}
                  {item.owner ? <span className="text-black/45"> — {item.owner}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
