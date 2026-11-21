import { GOOGLE_REVIEWS_URL } from '@/lib/social';

const STARS = '★★★★★';

export function GoogleReviews() {
  return (
    <section className="bg-[#f9f9f5] px-4 py-16 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[12px] uppercase tracking-[0.25em] text-[#8b8370]">
          Google Reviews
        </p>
        <p className="mt-4 text-3xl tracking-[0.2em] text-[#c9a227]" aria-label="Rated 5 out of 5 stars">
          {STARS}
        </p>
        <p className="mt-2 text-sm text-neutral-600">5.0 from our couples on Google</p>
        <blockquote className="mt-8 font-serif text-2xl leading-snug text-neutral-900 md:text-[28px]">
          &ldquo;It is amazing working with this team! They are very professional!&rdquo;
        </blockquote>
        <p className="mt-3 text-sm uppercase tracking-[0.15em] text-neutral-500">
          Caleb Rogers
        </p>
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block border-b border-neutral-900 pb-1 font-serif text-lg italic text-neutral-900 transition-colors hover:text-neutral-600"
        >
          Read our reviews on Google
        </a>
      </div>
    </section>
  );
}
