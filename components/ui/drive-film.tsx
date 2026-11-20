'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

interface DriveFilmProps {
  driveId: string;
  thumb: string;
  title: string;
}

export function DriveFilm({ driveId, thumb, title }: DriveFilmProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative w-full aspect-video bg-[#070707] overflow-hidden">
      {playing ? (
        <iframe
          src={`https://drive.google.com/file/d/${driveId}/preview`}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={title}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b8370]"
          aria-label={`Play video: ${title}`}
        >
          <Image
            src={thumb}
            alt={title}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
          <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/25" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-[#8b8370]/95 text-white shadow-lg transition-transform group-hover:scale-105">
              <Play className="h-7 w-7 md:h-8 md:w-8 fill-current ml-1" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
