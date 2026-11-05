'use client';

import {
  PRE_CALL_VIDEO_ID,
  PRE_CALL_VIDEO_START_SECONDS,
} from '@/lib/calendly';
import { YoutubePreview } from '@/components/ui/youtube-preview';

export function PreCallVideo() {
  return (
    <YoutubePreview
      videoId={PRE_CALL_VIDEO_ID}
      title="Pre-call video — The Love Team"
      startSeconds={PRE_CALL_VIDEO_START_SECONDS}
    />
  );
}
