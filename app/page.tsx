'use client';

import { useEffect } from 'react';
import { Header } from '@/components/ui/header';
import { SimpleVideoHero } from '@/components/ui/simple-video-hero';
import { InstagramEmbeds } from '@/components/blocks/instagram-embeds';
import { LoveNotes } from '@/components/blocks/love-notes';
import { LetsTravel } from '@/components/blocks/lets-travel';
import { TestimonialsSection } from '@/components/ui/testimonials-with-marquee';
import { InstagramScrollDemo } from '@/components/blocks/instagram-scroll-demo';
import { TimelineDemo } from '@/components/blocks/timeline-demo';
import { FeaturedOn } from '@/components/blocks/featured-on';
import { BookingSection } from '@/components/blocks/booking-section';
import { Footer } from '@/components/ui/footer';

const testimonials = [
  {
    author: {
      name: 'Sarah & Marco',
      initials: 'SM',
    },
    text: "We almost skipped video to save money. So glad we didn't — they got our first look, my dad's speech, and our niece doing the cha cha slide. We've watched it at least a dozen times.",
  },
  {
    author: {
      name: 'Lauren & Chris',
      initials: 'LC',
    },
    text: 'The highlight film came back in about six weeks and felt like a real movie. They kept the messy, honest moments — the flower girl running off, Chris tearing up during vows — not just the polished stuff.',
  },
  {
    author: {
      name: 'Priya & James',
      initials: 'PJ',
    },
    text: "Two ceremonies, two families, one film that actually worked for both. They showed up early, knew where to stand, and didn't make anything feel staged or awkward.",
  },
  {
    author: {
      name: 'Hannah & Matt',
      initials: 'HM',
    },
    text: "Our parents still text us clips from the first dance. You can hear our niece whisper 'they're crying' in the background. Still makes us laugh every time.",
  },
];

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <SimpleVideoHero videoSrc="https://firebasestorage.googleapis.com/v0/b/lovefilms-d618e.firebasestorage.app/o/homevideo.mp4?alt=media&token=fb181071-298c-4743-94fb-1ba8bd778741" />

      <FeaturedOn />

      <BookingSection
        id="booking"
        title="Check if your date is available 💍"
        description="Book a quick call below. We take on a limited number of weddings each year — dates book on a first-come basis."
      />

      <InstagramEmbeds />

      <LoveNotes />

      <LetsTravel />

      <div id="services">
        <TimelineDemo />
      </div>

      <div id="reviews">
        <TestimonialsSection
          title="What Our Couples Say ❤️"
          description="Real words from couples we've filmed across the country"
          testimonials={testimonials}
        />
      </div>

      <BookingSection
        title="Ready to chat?"
        description="Pick a time for a quick call — we'll walk through your wedding day and check availability."
      />

      <InstagramScrollDemo />

      <InstagramEmbeds title="Recent Preview" />

      <Footer />
    </>
  );
}
