import type { Metadata } from 'next';
import { CallConfirmedContent } from '@/components/blocks/call-confirmed-content';

export const metadata: Metadata = {
  title: 'Your Call Has Been Booked | Your Love Films',
  description:
    'Complete the 2 steps below to confirm your wedding film consultation call.',
  robots: { index: false, follow: false },
};

export default function CallConfirmedPage() {
  return <CallConfirmedContent />;
}
