'use client';

import { useEffect } from 'react';
import { CanvasHeader } from '@/components/ui/canvas-header';
import { ShowitCanvas } from '@/components/blocks/showit-canvas';
import {
  HOME_APPROACH_BLOCKS,
  HOME_GALLERY_BLOCKS,
  HOME_OFFERINGS_BLOCKS,
  HOME_REVIEWS_BLOCKS,
  HOME_ROMANCE_BLOCKS,
  HOME_STORIES_BLOCKS,
} from '@/lib/home-canvas';
import { SimpleVideoHero } from '@/components/ui/simple-video-hero';
import { PortfolioGrid } from '@/components/blocks/portfolio-grid';
import { LoveNotes } from '@/components/blocks/love-notes';
import { LetsTravel } from '@/components/blocks/lets-travel';
import { InstagramScrollDemo } from '@/components/blocks/instagram-scroll-demo';
import { BookingSection } from '@/components/blocks/booking-section';
import { Footer } from '@/components/ui/footer';


export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <CanvasHeader />
      {/* Clears the fixed nav so the hero starts below it. */}
      <div className="h-[54px] md:h-[103px] bg-[#070707]" />
      <SimpleVideoHero videoSrc="https://firebasestorage.googleapis.com/v0/b/lovefilms-d618e.firebasestorage.app/o/homevideo.mp4?alt=media&token=fb181071-298c-4743-94fb-1ba8bd778741" />

      <ShowitCanvas blocks={HOME_APPROACH_BLOCKS} />

      <BookingSection
        id="booking"
        layout="button"
        buttonLabel="Check Availability"
        title="Check if your date is available 💍"
        description="Book a quick call with us. We take on a limited number of weddings each year — dates book on a first-come basis."
      />

      <PortfolioGrid title="Quick Previews" />

      <ShowitCanvas blocks={HOME_OFFERINGS_BLOCKS} />

      <LoveNotes />

      <LetsTravel />

      <ShowitCanvas blocks={HOME_STORIES_BLOCKS} />

      <ShowitCanvas blocks={HOME_REVIEWS_BLOCKS} />

      <ShowitCanvas blocks={HOME_ROMANCE_BLOCKS} background="#222222" />

      <InstagramScrollDemo />

      <ShowitCanvas blocks={HOME_GALLERY_BLOCKS} />

      <Footer />
    </>
  );
}
