import type { Metadata } from 'next';
import { CanvasHeader } from '@/components/ui/canvas-header';
import { Footer } from '@/components/ui/footer';
import { BookingSection } from '@/components/blocks/booking-section';
import { YoutubePreview } from '@/components/ui/youtube-preview';

export const metadata: Metadata = {
  title: 'The Vintage Edit | 48-Hour Bonus | Your Love Films',
  description:
    'Book within 48 hours and receive a complimentary Super 8 vintage edit of your wedding film. Watch a preview of the look.',
  openGraph: {
    title: 'The Vintage Edit | 48-Hour Bonus | Your Love Films',
    description:
      'Book within 48 hours and receive a complimentary Super 8 vintage edit of your wedding film. Watch a preview of the look.',
    type: 'website',
  },
};

const VINTAGE_EDIT_VIDEO_ID = '-OStKmgf3HM';

export default function VintagePage() {
  return (
    <>
      <CanvasHeader />
      <div className="h-[54px] md:h-[103px] bg-[#070707]" />

      <main className="bg-[#f9f9f5] text-[#070707]">
        <section className="px-4 md:px-8 lg:px-10 pt-16 pb-10 md:pt-24 md:pb-14">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[11px] md:text-sm font-medium uppercase tracking-[0.25em] text-[#070707]/60">
              48-hour bonus
            </p>
            <h1 className="mt-5 font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-[#070707]">
              The Vintage <em className="italic font-normal">Edit</em>
            </h1>
            <p className="mt-8 mx-auto max-w-2xl text-lg md:text-xl leading-relaxed text-[#070707]/75">
              Book within 48 hours and we&rsquo;ll include a Super 8 vintage
              cut of your wedding film &mdash; complimentary. Grain, warmth, a
              little flicker. Watch a preview of the look below.
            </p>
          </div>
        </section>

        <section className="px-4 md:px-8 lg:px-10 pb-16 md:pb-20">
          <div className="mx-auto max-w-4xl">
            <YoutubePreview
              videoId={VINTAGE_EDIT_VIDEO_ID}
              title="Super 8 vintage film preview — Your Love Films"
            />
            <p className="mt-4 text-center text-sm md:text-base tracking-wide text-[#070707]/50">
              Super 8 vintage film preview
            </p>
          </div>
        </section>

        <section className="px-4 md:px-8 lg:px-10 pb-16 md:pb-24">
          <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-6 md:gap-8">
            <article className="border border-[#070707]/15 bg-white/40 p-8 md:p-12">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#070707]/50">
                01 &mdash; the look
              </p>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl leading-tight">
                Super 8, already a memory
              </h2>
              <p className="mt-5 text-base md:text-lg leading-relaxed text-[#070707]/75">
                Soft grain, warm tones, and the flicker of old film. A second
                cut of your day that feels like something pulled from a family
                archive &mdash; not a modern highlight with a filter on top.
              </p>
            </article>
            <article className="border border-[#070707]/15 bg-white/40 p-8 md:p-12">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#070707]/50">
                02 &mdash; the bonus
              </p>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl leading-tight">
                Included for 48 hours
              </h2>
              <p className="mt-5 text-base md:text-lg leading-relaxed text-[#070707]/75">
                Book your wedding film within 48 hours of reaching out and the
                vintage edit comes with your package, no extra fee. After that
                window, the bonus closes.
              </p>
            </article>
          </div>
        </section>

        <BookingSection
          id="booking"
          layout="button"
          buttonLabel="Book a Call"
          title="Ready to lock in the vintage edit?"
          description="Pick a time that works. Book within 48 hours and the Super 8 cut is included with your wedding film."
        />
      </main>

      <Footer />
    </>
  );
}
