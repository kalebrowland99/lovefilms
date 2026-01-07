'use client';

import { useRef, useEffect } from 'react';

export function LetsTravel() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedMetadata = () => {
        // Start video from the middle (50% of duration)
        video.currentTime = video.duration / 2;
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="https://firebasestorage.googleapis.com/v0/b/lovefilms-d618e.firebasestorage.app/o/homevideo.mp4?alt=media"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <div className="max-w-2xl">
          <h2 className="text-5xl md:text-7xl font-serif tracking-tight text-[#d4af7a] mb-6">
            LET'S<br />TRAVEL
          </h2>
          
          <p className="text-xl md:text-2xl font-serif italic text-white mb-6">
            Shooting weddings near, far and everywhere
          </p>
          
          <p className="text-lg md:text-xl text-white font-light mb-4">
            Based in Nashville, but ready to travel anywhere!
          </p>
          
          <p className="text-base md:text-lg text-white/90 leading-relaxed font-light">
            No matter where your wedding is, I want to be there! There is something so special to me about documenting love stories in locations all over the world. From varying scenery to different wedding styles and cultures. I love it all, and cannot wait to travel to your wedding!
          </p>
        </div>
      </div>

      {/* Decorative Circle (optional, matching the design) */}
      <div className="absolute top-10 right-10 w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/20"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 md:w-64 md:h-64 rounded-full border border-white/10"></div>
    </section>
  );
}

