'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Bio() {
  const [isLarge, setIsLarge] = useState(false);
  const [isXs, setIsXs] = useState(false);
  const [hoveredGuitar, setHoveredGuitar] = useState(false);
  const [hoveredCar, setHoveredCar] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsLarge(width >= 1024); // lg breakpoint
      setIsXs(width < 480); // xs breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const isMobile = !isLarge;

  if (isMobile) {
    return (
      <div className="bg-white">
        <div className="w-full px-6 py-8">
          <div className="flex flex-col items-center gap-8">
            {/* Header */}
            <div className="w-full flex flex-col items-center justify-center text-center">
              <motion.div 
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-3xl md:text-5xl text-gray-600 font-light tracking-wide">
                  hello i'm
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative flex items-center justify-center"
              >
                <h1 className="text-7xl md:text-9xl font-bold text-black tracking-tight leading-none">
                  jae
                </h1>
                <span 
                  className="text-7xl md:text-9xl font-bold tracking-tight leading-none absolute"
                  style={{ 
                    color: '#F8C46F',
                    left: '100%',
                    marginLeft: '0.1em'
                  }}
                >
                  *
                </span>
              </motion.div>
            </div>

            {/* Bio Content */}
            <div className="w-full">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex justify-center"
              >
                <p className={`text-xl leading-relaxed text-black max-w-2xl text-center ${isXs ? 'px-2' : 'px-8'}`}>
                  As a <span style={{ color: '#1E407C' }}>Penn State CS</span> student, I research{' '}
                  <span style={{ color: '#FF6B6B' }}>Computer Assisted Driving</span> at{' '}
                  <a 
                    href="https://www.ime.psu.edu/research/facilities-and-labs/human-technology-interaction-lab.aspx" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="transition-opacity duration-300 ease-out hover:opacity-70"
                    style={{ color: '#1E407C' }}
                  >
                    HTI Lab
                  </a>{' '}
                  and build <span style={{ color: '#5A9BD5' }}>AR solutions</span> at{' '}
                  <a 
                    href="https://jiayoutennis.net" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="transition-opacity duration-300 ease-out hover:opacity-70"
                    style={{ color: '#6ABF6F' }}
                  >
                    JiaYou Tennis
                  </a>. Beyond tech, I lead AAPI organizations, spearheading fundraising initiatives that have raised over $10,000. When not coding, you'll find me{' '}
                  <span 
                    className="relative cursor-pointer"
                    style={{ color: '#F8C46F' }}
                    onMouseEnter={() => setHoveredGuitar(true)}
                    onMouseLeave={() => setHoveredGuitar(false)}
                  >
                    playing guitar
                    {hoveredGuitar && (
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none block">
                        Ibanez AS53 ( ◡̀_◡́)ᕤ
                      </span>
                    )}
                  </span>{' '}
                  or{' '}
                  <span 
                    className="relative cursor-pointer"
                    style={{ color: '#F8C46F' }}
                    onMouseEnter={() => setHoveredCar(true)}
                    onMouseLeave={() => setHoveredCar(false)}
                  >
                    working on my car
                    {hoveredCar && (
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none block">
                        2017 WRX STI \(`v´)/
                      </span>
                    )}
                  </span>.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop component (lg and above)
  return (
    <div className="bg-white" style={{ height: '600px' }}>
      <div className="w-[70vw] mx-auto py-16 h-full">
        <div className="flex items-center h-full gap-0">
          {/* Left side - 40% */}
          <div className="w-2/5 flex flex-col items-center justify-center text-center">
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-6xl text-gray-600 font-light tracking-wide">
                hello i'm
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative flex items-center justify-center"
            >
              <h1 className="text-[12rem] xl:text-[14rem] font-bold text-black tracking-tight leading-none">
                jae
              </h1>
              <span 
                className="text-[12rem] xl:text-[14rem] font-bold tracking-tight leading-none absolute"
                style={{ 
                  color: '#F8C46F',
                  left: '100%',
                  marginLeft: '0.1em'
                }}
              >
                *
              </span>
            </motion.div>
          </div>

          {/* Right side - 60% */}
          <div className="w-3/5 pl-12 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex justify-center w-full"
            >
              <p className="text-3xl leading-relaxed text-black max-w-2xl text-center">
                As a <span style={{ color: '#1E407C' }}>Penn State CS</span> student, I research{' '}
                <span style={{ color: '#FF6B6B' }}>Computer Assisted Driving</span> at{' '}
                <a 
                  href="https://www.ime.psu.edu/research/facilities-and-labs/human-technology-interaction-lab.aspx" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="transition-opacity duration-300 ease-out hover:opacity-70"
                  style={{ color: '#1E407C' }}
                >
                  HTI Lab
                </a>{' '}
                and build <span style={{ color: '#5A9BD5' }}>AR solutions</span> at{' '}
                <a 
                  href="https://jiayoutennis.net" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="transition-opacity duration-300 ease-out hover:opacity-70"
                  style={{ color: '#6ABF6F' }}
                >
                  JiaYou Tennis
                </a>. Beyond tech, I lead AAPI organizations, spearheading fundraising initiatives that have raised over $10,000. When not coding, you'll find me{' '}
                <span 
                  className="relative cursor-pointer"
                  style={{ color: '#F8C46F' }}
                  onMouseEnter={() => setHoveredGuitar(true)}
                  onMouseLeave={() => setHoveredGuitar(false)}
                >
                  playing guitar
                  {hoveredGuitar && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none block">
                      Ibanez AS53 ( ◡̀_◡́)ᕤ
                    </span>
                  )}
                </span>{' '}
                or{' '}
                <span 
                  className="relative cursor-pointer"
                  style={{ color: '#F8C46F' }}
                  onMouseEnter={() => setHoveredCar(true)}
                  onMouseLeave={() => setHoveredCar(false)}
                >
                  working on my car
                  {hoveredCar && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none block">
                      2017 WRX STI \(`v´)/
                    </span>
                  )}
                </span>.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 