import { cache } from 'react';
import { connection } from 'next/server';
import { headers } from 'next/headers';
import {
  NATIONWIDE_HEADER_VALUE,
  NATIONWIDE_LOCATION,
  VISITOR_STATE_HEADER,
  locationFromState,
  resolveVisitorLocation,
  type VisitorLocation,
} from '@/lib/visitor-location';
import { stateFromAbbreviation } from '@/lib/us-states';

export const getVisitorLocation = cache(async (): Promise<VisitorLocation> => {
  await connection();
  const h = await headers();
  const fromMiddleware = h.get(VISITOR_STATE_HEADER);

  if (fromMiddleware === NATIONWIDE_HEADER_VALUE) return NATIONWIDE_LOCATION;

  const state = stateFromAbbreviation(fromMiddleware);
  if (state) return locationFromState(state);

  return resolveVisitorLocation({
    country: h.get('x-vercel-ip-country'),
    region: h.get('x-vercel-ip-country-region'),
  });
});
