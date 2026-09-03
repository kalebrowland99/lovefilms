'use client';

import { useRef, useEffect, useState } from 'react';

interface SimpleVideoHeroProps {
  videoSrc: string;
  title?: string;
  subtitle?: string;
}

export function SimpleVideoHero({ videoSrc, title, subtitle }: SimpleVideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      console.log('✅ Video loaded successfully');
      setIsLoading(false);
    };

    const handleError = (e: Event) => {
      console.error('❌ Video error:', e);
      const target = e.target as HTMLVideoElement;
      const error = target.error;
      if (error) {
        console.error('Video error code:', error.code);
        console.error('Video error message:', error.message);
        setVideoError(`Video failed to load: ${error.message}`);
      }
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      console.log('🔄 Video loading started...');
    };

    const handleCanPlay = () => {
      console.log('✅ Video can play');
      setIsLoading(false);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [videoSrc]);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Video */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ contentVisibility: 'auto' }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Loading/Error State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading video...</p>
          </div>
        </div>
      )}

      {videoError && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black">
          <div className="text-red-500 text-center p-4">
            <p className="text-xl mb-2">⚠️ Video Error</p>
            <p className="text-sm">{videoError}</p>
            <p className="text-xs mt-2 text-gray-400">Check console for details</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        {title && (
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal text-white">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg md:text-2xl text-white/90">
            {subtitle}
          </p>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <p className="text-white text-sm">Scroll down</p>
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

