// Generated from the Showit canvas: exact geometry, 1200px desktop / 320px mobile.
import type { CanvasBlock, CanvasEl, CanvasStyle } from '@/lib/showit-canvas';
import { PHOTO_HERO, PHOTO_HIGHLIGHTS, PHOTO_GRID_LARGE, PHOTO_GRID_SMALL, PHOTO_GRID_NEW, PHOTO_REVIEW_A, PHOTO_REVIEW_B } from '@/lib/site-photos';
import { CALENDLY_BOOKING_URL } from '@/lib/calendly';
import { DANIEL_AND_EMILY, INSTAGRAM_FILMS, filmGridBlocks } from '@/lib/films';
import { FEATURED_LARGE, FEATURED_NEW, FEATURED_SMALL, GALLERIES, galleryPath } from '@/lib/galleries';

const DISPLAY_WHITE: CanvasStyle = {
  ff: 'display', fs: 80, lh: 1, ls: '0em', ta: 'center', tt: 'none',
  c: 'rgba(255,255,255,1)', fst: 'normal', fw: 400,
};
const DISPLAY_WHITE_M: CanvasStyle = { ...DISPLAY_WHITE, fs: 42 };
const BODY_WHITE: CanvasStyle = {
  ff: 'sans', fs: 17, lh: 1.6, ls: '0em', ta: 'center', tt: 'none',
  c: 'rgba(255,255,255,1)', fst: 'normal', fw: 300,
};
const BODY_WHITE_M: CanvasStyle = { ...BODY_WHITE, fs: 14 };

function photographyIntroBlock(): CanvasBlock {
  const states = GALLERIES.map((g) => `featured-3_${g.slug}_`);
  const els: CanvasEl[] = GALLERIES.flatMap((g) => {
    const p = `featured-3_${g.slug}_`;
    const href = galleryPath(g.slug);
    return [
      {
        sid: `${p}bg`,
        kind: 'image',
        d: { l: 0, t: 0, w: 1200, h: 651, op: 0.42 },
        m: { l: 0, t: 0, w: 320, h: 499, op: 0.42 },
        imgs: [g.cover],
      },
      {
        sid: `${p}0`,
        kind: 'text',
        d: { l: 185, t: 217, w: 830, h: 77 },
        m: { l: 19, t: 141, w: 283, h: 77 },
        href,
        text: `{{i}}${g.title}{{/i}}`,
        ds: DISPLAY_WHITE,
        ms: DISPLAY_WHITE_M,
      },
      {
        sid: `${p}1`,
        kind: 'text',
        d: { l: 362, t: 314, w: 476, h: 65 },
        m: { l: 28, t: 245, w: 264, h: 70 },
        text: g.blurb,
        ds: BODY_WHITE,
        ms: BODY_WHITE_M,
      },
      {
        sid: `${p}2`,
        kind: 'text',
        d: { l: 500, t: 398, w: 200, h: 40 },
        m: { l: 60, t: 332, w: 200, h: 36 },
        href,
        text: 'View Gallery',
        ds: BODY_WHITE,
        ms: BODY_WHITE_M,
      },
    ];
  });
  els.push(
    { sid: 'featured-3_1', kind: 'icon', d: { l: 1101, t: 304, w: 41, h: 40 }, m: { l: 266, t: 448, w: 36, h: 44 } },
    { sid: 'featured-3_2', kind: 'icon', d: { l: 58, t: 304, w: 41, h: 40 }, m: { l: 19, t: 448, w: 36, h: 44 } },
  );
  return {
    slug: 'featured-3',
    dh: 651,
    mh: 499,
    bg: 'rgba(7,7,7,1)',
    states,
    autoAdvanceMs: 5200,
    els,
  };
}

