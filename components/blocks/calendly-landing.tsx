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
      'We were quoted more than this for photos alone. $3,500 covered photography, video, and the content clips for the whole day. We had planned to skip video to save money.',
  },
  {
    names: 'Nicole & Jake',
    quote:
      'Our budget meant we thought we had to pick photos or video. Getting both, plus the clips, for $3,500 was the one wedding cost that felt fair for what we actually got.',
  },
  {
    names: 'Priya & James',
    quote:
      'We had two ceremonies and other teams wanted a travel fee on top. This was $3,500 for the full day, and both families are in the photographs and the film.',
  },
  {
    names: 'Emma & Ryan',
    quote:
      'Once we added video, the other quotes landed well above $3,500. We still got the portraits, the film, and the content from the reception. It was the better value.',
  },
  {
    names: 'Chloe & David',
    quote:
      'The $100 deposit let us hold the date before the rest was saved. For the price, the photographs and the film were more than we expected from one package.',
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

function buildQuestions(area: string) {
  return [
    {
      q: `Do you have a team around ${area}?`,
      a: `If our ad targeted you, it's because we're local around ${area}, with teams in every major love state!`,
    },
    {
      q: 'Is travel free?',
      a: 'Yes. Travel is built into the $3,500, so there is no extra fee for the team to come to you.',
    },
    {
      q: 'What does it take to hold our date?',
      a: 'A $100 deposit secures your date.',
    },
    {
      q: 'Can we pay over time?',
      a: 'Yes. Through our partners Klarna and Afterpay, you can split the balance into payments over as long as 72 months.',
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
  startOpen = false,
  compact = false,
}: {
  title: string;
  children: ReactNode;
  startOpen?: boolean;
  compact?: boolean;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (startOpen && detailsRef.current) detailsRef.current.open = true;
  }, [startOpen]);

  return (
    <details ref={detailsRef} className="group border-b border-[#E8DED2] bg-[#faf9f7]">
      <summary
        className={`mx-auto flex max-w-3xl cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-left text-neutral-900 [&::-webkit-details-marker]:hidden ${
          compact ? 'font-sans text-[15px] font-medium leading-snug md:text-base' : 'font-serif text-xl'
        }`}
      >
        {title}
        <ChevronDown className="h-5 w-5 shrink-0 text-[#8b8370] transition-transform group-open:rotate-180" />
      </summary>
      {children}
    </details>
  );
}

function Word({
  children,
  index,
  className = '',
  hold = false,
}: {
  children: ReactNode;
  index: number;
  className?: string;
  hold?: boolean;
}) {
  return (
    <span
      className={`${hold ? 'ylf-word-later' : 'ylf-word'} inline-block ${className}`}
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {children}
    </span>
  );
}

function WhoWeAre() {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={`bg-[#faf9f7] px-4 pb-8 pt-6 text-center ${shown ? 'ylf-words-in' : ''}`}>
      <h2 className="font-serif text-2xl tracking-[0.08em] text-neutral-900 md:text-3xl">
        <Word index={0} hold>WHO</Word> <Word index={1} hold>ARE</Word> <Word index={2} hold>WE?</Word>
      </h2>
      <p className="mt-3 inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-sans text-[clamp(12px,3.2vw,14px)] leading-none text-neutral-800">
        <Instagram
          className="ylf-word-later h-3.5 w-3.5 shrink-0"
          style={{ animationDelay: '0.21s' }}
          aria-hidden
        />
        <Word index={4} hold className="font-medium">{INSTAGRAM_FOLLOWERS_LABEL}</Word>
        <Word index={5} hold className="font-medium">followers</Word>
        <Word index={6} hold className="text-[#8b8370]">·</Word>
        <Word index={7} hold>{INSTAGRAM_POSTS_LABEL}</Word>
        <Word index={8} hold>posts</Word>
        <Word index={9} hold className="text-[#8b8370]">·</Word>
        <Word index={10} hold>@{INSTAGRAM_HANDLE}</Word>
      </p>
      <p className="mt-2 whitespace-nowrap font-sans text-[clamp(12px,3.2vw,14px)] leading-none text-neutral-800">
        <Word index={11} hold>10+</Word> <Word index={12} hold>years</Word> <Word index={13} hold>of</Word>{' '}
        <Word index={14} hold>experience,</Word> <Word index={15} hold>team</Word> <Word index={16} hold>of</Word>{' '}
        <Word index={17} hold>7</Word> <Word index={18} hold>people.</Word>
      </p>
      <Image
        src="/instagram-theloveteam.jpg"
        alt="The Love Team on Instagram, with 214K followers"
        width={472}
        height={1024}
        className="mx-auto mt-5 w-full max-w-[280px] rounded-2xl border border-[#E8DED2]"
      />
    </section>
  );
}

