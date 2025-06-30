'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';
import { projectData, FilterCategory } from '../data/projects';

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('Featured');
  const [isMobile, setIsMobile] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const filterCategories: FilterCategory[] = ['All', 'Featured', 'ML/AI', 'Full Stack'];

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setScreenWidth(width);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const filteredProjects = projectData.filter(project => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Featured') return project.featured;
    return project.categories.includes(activeFilter);
  });

  const getProjectCount = (category: FilterCategory) => {
    if (category === 'All') return projectData.length;
    if (category === 'Featured') return projectData.filter(p => p.featured).length;
    return projectData.filter(p => p.categories.includes(category)).length;
  };

  // Improved line breaking logic using standard practices
  const groupWordsByLines = (title: string) => {
    const words = title.split(' ');
    const lines: string[][] = [];
    let currentLine: string[] = [];
    
    // Use more generous line length limits based on screen size
    let maxLineLength = 20; // mobile default
    if (screenWidth >= 1024) {
      maxLineLength = 50; // lg and above - much more generous
    } else if (screenWidth >= 768) {
      maxLineLength = 22; // md - more aggressive clipping for 3-column layout
    } else if (screenWidth >= 640) {
      maxLineLength = 30; // sm
    }
    let currentLength = 0;

    words.forEach(word => {
      // Check if adding this word would exceed the line length
      const wouldExceed = currentLength + word.length + (currentLine.length > 0 ? 1 : 0) > maxLineLength;
      
      if (wouldExceed && currentLine.length > 0) {
        // Start a new line
        lines.push(currentLine);
        currentLine = [word];
        currentLength = word.length;
      } else {
        // Add to current line
        currentLine.push(word);
        currentLength += word.length + (currentLine.length > 1 ? 1 : 0);
      }
    });

    // Add the last line if it has content
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    return lines;
  };

  const handleFilterChange = async (newFilter: FilterCategory) => {
    if (newFilter === activeFilter) return;
    
    setIsTransitioning(true);
    
    // Start the white overlay animation
    setTimeout(() => {
      setActiveFilter(newFilter);
    }, 100);
    
    // End transition state after all animations complete
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  // Animation variants for the white overlay - LEFT TO RIGHT (Fixed TypeScript errors)
  const overlayVariants: Variants = {
    hidden: { 
      x: '-100%',
      opacity: 0 
    },
    visible: { 
      x: 0,
      opacity: 1
    },
    exit: { 
      x: '100%',
      opacity: 0
    }
  };

  // Animation variants for project grid container
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.05,
        staggerChildren: 0.06,
      }
    }
  };

  // Animation variants for individual projects - JERKY BOUNCE EFFECT (Fixed TypeScript errors)
  const projectVariants: Variants = {
    hidden: { 
      opacity: 0,
      y: 60,
      scale: 0.7,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    }
  };

  return (
    <div className="bg-white font-[family-name:var(--font-atkinson-hyperlegible)] pb-8 md:pb-20 overflow-hidden">
      <motion.div 
        className="w-full px-8 pt-4 pb-8 md:w-[80vw] md:mx-auto md:px-6 md:py-0 lg:px-0"
        layout
        transition={{ 
          layout: { 
            duration: 0.4, 
            ease: "easeInOut" 
          }
        }}
      >
        {/* Filter Section */}
        <div className="mb-4">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 items-center justify-center mb-6">
            {filterCategories.map((category) => (
              <div key={category} className="overflow-hidden rounded-xl group">
                <motion.button
                  onClick={() => handleFilterChange(category)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-xl duration-200 flex-shrink-0 border border-black cursor-pointer select-none ${
                    activeFilter === category
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-black hover:bg-gray-50'
                  }`}
                  style={{ minWidth: 'fit-content' }}
                  disabled={isTransitioning}
                >
                  {!isMobile ? (
                    <div className="overflow-hidden leading-tight" style={{ height: '1.2em' }}>
                      <motion.div
                        className="flex flex-col leading-tight group-hover:-translate-y-[1.2em] transition-transform duration-200"
                      >
                        <span className="whitespace-nowrap block select-none">
                          {category} ({getProjectCount(category)})
                        </span>
                        <span className="whitespace-nowrap block select-none">
                          {category} ({getProjectCount(category)})
                        </span>
                      </motion.div>
                    </div>
                  ) : (
                    <span className="whitespace-nowrap select-none">
                      {category} ({getProjectCount(category)})
                    </span>
                  )}
                </motion.button>
              </div>
            ))}
          </div>
          
          {/* Platform-dependent instruction - separate line */}
          <div className="text-center">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-[0.2em]">
              {isMobile ? 'Tap for details' : 'Click for details'}
            </span>
          </div>
        </div>

        {/* Projects Grid Container with Relative Positioning */}
        <motion.div 
          className="pt-6 relative overflow-hidden"
          layout
          transition={{ 
            layout: { 
              duration: 0.4, 
              ease: "easeInOut" 
            }
          }}
        >
          {/* White Overlay Animation */}
          <AnimatePresence mode="wait">
            {isTransitioning && (
              <motion.div
                key="overlay"
                className="absolute inset-0 bg-white z-10 pointer-events-none"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  duration: 0.2,
                  ease: [0.25, 0.1, 0.25, 1.0]
                }}
              />
            )}
          </AnimatePresence>

          {/* Projects Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 w-full"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              layout
              transition={{ 
                layout: { 
                  duration: 0.4, 
                  ease: "easeInOut" 
                }
              }}
            >
              {filteredProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                <motion.div
                  className="group cursor-pointer flex flex-col w-full"
                  variants={projectVariants}
                  layout
                  transition={{ 
                    layout: { 
                      duration: 0.4, 
                      ease: "easeInOut" 
                    },
                    duration: 0.3,
                    ease: [0.68, -0.55, 0.265, 1.55],
                    opacity: {
                      duration: 0.15,
                      ease: [0.25, 0.1, 0.25, 1.0]
                    }
                  }}
                >
                  <div className="flex flex-col h-full w-full">
                    {/* Project Image - Slightly rounded */}
                    <motion.div 
                      className="w-full aspect-square rounded-xs mb-2 group-hover:-translate-y-4 transition-transform duration-300 overflow-hidden flex items-center justify-center"
                      style={{ aspectRatio: '1/1', backgroundColor: '#f5f5f5' }}
                    >
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="rounded-xs object-contain"
                        style={{ width: '70%', height: 'auto' }}
                        loading="lazy"
                      />
                    </motion.div>

                    {/* Project Title Container - Fixed height for up to 2 lines */}
                    <div className="h-[3.2em] flex flex-col justify-start self-start w-full">
                      <div className="flex flex-col gap-1">
                        {groupWordsByLines(project.title).map((line, lineIndex) => (
                          <div key={lineIndex} className="flex gap-1">
                            {!isMobile ? (
                              <div className="overflow-hidden rounded-sm">
                                <motion.div
                                  className="bg-black text-white px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm font-medium select-none"
                                >
                                  <div className="overflow-hidden leading-tight" style={{ height: '1.2em' }}>
                                    <motion.div
                                      className="flex flex-col leading-tight group-hover:-translate-y-[1.2em] transition-transform duration-200"
                                    >
                                      <span className="block select-none">{line.join(' ')}</span>
                                      <span className="block select-none">{line.join(' ')}</span>
                                    </motion.div>
                                  </div>
                                </motion.div>
                              </div>
                            ) : (
                              <div className="overflow-hidden rounded-sm">
                                <motion.div
                                  className="bg-black text-white px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm font-medium select-none"
                                  whileHover={{ 
                                    scale: 1.05,
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
                                  }}
                                >
                                  {line.join(' ')}
                                </motion.div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        <AnimatePresence>
          {filteredProjects.length === 0 && !isTransitioning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
              layout
            >
              <p className="text-gray-500 text-lg">No projects found in this category.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 