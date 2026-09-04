import type { ActionItem, OtterNotes, OutlineSection, TranscriptUtterance } from '@/lib/record-types';

function formatClock(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function transcriptText(utterances: TranscriptUtterance[]) {
  return utterances
    .map((u) => `[${formatClock(u.startMs)}] ${u.speaker}: ${u.text}`)
    .join('\n');
}

const SYSTEM_PROMPT = `You are Otter.ai-style meeting notes for a wedding film / photography consultation call.
Return ONLY valid JSON with this shape:
{
  "title": "short descriptive title",
  "summary": "2-3 paragraph recap in a warm, clear voice. Cover who, what they want, logistics, and where things landed.",
  "keyTakeaways": ["3-7 concrete bullets"],
  "actionItems": [{"text": "task", "owner": "optional name or role"}],
  "outline": [{"heading": "section name", "startMs": 0, "bullets": ["point"]}]
}
Rules:
- Action items should be specific and follow-up ready.
- Outline should follow the conversation chronologically.
- If a field is unknown, omit the owner rather than inventing one.
- Never invent facts that are not in the transcript.`;

async function completeJson(user: string): Promise<string | null> {
  if (process.env.OPENAI_API_KEY) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: user },
        ],
      }),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  }

  if (process.env.GROQ_API_KEY) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: user },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Groq ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  }

  if (process.env.ANTHROPIC_API_KEY) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        temperature: 0.2,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: user }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}`);
    const data = await res.json();
    const text = data.content?.find((b: { type: string }) => b.type === 'text')?.text;
    return text ?? null;
  }

  return null;
}

function sentenceSplit(text: string) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
}

const ACTION_RE =
  /\b(will|need to|needs to|should|let'?s|follow up|send|book|confirm|email|call|schedule|invoice|contract|deposit)\b/i;

function extractiveNotes(title: string, utterances: TranscriptUtterance[]): OtterNotes {
  const full = utterances.map((u) => u.text).join(' ');
  const sentences = sentenceSplit(full);
  const summary =
    sentences.slice(0, 4).join(' ') ||
    (full.trim() ? full.trim() : 'The recording did not capture enough speech to summarize.');

  const keyTakeaways = sentences
    .filter((s) => s.length < 180)
    .slice(0, 6);

  const actionItems: ActionItem[] = sentences
    .filter((s) => ACTION_RE.test(s))
    .slice(0, 8)
    .map((text) => ({ text }));

  const outline: OutlineSection[] = [];
  const bucketMs = 120_000;
  const buckets = new Map<number, TranscriptUtterance[]>();
  for (const u of utterances) {
    const key = Math.floor(u.startMs / bucketMs);
    const list = buckets.get(key) ?? [];
    list.push(u);
    buckets.set(key, list);
  }
  for (const [key, list] of buckets) {
    outline.push({
      heading: `${formatClock(key * bucketMs)}–${formatClock(key * bucketMs + bucketMs)}`,
      startMs: key * bucketMs,
      bullets: list.slice(0, 4).map((u) => `${u.speaker}: ${u.text}`),
    });
  }

  return {
    title: title || 'Consultation call',
    summary,
    keyTakeaways: keyTakeaways.length ? keyTakeaways : sentences.slice(0, 3),
    actionItems,
    outline,
    source: 'extractive',
  };
}

function coerceNotes(raw: unknown, fallbackTitle: string, utterances: TranscriptUtterance[]): OtterNotes {
  const fallback = extractiveNotes(fallbackTitle, utterances);
  if (!raw || typeof raw !== 'object') return fallback;
  const obj = raw as Record<string, unknown>;

  const actionItems: ActionItem[] = Array.isArray(obj.actionItems)
    ? obj.actionItems
        .map((item) => {
          if (typeof item === 'string') return { text: item };
          if (item && typeof item === 'object' && 'text' in item) {
            const rec = item as { text?: unknown; owner?: unknown };
            return {
              text: String(rec.text ?? ''),
              owner: rec.owner ? String(rec.owner) : undefined,
            };
          }
          return null;
        })
        .filter((x): x is ActionItem => !!x && x.text.trim().length > 0)
    : fallback.actionItems;

  const outline: OutlineSection[] = Array.isArray(obj.outline)
    ? obj.outline
        .map((section) => {
          if (!section || typeof section !== 'object') return null;
          const rec = section as { heading?: unknown; startMs?: unknown; bullets?: unknown };
          return {
            heading: String(rec.heading ?? 'Section'),
            startMs: Number(rec.startMs) || 0,
            bullets: Array.isArray(rec.bullets) ? rec.bullets.map(String) : [],
          };
        })
        .filter((x): x is OutlineSection => !!x)
    : fallback.outline;

  return {
    title: String(obj.title || fallbackTitle || fallback.title),
    summary: String(obj.summary || fallback.summary),
    keyTakeaways: Array.isArray(obj.keyTakeaways)
      ? obj.keyTakeaways.map(String).filter(Boolean)
      : fallback.keyTakeaways,
    actionItems,
    outline,
    source: 'llm',
  };
}

export function llmProvider(): 'openai' | 'groq' | 'anthropic' | null {
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.GROQ_API_KEY) return 'groq';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  return null;
}

export async function generateOtterNotes(
  title: string,
  utterances: TranscriptUtterance[],
): Promise<OtterNotes> {
  if (utterances.length === 0) {
    return {
      title: title || 'Untitled recording',
      summary: 'No speech was captured in this recording.',
      keyTakeaways: [],
      actionItems: [],
      outline: [],
      source: 'extractive',
    };
  }

  const user = `Call title: ${title || 'Untitled'}\n\nTranscript:\n${transcriptText(utterances)}`;

  try {
    const raw = await completeJson(user);
    if (raw) {
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
      return coerceNotes(parsed, title, utterances);
    }
  } catch (error) {
    console.error('LLM summary failed, using extractive notes:', error);
  }

  return extractiveNotes(title, utterances);
}
