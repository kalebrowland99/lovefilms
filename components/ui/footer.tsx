'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IconBrandInstagram } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { CALENDLY_BOOKING_URL } from '@/lib/calendly';

const INSTAGRAM_URL = 'https://instagram.com/yourlovefilms';

const TICKER_ITEMS = [
  { label: 'Follow along on Instagram', href: INSTAGRAM_URL, external: true },
  { label: 'Reserve your date', href: CALENDLY_BOOKING_URL, external: true },
] as const;

function TickerCopy() {
  return (
    <>
      {TICKER_ITEMS.map((item, i) => (
        <React.Fragment key={item.label}>
          {i > 0 && (
            <span className="px-4 md:px-6 text-[#070707]/40" aria-hidden>
              /
            </span>
          )}
          <a
            href={item.href}
            {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="hover:opacity-70 transition-opacity whitespace-nowrap"
          >
            {item.label}
          </a>
        </React.Fragment>
      ))}
      <span className="px-4 md:px-6 text-[#070707]/40" aria-hidden>
        /
      </span>
    </>
  );
}

function TickerTrack({ hidden }: { hidden?: boolean }) {
  return (
    <span className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} className="flex items-center">
          <TickerCopy />
        </span>
      ))}
    </span>
  );
}

export const Footer = ({ className }: { className?: string }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn('bg-[#f9f9f5] text-[#070707]', className)}>
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
          <Link href="/">
            <Image
              src="/YLFText.png"
              alt="Your Love Films"
              width={300}
              height={60}
              className="h-10 md:h-14 w-auto object-contain mb-2"
            />
          </Link>
          <p className="text-[#070707]/60 text-sm mb-4">Capturing love stories nationwide</p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-[#070707]/60 hover:text-[#070707] transition-colors"
          >
            <IconBrandInstagram size={24} />
          </a>
        </div>

        <div className="text-center md:text-left">
          <h4 className="text-lg font-serif text-[#070707] mb-4">Visit</h4>
          <nav className="flex flex-col gap-2 text-sm text-[#070707]/70">
            <Link href="/" className="hover:text-[#070707]">
              Home
            </Link>
            <Link href="/portfolio" className="hover:text-[#070707]">
              Portfolio
            </Link>
            <Link href="/experience" className="hover:text-[#070707]">
              Experience
            </Link>
            <Link href="/about" className="hover:text-[#070707]">
              About
            </Link>
          </nav>
          <p className="text-[#070707]/60 mt-6">
            Email:{' '}
            <a href="mailto:hi@yourlovefilms.com" className="hover:text-[#070707] underline underline-offset-2">
              hi@yourlovefilms.com
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-[#070707]/15 py-4 md:py-5 overflow-hidden">
        <div
          className="ylf-ticker flex w-max items-center text-[12px] md:text-[15px] uppercase tracking-[0.1em] text-[#070707]"
          style={{ fontFamily: 'var(--font-engraved)' }}
        >
          <TickerTrack />
          <TickerTrack hidden />
        </div>
      </div>

      <div className="py-6 text-center text-sm text-[#070707]/50">
        <p>&copy; {currentYear} Your Love Films. All rights reserved.</p>
      </div>
    </footer>
  );
};
