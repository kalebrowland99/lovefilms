import Image from 'next/image';
import { CanvasHeader } from '@/components/ui/canvas-header';
import { Footer } from '@/components/ui/footer';
import { YoutubePreview } from '@/components/ui/youtube-preview';
import { BonusCountdown } from '@/components/ui/countdown';
import { DriveFilm } from '@/components/ui/drive-film';
import {
  GOOGLE_REVIEWS_URL,
  GOOGLE_REVIEW_QUOTE,
  type LeadNotes,
} from '@/lib/notes';

const VINTAGE_EDIT_VIDEO_ID = '-OStKmgf3HM';

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] md:text-sm font-medium uppercase tracking-[0.25em] text-[#070707]/60">
      {children}
    </p>
  );
}

function PhotoStrip({ photos, cols }: { photos: string[]; cols: 2 | 3 }) {
  if (photos.length === 0) return null;
  return (
    <div
      className={`mt-4 grid gap-3 ${cols === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}
    >
      {photos.map((src) => (
        <div
          key={src}
          className="relative aspect-[3/2] overflow-hidden bg-[#070707]/5"
        >
          <Image
            src={src}
            alt="Wedding photography by The Love Team"
            fill
            sizes="(max-width: 768px) 33vw, 300px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export function LeadNotesPage({ notes }: { notes: LeadNotes }) {
  const hasReception = notes.dayFacts.some((f) => f.label === 'Reception');

  return (
    <>
      <CanvasHeader />
      <div className="h-[54px] md:h-[103px] bg-[#070707]" />

      <main className="bg-[#f9f9f5] text-[#070707]">
        {/* Hero */}
        <section className="px-4 md:px-8 lg:px-10 pt-16 pb-10 md:pt-24 md:pb-14">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow>Your call notes · with {notes.hostFirstName} · {notes.callDateLabel}</Eyebrow>
            <h1 className="mt-5 font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05]">
              {notes.coupleTitle}
            </h1>
            <p className="mt-8 mx-auto max-w-2xl text-lg md:text-xl leading-relaxed text-[#070707]/75">
              {notes.heroLine}
            </p>
          </div>
        </section>

        {/* Your day + your package */}
        <section className="px-4 md:px-8 lg:px-10 pb-16 md:pb-20">
          <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-6 md:gap-8">
            <article className="border border-[#070707]/15 bg-white/40 p-8 md:p-12">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#070707]/50">
                01 · your day
              </p>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl leading-tight">
                What we talked through
              </h2>
              <dl className="mt-6 space-y-4">
                {notes.dayFacts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-[11px] uppercase tracking-[0.2em] text-[#070707]/50">
                      {f.label}
                    </dt>
                    <dd className="mt-1 text-base md:text-lg leading-relaxed text-[#070707]/85">
                      {f.value}
                    </dd>
                    {((f.label === 'Reception' && hasReception) ||
                      (f.label === 'Ceremony' && !hasReception)) && (
                      <PhotoStrip photos={notes.dayPhotos} cols={2} />
                    )}
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-sm tracking-wide text-[#070707]/50">
                {notes.photoCredit}
              </p>
              {notes.inspoMention && (
                <div className="mt-8 border-t border-[#070707]/10 pt-6">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#070707]/50">
                    Potential inspo?
                  </p>
                  <p className="mt-2 text-base md:text-lg leading-relaxed text-[#070707]/85">
                    You mentioned on the call: {notes.inspoMention}.
                  </p>
                  {notes.inspoYoutubeId && (
                    <div className="mt-5">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-[#070707]/50">
                        Film
                      </p>
                      <div className="mt-3">
                        <YoutubePreview
                          videoId={notes.inspoYoutubeId}
                          title="Wedding film inspiration — Super 8"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </article>
            <article className="border border-[#070707]/15 bg-white/40 p-8 md:p-12">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#070707]/50">
                02 · your package
              </p>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl leading-tight">
                {notes.packageName}
              </h2>
              <p className="mt-5 text-base md:text-lg leading-relaxed text-[#070707]/75">
                {notes.packageIntro}
              </p>
              <ul className="mt-6 space-y-3">
                {notes.packageFacts.map((fact) => (
                  <li
                    key={fact}
                    className="text-base md:text-lg leading-relaxed text-[#070707]/85"
                  >
                    {fact}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        {/* Bonuses + countdown + vintage video */}
        <section className="px-4 md:px-8 lg:px-10 pb-16 md:pb-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-3xl md:text-5xl leading-tight">
              Your 48-hour bonuses
            </h2>
            <BonusCountdown
              deadlineISO={notes.bonusDeadlineISO}
              hostFirstName={notes.hostFirstName}
            />
            <p className="mt-8 mx-auto max-w-2xl text-base md:text-lg leading-relaxed text-[#070707]/80">
              {notes.bonuses
                .map((b, i) =>
                  i === 0 ? b : b.charAt(0).toLowerCase() + b.slice(1),
                )
                .join(', ')
                .replace(/, ([^,]*)$/, ', and $1')}
              .
            </p>
          </div>
          <div className="mx-auto max-w-4xl mt-12">
            <YoutubePreview
              videoId={VINTAGE_EDIT_VIDEO_ID}
              title="Super 8 vintage film preview — The Love Team"
            />
          </div>
        </section>

        {/* Fixed Q&A */}
        <section className="px-4 md:px-8 lg:px-10 pb-16 md:pb-20">
          <div className="mx-auto max-w-4xl">
            <article className="border border-[#070707]/15 bg-white/40 p-8 md:p-12">
              <h3 className="font-serif text-2xl md:text-3xl leading-snug text-center">
                Can we see our photographer and videographer before the wedding?
              </h3>
              <p className="mt-6 text-base md:text-lg leading-relaxed text-[#070707]/80">
                Yes! We&rsquo;ll all hop on a call with your photographer and
                videographer so you can meet them properly once the deposit is
                made!
              </p>
              <p className="mt-5 text-base md:text-lg leading-relaxed text-[#070707]/80">
                Our goal is to be your{' '}
                <em className="italic">personal friend</em> through all of
                this, the people you can actually text, who know your names,
                your people, and what matters to you on the day. That&rsquo;s
                how booking your wedding team should feel. We&rsquo;re super
                flexible, and we&rsquo;ll always find a way to meet your
                needs.
              </p>
            </article>
            <article className="mt-6 md:mt-8 border border-[#070707]/15 bg-white/40 p-8 md:p-12">
              <h3 className="font-serif text-2xl md:text-3xl leading-snug text-center">
                Can we split our payments up to 24 months?
              </h3>
              <p className="mt-6 text-base md:text-lg leading-relaxed text-[#070707]/80">
                Yes! When you check out with your payment link, Klarna and
                Afterpay are both options, so you can split your package into
                smaller payments instead of paying it all at once. Pay in 4
                is interest free, and longer plans are available too. The
                exact terms depend on what you qualify for, and you will see
                them at checkout before you confirm anything, no surprises.
              </p>
            </article>
          </div>
        </section>

        {/* Google reviews */}
        <section className="px-4 md:px-8 lg:px-10 pb-16 md:pb-20">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow>Google reviews</Eyebrow>
            <p className="mt-6 font-serif text-6xl md:text-7xl leading-none">5.0</p>
            <p className="mt-3 text-2xl tracking-[0.3em] text-[#070707]" aria-label="5 out of 5 stars">
              ★★★★★
            </p>
            <blockquote className="mt-8 mx-auto max-w-2xl font-serif text-2xl md:text-3xl leading-snug">
              &ldquo;{GOOGLE_REVIEW_QUOTE.text}&rdquo;
            </blockquote>
            <p className="mt-4 text-sm md:text-base tracking-wide text-[#070707]/50">
              {GOOGLE_REVIEW_QUOTE.name} · {GOOGLE_REVIEW_QUOTE.detail}
            </p>
            <p className="mt-8">
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 text-base md:text-lg"
              >
                Read our reviews on Google
              </a>
            </p>
          </div>
        </section>

        {/* Portfolios: films, each with photos spread underneath */}
        <section className="px-4 md:px-8 lg:px-10 pb-16 md:pb-20">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <Eyebrow>Portfolios</Eyebrow>
              <h2 className="mt-5 font-serif text-3xl md:text-5xl leading-tight">
                More work from your potential photographer and videographer near{' '}
                {notes.areaLabel}
              </h2>
              <p className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-[#070707]/75">
                Real weddings shot by the team we would match you with for
                your day.
              </p>
            </div>
            <div className="mt-12 space-y-14">
              {notes.films.map((film) => (
                <div key={film.driveId}>
                  <DriveFilm
                    driveId={film.driveId}
                    thumb={film.thumb}
                    title={`${film.couple} wedding film — The Love Team`}
                  />
                  <p className="mt-4 text-center font-serif text-2xl">{film.couple}</p>
                  <p className="mt-1 text-center text-sm md:text-base tracking-wide text-[#070707]/50">
                    {film.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Close */}
        <section className="px-4 md:px-8 lg:px-10 pb-20 md:pb-28">
          <div className="mx-auto max-w-4xl border border-[#070707]/15 bg-white/40 p-8 md:p-12 text-center">
            <h2 className="font-serif text-3xl md:text-4xl leading-tight">
              Ready to lock in your date?
            </h2>
            <p className="mt-5 mx-auto max-w-2xl text-base md:text-lg leading-relaxed text-[#070707]/75">
              The $100 deposit reserves {notes.weddingDateLabel} for you and
              holds your bonuses. Just reply to {notes.hostFirstName}&rsquo;s text
              and she will send your deposit link right over.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
