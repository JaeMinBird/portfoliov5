'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { projectData, ProjectInfo, FilterCategory } from '../data/projects';

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('Featured');
  const [isMobile, setIsMobile] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

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
    return project.category === activeFilter;
  });

  const getProjectCount = (category: FilterCategory) => {
    if (category === 'All') return projectData.length;
    if (category === 'Featured') return projectData.filter(p => p.featured).length;
    return projectData.filter(p => p.category === category).length;
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



    const handleFilterChange = (newFilter: FilterCategory) => {
    setActiveFilter(newFilter);
  };



 

  return (
    <div className="bg-white font-[family-name:var(--font-atkinson-hyperlegible)] pb-8 md:pb-20">
      <div className="w-full px-8 py-8 md:w-[80vw] md:mx-auto md:px-6 md:py-0 lg:px-0">
        {/* Filter Section */}
        <div className="mb-6">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 items-center justify-center mb-4">
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

        {/* Projects Grid */}
        <div className="pt-6">
          <div
            key={activeFilter}
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          >
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group cursor-pointer flex flex-col"
              >
                  <div className="flex flex-col h-full">
                    {/* Project Image - Slightly rounded */}
                    <motion.div 
                      className="w-full aspect-square bg-gray-100 rounded-xs mb-2 group-hover:-translate-y-4 transition-transform duration-300"
                      style={{ aspectRatio: '1/1' }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 text-sm md:text-lg font-medium rounded-xs">
                        {project.title}
                      </div>
                    </motion.div>

                    {/* Project Title Container - Fixed height for up to 2 lines */}
                    <div className="h-[3.2em] flex flex-col justify-start self-start">
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
                </div>
              ))}
            </div>
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-gray-500 text-lg">No projects found in this category.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
} 