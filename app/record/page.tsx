import type { Metadata } from 'next';
import { RecordStudio } from '@/components/record/record-studio';

export const metadata: Metadata = {
  title: 'Record | The Love Team',
  robots: { index: false, follow: false },
};

export default function RecordPage() {
  return <RecordStudio />;
}
