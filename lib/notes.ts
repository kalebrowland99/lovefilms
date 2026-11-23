/**
 * Per-lead call notes pages, served at /<slug> (e.g. /colin-notes).
 * One entry per lead, generated after their sales call from the call
 * summary: their day, their package, their bonuses, the common questions
 * answered, local team portfolios, and the Google reviews.
 */

export type LeadFilm = {
  couple: string;
  note: string;
  driveId: string;
  thumb: string;
};

export type LeadNotes = {
  slug: string;
  coupleTitle: string;
  hostFirstName: string;
  callDateLabel: string;
  heroLine: string;
  dayFacts: { label: string; value: string }[];
  packageName: string;
  packageIntro: string;
  packageFacts: string[];
  bonuses: string[];
  bonusDeadlineISO: string;
  areaLabel: string;
  weddingDateLabel: string;
  films: LeadFilm[];
  dayPhotos: string[];
  photoCredit: string;
  inspoMention?: string;
  inspoYoutubeId?: string;
};

export const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps/place/The+Love+Team/@38.3280699,-145.7778334,3z/data=!4m12!1m2!2m1!1sThe+Love+Team+Nashville+wedding+photographer!3m8!1s0xa3299f6364bfe3a9:0x7b53e690d7273890!8m2!3d36.3509594!4d-70.3006996!9m1!1b1!15sCixUaGUgTG92ZSBUZWFtIE5hc2h2aWxsZSB3ZWRkaW5nIHBob3RvZ3JhcGhlcpIBFHdlZGRpbmdfcGhvdG9ncmFwaGVy4AEA!16s%2Fg%2F11zxmx36bq?entry=ttu&g_ep=EgoyMDI2MTExNy4wIKXMDSoASAFQAw%3D%3D';

export const GOOGLE_REVIEW_QUOTE = {
  text: 'It is amazing working with this team! They are very professional!',
  name: 'Caleb Rogers',
  detail: '5 stars on Google, and every couple who has reviewed us there so far agrees.',
};

