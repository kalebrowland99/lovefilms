'use client';

import {
  InstagramEmbed,
  InstagramEmbedScript,
} from '@/components/ui/instagram-embed';
import {
  VIRAL_INSTAGRAM_LIKES,
  VIRAL_INSTAGRAM_POST_URL,
} from '@/lib/press';

export function ViralInstagramCard() {
  return (
    <>
      <InstagramEmbedScript />
      <div className="rounded-2xl border border-[#E8DED2] bg-white p-5 md:p-6 shadow-sm flex flex-col">
        <p className="text-xs font-sans uppercase tracking-[0.2em] text-[#8b8370] mb-3">
          Our Viral Wedding Shoot
        </p>
        <p className="font-serif text-sm md:text-base text-neutral-600 leading-relaxed mb-4">
          {VIRAL_INSTAGRAM_LIKES} likes on Instagram — we helped shoot this
          cinematic moment.{' '}
          <a
            href="https://instagram.com/yourlovefilms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-800 underline underline-offset-2 decoration-[#E8DED2] hover:text-[#8b8370] hover:decoration-[#8b8370]"
          >
            @yourlovefilms
          </a>{' '}
          is tagged in the post.
        </p>
        <div className="min-w-0 overflow-hidden rounded-xl">
          <InstagramEmbed
            url={VIRAL_INSTAGRAM_POST_URL}
            className="flex justify-center [&_.instagram-media]:!min-w-0 [&_.instagram-media]:!w-full"
          />
        </div>
        <a
          href={VIRAL_INSTAGRAM_POST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-center text-sm font-sans font-medium text-neutral-800 underline underline-offset-4 decoration-[#E8DED2] hover:decoration-[#8b8370]"
        >
          Watch on Instagram
        </a>
      </div>
    </>
  );
}
