/**
 * One photography gallery per couple folder in /public/photos.
 * Card captions, the portfolio intro slider, and /gallery/[slug] all read from here.
 * Couple names are placeholders until the real names are confirmed.
 */
const ph = (couple: number, n: number) =>
  `/photos/c${couple}-${String(n).padStart(2, '0')}.jpg`;

const series = (couple: number, count: number) =>
  Array.from({ length: count }, (_, i) => ph(couple, i + 1));

export type CoupleGallery = {
  slug: string;
  kicker: string;
  title: string;
  blurb: string;
  cover: string;
  photos: string[];
};

export const GALLERIES: CoupleGallery[] = [
  {
    slug: 'claire-and-bennett',
    kicker: 'IN THE GARDEN',
    title: 'Claire & Bennett',
    blurb: 'Sun through the pines, a lace sleeve, and the last warm light of the day.',
    cover: ph(7, 1),
    photos: series(7, 8),
  },
  {
    slug: 'elise-and-nathan',
    kicker: 'ON THE PATH',
    title: 'Elise & Nathan',
    blurb: 'A walk through the trees, held in still frames that feel like film.',
    cover: ph(5, 15),
    photos: series(5, 16),
  },
  {
    slug: 'margot-and-julian',
    kicker: 'EDITORIAL',
    title: 'Margot & Julian',
    blurb: 'Fashion-forward posing, garden steps, and a little extra attitude.',
    cover: ph(4, 7),
    photos: series(4, 8),
  },
  {
    slug: 'lila-and-cole',
    kicker: 'IN THE PINES',
    title: 'Lila & Cole',
    blurb: 'Peeking around a pine, a blue bow tie, and the easy in-between.',
    cover: ph(3, 1),
    photos: series(3, 9),
  },
  {
    slug: 'annalise-and-david',
    kicker: 'BY THE WATER',
    title: 'Annalise & David',
    blurb: 'A wooden dock, a quiet kiss, and pines at the water’s edge.',
    cover: ph(6, 1),
    photos: series(6, 7),
  },
  {
    slug: 'brooke-and-henry',
    kicker: 'ON THE BRIDGE',
    title: 'Brooke & Henry',
    blurb: 'A footbridge over still water, and a long look at the dress.',
    cover: ph(2, 4),
    photos: series(2, 4),
  },
  {
    slug: 'sienna-and-callum',
    kicker: 'OPEN SKY',
    title: 'Sienna & Callum',
    blurb: 'Wide landscapes, a veil in the wind, and light that goes on forever.',
    cover: ph(1, 11),
    photos: series(1, 30),
  },
];

export function galleryPath(slug: string) {
  return `/gallery/${slug}`;
}

export function galleryBySlug(slug: string) {
  return GALLERIES.find((g) => g.slug === slug);
}

/** Couples featured as photography cards on /portfolio. */
export const FEATURED_LARGE = [GALLERIES[0], GALLERIES[0]] as const; // both frames are couple 7
export const FEATURED_SMALL = [GALLERIES[1], GALLERIES[2], GALLERIES[3]] as const;
