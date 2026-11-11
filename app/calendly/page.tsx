import type { Metadata } from 'next';
import { CalendlyLanding } from '@/components/blocks/calendly-landing';

export const metadata: Metadata = {
  title: 'Book a Call | The Love Team',
  description:
    '10 hours of photo, video, and content creation for $3500. $100 deposit to book a call with The Love Team.',
};

export default function CalendlyPage() {
  return <CalendlyLanding />;
}
