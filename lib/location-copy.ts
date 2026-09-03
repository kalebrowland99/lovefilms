import { cache } from 'react';
import { getVisitorLocation } from '@/lib/get-visitor-location';
import type { VisitorLocation } from '@/lib/visitor-location';

export type LocationCopy = VisitorLocation & {
  heroTitle: string;
  heroSubtitle: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButton: string;
  socialProof: string;
  travelLine: string;
  travelBody: string;
  footerTagline: string;
  approachHeadline: string;
  portfolioHeadline: string;
  aboutIntro: string;
  experienceHeadlineBefore: string;
  experienceHeadlineAfter: string;
  servingHeading: string;
  servingBody: string;
  instagramLocation: string;
  letsTravelBody: string;
};

export function getLocationCopy(location: VisitorLocation): LocationCopy {
  const state = location.hasValidUSState && location.visitorState ? location.visitorState : null;
  const upper = state ? state.toUpperCase() : null;

  return {
    ...location,
    heroTitle: state
      ? `Wedding Photography & Videography in ${state}`
      : 'Wedding Photography & Videography Nationwide',
    heroSubtitle: state
      ? `Timeless photo and video coverage for weddings throughout ${state}.`
      : 'Timeless photo and video coverage for weddings across the country.',
    ctaTitle: state ? `Check availability for your ${state} wedding` : 'Check availability for your wedding',
    ctaDescription:
      'Book a quick call with our wedding team. We take on a limited number of dates each year — first come, first served.',
    ctaButton: 'Check Availability',
    socialProof: state
      ? `Trusted by couples across ${state} and beyond.`
      : 'Trusted by couples across the country.',
    travelLine: 'No surprise travel fees — we handle the logistics.',
    travelBody:
      'Our team serves weddings across the country, and any necessary travel is already included in your package.',
    footerTagline: state
      ? `Wedding photography & videography in ${state}`
      : 'Wedding photography & videography nationwide',
    approachHeadline: upper
      ? `CINEMATIC WEDDING FILMS {{i}}and{{/i}} PHOTOGRAPHY IN ${upper}`
      : 'CINEMATIC WEDDING FILMS {{i}}and{{/i}} PHOTOGRAPHY NATIONWIDE',
    portfolioHeadline: upper
      ? `ROMANTIC WEDDING FILMS {{i}}and{{/i}} PHOTOGRAPHY IN ${upper}`
      : 'ROMANTIC WEDDING FILMS {{i}}and{{/i}} PHOTOGRAPHY NATIONWIDE {{i}}and{{/i}} BEYOND',
    aboutIntro: state
      ? `We are a wedding photography and videography team serving couples throughout ${state} and across the country. Before we hop on a call, here is a short video on how we work and what it is like to have us there on your day.`
      : 'We are a wedding photography and videography team serving couples across the country. Before we hop on a call, here is a short video on how we work and what it is like to have us there on your day.',
    experienceHeadlineBefore: 'Wedding films and photography',
    experienceHeadlineAfter: state ? `in ${state}` : 'nationwide',
    servingHeading: state ? `Serving weddings throughout ${state}` : 'Serving weddings across the country',
    servingBody: state
      ? `Our ${state} wedding photography & videography team photographs and films weddings, elopements, and couple sessions throughout ${state} and beyond. Destination work is part of how we work, not an exception.`
      : 'Our team photographs and films weddings, elopements, and couple sessions across the country. If your celebration is somewhere we have not listed, ask. Destination work is part of how we work, not an exception.',
    instagramLocation: state ? `📍 ${state} · Wedding Films` : '📍 Nationwide · Wedding Films',
    letsTravelBody: state
      ? `Serving weddings throughout ${state} — and wherever your celebration takes you.`
      : 'Our team serves weddings across the country, and any necessary travel is already included in your package.',
  };
}

export const getLocationCopyForRequest = cache(async () => {
  return getLocationCopy(await getVisitorLocation());
});

export const NATIONWIDE_COPY = getLocationCopy({
  visitorState: null,
  visitorStateAbbreviation: null,
  hasValidUSState: false,
});
