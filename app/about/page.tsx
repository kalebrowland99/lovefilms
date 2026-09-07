import type { Metadata } from 'next';
import { CanvasHeader } from '@/components/ui/canvas-header';
import { PreCallVideo } from '@/components/ui/pre-call-video';
import { CalendlyEmbed } from '@/components/ui/calendly-embed';
import { Footer } from '@/components/ui/footer';
import { getLocationCopyForRequest } from '@/lib/get-visitor-location';

export const metadata: Metadata = {
  title: 'About the Team | Your Love Films',
  description:
    'Your Love Films — cinematic wedding photography and videography. Watch our intro video and book a quick call.',
};

export default async function AboutPage() {
  const copy = await getLocationCopyForRequest();

  return (
    <>
      <CanvasHeader />
      <div className="h-[54px] md:h-[103px] bg-[#070707]" />

      <main className="bg-[#f9f9f5] text-[#070707]">
        <section className="px-4 md:px-8 lg:px-10 pt-16 pb-12 md:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] md:text-sm font-medium uppercase tracking-[0.25em] text-[#070707]/60">
              About the team
            </p>
            <h1 className="mt-5 font-serif text-4xl md:text-6xl leading-tight text-[#070707]">
              Hey — we&rsquo;re Your Love Films
            </h1>
            <p className="mt-6 text-lg md:text-xl leading-relaxed text-[#070707]/75">
              {copy.aboutIntro}
            </p>
          </div>
        </section>

        <section className="px-4 md:px-8 lg:px-10 pb-16">
          <div className="mx-auto max-w-4xl">
            <PreCallVideo />
          </div>
        </section>

        <section id="booking" className="px-4 md:px-8 lg:px-10 pb-20 scroll-mt-[54px] md:scroll-mt-[103px]">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl md:text-4xl text-[#070707]">
                Ready to talk it through?
              </h2>
              <p className="mt-4 text-base md:text-lg text-[#070707]/75">
                Pick a time below. We take on a limited number of weddings each
                year, and dates book on a first-come basis.
              </p>
            </div>
            <div className="rounded-2xl border border-[#E8DED2] overflow-hidden bg-white">
              <CalendlyEmbed />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
