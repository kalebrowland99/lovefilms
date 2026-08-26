import type { CanvasBlock, CanvasEl, CanvasStyle } from '@/lib/showit-canvas';

const STORAGE_BASE =
  'https://firebasestorage.googleapis.com/v0/b/lovefilms-d618e.firebasestorage.app/o';

/** Firebase Storage object path → public download URL. */
export function filmUrl(objectPath: string) {
  return `${STORAGE_BASE}/${encodeURIComponent(objectPath)}?alt=media`;
}

export const DANIEL_AND_EMILY_FILM = filmUrl('Daniel & Emily.mp4');

export type Film = { url: string; couple: string; location: string };

/** Real film — the location is a placeholder until confirmed. */
export const DANIEL_AND_EMILY: Film = {
  url: DANIEL_AND_EMILY_FILM,
  couple: 'Daniel & Emily',
  location: 'Sonoma, California',
};

/**
 * Captions are placeholders — swap in the real couple and venue per film.
 *
 * post3.mp4 is omitted: it is a byte-identical copy of post2.mp4, so including
 * both played the same film twice side by side. Re-add it once the intended
 * film is uploaded.
 */
const FILM_SOURCES: (Omit<Film, 'url'> & { file: string })[] = [
  { file: 'post1.mp4', couple: 'Sophie & Miles', location: 'Big Sur, California' },
  { file: 'post2.mp4', couple: 'Hannah & Theo', location: 'Charleston, South Carolina' },
  { file: 'post4.mp4', couple: 'Camille & Jonas', location: 'Sedona, Arizona' },
  { file: 'post5.mp4', couple: 'Maya & Elliot', location: 'Telluride, Colorado' },
  { file: 'post6.mp4', couple: 'Naomi & Caleb', location: 'Savannah, Georgia' },
  { file: 'post7.mp4', couple: 'Isabel & Ruben', location: 'Santa Fe, New Mexico' },
  { file: 'post8.mp4', couple: 'Adaeze & Marcus', location: 'Chicago, Illinois' },
  { file: 'post9.mp4', couple: 'Rosalie & Ben', location: 'Kennebunkport, Maine' },
  { file: 'post10.mp4', couple: 'Leila & Sam', location: 'Marfa, Texas' },
  { file: 'post11.mp4', couple: 'Georgia & Owen', location: 'Asheville, North Carolina' },
  { file: 'post12.mp4', couple: 'Wren & Tobias', location: 'Olympic Peninsula, Washington' },
  { file: 'post13.mp4', couple: 'Simone & Andre', location: 'New Orleans, Louisiana' },
  { file: 'post14.mp4', couple: 'Talia & Jesse', location: 'Amalfi Coast, Italy' },
  { file: 'post15.mp4', couple: 'Freya & Lukas', location: 'Vík, Iceland' },
];

export const INSTAGRAM_FILMS: Film[] = FILM_SOURCES.map(({ file, ...caption }) => ({
  url: filmUrl(file),
  ...caption,
}));

const LOCATION_STYLE: { ds: CanvasStyle; ms: CanvasStyle } = {
  ds: { ff: 'engraved', fs: 13, lh: 1.6, ls: '0.1em', ta: 'left', tt: 'uppercase', c: 'rgba(7,7,7,1)', fst: 'normal', fw: 400 },
  ms: { ff: 'engraved', fs: 10, lh: 1.6, ls: '0.1em', ta: 'left', tt: 'uppercase', c: 'rgba(7,7,7,1)', fst: 'normal', fw: 400 },
};

const COUPLE_STYLE: { ds: CanvasStyle; ms: CanvasStyle } = {
  ds: { ff: 'display', fs: 24, lh: 1.1, ls: '0em', ta: 'left', tt: 'none', c: 'rgba(7,7,7,1)', fst: 'italic', fw: 400 },
  ms: { ff: 'display', fs: 22, lh: 1.1, ls: '0em', ta: 'left', tt: 'none', c: 'rgba(7,7,7,1)', fst: 'italic', fw: 400 },
};

// Card geometry lifted from the `featured-2` row so the grid lines up with the
// rest of the page: three across on desktop, stacked on mobile.
const COLS = [75, 447, 818];
const CARD = { w: 308, h: 409 };
const D_LOCATION_T = 449;
const D_COUPLE_T = 478;

const M_CARD = { l: 45, w: 230, h: 306 };
const M_PITCH = 420;
const M_TOP = 22;

/** Splits films into rows of three, each row rendered as one canvas block. */
export function filmGridBlocks(films: Film[], slugPrefix: string): CanvasBlock[] {
  const rows: Film[][] = [];
  for (let i = 0; i < films.length; i += COLS.length) {
    rows.push(films.slice(i, i + COLS.length));
  }

  return rows.map((row, r) => {
    const els: CanvasEl[] = [];

    row.forEach((film, c) => {
      const mTop = M_TOP + c * M_PITCH;
      const sid = `${slugPrefix}-${r}-${c}`;

      els.push({
        sid: `${sid}-v`,
        kind: 'video',
        d: { l: COLS[c], t: 0, w: CARD.w, h: CARD.h },
        m: { l: M_CARD.l, t: mTop, w: M_CARD.w, h: M_CARD.h },
        videos: [film.url],
        href: film.url,
        label: `${film.couple} — ${film.location}`,
      });

      els.push({
        sid: `${sid}-loc`,
        kind: 'text',
        d: { l: COLS[c], t: D_LOCATION_T, w: 320, h: 21 },
        m: { l: M_CARD.l, t: mTop + M_CARD.h + 14, w: 220, h: 19 },
        text: film.location,
        href: film.url,
        ...LOCATION_STYLE,
      });

      els.push({
        sid: `${sid}-couple`,
        kind: 'text',
        d: { l: COLS[c], t: D_COUPLE_T, w: 313, h: 52 },
        m: { l: M_CARD.l, t: mTop + M_CARD.h + 39, w: 230, h: 44 },
        text: film.couple,
        href: film.url,
        ...COUPLE_STYLE,
      });
    });

    return {
      slug: `${slugPrefix}-${r}`,
      dh: 609,
      mh: M_TOP + row.length * M_PITCH,
      bg: 'rgba(249,249,245,1)',
      els,
    };
  });
}
