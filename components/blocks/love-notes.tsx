'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocationCopy } from '@/components/visitor-location-provider';

const loveNotes = [
  {
    names: 'Lauren & Chris',
    quote:
      'Our highlight came back in about six weeks and honestly felt like something we\'d watch in a theater — not a typical wedding video. They kept the real stuff: the flower girl taking off mid-aisle, Chris tearing up during vows, my brother giving a toast that made zero sense. We\'ve sent it to basically everyone we know.',
  },
  {
    names: 'Nicole & Jake',
    quote:
      'I\'ll be honest — I thought wedding video was going to feel cheesy. It didn\'t. Jake hates being on camera and said he barely noticed them, which is probably the best compliment. The final film still got us both crying on the couch.',
  },
  {
    names: 'Priya & James',
    quote:
      'We had two ceremonies and I was worried a team wouldn\'t know how to handle both without making one feel like an afterthought. They asked thoughtful questions ahead of time and the edit gave equal weight to both sides of our families.',
  },
  {
    names: 'Emma & Ryan',
    quote:
      'Our wedding was in Scottsdale and half our family flew in from out of state. The team showed up early, stayed calm when the timeline ran late, and somehow got footage of my grandma on the dance floor that I didn\'t even know happened until we watched the film.',
  },
  {
    names: 'Chloe & David',
    quote:
      'What sold us was how natural everything felt on the wedding day — no awkward posing, no hovering. The audio from our vows alone is something we\'ll keep forever. David still refuses to watch it in public because he knows he cried.',
  },
];

export function LoveNotes() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { socialProof } = useLocationCopy();

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? loveNotes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === loveNotes.length - 1 ? 0 : prev + 1));
  };

  const currentNote = loveNotes[currentIndex];

  return (
    <section className="py-20 px-4 bg-[#d9d4c8]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">
          <div>
            <h2 className="text-5xl md:text-7xl font-serif tracking-tight text-neutral-800 mb-4">
              LOVE<br />NOTES
            </h2>
            <p className="text-base md:text-lg font-serif text-neutral-700 mb-4">
              {socialProof}
            </p>
            <p className="text-sm font-serif italic text-neutral-600 mb-8">
              {currentNote.names}
            </p>
            <div className="w-full h-[1px] bg-neutral-400"></div>
          </div>

          <div className="flex flex-col justify-between min-h-[300px]">
            <div className="flex-1 flex items-center">
              <p className="text-lg md:text-xl font-serif leading-relaxed text-neutral-800 text-center md:text-right">
                &ldquo;{currentNote.quote}&rdquo;
              </p>
            </div>

            <div className="mt-12">
              <div className="flex items-center justify-end gap-8 mb-6">
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-2 text-sm tracking-wider text-neutral-700 hover:text-neutral-900 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>previous</span>
                </button>
                <span className="text-neutral-400">/</span>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 text-sm tracking-wider text-neutral-700 hover:text-neutral-900 transition-colors"
                  aria-label="Next testimonial"
                >
                  <span>next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="w-full h-[1px] bg-neutral-400 mb-4"></div>
              <p className="text-right text-2xl md:text-4xl font-serif tracking-wide text-neutral-800">
                AND KIND WORDS
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
