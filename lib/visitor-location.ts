import { findUSState, stateFromAbbreviation, type USState } from '@/lib/us-states';

export const VISITOR_STATE_HEADER = 'x-ylf-visitor-state';
export const VISITOR_STATE_COOKIE = 'ylf_state';
/** Sent by middleware when the visitor should see nationwide copy (not a missing header). */
export const NATIONWIDE_HEADER_VALUE = '-';

export type VisitorLocation = {
  visitorState: string | null;
  visitorStateAbbreviation: string | null;
  hasValidUSState: boolean;
};

export const NATIONWIDE_LOCATION: VisitorLocation = {
  visitorState: null,
  visitorStateAbbreviation: null,
  hasValidUSState: false,
};

export function locationFromState(state: USState | null): VisitorLocation {
  if (!state) return NATIONWIDE_LOCATION;
  return {
    visitorState: state.displayName,
    visitorStateAbbreviation: state.abbreviation,
    hasValidUSState: true,
  };
}

/**
 * Resolve a visitor’s U.S. state.
 *
 * Priority:
 * 1. `?state=` query (whitelist only — never used raw)
 * 2. `ylf_state` cookie from a previous valid query override
 * 3. Vercel `x-vercel-ip-country` + `x-vercel-ip-country-region` (state-level only)
 * 4. Nationwide fallback
 */
export function resolveVisitorLocation(input: {
  stateParam?: string | null;
  cookieState?: string | null;
  country?: string | null;
  region?: string | null;
}): VisitorLocation {
  // A present ?state= always wins: valid → that state, invalid/empty → nationwide.
  // Never interpolate the raw query string.
  if (input.stateParam != null) {
    return locationFromState(findUSState(input.stateParam));
  }

  const fromCookie = stateFromAbbreviation(input.cookieState ?? null);
  if (fromCookie) return locationFromState(fromCookie);

  const country = (input.country ?? '').trim().toUpperCase();
  const region = (input.region ?? '').trim().toUpperCase();
  if (country === 'US' && region) {
    return locationFromState(stateFromAbbreviation(region));
  }

  return NATIONWIDE_LOCATION;
}
