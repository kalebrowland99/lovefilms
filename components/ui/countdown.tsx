'use client';

import { useEffect, useState } from 'react';

interface BonusCountdownProps {
  deadlineISO: string;
  hostFirstName: string;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function BonusCountdown({ deadlineISO, hostFirstName }: BonusCountdownProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const deadline = new Date(deadlineISO).getTime();
  const remaining = now === null ? null : Math.max(0, deadline - now);

  if (remaining !== null && remaining <= 0) {
    return (
      <div className="mt-10">
        <p className="font-serif text-3xl md:text-4xl leading-tight">
          Your 48-hour window has ended
        </p>
        <p className="mt-3 text-base md:text-lg text-[#070707]/70">
          Text {hostFirstName} and we will take care of you.
        </p>
      </div>
    );
  }

  const totalSeconds = remaining === null ? null : Math.floor(remaining / 1000);
  const hours = totalSeconds === null ? 48 : Math.floor(totalSeconds / 3600);
  const minutes = totalSeconds === null ? 0 : Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds === null ? 0 : totalSeconds % 60;

  return (
    <div className="mt-10">
      <p className="font-serif text-6xl md:text-7xl leading-none tabular-nums">
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </p>
      <p className="mt-3 text-[11px] md:text-sm font-medium uppercase tracking-[0.25em] text-[#070707]/60">
        Hours · Minutes · Seconds left to lock in your bonuses
      </p>
    </div>
  );
}
