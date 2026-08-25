'use client';

import { useEffect } from 'react';
import {
  InstagramEmbed,
  InstagramEmbedScript,
} from '@/components/ui/instagram-embed';

interface InstagramEmbedsProps {
  title?: string;
}

export function InstagramEmbeds({ title = 'Quick Previews' }: InstagramEmbedsProps = {}) {
  const instagramPosts = [
    'https://www.instagram.com/p/DTGL9CIiT7n/',
    'https://www.instagram.com/p/DTGLpnjCeag/',
    'https://www.instagram.com/p/DTGL0UbidJ0/',
    'https://www.instagram.com/p/DTGMDc1CUDc/',
    'https://www.instagram.com/p/DTGMBaYiW6E/',
    'https://www.instagram.com/p/DTGL59gibAa/',
  ];

  useEffect(() => {
    const processEmbeds = () => {
      window.instgrm?.Embeds?.process();
    };

    if (window.instgrm?.Embeds) {
      processEmbeds();
    } else {
      const checkInterval = setInterval(() => {
        if (window.instgrm?.Embeds) {
          processEmbeds();
          clearInterval(checkInterval);
        }
      }, 100);

      setTimeout(() => clearInterval(checkInterval), 5000);
    }
  }, []);

  return (
    <>
      <InstagramEmbedScript />

      <section className="py-16 md:py-24 px-4 bg-white dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-serif font-normal text-center mb-12 text-black dark:text-white">
            {title}
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
