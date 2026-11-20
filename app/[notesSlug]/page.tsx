import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LeadNotesPage } from '@/components/blocks/lead-notes';
import { NOTES, notesBySlug } from '@/lib/notes';

export const dynamicParams = true;

export function generateStaticParams() {
  return NOTES.map((n) => ({ notesSlug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ notesSlug: string }>;
}): Promise<Metadata> {
  const { notesSlug } = await params;
  const notes = notesBySlug(notesSlug);
  if (!notes) return { title: 'The Love Team' };
  return {
    title: `Your Call Notes | ${notes.coupleTitle} | The Love Team`,
    description:
      'Your call notes, your package, your bonuses, and recent work from your local team.',
    robots: { index: false, follow: false },
  };
}

export default async function NotesPage({
  params,
}: {
  params: Promise<{ notesSlug: string }>;
}) {
  const { notesSlug } = await params;
  const notes = notesBySlug(notesSlug);
  if (!notes) notFound();
  return <LeadNotesPage notes={notes} />;
}
