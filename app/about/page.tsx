import type { Metadata } from 'next';
import { CanvasHeader } from '@/components/ui/canvas-header';
import { PreCallVideo } from '@/components/ui/pre-call-video';
import { CalendlyEmbed } from '@/components/ui/calendly-embed';
import { Footer } from '@/components/ui/footer';

export const metadata: Metadata = {
  title: 'About the Team | Your Love Films',
  description:
    'Your Love Films — cinematic wedding videography and photography for couples nationwide. Watch our intro video and book a quick call.',
};

export default function AboutPage() {
  return (
    <>
      <CanvasHeader />
      <div className="h-[54px] md:h-[103px] bg-[#070707]" />

      <main className="bg-white dark:bg-neutral-950">
        <section className="px-4 md:px-8 lg:px-10 pt-16 pb-12 md:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs md:text-sm font-medium uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
              About the team
            </p>
            <h1 className="mt-5 font-serif text-4xl md:text-6xl leading-tight text-neutral-900 dark:text-white">
              Hey — we&rsquo;re Your Love Films
            </h1>
            <p className="mt-6 text-lg md:text-xl leading-relaxed text-neutral-600 dark:text-neutral-400">
              We film and photograph weddings for couples nationwide. Before we
              hop on a call, here&rsquo;s a short video on how we work and what
              it&rsquo;s like to have us there on your day.
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
              <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 dark:text-white">
                Ready to talk it through?
              </h2>
              <p className="mt-4 text-base md:text-lg text-neutral-600 dark:text-neutral-400">
                Pick a time below. We take on a limited number of weddings each
                year, and dates book on a first-come basis.
              </p>
            </div>
            <div className="rounded-2xl border border-[#E8DED2] dark:border-neutral-800 overflow-hidden">
              <CalendlyEmbed />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
