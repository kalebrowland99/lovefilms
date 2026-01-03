"use client";
import { cn } from "@/lib/utils";
import { InfiniteSlider } from "@/components/ui/infinite-slider";

export function FeaturedOn() {
  const publications = [
    "The Knot",
    "WeddingWire",
    "Zola",
    "Brides",
    "Martha Stewart Weddings",
    "Style Me Pretty",
    "Junebug Weddings",
    "Green Wedding Shoes",
    "Over The Moon",
    "Carats & Cake",
  ];

  return (
    <section className="relative py-20 bg-white dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-10">
        <div className="overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
          <InfiniteSlider gap={64} reverse={false} speed={40} speedOnHover={15}>
            {publications.map((name, index) => (
              <div
                key={`pub-${index}`}
                className="flex items-center justify-center px-4"
              >
                <span className="text-black/60 dark:text-white/60 font-serif text-lg md:text-xl font-semibold whitespace-nowrap tracking-wide">
                  {name}
                </span>
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </div>
    </section>
  );
}
