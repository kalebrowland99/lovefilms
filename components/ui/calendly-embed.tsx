'use client';

import { useEffect } from 'react';

export const CALENDLY_URL =
  'https://calendly.com/d/dv52-zpb-26d/love-films-quick-call';

export function CalendlyEmbed({
  className,
  minHeight = 700,
}: {
  className?: string;
  minHeight?: number;
}) {
  useEffect(() => {
    if (!document.querySelector('script[src*="calendly"]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      className={`calendly-inline-widget ${className ?? ''}`}
      data-url={CALENDLY_URL}
      style={{ minWidth: '320px', height: `${minHeight}px` }}
    />
  );
}
