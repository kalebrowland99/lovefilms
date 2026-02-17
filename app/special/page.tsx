'use client';

import { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { DateField, DateInput } from '@/components/ui/datefield';
import { Label } from '@/components/ui/field';
import { PhoneInput } from '@/components/ui/phone-input';

export default function SpecialPricingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showCalendly, setShowCalendly] = useState(false);
  const [weddingDate, setWeddingDate] = useState<any>(null);
  const [phone, setPhone] = useState("");
  const formRef = useRef<HTMLDivElement>(null);
  const hasTriggeredConfetti = useRef(false);

  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  useEffect(() => {
    const triggerConfetti = () => {
      const isMobile = window.innerWidth < 768;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#DAA520', '#B8860B', '#F4C430', '#FFDF00'],
        scalar: isMobile ? 0.6 : 1
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target === formRef.current && !hasTriggeredConfetti.current) {
            // Delay confetti slightly to ensure form is in view
            setTimeout(() => {
              triggerConfetti();
              hasTriggeredConfetti.current = true;
            }, 300);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (formRef.current) observer.observe(formRef.current);

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
    
    // Add the wedding date from state
    if (weddingDate) {
      data.weddingDate = `${String(weddingDate.month).padStart(2, '0')}/${String(weddingDate.day).padStart(2, '0')}/${weddingDate.year}`;
    }
    
    // Add the phone number from state
    if (phone) {
      data.phone = phone;
    }

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
        // Trigger confetti
        const isMobile = window.innerWidth < 768;
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFA500', '#DAA520', '#B8860B', '#F4C430', '#FFDF00'],
          scalar: isMobile ? 0.6 : 1
        });
        
        setShowCalendly(true);
        
        // Load Calendly script if not already loaded
        if (!document.querySelector('script[src*="calendly"]')) {
          const script = document.createElement('script');
          script.src = 'https://assets.calendly.com/assets/external/widget.js';
          script.async = true;
          document.body.appendChild(script);
        }
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
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            src="https://firebasestorage.googleapis.com/v0/b/lovefilms-d618e.firebasestorage.app/o/homevideo.mp4?alt=media"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-white text-sm md:text-base tracking-[0.3em] uppercase mb-6 font-light">
            WEDDING VIDEOGRAPHY PRICING
          </p>
          <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-serif mb-4 leading-tight tracking-tight">
            TIMELESS FILMS.
          </h1>
          <h2 className="text-white text-5xl md:text-7xl lg:text-8xl font-serif mb-4 leading-tight tracking-tight">
            HONEST PRICING.
          </h2>
          <h2 className="text-white text-5xl md:text-7xl lg:text-8xl font-serif leading-tight tracking-tight">
            REAL STORIES.
          </h2>
        </div>
      </section>

      {/* Booking Offer Section */}
      <section className="py-20 px-4 bg-[#D9D3C7]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8 text-[#5C5548] leading-tight">
            BOOK WITHIN 10 DAYS OF INQUIRING<br />
            AND GET 15% OFF YOUR WEDDING<br />
            FILM PACKAGE.
          </h2>
          
          <p className="text-lg text-[#5C5548] mb-4">
            It's our little way of saying thank you for<br />
            trusting us with your story.
          </p>
          
          <p className="text-sm text-[#5C5548] mb-12">
            Please note: discounts cannot be combined or<br />
            stacked with other offers.
          </p>
          
          <div className="mb-8">
            <p className="text-lg font-medium text-[#5C5548] mb-4">
              TO SECURE YOUR DATE, WE REQUIRE:
            </p>
            <p className="text-base text-[#5C5548] mb-2">
              50% retainer upon signing the contract
            </p>
            <p className="text-base text-[#5C5548] mb-8">
              Remaining 50% due one month before<br />
              your wedding day
            </p>
          </div>
          
          <p className="text-base text-[#5C5548] mb-12 max-w-2xl mx-auto">
            Once your date is confirmed, we handle<br />
            the rest. Coordination, planning, and all<br />
            the behind-the-scenes details so you can<br />
            focus on being fully present.
          </p>
          
          <div className="flex justify-center">
            <a 
              href="#booking"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#5C5548] text-[#D9D3C7] hover:bg-[#4A4438] transition-colors text-sm tracking-widest uppercase border-2 border-[#5C5548]"
            >
              CHECK AVAILABILITY →
            </a>
          </div>
        </div>
      </section>

      {/* Pricing Packages Section */}
      <section className="py-20 px-4 bg-[#7A7265]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* The Classic Edit */}
            <div className="bg-[#2A2A2A] border-4 border-white p-8 flex flex-col h-full">
              <div className="flex-grow">
                <h3 className="text-4xl md:text-5xl font-serif text-white text-center mb-8 leading-tight">
                  THE<br />CLASSIC<br />EDIT
                </h3>
                
                <div className="text-center mb-8">
                  <p className="text-sm text-white mb-1">ORIGINALLY: $1,883</p>
                  <p className="text-lg text-white font-semibold">DISCOUNTED PRICE: $1,600</p>
                </div>
                
                <h4 className="text-xl text-white font-semibold mb-6 text-center">INCLUSIONS</h4>
                
                <ul className="space-y-3 text-white text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Documentary film of all major moments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>1 Cinematographer</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>6 hours of Coverage</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Dedicated Wedding Film Specialist</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Aerial video with drone</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8">
                <a 
                  href="#booking"
                  className="block w-full py-4 border-2 border-white text-white hover:bg-white hover:text-[#2A2A2A] transition-colors text-center text-sm tracking-wider"
                >
                  CHECK AVAILABILITY →
                </a>
              </div>
            </div>

            {/* The Enduring Story */}
            <div className="bg-[#2A2A2A] border-4 border-white p-8 flex flex-col h-full">
              <div className="flex-grow">
                <h3 className="text-4xl md:text-5xl font-serif text-white text-center mb-8 leading-tight">
                  THE<br />ENDURING<br />STORY
                </h3>
                
                <div className="text-center mb-6">
                  <p className="text-sm text-white mb-1">ORIGINALLY: $3,412</p>
                  <p className="text-lg text-white font-semibold">DISCOUNTED PRICE: $2,900</p>
                </div>
                
                <h4 className="text-xl text-white font-semibold mb-6 text-center">INCLUSIONS</h4>
                
                <ul className="space-y-3 text-white text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Cinema composed highlight</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>1 Minute teaser</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Full length recording of the ceremony</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Documentary Film</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>8 hours of Coverage</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Dedicated Wedding Film Specialist</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>2 Cinematographers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Aerial video with drone</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8">
                <a 
                  href="#booking"
                  className="block w-full py-4 border-2 border-white text-white hover:bg-white hover:text-[#2A2A2A] transition-colors text-center text-sm tracking-wider"
                >
                  CHECK AVAILABILITY →
                </a>
              </div>
            </div>

            {/* The Legacy Film (Most Popular) */}
            <div className="bg-[#2A2A2A] border-4 border-white p-8 flex flex-col h-full relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#D9D3C7] px-4 py-1">
                <span className="text-[#2A2A2A] text-xs font-semibold tracking-wider">(MOST POPULAR)</span>
              </div>
              
              <div className="flex-grow">
                <h3 className="text-4xl md:text-5xl font-serif text-white text-center mb-8 leading-tight">
                  THE<br />LEGACY<br />FILM
                </h3>
                
                <div className="text-center mb-6">
                  <p className="text-sm text-white mb-1">ORIGINALLY: $4070</p>
                  <p className="text-lg text-white font-semibold">DISCOUNTED PRICE: $3459</p>
                </div>
                
                <h4 className="text-xl text-white font-semibold mb-6 text-center">INCLUSIONS</h4>
                
                <ul className="space-y-3 text-white text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Cinema composed highlight</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>1 Minute teaser</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Full length recording of the ceremony</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Documentary Film</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>10 hours of Coverage</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Dedicated Wedding Film Specialist</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>2 Master cinematographers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Aerial video with drone</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8">
                <a 
                  href="#booking"
                  className="block w-full py-4 border-2 border-white text-white hover:bg-white hover:text-[#2A2A2A] transition-colors text-center text-sm tracking-wider"
                >
                  CHECK AVAILABILITY →
                </a>
              </div>
            </div>

            {/* The Heirloom Collection */}
            <div className="bg-[#2A2A2A] border-4 border-white p-8 flex flex-col h-full">
              <div className="flex-grow">
                <h3 className="text-3xl md:text-4xl font-serif text-white text-center mb-8 leading-tight">
                  THE<br />HEIRLOOM<br />COLLECTION
                </h3>
                
                <div className="text-center mb-6">
                  <p className="text-sm text-white mb-1">ORIGINALLY: $5400</p>
                  <p className="text-lg text-white font-semibold">DISCOUNTED PRICE: $4590</p>
                </div>
                
                <h4 className="text-xl text-white font-semibold mb-6 text-center mt-12">INCLUSIONS</h4>
                
                <ul className="space-y-3 text-white text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Cinema composed highlight</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>1 Minute teaser</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Full length recording of the ceremony</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Documentary Film</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>12 hours of Coverage</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Dedicated Wedding Film Specialist</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>2 Cinematographers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Aerial video with drone</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Award winning cinema team will film your wedding</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Raw footage</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8">
                <a 
                  href="#booking"
                  className="block w-full py-4 border-2 border-white text-white hover:bg-white hover:text-[#2A2A2A] transition-colors text-center text-sm tracking-wider"
                >
                  CHECK AVAILABILITY →
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* A La Carte Pricing */}
      <section className="py-20 px-4 bg-[#7A7265]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#2A2A2A] border-4 border-white p-12 md:p-16">
            <h2 className="text-5xl md:text-6xl font-serif text-white text-center mb-16">
              A LA CARTE PRICING
            </h2>
            
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-8 text-white mb-16">
              <div>
                <div className="mb-6">
                  <p className="text-lg mb-2">• Engagement Video - $350</p>
                </div>
                <div className="mb-6">
                  <p className="text-lg mb-2">• Guest Video Book - $450</p>
                </div>
                <div className="mb-6">
                  <p className="text-lg mb-2">• Love Story Video - $450</p>
                </div>
                <div className="mb-6">
                  <p className="text-lg mb-2">• Save the date Video - $450</p>
                </div>
                <div className="mb-6">
                  <p className="text-lg mb-2">• Raw footage - $450</p>
                </div>
              </div>
              
              <div>
                <div className="mb-6">
                  <p className="text-lg mb-2">• Traveling fee - $1,200</p>
                  <p className="text-sm text-gray-300">(apply only out of TN)</p>
                </div>
                <div className="mb-6">
                  <p className="text-lg mb-2">• Overtime Rate/hour - $450</p>
                </div>
                <div className="mb-6">
                  <p className="text-lg mb-2">• Additional</p>
                  <p className="text-lg">Cinematographer - $450</p>
                </div>
                <div className="mb-6">
                  <p className="text-lg mb-2">• Rehearsal Dinner 1</p>
                  <p className="text-lg">Videographer - $450</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <a 
                href="#booking"
                className="inline-flex items-center justify-center px-12 py-4 bg-[#D9D3C7] text-[#2A2A2A] hover:bg-white transition-colors text-sm tracking-widest uppercase"
              >
                INQUIRE →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section ref={formRef} className="py-20 px-4 bg-white dark:bg-neutral-950">
        <div className="mx-auto max-w-4xl">
          {!showCalendly ? (
            <>
              <div id="booking" className="text-center mb-12">
                <h2 className="text-3xl font-serif tracking-tight sm:text-5xl sm:leading-tight mb-4 text-black dark:text-white">
                  Check if the date is available 💍
                </h2>
                <p className="text-md max-w-[600px] mx-auto font-medium text-neutral-600 dark:text-neutral-400 sm:text-xl">
                  We take on a limited number of weddings each year. Dates book on a first-come basis.
                </p>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-8 md:p-12">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Your Name
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
                    Phone Number (we won't spam you)
                  </label>
                  <div className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white dark:bg-neutral-800">
                    <PhoneInput
                      value={phone}
                      onChange={(value, formatted) => setPhone(formatted)}
                      defaultCountry="US"
                      showFlag={true}
                      className="border-none p-0 bg-transparent text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="fianceName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Instagram Name
                  </label>
                  <input
                    type="text"
                    id="fianceName"
                    name="fianceName"
                    required
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:font-normal"
                    placeholder="Instagram Name"
                  />
                </div>

                <div>
                  <DateField 
                    value={weddingDate} 
                    onChange={setWeddingDate}
                    isRequired
                    className="w-full"
                  >
                    <Label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Wedding Date (Estimate if Unsure)
                    </Label>
                    <DateInput className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100" />
                  </DateField>
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
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                    Where did you find us?
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="referralSource"
                        value="Facebook/Instagram"
                        required
                        className="w-4 h-4 text-blue-600 border-neutral-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="ml-3 text-neutral-900 dark:text-neutral-100">Facebook / Instagram</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="referralSource"
                        value="TikTok"
                        required
                        className="w-4 h-4 text-blue-600 border-neutral-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="ml-3 text-neutral-900 dark:text-neutral-100">TikTok</span>
                    </label>
                  </div>
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
            </>
          ) : (
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-serif tracking-tight sm:text-5xl sm:leading-tight mb-8 text-center text-black dark:text-white">
                Pick a time for me to call you.
              </h2>
              <div 
                className="calendly-inline-widget" 
                data-url="https://calendly.com/kalebrowland99/personal-wedding-call" 
                style={{ minWidth: '320px', height: '700px' }}
              />
            </div>
          )}
        </div>
      </section>

      {/* Location Section */}
      <section className="relative min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <video
            src="https://firebasestorage.googleapis.com/v0/b/lovefilms-d618e.firebasestorage.app/o/homevideo.mp4?alt=media"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-20">
          <div className="text-white space-y-8">
            <p className="text-xl md:text-2xl leading-relaxed">
              We proudly serve couples across Tennessee and beyond, offering wedding videography in: Nashville, Knoxville, Memphis, Chattanooga, and Franklin.
            </p>
            
            <p className="text-xl md:text-2xl leading-relaxed">
              We also travel to surrounding states: Kentucky, Georgia, Arkansas, Alabama, and Mississippi to bring your story to life wherever your celebration takes you.
            </p>
            
            <p className="text-sm md:text-base mt-8 text-gray-300">
              **For weddings outside of Tennessee, a $1,500 travel fee applies to cover transportation, lodging, and logistics for our team.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-4 bg-[#7A7265]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-8 leading-tight">
            READY TO BEGIN?
          </h2>
          
          <p className="text-xl text-white mb-4 max-w-2xl mx-auto leading-relaxed">
            Your wedding day only happens once! Let's make sure you can relive it forever. Reach out to check availability, view full package details, and see how we can tailor your wedding film to your vision.
          </p>
          
          <div className="flex justify-center mt-12">
            <a 
              href="#booking"
              className="inline-flex items-center justify-center px-10 py-5 border-2 border-white text-white hover:bg-white hover:text-[#7A7265] transition-colors text-sm tracking-widest uppercase"
            >
              CHECK AVAILABILITY →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
