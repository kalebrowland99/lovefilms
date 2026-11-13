/**
 * POST /api/calendly-webhook — Calendly webhook receiver (invitee.created).
 *
 * Job: cover the bookings the website flow CANNOT see — bookings made
 * through the direct Calendly link (e.g. the link sent in Instagram DMs),
 * where there was never a yourlovefilms.com page session for
 * components/MetaBookedCall.tsx to fire in.
 *
 * Double-count guard
 * -------------------
 * Bookings whose Calendly tracking carries the website campaign's UTM
 * campaign ID (120251438993290509) came through yourlovefilms.com/calendly
 * — the website flow (browser pixel + /api/meta-capi, sharing one
 * event_id) already reported them. Re-sending here under a different
 * event_id would defeat Meta's dedupe and count the booking twice, so
 * those are acknowledged with 200 and skipped.
 *
 * Every other invitee.created gets ONE CAPI "BookedCall" event with
 * event_id = the Calendly invitee UUID (unique per booking), matched on
 * the invitee's hashed email / phone / name.
 *
 * Signature verification
 * ----------------------
 * Calendly sends `Calendly-Webhook-Signature: t=<timestamp>,v1=<hmac>`,
 * where <hmac> is HMAC-SHA256, keyed with CALENDLY_WEBHOOK_SIGNING_KEY,
 * over the string "<timestamp>.<raw request body>". Requests with a bad
 * signature, or a timestamp more than 5 minutes old, are rejected.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { sendMetaCapiEvent } from "@/lib/metaCapi";

// Raw-body HMAC verification + node:crypto hashing require Node.js.
export const runtime = "nodejs";

/** Website Booked Calls campaign ID — bookings from it are already covered. */
const WEBSITE_CAMPAIGN_ID = "120251438993290509";

const TIMESTAMP_TOLERANCE_SECONDS = 5 * 60;

const EVENT_SOURCE_URL = "https://www.yourlovefilms.com/calendly";

/* ------------------------------------------------------------------ */
/* Signature verification                                              */
/* ------------------------------------------------------------------ */

function verifyCalendlySignature(
  signatureHeader: string | null,
  rawBody: string,
  signingKey: string,
): boolean {
  if (!signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => {
      const [key, ...rest] = part.split("=");
      return [key?.trim(), rest.join("=").trim()];
    }),
  );
  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) return false;

  // Replay guard: reject anything stamped more than 5 minutes away.
  // Calendly's t is Unix seconds.
  const timestampSeconds = Number(timestamp);
  if (!Number.isFinite(timestampSeconds)) return false;
  const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - timestampSeconds);
  if (ageSeconds > TIMESTAMP_TOLERANCE_SECONDS) return false;

  const expected = createHmac("sha256", signingKey)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== signatureBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, signatureBuffer);
}

/* ------------------------------------------------------------------ */
/* Calendly payload shape (only the fields we use)                     */
/* ------------------------------------------------------------------ */

interface CalendlyQuestionAnswer {
  question?: string;
  answer?: string;
}

interface CalendlyInvitee {
  uri?: string;
  name?: string;
  email?: string;
  tracking?: {
    utm_campaign?: string | null;
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_content?: string | null;
    utm_term?: string | null;
  } | null;
  questions_and_answers?: CalendlyQuestionAnswer[];
}

interface CalendlyWebhookBody {
  event?: string;
  payload?: CalendlyInvitee;
}

/**
 * The phone number is not a top-level Calendly field — it arrives as an
 * answer to the booking form's phone question. Prefer an answer whose
 * question mentions "phone"; otherwise fall back to any answer that
 * looks like a phone number (10+ digits).
 */
function extractPhone(invitee: CalendlyInvitee): string | undefined {
  const answers = invitee.questions_and_answers ?? [];

  for (const qa of answers) {
    if (qa.question?.toLowerCase().includes("phone") && qa.answer) {
      return qa.answer;
    }
  }
  for (const qa of answers) {
    if (qa.answer && qa.answer.replace(/\D/g, "").length >= 10) {
      return qa.answer;
    }
  }
  return undefined;
}

function splitName(fullName: string | undefined): {
  firstName?: string;
  lastName?: string;
} {
  if (!fullName) return {};
  const [firstName, ...rest] = fullName.trim().split(/\s+/);
  return {
    firstName: firstName || undefined,
    lastName: rest.length > 0 ? rest.join(" ") : undefined,
  };
}

/** Invitee UUID = last path segment of the invitee URI. */
function inviteeUuid(invitee: CalendlyInvitee): string | undefined {
  if (!invitee.uri) return undefined;
  return invitee.uri.split("/").filter(Boolean).pop();
}

/* ------------------------------------------------------------------ */
/* Route                                                               */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
  if (!signingKey) {
    console.error("CALENDLY_WEBHOOK_SIGNING_KEY is not set");
    return NextResponse.json(
      { error: "Webhook signing key not configured" },
      { status: 500 },
    );
  }

  // Signature is over the RAW body — read text before parsing JSON.
  const rawBody = await request.text();

  const signatureOk = verifyCalendlySignature(
    request.headers.get("calendly-webhook-signature"),
    rawBody,
    signingKey,
  );
  if (!signatureOk) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: CalendlyWebhookBody;
  try {
    body = JSON.parse(rawBody) as CalendlyWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // We only subscribe to invitee.created, but acknowledge anything else
  // with 200 so Calendly does not retry events we intentionally ignore.
  if (body.event !== "invitee.created" || !body.payload) {
    return NextResponse.json({ ok: true, note: "Event ignored" });
  }

  const invitee = body.payload;

  // Double-count guard: website-campaign bookings were already reported
  // by the website flow with their own event_id. Skip them here.
  if (invitee.tracking?.utm_campaign === WEBSITE_CAMPAIGN_ID) {
    return NextResponse.json({
      ok: true,
      note: "Skipped: website-campaign booking already covered by the website pixel + CAPI flow",
    });
  }

  const eventId = inviteeUuid(invitee);
  if (!eventId) {
    return NextResponse.json(
      { error: "Invitee URI missing, cannot build event_id" },
      { status: 400 },
    );
  }

  const { firstName, lastName } = splitName(invitee.name);

  try {
    const result = await sendMetaCapiEvent({
      eventId,
      eventSourceUrl: EVENT_SOURCE_URL,
      email: invitee.email,
      phone: extractPhone(invitee),
      firstName,
      lastName,
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("calendly-webhook CAPI send failed:", error);
    // Non-200 makes Calendly retry, which is what we want for a
    // transient Meta failure — the event_id is stable, so a retry
    // cannot double count.
    return NextResponse.json(
      { error: "Failed to send CAPI event" },
      { status: 502 },
    );
  }
}
