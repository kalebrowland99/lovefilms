import React from 'react';
import { IconBrandInstagram, IconBrandFacebook, IconBrandYoutube } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

export const Footer = ({ className }: { className?: string }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("bg-white dark:bg-neutral-950 text-black dark:text-white pt-32 pb-12", className)}>
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="col-span-full md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left w-full">
          <h3 className="text-lg md:text-2xl font-bold text-black dark:text-white mb-2 whitespace-nowrap">YOUR LOVE FILMS</h3>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">Capturing love stories across Tennessee</p>
          <div className="flex space-x-4">
            <a href="https://instagram.com/urlovefilms" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
              <IconBrandInstagram size={24} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
              <IconBrandFacebook size={24} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
              <IconBrandYoutube size={24} />
            </a>
          </div>
        </div>

        {/* Services Column */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Services</h4>
          <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
            <li><a href="#services" className="hover:text-black dark:hover:text-white transition-colors">Wedding Videography</a></li>
            <li><a href="#services" className="hover:text-black dark:hover:text-white transition-colors">Corporate Videos</a></li>
            <li><a href="#services" className="hover:text-black dark:hover:text-white transition-colors">Event Coverage</a></li>
            <li><a href="#services" className="hover:text-black dark:hover:text-white transition-colors">Commercial Production</a></li>
            <li><a href="#services" className="hover:text-black dark:hover:text-white transition-colors">Drone Footage</a></li>
          </ul>
        </div>

        {/* Resources Column */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Resources</h4>
          <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
            <li><a href="#quick-previews" className="hover:text-black dark:hover:text-white transition-colors">Portfolio</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Pricing & Packages</a></li>
            <li><a href="#reviews" className="hover:text-black dark:hover:text-white transition-colors">Client Reviews</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">FAQs</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Blog</a></li>
            <li><a href="#booking" className="hover:text-black dark:hover:text-white transition-colors">Contact Us</a></li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Contact</h4>
          <p className="text-neutral-600 dark:text-neutral-400 mb-2">Phone: (888) 867-5309</p>
          <p className="text-neutral-600 dark:text-neutral-400 mb-2">Email: <a href="mailto:hi@yourlovefilms.com" className="hover:text-black dark:hover:text-white transition-colors">hi@yourlovefilms.com</a></p>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-4">Proudly serving all of Tennessee.</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-neutral-200 dark:border-neutral-800 pt-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
        <p>&copy; {currentYear} Your Love Films. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Sitemap</a>
        </div>
      </div>
    </footer>
  );
};
