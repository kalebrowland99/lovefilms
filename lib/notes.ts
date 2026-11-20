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
  bonusNote: string;
  qa: { q: string; a: string }[];
  films: LeadFilm[];
  photos: string[];
  photoCredit: string;
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
      'Everything from our call, in one place. Your day, your package, your bonuses, and the answers to the questions you asked, plus recent work from the photographers and videographers on your local team.',
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
      'A vintage Super 8 highlight edit of your film',
      'Two extra minutes added to your highlight film',
      '50 vintage style edits of your photos',
    ],
    bonusNote:
      'These come with your booking inside the 48 hour window. Since you were waiting on us for portfolios, we are holding your bonuses while you look this over.',
    qa: [
      {
        q: 'Can we see our photographer and videographer before the wedding?',
        a: 'Yes! After the deposit, we will all hop on a call with your photographer and videographer so you can meet them properly and talk through your day. After the call, if their personality or portfolio is not your vibe, we can set up another meeting with someone you like more. You will never be stuck with a team you do not love.',
      },
      {
        q: 'Do we get the raw photos and video?',
        a: 'Your raw video footage is included in your package, it is yours to keep. For photos, you will see a preview gallery within 72 hours of the wedding, then your full edited gallery, and you can pick favorites from the unedited set too.',
      },
      {
        q: 'Are you local to Naperville?',
        a: "We're local! We have teams that shoot all over the country and we cover our own travel, so there are no travel or lodging fees added for your day.",
      },
      {
        q: 'How does booking actually work?',
        a: 'Pick Halo Signature in your proposal, sign the contract, and put down the $100 deposit. That locks your date and your bonuses. After that it is 50 percent thirty days later, and the rest thirty days before the wedding. And the schedule is flexible if you need it to be.',
      },
      {
        q: 'What if we need a little more time to decide?',
        a: 'Take the time you need. We are holding your bonuses while you review everything, and Alanna is one text away if anything comes up while you talk it over.',
      },
      {
        q: 'Do you help with signage?',
        a: 'Signage is not part of what we do. We stick to photography, videography, and content creation so we can be great at those. Happy to share what other couples have used if it helps.',
      },
    ],
    films: [
      {
        couple: 'Nelly & Jeremiah',
        note: 'Garden ceremony, draped reception hall, and a sparkler finish.',
        driveId: '1X3-8OmVdMGG-AAzVnapd2IhE8lokXFeB',
      },
      {
        couple: 'Rebecca & David',
        note: 'A colorful garden wedding at a white manor house.',
        driveId: '1UiYb1t-FMJlyc5J8Ib7jffmWcbTFfQBb',
      },
    ],
    photos: [
      '/notes/colin/tia-1.jpg',
      '/notes/colin/tia-2.jpg',
      '/notes/colin/tia-3.jpg',
      '/notes/colin/tia-4.jpg',
      '/notes/colin/tia-5.jpg',
      '/notes/colin/tia-6.jpg',
    ],
    photoCredit: 'Photography from a recent wedding by your local team.',
  },
];

export function notesBySlug(slug: string): LeadNotes | undefined {
  return NOTES.find((n) => n.slug === slug);
}
