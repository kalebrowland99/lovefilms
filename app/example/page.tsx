'use client';

import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import { CALENDLY_BOOKING_URL } from '@/lib/calendly';

export default function ExamplePage() {
  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1280&auto=format&fit=crop"
      bgImageSrc="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop"
      title="Wedding Team"
      date="Professional Video Production"
      scrollToExpand="Scroll to Explore"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">
            Capturing Your Story
          </h2>
          <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
            Welcome to Your Love Films — a wedding photography and videography
            team creating visual stories that capture the essence of your day.
          </p>
          <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
            Our photographer and filmmaker tell one story together — photographs
            and film, from the first look through the last dance.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
            Our Services
          </h3>
          <ul className="space-y-3 text-lg text-gray-700 dark:text-gray-300">
            <li>• Wedding Photography</li>
            <li>• Wedding Videography</li>
            <li>• Elopements</li>
            <li>• Couple sessions</li>
          </ul>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
            Why Choose Us
          </h3>
          <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
            With state-of-the-art equipment and a creative approach, we deliver
            videos that exceed expectations. Our commitment to quality and
            attention to detail ensures your story is told beautifully.
          </p>
        </section>

        <section className="text-center py-8">
          <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
            Ready to Get Started?
          </h3>
          <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
            Contact us today to discuss your project and receive a custom quote.
          </p>
          <a
            href={CALENDLY_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Get in Touch
          </a>
        </section>
      </div>
    </ScrollExpandMedia>
  );
}

