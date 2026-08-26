import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CoupleGalleryPage } from '@/components/blocks/couple-gallery';
import { GALLERIES, galleryBySlug } from '@/lib/galleries';

export const dynamicParams = true;

export function generateStaticParams() {
  return GALLERIES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const gallery = galleryBySlug(slug);
  if (!gallery) return { title: 'Gallery | Your Love Films' };
  return {
    title: `${gallery.title} | Your Love Films`,
    description: gallery.blurb,
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gallery = galleryBySlug(slug);
  if (!gallery) notFound();
  return <CoupleGalleryPage gallery={gallery} />;
}
