'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CanvasHeader } from '@/components/ui/canvas-header';
import { Footer } from '@/components/ui/footer';
import { CALENDLY_BOOKING_URL } from '@/lib/calendly';
import { GALLERIES, galleryPath, type CoupleGallery } from '@/lib/galleries';

export function CoupleGalleryPage({ gallery }: { gallery: CoupleGallery }) {
  const [open, setOpen] = useState<number | null>(null);
  const idx = GALLERIES.findIndex((g) => g.slug === gallery.slug);
  const prev = GALLERIES[(idx - 1 + GALLERIES.length) % GALLERIES.length];
  const next = GALLERIES[(idx + 1) % GALLERIES.length];

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: -1 | 1) => {
      setOpen((i) => {
        if (i === null) return i;
        return (i + dir + gallery.photos.length) % gallery.photos.length;
      });
    },
    [gallery.photos.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, step]);

  return (
    <>
      <CanvasHeader />
      <div className="h-[54px] md:h-[103px] bg-[#070707]" />

      <main className="bg-[#f9f9f5] text-[#070707]">
        <section className="relative h-[70vh] min-h-[420px] overflow-hidden bg-[#070707]">
          <Image
            src={gallery.cover}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#070707]/45" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
            <p className="font-[family-name:var(--font-engraved)] text-[11px] md:text-[13px] tracking-[0.1em] uppercase">
              {gallery.kicker}
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-serif-alt)] text-4xl md:text-6xl lg:text-7xl italic font-normal leading-[1.05]">
              {gallery.title}
            </h1>
            <p className="mt-6 max-w-xl text-sm md:text-base font-sans font-light leading-relaxed text-white/85">
              {gallery.blurb}
            </p>
          </div>
        </section>

        <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16">
          <div className="mx-auto max-w-6xl columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-5">
            {gallery.photos.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setOpen(i)}
                className="mb-4 md:mb-5 block w-full break-inside-avoid overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#070707]"
              >
                <Image
                  src={src}
                  alt=""
                  width={1200}
                  height={1600}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full h-auto"
                />
              </button>
            ))}
          </div>
        </section>

        <section className="px-6 pb-20 md:pb-28">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
            <Link href={galleryPath(prev.slug)} className="group">
              <p className="font-[family-name:var(--font-engraved)] text-[11px] tracking-[0.1em] uppercase text-[#070707]/50">
                Previous
              </p>
              <p className="mt-1 font-[family-name:var(--font-serif-alt)] text-2xl italic group-hover:opacity-70">
                {prev.title}
              </p>
            </Link>
            <a
              href={CALENDLY_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#070707] px-8 py-3 text-sm tracking-[0.08em] uppercase hover:bg-[#070707] hover:text-[#f9f9f5] transition-colors"
            >
              Book a Call
            </a>
            <Link href={galleryPath(next.slug)} className="group md:text-right">
              <p className="font-[family-name:var(--font-engraved)] text-[11px] tracking-[0.1em] uppercase text-[#070707]/50">
                Next
              </p>
              <p className="mt-1 font-[family-name:var(--font-serif-alt)] text-2xl italic group-hover:opacity-70">
                {next.title}
              </p>
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      {open !== null && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#070707]/92 px-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Photograph"
        >
          <button
            type="button"
            className="absolute left-3 md:left-8 text-white/80 hover:text-white text-3xl"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous photo"
          >
            ←
          </button>
          <Image
            src={gallery.photos[open]}
            alt=""
            width={1800}
            height={2400}
            className="max-h-[88vh] w-auto max-w-[92vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="absolute right-3 md:right-8 text-white/80 hover:text-white text-3xl"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next photo"
          >
            →
          </button>
          <button
            type="button"
            className="absolute top-4 right-4 text-white/70 hover:text-white text-sm tracking-widest uppercase"
            onClick={close}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}
