'use client';

import { useEffect, useMemo } from 'react';
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
import { withCanvasText } from '@/lib/showit-canvas';
import { SimpleVideoHero } from '@/components/ui/simple-video-hero';
import { PortfolioGrid } from '@/components/blocks/portfolio-grid';
import { LoveNotes } from '@/components/blocks/love-notes';
import { InstagramScrollDemo } from '@/components/blocks/instagram-scroll-demo';
import { BookingSection } from '@/components/blocks/booking-section';
import { Footer } from '@/components/ui/footer';
import { useLocationCopy } from '@/components/visitor-location-provider';


export default function Home() {
  const copy = useLocationCopy();
  const approachBlocks = useMemo(
    () => withCanvasText(HOME_APPROACH_BLOCKS, { 'our-mission-sticky_1': copy.approachHeadline }),
    [copy.approachHeadline],
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <CanvasHeader />
      {/* Clears the fixed nav so the hero starts below it. */}
      <div className="h-[54px] md:h-[103px] bg-[#070707]" />
      <SimpleVideoHero
        videoSrc="https://firebasestorage.googleapis.com/v0/b/lovefilms-d618e.firebasestorage.app/o/homevideo.mp4?alt=media&token=fb181071-298c-4743-94fb-1ba8bd778741"
        title={copy.heroTitle}
        subtitle={copy.heroSubtitle}
      />

      <ShowitCanvas blocks={approachBlocks} />

      <BookingSection
        id="booking"
        layout="button"
        buttonLabel={copy.ctaButton}
        title={copy.ctaTitle}
        description={copy.ctaDescription}
      />

      <PortfolioGrid title="Quick Previews" />

      <ShowitCanvas blocks={HOME_OFFERINGS_BLOCKS} />

      <LoveNotes />

      <ShowitCanvas blocks={HOME_STORIES_BLOCKS} />

      <ShowitCanvas blocks={HOME_REVIEWS_BLOCKS} />

      <ShowitCanvas blocks={HOME_ROMANCE_BLOCKS} background="#222222" />

      <InstagramScrollDemo />

      <ShowitCanvas blocks={HOME_GALLERY_BLOCKS} />

      <Footer />
    </>
  );
}
