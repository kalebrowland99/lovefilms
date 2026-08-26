'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FONT_VAR } from '@/components/blocks/showit-canvas';
import { CALENDLY_BOOKING_URL } from '@/lib/calendly';

/** Height of the fixed nav bar, per breakpoint. */
export const CANVAS_HEADER_HEIGHT = { mobile: 54, desktop: 103 };

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Experience', href: '/experience' },
];

/** Scrolls to the booking section, or opens Calendly on pages without one. */
function scrollToBooking(e: React.MouseEvent) {
  e.preventDefault();
  const target = document.getElementById('booking');
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  else window.open(CALENDLY_BOOKING_URL, '_blank', 'noopener,noreferrer');
}

export function CanvasHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-[54px] md:h-[103px] bg-[#070707] border-b border-white/10">
        <nav
          className="relative mx-auto flex h-full max-w-[1200px] items-center px-6 md:px-[46px]"
          style={{ fontFamily: FONT_VAR.sans }}
        >
          <div className="hidden md:flex items-center gap-[30px] text-[14px] text-white/90">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/portfolio" className="hover:text-white transition-colors">
              Portfolio
            </Link>
          </div>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2" aria-label="Your Love Films">
            <Image
              src="/YLFText.png"
              alt="Your Love Films"
              width={500}
              height={200}
              priority
              // The wordmark ships as black strokes on transparency.
              className="h-8 md:h-[60px] w-auto object-contain [filter:brightness(0)_invert(1)]"
            />
          </Link>

          <div className="ml-auto hidden md:flex items-end gap-[30px] text-[14px] text-white/90">
            <Link href="/experience" className="hover:text-white transition-colors">
              Experience
            </Link>
            <a
              href="#booking"
              onClick={scrollToBooking}
              className="border-b border-white/40 pb-[3px] text-[17px] italic leading-none text-white hover:border-white transition-colors"
              style={{ fontFamily: FONT_VAR.display }}
            >
              Book a Call
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="ml-auto flex flex-col gap-[5px] md:hidden"
          >
            <span className="block h-px w-6 bg-white" />
            <span className="block h-px w-6 bg-white" />
            <span className="block h-px w-6 bg-white" />
          </button>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#070707] px-8 py-6 md:hidden">
          <div className="flex items-center justify-between">
            <Image
              src="/YLFText.png"
              alt="Your Love Films"
              width={500}
              height={200}
              className="h-8 w-auto object-contain [filter:brightness(0)_invert(1)]"
            />
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="relative h-6 w-6">
              <span className="absolute left-0 top-1/2 block h-px w-6 rotate-45 bg-white" />
              <span className="absolute left-0 top-1/2 block h-px w-6 -rotate-45 bg-white" />
            </button>
          </div>

          <ul className="mt-16 flex flex-col gap-8">
            {LINKS.map((link, i) => (
              <li key={link.href} className="flex items-baseline gap-5">
                <span
                  className="text-[12px] uppercase tracking-[0.15em] text-white/50"
                  style={{ fontFamily: FONT_VAR.engraved }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  {...(link.href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="text-[38px] leading-none text-white"
                  style={{ fontFamily: FONT_VAR.display }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <a
            href="#booking"
            onClick={(e) => {
              setMenuOpen(false);
              scrollToBooking(e);
            }}
            className="mt-14 inline-block border-b border-white/40 pb-1 text-[24px] italic leading-none text-white"
            style={{ fontFamily: FONT_VAR.display }}
          >
            Book a Call
          </a>

          <a
            href="https://instagram.com/yourlovefilms"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-10 left-8 text-[12px] uppercase tracking-[0.15em] text-white/60"
            style={{ fontFamily: FONT_VAR.engraved }}
          >
            Instagram /
          </a>
        </div>
      )}
    </>
  );
}
