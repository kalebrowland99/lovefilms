import type { Metadata } from 'next';
import { RecordStudio } from '@/components/record/record-studio';

export const metadata: Metadata = {
  title: 'Record | Your Love Films',
  robots: { index: false, follow: false },
};

export default function RecordPage() {
  return <RecordStudio />;
}
