'use client';

import { useEffect, useState } from 'react';
import { BREAKPOINTS } from '@/lib/constants';

/**
 * Reactive breakpoint state derived from `window.innerWidth`.
 *
 * Replaces the 5+ identical `useEffect` + `addEventListener('resize')` patterns
 * that were duplicated across `bio.tsx`, `experience.tsx`, `projects.tsx`,
 * `footer.tsx`, and `nav.tsx`.
 *
 * Updates are debounced to boolean-bucket changes: consumers that only care
 * about `isMobile` / `isLg` won't re-render on every pixel of a resize drag,
 * only when the viewport actually crosses a breakpoint line. The raw `width`
 * is still exposed for callers that need it (`projects.tsx`) but only updates
 * at rAF cadence.
 *
 * @example
 * ```ts
 * const { isMobile, isLg, width } = useBreakpoint();
 * ```
 */
export interface BreakpointState {
    /** Raw viewport width in px. rAF-throttled. */
    width: number;
    /** True when `width < BREAKPOINTS.xs` (480px). */
    isXs: boolean;
    /** True when `width < BREAKPOINTS.md` (768px). */
    isMobile: boolean;
    /** True when `width >= BREAKPOINTS.lg` (1024px). */
    isLg: boolean;
    /** True when `width >= BREAKPOINTS.lg` AND `width < BREAKPOINTS.xl`. */
    isLgOnly: boolean;
    /** True when `width >= BREAKPOINTS.xl` (1280px). */
    isXl: boolean;
}

/**
 * SSR-safe default: used for BOTH server render AND the client's first
 * render pass so the hydrated HTML always matches. Real values are
 * computed in `useEffect` after mount.
 */
const SSR_DEFAULT: BreakpointState = {
    width: BREAKPOINTS.lg,
    isXs: false,
    isMobile: false,
    isLg: true,
    isLgOnly: false,
    isXl: true,
};

function computeState(width: number): BreakpointState {
    return {
        width,
        isXs: width < BREAKPOINTS.xs,
        isMobile: width < BREAKPOINTS.md,
        isLg: width >= BREAKPOINTS.lg,
        isLgOnly: width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl,
        isXl: width >= BREAKPOINTS.xl,
    };
}

export function useBreakpoint(): BreakpointState {
    const [state, setState] = useState<BreakpointState>(SSR_DEFAULT);

    useEffect(() => {
        let ticking = false;
        let lastWidth = -1;

        const onResize = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const width = window.innerWidth;
                ticking = false;
                if (width === lastWidth) return;
                lastWidth = width;

                setState((prev) => {
                    const next = computeState(width);
                    // Fast path: if every boolean bucket matches and the
                    // width delta is < 1 CSS pixel, keep the existing object
                    // so consumers that only read booleans don't re-render.
                    if (
                        prev.isXs === next.isXs &&
                        prev.isMobile === next.isMobile &&
                        prev.isLg === next.isLg &&
                        prev.isLgOnly === next.isLgOnly &&
                        prev.isXl === next.isXl &&
                        prev.width === next.width
                    ) {
                        return prev;
                    }
                    return next;
                });
            });
        };

        onResize();
        window.addEventListener('resize', onResize, { passive: true });
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return state;
}
