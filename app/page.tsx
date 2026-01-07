'use client';

import { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Header } from '@/components/ui/header';
import { SimpleVideoHero } from '@/components/ui/simple-video-hero';
import { MeetTheCrew } from '@/components/blocks/meet-the-crew';
import { LoveNotes } from '@/components/blocks/love-notes';
import { LetsTravel } from '@/components/blocks/lets-travel';
import { TestimonialsSection } from '@/components/ui/testimonials-with-marquee';
import { InstagramScrollDemo } from '@/components/blocks/instagram-scroll-demo';
import { TimelineDemo } from '@/components/blocks/timeline-demo';
import { FeaturedOn } from '@/components/blocks/featured-on';
import { Footer } from '@/components/ui/footer';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const formRef1 = useRef<HTMLDivElement>(null);
  const formRef2 = useRef<HTMLDivElement>(null);
  const hasTriggeredConfetti1 = useRef(false);
  const hasTriggeredConfetti2 = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const triggerConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FCD34D', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6']
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === formRef1.current && !hasTriggeredConfetti1.current) {
              triggerConfetti();
              hasTriggeredConfetti1.current = true;
            }
            if (entry.target === formRef2.current && !hasTriggeredConfetti2.current) {
              triggerConfetti();
              hasTriggeredConfetti2.current = true;
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    if (formRef1.current) observer.observe(formRef1.current);
    if (formRef2.current) observer.observe(formRef2.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setSubmitMessage(result.message);
        form.reset();
      } else {
        setSubmitMessage(result.message || 'Something went wrong. Please try again or email us directly at hi@yourlovefilms.com');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitMessage('Something went wrong. Please try again or email us directly at hi@yourlovefilms.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <SimpleVideoHero
        videoSrc="https://firebasestorage.googleapis.com/v0/b/lovefilms-d618e.firebasestorage.app/o/homevideo.mp4?alt=media"
        subtitle="📍 Tennessee"
      />

      <FeaturedOn />

      {/* Booking Form Section */}
      <section ref={formRef1} className="py-20 px-4 bg-white dark:bg-neutral-950">
        <div className="mx-auto max-w-4xl">
          <div id="booking" className="text-center mb-12">
            <h2 className="text-3xl font-serif tracking-tight sm:text-5xl sm:leading-tight mb-4 text-black dark:text-white">
              Check if the date is available
            </h2>
            <p className="text-md max-w-[600px] mx-auto font-medium text-neutral-600 dark:text-neutral-400 sm:text-xl">
              Fill out the form below and we'll discuss your special day!
            </p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-8 md:p-12">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal"
                placeholder="Name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal"
                placeholder="Email Address"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Cell Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal"
                placeholder="Cell Phone Number"
              />
            </div>

            <div>
              <label htmlFor="fianceName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Fiance's Full Name
              </label>
              <input
                type="text"
                id="fianceName"
                name="fianceName"
                required
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal"
                placeholder="Fiance's Full Name"
              />
            </div>

            <div>
              <label htmlFor="weddingDate" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Wedding Date (Estimate if Unsure)
              </label>
              <input
                type="text"
                id="weddingDate"
                name="weddingDate"
                required
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal"
                placeholder="Wedding Date (Estimate if Unsure)"
              />
            </div>

            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Wedding Venue/s
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                required
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal"
                placeholder="Wedding Venue/s"
              />
            </div>

            <div>
              <label htmlFor="videographer" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Do You Have A Videographer Booked Yet? (Yes/No)
              </label>
              <input
                type="text"
                id="videographer"
                name="videographer"
                required
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal"
                placeholder="Do You Have A Videographer Booked Yet? (Yes/No)"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-black font-bold text-lg py-4 px-8 rounded-lg transition-colors duration-200 uppercase tracking-wider disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
            </button>

            {submitMessage && (
              <div className={`text-center p-4 rounded-lg ${submitMessage.includes('Thank you') ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'}`}>
                {submitMessage}
              </div>
            )}
          </form>
        </div>
      </section>
      
      <MeetTheCrew />
      
      <LoveNotes />
      
      <LetsTravel />
      
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

      {/* Second Booking Form Section */}
      <section ref={formRef2} className="py-20 px-4 bg-white dark:bg-neutral-950">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif tracking-tight sm:text-5xl sm:leading-tight mb-4 text-black dark:text-white">
              Check if the date is available
            </h2>
            <p className="text-md max-w-[600px] mx-auto font-medium text-neutral-600 dark:text-neutral-400 sm:text-xl">
              Fill out the form below and we'll discuss your special day!
            </p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-8 md:p-12">
            <div>
              <label htmlFor="name2" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name2"
                name="name"
                required
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal"
                placeholder="Name"
              />
            </div>

            <div>
              <label htmlFor="email2" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email2"
                name="email"
                required
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal"
                placeholder="Email Address"
              />
            </div>

            <div>
              <label htmlFor="phone2" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Cell Phone Number
              </label>
              <input
                type="tel"
                id="phone2"
                name="phone"
                required
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal"
                placeholder="Cell Phone Number"
              />
            </div>

            <div>
              <label htmlFor="fianceName2" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Fiance's Full Name
              </label>
              <input
                type="text"
                id="fianceName2"
                name="fianceName"
                required
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal"
                placeholder="Fiance's Full Name"
              />
            </div>

            <div>
              <label htmlFor="weddingDate2" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Wedding Date (Estimate if Unsure)
              </label>
              <input
                type="text"
                id="weddingDate2"
                name="weddingDate"
                required
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal"
                placeholder="Wedding Date (Estimate if Unsure)"
              />
            </div>

            <div>
              <label htmlFor="venue2" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Wedding Venue/s
              </label>
              <input
                type="text"
                id="venue2"
                name="venue"
                required
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal"
                placeholder="Wedding Venue/s"
              />
            </div>

            <div>
              <label htmlFor="videographer2" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Do You Have A Videographer Booked Yet? (Yes/No)
              </label>
              <input
                type="text"
                id="videographer2"
                name="videographer"
                required
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal"
                placeholder="Do You Have A Videographer Booked Yet? (Yes/No)"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-black font-bold text-lg py-4 px-8 rounded-lg transition-colors duration-200 uppercase tracking-wider disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
            </button>

            {submitMessage && (
              <div className={`text-center p-4 rounded-lg ${submitMessage.includes('Thank you') ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'}`}>
                {submitMessage}
              </div>
            )}
          </form>
        </div>
      </section>

      <InstagramScrollDemo />

      <Footer />
    </>
  );
}
