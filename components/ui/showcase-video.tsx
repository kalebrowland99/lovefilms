'use client';

import { useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

export function ShowcaseVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      try {
        await video.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-black aspect-video border border-[#E8DED2] shadow-lg">
      <video
        ref={videoRef}
        src={src}
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        onEnded={() => setPlaying(false)}
      />

      <button
        type="button"
        onClick={togglePlayback}
        className={
          playing
            ? 'absolute bottom-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#8b8370]/95 text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b8370] focus-visible:ring-offset-2'
            : 'absolute inset-0 z-10 flex items-center justify-center bg-black/10 transition-colors hover:bg-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b8370] focus-visible:ring-offset-2'
        }
        aria-label={playing ? 'Pause video' : 'Play video'}
      >
        {playing ? (
          <Pause className="h-5 w-5 fill-current" />
        ) : (
          <span className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-[#8b8370]/95 text-white shadow-lg backdrop-blur-sm transition-transform hover:scale-105">
            <Play className="h-7 w-7 md:h-8 md:w-8 fill-current ml-1" />
          </span>
        )}
      </button>
    </div>
  );
}
