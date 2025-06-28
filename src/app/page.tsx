'use client'

import { useEffect, useState } from "react";
import StickyHeader from "@/components/nav";
import Logo from "@/components/logo";
import Bumper from "@/components/bumper";
import Experience from "@/components/experience";
import Footer from "@/components/footer";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const elementPosition = aboutSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 50;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  // Subtle parallax effect - text moves slower than scroll
  const parallaxY = scrollY * 0.3;
  const isVisible = scrollY < 100;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <StickyHeader />
      
      {/* Logo Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative">
        <Logo />
        
        {/* Scroll indicator text */}
        <div 
          className={`fixed bottom-8 w-full flex justify-center cursor-pointer transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: `translateY(${-parallaxY}px)`
          }}
          onClick={scrollToAbout}
        >
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-1 hover:text-orange-400 transition-colors duration-300">
              SCROLL TO
            </p>
            <p className="text-sm font-medium text-gray-800 hover:text-orange-500 transition-colors duration-300">
              EXPLORE
            </p>
          </div>
        </div>
      </section>

      {/* About Section Bumper */}
      <Bumper 
        number="01" 
        sectionHeader="ABOUT" 
        id="about"
      />

      {/* Experience Section */}
      <section id="experience">
        <Experience />
      </section>

      {/* Work Section Bumper */}
      <Bumper 
        number="02" 
        sectionHeader="WORK" 
        id="work"
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}