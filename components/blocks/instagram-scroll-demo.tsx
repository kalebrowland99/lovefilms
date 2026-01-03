"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import { IconBrandInstagram } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function InstagramScrollDemo({ className }: { className?: string }) {
  return (
    <section className={cn("bg-white dark:bg-neutral-950 pb-10", className)}>
      <ContainerScroll
        titleComponent={
          <>
            <h2 className="text-4xl font-semibold text-black dark:text-white">
              Follow Our Journey on <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none text-black dark:text-white">
                Instagram
              </span>
            </h2>
          </>
        }
      >
        <a
          href="https://instagram.com/urlovefilms"
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full w-full cursor-pointer bg-white dark:bg-neutral-950 overflow-hidden"
        >
          <div className="h-full w-full p-4 md:p-8">
            {/* Instagram Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-white dark:bg-neutral-950 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop"
                      alt="Profile"
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-black dark:text-white">@urlovefilms</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Your Love Films</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">📍 Tennessee • 🎥 Wedding Films</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-around mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="text-center">
                <div className="font-semibold text-black dark:text-white">247</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-black dark:text-white">12.5K</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-black dark:text-white">892</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">Following</div>
              </div>
            </div>

            {/* Grid of images */}
            <div className="grid grid-cols-3 gap-1">
              {[
                "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&h=400&fit=crop",
              ].map((src, i) => (
                <div key={i} className="aspect-square relative overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <Image
                    src={src}
                    alt={`Post ${i + 1}`}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full hover:opacity-90 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        </a>
      </ContainerScroll>
      <a
        href="https://instagram.com/urlovefilms"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-300 -mt-24 md:-mt-32"
      >
        <IconBrandInstagram className="h-6 w-6" />
        <span className="text-lg font-medium">Tap to Visit @urlovefilms</span>
      </a>
    </section>
  );
}
