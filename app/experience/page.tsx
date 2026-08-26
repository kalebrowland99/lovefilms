import type { Metadata } from 'next';
import Link from 'next/link';
import { CanvasHeader } from '@/components/ui/canvas-header';
import { Footer } from '@/components/ui/footer';
import { BookingSection } from '@/components/blocks/booking-section';
import { LetsTravel } from '@/components/blocks/lets-travel';
import { LOVE_STATES } from '@/lib/service-areas';

export const metadata: Metadata = {
  title: 'The Experience | Your Love Films',
  description:
    'What it is like to work with Your Love Films — cinematic wedding videography and photography for couples nationwide, from the first call through delivery.',
};

const STEPS = [
  {
    n: '01',
    title: 'A conversation, not a pitch',
    body: 'We start with a short call. You tell us the shape of the day — city hall, a mountain meadow, a ballroom, two ceremonies, a weekend with family from everywhere. We tell you honestly whether we are the right team, what we would film and photograph, and how we travel to you.',
  },
  {
    n: '02',
    title: 'Planning that actually stays with you',
    body: 'Once you are booked, we stay in the details: timeline, lighting, family dynamics, the moments you do not want missed. You get one team for film and photographs, so coverage is coordinated instead of two vendors competing for the same aisle.',
  },
  {
    n: '03',
    title: 'Presence on the day',
    body: 'We move quietly, give direction when you want it, and disappear when you do not. The films keep the messy, honest minutes. The photographs hold still the ones you will want on the wall. Same story, two ways of keeping it.',
  },
  {
    n: '04',
    title: 'Work you can live with',
    body: 'Highlight films, full-day films, and a gallery of photographs — delivered with revisions included. We are not a local-only studio with a travel upcharge as an afterthought. Nationwide is the work.',
  },
];

export default function ExperiencePage() {
  return (
    <>
      <CanvasHeader />
      <div className="h-[54px] md:h-[103px] bg-[#070707]" />

      <main className="bg-[#f9f9f5] text-[#070707]">
        <section className="px-4 md:px-8 lg:px-10 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[11px] md:text-sm font-medium uppercase tracking-[0.25em] text-[#070707]/60">
              the experience
            </p>
            <h1 className="mt-5 font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-[#070707]">
              Wedding films{' '}
              <em className="italic font-normal">and</em> photography, nationwide
            </h1>
            <p className="mt-8 mx-auto max-w-2xl text-lg md:text-xl leading-relaxed text-[#070707]/75">
              We are a film and photo team for couples who get married wherever
              love actually happens — not a Nashville studio that occasionally
              travels. From the first call to the gallery, the work is built
              around presence, not performance.
            </p>
          </div>
        </section>

        <section className="px-4 md:px-8 lg:px-10 pb-16 md:pb-24">
          <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-6 md:gap-8">
            <article className="border border-[#070707]/15 bg-white/40 p-8 md:p-12">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#070707]/50">
                01 — film
              </p>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl leading-tight">
                Cinematic wedding films
              </h2>
              <p className="mt-5 text-base md:text-lg leading-relaxed text-[#070707]/75">
                Highlight films that feel like a real movie, and longer cuts
                that keep the speeches, the cha-cha slide, the two families in
                one room. We shoot for story first — the unstaged minutes as
                much as the posed ones.
              </p>
            </article>
            <article className="border border-[#070707]/15 bg-white/40 p-8 md:p-12">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#070707]/50">
                02 — photographs
              </p>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl leading-tight">
                Wedding photography
              </h2>
              <p className="mt-5 text-base md:text-lg leading-relaxed text-[#070707]/75">
                Stills built around soft light, movement, and the quiet details
                of the day. Same team as the film, so portraits, family
                formals, and candid coverage sit inside one timeline instead of
                two overlapping ones.
              </p>
            </article>
          </div>
        </section>

        <section className="px-4 md:px-8 lg:px-10 pb-20 md:pb-28">
          <div className="mx-auto max-w-4xl">
            <p className="text-[11px] md:text-sm font-medium uppercase tracking-[0.25em] text-[#070707]/60 text-center">
              how we work
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl text-center leading-tight">
              From the first call to the last frame
            </h2>
            <ol className="mt-14 space-y-12 md:space-y-16">
              {STEPS.map((step) => (
                <li key={step.n} className="grid md:grid-cols-[88px_1fr] gap-4 md:gap-10 items-start">
                  <span className="text-[13px] uppercase tracking-[0.18em] text-[#070707]/45 pt-1">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-serif text-2xl md:text-3xl leading-tight">{step.title}</h3>
                    <p className="mt-3 text-base md:text-lg leading-relaxed text-[#070707]/75">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-4 md:px-8 lg:px-10 pb-16 md:pb-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[11px] md:text-sm font-medium uppercase tracking-[0.25em] text-[#070707]/60">
              where we shoot
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl leading-tight">
              Nationwide — and a little beyond
            </h2>
            <p className="mt-6 mx-auto max-w-2xl text-base md:text-lg leading-relaxed text-[#070707]/75">
              We photograph and film weddings, elopements, and couple sessions
              across the country. If your celebration is somewhere we have not
              listed, ask. Destination work is part of the practice, not an
              exception.
            </p>
            <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm md:text-base uppercase tracking-[0.12em] text-[#070707]/70">
              {LOVE_STATES.map((state) => (
                <li key={state}>{state}</li>
              ))}
              <li>and beyond</li>
            </ul>
            <Link
              href="/portfolio"
              className="mt-10 inline-block text-sm md:text-base underline underline-offset-4 decoration-[#070707]/30 hover:decoration-[#070707]"
            >
              See the work
            </Link>
          </div>
        </section>

        <LetsTravel />

        <BookingSection
          id="booking"
          layout="button"
          buttonLabel="Book a Call"
          title="Ready to talk through your day?"
          description="Pick a time that works. We take on a limited number of weddings each year — dates book on a first-come basis, wherever you are getting married."
        />
      </main>

      <Footer />
    </>
  );
}
