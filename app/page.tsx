'use client';

import { useEffect } from 'react';
import { Header } from '@/components/ui/header';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import { MeetTheCrew } from '@/components/blocks/meet-the-crew';
import { TestimonialsSection } from '@/components/ui/testimonials-with-marquee';
import { InstagramScrollDemo } from '@/components/blocks/instagram-scroll-demo';
import { TimelineDemo } from '@/components/blocks/timeline-demo';
import { FeaturedOn } from '@/components/blocks/featured-on';
import { Footer } from '@/components/ui/footer';

const mediaContent = {
  src: 'https://firebasestorage.googleapis.com/v0/b/lovefilms-d618e.firebasestorage.app/o/2.mp4?alt=media',
  background: 'https://firebasestorage.googleapis.com/v0/b/lovefilms-d618e.firebasestorage.app/o/1.mp4?alt=media',
  title: '',
  date: '📍 Nashville, Tennessee',
  scrollToExpand: 'Scroll down to see more',
};

const testimonials = [
  {
    author: {
      name: "Emily & Jordan",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "We couldn't be happier with our wedding film! Every emotion, every tear, every laugh was captured beautifully. Watching it feels like reliving our perfect day all over again.",
  },
  {
    author: {
      name: "Rachel & Tyler",
      avatar: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=150&h=150&fit=crop&crop=face"
    },
    text: "From our first meeting to receiving the final video, the entire experience was amazing. They made us feel so comfortable on camera and captured moments we didn't even know happened!",
  },
  {
    author: {
      name: "Lauren & Chris",
      avatar: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=150&h=150&fit=crop&crop=face"
    },
    text: "Our wedding video is a work of art. The way they captured the golden hour shots at our venue was breathtaking. We watch it constantly and cry happy tears every time!",
  },
  {
    author: {
      name: "Amanda & Blake",
      avatar: "https://images.unsplash.com/photo-1519741497674-611481863552?w=150&h=150&fit=crop&crop=face"
    },
    text: "The drone footage of our outdoor ceremony was absolutely stunning! They captured the beauty of our venue and the emotion of our day perfectly. We're so grateful we chose them!",
  },
  {
    author: {
      name: "Megan & Daniel",
      avatar: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=150&h=150&fit=crop&crop=face"
    },
    text: "Best investment we made for our wedding! The attention to detail, the cinematic quality, the beautiful music - everything was perfect. Our families watch the video on repeat!",
  }
];

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc={mediaContent.src}
        bgImageSrc={mediaContent.background}
        title={mediaContent.title}
        date={mediaContent.date}
        scrollToExpand={mediaContent.scrollToExpand}
      />

      <FeaturedOn />

      {/* Typeform Booking Section - Top */}
      <section className="py-20 px-4 bg-white dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight mb-4 text-black dark:text-white">
              Limited spots available
            </h2>
            <p className="text-md max-w-[600px] mx-auto font-medium text-neutral-600 dark:text-neutral-400 sm:text-xl">
              Fill out the form below and we'll discuss your special day!
            </p>
          </div>
          <div 
            data-tf-live="01KE2M3ED7WVGJP9Y25THEN7XJ"
            className="rounded-2xl overflow-hidden"
            style={{ minWidth: '320px', height: '700px' }}
          />
        </div>
      </section>
      
      <MeetTheCrew />
      
      <div id="services">
        <TimelineDemo />
      </div>
      
      <div id="reviews">
        <TestimonialsSection
          title="What Our Couples Say ❤️"
          description="Join hundreds of satisfied clients who trust us with their most important moments"
          testimonials={testimonials}
        />
      </div>

      {/* Typeform Booking Section */}
      <section id="booking" className="py-20 px-4 bg-white dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight mb-4 text-black dark:text-white">
              Limited spots available
            </h2>
            <p className="text-md max-w-[600px] mx-auto font-medium text-neutral-600 dark:text-neutral-400 sm:text-xl">
              Fill out the form below and we'll discuss your special day!
            </p>
          </div>
          <div 
            data-tf-live="01KE2M3ED7WVGJP9Y25THEN7XJ"
            className="rounded-2xl overflow-hidden"
            style={{ minWidth: '320px', height: '700px' }}
          />
        </div>
      </section>

      <InstagramScrollDemo />

      <Footer />
    </>
  );
}
