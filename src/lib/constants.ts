/**
 * Design tokens and shared constants for the portfolio.
 *
 * Centralizes values that were previously hardcoded across 10+ components,
 * making global design changes a single-file edit.
 */

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

/** Primary accent color used for highlights, CTAs, and brand elements. */
export const COLORS = {
  accent: '#F8C46F',
  /** Dark neutral used for primary text and filled UI elements. */
  dark: '#3B3B3B',
  /** Penn State navy — used in bio section. */
  pennState: '#1E407C',
  /** Coral red — used for research highlight in bio. */
  coral: '#FF6B6B',
  /** HTI Lab link blue. */
  linkBlue: '#1397d5',
} as const;

// ---------------------------------------------------------------------------
// Breakpoints (px)
// ---------------------------------------------------------------------------

/**
 * Matches Tailwind's default breakpoints so JS logic stays in sync with CSS.
 * Usage: `window.innerWidth >= BREAKPOINTS.md`
 */
export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------

/** Shared easing curve used across most Framer Motion transitions. */
export const EASE_DEFAULT = [0.4, 0, 0.2, 1] as const;

/** Standard spring config for interactive elements (buttons, toggles). */
export const SPRING_INTERACTIVE = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 20,
};

// ---------------------------------------------------------------------------
// External links
// ---------------------------------------------------------------------------

export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/jaeminbirdsall/',
  github: 'https://github.com/JaeMinBird',
  email: 'mailto:jaeminbird@gmail.com',
  resume: '/documents/RESUME.pdf',
  htiLab:
    'https://www.ime.psu.edu/research/facilities-and-labs/human-technology-interaction-lab.aspx',
} as const;
