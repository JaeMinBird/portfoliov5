'use client';

import { useEffect, useRef, useState } from 'react';
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
 * 2. **Fill bar** — accent-colored bar that scales from 0→100% width as
 *    the user scrolls past. Uses `transform: scaleX()` for GPU compositing.
 * 3. **Dual text layers** — the bottom layer is accent-colored text, the
 *    top layer is white text clipped to the fill progress via `clip-path`.
 *    This creates the effect of text color "inverting" as the fill sweeps.
 */
export default function Bumper({ className = '', number, sectionHeader, id }: BumperProps) {
  const bumperRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );

    const handleScroll = () => {
      if (bumperRef.current) {
        const rect = bumperRef.current.getBoundingClientRect();
        const progress = 1 - rect.top / window.innerHeight;
        setScrollProgress(Math.min(Math.max(progress, 0), 1));
      }
    };

    const el = bumperRef.current;
    if (el) {
      observer.observe(el);
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // set initial value
    }

    return () => {
      if (el) observer.unobserve(el);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fadeInClass = isVisible
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
            <div
              className="absolute top-0 left-0 h-full transition-transform duration-1000 ease-out origin-left rounded-full"
              style={{
                backgroundColor: COLORS.accent,
                width: '100%',
                transform: `scaleX(${isVisible ? scrollProgress : 0})`,
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

        {/* White text overlay (clipped to fill progress) */}
        <div
          className="absolute inset-0 flex items-center px-6"
          style={{
            clipPath: `polygon(0 0, ${scrollProgress * 100}% 0, ${scrollProgress * 100}% 100%, 0 100%)`,
            transition: 'clip-path 700ms ease-out',
          }}
        >
          <div className="flex items-center gap-3">
            <span className={`font-bold text-lg text-white transition-all duration-700 ${fadeInClass}`}>
              {number}
            </span>
            <span className={`font-medium text-sm uppercase tracking-wider text-white transition-all duration-700 ${fadeInClass}`}>
              {sectionHeader}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}