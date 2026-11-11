'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { ChevronDown, Instagram } from 'lucide-react';
import { CalendlyEmbed } from '@/components/ui/calendly-embed';
import { ShowitCanvas } from '@/components/blocks/showit-canvas';
import { CALENDLY_INLINE_URL } from '@/lib/calendly';
import { PORTFOLIO_BLOCKS } from '@/lib/portfolio-canvas';
import type { CanvasBlock } from '@/lib/showit-canvas';
import {
  BRIDES_ON_A_MISSION_QUOTE,
  BRIDES_ON_A_MISSION_URL,
} from '@/lib/press';
import {
  INSTAGRAM_FOLLOWERS_LABEL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_POSTS_LABEL,
  LEGAL_ENTITY,
} from '@/lib/social';

const MEDIA_SLUGS = new Set([
  'highlights',
  'films',
  'featured-1',
  'films-more',
  'featured-3',
  'featured-6',
  'featured-4',
  'featured-5',
]);

const COUPLE_NOTES = [
  {
    names: 'Sarah & Marco',
    quote:
      "We almost skipped photos and video to save money. So glad we didn't. They got our first look, my dad's speech, and our niece doing the cha cha slide. We watch the film all the time, and the photographs are the ones on our wall.",
  },
  {
    names: 'Lauren & Chris',
    quote:
      "The highlight film felt like something we'd watch in a theater, and the photographs have the same feeling. They kept the real stuff: the flower girl taking off mid-aisle, Chris tearing up during vows, my brother giving a toast that made zero sense.",
  },
  {
    names: 'Nicole & Jake',
    quote:
      "I'll be honest. I thought wedding video and a big photo team would feel cheesy. It didn't. Jake hates being on camera and said he barely noticed them. The film got us crying, and the portraits still feel like us.",
  },
  {
    names: 'Priya & James',
    quote:
      "We had two ceremonies and I was worried a team wouldn't know how to handle both. They asked thoughtful questions ahead of time, and the film and the photographs gave equal weight to both sides of our families.",
  },
  {
    names: 'Emma & Ryan',
    quote:
      "Our wedding was in Scottsdale and half our family flew in. The team stayed calm when the timeline ran late, got the film of my grandma on the dance floor, and the portraits from that night are the ones she asks to see.",
  },
  {
    names: 'Chloe & David',
    quote:
      "What sold us was how natural the photographs felt, no awkward posing, no hovering, and the film has the audio from our vows. We'll keep both forever.",
  },
  {
    names: 'Hannah & Matt',
    quote:
      "Our parents still text us clips from the first dance and the photograph of it. You can hear our niece whisper 'they're crying' in the film. Still makes us laugh every time.",
  },
] as const;

/** Last calendar day of the current month in Central Time, so the date stays in sync for every visitor. */
function endOfThisMonth() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: 'numeric',
  }).formatToParts(new Date());
  const year = Number(parts.find((part) => part.type === 'year')?.value);
  const month = Number(parts.find((part) => part.type === 'month')?.value);
  const lastDay = new Date(Date.UTC(year, month, 0));
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(lastDay);
}

function buildQuestions() {
  return [
    {
      q: 'Are you local to us?',
      a: "Yes. If this ad reached you, it's because we have a team in your area. Every major love state.",
    },
    {
      q: 'What is included for $3500?',
      a: '10 hours of video, 10 hours of photography, and 10 hours of content creation. It is a full day, so a quick call is the best way to walk through the nitty gritty.',
    },
    {
      q: 'What does it take to hold our date?',
      a: 'A $100 deposit secures your date.',
    },
    {
      q: 'When does the $3,500 deal expire?',
      a: endOfThisMonth(),
    },
  ];
}

function isPortfolioMedia(slug: string) {
  return MEDIA_SLUGS.has(slug) || /^films-\d+$/.test(slug);
}

function withoutLinks(blocks: CanvasBlock[]): CanvasBlock[] {
  return blocks.map((block) => ({
    ...block,
    els: block.els.map((el) => ({
      ...el,
      href: undefined,
      button: el.button ? { ...el.button, href: undefined } : undefined,
    })),
  }));
}

function PortfolioMedia() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [folds, setFolds] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const blocks = useMemo(
    () => withoutLinks(PORTFOLIO_BLOCKS.filter((block) => isPortfolioMedia(block.slug))),
    [],
  );

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const update = () => {
      setHasMore(frame.scrollHeight > frame.clientHeight + 32);
    };

    update();
    const observer = new ResizeObserver(update);
    const watch = () => {
      observer.observe(frame);
      frame.querySelectorAll('section').forEach((section) => observer.observe(section));
    };
    watch();
    const mutations = new MutationObserver(() => {
      watch();
      update();
    });
    mutations.observe(frame, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [folds]);

  return (
    <div
      className="relative bg-[#f9f9f5]"
      onClick={(event) => {
        const link = (event.target as HTMLElement).closest('a');
        if (link) event.preventDefault();
      }}
    >
      <div
        ref={frameRef}
        className="overflow-hidden"
        style={{ maxHeight: `calc(${folds} * 100svh)` }}
      >
        <ShowitCanvas blocks={blocks} />
      </div>
      {hasMore && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-[#faf9f7] from-40% to-transparent px-4 pb-3 pt-16">
          <button
            type="button"
            onClick={() => setFolds((count) => count + 1)}
            className="pointer-events-auto rounded-full border border-[#E8DED2] bg-white px-5 py-2.5 text-sm font-sans font-medium text-neutral-900 shadow-sm"
          >
            Reveal more portfolio
          </button>
        </div>
      )}
    </div>
  );
}

