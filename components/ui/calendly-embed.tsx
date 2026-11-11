'use client';

import { useEffect } from 'react';
import { CALENDLY_BOOKING_URL } from '@/lib/calendly';

export const CALENDLY_URL = CALENDLY_BOOKING_URL;

export function CalendlyEmbed({
  className,
  minHeight = 700,
  height,
  url = CALENDLY_URL,
}: {
  className?: string;
  minHeight?: number;
  height?: number | string;
  url?: string;
}) {
  useEffect(() => {
    if (!document.querySelector('script[src*="assets.calendly.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const resolvedHeight = height ?? minHeight;

  return (
    <div
      className={`calendly-inline-widget ${className ?? ''}`}
      data-url={url}
      style={{
        minWidth: '320px',
        height: typeof resolvedHeight === 'number' ? `${resolvedHeight}px` : resolvedHeight,
      }}
    />
  );
}
