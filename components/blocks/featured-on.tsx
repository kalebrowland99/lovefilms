import {
  BRIDES_ON_A_MISSION_QUOTE,
  BRIDES_ON_A_MISSION_URL,
} from '@/lib/press';

export function FeaturedOn() {
  return (
    <section className="relative py-16 md:py-20 bg-white dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-10">
        <div className="text-center">
          <p className="text-xs md:text-sm font-medium uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400 mb-6">
            As Featured In
          </p>
          <a
            href={BRIDES_ON_A_MISSION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mx-auto block max-w-3xl rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/50 px-6 py-8 md:px-10 md:py-10 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100/80 dark:hover:bg-neutral-900"
          >
            <p className="font-serif text-2xl md:text-3xl text-neutral-900 dark:text-white mb-3">
              Brides on a Mission
            </p>
            <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              &ldquo;{BRIDES_ON_A_MISSION_QUOTE}&rdquo;
            </p>
            <span className="mt-5 inline-block text-sm font-medium text-neutral-800 dark:text-neutral-200 underline underline-offset-4 decoration-neutral-300 group-hover:decoration-neutral-500 transition-colors">
              Read the feature
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
