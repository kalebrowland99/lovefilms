'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { CalendlyEmbed } from '@/components/ui/calendly-embed';
import { cn } from '@/lib/utils';

interface BookingSectionProps {
  id?: string;
  title?: string;
  description?: string;
  className?: string;
  innerClassName?: string;
  variant?: 'default' | 'contact';
  enableConfetti?: boolean;
}

export function BookingSection({
  id,
  title = 'Book a quick call 💍',
  description = 'Pick a time that works for you. We take on a limited number of weddings each year — dates book on a first-come basis.',
  className,
  innerClassName,
  variant = 'default',
  enableConfetti = true,
}: BookingSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const hasTriggeredConfetti = useRef(false);

  useEffect(() => {
    if (!enableConfetti) return;

    const triggerConfetti = () => {
      const isMobile = window.innerWidth < 768;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#DAA520', '#B8860B', '#F4C430', '#FFDF00'],
        scalar: isMobile ? 0.6 : 1,
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.target === sectionRef.current &&
            !hasTriggeredConfetti.current
          ) {
            triggerConfetti();
            hasTriggeredConfetti.current = true;
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [enableConfetti]);

  const isContact = variant === 'contact';

  return (
    <section
      ref={sectionRef}
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

        <div
          className={cn(
            'mx-auto max-w-3xl overflow-hidden rounded-2xl',
            isContact ? '' : 'bg-neutral-50 dark:bg-neutral-900 p-4 md:p-8'
          )}
        >
          <CalendlyEmbed />
        </div>
      </div>
    </section>
  );
}
