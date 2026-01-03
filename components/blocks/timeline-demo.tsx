import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";

export function TimelineDemo() {
  const data = [
    {
      title: "Weddings",
      content: (
        <div>
          <p className="text-[#5C4033] dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Capture the magic of your special day with cinematic wedding videography. 
            From intimate ceremonies to grand celebrations, we tell your love story beautifully.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop"
              alt="wedding ceremony"
              width={500}
              height={500}
              className="rounded-2xl object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-[#E8DED2] dark:border-neutral-800"
            />
            <Image
              src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop"
              alt="wedding reception"
              width={500}
              height={500}
              className="rounded-2xl object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-[#E8DED2] dark:border-neutral-800"
            />
            <Image
              src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop"
              alt="wedding couple"
              width={500}
              height={500}
              className="rounded-2xl object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-[#E8DED2] dark:border-neutral-800"
            />
            <Image
              src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop"
              alt="wedding details"
              width={500}
              height={500}
              className="rounded-2xl object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-[#E8DED2] dark:border-neutral-800"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Corporate",
      content: (
        <div>
          <p className="text-[#5C4033] dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Professional corporate video production that elevates your brand. From company 
            profiles to product launches, we create content that drives results.
          </p>
          <p className="text-[#5C4033] dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Our corporate services include promotional videos, training content, event coverage, 
            and brand storytelling that resonates with your audience.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop"
              alt="corporate event"
              width={500}
              height={500}
              className="rounded-2xl object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-[#E8DED2] dark:border-neutral-800"
            />
            <Image
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop"
              alt="business team"
              width={500}
              height={500}
              className="rounded-2xl object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-[#E8DED2] dark:border-neutral-800"
            />
            <Image
              src="https://images.unsplash.com/photo-1560439514-4e9645039924?w=800&h=600&fit=crop"
              alt="office work"
              width={500}
              height={500}
              className="rounded-2xl object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-[#E8DED2] dark:border-neutral-800"
            />
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
              alt="team meeting"
              width={500}
              height={500}
              className="rounded-2xl object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-[#E8DED2] dark:border-neutral-800"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Events",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
            From concerts to conferences, we capture every memorable moment of your event 
            with professional-grade equipment and creative expertise.
          </p>
          <div className="mb-8">
            <div className="flex gap-2 items-center text-[#8B7355] dark:text-neutral-300 text-xs md:text-sm">
              ✅ Concert & Music Festival Coverage
            </div>
            <div className="flex gap-2 items-center text-[#8B7355] dark:text-neutral-300 text-xs md:text-sm">
              ✅ Conference & Seminar Recording
            </div>
            <div className="flex gap-2 items-center text-[#8B7355] dark:text-neutral-300 text-xs md:text-sm">
              ✅ Sports Events & Tournaments
            </div>
            <div className="flex gap-2 items-center text-[#8B7355] dark:text-neutral-300 text-xs md:text-sm">
              ✅ Private Parties & Celebrations
            </div>
            <div className="flex gap-2 items-center text-[#8B7355] dark:text-neutral-300 text-xs md:text-sm">
              ✅ Multi-Camera Live Production
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop"
              alt="event crowd"
              width={500}
              height={500}
              className="rounded-2xl object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-[#E8DED2] dark:border-neutral-800"
            />
            <Image
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop"
              alt="concert lights"
              width={500}
              height={500}
              className="rounded-2xl object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-[#E8DED2] dark:border-neutral-800"
            />
            <Image
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop"
              alt="conference"
              width={500}
              height={500}
              className="rounded-2xl object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-[#E8DED2] dark:border-neutral-800"
            />
            <Image
              src="https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=800&h=600&fit=crop"
              alt="stage performance"
              width={500}
              height={500}
              className="rounded-2xl object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-[#E8DED2] dark:border-neutral-800"
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
          <div className="space-y-6 mb-8">
            {/* Video 1 */}
            <div className="w-full">
              <div style={{ padding: '56.25% 0 0 0', position: 'relative' }} className="rounded-2xl overflow-hidden shadow-lg border border-[#E8DED2] dark:border-neutral-800">
                <iframe
                  src="https://player.vimeo.com/video/1151089615?badge=0&autopause=0&player_id=0&app_id=58479"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  title="Quick Preview 2"
                />
              </div>
            </div>

            {/* Video 2 */}
            <div className="w-full">
              <div style={{ padding: '56.25% 0 0 0', position: 'relative' }} className="rounded-2xl overflow-hidden shadow-lg border border-[#E8DED2] dark:border-neutral-800">
                <iframe
                  src="https://player.vimeo.com/video/1151089601?badge=0&autopause=0&player_id=0&app_id=58479"
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

