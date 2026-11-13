"use client";

/**
 * MetaBookedCall — drop this on the /calendly page, next to the inline
 * Calendly widget. It renders nothing.
 *
 * Why it exists
 * -------------
 * Today the only booking signal Meta gets is Calendly's own
 * `invitee_meeting_scheduled` event, fired from calendly.com. Meta received
 * the events but could not match most of them back to the ad click, so only
 * 3 of 12 campaign-tagged bookings were credited Nov 11–13, 2026.
 *
 * This component hears the booking from inside yourlovefilms.com instead:
 *
 *   1. Calendly's inline widget posts a `calendly.event_scheduled`
 *      postMessage to the parent page the moment a booking completes.
 *   2. We generate ONE eventId for that booking.
 *   3. Browser:  fbq('trackCustom', 'BookedCall', {}, { eventID: eventId })
 *      — fired from yourlovefilms.com, in the same browser session as the
 *      ad click, so it carries that session's _fbc / _fbp cookies.
 *   4. Server:   POST { eventId } to /api/meta-capi, which re-sends the
 *      same "BookedCall" event through the Conversions API with the SAME
 *      event_id.
 *
 * Meta deduplicates a browser event and a server event when the event
 * name and event_id match, so (3) + (4) count as ONE conversion, not two.
 * See lib/metaCapi.ts and README.md.
 */

import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Shape of the messages Calendly's embed posts to the parent window. */
interface CalendlyPostMessage {
  event?: string;
  payload?: unknown;
}

function isCalendlyScheduledMessage(data: unknown): boolean {
  if (typeof data !== "object" || data === null) return false;
  return (data as CalendlyPostMessage).event === "calendly.event_scheduled";
}

export default function MetaBookedCall() {
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      // Calendly embeds only ever post from calendly.com. Ignore anything
      // else so a stray postMessage can never fake a conversion.
      if (event.origin !== "https://calendly.com") return;
      if (!isCalendlyScheduledMessage(event.data)) return;

      // One ID per booking — shared by the browser event below and the
      // server (CAPI) event, which is what makes Meta dedupe them.
      const eventId = crypto.randomUUID();
      const eventSourceUrl = window.location.href;

      // 1) Browser pixel event (same session as the ad click).
      try {
        window.fbq?.("trackCustom", "BookedCall", {}, { eventID: eventId });
      } catch {
        // Pixel blocked / not loaded yet — the server event below still
        // goes out, so the booking is not lost.
      }

      // 2) Server twin via CAPI, same event_id. Fire-and-forget from the
      // page's point of view; keepalive so it survives the redirect to
      // /call-confirmed that follows a completed booking.
      void fetch("/api/meta-capi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, eventSourceUrl }),
        keepalive: true,
      }).catch(() => {
        // Network failure here must never break the booking flow.
      });
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return null;
}
