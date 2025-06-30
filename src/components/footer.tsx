'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface FooterProps {
  className?: string;
  width?: '60vw' | '80vw';
}

export default function Footer({ className = '', width = '80vw' }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [footerWidth, setFooterWidth] = useState('100%');

  useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth >= 768) {
        setFooterWidth(width);
      } else {
        setFooterWidth('100%');
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [width]);

  return (
    <div className="w-full px-6 md:px-0">
      <footer 
        className={`flex flex-col justify-between px-8 md:px-12 pt-4 md:pt-6 pb-0 relative overflow-hidden rounded-t-2xl md:mx-auto ${className}`}
        style={{ 
          backgroundColor: '#F8C46F',
          width: footerWidth
        }}
      >
        <div className="relative z-10 flex flex-col w-full h-full">
          {/* Call to action */}
          <div className="w-full mb-8 md:mb-12">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-fredoka text-white leading-none mb-2">
              learning more
            </h3>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-fredoka text-white leading-none">
              every day
            </h3>
          </div>

          {/* Socials */}
          <div className="w-full mb-8 md:mb-12">
            <div className="flex flex-col sm:flex-row xl:flex-row gap-2 sm:gap-4 xl:gap-8 text-white">
              <div className="overflow-hidden leading-none mb-2 sm:mb-0" style={{ height: '1.25rem' }}>
                <motion.a 
                  href="mailto:jaeminbird@gmail.com" 
                  className="text-lg md:text-xl font-medium flex flex-col leading-none"
                  whileHover={{ y: '-1.25rem' }}
                  transition={{ duration: 0.2 }}
                >
                  <span>Email</span>
                  <span>Email</span>
                </motion.a>
              </div>
              <div className="overflow-hidden leading-none mb-2 sm:mb-0" style={{ height: '1.25rem' }}>
                <motion.a 
                  href="https://www.linkedin.com/in/jaeminbirdsall/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg md:text-xl font-medium flex flex-col leading-none"
                  whileHover={{ y: '-1.25rem' }}
                  transition={{ duration: 0.2 }}
                >
                  <span>LinkedIn</span>
                  <span>LinkedIn</span>
                </motion.a>
              </div>
              <div className="overflow-hidden leading-none mb-2 sm:mb-0" style={{ height: '1.25rem' }}>
                <motion.a 
                  href="https://github.com/JaeMinBird" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg md:text-xl font-medium flex flex-col leading-none"
                  whileHover={{ y: '-1.25rem' }}
                  transition={{ duration: 0.2 }}
                >
                  <span>GitHub</span>
                  <span>GitHub</span>
                </motion.a>
              </div>
              <div className="overflow-hidden leading-none mb-2 sm:mb-0" style={{ height: '1.25rem' }}>
                <motion.a 
                  href="/resume.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg md:text-xl font-medium flex flex-col leading-none"
                  whileHover={{ y: '-1.25rem' }}
                  transition={{ duration: 0.2 }}
                >
                  <span>Resume</span>
                  <span>Resume</span>
                </motion.a>
              </div>
            </div>
          </div>

          {/* Logo positioned on the right side, cut in half */}
          <div className="absolute top-1/2 -translate-y-1/2 -right-34 md:-right-44 lg:-right-44 pointer-events-none">
            <Image
              src="/logo.svg"
              alt=""
              width={300}
              height={300}
              className="w-48 h-48 md:w-64 md:h-64 brightness-0 invert"
            />
          </div>

          {/* Copyright */}
          <div className="w-full mt-auto pb-2 md:pb-3">
            <p className="text-sm md:text-base text-white">
              © {currentYear} All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}