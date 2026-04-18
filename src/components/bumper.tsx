'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { COLORS } from '@/lib/constants';

// ---------------------------------------------------------------------------
// BumperProps
// ---------------------------------------------------------------------------

interface BumperProps {
  className?: string;
  /** Section number displayed on the left (e.g. "01"). */
  number: string | number;
  /** Section label displayed to the right of the number. */
  sectionHeader: string;
  /** HTML id used for anchor-link scrolling. */
  id?: string;
}

/**
 * Full-width section divider with a scroll-driven fill animation.
 *
 * Architecture: Three layers are stacked inside a pill-shaped container.
 *
 * 1. **Outer border** — accent-colored pill outline.
 * 2. **Fill bar** — accent-colored bar scaled via `transform: scaleX()`
 *    driven by a framer-motion `MotionValue`, so scroll updates don't
 *    trigger React re-renders.
 * 3. **Dual text layers** — the bottom layer is accent-colored text, the
 *    top layer is white text revealed by scaling an overlay clip.
 */
export default function Bumper({ className = '', number, sectionHeader, id }: BumperProps) {
  const bumperRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPastStart, setIsPastStart] = useState(false);

  // Scroll progress from "bumper top hits viewport bottom" (0) → "bumper top
  // hits viewport top" (1).
  const { scrollYProgress } = useScroll({
    target: bumperRef,
    offset: ['start end', 'start start'],
  });

  // scaleX and clip reveal both derive from the same MotionValue → no React
  // re-render occurs during scroll.
  const clipRight = useTransform(scrollYProgress, (v) => `inset(0 ${(1 - v) * 100}% 0 0)`);

  useEffect(() => {
    const el = bumperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Track whether the user has fully scrolled past the bumper so it stays
  // "revealed" once they've cleared it. Only updates on boundary crossings.
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setIsPastStart((prev) => {
      const next = v >= 1;
      return prev === next ? prev : next;
    });
  });

  const isRevealed = isVisible || isPastStart;

  const fadeInClass = isRevealed
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-2';

  return (
    <div id={id} ref={bumperRef} className={`w-full py-6 px-6 md:px-0 relative ${className}`}>
      <div className="relative h-12 w-full md:w-[80vw] md:mx-auto">
        {/* Outer pill border */}
        <div
          className="absolute inset-0 rounded-full border-2 bg-transparent overflow-hidden"
          style={{ borderColor: COLORS.accent }}
        >
          {/* Inner gap + fill bar */}
          <div className="absolute inset-1 rounded-full bg-transparent overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full w-full origin-left rounded-full"
              style={{
                backgroundColor: COLORS.accent,
                scaleX: scrollYProgress,
              }}
            />
          </div>
        </div>

        {/* Accent-colored text (bottom layer) */}
        <div className="absolute inset-0 flex items-center px-6">
          <div className="flex items-center gap-3">
            <span
              className={`font-bold text-lg transition-all duration-700 ${fadeInClass}`}
              style={{ color: COLORS.accent }}
            >
              {number}
            </span>
            <span
              className={`font-medium text-sm uppercase tracking-wider transition-all duration-700 ${fadeInClass}`}
              style={{ color: COLORS.accent }}
            >
              {sectionHeader}
            </span>
          </div>
        </div>

        {/* White text overlay — clipped from the right, driven by MotionValue */}
        <motion.div
          className="absolute inset-0 flex items-center px-6"
          style={{ clipPath: clipRight }}
        >
          <div className="flex items-center gap-3">
            <span className={`font-bold text-lg text-white transition-all duration-700 ${fadeInClass}`}>
              {number}
            </span>
            <span className={`font-medium text-sm uppercase tracking-wider text-white transition-all duration-700 ${fadeInClass}`}>
              {sectionHeader}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
