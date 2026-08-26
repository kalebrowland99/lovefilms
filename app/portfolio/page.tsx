import type { Metadata } from 'next';
import { PortfolioCanvas } from '@/components/blocks/portfolio-canvas';

export const metadata: Metadata = {
  title: 'Portfolio | Your Love Films',
  description:
    'Cinematic wedding films, highlight reels, and photography from Your Love Films — romantic storytelling for couples nationwide.',
};

export default function PortfolioPage() {
  return <PortfolioCanvas />;
}
