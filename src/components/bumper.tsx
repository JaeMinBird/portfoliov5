'use client';

import { useEffect, useRef, useState } from 'react';

type BumperProps = {
  className?: string;
  number: string | number;
  sectionHeader: string;
  id?: string;
};

export default function Bumper({ className = '', number, sectionHeader, id }: BumperProps) {
  const bumperRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    const handleScroll = () => {
      if (bumperRef.current) {
        const rect = bumperRef.current.getBoundingClientRect();
        const progress = 1 - (rect.top / window.innerHeight);
        setScrollProgress(Math.min(Math.max(progress, 0), 1));
      }
    };

    if (bumperRef.current) {
      observer.observe(bumperRef.current);
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    return () => {
      if (bumperRef.current) {
        observer.unobserve(bumperRef.current);
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div 
      id={id}
      ref={bumperRef}
      className={`w-full py-6 px-6 md:px-0 relative ${className}`}
    >
      {/* Pill-shaped container - consistent responsive width */}
      <div className="relative h-12 w-full md:w-[80vw] md:mx-auto">
        {/* Outer border (orange pill shape) */}
        <div className="absolute inset-0 rounded-full border-2 bg-transparent overflow-hidden" style={{ borderColor: '#F8C46F' }}>
          {/* Inner padding container to create transparent gap */}
          <div className="absolute inset-1 rounded-full bg-transparent overflow-hidden">
            {/* Orange fill that grows from left */}
            <div 
              className="absolute top-0 left-0 h-full transition-transform duration-1000 ease-out origin-left rounded-full"
              style={{ 
                backgroundColor: '#F8C46F',
                width: '100%', 
                transform: `scaleX(${isVisible ? scrollProgress : 0})` 
              }}
            />
          </div>
        </div>

        {/* Orange text (bottom layer) */}
        <div className="absolute inset-0 flex items-center px-6">
          <div className="flex items-center gap-3">
            <span 
              className={`font-bold text-lg transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
              style={{ color: '#F8C46F' }}
            >
              {number}
            </span>
            
            <span 
              className={`font-medium text-sm uppercase tracking-wider transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
              style={{ color: '#F8C46F' }}
            >
              {sectionHeader}
            </span>
          </div>
        </div>

        {/* White text overlay (only visible where fill covers) */}
        <div 
          className="absolute inset-0 flex items-center px-6"
          style={{
            clipPath: `polygon(0 0, ${scrollProgress * 100}% 0, ${scrollProgress * 100}% 100%, 0 100%)`,
            transition: 'clip-path 700ms ease-out'
          }}
        >
          <div className="flex items-center gap-3">
            <span 
              className={`font-bold text-lg text-white transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {number}
            </span>
            
            <span 
              className={`font-medium text-sm uppercase tracking-wider text-white transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {sectionHeader}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 