export function CalendlyLanding({ area }: { area: string }) {
  const questions = buildQuestions(area);
  return (
    <div className="min-h-screen bg-[#faf9f7] text-neutral-800">
      <section id="booking" className="scroll-mt-4 bg-[#faf9f7] px-5 pb-2 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-[#8b8370]">
            <Word index={0}>Limited</Word> <Word index={1}>Time</Word>
          </p>
          <h1 className="mt-3 font-serif text-[1.7rem] font-normal leading-[1.12] tracking-[-0.015em] text-neutral-950 sm:text-[2.35rem] sm:leading-[1.08]">
            <Word index={2}>10</Word> <Word index={3}>hours</Word> <Word index={4}>of</Word>{' '}
            <Word index={5}>photo,</Word> <Word index={6}>video,</Word>{' '}
            <Word index={7} className="italic">and</Word> <Word index={8} className="italic">content</Word>{' '}
            <Word index={9} className="italic">creation</Word>
          </h1>
          <div className="mx-auto mt-4 h-px w-8 bg-[#c4b8a4]" aria-hidden />
          <p className="mt-3 whitespace-nowrap font-serif text-[clamp(1.2rem,5.4vw,1.85rem)] leading-none tracking-tight text-neutral-950">
            <Word index={10}>for</Word> <Word index={11}>$3,500</Word>{' '}
            <Word index={12} className="align-middle font-sans text-[0.62em] font-normal tracking-normal text-neutral-500">
              ($100 deposit)
            </Word>
          </p>
          <p className="mt-3 font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
            <Word index={13}>Book</Word> <Word index={14}>a</Word> <Word index={15}>call</Word>{' '}
            <Word index={16}>below</Word>
          </p>
        </div>
        <div className="mx-auto mt-4 max-w-3xl overflow-hidden bg-white">
          <CalendlyEmbed url={CALENDLY_INLINE_URL} minHeight={640} />
        </div>
      </section>

      <Fold title="What's included in the $3500 package?" compact startOpen>
        <div className="mx-auto max-w-3xl px-4 pb-6">
          <Image
            src="/halo-signature-package.png"
            alt="$3500 HALO Signature package. $100 to reserve the date. Photography, videography, and content creation coverage, plus bonuses if booked within 48 hours."
            width={1024}
            height={855}
            className="h-auto w-full rounded-2xl border border-[#E8DED2] bg-white"
          />
        </div>
      </Fold>

      <WhoWeAre />

      <Fold title="View portfolio" startOpen>
        <PortfolioMedia />
      </Fold>

      <section>
        <h2 className="mx-auto max-w-3xl px-4 pb-1 pt-8 text-center font-serif text-2xl text-neutral-900 md:pt-10 md:text-3xl">
          Questions before you book
        </h2>
        {questions.map((item) => (
          <Fold key={item.q} title={item.q} compact>
            <p className="mx-auto max-w-3xl px-4 pb-5 font-sans text-sm leading-relaxed text-neutral-700 md:text-base">
              {item.a}
            </p>
          </Fold>
        ))}
      </section>

      <Fold title="What couples say about us" compact>
        <div className="mx-auto max-w-3xl px-4 pb-8">
          <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
            {COUPLE_NOTES.map((item) => (
              <blockquote
                key={item.names}
                className="rounded-2xl border border-[#E8DED2] bg-white p-5 shadow-sm md:p-6"
              >
                <p className="mb-4 font-sans text-sm leading-relaxed text-neutral-800 md:text-base">
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
