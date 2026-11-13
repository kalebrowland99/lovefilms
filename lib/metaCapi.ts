/**
 * Shared server helper for Meta's Conversions API (CAPI).
 *
 * Sends ONE custom event, "BookedCall", to the yourlovefilms dataset
 * (pixel / dataset ID 889248227046303).
 *
 * Dedupe design
 * -------------
 * - Website flow (components/MetaBookedCall.tsx + app/api/meta-capi):
 *   the browser pixel event and this server event share the same
 *   event_id, generated on the /calendly page at booking time. Meta
 *   deduplicates on (event_name, event_id), so the pair counts once.
 * - Calendly webhook flow (app/api/calendly-webhook): used only for
 *   bookings the website flow cannot have covered (e.g. the direct
 *   Calendly link sent in DMs). Its event_id is the Calendly invitee
 *   UUID — unique per booking, and never reused by any other sender.
 * - Calendly's own `invitee_meeting_scheduled` event is a different
 *   event name. The new custom conversion is built on "BookedCall"
 *   only, so the old event is never counted by it: no double counting.
 *
 * The access token is read from process.env.META_CAPI_ACCESS_TOKEN.
 * It is never hardcoded, never logged, and never sent anywhere except
 * the Graph API request below.
 */

import { createHash } from "node:crypto";

/** Meta dataset (pixel) ID for yourlovefilms.com. Not a secret. */
export const META_DATASET_ID = "889248227046303";

const GRAPH_API_VERSION = "v21.0";
const EVENT_NAME = "BookedCall";

export interface SendMetaCapiEventInput {
  /** Unique ID for this booking. Shared browser/server in the website flow. */
  eventId: string;
  /** Page the conversion is credited to, e.g. https://www.yourlovefilms.com/calendly */
  eventSourceUrl: string;
  /** Unix seconds. Defaults to now. */
  eventTime?: number;
  /** Raw _fbc cookie value (click ID). Sent unhashed, per Meta's spec. */
  fbc?: string;
  /** Raw _fbp cookie value (browser ID). Sent unhashed, per Meta's spec. */
  fbp?: string;
  /** Plaintext PII — hashed with SHA-256 inside this helper, never sent raw. */
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  /** Visitor IP / user agent, when the request comes from the visitor (website flow). */
  clientIpAddress?: string;
  clientUserAgent?: string;
}

interface MetaUserData {
  fbc?: string;
  fbp?: string;
  em?: string[];
  ph?: string[];
  fn?: string[];
  ln?: string[];
  client_ip_address?: string;
  client_user_agent?: string;
}

/** Meta requires SHA-256 of the value, normalized: trimmed + lowercased. */
function hashValue(normalized: string): string {
  return createHash("sha256").update(normalized).digest("hex");
}

function hashText(value: string): string {
  return hashValue(value.trim().toLowerCase());
}

/**
 * Phone numbers: Meta wants digits only (country code included, no "+",
 * spaces, or punctuation) before hashing.
 */
function hashPhone(value: string): string {
  return hashValue(value.replace(/\D/g, ""));
}

function buildUserData(input: SendMetaCapiEventInput): MetaUserData {
  const userData: MetaUserData = {};

  // Click / browser IDs are already identifiers — Meta wants them raw.
  if (input.fbc) userData.fbc = input.fbc;
  if (input.fbp) userData.fbp = input.fbp;

  // PII is only ever sent hashed.
  if (input.email) userData.em = [hashText(input.email)];
  if (input.phone) userData.ph = [hashPhone(input.phone)];
  if (input.firstName) userData.fn = [hashText(input.firstName)];
  if (input.lastName) userData.ln = [hashText(input.lastName)];

  if (input.clientIpAddress) userData.client_ip_address = input.clientIpAddress;
  if (input.clientUserAgent) userData.client_user_agent = input.clientUserAgent;

  return userData;
}

export async function sendMetaCapiEvent(
  input: SendMetaCapiEventInput,
): Promise<unknown> {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error(
      "META_CAPI_ACCESS_TOKEN is not set. Generate one in Events Manager " +
        "(dataset Settings → Generate access token) and set it in Vercel env vars.",
    );
  }

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: EVENT_NAME,
        event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: input.eventSourceUrl,
        event_id: input.eventId,
        user_data: buildUserData(input),
      },
    ],
  };

  // Test Events passthrough: while META_TEST_EVENT_CODE is set in Vercel,
  // events land in Events Manager → Test Events instead of production.
  // Remove the env var to go live.
  const testEventCode = process.env.META_TEST_EVENT_CODE;
  if (testEventCode) {
    payload.test_event_code = testEventCode;
  }

  const response = await fetch(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${META_DATASET_ID}/events?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    // Deliberately do not include the access token in the error.
    throw new Error(
      `Meta CAPI request failed (${response.status}): ${JSON.stringify(result)}`,
    );
  }

  return result;
}
