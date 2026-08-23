'use client';

import { useEffect, useRef } from 'react';
import { BookingSection } from '@/components/blocks/booking-section';

export default function ContactPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const handleLoadedMetadata = () => {
        if (videoElement.duration) {
          videoElement.currentTime = videoElement.duration / 2;
        }
      };

      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  return (
    <>
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center bg-black overflow-hidden">
        <video
          src="https://firebasestorage.googleapis.com/v0/b/lovefilms-d618e.firebasestorage.app/o/homevideo.mp4?alt=media"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-normal tracking-wide">
            NEWLY ENGAGED?
          </h1>
        </div>
      </section>

      <section className="py-12 md:py-24 px-4 bg-white dark:bg-neutral-950">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#d9d4c8] rounded-2xl p-6 md:p-12 mb-8">
            <h2 className="text-2xl md:text-4xl font-serif font-normal text-center mb-4 md:mb-6 text-neutral-800 leading-tight">
              A Rare Wedding Videography Opportunity for 2026–2027 Couples!
            </h2>

            <p className="text-base md:text-lg font-serif text-neutral-800 mb-4 md:mb-6">
              For a very limited time, only 3 newly engaged couples planning 2026 or 2027 weddings can receive:
            </p>

            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-xl md:text-2xl font-serif flex-shrink-0">✓</span>
                <p className="text-base md:text-lg font-serif text-neutral-800">
                  $1,000 off my most popular wedding videography collection
                </p>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-xl md:text-2xl font-serif flex-shrink-0">✓</span>
                <p className="text-base md:text-lg font-serif text-neutral-800">
                  A complimentary engagement session when you book
                </p>
              </div>
            </div>

            <p className="text-base md:text-lg font-serif font-normal text-neutral-800 text-center">
              Once these 3 spots are claimed, this offer will not be extended.
            </p>
          </div>

          <BookingSection
            variant="contact"
            className="mb-6 md:mb-8"
            title="Book a quick call"
            description="Pick a time below to check availability and claim one of the 3 spots."
          />

          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-[#E8DED2] p-6 md:p-12 mb-6 md:mb-8">
            <h3 className="text-xl md:text-3xl font-serif font-normal text-center mb-4 md:mb-8 text-neutral-800 dark:text-neutral-100">
              Who This Is For?
            </h3>

            <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300 mb-4 md:mb-6">
              This opportunity is designed for couples who:
            </p>

            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-lg md:text-xl font-serif flex-shrink-0">•</span>
                <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300">
                  Value videography as a top priority
                </p>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-lg md:text-xl font-serif flex-shrink-0">•</span>
                <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300">
                  Want a calm, guided wedding day experience
                </p>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-lg md:text-xl font-serif flex-shrink-0">•</span>
                <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300">
                  Are ready to secure a trusted wedding team early
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6 md:mb-8 rounded-2xl overflow-hidden border-2 border-[#E8DED2]">
            <video
              ref={videoRef}
              src="https://firebasestorage.googleapis.com/v0/b/lovefilms-d618e.firebasestorage.app/o/homevideo.mp4?alt=media"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-[250px] md:h-[400px] object-cover"
            />
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-[#E8DED2] p-6 md:p-12 mb-6 md:mb-8">
            <h3 className="text-xl md:text-3xl font-serif font-normal text-center mb-4 md:mb-8 text-neutral-800 dark:text-neutral-100">
              The Experience You&apos;re Securing
            </h3>

            <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300 mb-4 md:mb-6">
              The couples who book early get more than peace of mind — they get first access to planning support, priority scheduling, and a wedding team that knows their vision long before the wedding day.
            </p>

            <p className="text-base md:text-lg font-serif font-normal text-neutral-800 dark:text-neutral-100 text-center">
              That&apos;s how wedding days stay calm and intentional.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-[#E8DED2] p-6 md:p-12 mb-6 md:mb-8">
            <h3 className="text-xl md:text-3xl font-serif font-normal text-center mb-4 md:mb-8 text-neutral-800 dark:text-neutral-100">
              What&apos;s Included?
            </h3>

            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-[#8b8370] text-lg md:text-xl font-serif flex-shrink-0">✔</span>
                <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300">
                  $1,000 off my most popular wedding videography collection
                </p>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-[#8b8370] text-lg md:text-xl font-serif flex-shrink-0">✔</span>
                <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300">
                  A complimentary engagement session
                </p>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-[#8b8370] text-lg md:text-xl font-serif flex-shrink-0">✔</span>
                <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300">
                  A personalized, stress-free experience
                </p>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-[#8b8370] text-lg md:text-xl font-serif flex-shrink-0">✔</span>
                <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300">
                  Only 3 couples will receive this offer
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-[#E8DED2] p-6 md:p-12 mb-6 md:mb-8">
            <h3 className="text-xl md:text-3xl font-serif font-normal text-center mb-4 md:mb-8 text-neutral-800 dark:text-neutral-100">
              How to Claim One of the 3 Spots?
            </h3>

            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-3 md:gap-4">
                <span className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#8b8370] text-white flex items-center justify-center font-serif font-normal text-sm md:text-base">
                  1
                </span>
                <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300 pt-0.5 md:pt-1">
                  Book a quick call using the scheduler below
                </p>
              </div>
              <div className="flex items-start gap-3 md:gap-4">
                <span className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#8b8370] text-white flex items-center justify-center font-serif font-normal text-sm md:text-base">
                  2
                </span>
                <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300 pt-0.5 md:pt-1">
                  I&apos;ll reach out with next steps
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#d9d4c8] border-2 border-[#8b8370] rounded-2xl p-6 md:p-12 mb-6 md:mb-8">
            <h3 className="text-xl md:text-3xl font-serif font-normal text-center mb-4 md:mb-6 text-neutral-800">
              Important Note
            </h3>

            <p className="text-base md:text-lg font-serif text-neutral-800 text-center">
              Dates are filling fast. Once these 3 spots are claimed, this offer ends.
            </p>
          </div>

          <BookingSection
            variant="contact"
            title="Book your call"
            description="Pick a time below — we'll check availability and walk you through everything."
            enableConfetti={false}
          />
        </div>
      </section>
    </>
  );
}
