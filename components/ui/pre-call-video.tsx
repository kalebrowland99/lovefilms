'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import {
  PRE_CALL_VIDEO_ID,
  PRE_CALL_VIDEO_START_SECONDS,
} from '@/lib/calendly';

export function PreCallVideo() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasStartedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [embedSrc, setEmbedSrc] = useState<string | null>(null);

  useEffect(() => {
    const origin = encodeURIComponent(window.location.origin);
    setEmbedSrc(
      `https://www.youtube-nocookie.com/embed/${PRE_CALL_VIDEO_ID}?enablejsapi=1&controls=0&disablekb=1&fs=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&autoplay=0&start=${PRE_CALL_VIDEO_START_SECONDS}&origin=${origin}`
    );
  }, []);

  const sendCommand = useCallback(
    (
      func: 'playVideo' | 'pauseVideo' | 'seekTo',
      args: string | number[] = ''
    ) => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        '*'
      );
    },
    []
  );

  const togglePlayback = () => {
    if (!embedSrc) return;

    if (playing) {
      sendCommand('pauseVideo');
      setPlaying(false);
      return;
    }

    if (!hasStartedRef.current) {
      sendCommand('seekTo', [PRE_CALL_VIDEO_START_SECONDS, true]);
      hasStartedRef.current = true;
    }

    sendCommand('playVideo');
    setPlaying(true);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-black aspect-video border border-[#E8DED2] shadow-lg">
      {!embedSrc ? (
        <div className="absolute inset-0 bg-neutral-900" aria-hidden />
      ) : (
        <iframe
          ref={iframeRef}
          src={embedSrc}
          title="Pre-call video — Your Love Films"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="absolute inset-0 h-full w-full border-0 pointer-events-none"
        />
      )}

      <button
        type="button"
        onClick={togglePlayback}
        disabled={!embedSrc}
        className={
          playing
            ? 'absolute bottom-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#8b8370]/95 text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b8370] focus-visible:ring-offset-2 disabled:opacity-50'
            : 'absolute inset-0 z-10 flex items-center justify-center bg-black/10 transition-colors hover:bg-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b8370] focus-visible:ring-offset-2 disabled:opacity-50'
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
