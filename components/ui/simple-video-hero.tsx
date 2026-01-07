'use client';

interface SimpleVideoHeroProps {
  videoSrc: string;
  title?: string;
  subtitle?: string;
}

export function SimpleVideoHero({ videoSrc, title, subtitle }: SimpleVideoHeroProps) {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Video */}
      <video
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        {subtitle && (
          <p className="text-2xl md:text-3xl text-white mb-4">
            {subtitle}
          </p>
        )}
        {title && (
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal text-white">
            {title}
          </h1>
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

