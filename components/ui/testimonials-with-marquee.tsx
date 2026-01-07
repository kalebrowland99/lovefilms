import React from "react"
import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card"

interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({ 
  title,
  description,
  testimonials,
  className 
}: TestimonialsSectionProps) {
  return (
    <section className={cn(
      "bg-white dark:bg-neutral-950 text-foreground",
      "py-20 px-0",
      className
    )}>
      <div className="mx-auto flex max-w-container flex-col items-center gap-4 text-center sm:gap-16">
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-8">
          <h2 className="max-w-[720px] text-3xl font-normal leading-tight sm:text-5xl sm:leading-tight text-black dark:text-white">
            {title}
          </h2>
          <p className="text-md max-w-[600px] font-medium text-neutral-600 dark:text-neutral-400 sm:text-xl">
            {description}
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex overflow-hidden p-2 [--gap:1rem] flex-row [--duration:60s]">
            <div className="flex shrink-0 [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
              {[...Array(2)].map((_, setIndex) => (
                <React.Fragment key={setIndex}>
                  {testimonials.map((testimonial, i) => (
                    <TestimonialCard 
                      key={`${setIndex}-${i}`}
                      {...testimonial}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-white dark:from-neutral-950 sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-white dark:from-neutral-950 sm:block" />
        </div>
      </div>
    </section>
  )
}
