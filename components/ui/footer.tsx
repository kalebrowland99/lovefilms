'use client';

import React from 'react';
import Image from 'next/image';
import { IconBrandInstagram } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

export const Footer = ({ className }: { className?: string }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("bg-white dark:bg-neutral-950 text-black dark:text-white pt-32 pb-12", className)}>
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Brand Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
          <Image 
            src="/YLFText.png" 
            alt="Your Love Films" 
            width={300}
            height={60}
            className="h-10 md:h-14 w-auto object-contain dark:invert mb-2"
          />
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">Capturing love stories across Tennessee</p>
          <div className="flex space-x-4">
            <a href="https://instagram.com/urlovefilms" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
              <IconBrandInstagram size={24} />
            </a>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Contact</h4>
          <p className="text-neutral-600 dark:text-neutral-400 mb-2">Phone: (615) 200-0429</p>
          <p className="text-neutral-600 dark:text-neutral-400 mb-2">Email: <a href="mailto:hi@yourlovefilms.com" className="hover:text-black dark:hover:text-white transition-colors">hi@yourlovefilms.com</a></p>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-4">Proudly serving all of Tennessee.</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-neutral-200 dark:border-neutral-800 pt-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
        <p>&copy; {currentYear} Your Love Films. All rights reserved.</p>
      </div>
    </footer>
  );
};
