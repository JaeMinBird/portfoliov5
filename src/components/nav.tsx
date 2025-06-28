"use client"
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import Image from "next/image";
import { IconBrandLinkedinFilled, IconBrandGithubFilled } from '@tabler/icons-react';

// Define proper types for line props
interface LineProps {
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: "round" | "inherit" | "butt" | "square";
  vectorEffect?: string;
  initial?: string;
  animate?: string;
  transition?: Transition;
  [key: string]: unknown; // Allow other properties
}

// Separate the MenuButton component from SVGMotionProps to avoid type conflicts
interface MenuButtonProps {
  isOpen?: boolean;
  color?: string;
  strokeWidth?: string | number;
  transition?: Transition;
  lineProps?: LineProps;
  width?: string | number;
  height?: string | number;
  onClick?: () => void;
  className?: string;
}

const MenuButton = ({
  isOpen = false,
  width = 24,
  height = 24,
  strokeWidth = 1,
  color = "#F8C46F", // Changed from "#ff9945" to #F8C46F
  transition = {},
  lineProps = {},
  ...props
}: MenuButtonProps) => {
  const variant = isOpen ? "opened" : "closed";
  const top = {
    closed: {
      rotate: 0,
      translateY: 0
    },
    opened: {
      rotate: 45,
      translateY: 2
    }
  };
  const center = {
    closed: {
      opacity: 1
    },
    opened: {
      opacity: 0
    }
  };
  const bottom = {
    closed: {
      rotate: 0,
      translateY: 0
    },
    opened: {
      rotate: -45,
      translateY: -2
    }
  };

  const combinedLineProps = {
    stroke: color,
    strokeWidth: strokeWidth as number,
    vectorEffect: "non-scaling-stroke",
    initial: "closed",
    animate: variant,
    transition,
    ...lineProps
  };

  const unitHeight = 4;
  const unitWidth = (unitHeight * (width as number)) / (height as number);

  return (
    <motion.svg
      viewBox={`0 0 ${unitWidth} ${unitHeight}`}
      overflow="visible"
      preserveAspectRatio="none"
      width={width}
      height={height}
      {...props}
    >
      <motion.line
        x1="0"
        x2={unitWidth}
        y1="0"
        y2="0"
        variants={top}
        {...combinedLineProps}
      />
      <motion.line
        x1="0"
        x2={unitWidth}
        y1="2"
        y2="2"
        variants={center}
        {...combinedLineProps}
      />
      <motion.line
        x1="0"
        x2={unitWidth}
        y1="4"
        y2="4"
        variants={bottom}
        {...combinedLineProps}
      />
    </motion.svg>
  );
};

