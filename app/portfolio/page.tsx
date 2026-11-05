import type { Metadata } from 'next';
import { PortfolioCanvas } from '@/components/blocks/portfolio-canvas';

export const metadata: Metadata = {
  title: 'Portfolio | The Love Team',
  description:
    'Cinematic wedding films, highlight reels, and photography from The Love Team — romantic storytelling for your wedding day.',
};

export default function PortfolioPage() {
  return <PortfolioCanvas />;
}
