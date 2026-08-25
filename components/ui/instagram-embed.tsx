'use client';

import { useEffect } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

function processInstagramEmbeds() {
  window.instgrm?.Embeds?.process();
}

export function InstagramEmbedScript() {
  return (
    <Script
      src="https://www.instagram.com/embed.js"
      strategy="lazyOnload"
      onLoad={processInstagramEmbeds}
    />
  );
}

export function InstagramEmbed({
  url,
  className,
}: {
  url: string;
  className?: string;
}) {
  useEffect(() => {
    processInstagramEmbeds();

    const checkInterval = setInterval(() => {
      if (window.instgrm?.Embeds) {
        processInstagramEmbeds();
        clearInterval(checkInterval);
      }
    }, 100);

    const timeout = setTimeout(() => clearInterval(checkInterval), 5000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, [url]);

  return (
    <div className={className}>
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: '#FFF',
          border: '0',
          borderRadius: '12px',
          boxShadow: 'none',
          margin: '0 auto',
          maxWidth: '540px',
          minWidth: '0',
          padding: '0',
          width: '100%',
        }}
      />
    </div>
  );
}
