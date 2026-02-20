'use client';

import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '@/lib/constants';

/**
 * Reactive breakpoint state derived from `window.innerWidth`.
 *
 * Replaces the 5+ identical `useEffect` + `addEventListener('resize')` patterns
 * that were duplicated across `bio.tsx`, `experience.tsx`, `projects.tsx`,
 * `footer.tsx`, and `nav.tsx`.
 *
 * @example
 * ```ts
 * const { isMobile, isLg, width } = useBreakpoint();
 * ```
 */
export interface BreakpointState {
    /** Raw viewport width in px. */
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

export function useBreakpoint(): BreakpointState {
    // Start with a fixed default to avoid hydration mismatch — the real
    // window-based values are set in the effect below after mount.
    const [state, setState] = useState<BreakpointState>(SSR_DEFAULT);

    useEffect(() => {
        const compute = (): BreakpointState => {
            const width = window.innerWidth;
            return {
                width,
                isXs: width < BREAKPOINTS.xs,
                isMobile: width < BREAKPOINTS.md,
                isLg: width >= BREAKPOINTS.lg,
                isLgOnly: width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl,
                isXl: width >= BREAKPOINTS.xl,
            };
        };

        const onResize = () => setState(compute());

        // Correct the SSR default to the real viewport on mount.
        onResize();

        window.addEventListener('resize', onResize, { passive: true });
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return state;
}
