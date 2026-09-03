/**
 * Shared model for pages rebuilt from the Showit fixed-canvas layout.
 *
 * Showit positions every element absolutely on a canvas of a fixed width
 * (1200px desktop, 320px mobile) and scales that canvas to the viewport, so
 * authored coordinates are preserved exactly at any window size.
 */
export const CANVAS = { d: 1200, m: 320 } as const;

export type CanvasStyle = {
  ff: 'display' | 'engraved' | 'sans' | 'script';
  fs: number;
  lh: number;
  ls: string;
  ta: string;
  tt: string;
  c: string;
  fst: string;
  fw: number;
};

export type CanvasBox = {
  l: number;
  t: number;
  w: number;
  h: number;
  op?: number;
  hide?: boolean;
};

export type CanvasEl = {
  sid: string;
  kind: 'image' | 'text' | 'line' | 'icon' | 'box' | 'video';
  d: CanvasBox;
  m: CanvasBox;
  text?: string;
  imgs?: string[];
  /** Sources for a `video` element. `imgs[0]` doubles as the poster frame. */
  videos?: string[];
  ds?: CanvasStyle;
  ms?: CanvasStyle;
  stroke?: string;
  href?: string;
  /** Accessible name for links whose only content is imagery. */
  label?: string;
  /** Pill button rendered in place of an empty box element. */
  button?: { label: string; href: string; variant: 'solid' | 'outline' };
};

export type CanvasBlock = {
  slug: string;
  dh: number;
  mh: number;
  /** Omit for a transparent block that reveals whatever it scrolls over. */
  bg?: string | null;
  els: CanvasEl[];
  /** Element-id prefixes whose groups are alternate states of one slider. */
  states?: string[];
  /** Showit `aav` — cycle states automatically every N milliseconds. */
  autoAdvanceMs?: number;
  /** Showit `locking: { side: 'st' }` — pins to the top while later blocks scroll over. */
  sticky?: boolean;
  zIndex?: number;
};

/** Swap authored canvas strings by element id. Values must already be sanitized copy. */
export function withCanvasText(
  blocks: CanvasBlock[],
  updates: Record<string, string>,
): CanvasBlock[] {
  return blocks.map((block) => ({
    ...block,
    els: block.els.map((el) =>
      updates[el.sid] !== undefined ? { ...el, text: updates[el.sid] } : el,
    ),
  }));
}
