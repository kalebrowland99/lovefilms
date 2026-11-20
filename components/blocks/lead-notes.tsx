import Image from 'next/image';
import { CanvasHeader } from '@/components/ui/canvas-header';
import { Footer } from '@/components/ui/footer';
import { YoutubePreview } from '@/components/ui/youtube-preview';
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

export function LeadNotesPage({ notes }: { notes: LeadNotes }) {
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
                  </div>
                ))}
              </dl>
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

        {/* Bonuses + vintage video */}
        <section className="px-4 md:px-8 lg:px-10 pb-16 md:pb-20">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow>Your 48-hour bonuses</Eyebrow>
            <h2 className="mt-5 font-serif text-3xl md:text-5xl leading-tight">
              Book in the window, these are yours
            </h2>
            <ul className="mt-8 space-y-3">
              {notes.bonuses.map((b) => (
                <li
                  key={b}
                  className="text-lg md:text-xl leading-relaxed text-[#070707]/85"
                >
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-6 mx-auto max-w-2xl text-base md:text-lg leading-relaxed text-[#070707]/70">
              {notes.bonusNote}
            </p>
          </div>
          <div className="mx-auto max-w-4xl mt-12">
            <YoutubePreview
              videoId={VINTAGE_EDIT_VIDEO_ID}
              title="Super 8 vintage film preview — The Love Team"
            />
            <p className="mt-4 text-center text-sm md:text-base tracking-wide text-[#070707]/50">
              This is what the vintage bonus looks like, a Super 8 cut of your film, plus vintage style edits of your photos
            </p>
          </div>
        </section>

        {/* Q&A */}
        <section className="px-4 md:px-8 lg:px-10 pb-16 md:pb-20">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <Eyebrow>Good questions</Eyebrow>
              <h2 className="mt-5 font-serif text-3xl md:text-5xl leading-tight">
                Asked on calls like yours
              </h2>
            </div>
            <div className="mt-10 grid md:grid-cols-2 gap-6 md:gap-8">
              {notes.qa.map((item) => (
                <article
                  key={item.q}
                  className="border border-[#070707]/15 bg-white/40 p-8"
                >
                  <h3 className="font-serif text-2xl leading-snug">{item.q}</h3>
                  <p className="mt-4 text-base leading-relaxed text-[#070707]/75">
                    {item.a}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolios: films */}
        <section className="px-4 md:px-8 lg:px-10 pb-16 md:pb-20">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <Eyebrow>Portfolios</Eyebrow>
              <h2 className="mt-5 font-serif text-3xl md:text-5xl leading-tight">
                Your team&rsquo;s recent work
              </h2>
              <p className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-[#070707]/75">
                Real weddings filmed and photographed by the crew on your local
                team, the same people we would match you with for your day.
              </p>
            </div>
            <div className="mt-12 space-y-14">
              {notes.films.map((film) => (
                <div key={film.driveId}>
                  <div className="relative w-full aspect-video bg-[#070707]">
                    <iframe
                      src={`https://drive.google.com/file/d/${film.driveId}/preview`}
                      className="absolute inset-0 h-full w-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      title={`${film.couple} wedding film — The Love Team`}
                    />
                  </div>
                  <p className="mt-4 text-center font-serif text-2xl">{film.couple}</p>
                  <p className="mt-1 text-center text-sm md:text-base tracking-wide text-[#070707]/50">
                    {film.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolios: photos */}
        <section className="px-4 md:px-8 lg:px-10 pb-16 md:pb-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {notes.photos.map((src, i) => (
                <div key={src} className="relative aspect-[3/2] overflow-hidden bg-[#070707]/5">
                  <Image
                    src={src}
                    alt={`Wedding photography by The Love Team, photo ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-sm md:text-base tracking-wide text-[#070707]/50">
              {notes.photoCredit}
            </p>
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

        {/* Close */}
        <section className="px-4 md:px-8 lg:px-10 pb-20 md:pb-28">
          <div className="mx-auto max-w-4xl border border-[#070707]/15 bg-white/40 p-8 md:p-12 text-center">
            <h2 className="font-serif text-3xl md:text-4xl leading-tight">
              Ready to lock in your date?
            </h2>
            <p className="mt-5 mx-auto max-w-2xl text-base md:text-lg leading-relaxed text-[#070707]/75">
              The $100 deposit reserves September 25, 2027 for you and holds
              your bonuses. Just reply to {notes.hostFirstName}&rsquo;s text
              and she will send your deposit link right over.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
