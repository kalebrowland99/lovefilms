import type { Metadata } from 'next';
import { CallConfirmedContent } from '@/components/blocks/call-confirmed-content';

export const metadata: Metadata = {
  title: 'Your Voice Call Has Been Booked | Your Love Films',
  description:
    'Confirm your wedding film consultation, then tell us what you think of the portfolio for the price.',
  robots: { index: false, follow: false },
};

export default function CallConfirmedPage() {
  return <CallConfirmedContent />;
}
