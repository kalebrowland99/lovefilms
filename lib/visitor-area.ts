import { headers } from 'next/headers';
import { getVisitorLocation } from '@/lib/get-visitor-location';
import { stateFromAbbreviation, type USState } from '@/lib/us-states';

const FALLBACK_AREA = 'your area';

/** State name for this request, from edge IP geolocation, then a direct IP lookup. */
export async function visitorAreaName(): Promise<string> {
  const location = await getVisitorLocation();
  if (location.hasValidUSState && location.visitorState) return location.visitorState;

  const state = await stateFromRequestIp();
  return state?.displayName ?? FALLBACK_AREA;
}

async function stateFromRequestIp(): Promise<USState | null> {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
  const realIp = h.get('x-real-ip')?.trim() ?? '';
  const ip = publicIp(forwarded) ?? publicIp(realIp);

  try {
    const response = await fetch(ip ? `https://ipwho.is/${encodeURIComponent(ip)}` : 'https://ipwho.is/', {
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { success?: boolean; country_code?: string; region_code?: string };
    if (!data.success || data.country_code !== 'US') return null;
    return stateFromAbbreviation(data.region_code);
  } catch {
    return null;
  }
}

function publicIp(value: string): string | null {
  const ip = value.trim();
  if (!ip || !/^[\da-fA-F.:]+$/.test(ip)) return null;
  if (ip === '::1' || ip.startsWith('127.') || ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('169.254.') || ip.startsWith('0.')) {
    return null;
  }
  const private172 = ip.match(/^172\.(\d+)\./);
  if (private172) {
    const block = Number(private172[1]);
    if (block >= 16 && block <= 31) return null;
  }
  const lower = ip.toLowerCase();
  if (lower.startsWith('fc') || lower.startsWith('fd') || lower.startsWith('fe80')) return null;
  return ip;
}
