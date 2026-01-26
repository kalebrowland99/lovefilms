"use client";

import { useEffect } from 'react';
import Script from 'next/script';

interface InstagramEmbedProps {
  url: string;
  className?: string;
}

function InstagramEmbed({ url, className }: InstagramEmbedProps) {
  useEffect(() => {
    // Process Instagram embeds after script loads
    if (window.instgrm?.Embeds) {
      window.instgrm.Embeds.process();
    }
  }, []);

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
          borderRadius: '3px',
          boxShadow: '0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)',
          margin: '1px',
          maxWidth: '540px',
          minWidth: '326px',
          padding: '0',
          width: 'calc(100% - 2px)',
        }}
      />
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

export function InstagramEmbeds() {
  const instagramPosts = [
    'https://www.instagram.com/p/DTGL9CIiT7n/',
    'https://www.instagram.com/p/DTGLpnjCeag/',
    'https://www.instagram.com/p/DTGL0UbidJ0/',
    'https://www.instagram.com/p/DTGMDc1CUDc/',
    'https://www.instagram.com/p/DTGMBaYiW6E/',
  ];

  useEffect(() => {
    // Process embeds after component mounts and script loads
    const processEmbeds = () => {
      if (window.instgrm?.Embeds) {
        window.instgrm.Embeds.process();
      }
    };

    // Check if script already loaded
    if (window.instgrm?.Embeds) {
      processEmbeds();
    } else {
      // Wait for script to load
      const checkInterval = setInterval(() => {
        if (window.instgrm?.Embeds) {
          processEmbeds();
          clearInterval(checkInterval);
        }
      }, 100);

      // Cleanup after 5 seconds
      setTimeout(() => clearInterval(checkInterval), 5000);
    }
  }, []);

  return (
    <>
      {/* Load Instagram embed script */}
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (window.instgrm?.Embeds) {
            window.instgrm.Embeds.process();
          }
        }}
      />
      
      <section className="py-16 md:py-24 px-4 bg-white dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-serif font-normal text-center mb-12 text-black dark:text-white">
            Recent Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {instagramPosts.map((url, index) => (
              <InstagramEmbed key={index} url={url} className="flex justify-center" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
