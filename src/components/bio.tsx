'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { COLORS, LINKS } from '@/lib/constants';

// ---------------------------------------------------------------------------
// HobbyTooltip — interactive inline text with a hover/focus tooltip.
// Extracted from the 6 near-identical copies (3 hobbies × 2 layouts).
// ---------------------------------------------------------------------------

interface HobbyTooltipProps {
  label: string;
  tooltip: string;
}

function HobbyTooltip({ label, tooltip }: HobbyTooltipProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="relative cursor-pointer"
      style={{ color: COLORS.accent }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
      {hovered && (
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none block">
          {tooltip}
        </span>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Shared bio paragraph — used by both mobile and desktop layouts so the
// actual copy is defined in one place.
// ---------------------------------------------------------------------------

function BioContent({ className = '' }: { className?: string }) {
  return (
    <p className={className}>
      A <span style={{ color: COLORS.pennState }}>Penn State</span> student researching{' '}
      <span style={{ color: COLORS.coral }}>Computer Assisted Driving</span> at{' '}
      <a
        href={LINKS.htiLab}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity duration-300 ease-out hover:opacity-70"
        style={{ color: COLORS.linkBlue }}
      >
        HTI Lab
      </a>
      . Solving real problems for real people. Hobbies include{' '}
      <HobbyTooltip label="cars" tooltip="2017 WRX STI \(`v´)/" />,{' '}
      <HobbyTooltip label="guitars" tooltip="Ibanez AS53 ( ◡̀_◡́)ᕤ" />, and{' '}
      <HobbyTooltip label="the arts" tooltip="graphic design is my passion :v" />.
    </p>
  );
}

// ---------------------------------------------------------------------------
// NameHeading — the "hello i'm" + "jae*" heading, shared across layouts.
// ---------------------------------------------------------------------------

function NameHeading({
  greetingClass,
  nameClass,
}: {
  greetingClass: string;
  nameClass: string;
}) {
  return (
    <>
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <p className={greetingClass}>hello i&apos;m</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="relative flex items-center justify-center"
      >
        <h1 className={`${nameClass} font-bold text-black tracking-tight leading-none`}>
          jae
        </h1>
        <span
          className={`${nameClass} font-bold tracking-tight leading-none`}
          style={{ color: COLORS.accent, marginLeft: '0.1em' }}
        >
          *
        </span>
      </motion.div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Bio (default export)
// ---------------------------------------------------------------------------

export default function Bio() {
  const { isLg, isXs } = useBreakpoint();

  // ── Mobile layout (< lg) ────────────────────────────────────────────────
  if (!isLg) {
    return (
      <div className="bg-white">
        <div className="w-full px-6 py-8">
          <div className="flex flex-col items-center gap-10">
            {/* Name heading */}
            <div className="w-full flex flex-col items-center justify-center text-center">
              <NameHeading
                greetingClass="text-3xl md:text-5xl text-gray-600 font-light tracking-wide"
                nameClass="text-7xl md:text-9xl"
              />
            </div>

            {/* Bio text */}
            <div className="w-full flex justify-center">
              <div className="w-[80%]">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="flex justify-center"
                >
                  <BioContent
                    className={`text-xl leading-relaxed text-black text-center ${isXs ? 'px-2' : 'px-8'
                      }`}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Desktop layout (≥ lg) ───────────────────────────────────────────────
  return (
    <div className="bg-white" style={{ height: '600px' }}>
      <div className="w-[70vw] mx-auto py-16 h-full">
        <div className="flex items-center h-full gap-0">
          {/* Left column — name (40%) */}
          <div className="w-2/5 flex flex-col items-center justify-center text-center">
            <NameHeading
              greetingClass="text-6xl text-gray-600 font-light tracking-wide"
              nameClass="text-[12rem] xl:text-[14rem]"
            />
          </div>

          {/* Right column — bio text (60%) */}
          <div className="w-3/5 pl-12 h-full flex items-center justify-center">
            <div className="w-[80%]">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex justify-center w-full"
              >
                <BioContent className="text-3xl leading-relaxed text-black text-center" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}