'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { jobData, JobInfo } from '../data/a';

export default function Experience() {
  const [hoveredJob, setHoveredJob] = useState<JobInfo | null>(null);
  const [previousJobIndex, setPreviousJobIndex] = useState<number | null>(null);
  const [isLarge, setIsLarge] = useState(false);
  const [isXs, setIsXs] = useState(false);
  const [isLgOnly, setIsLgOnly] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsLarge(width >= 1024); // lg breakpoint
      setIsXs(width < 480); // xs breakpoint
      setIsLgOnly(width >= 1024 && width < 1280); // lg only (not xl)
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const isMobile = !isLarge;

  // Mobile letter variants
  const mobileLetterVariants: Variants = {
    initial: { y: 0, opacity: 1 },
    slide: (index: number) => ({
      y: -200 - (index * 30),
      opacity: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.06,
        ease: [0.4, 0, 0.2, 1]
      }
    })
  };

  // Desktop letter variants
  const desktopLetterVariants: Variants = {
    initial: { x: 0, opacity: 1 },
    slide: (index: number) => ({
      x: -600 - (index * 60),
      opacity: index >= 2 ? (index >= 4 ? 0 : 0.3) : 1,
      transition: {
        duration: 0.8,
        delay: index * 0.08,
        ease: [0.4, 0, 0.2, 1]
      }
    })
  };

  // Background variants
  const mobileBackgroundVariants: Variants = {
    initial: { y: 0 },
    slide: {
      y: -200 - ((isXs ? 10 : 9) * 30), // Adjust for 2 vs 3 lines
      transition: {
        duration: 0.6,
        delay: (isXs ? 10 : 9) * 0.06,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const desktopBackgroundVariants: Variants = {
    initial: { x: 0 },
    slide: {
      x: -600 - (9 * 60), // 9 letters total for EXPER + IENCE
      transition: {
        duration: 0.8,
        delay: 9 * 0.08,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  // Mobile handlers
  const handleJobToggle = (job: JobInfo) => {
    if (hoveredJob?.id === job.id) {
      setHoveredJob(null);
      setPreviousJobIndex(null);
    } else {
      if (hoveredJob) {
        setPreviousJobIndex(jobData.findIndex(j => j.id === hoveredJob.id));
      }
      setHoveredJob(job);
    }
  };

  // Desktop handlers
  const handleMouseEnter = (job: JobInfo) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    if (hoveredJob) {
      setPreviousJobIndex(jobData.findIndex(j => j.id === hoveredJob.id));
    }
    setHoveredJob(job);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredJob(null);
      setPreviousJobIndex(null);
    }, 100);
  };

  const getSlideDirection = (currentJob: JobInfo) => {
    if (previousJobIndex === null) return 0;
    const currentIndex = jobData.findIndex(j => j.id === currentJob.id);
    return currentIndex > previousJobIndex ? (isMobile ? 200 : 300) : (isMobile ? -200 : -300);
  };

  const infoVariants: Variants = {
    initial: (direction: number) => ({
      x: isMobile ? direction : 0,
      y: isMobile ? 0 : direction,
      opacity: isMobile ? 0 : 1
    }),
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: (direction: number) => ({
      x: isMobile ? -direction : 0,
      y: isMobile ? 0 : -direction,
      opacity: isMobile ? 0 : 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    })
  };

  // Mobile component (< lg)
  if (isMobile) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <div className="w-full px-6 py-16">
          <div className="relative h-[50vh] overflow-hidden">
            <div className="absolute inset-0 z-0">
              <AnimatePresence>
                {hoveredJob && (
                  <motion.div
                    key={hoveredJob.id}
                    custom={getSlideDirection(hoveredJob)}
                    variants={infoVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute inset-0 bg-white flex flex-col justify-center"
                  >
                    <div className="max-w-md mx-auto px-4 py-6 w-full">
                      <div className="mb-8">
                        <div className="text-4xl font-light text-black leading-none mb-1 tracking-tight">
                          {hoveredJob.title.split(' ')[0]}
                        </div>
                        {hoveredJob.title.split(' ').slice(1).join(' ') && (
                          <div className="text-4xl font-bold text-black leading-none tracking-tight mb-4">
                            {hoveredJob.title.split(' ').slice(1).join(' ')}
                          </div>
                        )}
                        <div className="flex items-center text-sm font-medium text-gray-600">
                          <span>{hoveredJob.startDate}</span>
                          <div className="w-4 h-px bg-gray-400 mx-3"></div>
                          <span>{hoveredJob.endDate}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                          Description
                        </div>
                        <div className="text-sm leading-relaxed text-black font-normal">
                          {hoveredJob.description}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              variants={mobileBackgroundVariants}
              animate={hoveredJob ? "slide" : "initial"}
              className="absolute inset-0 bg-white z-10"
            />

            {/* Mobile text layout - responsive based on screen size */}
            <div className="text-[6rem] font-bold leading-tight relative z-20 h-full flex flex-col justify-center font-[700] text-center">
              {isXs ? (
                // XS screens: EXP + ERIE + NCE (3 lines)
                <>
                  <div className="relative flex justify-center mb-2">
                    <div className="flex space-x-1">
                      {"EXP".split('').map((letter, index) => (
                        <motion.span
                          key={`exp-${index}`}
                          custom={index}
                          variants={mobileLetterVariants}
                          animate={hoveredJob ? "slide" : "initial"}
                          className="inline-block relative text-black"
                          style={{ zIndex: 30 - index }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  <div className="relative flex justify-center mb-2">
                    <div className="flex space-x-1">
                      {"ERIE".split('').map((letter, index) => (
                        <motion.span
                          key={`erie-${index}`}
                          custom={index + 3}
                          variants={mobileLetterVariants}
                          animate={hoveredJob ? "slide" : "initial"}
                          className="inline-block relative text-black"
                          style={{ zIndex: 30 - (index + 3) }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  <div className="relative flex justify-center">
                    <div className="flex space-x-1">
                      {"NCE".split('').map((letter, index) => (
                        <motion.span
                          key={`nce-${index}`}
                          custom={index + 7}
                          variants={mobileLetterVariants}
                          animate={hoveredJob ? "slide" : "initial"}
                          className="inline-block relative text-black"
                          style={{ zIndex: 30 - (index + 7) }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                // SM/MD screens: EXPER + IENCE (2 lines)
                <>
                  <div className="relative flex justify-center mb-2">
                    <div className="flex space-x-1">
                      {"EXPER".split('').map((letter, index) => (
                        <motion.span
                          key={`exper-${index}`}
                          custom={index}
                          variants={mobileLetterVariants}
                          animate={hoveredJob ? "slide" : "initial"}
                          className="inline-block relative text-black"
                          style={{ zIndex: 30 - index }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  <div className="relative flex justify-center">
                    <div className="flex space-x-1">
                      {"IENCE".split('').map((letter, index) => (
                        <motion.span
                          key={`ience-${index}`}
                          custom={index + 5}
                          variants={mobileLetterVariants}
                          animate={hoveredJob ? "slide" : "initial"}
                          className="inline-block relative text-black"
                          style={{ zIndex: 30 - (index + 5) }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="w-full">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-6 text-center">
              Select Experience
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {jobData.map((job) => (
                <motion.button
                  key={job.id}
                  className={`px-4 py-6 rounded-lg border-2 transition-all duration-200 text-center ${
                    hoveredJob?.id === job.id 
                      ? 'border-black bg-black text-white' 
                      : 'border-gray-200 bg-white text-black hover:border-gray-400'
                  }`}
                  onClick={() => handleJobToggle(job)}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                >
                  <div className="text-base font-medium mb-1">
                    {job.company}
                  </div>
                  <div className="text-xs opacity-70">
                    {job.title}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop component (lg and above)
  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="w-[77vw] mx-auto py-32">
        <div className="flex">
          <div className={`${isLgOnly ? 'w-[70%]' : 'w-[60%]'} relative h-96 flex flex-col overflow-hidden`}>
            <div className="absolute inset-0 z-0">
              <AnimatePresence>
                {hoveredJob && (
                  <motion.div
                    key={hoveredJob.id}
                    custom={getSlideDirection(hoveredJob)}
                    variants={infoVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={`absolute inset-0 bg-white ${isLgOnly ? 'p-6' : 'p-8'} flex flex-col`}
                  >
                    <div className="flex justify-between items-start mb-16">
                      <div className="flex-1">
                        <div className="text-6xl font-light text-black leading-none mb-2 tracking-tight">
                          {hoveredJob.title.split(' ')[0]}
                        </div>
                        {hoveredJob.title.split(' ').slice(1).join(' ') && (
                          <div className="text-6xl font-bold text-black leading-none tracking-tight">
                            {hoveredJob.title.split(' ').slice(1).join(' ')}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-lg font-medium text-black mb-2">
                          {hoveredJob.endDate}
                        </div>
                        <div className="w-8 h-px bg-black mb-2"></div>
                        <div className="text-lg font-medium text-black">
                          {hoveredJob.startDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 flex items-end">
                      <div className="max-w-md">
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                          Description
                        </div>
                        <div className="text-base leading-relaxed text-black font-normal">
                          {hoveredJob.description}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              variants={desktopBackgroundVariants}
              animate={hoveredJob ? "slide" : "initial"}
              className="absolute inset-0 bg-white z-10"
            />

            {/* Desktop: EXPER + IENCE */}
            <div className={`text-[12rem] font-bold leading-none relative z-20 h-full flex flex-col font-[700] ${isLgOnly ? 'px-2' : 'px-4'}`}>
              <div className="relative flex-1 flex items-center">
                <div className="relative w-full">
                  <div className="flex justify-between w-full text-black uppercase">
                    {"exper".split('').map((letter, index) => (
                      <motion.span
                        key={`exper-${index}`}
                        custom={index}
                        variants={desktopLetterVariants}
                        animate={hoveredJob ? "slide" : "initial"}
                        className="inline-block relative"
                        style={{ zIndex: 30 - index }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative flex-1 flex items-center">
                <div className="relative w-full">
                  <div className="flex justify-between w-full text-black uppercase">
                    {"ience".split('').map((letter, index) => (
                      <motion.span
                        key={`ience-${index}`}
                        custom={index + 5}
                        variants={desktopLetterVariants}
                        animate={hoveredJob ? "slide" : "initial"}
                        className="inline-block relative"
                        style={{ zIndex: 30 - (index + 5) }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${isLgOnly ? 'w-[30%]' : 'w-[40%]'} flex flex-col justify-center items-center`}>
            {jobData.map((job, index) => (
              <motion.div
                key={job.id}
                className={`text-3xl cursor-pointer relative text-center font-medium ${
                  index === 0 ? 'py-8' : index === jobData.length - 1 ? 'py-8 -mt-4' : 'py-8 -mt-4'
                }`}
                onMouseEnter={() => handleMouseEnter(job)}
                onMouseLeave={handleMouseLeave}
                whileHover={{ x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <span className="relative">
                  {job.company}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-current"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}