export default function StickyHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const previousIsMobileRef = useRef(false);

  // Check if page is scrolled to control header appearance
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mobile detection and menu state
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;

      // If switching from mobile to desktop and menu is open, close it
      if (!isMobileView && previousIsMobileRef.current && mobileNavOpen) {
        setMobileNavOpen(false);
      }

      previousIsMobileRef.current = isMobileView;
      setIsMobile(isMobileView);
    };

    // Initial check
    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileNavOpen]);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileNavOpen]);

  const scrollToSection = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    // Close mobile nav if open
    setMobileNavOpen(false);

    // Check if we're on a different page than home
    if (!document.getElementById(id)) {
      // Navigate to homepage with anchor
      window.location.href = `/#${id}`;
      return;
    }

    // Get the target element's position
    const section = document.getElementById(id);
    if (section) {
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 100;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-20 flex items-center font-fredoka" style={{ fontFamily: 'var(--font-fredoka)' }}>

      {/* Logo positioned on the left side of the screen */}
      <motion.div 
        className="absolute left-6 md:left-12 z-[70]" // Increased left padding on desktop
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={`${isMobile ? 'w-[29px] h-[29px]' : 'w-[29px] h-[29px]'} cursor-pointer`} // All logos 29px (30% larger)
          whileHover={!isMobile ? { rotate: 218 } : undefined}
          animate={mobileNavOpen ? { rotate: 218 } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => {
            if (window.location.pathname !== '/') {
              window.location.href = '/';
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <Image 
            src="/logo.svg" 
            alt="Logo" 
            width={29} 
            height={29}
          />
        </motion.div>
      </motion.div>

      {/* Desktop Navigation Container */}
      <motion.div 
        className={`absolute hidden md:block md:left-1/2 md:transform md:-translate-x-1/2 px-4 py-2 rounded-full transition-all duration-300 ${
          scrolled ? 'bg-[#F8C46F] border border-transparent' : 'bg-white border border-transparent'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <nav className="flex items-center space-x-8">
          {/* Experience Link with slide effect - exact height of text */}
          <div className="overflow-hidden leading-none" style={{ height: '1.25rem' }}>
            <motion.a 
              href="#experience" 
              className={`text-xl font-medium flex flex-col leading-none ${scrolled ? 'text-white' : 'text-[#3B3B3B]'}`}
              style={{ fontFamily: 'var(--font-fredoka)' }}
              onClick={(e) => scrollToSection('experience', e)}
              whileHover={{ y: '-1.25rem' }}
              transition={{ duration: 0.2 }}
            >
              <span className={scrolled ? 'text-white' : 'text-[#F8C46F]'}>EXPERIENCE</span>
              <span className={scrolled ? 'text-white' : 'text-[#F8C46F]'}>EXPERIENCE</span>
            </motion.a>
          </div>

          {/* Projects Link with slide effect - exact height of text */}
          <div className="overflow-hidden leading-none" style={{ height: '1.25rem' }}>
            <motion.a 
              href="#projects" 
              className={`text-xl font-medium flex flex-col leading-none ${scrolled ? 'text-white' : 'text-[#3B3B3B]'}`}
              style={{ fontFamily: 'var(--font-fredoka)' }}
              onClick={(e) => scrollToSection('projects', e)}
              whileHover={{ y: '-1.25rem' }}
              transition={{ duration: 0.2 }}
            >
              <span className={scrolled ? 'text-white' : 'text-[#F8C46F]'}>PROJECTS</span>
              <span className={scrolled ? 'text-white' : 'text-[#F8C46F]'}>PROJECTS</span>
            </motion.a>
          </div>

          {/* Connect Link with slide effect - exact height of text */}
          <div className="overflow-hidden leading-none" style={{ height: '1.25rem' }}>
            <motion.a 
              href="#footer" 
              className={`text-xl font-medium flex flex-col leading-none ${scrolled ? 'text-white' : 'text-[#3B3B3B]'}`}
              style={{ fontFamily: 'var(--font-fredoka)' }}
              onClick={(e) => scrollToSection('footer', e)}
              whileHover={{ y: '-1.25rem' }}
              transition={{ duration: 0.2 }}
            >
              <span className={scrolled ? 'text-white' : 'text-[#F8C46F]'}>CONNECT</span>
              <span className={scrolled ? 'text-white' : 'text-[#F8C46F]'}>CONNECT</span>
            </motion.a>
          </div>
        </nav>
      </motion.div>

      {/* MenuButton hamburger */}
      <div className="absolute right-6 md:hidden z-[70] cursor-pointer">
        <MenuButton
          isOpen={mobileNavOpen}
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          strokeWidth="6"
          color="#F8C46F"
          lineProps={{ strokeLinecap: "round" }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          width="24"
          height="24"
        />
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col items-center space-y-8">
              <motion.a
                href="#experience"
                className="text-4xl font-bold text-[#3B3B3B]"
                style={{ fontFamily: 'var(--font-fredoka)' }}
                onClick={(e) => scrollToSection('experience', e)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                EXPERIENCE
              </motion.a>
              <motion.a
                href="#projects"
                className="text-4xl font-bold text-[#3B3B3B]"
                style={{ fontFamily: 'var(--font-fredoka)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={(e) => scrollToSection('projects', e)}
              >
                PROJECTS
              </motion.a>
              <motion.a
                href="/resume"
                className="text-4xl font-bold text-[#3B3B3B]"
                style={{ fontFamily: 'var(--font-fredoka)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setMobileNavOpen(false)}
              >
                RESUME
              </motion.a>
            </nav>

            {/* Footer section for mobile menu */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-8 text-center text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex space-x-6 mb-4">
                <a href="https://linkedin.com" className="hover:text-[#F8C46F] transition-colors">
                  <IconBrandLinkedinFilled size={24} />
                </a>
                <a href="https://github.com" className="hover:text-[#F8C46F] transition-colors">
                  <IconBrandGithubFilled size={24} />
                </a>
              </div>

              <div className="mb-4">
                <a href="mailto:hello@toyfight.co" className="hover:text-[#F8C46F]">hello@toyfight.co</a>
              </div>

              <p className="text-xs">© 2025 All Rights Reserved</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}