export const PORTFOLIO_BLOCKS: CanvasBlock[] = [
  { slug: "hero", dh: 1345, mh: 731, bg: "rgba(7,7,7,1)", els: [
    { sid: "hero_0", kind: "image", d: {l:359, t:245, w:483, h:637, op:1}, m: {l:69, t:120, w:182, h:236, op:1}, imgs: PHOTO_HERO },
    { sid: "hero_1", kind: "text", d: {l:168, t:179, w:865, h:269}, m: {l:22, t:94, w:277, h:47}, text: "PORTFOLIO", ds: {"ff": "display", "fs": 150.0, "lh": 0.9, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400}, ms: {"ff": "display", "fs": 52.0, "lh": 0.9, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400} },
    { sid: "hero_2", kind: "text", d: {l:162, t:554, w:126, h:20}, m: {l:109, t:92, w:125, h:21, hide:true}, text: "FILMS", href: "#films", ds: {"ff": "engraved", "fs": 13, "lh": 1.6, "ls": "0.1em", "ta": "center", "tt": "uppercase", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400}, ms: {"ff": "engraved", "fs": 11, "lh": 1.6, "ls": "0.1em", "ta": "center", "tt": "uppercase", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400} },
    { sid: "hero_3", kind: "line", d: {l:178, t:578, w:92, h:1}, m: {l:48, t:364, w:224, h:1, hide:true}, stroke: "rgba(255,255,255,1)" },
    { sid: "hero_4", kind: "text", d: {l:901, t:554, w:146, h:20}, m: {l:151, t:474, w:102, h:17, hide:true}, text: "PHOTOGRAPHY", href: "#featured-6", ds: {"ff": "engraved", "fs": 13, "lh": 1.6, "ls": "0.1em", "ta": "center", "tt": "uppercase", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400}, ms: {"ff": "engraved", "fs": 11, "lh": 1.6, "ls": "0.1em", "ta": "center", "tt": "uppercase", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400} },
    { sid: "hero_5", kind: "line", d: {l:929, t:579, w:89, h:1}, m: {l:48, t:364, w:224, h:1, hide:true}, stroke: "rgba(255,255,255,1)" },
    { sid: "hero_6", kind: "text", d: {l:135, t:973, w:923, h:179, hide:true}, m: {l:16, t:399, w:289, h:178}, text: "WE MAKE TIMELESS FILMS {{i}}and{{/i}} PHOTOS {{i}}for{{/i}} BRIDES {{i}}and{{/i}} GROOMS {{i}}with{{/i}} CLASSIC STYLE.", ds: {"ff": "display", "fs": 62.0, "lh": 0.95, "ls": "0.01em", "ta": "center", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400}, ms: {"ff": "display", "fs": 32.0, "lh": 1.1, "ls": "0.01em", "ta": "center", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400} },
    { sid: "hero_7", kind: "text", d: {l:139, t:953, w:923, h:179}, m: {l:26, t:417, w:289, h:213, hide:true}, text: "ROMANTIC WEDDING FILMS {{i}}and{{/i}} PHOTOGRAPHY", ds: {"ff": "display", "fs": 62.0, "lh": 0.95, "ls": "0.01em", "ta": "center", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400}, ms: {"ff": "display", "fs": 32.0, "lh": 1.1, "ls": "0.01em", "ta": "center", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400} },
    { sid: "hero_8", kind: "text", d: {l:394, t:1169, w:414, h:96}, m: {l:51, t:596, w:217, h:87}, text: "Every film and photograph here exudes modern romance and tells a beautiful story, capturing life’s most special moments with warmth and meaning.", ds: {"ff": "sans", "fs": 17, "lh": 1.6, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 300}, ms: {"ff": "sans", "fs": 14, "lh": 1.6, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 300} },
  ]},
  { slug: "highlights", dh: 750, mh: 463, bg: "rgba(7,7,7,1)", els: [
    { sid: "highlights_0", kind: "image", d: {l:0, t:114, w:1200, h:436, op:1}, m: {l:-183, t:51, w:686, h:206, op:1}, imgs: PHOTO_HIGHLIGHTS },
    { sid: "highlights_1", kind: "text", d: {l:81, t:589, w:371, h:17}, m: {l:32, t:305, w:98, h:19}, href: "https://www.instagram.com/yourlovefilms", text: "HIGHLIGHTS", ds: {"ff": "engraved", "fs": 13, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400}, ms: {"ff": "engraved", "fs": 11, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400} },
    { sid: "highlights_4", kind: "text", d: {l:81, t:635, w:476, h:65}, m: {l:32, t:346, w:259, h:66}, text: "Step into a gallery of timeless wedding stories—where candid moments, dreamy portraits, and elegant details come together. Here you’ll get a glimpse of real couples, heartfelt celebrations, and the artistry behind every love story we capture.", ds: {"ff": "sans", "fs": 12.0, "lh": 1.6, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 300}, ms: {"ff": "sans", "fs": 10.0, "lh": 1.6, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 300} },
  ]},
  { slug: "films", dh: 177, mh: 76, bg: "rgba(249,249,245,1)", els: [
    { sid: "weddings_0", kind: "text", d: {l:415, t:81, w:371, h:17}, m: {l:71, t:46, w:178, h:38}, text: "FILMS", ds: {"ff": "engraved", "fs": 13, "lh": 1.6, "ls": "0.1em", "ta": "center", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400}, ms: {"ff": "engraved", "fs": 11, "lh": 1.6, "ls": "0.1em", "ta": "center", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400} },
  ]},
  { slug: "featured-1", dh: 856, mh: 939, bg: "rgba(249,249,245,1)", els: [
    { sid: "featured-1_0", kind: "video", d: {l:75, t:0, w:500, h:654}, m: {l:39, t:33, w:240, h:320}, href: DANIEL_AND_EMILY.url, label: `${DANIEL_AND_EMILY.couple} — ${DANIEL_AND_EMILY.location}`, videos: [DANIEL_AND_EMILY.url] },
    { sid: "featured-1_1", kind: "text", d: {l:75, t:690, w:320, h:21}, m: {l:39, t:377, w:163, h:19}, href: DANIEL_AND_EMILY.url, text: DANIEL_AND_EMILY.location, ds: {"ff": "engraved", "fs": 13, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400}, ms: {"ff": "engraved", "fs": 10.0, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400} },
    { sid: "featured-1_2", kind: "text", d: {l:75, t:725, w:401, h:52}, m: {l:39, t:405, w:236, h:48}, href: DANIEL_AND_EMILY.url, text: DANIEL_AND_EMILY.couple, ds: {"ff": "display", "fs": 28.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400}, ms: {"ff": "display", "fs": 22.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400} },
    { sid: "featured-1_3", kind: "video", d: {l:626, t:0, w:500, h:654}, m: {l:38, t:486, w:240, h:320}, href: INSTAGRAM_FILMS[0].url, label: `${INSTAGRAM_FILMS[0].couple} — ${INSTAGRAM_FILMS[0].location}`, videos: [INSTAGRAM_FILMS[0].url] },
    { sid: "featured-1_4", kind: "text", d: {l:626, t:690, w:320, h:21}, m: {l:38, t:826, w:163, h:19}, href: INSTAGRAM_FILMS[0].url, text: INSTAGRAM_FILMS[0].location, ds: {"ff": "engraved", "fs": 13.0, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400}, ms: {"ff": "engraved", "fs": 10.0, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400} },
    { sid: "featured-1_5", kind: "text", d: {l:626, t:729, w:476, h:52}, m: {l:38, t:855, w:208, h:49}, href: INSTAGRAM_FILMS[0].url, text: INSTAGRAM_FILMS[0].couple, ds: {"ff": "display", "fs": 28.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400}, ms: {"ff": "display", "fs": 22.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400} },
  ]},
  ...(() => {
    const rows = filmGridBlocks(INSTAGRAM_FILMS.slice(1), "films");
    const preview = rows.slice(0, 1);
    const rest = rows.slice(1).map((block) => ({ ...block, reveal: "more-films" }));
    const viewMore: CanvasBlock = {
      slug: "films-more",
      dh: 140,
      mh: 110,
      bg: "rgba(249,249,245,1)",
      hideWhen: "more-films",
      els: [
        {
          sid: "films-more_0",
          kind: "text",
          d: { l: 450, t: 36, w: 300, h: 28 },
          m: { l: 35, t: 28, w: 250, h: 24 },
          text: "View More Films",
          reveal: "more-films",
          ds: { ff: "sans", fs: 17, lh: 1.6, ls: "0em", ta: "center", tt: "none", c: "rgba(7,7,7,0.8)", fst: "normal", fw: 400 },
          ms: { ff: "sans", fs: 14, lh: 1.6, ls: "0em", ta: "center", tt: "none", c: "rgba(7,7,7,0.8)", fst: "normal", fw: 400 },
        },
        { sid: "films-more_1", kind: "line", d: { l: 528, t: 72, w: 144, h: 1 }, m: { l: 100, t: 58, w: 120, h: 1 }, stroke: "rgba(7,7,7,0.25)" },
      ],
    };
    return [...preview, viewMore, ...rest];
  })(),
  { slug: "review", dh: 342, mh: 358, bg: "rgba(249,249,245,1)", els: [
    { sid: "review_0", kind: "text", d: {l:178, t:48, w:845, h:155}, m: {l:37, t:43, w:246, h:199}, text: "“Your Love Films is INCREDIBLE! We loved working with them in every way for our engagement films and wedding. They always give great direction and posing for film, but also capture the unstaged moments that reflect the emotions of the day.”", ds: {"ff": "display", "fs": 30.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400}, ms: {"ff": "display", "fs": 20.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400} },
    { sid: "review_1", kind: "text", d: {l:449, t:217, w:302, h:46}, m: {l:80, t:264, w:161, h:17}, text: "— TIFFANY + ANDREW", ds: {"ff": "engraved", "fs": 13.0, "lh": 1.6, "ls": "0.1em", "ta": "center", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400}, ms: {"ff": "engraved", "fs": 11.0, "lh": 1.6, "ls": "0.1em", "ta": "center", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400} },
  ]},
  photographyIntroBlock(),
  { slug: "featured-6", dh: 860, mh: 939, bg: "rgba(249,249,245,1)", els: [
    { sid: "featured-6_0", kind: "image", d: {l:75, t:0, w:500, h:654}, m: {l:39, t:33, w:240, h:320}, href: galleryPath(FEATURED_NEW[0].slug), label: FEATURED_NEW[0].title, imgs: [PHOTO_GRID_NEW[0]] },
    { sid: "featured-6_1", kind: "text", d: {l:75, t:690, w:320, h:21}, m: {l:39, t:377, w:163, h:19}, href: galleryPath(FEATURED_NEW[0].slug), text: FEATURED_NEW[0].kicker, ds: {"ff": "engraved", "fs": 13, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400}, ms: {"ff": "engraved", "fs": 10.0, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400} },
    { sid: "featured-6_2", kind: "text", d: {l:75, t:725, w:401, h:52}, m: {l:39, t:405, w:236, h:48}, href: galleryPath(FEATURED_NEW[0].slug), text: FEATURED_NEW[0].title, ds: {"ff": "display", "fs": 28.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400}, ms: {"ff": "display", "fs": 22.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400} },
    { sid: "featured-6_3", kind: "image", d: {l:626, t:0, w:500, h:654}, m: {l:38, t:486, w:240, h:320}, href: galleryPath(FEATURED_NEW[1].slug), label: FEATURED_NEW[1].title, imgs: [PHOTO_GRID_NEW[1]] },
    { sid: "featured-6_4", kind: "text", d: {l:626, t:690, w:320, h:21}, m: {l:38, t:826, w:163, h:19}, href: galleryPath(FEATURED_NEW[1].slug), text: FEATURED_NEW[1].kicker, ds: {"ff": "engraved", "fs": 13.0, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400}, ms: {"ff": "engraved", "fs": 10.0, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400} },
    { sid: "featured-6_5", kind: "text", d: {l:626, t:729, w:476, h:52}, m: {l:38, t:855, w:208, h:49}, href: galleryPath(FEATURED_NEW[1].slug), text: FEATURED_NEW[1].title, ds: {"ff": "display", "fs": 28.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400}, ms: {"ff": "display", "fs": 22.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400} },
  ]},
  { slug: "featured-4", dh: 860, mh: 939, bg: "rgba(249,249,245,1)", els: [
    { sid: "featured-4_0", kind: "image", d: {l:75, t:0, w:500, h:654}, m: {l:39, t:33, w:240, h:320}, href: galleryPath(FEATURED_LARGE[0].slug), label: FEATURED_LARGE[0].title, imgs: [PHOTO_GRID_LARGE[0]] },
    { sid: "featured-4_1", kind: "text", d: {l:75, t:690, w:320, h:21}, m: {l:39, t:377, w:163, h:19}, href: galleryPath(FEATURED_LARGE[0].slug), text: FEATURED_LARGE[0].kicker, ds: {"ff": "engraved", "fs": 13, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400}, ms: {"ff": "engraved", "fs": 10.0, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400} },
    { sid: "featured-4_2", kind: "text", d: {l:75, t:725, w:401, h:52}, m: {l:39, t:405, w:236, h:48}, href: galleryPath(FEATURED_LARGE[0].slug), text: FEATURED_LARGE[0].title, ds: {"ff": "display", "fs": 28.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400}, ms: {"ff": "display", "fs": 22.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400} },
    { sid: "featured-4_3", kind: "image", d: {l:626, t:0, w:500, h:654}, m: {l:38, t:486, w:240, h:320}, href: galleryPath(FEATURED_LARGE[1].slug), label: FEATURED_LARGE[1].title, imgs: [PHOTO_GRID_LARGE[1]] },
    { sid: "featured-4_4", kind: "text", d: {l:626, t:690, w:320, h:21}, m: {l:38, t:826, w:163, h:19}, href: galleryPath(FEATURED_LARGE[1].slug), text: "AMONG THE PINES", ds: {"ff": "engraved", "fs": 13.0, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400}, ms: {"ff": "engraved", "fs": 10.0, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400} },
    { sid: "featured-4_5", kind: "text", d: {l:626, t:729, w:476, h:52}, m: {l:38, t:855, w:208, h:49}, href: galleryPath(FEATURED_LARGE[1].slug), text: FEATURED_LARGE[1].title, ds: {"ff": "display", "fs": 28.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400}, ms: {"ff": "display", "fs": 22.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400} },
  ]},
  { slug: "featured-5", dh: 597, mh: 1065, bg: "rgba(249,249,245,1)", els: [
    { sid: "featured-5_0", kind: "image", d: {l:75, t:0, w:308, h:409}, m: {l:43, t:22, w:230, h:230}, href: galleryPath(FEATURED_SMALL[0].slug), label: FEATURED_SMALL[0].title, imgs: [PHOTO_GRID_SMALL[0]] },
    { sid: "featured-5_1", kind: "text", d: {l:75, t:449, w:320, h:21}, m: {l:43, t:272, w:163, h:19}, href: galleryPath(FEATURED_SMALL[0].slug), text: FEATURED_SMALL[0].kicker, ds: {"ff": "engraved", "fs": 13, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400}, ms: {"ff": "engraved", "fs": 10.0, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400} },
    { sid: "featured-5_2", kind: "text", d: {l:75, t:478, w:313, h:52}, m: {l:43, t:300, w:208, h:22}, href: galleryPath(FEATURED_SMALL[0].slug), text: FEATURED_SMALL[0].title, ds: {"ff": "display", "fs": 24.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400}, ms: {"ff": "display", "fs": 22.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400} },
    { sid: "featured-5_3", kind: "image", d: {l:447, t:0, w:308, h:409}, m: {l:43, t:364, w:230, h:230}, href: galleryPath(FEATURED_SMALL[1].slug), label: FEATURED_SMALL[1].title, imgs: [PHOTO_GRID_SMALL[1]] },
    { sid: "featured-5_4", kind: "text", d: {l:447, t:449, w:320, h:21}, m: {l:43, t:614, w:163, h:19}, href: galleryPath(FEATURED_SMALL[1].slug), text: FEATURED_SMALL[1].kicker, ds: {"ff": "engraved", "fs": 13.0, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400}, ms: {"ff": "engraved", "fs": 10.0, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400} },
    { sid: "featured-5_5", kind: "text", d: {l:447, t:478, w:313, h:52}, m: {l:43, t:642, w:208, h:22}, href: galleryPath(FEATURED_SMALL[1].slug), text: FEATURED_SMALL[1].title, ds: {"ff": "display", "fs": 24.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400}, ms: {"ff": "display", "fs": 22.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400} },
    { sid: "featured-5_6", kind: "image", d: {l:818, t:0, w:308, h:409}, m: {l:43, t:706, w:230, h:230}, href: galleryPath(FEATURED_SMALL[2].slug), label: FEATURED_SMALL[2].title, imgs: [PHOTO_GRID_SMALL[2]] },
    { sid: "featured-5_7", kind: "text", d: {l:818, t:449, w:320, h:21}, m: {l:43, t:956, w:163, h:19}, href: galleryPath(FEATURED_SMALL[2].slug), text: FEATURED_SMALL[2].kicker, ds: {"ff": "engraved", "fs": 13.0, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400}, ms: {"ff": "engraved", "fs": 10.0, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400} },
    { sid: "featured-5_8", kind: "text", d: {l:818, t:478, w:313, h:52}, m: {l:43, t:983, w:230, h:20}, href: galleryPath(FEATURED_SMALL[2].slug), text: FEATURED_SMALL[2].title, ds: {"ff": "display", "fs": 24.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400}, ms: {"ff": "display", "fs": 22.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400} },
  ]},
  { slug: "reviews-on-green", dh: 634, mh: 618, bg: "rgba(34,34,34,1)", states: ["reviews-on-green_review-1_", "reviews-on-green_review-2_"], els: [
    { sid: "reviews-on-green_review-1_0", kind: "image", d: {l:898, t:0, w:306, h:447}, m: {l:226, t:0, w:96, h:124}, imgs: [PHOTO_REVIEW_A[0]] },
    { sid: "reviews-on-green_review-1_1", kind: "image", d: {l:791, t:321, w:198, h:252, op:0.8}, m: {l:175, t:22, w:59, h:81, op:0.8}, imgs: [PHOTO_REVIEW_A[1]] },
    { sid: "reviews-on-green_review-1_2", kind: "text", d: {l:171, t:146, w:615, h:67}, m: {l:46, t:141, w:228, h:62}, text: "I see a lot of wedding films —", ds: {"ff": "display", "fs": 48.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "italic", "fw": 400}, ms: {"ff": "display", "fs": 28.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "italic", "fw": 400} },
    { sid: "reviews-on-green_review-1_3", kind: "text", d: {l:171, t:203, w:612, h:131}, m: {l:46, t:215, w:274, h:117}, text: "YOUR LOVE FILMS IS IN A CLASS ALL THEIR OWN.", ds: {"ff": "display", "fs": 48.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400}, ms: {"ff": "display", "fs": 32.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400} },
    { sid: "reviews-on-green_review-1_4", kind: "text", d: {l:171, t:334, w:507, h:95}, m: {l:46, t:332, w:217, h:133}, text: "Your Love Films truly went above and beyond! From the start, the team completely understood my vision for the shoot and made it a reality. Not only is the team incredibly talented, but the team’s also a sweetheart, making the experience enjoyable and stress-free.", ds: {"ff": "sans", "fs": 16.0, "lh": 1.6, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 300}, ms: {"ff": "sans", "fs": 12.0, "lh": 1.6, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 300} },
    { sid: "reviews-on-green_review-1_5", kind: "text", d: {l:171, t:452, w:371, h:25}, m: {l:46, t:485, w:228, h:20}, text: "— SELENE & lex", ds: {"ff": "engraved", "fs": 13.0, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400}, ms: {"ff": "engraved", "fs": 11.0, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400} },
    { sid: "reviews-on-green_review-1_6", kind: "icon", d: {l:1049, t:495, w:41, h:40}, m: {l:198, t:550, w:36, h:44} },
    { sid: "reviews-on-green_review-1_7", kind: "icon", d: {l:1113, t:495, w:41, h:40}, m: {l:249, t:550, w:36, h:44} },
    { sid: "reviews-on-green_review-1_8", kind: "image", d: {l:-129, t:82, w:205, h:262, op:0.8}, m: {l:-9, t:537, w:84, h:81, op:0.8}, imgs: [PHOTO_REVIEW_A[2]] },
    { sid: "reviews-on-green_review-2_0", kind: "image", d: {l:898, t:0, w:306, h:447}, m: {l:226, t:0, w:96, h:124}, imgs: [PHOTO_REVIEW_B[0]] },
    { sid: "reviews-on-green_review-2_1", kind: "image", d: {l:791, t:321, w:198, h:252, op:0.8}, m: {l:175, t:22, w:59, h:81, op:0.8}, imgs: [PHOTO_REVIEW_B[1]] },
    { sid: "reviews-on-green_review-2_2", kind: "text", d: {l:171, t:148, w:620, h:131}, m: {l:46, t:143, w:217, h:140}, text: "IF YOU WANT COOL, CHIC FILMS WITH A VIBE,", ds: {"ff": "display", "fs": 48.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400}, ms: {"ff": "display", "fs": 32.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400} },
    { sid: "reviews-on-green_review-2_3", kind: "text", d: {l:171, t:254, w:615, h:67}, m: {l:46, t:291, w:252, h:27}, text: "Your Love Films is the very best.", ds: {"ff": "display", "fs": 48.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "italic", "fw": 400}, ms: {"ff": "display", "fs": 26.0, "lh": 1.1, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "italic", "fw": 400} },
    { sid: "reviews-on-green_review-2_4", kind: "text", d: {l:171, t:334, w:507, h:82}, m: {l:46, t:329, w:217, h:133}, text: "They understood the vibe immediately and delivered something we still show people two years later. Cool, cinematic, and completely us.", ds: {"ff": "sans", "fs": 17.0, "lh": 1.6, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 300}, ms: {"ff": "sans", "fs": 14.0, "lh": 1.6, "ls": "0em", "ta": "left", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 300} },
    { sid: "reviews-on-green_review-2_5", kind: "text", d: {l:171, t:452, w:371, h:25}, m: {l:46, t:483, w:228, h:20}, text: "— JUSTINE, 2022 BRIDE", ds: {"ff": "engraved", "fs": 13.0, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400}, ms: {"ff": "engraved", "fs": 11.0, "lh": 1.6, "ls": "0.1em", "ta": "left", "tt": "uppercase", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400} },
    { sid: "reviews-on-green_review-2_6", kind: "icon", d: {l:1113, t:495, w:41, h:40}, m: {l:249, t:550, w:36, h:44} },
    { sid: "reviews-on-green_review-2_7", kind: "icon", d: {l:1049, t:495, w:41, h:40}, m: {l:198, t:550, w:36, h:44} },
    { sid: "reviews-on-green_review-2_8", kind: "image", d: {l:-129, t:82, w:205, h:262, op:0.8}, m: {l:-9, t:537, w:84, h:81, op:0.8}, imgs: [PHOTO_REVIEW_B[2]] },
  ]},
  { slug: "where-we-shoot", dh: 1446, mh: 673, bg: "rgba(249,249,245,0.5)", els: [
    { sid: "where-we-shoot_0", kind: "text", d: {l:352, t:114, w:497, h:29}, m: {l:55, t:41, w:210, h:19}, text: "WHERE LOVE CAN TAKE US", ds: {"ff": "engraved", "fs": 15.0, "lh": 1.6, "ls": "0.1em", "ta": "center", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400}, ms: {"ff": "engraved", "fs": 12.0, "lh": 1.6, "ls": "0.1em", "ta": "center", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400} },
    { sid: "where-we-shoot_2", kind: "text", d: {l:151, t:383, w:898, h:106}, m: {l:0, t:182, w:320, h:38}, text: "Oregon", ds: {"ff": "display", "fs": 100.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400}, ms: {"ff": "display", "fs": 37.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400} },
    { sid: "where-we-shoot_4", kind: "text", d: {l:154, t:277, w:893, h:106}, m: {l:0, t:142, w:320, h:38}, text: "California", ds: {"ff": "display", "fs": 100.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400}, ms: {"ff": "display", "fs": 37.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400} },
    { sid: "where-we-shoot_6", kind: "text", d: {l:189, t:171, w:823, h:106}, m: {l:0, t:102, w:320, h:38}, text: "New York", ds: {"ff": "display", "fs": 100.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400}, ms: {"ff": "display", "fs": 37.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400} },
    { sid: "where-we-shoot_8", kind: "text", d: {l:189, t:489, w:823, h:106}, m: {l:0, t:221, w:320, h:38}, text: "Colorado", ds: {"ff": "display", "fs": 100.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400}, ms: {"ff": "display", "fs": 37.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400} },
    { sid: "where-we-shoot_10", kind: "text", d: {l:189, t:595, w:823, h:106}, m: {l:0, t:260, w:320, h:38}, text: "Alaska", ds: {"ff": "display", "fs": 100.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400}, ms: {"ff": "display", "fs": 37.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400} },
    { sid: "where-we-shoot_12", kind: "text", d: {l:189, t:701, w:823, h:106}, m: {l:0, t:298, w:320, h:38}, text: "Hawaii", ds: {"ff": "display", "fs": 100.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400}, ms: {"ff": "display", "fs": 33.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400} },
    { sid: "where-we-shoot_13", kind: "text", d: {l:291, t:1265, w:619, h:80}, m: {l:42, t:501, w:237, h:96}, text: "Wherever your love takes you, every moment will be beautifully documented from start to finish — from sunup to sunset.", ds: {"ff": "sans", "fs": 17, "lh": 1.6, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(7,7,7,0.8)", "fst": "normal", "fw": 300}, ms: {"ff": "sans", "fs": 14, "lh": 1.6, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(7,7,7,0.8)", "fst": "normal", "fw": 300} },
    { sid: "where-we-shoot_14", kind: "text", d: {l:537, t:1343, w:126, h:21}, m: {l:79, t:610, w:163, h:19}, href: CALENDLY_BOOKING_URL, text: "Let's Go!", ds: {"ff": "sans", "fs": 17, "lh": 1.6, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(7,7,7,0.8)", "fst": "normal", "fw": 400}, ms: {"ff": "sans", "fs": 14, "lh": 1.6, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(7,7,7,0.8)", "fst": "normal", "fw": 400} },
    { sid: "where-we-shoot_15", kind: "line", d: {l:553, t:1371, w:94, h:1}, m: {l:126, t:633, w:69, h:1}, stroke: "rgba(7,7,7,0.25)" },
    { sid: "where-we-shoot_16", kind: "text", d: {l:189, t:805, w:823, h:106}, m: {l:0, t:333, w:320, h:38}, text: "ICELAND", ds: {"ff": "display", "fs": 100.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400}, ms: {"ff": "display", "fs": 37.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400} },
    { sid: "where-we-shoot_17", kind: "text", d: {l:189, t:901, w:823, h:106}, m: {l:0, t:368, w:320, h:38}, text: "Greece", ds: {"ff": "display", "fs": 100.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400}, ms: {"ff": "display", "fs": 33.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400} },
    { sid: "where-we-shoot_18", kind: "text", d: {l:189, t:1015, w:823, h:106}, m: {l:0, t:402, w:320, h:38}, text: "Italy", ds: {"ff": "display", "fs": 100.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400}, ms: {"ff": "display", "fs": 37.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "uppercase", "c": "rgba(7,7,7,1)", "fst": "normal", "fw": 400} },
    { sid: "where-we-shoot_19", kind: "text", d: {l:189, t:1111, w:823, h:106}, m: {l:0, t:439, w:320, h:38}, text: "North Carolina", ds: {"ff": "display", "fs": 100.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400}, ms: {"ff": "display", "fs": 33.0, "lh": 1.1, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(7,7,7,1)", "fst": "italic", "fw": 400} },
  ]},
  { slug: "portfolio-cta", dh: 747, mh: 424, bg: "rgba(7,7,7,1)", els: [
    { sid: "portfolio-cta_0", kind: "text", d: {l:200, t:241, w:800, h:80, op:1}, m: {l:21, t:117, w:278, h:58, op:1}, text: "Are You Ready?", ds: {"ff": "display", "fs": 81.0, "lh": 0.9, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400}, ms: {"ff": "display", "fs": 34.0, "lh": 0.91, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400} },
    { sid: "portfolio-cta_1", kind: "text", d: {l:424, t:354, w:353, h:69}, m: {l:39, t:192, w:243, h:88}, text: "You deserve gorgeous films, timeless photographs, and unforgettable memories that capture the essence of your love story.", ds: {"ff": "sans", "fs": 17.0, "lh": 1.6, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400}, ms: {"ff": "sans", "fs": 14.0, "lh": 1.6, "ls": "0em", "ta": "center", "tt": "none", "c": "rgba(255,255,255,1)", "fst": "normal", "fw": 400} },
    { sid: "portfolio-cta_2", kind: "box", d: {l:476, t:485, w:248, h:52}, m: {l:78, t:298, w:167, h:40}, button: { label: "Get Started", href: CALENDLY_BOOKING_URL, variant: "solid" } },
  ]},
];
