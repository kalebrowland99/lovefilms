'use client';

import { CalendlyEmbed } from '@/components/ui/calendly-embed';
import { CALENDLY_BOOKING_URL } from '@/lib/calendly';
import { cn } from '@/lib/utils';

interface BookingSectionProps {
  id?: string;
  title?: string;
  description?: string;
  className?: string;
  innerClassName?: string;
  variant?: 'default' | 'contact';
  layout?: 'embed' | 'button';
  buttonLabel?: string;
}

export function BookingSection({
  id,
  title = 'Book a quick call 💍',
  description = 'Pick a time that works for you. We take on a limited number of weddings each year — dates book on a first-come basis.',
  className,
  innerClassName,
  variant = 'default',
  layout = 'embed',
  buttonLabel = 'Book Your Call',
}: BookingSectionProps) {
  const isContact = variant === 'contact';

  return (
    <section
      id={id}
      className={cn(
        isContact ? 'bg-white dark:bg-neutral-900 rounded-2xl border border-[#E8DED2] p-6 md:p-12' : 'py-20 px-4 bg-white dark:bg-neutral-950',
        className
      )}
    >
      <div className={cn(!isContact && 'mx-auto max-w-4xl', innerClassName)}>
        <div className={cn('text-center', isContact ? 'mb-6 md:mb-8' : 'mb-12')}>
          <h2
            className={cn(
              'font-serif tracking-tight text-black dark:text-white',
              isContact
                ? 'text-xl md:text-3xl font-normal text-neutral-800 dark:text-neutral-100'
                : 'text-3xl sm:text-5xl sm:leading-tight mb-4'
            )}
          >
            {title}
          </h2>
          {description ? (
            <p
              className={cn(
                'max-w-[600px] mx-auto font-medium text-neutral-600 dark:text-neutral-400',
                isContact ? 'text-base md:text-lg font-serif' : 'text-md sm:text-xl'
              )}
            >
              {description}
            </p>
          ) : null}
        </div>

        {layout === 'button' ? (
          <div className="flex justify-center">
            <a
              href={CALENDLY_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#8b8370] px-8 py-4 text-base md:text-lg font-sans font-semibold text-white shadow-md transition-transform hover:scale-[1.02] hover:bg-[#7a7260] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b8370] focus-visible:ring-offset-2"
            >
              {buttonLabel}
            </a>
          </div>
        ) : (
          <div
            className={cn(
              'mx-auto max-w-3xl overflow-hidden rounded-2xl',
              isContact ? '' : 'bg-neutral-50 dark:bg-neutral-900 p-4 md:p-8'
            )}
          >
            <CalendlyEmbed />
          </div>
        )}
      </div>
    </section>
  );
}