export const NOTES: LeadNotes[] = [
  {
    slug: 'colin-notes',
    coupleTitle: 'Colin & Mira',
    hostFirstName: 'Alanna',
    callDateLabel: 'Thursday, November 19',
    heroLine:
      'Everything from our call, in one place. Your day, your package, your bonuses, and the answers to the questions couples ask us most, plus recent work from the photographers and videographers on your local team.',
    dayFacts: [
      { label: 'Your date', value: 'Saturday, September 25, 2027' },
      {
        label: 'Ceremony',
        value: 'Your church campus in the Aurora or Geneva area, final campus still to pick',
      },
      { label: 'Reception', value: 'Hotel Arista, Naperville' },
      { label: 'Guests', value: 'Around 120' },
      { label: 'Coverage', value: '8 to 10 hours, photography and videography' },
      {
        label: 'Your style',
        value: 'Nostalgic and family focused, with fun, candid energy mixed in',
      },
      { label: 'Vows', value: 'Writing your own' },
    ],
    packageName: 'Halo Signature',
    packageIntro:
      'The package you and Alanna landed on. Ten full hours with your photo and video team, and a longer cinematic film to relive it.',
    packageFacts: [
      '10 hours of photography and videography coverage',
      'Cinematic highlight film, 7 minutes or longer',
      'Full ceremony film and edited speeches',
      'All of your raw video footage included, yours to keep',
      'Content creation included',
      'Preview gallery within 72 hours of your wedding',
      'Designed album upgrade available for $100',
    ],
    bonuses: [
      'Free Vintage Super 8 highlight film bonus edit ($350 value)',
      'Free +2 minutes added to your highlight film ($350 value)',
      'Free 50 vintage film-style photo edits ($250 value)',
    ],
    bonusDeadlineISO: '2026-11-21T12:00:00-06:00',
    areaLabel: 'Naperville',
    weddingDateLabel: 'September 25, 2027',
    films: [
      {
        couple: 'Nelly & Jeremiah',
        note: 'Garden ceremony, draped reception hall, and a sparkler finish.',
        driveId: '1X3-8OmVdMGG-AAzVnapd2IhE8lokXFeB',
        thumb: '/notes/shared/film-nelly.jpg',
      },
      {
        couple: 'Rebecca & David',
        note: 'A colorful garden wedding at a white manor house.',
        driveId: '1UiYb1t-FMJlyc5J8Ib7jffmWcbTFfQBb',
        thumb: '/notes/shared/film-rebecca.jpg',
      },
    ],
    dayPhotos: ['/notes/colin/venue-1.jpg', '/notes/colin/venue-2.jpg'],
    photoCredit: 'Your reception venue, Hotel Arista in Naperville.',
    inspoMention:
      'nostalgic and family focused, with fun, candid energy mixed in',
    inspoYoutubeId: 'NRMRVCl4YXw',
  },
  {
    slug: 'veldis-notes',
    coupleTitle: 'Veldis King',
    hostFirstName: 'Alanna',
    callDateLabel: 'Saturday, November 21',
    heroLine:
      'Everything from our call, in one place. Your day, your package, your bonuses, and the answers to the questions couples ask us most, plus recent work from the photographers and videographers on your local team.',
    dayFacts: [
      { label: 'Your date', value: 'Friday, June 11, 2027' },
      {
        label: 'Ceremony',
        value: "Outdoor ceremony at Benham's Grove in Centerville",
      },
      {
        label: 'Reception',
        value: "Indoor reception at Benham's Grove, right after the ceremony",
      },
      {
        label: 'Guests',
        value: 'Around 100 for the ceremony, around 200 for the reception',
      },
      { label: 'Coverage', value: '8 to 10 hours of videography' },
      {
        label: 'Your style',
        value: 'Nostalgic and natural, all about family and real memories',
      },
      { label: 'Vows', value: 'Private vows, and no first look' },
    ],
    packageName: 'Starlight',
    packageIntro:
      'The package that fits what you told Alanna you want. Up to ten hours with your videography team, a longer highlight film, and your full ceremony film in 4K.',
    packageFacts: [
      'Up to 10 hours of videography coverage',
      'Highlight film, 5 minutes or longer',
      'Full length ceremony film',
      '4K coverage',
    ],
    bonuses: [
      'Free Vintage Super 8 highlight film bonus edit ($350 value)',
      'Free +2 minutes added to your extended highlight film ($350 value)',
      'Free social media teaser ($250 value)',
      'Free all raw footage and unedited files ($600 value)',
      'Free content clips, vertical phone videos from behind the scenes ($250 value)',
    ],
    bonusDeadlineISO: '2026-11-23T12:15:00-06:00',
    areaLabel: 'Centerville',
    weddingDateLabel: 'June 11, 2027',
    films: [
      {
        couple: 'Nelly & Jeremiah',
        note: 'Garden ceremony, draped reception hall, and a sparkler finish.',
        driveId: '1X3-8OmVdMGG-AAzVnapd2IhE8lokXFeB',
        thumb: '/notes/shared/film-nelly.jpg',
      },
      {
        couple: 'Rebecca & David',
        note: 'A colorful garden wedding at a white manor house.',
        driveId: '1UiYb1t-FMJlyc5J8Ib7jffmWcbTFfQBb',
        thumb: '/notes/shared/film-rebecca.jpg',
      },
    ],
    dayPhotos: ['/notes/veldis/venue-1.jpg', '/notes/veldis/venue-2.jpg'],
    photoCredit: "Your ceremony and reception venue, Benham's Grove in Centerville.",
    inspoMention: 'nostalgic and natural, focused on family and real memories',
    inspoYoutubeId: 'NRMRVCl4YXw',
  },
  {
    slug: 'toyin-notes',
    coupleTitle: 'Toyin & Joshua',
    hostFirstName: 'Alanna',
    callDateLabel: 'Saturday, November 21',
    heroLine:
      'Everything from our call, in one place. Your day, your package, your bonuses, and the answers to the questions couples ask us most, plus recent work from the photographers and videographers on your local team.',
    dayFacts: [
      { label: 'Your date', value: 'Thursday, July 8, 2027' },
      {
        label: 'Ceremony',
        value:
          'Two ceremonies at The Arlo, your American vow ceremony first, then your Nigerian ceremony',
      },
      {
        label: 'Reception',
        value: 'At The Arlo, following your ceremonies and cocktail hour',
      },
      { label: 'Guests', value: '220 to 250' },
      { label: 'Coverage', value: '10 hours, photography and videography' },
      {
        label: 'Your style',
        value: 'Editorial and candid, with guided posing and plenty of real moments',
      },
      {
        label: 'First look',
        value: 'Yes, a first look with just the two of you',
      },
    ],
    packageName: 'Halo Signature',
    packageIntro:
      'The package you and Alanna landed on. Ten full hours with your photo and video team, and a longer cinematic film to relive it.',
    packageFacts: [
      '10 hours of photography and videography coverage',
      'Cinematic highlight film, 7 minutes or longer',
      'Full ceremony film and edited speeches',
      'All of your raw video footage included, yours to keep',
      'Content creation included',
      'Preview gallery within 72 hours of your wedding',
      'Designed album upgrade available for $100',
    ],
    bonuses: [
      'Free Vintage Super 8 highlight film bonus edit ($350 value)',
      'Free +2 minutes added to your highlight film ($350 value)',
      'Free 50 vintage film-style photo edits ($250 value)',
    ],
    bonusDeadlineISO: '2026-11-23T14:30:00-06:00',
    areaLabel: 'Austin',
    weddingDateLabel: 'July 8, 2027',
    films: [
      {
        couple: 'Nelly & Jeremiah',
        note: 'Garden ceremony, draped reception hall, and a sparkler finish.',
        driveId: '1X3-8OmVdMGG-AAzVnapd2IhE8lokXFeB',
        thumb: '/notes/shared/film-nelly.jpg',
      },
      {
        couple: 'Rebecca & David',
        note: 'A colorful garden wedding at a white manor house.',
        driveId: '1UiYb1t-FMJlyc5J8Ib7jffmWcbTFfQBb',
        thumb: '/notes/shared/film-rebecca.jpg',
      },
    ],
    dayPhotos: ['/notes/toyin/venue-1.jpg', '/notes/toyin/venue-2.jpg'],
    photoCredit: 'Your ceremony and reception venue, The Arlo in Austin.',
    inspoMention:
      'editorial but also candid, without spending the whole day posing',
    inspoYoutubeId: 'IqCevNEOG4U',
  },
  {
    slug: 'samuel-notes',
    coupleTitle: 'Samuel & Isabel',
    hostFirstName: 'Alanna',
    callDateLabel: 'Sunday, November 22',
    heroLine:
      'Everything from our call, in one place. Your day, your package, your bonuses, and the answers to the questions couples ask us most, plus recent work from the photographers and videographers on your local team.',
    dayFacts: [
      { label: 'Your date', value: 'Saturday, May 22, 2027' },
      {
        label: 'Ceremony',
        value:
          'Still deciding, likely a church in the U District in Seattle or in Kent',
      },
      { label: 'Reception', value: 'At the same place as your ceremony' },
      { label: 'Guests', value: '150 to 200' },
      { label: 'Coverage', value: '8 hours, photography and videography' },
      {
        label: 'Your style',
        value:
          'Timeless, classic, elegant and romantic, garden inspired, with a mix of candid and posed photos',
      },
      { label: 'First look', value: 'No first look planned' },
    ],
    packageName: 'Halo Essential',
    packageIntro:
      'The package that fits the day you described to Alanna. Eight hours with your photo and video team, a highlight film, and content creation included.',
    packageFacts: [
      '8 hours of photography and videography coverage',
      '500 plus edited photos',
      'Highlight film, 5 minutes or longer',
      'Full ceremony film',
      'Content creation included',
      'Preview gallery within one week of your wedding',
    ],
    bonuses: ['Free 50 vintage film-style photo edits'],
    bonusDeadlineISO: '2026-11-24T14:30:00-06:00',
    areaLabel: 'Seattle',
    weddingDateLabel: 'May 22, 2027',
    films: [
      {
        couple: 'Nelly & Jeremiah',
        note: 'Garden ceremony, draped reception hall, and a sparkler finish.',
        driveId: '1X3-8OmVdMGG-AAzVnapd2IhE8lokXFeB',
        thumb: '/notes/shared/film-nelly.jpg',
      },
      {
        couple: 'Rebecca & David',
        note: 'A colorful garden wedding at a white manor house.',
        driveId: '1UiYb1t-FMJlyc5J8Ib7jffmWcbTFfQBb',
        thumb: '/notes/shared/film-rebecca.jpg',
      },
    ],
    dayPhotos: [],
    photoCredit: '',
    inspoMention:
      'timeless, classic, elegant and romantic, garden inspired and not overly modern or trendy',
    inspoYoutubeId: 'QWcTdxTo-AI',
  },
  {
    slug: 'menna-notes',
    coupleTitle: 'Menna Aldalati',
    hostFirstName: 'Alanna',
    callDateLabel: 'Monday, November 23',
    heroLine:
      'Everything from our call, in one place. Your day, your package, your bonuses, and the answers to the questions couples ask us most, plus recent work from the photographers and videographers on your local team.',
    dayFacts: [
      { label: 'Your date', value: 'Saturday, October 23, 2027' },
      {
        label: 'Ceremony',
        value:
          'A private ceremony about a week before, photographed by a family member',
      },
      {
        label: 'Reception',
        value: 'Dove Canyon Courtyard, a completely outdoor courtyard venue',
      },
      { label: 'Guests', value: 'Around 170' },
      { label: 'Coverage', value: '8 hours, photography and videography' },
      {
        label: 'Your style',
        value:
          'Natural and not overly posed, focused on the memories and the energy of the celebration',
      },
      { label: 'First look', value: 'Yes, a first look while getting ready' },
      {
        label: 'Traditions',
        value:
          'A fusion wedding, part Egyptian and part American, with a traditional Arab and Egyptian entrance',
      },
    ],
    packageName: 'Halo Essential',
    packageIntro:
      'The package you and Alanna landed on. Eight hours with your photo and video team, a highlight film, and content creation included.',
    packageFacts: [
      '8 hours of photography and videography coverage',
      '500 plus edited photos',
      'Highlight film, 5 minutes or longer',
      'Full ceremony film',
      'Content creation included',
      'Preview gallery within one week of your wedding',
    ],
    bonuses: ['Free 50 vintage film-style photo edits'],
    bonusDeadlineISO: '2026-11-25T12:15:00-06:00',
    areaLabel: 'Trabuco Canyon',
    weddingDateLabel: 'October 23, 2027',
    films: [
      {
        couple: 'Nelly & Jeremiah',
        note: 'Garden ceremony, draped reception hall, and a sparkler finish.',
        driveId: '1X3-8OmVdMGG-AAzVnapd2IhE8lokXFeB',
        thumb: '/notes/shared/film-nelly.jpg',
      },
      {
        couple: 'Rebecca & David',
        note: 'A colorful garden wedding at a white manor house.',
        driveId: '1UiYb1t-FMJlyc5J8Ib7jffmWcbTFfQBb',
        thumb: '/notes/shared/film-rebecca.jpg',
      },
    ],
    dayPhotos: ['/notes/menna/venue-1.jpg', '/notes/menna/venue-2.jpg'],
    photoCredit: 'Your reception venue, Dove Canyon Courtyard in Trabuco Canyon.',
    inspoMention:
      'natural and not overly posed, focused on the memories and the energy of the celebration',
    inspoYoutubeId: 'NXG7Rq5cIrQ',
  },
  {
    slug: 'julia-notes',
    coupleTitle: 'Julia & Marcus',
    hostFirstName: 'Alanna',
    callDateLabel: 'Monday, November 23',
    heroLine:
      'Everything from our call, in one place. Your day, your package, your bonuses, and the answers to the questions couples ask us most, plus recent work from the photographers and videographers on your local team.',
    dayFacts: [
      { label: 'Your date', value: 'Friday, June 4, 2027' },
      {
        label: 'Ceremony',
        value: 'At Hyatt Lodge in Oak Brook, at the same venue as your reception',
      },
      {
        label: 'Reception',
        value: 'At Hyatt Lodge in Oak Brook, following your ceremony',
      },
      { label: 'Guests', value: '150 to 175' },
      { label: 'Coverage', value: '10 hours, photography and videography' },
      {
        label: 'Your style',
        value:
          'A mix of candid and posed, nostalgic, like it was just yesterday',
      },
      {
        label: 'First look',
        value: 'No first look, Marcus sees you when you walk down the aisle',
      },
    ],
    packageName: 'Halo Signature',
    packageIntro:
      'The package you and Alanna landed on. Ten full hours with your photo and video team, and a longer cinematic film to relive it.',
    packageFacts: [
      '10 hours of photography and videography coverage',
      'Cinematic highlight film, 7 minutes or longer',
      'Full ceremony film and edited speeches',
      'All of your raw video footage included, yours to keep',
      'Content creation included',
      'Preview gallery within 72 hours of your wedding',
      'Designed album upgrade available for $100',
    ],
    bonuses: [
      'Free extra hour of coverage ($500 value)',
      'Free rehearsal dinner coverage ($1,000 value)',
      'Free content creator for your wedding day ($2,500 value)',
    ],
    bonusDeadlineISO: '2026-11-25T13:30:00-06:00',
    areaLabel: 'Oak Brook',
    weddingDateLabel: 'June 4, 2027',
    films: [
      {
        couple: 'Nelly & Jeremiah',
        note: 'Garden ceremony, draped reception hall, and a sparkler finish.',
        driveId: '1X3-8OmVdMGG-AAzVnapd2IhE8lokXFeB',
        thumb: '/notes/shared/film-nelly.jpg',
      },
      {
        couple: 'Rebecca & David',
        note: 'A colorful garden wedding at a white manor house.',
        driveId: '1UiYb1t-FMJlyc5J8Ib7jffmWcbTFfQBb',
        thumb: '/notes/shared/film-rebecca.jpg',
      },
    ],
    dayPhotos: ['/notes/julia/venue-1.jpg', '/notes/julia/venue-2.jpg'],
    photoCredit: 'Your ceremony and reception venue, Hyatt Lodge in Oak Brook.',
    inspoMention: 'a mix of candid and posed, nostalgic, like it was just yesterday',
    inspoYoutubeId: 'NRMRVCl4YXw',
  },
];

export function notesBySlug(slug: string): LeadNotes | undefined {
  return NOTES.find((n) => n.slug === slug);
}
