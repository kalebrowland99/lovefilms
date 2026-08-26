'use client';

import { useEffect } from 'react';
import {
  InstagramEmbed,
  InstagramEmbedScript,
} from '@/components/ui/instagram-embed';
import { PORTFOLIO_ITEMS } from '@/lib/portfolio';

interface PortfolioGridProps {
  title?: string;
}

export function PortfolioGrid({ title = 'Portfolio' }: PortfolioGridProps = {}) {
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
            {PORTFOLIO_ITEMS.map((item) => (
              <InstagramEmbed
                key={item.shortcode}
                url={item.url}
                className="flex justify-center"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/** @deprecated Use PortfolioGrid */
export const InstagramEmbeds = PortfolioGrid;
