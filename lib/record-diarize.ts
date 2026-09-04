import type { TranscriptUtterance } from '@/lib/record-types';

type DiarizedSegment = {
  speaker?: string;
  text?: string;
  start?: number;
  end?: number;
};

function speakerLabel(raw: string, map: Map<string, number>) {
  const key = raw.trim() || 'A';
  if (!map.has(key)) map.set(key, map.size + 1);
  return `Speaker ${map.get(key)}`;
}

export async function diarizeRecordingAudio(
  data: Buffer,
  filename: string,
  contentType: string,
): Promise<TranscriptUtterance[] | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const form = new FormData();
  const bytes = new Uint8Array(data);
  form.append('file', new Blob([bytes], { type: contentType || 'audio/webm' }), filename);
  form.append('model', 'gpt-4o-transcribe-diarize');
  form.append('response_format', 'diarized_json');
  form.append('chunking_strategy', 'auto');

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('Diarization failed:', res.status, text);
    return null;
  }

  const json = (await res.json()) as { segments?: DiarizedSegment[]; text?: string };
  const segments = json.segments?.filter((s) => s.text?.trim()) ?? [];
  if (!segments.length) return null;

  const map = new Map<string, number>();
  return segments.map((segment, i) => ({
    id: `dia-${i}`,
    text: String(segment.text).trim(),
    speaker: speakerLabel(String(segment.speaker || `S${i}`), map),
    startMs: Math.round((segment.start ?? 0) * 1000),
    endMs: Math.round((segment.end ?? 0) * 1000),
    at: Date.now(),
  }));
}
