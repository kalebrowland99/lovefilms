'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const loveNotes = [
  {
    names: "jeb and easley",
    quote: "We both teared up multiple times and are just overwhelmed at how talented Mason is. We could not BELIEVE the beautiful way he made sure each person and part of our life that means the most to us was highlighted."
  },
  {
    names: "Emily & Jordan",
    quote: "We couldn't be happier with our wedding film! Every emotion, every tear, every laugh was captured beautifully. Watching it feels like reliving our perfect day all over again."
  },
  {
    names: "Rachel & Tyler",
    quote: "From our first meeting to receiving the final video, the entire experience was amazing. They made us feel so comfortable on camera and captured moments we didn't even know happened!"
  },
  {
    names: "Lauren & Chris",
    quote: "Our wedding video is a work of art. The way they captured the golden hour shots at our venue was breathtaking. We watch it constantly and cry happy tears every time!"
  },
  {
    names: "Amanda & Blake",
    quote: "The drone footage of our outdoor ceremony was absolutely stunning! They captured the beauty of our venue and the emotion of our day perfectly. We're so grateful we chose them!"
  },
  {
    names: "Megan & Daniel",
    quote: "Best investment we made for our wedding! The attention to detail, the cinematic quality, the beautiful music - everything was perfect. Our families watch the video on repeat!"
  }
];

export function LoveNotes() {
  const [currentIndex, setCurrentIndex] = useState(0);

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
          {/* Left Side - Title */}
          <div>
            <h2 className="text-5xl md:text-7xl font-serif tracking-tight text-neutral-800 mb-4">
              LOVE<br />NOTES
            </h2>
            <p className="text-sm font-serif italic text-neutral-600 mb-8">
              {currentNote.names}
            </p>
            <div className="w-full h-[1px] bg-neutral-400"></div>
          </div>

          {/* Right Side - Quote and Navigation */}
          <div className="flex flex-col justify-between min-h-[300px]">
            <div className="flex-1 flex items-center">
              <p className="text-lg md:text-xl font-serif leading-relaxed text-neutral-800 text-center md:text-right">
                "{currentNote.quote}"
              </p>
            </div>

            {/* Navigation */}
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

