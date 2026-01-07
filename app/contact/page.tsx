'use client';

import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const formRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasTriggeredConfetti = useRef(false);

  useEffect(() => {
    const triggerConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#DAA520', '#B8860B', '#F4C430', '#FFDF00']
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target === formRef.current && !hasTriggeredConfetti.current) {
            triggerConfetti();
            hasTriggeredConfetti.current = true;
          }
        });
      },
      { threshold: 0.3 }
    );

    if (formRef.current) observer.observe(formRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const handleLoadedMetadata = () => {
        if (videoElement.duration) {
          videoElement.currentTime = videoElement.duration / 2;
        }
      };

      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    console.log('Submitting form data:', data);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Response result:', result);

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
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center bg-black overflow-hidden">
        {/* Background Video */}
        <video
          src="https://firebasestorage.googleapis.com/v0/b/lovefilms-d618e.firebasestorage.app/o/homevideo.mp4?alt=media"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-normal tracking-wide">
            NEWLY ENGAGED?
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-24 px-4 bg-white dark:bg-neutral-950">
        <div className="max-w-4xl mx-auto">
          
          {/* Main Offer */}
          <div className="bg-[#d9d4c8] rounded-2xl p-6 md:p-12 mb-8">
            <h2 className="text-2xl md:text-4xl font-serif font-normal text-center mb-4 md:mb-6 text-neutral-800 leading-tight">
              A Rare Wedding Videography Opportunity for 2026–2027 Couples!
            </h2>
            
            <p className="text-base md:text-lg font-serif text-neutral-800 mb-4 md:mb-6">
              For a very limited time, only 3 newly engaged couples planning weddings in 2026 or 2027 in Tennessee can receive:
            </p>

            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-xl md:text-2xl font-serif flex-shrink-0">✓</span>
                <p className="text-base md:text-lg font-serif text-neutral-800">
                  $1,000 off my most popular wedding videography collection
                </p>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-xl md:text-2xl font-serif flex-shrink-0">✓</span>
                <p className="text-base md:text-lg font-serif text-neutral-800">
                  A complimentary engagement session when you book
                </p>
              </div>
            </div>

            <p className="text-base md:text-lg font-serif font-normal text-neutral-800 text-center">
              Once these 3 spots are claimed, this offer will not be extended.
            </p>
          </div>

          {/* Who This Is For */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-[#E8DED2] p-6 md:p-12 mb-6 md:mb-8">
            <h3 className="text-xl md:text-3xl font-serif font-normal text-center mb-4 md:mb-8 text-neutral-800 dark:text-neutral-100">
              Who This Is For?
            </h3>
            
            <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300 mb-4 md:mb-6">
              This opportunity is designed for couples who:
            </p>

            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-lg md:text-xl font-serif flex-shrink-0">•</span>
                <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300">
                  Value videography as a top priority
                </p>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-lg md:text-xl font-serif flex-shrink-0">•</span>
                <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300">
                  Want a calm, guided wedding day experience
                </p>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-lg md:text-xl font-serif flex-shrink-0">•</span>
                <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300">
                  Are ready to secure a trusted professional videographer early
                </p>
              </div>
            </div>
          </div>

          {/* Wedding Video */}
          <div className="mb-6 md:mb-8 rounded-2xl overflow-hidden border-2 border-[#E8DED2]">
            <video
              ref={videoRef}
              src="https://firebasestorage.googleapis.com/v0/b/lovefilms-d618e.firebasestorage.app/o/homevideo.mp4?alt=media"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-[250px] md:h-[400px] object-cover"
            />
          </div>

          {/* The Experience */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-[#E8DED2] p-6 md:p-12 mb-6 md:mb-8">
            <h3 className="text-xl md:text-3xl font-serif font-normal text-center mb-4 md:mb-8 text-neutral-800 dark:text-neutral-100">
              The Experience You're Securing
            </h3>
            
            <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300 mb-4 md:mb-6">
              The couples who book early get more than peace of mind — they get first access to planning support, priority scheduling, and a videographer who knows their vision long before the wedding day.
            </p>

            <p className="text-base md:text-lg font-serif font-normal text-neutral-800 dark:text-neutral-100 text-center">
              That's how wedding days stay calm and intentional.
            </p>
          </div>

          {/* What's Included */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-[#E8DED2] p-6 md:p-12 mb-6 md:mb-8">
            <h3 className="text-xl md:text-3xl font-serif font-normal text-center mb-4 md:mb-8 text-neutral-800 dark:text-neutral-100">
              What's Included?
            </h3>
            
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-[#8b8370] text-lg md:text-xl font-serif flex-shrink-0">✔</span>
                <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300">
                  $1,000 off my most popular wedding videography collection
                </p>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-[#8b8370] text-lg md:text-xl font-serif flex-shrink-0">✔</span>
                <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300">
                  A complimentary engagement session
                </p>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-[#8b8370] text-lg md:text-xl font-serif flex-shrink-0">✔</span>
                <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300">
                  A personalized, stress-free experience
                </p>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-[#8b8370] text-lg md:text-xl font-serif flex-shrink-0">✔</span>
                <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300">
                  Only 3 couples will receive this offer
                </p>
              </div>
            </div>
          </div>

          {/* How to Claim */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-[#E8DED2] p-6 md:p-12 mb-6 md:mb-8">
            <h3 className="text-xl md:text-3xl font-serif font-normal text-center mb-4 md:mb-8 text-neutral-800 dark:text-neutral-100">
              How to Claim One of the 3 Spots?
            </h3>
            
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-3 md:gap-4">
                <span className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#8b8370] text-white flex items-center justify-center font-serif font-normal text-sm md:text-base">
                  1
                </span>
                <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300 pt-0.5 md:pt-1">
                  Complete the short form below
                </p>
              </div>
              <div className="flex items-start gap-3 md:gap-4">
                <span className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#8b8370] text-white flex items-center justify-center font-serif font-normal text-sm md:text-base">
                  2
                </span>
                <p className="text-base md:text-lg font-serif text-neutral-800 dark:text-neutral-300 pt-0.5 md:pt-1">
                  I'll reach out with next steps
                </p>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-[#d9d4c8] border-2 border-[#8b8370] rounded-2xl p-6 md:p-12 mb-6 md:mb-8">
            <h3 className="text-xl md:text-3xl font-serif font-normal text-center mb-4 md:mb-6 text-neutral-800">
              Important Note
            </h3>
            
            <p className="text-base md:text-lg font-serif text-neutral-800 text-center">
              2026 dates are over 50% booked already and prime 2027 dates are already filling quickly due to recent engagements. Once these 3 offer spots are taken — or your date is booked by another couple — this opportunity is gone.
            </p>
          </div>

          {/* Apply Now Section */}
          <div ref={formRef} className="bg-white dark:bg-neutral-900 rounded-2xl border border-[#E8DED2] p-6 md:p-12">
            <h3 className="text-xl md:text-3xl font-serif font-normal text-center mb-6 md:mb-8 text-neutral-800 dark:text-neutral-100">
              Apply Now to Check Availability
            </h3>
            
            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 max-w-2xl mx-auto">
              <div>
                <label htmlFor="name" className="block text-sm font-serif font-normal text-neutral-700 dark:text-neutral-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-[#E8DED2] rounded-lg focus:ring-2 focus:ring-[#8b8370] focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal font-serif"
                  placeholder="Name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-serif font-normal text-neutral-700 dark:text-neutral-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-[#E8DED2] rounded-lg focus:ring-2 focus:ring-[#8b8370] focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal font-serif"
                  placeholder="Email Address"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-serif font-normal text-neutral-700 dark:text-neutral-300 mb-2">
                  Cell Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full px-4 py-3 border border-[#E8DED2] rounded-lg focus:ring-2 focus:ring-[#8b8370] focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal font-serif"
                  placeholder="Cell Phone Number"
                />
              </div>

              <div>
                <label htmlFor="fianceName" className="block text-sm font-serif font-normal text-neutral-700 dark:text-neutral-300 mb-2">
                  Fiance's Full Name
                </label>
                <input
                  type="text"
                  id="fianceName"
                  name="fianceName"
                  required
                  className="w-full px-4 py-3 border border-[#E8DED2] rounded-lg focus:ring-2 focus:ring-[#8b8370] focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal font-serif"
                  placeholder="Fiance's Full Name"
                />
              </div>

              <div>
                <label htmlFor="weddingDate" className="block text-sm font-serif font-normal text-neutral-700 dark:text-neutral-300 mb-2">
                  Wedding Date (Estimate if Unsure)
                </label>
                <input
                  type="text"
                  id="weddingDate"
                  name="weddingDate"
                  required
                  className="w-full px-4 py-3 border border-[#E8DED2] rounded-lg focus:ring-2 focus:ring-[#8b8370] focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal font-serif"
                  placeholder="Wedding Date (Estimate if Unsure)"
                />
              </div>

              <div>
                <label htmlFor="venue" className="block text-sm font-serif font-normal text-neutral-700 dark:text-neutral-300 mb-2">
                  Wedding Venue/s
                </label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  required
                  className="w-full px-4 py-3 border border-[#E8DED2] rounded-lg focus:ring-2 focus:ring-[#8b8370] focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal font-serif"
                  placeholder="Wedding Venue/s"
                />
              </div>

              <div>
                <label htmlFor="videographer" className="block text-sm font-serif font-normal text-neutral-700 dark:text-neutral-300 mb-2">
                  Do You Have A Videographer Booked Yet? (Yes/No)
                </label>
                <input
                  type="text"
                  id="videographer"
                  name="videographer"
                  required
                  className="w-full px-4 py-3 border border-[#E8DED2] rounded-lg focus:ring-2 focus:ring-[#8b8370] focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal font-serif"
                  placeholder="Do You Have A Videographer Booked Yet? (Yes/No)"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#8b8370] hover:bg-[#756d5f] disabled:bg-[#a39989] text-white font-serif font-normal text-lg py-4 px-8 rounded-lg transition-colors duration-200 uppercase tracking-wider disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
              </button>

              {submitMessage && (
                <div className={`text-center p-4 rounded-lg font-serif ${submitMessage.includes('Thank you') ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'}`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>

        </div>
      </section>
    </>
  );
}