function Fold({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="group border-b border-[#E8DED2] bg-[#faf9f7]">
      <summary className="mx-auto flex max-w-3xl cursor-pointer list-none items-center justify-between px-4 py-4 font-serif text-xl text-neutral-900 [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="h-5 w-5 shrink-0 text-[#8b8370] transition-transform group-open:rotate-180" />
      </summary>
      {children}
    </details>
  );
}

export function CalendlyLanding() {
  const questions = buildQuestions();
  return (
    <div className="min-h-screen bg-[#faf9f7] text-neutral-800">
      <section id="booking" className="scroll-mt-4 bg-[#faf9f7] px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-[1.35rem] leading-snug text-neutral-900 sm:text-3xl">
            <span className="block">10 hours of photo, video, and content creation</span>
            <span className="mt-1 block whitespace-nowrap text-[clamp(1.05rem,4.8vw,1.85rem)]">
              for $3500 ($100 deposit)
            </span>
            <span className="mt-2 block font-sans text-sm font-normal text-neutral-600 sm:text-base">
              book a call below
            </span>
          </h1>
        </div>
        <div className="mx-auto mt-3 max-w-3xl overflow-hidden bg-white">
          <CalendlyEmbed url={CALENDLY_INLINE_URL} minHeight={640} />
        </div>
      </section>

      <section className="bg-[#faf9f7] px-4 pb-8 pt-6 text-center">
        <h2 className="font-serif text-2xl tracking-[0.08em] text-neutral-900 md:text-3xl">
          WHO ARE WE?
        </h2>
        <p className="mt-3 inline-flex items-center justify-center gap-1.5 text-[clamp(12px,3.2vw,14px)] font-sans leading-none whitespace-nowrap text-neutral-800">
          <Instagram className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="font-medium">{INSTAGRAM_FOLLOWERS_LABEL} followers</span>
          <span className="text-[#8b8370]" aria-hidden>
            ·
          </span>
          <span>{INSTAGRAM_POSTS_LABEL} posts</span>
          <span className="text-[#8b8370]" aria-hidden>
            ·
          </span>
          <span>@{INSTAGRAM_HANDLE}</span>
        </p>
        <Image
          src="/instagram-theloveteam.jpg"
          alt="The Love Team on Instagram, with 214K followers"
          width={472}
          height={1024}
          className="mx-auto mt-5 w-full max-w-[280px] rounded-2xl border border-[#E8DED2]"
        />
      </section>

      <Fold title="View portfolio">
        <PortfolioMedia />
      </Fold>

      <Fold title="Questions before you book">
        <div className="mx-auto max-w-3xl space-y-6 px-4 pb-6">
          {questions.map((item) => (
            <div key={item.q}>
              <h2 className="font-serif text-lg text-neutral-900">{item.q}</h2>
              <p className="mt-1 font-sans text-sm leading-relaxed text-neutral-700 md:text-base">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </Fold>

      <Fold title="What couples say about us">
        <div className="mx-auto max-w-3xl px-4 pb-8">
          <p className="mb-8 text-center font-sans text-base text-neutral-600 md:text-lg">
            Films and photographs from real weddings, with free travel ✈️
          </p>
          <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
            {COUPLE_NOTES.map((item) => (
              <blockquote
                key={item.names}
                className="rounded-2xl border border-[#E8DED2] bg-white p-5 shadow-sm md:p-6"
              >
                <p className="mb-4 font-serif text-sm leading-relaxed text-neutral-800 md:text-base">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="font-sans text-sm font-semibold text-[#8b8370]">
                  {item.names}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </Fold>

      <main className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <a
          href={BRIDES_ON_A_MISSION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group mb-10 flex flex-col rounded-2xl border border-[#E8DED2] bg-white p-5 shadow-sm hover:border-[#8b8370]/40 hover:bg-[#faf9f7] md:p-6"
        >
          <p className="mb-3 font-sans text-xs uppercase tracking-[0.2em] text-[#8b8370]">
            As Featured In
          </p>
          <p className="mb-2 font-serif text-xl text-neutral-900 group-hover:text-[#8b8370] md:text-2xl">
            Brides on a Mission
          </p>
          <p className="font-serif text-sm leading-relaxed text-neutral-600 md:text-base">
            &ldquo;{BRIDES_ON_A_MISSION_QUOTE}&rdquo;
          </p>
          <span className="mt-4 inline-block font-sans text-sm font-medium text-neutral-800 underline decoration-[#E8DED2] underline-offset-4 group-hover:decoration-[#8b8370]">
            Read the feature
          </span>
        </a>

        <section>
          <h2 className="mb-4 text-center font-serif text-2xl text-neutral-900 md:text-3xl">
            Book a call
          </h2>
          <div className="overflow-hidden bg-white">
            <CalendlyEmbed url={CALENDLY_INLINE_URL} minHeight={640} />
          </div>
        </section>

        <p className="mt-10 text-center font-sans text-xs leading-relaxed text-neutral-500 md:text-sm">
          © {new Date().getFullYear()} {LEGAL_ENTITY} (The Love Team). All rights reserved.
          <br />
          hi@yourlovefilms.com
        </p>
      </main>
    </div>
  );
}
