import type { Metadata } from 'next';
import { CalendlyLanding } from '@/components/blocks/calendly-landing';
import { visitorAreaName } from '@/lib/visitor-area';

export const metadata: Metadata = {
  title: 'Book a Call | The Love Team',
  description:
    'Wedding photography, videography, and content creation for $3500. $100 deposit to book a call with The Love Team.',
};

export default async function CalendlyPage() {
  const area = await visitorAreaName();
  return <CalendlyLanding area={area} />;
}
