'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useScrollToSection } from '@/hooks/use-scroll-to-section';
import { COLORS } from '@/lib/constants';

/**
 * Fixed-position "SCROLL TO EXPLORE" CTA that fades and lifts away as the
 * user scrolls. Extracted as its own client component so the parent route
 * (`app/page.tsx`) can stay a server component.
 */
export default function ScrollIndicator() {
  const { scrollY } = useScroll();
  const scrollToSection = useScrollToSection(50);

  const parallaxY = useTransform(scrollY, [0, 200], [0, -60]);
  const opacity = useTransform(scrollY, [0, 100], [1, 0]);

  return (
    <motion.div
      className="fixed bottom-8 w-full flex justify-center cursor-pointer"
      style={{ y: parallaxY, opacity }}
      onClick={() => scrollToSection('about')}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-gray-600 mb-1">
          SCROLL TO
        </p>
        <p className="text-sm font-medium" style={{ color: COLORS.accent }}>
          EXPLORE
        </p>
      </div>
    </motion.div>
  );
}
