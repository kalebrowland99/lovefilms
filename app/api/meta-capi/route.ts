/**
 * POST /api/meta-capi — server twin of the browser "BookedCall" event.
 *
 * Called by components/MetaBookedCall.tsx right after the browser pixel
 * fires, with the SAME eventId the pixel event used. This route adds the
 * match signals the browser cannot send as reliably — the _fbc / _fbp
 * cookies read server-side, plus the visitor's IP and user agent — and
 * forwards everything to Meta's Conversions API via lib/metaCapi.
 *
 * Meta dedupes this against the browser event on (event_name, event_id),
 * so the booking still counts exactly once.
 */

import { NextRequest, NextResponse } from "next/server";

import { sendMetaCapiEvent } from "@/lib/metaCapi";

// node:crypto (hashing in the helper) requires the Node.js runtime.
export const runtime = "nodejs";

interface MetaCapiRequestBody {
  eventId?: string;
  eventSourceUrl?: string;
}

const FALLBACK_SOURCE_URL = "https://www.yourlovefilms.com/calendly";

function clientIp(request: NextRequest): string | undefined {
  // On Vercel the real visitor IP is the first entry of x-forwarded-for.
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || undefined;
  return request.headers.get("x-real-ip") ?? undefined;
}

export async function POST(request: NextRequest) {
  let body: MetaCapiRequestBody;
  try {
    body = (await request.json()) as MetaCapiRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.eventId) {
    return NextResponse.json({ error: "eventId is required" }, { status: 400 });
  }

  try {
    const result = await sendMetaCapiEvent({
      eventId: body.eventId,
      eventSourceUrl: body.eventSourceUrl || FALLBACK_SOURCE_URL,
      // First-party Meta cookies set by the pixel on yourlovefilms.com.
      fbc: request.cookies.get("_fbc")?.value,
      fbp: request.cookies.get("_fbp")?.value,
      clientIpAddress: clientIp(request),
      clientUserAgent: request.headers.get("user-agent") ?? undefined,
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("meta-capi route failed:", error);
    return NextResponse.json(
      { error: "Failed to send CAPI event" },
      { status: 502 },
    );
  }
}
