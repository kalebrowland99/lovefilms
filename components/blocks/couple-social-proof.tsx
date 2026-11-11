'use client';

import {
  BRIDES_ON_A_MISSION_QUOTE,
  BRIDES_ON_A_MISSION_URL,
} from '@/lib/press';
import { COUPLE_TESTIMONIALS } from '@/lib/testimonials';
import { ViralInstagramCard } from '@/components/blocks/viral-instagram-card';

export function CoupleSocialProof() {
  return (
    <section className="mb-10 md:mb-12">
      <h2 className="text-center text-2xl md:text-3xl font-serif text-neutral-900 mb-2">
        What Couples Say About Us
      </h2>
      <p className="text-center text-base md:text-lg font-sans text-neutral-600 mb-8">
        Real words from couples we&apos;ve filmed — with free travel ✈️
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
  );
}
