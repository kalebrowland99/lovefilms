'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Promotional Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#8b8370] text-white py-3 px-3 text-center text-[11px] leading-snug md:text-sm md:py-2">
        <div className="max-w-7xl mx-auto">
          <span className="font-sans font-normal">
            Destination Wedding Team. 1/3 Of 2026 Dates Have Been Booked. So{' '}
            <a
              href="#booking"
              className="underline font-medium hover:text-neutral-200 transition-colors whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              Reach Out Now
            </a>
          </span>
        </div>
      </div>

      <header className="fixed top-[52px] md:top-9 left-0 right-0 z-50 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/YLFText.png" 
                alt="Your Love Films" 
                width={400}
                height={80}
                className="h-10 md:h-16 w-auto object-contain dark:invert"
              />
            </Link>
            <div className="hidden md:block h-8 w-px bg-neutral-200 dark:bg-neutral-700" />
            <span className="hidden md:block text-sm text-neutral-600 dark:text-neutral-400">
              Capturing Your Story
            </span>
          </div>

          {/* CTA Button and Mobile Menu */}
          <div className="flex items-center gap-4">
            <a
              href="#booking"
              className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 dark:text-black text-white rounded-full font-medium text-sm hover:shadow-lg transition-all"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              Book Consultation ✨
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 py-4">
            <nav className="flex flex-col gap-4">
              <a
                href="#booking"
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 dark:text-black text-white rounded-full font-medium text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Book Consultation ✨
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
    </>
  );
}
