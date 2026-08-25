'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { CALENDLY_BOOKING_URL } from '@/lib/calendly';
import {
  BRIDES_ON_A_MISSION_QUOTE,
  BRIDES_ON_A_MISSION_URL,
} from '@/lib/press';
import { COUPLE_TESTIMONIALS } from '@/lib/testimonials';
import { ViralInstagramCard } from '@/components/blocks/viral-instagram-card';
import { PreCallVideo } from '@/components/ui/pre-call-video';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function CallConfirmedContent() {
  useEffect(() => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Purchase', {
        content_name: 'Love Films Quick Call Booked',
        content_category: 'Calendly',
        value: 0,
        currency: 'USD',
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f7] text-neutral-800">
      <div className="border-b border-[#E8DED2] bg-white">
        <div className="max-w-3xl mx-auto px-4 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Image
            src="/YLFText.png"
            alt="Your Love Films"
            width={280}
            height={56}
            className="h-9 md:h-11 w-auto object-contain"
            priority
          />
          <span className="inline-flex w-fit rounded-full border border-[#E8DED2] bg-[#d9d4c8]/50 px-4 py-1.5 text-xs md:text-sm font-sans text-[#5C5548] tracking-wide uppercase">
            Call confirmation
          </span>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        <header className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-[2.75rem] font-serif leading-tight text-neutral-900 mb-4">
            Congrats! Your Call Has Been Booked.
          </h1>
          <p className="text-base md:text-lg font-sans font-semibold text-red-600 leading-relaxed max-w-2xl mx-auto">
            IMPORTANT: Complete The 2 Steps Below Now. If You Don&apos;t,
            We&apos;ll Be Forced To Cancel Your Call And Give Your Slot To
            Someone Else.
          </p>
        </header>

        <hr className="border-t border-[#E8DED2] mb-10 md:mb-12" />

        <section className="mb-12 md:mb-14">
          <h2
            id="step-1"
            className="text-center text-2xl md:text-3xl font-serif text-neutral-900 mb-2"
          >
            <span className="text-[#8b8370]">Step 1:</span> Watch The Video Below
          </h2>
          <p className="text-center text-lg md:text-xl font-serif text-neutral-700 mb-6">
            What To Expect Before Your Wedding Shoot Consultation
          </p>

          <PreCallVideo />

          <p className="text-center text-xl md:text-2xl font-serif font-medium text-red-600 mt-6 md:mt-8 leading-snug max-w-2xl mx-auto">
            Make sure your fiancé is on the call with you.
          </p>
        </section>

        <section className="mb-12 md:mb-14">
          <h2
            id="step-2"
            className="text-center text-2xl md:text-3xl font-serif text-neutral-900 mb-6"
          >
            <span className="text-[#8b8370]">Step 2:</span> Confirm Your Call
          </h2>

          <div className="rounded-2xl border border-[#E8DED2] bg-white p-5 md:p-8 shadow-sm">
            <p className="text-center text-base md:text-lg font-sans text-neutral-700 leading-relaxed">
              Confirm your call by replying &ldquo;Yes&rdquo; to our text or
              email and selecting &ldquo;Yes&rdquo; in the email calendar
              invitation.
            </p>
            <p className="text-center text-base md:text-lg font-sans text-neutral-700 leading-relaxed mt-3">
              Check your spam folder if you don&apos;t see it. Click &ldquo;I
              know the sender&rdquo; and &ldquo;Yes&rdquo; for the invite.
            </p>
            <p className="text-center text-lg md:text-xl font-serif font-medium text-red-600 leading-relaxed mt-5">
              Both you and your fiancé should be on the call — we want to hear
              from both of you about your wedding day.
            </p>

            <div className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-2 mt-6 md:mt-8">
              <figure className="overflow-hidden rounded-xl border border-[#E8DED2] bg-[#faf9f7]">
                <Image
                  src="/calendly-report-not-spam.png"
                  alt='Step 1: Click "Report as not spam"'
                  width={640}
                  height={480}
                  className="block w-full h-auto"
                />
                <figcaption className="px-4 py-3 text-center font-sans font-semibold text-neutral-900 text-sm md:text-base">
                  Step 1: Click &ldquo;Report as not spam&rdquo;
                </figcaption>
              </figure>
              <figure className="overflow-hidden rounded-xl border border-[#E8DED2] bg-[#faf9f7]">
                <Image
                  src="/calendly-click-yes.png"
                  alt='Step 2: Then click "Yes"'
                  width={640}
                  height={480}
                  className="block w-full h-auto"
                />
                <figcaption className="px-4 py-3 text-center font-sans font-semibold text-neutral-900 text-sm md:text-base">
                  Step 2: Then click &ldquo;Yes&rdquo;
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="mb-10 md:mb-12">
          <h2 className="text-center text-2xl md:text-3xl font-serif text-neutral-900 mb-2">
            What Couples Say About Us
          </h2>
          <p className="text-center text-base md:text-lg font-sans text-neutral-600 mb-8">
            Real words from couples we&apos;ve filmed across the country
          </p>

          <div className="grid gap-4 md:gap-5 sm:grid-cols-2 mb-10 md:mb-12">
            {COUPLE_TESTIMONIALS.map((item) => (
              <blockquote
                key={item.names}
                className="rounded-2xl border border-[#E8DED2] bg-white p-5 md:p-6 shadow-sm"
              >
                <p className="font-serif text-neutral-800 text-sm md:text-base leading-relaxed mb-4">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="font-sans text-sm font-semibold text-[#8b8370]">
                  {item.names}
                </footer>
              </blockquote>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-2 md:items-start">
            <a
              href={BRIDES_ON_A_MISSION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border border-[#E8DED2] bg-white p-5 md:p-6 shadow-sm transition-colors hover:border-[#8b8370]/40 hover:bg-[#faf9f7]"
            >
              <p className="text-xs font-sans uppercase tracking-[0.2em] text-[#8b8370] mb-3">
                As Featured In
              </p>
              <p className="font-serif text-xl md:text-2xl text-neutral-900 mb-2 group-hover:text-[#8b8370] transition-colors">
                Brides on a Mission
              </p>
              <p className="font-serif text-sm md:text-base text-neutral-600 leading-relaxed">
                &ldquo;{BRIDES_ON_A_MISSION_QUOTE}&rdquo;
              </p>
              <span className="mt-4 inline-block text-sm font-sans font-medium text-neutral-800 underline underline-offset-4 decoration-[#E8DED2] group-hover:decoration-[#8b8370]">
                Read the feature
              </span>
            </a>

            <ViralInstagramCard />
          </div>
        </section>

        <p className="text-xs md:text-sm font-sans text-neutral-500 text-center leading-relaxed">
          © {new Date().getFullYear()} Your Love Films. All Rights Reserved.
          <br />
          Need to reschedule?{' '}
          <a
            href={CALENDLY_BOOKING_URL}
            className="text-neutral-800 underline underline-offset-2 hover:text-[#8b8370]"
          >
            Pick a new time here
          </a>
          {' · '}
          <a
            href="mailto:hi@yourlovefilms.com"
            className="text-neutral-800 underline underline-offset-2 hover:text-[#8b8370]"
          >
            hi@yourlovefilms.com
          </a>
        </p>
      </main>
    </div>
  );
}
