'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CANVAS,
  type CanvasBlock,
  type CanvasEl,
  type CanvasStyle,
} from '@/lib/showit-canvas';

const BREAKPOINT = 768;

export const FONT_VAR: Record<CanvasStyle['ff'], string> = {
  display: 'var(--font-serif-alt)',
  engraved: 'var(--font-engraved)',
  sans: 'var(--font-sans)',
  script: 'var(--font-serif)',
};

export type Mode = 'd' | 'm';

/**
 * Mirrors the Showit engine: a fixed design canvas (1200px desktop, 320px
 * mobile) scaled to the viewport, so every element keeps its authored position.
 */
export function useCanvasMode() {
  const [state, setState] = useState<{ mode: Mode; scale: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      const w = document.documentElement.clientWidth;
      const mode: Mode = w < BREAKPOINT ? 'm' : 'd';
      const base = CANVAS[mode];
      setState({ mode, scale: mode === 'm' ? w / base : Math.min(1, w / base) });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return state;
}

function RichText({ text }: { text: string }) {
  const nodes = useMemo(() => {
    const out: React.ReactNode[] = [];
    text.split('\n').forEach((line, li) => {
      if (li > 0) out.push(<br key={`br${li}`} />);
      line.split(/(\{\{i\}\}.*?\{\{\/i\}\})/g).forEach((part, pi) => {
        if (!part) return;
        const m = part.match(/^\{\{i\}\}(.*)\{\{\/i\}\}$/);
        out.push(
          m ? (
            <em key={`${li}-${pi}`} style={{ fontStyle: 'italic' }}>
              {m[1]}
            </em>
          ) : (
            <span key={`${li}-${pi}`}>{part}</span>
          )
        );
      });
    });
    return out;
  }, [text]);

  return <>{nodes}</>;
}

function Arrow({ dir, tone }: { dir: 'prev' | 'next'; tone: string }) {
  return (
    <svg viewBox="0 0 41 40" fill="none" style={{ width: '100%', height: '100%' }} aria-hidden>
      <path
        d={dir === 'next' ? 'M12 20h17m-6-6 6 6-6 6' : 'M29 20H12m6-6-6 6 6 6'}
        stroke={tone}
        strokeWidth="1"
        strokeLinecap="square"
      />
    </svg>
  );
}

function Slideshow({ imgs, priority }: { imgs: string[]; priority?: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (imgs.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % imgs.length), 4500);
    return () => clearInterval(t);
  }, [imgs.length]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {imgs.map((src, idx) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="60vw"
          priority={priority && idx === 0}
          style={{
            objectFit: 'cover',
            opacity: idx === i ? 1 : 0,
            transition: 'opacity 1.2s ease',
          }}
        />
      ))}
    </div>
  );
}

/** Continuously sliding band of stills, as Showit's sliding-gallery widget. */
/**
 * Muted looping film teaser. Playback is tied to visibility so a page of
 * previews only decodes the one on screen, and reduced-motion visitors keep
 * the poster frame.
 */
