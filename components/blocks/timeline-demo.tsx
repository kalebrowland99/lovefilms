import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";

export function TimelineDemo() {
  const data = [
    {
      title: "Planning",
      content: (
        <div>
          <p className="text-[#5C4033] dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            We'll hop on a call to discuss your vision, preferences, and all the details that make your wedding unique. 
            This is where we get to know you and create a customized plan for your big day.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/Wedding_Ceremony_Arch_original_342300.jpg"
              alt="wedding ceremony arch"
              width={500}
              height={500}
              className="rounded-2xl object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-[#E8DED2] dark:border-neutral-800"
            />
            <Image
              src="/Newlywed_Holding_Hands_And_Kissing_original_2835800.jpg"
              alt="newlywed couple holding hands"
              width={500}
              height={500}
              className="rounded-2xl object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-[#E8DED2] dark:border-neutral-800"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Wedding Day",
      content: (
        <div>
          <p className="text-[#5C4033] dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            The big day! We'll capture every precious moment, from getting ready to the last dance. 
            Our team works discreetly to document your wedding story as it naturally unfolds.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/Wedding_Couple_Kissing_At_Sunset_original_2436406.jpg"
              alt="wedding couple kissing at sunset"
              width={500}
              height={500}
              className="rounded-2xl object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-[#E8DED2] dark:border-neutral-800"
            />
            <Image
              src="/Wedding_Couple_Hugging_At_Sunset_original_2436396.jpg"
              alt="wedding couple hugging at sunset"
              width={500}
              height={500}
              className="rounded-2xl object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-[#E8DED2] dark:border-neutral-800"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Video Delivery",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
            Fast & quality delivery with revisions included. Your beautifully edited wedding film 
            will be ready to share and cherish for a lifetime.
          </p>
          <div className="mb-8">
            <div className="flex gap-2 items-center text-[#8B7355] dark:text-neutral-300 text-xs md:text-sm">
              • Professional Color Grading
            </div>
            <div className="flex gap-2 items-center text-[#8B7355] dark:text-neutral-300 text-xs md:text-sm">
              • Cinematic Editing
            </div>
            <div className="flex gap-2 items-center text-[#8B7355] dark:text-neutral-300 text-xs md:text-sm">
              • Music & Sound Design
            </div>
            <div className="flex gap-2 items-center text-[#8B7355] dark:text-neutral-300 text-xs md:text-sm">
              • Revisions Included
            </div>
            <div className="flex gap-2 items-center text-[#8B7355] dark:text-neutral-300 text-xs md:text-sm">
              • Fast Turnaround Time
            </div>
          </div>
          <div className="w-full">
            <video
              src="https://firebasestorage.googleapis.com/v0/b/lovefilms-d618e.firebasestorage.app/o/vidextra.mp4?alt=media"
              autoPlay
              muted
              loop
              playsInline
              className="rounded-2xl object-cover w-full h-48 md:h-64 lg:h-80 shadow-lg border border-[#E8DED2] dark:border-neutral-800"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Quick Previews",
      content: (
        <div id="quick-previews">
          <p className="text-[#5C4033] dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Watch our latest work and see the quality and creativity we bring to every project.
          </p>
          <div className="mb-8">
            {/* Video */}
            <div className="w-full">
              <div style={{ padding: '56.25% 0 0 0', position: 'relative' }} className="rounded-2xl overflow-hidden shadow-lg border border-[#E8DED2] dark:border-neutral-800">
                <iframe
                  src="https://player.vimeo.com/video/1151089615?badge=0&autopause=0&player_id=0&app_id=58479"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  title="Quick Preview"
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}

