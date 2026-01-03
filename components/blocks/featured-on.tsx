"use client";
import Image from "next/image";
import { InfiniteSlider } from "@/components/ui/infinite-slider";

export function FeaturedOn() {
  const publications = [
    { name: "Carats + Cake", logo: "/caratscake.png" },
    { name: "Junebug Weddings", logo: "/junebugwedding.png" },
    { name: "Martha Stewart Weddings", logo: "/marthastewart.png" },
    { name: "Zola", logo: "/zola.png" },
    { name: "Style Me Pretty", logo: "/stylemepretty.png" },
    { name: "WeddingWire", logo: "/weddingwire.png" },
    { name: "The Knot", logo: "/theknot.png" },
    { name: "Brides", logo: "/brides.png" },
    { name: "Green Wedding Shoes", logo: "/greenweddingshoes.png" },
  ];

  return (
    <section className="relative py-20 bg-white dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-10">
        <div className="overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
          <InfiniteSlider gap={64} reverse={false} speed={40} speedOnHover={15}>
            {publications.map((pub, index) => (
              <div
                key={`pub-${index}`}
                className="flex items-center justify-center px-4"
              >
                <Image
                  src={pub.logo}
                  alt={pub.name}
                  width={200}
                  height={80}
                  className="h-12 md:h-16 w-auto object-contain opacity-60 dark:invert"
                />
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </div>
    </section>
  );
}
