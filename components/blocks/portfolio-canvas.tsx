'use client';

import { CanvasHeader } from '@/components/ui/canvas-header';
import { PORTFOLIO_BLOCKS } from '@/lib/portfolio-canvas';
import { ShowitCanvas } from '@/components/blocks/showit-canvas';
import { Footer } from '@/components/ui/footer';

export function PortfolioCanvas() {
  return (
    <>
      <CanvasHeader />
      {/* Clears the fixed nav so the hero canvas isn't covered. */}
      <div className="h-[54px] md:h-[103px] bg-[#070707]" />
      <ShowitCanvas blocks={PORTFOLIO_BLOCKS} />
      <Footer />
    </>
  );
}