function FilmPreview({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}

function Marquee({
  imgs,
  height,
  reverse,
}: {
  imgs: string[];
  height: number;
  reverse?: boolean;
}) {
  const cell = Math.round(height * 0.75);
  const loop = [...imgs, ...imgs];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div
        className={reverse ? 'ylf-marquee ylf-marquee-reverse' : 'ylf-marquee'}
        style={{
          display: 'flex',
          gap: 15,
          height: '100%',
          width: 'max-content',
          ['--marquee-shift' as string]: `-${(cell + 15) * imgs.length}px`,
        }}
      >
        {loop.map((src, idx) => (
          <div
            key={`${src}-${idx}`}
            style={{ position: 'relative', width: cell, height: '100%', flex: '0 0 auto' }}
          >
            <Image src={src} alt="" fill sizes="30vw" style={{ objectFit: 'cover' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function textStyle(s: CanvasStyle): React.CSSProperties {
  return {
    fontFamily: FONT_VAR[s.ff],
    fontSize: s.fs,
    lineHeight: s.lh,
    letterSpacing: s.ls,
    textAlign: s.ta as React.CSSProperties['textAlign'],
    textTransform: s.tt as React.CSSProperties['textTransform'],
    color: s.c,
    fontStyle: s.fst,
    fontWeight: s.fw,
  };
}

/** Off-site destinations open in a new tab so the visitor keeps their place. */
function externalProps(href: string) {
  return /^https?:\/\//.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {};
}

function Element({
  el,
  mode,
  priority,
  dir,
  isArrow,
  arrowTone,
  marquee,
  onArrow,
  shown = true,
  layered = false,
}: {
  el: CanvasEl;
  mode: Mode;
  priority?: boolean;
  dir: 'prev' | 'next';
  isArrow: boolean;
  arrowTone: string;
  marquee?: 'forward' | 'reverse';
  onArrow?: (dir: 'prev' | 'next') => void;
  shown?: boolean;
  layered?: boolean;
}) {
  const box = mode === 'd' ? el.d : el.m;
  if (box.hide || !box.w) return null;

  const frame: React.CSSProperties = {
    position: 'absolute',
    left: box.l,
    top: box.t,
    width: box.w,
    height: box.h,
    opacity: shown ? (box.op ?? 1) : 0,
    transform:
      layered && el.kind === 'image' ? (shown ? 'scale(1)' : 'scale(0.96)') : undefined,
    zIndex: layered ? (shown ? (el.kind === 'image' ? 2 : 3) : 1) : undefined,
    pointerEvents: shown ? undefined : 'none',
  };

  const layerClass = layered
    ? `ylf-state-layer${shown ? '' : ' ylf-state-layer-out'}`
    : undefined;

  if (el.kind === 'video' && el.videos?.length) {
    const media = <FilmPreview src={el.videos[0]} poster={el.imgs?.[0]} />;
    return el.href ? (
      <Link
        href={el.href}
        style={frame}
        className={['ylf-canvas-link', 'ylf-canvas-link-media', layerClass].filter(Boolean).join(' ')}
        aria-label={el.label}
        {...externalProps(el.href)}
      >
        {media}
      </Link>
    ) : (
      <div style={frame} className={layerClass}>{media}</div>
    );
  }

  if (el.kind === 'image' && el.imgs?.length) {
    const media = marquee ? (
      <Marquee imgs={el.imgs} height={box.h} reverse={marquee === 'reverse'} />
    ) : (
      <Slideshow imgs={el.imgs} priority={priority} />
    );
    return el.href ? (
      <Link
        href={el.href}
        style={frame}
        className={['ylf-canvas-link', 'ylf-canvas-link-media', layerClass].filter(Boolean).join(' ')}
        aria-label={el.label}
        {...externalProps(el.href)}
      >
        {media}
      </Link>
    ) : (
      <div style={frame} className={layerClass}>{media}</div>
    );
  }

  if (el.kind === 'line') {
    return <div style={{ ...frame, backgroundColor: el.stroke ?? 'rgba(7,7,7,0.3)' }} />;
  }

  if (el.kind === 'icon' && isArrow) {
    const tone = el.stroke ?? arrowTone;
    return (
      <button
        type="button"
        aria-label={dir === 'next' ? 'Next' : 'Previous'}
        onClick={() => onArrow?.(dir)}
        style={{ ...frame, background: 'none', border: 0, padding: 0, cursor: 'pointer', zIndex: 5 }}
      >
        <Arrow dir={dir} tone={tone} />
      </button>
    );
  }

  if (el.kind === 'text' && el.text) {
    const s = mode === 'd' ? el.ds : el.ms;
    const typed = { ...frame, ...(s ? textStyle(s) : {}) };
    const inner = <RichText text={el.text} />;
    return el.href ? (
      <Link
        href={el.href}
        className={['ylf-canvas-link', layerClass, el.text === 'View Gallery' ? 'ylf-view-gallery' : '']
          .filter(Boolean)
          .join(' ')}
        style={{ ...typed, textDecoration: 'none', cursor: 'pointer' }}
        {...externalProps(el.href)}
      >
        {inner}
      </Link>
    ) : (
      <div style={typed} className={layerClass}>
        {inner}
      </div>
    );
  }

  // A bare linked box is an invisible hit area over the artwork beneath it.
  if (el.kind === 'box' && el.href && !el.button) {
    return (
      <Link
        href={el.href}
        style={frame}
        className="ylf-canvas-link"
        aria-label={el.label}
        {...externalProps(el.href)}
      />
    );
  }

  if (el.button) {
    const outline = el.button.variant === 'outline';
    return (
      <Link
        href={el.button.href}
        {...externalProps(el.button.href)}
        className={outline ? 'ylf-pill-outline' : 'ylf-pill-solid'}
        style={{
          ...frame,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT_VAR.display,
          fontSize: mode === 'd' ? 15 : 13,
          textDecoration: 'none',
          borderRadius: 100,
        }}
      >
        {el.button.label}
      </Link>
    );
  }

  return null;
}

/** Showit draws slider arrows in the colour that contrasts the block fill. */
function arrowToneFor(bg?: string | null) {
  const m = bg?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return 'rgba(7,7,7,0.85)';
  const [r, g, b] = m.slice(1, 4).map(Number);
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luma < 0.5 ? 'rgba(255,255,255,0.85)' : 'rgba(7,7,7,0.85)';
}

function Block({ block, mode, scale }: { block: CanvasBlock; mode: Mode; scale: number }) {
  const groups = block.states;
  const [state, setState] = useState(0);
  const height = mode === 'd' ? block.dh : block.mh;

  const grouped = groups
    ? block.els.filter((e) => groups.some((p) => e.sid.startsWith(p)))
    : [];
  const shared = groups
    ? block.els.filter((e) => !groups.some((p) => e.sid.startsWith(p)))
    : block.els;
  const activePrefix = groups?.[state];
  const active = activePrefix ? grouped.filter((e) => e.sid.startsWith(activePrefix)) : [];
  const visible = [...shared, ...active];
  const drawn = groups ? [...shared, ...grouped] : shared;

  const cycle = block.autoAdvanceMs;
  const count = groups?.length ?? 0;
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!cycle || count < 2 || paused) return;
    const t = setInterval(() => setState((v) => (v + 1) % count), cycle);
    return () => clearInterval(t);
  }, [cycle, count, paused]);

  const onArrow = (dir: 'prev' | 'next') => {
    if (!groups) return;
    setState((v) =>
      dir === 'next' ? (v + 1) % groups.length : (v - 1 + groups.length) % groups.length
    );
  };

  // Empty icon elements sitting in a horizontal pair are the slider controls;
  // the left-most one steps backwards.
  const arrowSids = new Set(
    groups ? visible.filter((e) => e.kind === 'icon').map((e) => e.sid) : []
  );
  const leftMost = visible
    .filter((e) => arrowSids.has(e.sid))
    .reduce<number>((min, e) => Math.min(min, (mode === 'd' ? e.d : e.m).l), Number.POSITIVE_INFINITY);

  // Full-bleed strips of many stills scroll; everything else cross-fades.
  const bands = visible.filter(
    (e) => e.kind === 'image' && (e.imgs?.length ?? 0) > 3 && (mode === 'd' ? e.d : e.m).w >= CANVAS[mode]
  );

  return (
    <section
      id={block.slug}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      style={{
        // Keeps in-page anchors clear of the fixed header.
        scrollMarginTop: mode === 'd' ? 103 : 54,
        // Showit blocks never clip vertically, so elements can bleed into the
        // neighbouring block; only the horizontal full-bleed needs containing.
        position: block.sticky ? 'sticky' : 'relative',
        top: block.sticky ? 0 : undefined,
        zIndex: block.zIndex,
        width: '100%',
        height: height * scale,
        backgroundColor: block.bg ?? 'transparent',
        overflowX: 'clip',
        overflowY: 'visible',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          width: CANVAS[mode],
          height,
          marginLeft: -CANVAS[mode] / 2,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        {drawn.map((el) => {
          const bandIndex = bands.indexOf(el);
          const layered = !!groups && grouped.includes(el);
          const shown = !layered || (!!activePrefix && el.sid.startsWith(activePrefix));
          return (
            <Element
              key={el.sid}
              el={el}
              mode={mode}
              priority={block.slug === 'hero'}
              isArrow={arrowSids.has(el.sid)}
              arrowTone={arrowToneFor(block.bg)}
              dir={(mode === 'd' ? el.d : el.m).l === leftMost ? 'prev' : 'next'}
              marquee={
                bandIndex < 0 ? undefined : bandIndex % 2 === 0 ? 'forward' : 'reverse'
              }
              onArrow={onArrow}
              layered={layered}
              shown={shown}
            />
          );
        })}
      </div>
    </section>
  );
}

export function ShowitCanvas({
  blocks,
  before,
  background = '#f9f9f5',
}: {
  blocks: CanvasBlock[];
  before?: (mode: Mode, scale: number) => React.ReactNode;
  background?: string;
}) {
  const state = useCanvasMode();
  if (!state) return null;

  return (
    <div style={{ backgroundColor: background, position: 'relative' }}>
      {before?.(state.mode, state.scale)}
      {blocks.map((b) => (
        <Block key={b.slug} block={b} mode={state.mode} scale={state.scale} />
      ))}
    </div>
  );
}
