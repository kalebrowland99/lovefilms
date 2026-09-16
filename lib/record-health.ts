import { MIN_AUDIO_BYTES, looksLikeAudioContainer } from '@/lib/record-audio-format';

export type CaptureAlert = {
  level: 'warn' | 'error';
  message: string;
};

export function recorderSupportError(): string | null {
  if (typeof window === 'undefined') return 'Recording only works in a browser tab.';
  if (!window.isSecureContext) {
    return 'Microphone recording needs HTTPS (or localhost). This page is not a secure context.';
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    return 'This browser cannot access the microphone.';
  }
  if (typeof MediaRecorder === 'undefined') {
    return 'This browser cannot record audio. Use current Chrome, Edge, or Safari.';
  }
  return null;
}

export function describeGetUserMediaError(err: unknown) {
  if (!(err instanceof Error)) return 'Could not start the microphone.';
  const name = 'name' in err ? String((err as DOMException).name) : '';
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return 'Microphone permission was denied. Allow the mic for this site and try again.';
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return 'No microphone was found. Plug one in (or reconnect Bluetooth) and try again.';
  }
  if (name === 'NotReadableError' || name === 'AbortError') {
    return 'The microphone is in use by another app, or the OS blocked it. Close Zoom/Meet/FaceTime and retry.';
  }
  if (name === 'OverconstrainedError') {
    return 'The requested microphone settings are not supported on this device.';
  }
  if (name === 'SecurityError') {
    return 'The browser blocked microphone access on this page.';
  }
  return err.message || 'Could not start the microphone.';
}

export function liveTrack(stream: MediaStream | null) {
  return stream?.getAudioTracks().find((track) => track.readyState === 'live') ?? null;
}

export function rmsLevel(analyser: AnalyserNode) {
  const data = new Uint8Array(analyser.fftSize);
  analyser.getByteTimeDomainData(data);
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const v = (data[i] - 128) / 128;
    sum += v * v;
  }
  return Math.sqrt(sum / data.length);
}

export async function assertPlayableAudioBlob(blob: Blob) {
  if (!blob || blob.size < MIN_AUDIO_BYTES) {
    throw new Error(
      'No audio was captured. The mic may have been muted, disconnected, or this tab was backgrounded.',
    );
  }
  const head = new Uint8Array(await blob.slice(0, 16).arrayBuffer());
  if (!looksLikeAudioContainer(head)) {
    throw new Error(
      'The captured file is not a playable audio container. Stay on this tab while recording, then stop again.',
    );
  }
}

export function playbackSupportMessage(src: string, contentHint?: string) {
  if (typeof document === 'undefined') return null;
  const probe = document.createElement('audio');
  const type = contentHint || (src.includes('.m4a') || src.includes('mp4') ? 'audio/mp4' : src.includes('blob:') ? '' : 'audio/webm');
  if (!type) return null;
  const can = probe.canPlayType(type);
  if (can) return null;
  if (type.includes('webm')) {
    return 'This recording is WebM/Opus. Safari on iPhone often cannot play it — open it in Chrome or tap Download.';
  }
  return `This browser may not play ${type}. Try Chrome, or download the file.`;
}
