/**
 * Local wedding stills from /public/photos (copied from the couple folders).
 * Couple 7 is the lead set — hero, approach, and the two large photography cards.
 */
const ph = (file: string) => `/photos/${file}.jpg`;

const c7 = (n: number) => ph(`c7-${String(n).padStart(2, '0')}`);
const c6 = (n: number) => ph(`c6-${String(n).padStart(2, '0')}`);
const c5 = (n: number) => ph(`c5-${String(n).padStart(2, '0')}`);
const c4 = (n: number) => ph(`c4-${String(n).padStart(2, '0')}`);
const c3 = (n: number) => ph(`c3-${String(n).padStart(2, '0')}`);
const c2 = (n: number) => ph(`c2-${String(n).padStart(2, '0')}`);
const c1 = (n: number) => ph(`c1-${String(n).padStart(2, '0')}`);

/** Portfolio hero — couple 7 leads, interleaved with other sets. */
export const PHOTO_HERO = [
  c7(1), c5(15), c4(7), c7(3), c2(4), c3(8),
  c6(1), c1(11), c7(4), c3(1),
];

/** Wide highlights band — landscapes plus mixed couples, no back-to-back duplicates. */
export const PHOTO_HIGHLIGHTS = [
  c1(1), c1(26), c7(1), c2(3), c4(5), c5(16),
  c6(4), c3(8), c1(24), c4(8), c2(2), c5(12), c7(4), c1(27),
];

export const PHOTO_GRID_LARGE = [c7(1), c7(3)];
export const PHOTO_GRID_SMALL = [c5(15), c4(7), c3(1)];

/** Review collages — three different couples per slide. */
export const PHOTO_REVIEW_A = [c7(1), c3(8), c6(1)];
export const PHOTO_REVIEW_B = [c4(1), c5(15), c2(4)];

/** Home approach collage — three different couples, not one session. */
export const PHOTO_APPROACH = [c7(4), c5(15), c1(11)];

export const PHOTO_OFFERINGS = [c1(11), c3(1), c5(1), c4(7), c6(5)];

export const PHOTO_EXPLORE = [c2(4), c4(1), c6(5)];

export const PHOTO_STORIES = [c5(2), c5(3), c5(5), c5(11), c5(14)];

export const PHOTO_HOME_MARQUEE_A = [
  c1(1), c1(26), c1(27), c1(24), c2(3), c4(5),
  c7(4), c5(16), c3(5), c1(3), c6(7),
];

export const PHOTO_HOME_MARQUEE_B = [
  c1(6), c1(12), c1(15), c1(17), c1(20), c1(25), c1(28), c1(30),
  c3(2), c3(6), c4(3), c4(6), c5(4), c5(7), c6(3), c7(1),
];

export const PHOTO_HOME_REVIEWS = [c3(4), c4(6), c5(10)];

export const PHOTO_ROMANCE_BG = [c1(26), c1(27), c2(3)];
export const PHOTO_ROMANCE_MOBILE = [c4(5)];
export const PHOTO_ROMANCE_PORTRAIT = [c7(1)];
