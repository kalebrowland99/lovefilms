'use client';

import { useMemo } from 'react';
import { CanvasHeader } from '@/components/ui/canvas-header';
import { PORTFOLIO_BLOCKS } from '@/lib/portfolio-canvas';
import { ShowitCanvas } from '@/components/blocks/showit-canvas';
import { withCanvasText } from '@/lib/showit-canvas';
import { Footer } from '@/components/ui/footer';
import { useLocationCopy } from '@/components/visitor-location-provider';

export function PortfolioCanvas() {
  const { portfolioHeadline } = useLocationCopy();
  const blocks = useMemo(
    () => withCanvasText(PORTFOLIO_BLOCKS, { hero_7: portfolioHeadline }),
    [portfolioHeadline],
  );

  return (
    <>
      <CanvasHeader />
      {/* Clears the fixed nav so the hero canvas isn't covered. */}
      <div className="h-[54px] md:h-[103px] bg-[#070707]" />
      <ShowitCanvas blocks={blocks} />
      <Footer />
    </>
  );
}
