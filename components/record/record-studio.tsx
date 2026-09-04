'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Check, Download, Headphones, Mic, Pause, Radio, Square } from 'lucide-react';
import { getOrCreateClientId, pollRecord, postRecord } from '@/lib/record-client';
import { formatClock, iceConfig, pickRecorderMime, speakerColor } from '@/lib/record-media';
import type {
  LiveRecordSession,
  OtterNotes,
  PeerSignal,
  RecordCapabilities,
  RecordHistoryItem,
  TranscriptUtterance,
} from '@/lib/record-types';

type Role = 'idle' | 'host' | 'listener';
type Tab = 'transcript' | 'notes';

const POLL_MS = 450;

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
  const [capabilities, setCapabilities] = useState<RecordCapabilities | null>(null);
  const [history, setHistory] = useState<RecordHistoryItem[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [listenArmed, setListenArmed] = useState(false);
  const [tab, setTab] = useState<Tab>('transcript');
  const [elapsed, setElapsed] = useState(0);
  const [levels, setLevels] = useState<number[]>(() => Array(28).fill(4));
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [openHistoryId, setOpenHistoryId] = useState<string | null>(null);
  const [dismissedId, setDismissedId] = useState<string | null>(null);

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
  const audioEl = useRef<HTMLAudioElement | null>(null);
  const listeningRef = useRef(false);
  const hostActiveRef = useRef(false);
  const transcribePosted = useRef(0);

  useEffect(() => {
    passwordRef.current = password;
  }, [password]);

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
    // applyPoll is stable enough for the one-time session restore
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleSession = session && session.id !== dismissedId ? session : null;

  const role: Role = useMemo(() => {
    if (visibleSession?.status === 'recording' || visibleSession?.status === 'processing') {
      if (visibleSession.hostId === clientId) return 'host';
      return 'listener';
    }
    return 'idle';
  }, [visibleSession, clientId]);

  const applyPoll = useCallback((data: Awaited<ReturnType<typeof pollRecord>>, pollRole: Role) => {
    setCapabilities(data.capabilities);
    if (data.history?.length) setHistory(data.history);
    const live = data.session;
    if (!live) {
      setSession(null);
      if (pollRole !== 'host') {
        setUtterances([]);
        setInterim('');
      }
      return;
    }

    setSession(live);

    if (pollRole !== 'host' || live.status !== 'recording') {
      setUtterances(live.utterances);
      setInterim(live.interim || '');
      setInterimSpeaker(live.interimSpeaker || 'Speaker 1');
    }

    if (live.status === 'ended' && live.notes) setTab('notes');
  }, []);

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
    // Host peer wiring reads stream/PC refs; recreating the interval would drop ICE.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, password, applyPoll]);

  useEffect(() => {
    if (session?.status !== 'recording' || !session.startedAt) return;
    const id = window.setInterval(() => setElapsed(Date.now() - session.startedAt), 250);
    return () => window.clearInterval(id);
  }, [session?.status, session?.startedAt]);

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
          pushLocalUtterance(piece, 'Speaker 1', Math.max(0, startMs - 2500), startMs);
        } else {
          nextInterim += (nextInterim ? ' ' : '') + piece;
        }
      }
      if (nextInterim) {
        setInterim(nextInterim);
        setInterimSpeaker('Speaker 1');
        void postTranscript({ interim: nextInterim, interimSpeaker: 'Speaker 1' });
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
      if (audioEl.current) {
        audioEl.current.srcObject = media;
        void audioEl.current.play().then(() => setListening(true));
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
    if (audioEl.current) audioEl.current.srcObject = null;
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
    setDownloadUrl(null);
    setTab('transcript');
    chunksRef.current = [];
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
      setDismissedId(null);
      setUtterances([]);
      setInterim('');

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
      setError(err instanceof Error ? err.message : 'Could not start recording');
    } finally {
      setBusy(false);
    }
  }

  async function stopRecording() {
    setBusy(true);
    setError('');
    hostActiveRef.current = false;
    try {
      const mime = recRef.current?.mimeType || pickRecorderMime() || 'audio/webm';
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
      teardownCapture();
      if (chunksRef.current.length) {
        const blob = new Blob(chunksRef.current, { type: mime });
        setDownloadUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
      }
      const { session: next } = await postRecord<{ session: LiveRecordSession }>(passwordRef.current, {
        action: 'stop',
        hostId: clientIdRef.current,
      });
      setSession(next);
      if (next.notes) setTab('notes');
    } catch (err) {
      teardownCapture();
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

  const notes: OtterNotes | null = visibleSession?.notes ?? null;
  const live = visibleSession?.status === 'recording';
  const listenerCount = visibleSession?.listeners.length ?? 0;

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#f6f4ef] text-[#070707] flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-white border border-black/10 rounded-2xl p-8 shadow-sm">
          <p className="text-[11px] tracking-[0.2em] uppercase text-black/50">Your Love Films</p>
          <h1 className="mt-2 font-[family-name:var(--font-serif-alt)] italic text-4xl">Record</h1>
          <p className="mt-3 text-sm text-black/60">
            Team access for live call recording, transcription, and notes.
          </p>
          <label className="block mt-6 text-sm">
            Password
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="mt-2 w-full rounded-lg border border-black/15 px-4 py-3 outline-none focus:border-black"
              required
            />
          </label>
          {authError ? <p className="mt-2 text-sm text-[#7A1F2B]">{authError}</p> : null}
          <button type="submit" className="mt-6 w-full bg-[#070707] text-white py-3 rounded-lg font-medium">
            Enter studio
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-[#070707]">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-[#f6f4ef]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[11px] tracking-[0.2em] uppercase text-black/50 hover:text-black">
              YLF
            </Link>
            <span className="text-black/30">/</span>
            <span className="font-[family-name:var(--font-serif-alt)] italic text-xl">Record</span>
            {live ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#7A1F2B] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                Live
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-3 text-sm">
            {live ? <span className="tabular-nums text-black/70">{formatClock(elapsed)}</span> : null}
            {role === 'host' && live ? (
              <button
                onClick={stopRecording}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-full bg-[#7A1F2B] px-4 py-2 text-white"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                Stop
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <audio ref={audioEl} autoPlay playsInline className="hidden" />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        {error ? (
          <div className="mb-6 rounded-lg border border-[#7A1F2B]/20 bg-[#7A1F2B]/8 px-4 py-3 text-sm text-[#7A1F2B]">
            {error}
          </div>
        ) : null}

        {role === 'idle' && visibleSession?.status !== 'ended' ? (
          <IdleStart
            title={title}
            setTitle={setTitle}
            onStart={startRecording}
            busy={busy}
            capabilities={capabilities}
            history={history}
            openHistoryId={openHistoryId}
            setOpenHistoryId={setOpenHistoryId}
          />
        ) : null}

        {visibleSession && (live || visibleSession.status === 'processing' || visibleSession.status === 'ended') ? (
          <>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                  {role === 'listener' ? 'Listening in' : visibleSession.status === 'ended' ? 'Notes ready' : 'Recording'}
                </p>
                <h1 className="mt-1 font-[family-name:var(--font-serif-alt)] italic text-3xl md:text-4xl">
                  {visibleSession.title}
                </h1>
                <p className="mt-2 text-sm text-black/55">
                  {role === 'listener'
                    ? 'You are reading the live transcript. Tap listen to hear the room audio.'
                    : 'Phone on speaker, this tab open. Anyone else on /record sees this live.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {role === 'listener' && live ? (
                  listenArmed ? (
                    <button
                      onClick={stopListening}
                      className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-sm"
                    >
                      <Pause className="h-4 w-4" />
                      {listening ? 'Stop listening' : 'Connecting audio…'}
                    </button>
                  ) : (
                    <button
                      onClick={() => void startListening()}
                      className="inline-flex items-center gap-2 rounded-full bg-[#070707] px-4 py-2 text-sm text-white"
                    >
                      <Headphones className="h-4 w-4" />
                      Listen live
                    </button>
                  )
                ) : null}
                {downloadUrl ? (
                  <a
                    href={downloadUrl}
                    download={`${visibleSession.title.replace(/\s+/g, '-').toLowerCase()}.webm`}
                    className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-sm"
                  >
                    <Download className="h-4 w-4" />
                    Audio
                  </a>
                ) : null}
              </div>
            </div>

            {role === 'host' && live ? (
              <div className="mb-6 flex h-12 items-end gap-[3px] rounded-xl bg-[#070707] px-4 py-2">
                {levels.map((h, i) => (
                  <span
                    key={i}
                    className="w-full rounded-full bg-[#f6f4ef]"
                    style={{ height: `${h}px`, opacity: 0.35 + (h / 40) * 0.65 }}
                  />
                ))}
              </div>
            ) : null}

            {listening ? (
              <p className="mb-4 inline-flex items-center gap-2 text-sm text-[#1F4E5F]">
                <Radio className="h-4 w-4" />
                You are listening to the live recording
              </p>
            ) : null}

            <div className="mb-4 flex gap-2">
              <TabButton active={tab === 'transcript'} onClick={() => setTab('transcript')}>
                Transcript
              </TabButton>
              <TabButton active={tab === 'notes'} onClick={() => setTab('notes')}>
                Notes
              </TabButton>
              {listenerCount > 0 && live ? (
                <span className="ml-auto self-center text-xs text-black/45">
                  {listenerCount} on this page
                </span>
              ) : null}
            </div>

            {tab === 'transcript' ? (
              <TranscriptPane
                utterances={utterances}
                interim={interim}
                interimSpeaker={interimSpeaker}
                live={live}
                processing={visibleSession.status === 'processing'}
              />
            ) : (
              <NotesPane notes={notes} processing={visibleSession.status === 'processing'} />
            )}
          </>
        ) : null}

        {role === 'idle' && visibleSession?.status === 'ended' ? (
          <div className="mt-10">
            <button
              onClick={() => {
                setDismissedId(visibleSession.id);
                setUtterances([]);
                setTab('transcript');
              }}
              className="rounded-full bg-[#070707] px-5 py-2.5 text-sm text-white"
            >
              New recording
            </button>
          </div>
        ) : null}
      </main>
    </div>
  );
}

function TabButton({
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
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm ${
        active ? 'bg-[#070707] text-white' : 'border border-black/15 bg-white text-black/70'
      }`}
    >
      {children}
    </button>
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
    bottom.current?.scrollIntoView({ behavior: 'smooth' });
  }, [utterances.length, interim]);

  if (!utterances.length && !interim) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white px-6 py-16 text-center text-black/50">
        {processing ? 'Finishing notes…' : live ? 'Waiting for speech…' : 'No transcript yet.'}
      </div>
    );
  }

  return (
    <div className="max-h-[70vh] space-y-5 overflow-y-auto rounded-2xl border border-black/10 bg-white p-5 md:p-8">
      {utterances.map((u) => (
        <article key={u.id} className="grid grid-cols-[72px_1fr] gap-4">
          <div className="pt-1 text-xs tabular-nums text-black/40">{formatClock(u.startMs)}</div>
          <div>
            <p className="text-xs font-medium" style={{ color: speakerColor(u.speaker) }}>
              {u.speaker}
            </p>
            <p className="mt-1 text-[17px] leading-relaxed">{u.text}</p>
          </div>
        </article>
      ))}
      {interim ? (
        <article className="grid grid-cols-[72px_1fr] gap-4 opacity-60">
          <div className="pt-1 text-xs text-black/40">live</div>
          <div>
            <p className="text-xs font-medium" style={{ color: speakerColor(interimSpeaker) }}>
              {interimSpeaker}
            </p>
            <p className="mt-1 text-[17px] leading-relaxed">{interim}</p>
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
      <div className="rounded-2xl border border-black/10 bg-white px-6 py-16 text-center text-black/50">
        Writing Otter-style notes from the transcript…
      </div>
    );
  }
  if (!notes) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white px-6 py-16 text-center text-black/50">
        Notes appear when the recording stops.
      </div>
    );
  }
  return (
    <div className="space-y-6 rounded-2xl border border-black/10 bg-white p-6 md:p-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">Summary</p>
        <h2 className="mt-2 font-[family-name:var(--font-serif-alt)] italic text-3xl">{notes.title}</h2>
        <p className="mt-4 whitespace-pre-wrap text-[16px] leading-relaxed text-black/80">{notes.summary}</p>
      </div>
      {notes.keyTakeaways.length ? (
        <section>
          <h3 className="text-sm font-medium uppercase tracking-wide text-black/50">Key takeaways</h3>
          <ul className="mt-3 space-y-2">
            {notes.keyTakeaways.map((item) => (
              <li key={item} className="flex gap-2 text-[15px] leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#070707]" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {notes.actionItems.length ? (
        <section>
          <h3 className="text-sm font-medium uppercase tracking-wide text-black/50">Action items</h3>
          <ul className="mt-3 space-y-2">
            {notes.actionItems.map((item) => (
              <li key={item.text} className="flex gap-2 text-[15px]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-black/40" />
                <span>
                  {item.text}
                  {item.owner ? <span className="text-black/45"> — {item.owner}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {notes.outline.length ? (
        <section>
          <h3 className="text-sm font-medium uppercase tracking-wide text-black/45">Outline</h3>
          <div className="mt-3 space-y-4">
            {notes.outline.map((section) => (
              <div key={`${section.startMs}-${section.heading}`}>
                <p className="text-sm font-medium">
                  <span className="mr-2 tabular-nums text-black/40">{formatClock(section.startMs)}</span>
                  {section.heading}
                </p>
                <ul className="mt-1 space-y-1 pl-8 text-sm text-black/70">
                  {section.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <p className="text-xs text-black/35">
        {notes.source === 'llm' ? 'AI notes' : 'Notes from the transcript. OPENAI_API_KEY on Vercel enables richer summaries.'}
      </p>
    </div>
  );
}

function IdleStart({
  title,
  setTitle,
  onStart,
  busy,
  capabilities,
  history,
  openHistoryId,
  setOpenHistoryId,
}: {
  title: string;
  setTitle: (v: string) => void;
  onStart: () => void;
  busy: boolean;
  capabilities: RecordCapabilities | null;
  history: RecordHistoryItem[];
  openHistoryId: string | null;
  setOpenHistoryId: (id: string | null) => void;
}) {
  return (
    <div>
      <div className="mx-auto max-w-xl text-center">
        <h1 className="font-[family-name:var(--font-serif-alt)] italic text-5xl md:text-6xl">Record the call</h1>
        <p className="mx-auto mt-4 max-w-md text-black/60">
          Put the phone on speaker, then tap record. Live words appear here the way they do in Otter.
          Anyone else who opens this page can read along and optionally listen.
        </p>
        <ol className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-black/55">
          <li>1. Join the phone call and turn on speaker.</li>
          <li>2. Keep this tab in the foreground.</li>
          <li>3. Share yourlovefilms.com/record with whoever should follow along.</li>
        </ol>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sarah & James — consult"
          className="mt-8 w-full rounded-full border border-black/15 bg-white px-5 py-3 text-center outline-none focus:border-black"
        />
        <button
          onClick={onStart}
          disabled={busy}
          className="mt-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#7A1F2B] text-white shadow-lg transition hover:scale-[1.03] disabled:opacity-60"
          aria-label="Start recording"
        >
          <Mic className="h-8 w-8" />
        </button>
        <p className="mt-3 text-xs text-black/40">
          Uses your microphone (Chrome, Edge, or Safari)
          {capabilities?.llm ? ' · AI notes after you stop' : ' · Add OPENAI_API_KEY on Vercel for AI notes'}
        </p>
      </div>

      {history.length ? (
        <section className="mt-16">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-black/45">Past recordings</h2>
          <ul className="mt-4 divide-y divide-black/10 border-y border-black/10">
            {history.map((item) => (
              <li key={item.id}>
                <button
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  onClick={() => setOpenHistoryId(openHistoryId === item.id ? null : item.id)}
                >
                  <span>
                    <span className="block font-medium">{item.title}</span>
                    <span className="text-xs text-black/45">
                      {new Date(item.startedAt).toLocaleString()} · {formatClock(item.durationMs)}
                    </span>
                  </span>
                  <span className="text-xs text-black/40">{item.utteranceCount} lines</span>
                </button>
                {openHistoryId === item.id ? (
                  <div className="pb-6">
                    {item.notes ? <NotesPane notes={item.notes} processing={false} /> : null}
                    <div className="mt-4">
                      <TranscriptPane
                        utterances={item.transcript}
                        interim=""
                        interimSpeaker="Speaker 1"
                        live={false}
                        processing={false}
                      />
                    </div>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
