'use client'


import { motion, useScroll, useTransform } from "framer-motion";
import { 
  StickyHeader, 
  Logo, 
  Bumper, 
  Experience, 
  Projects, 
  Footer, 
  Bio 
} from "@/components";

export default function Home() {
  const { scrollY } = useScroll();
  
  // Lightweight parallax using useTransform
  const parallaxY = useTransform(scrollY, [0, 200], [0, -60]);
  const opacity = useTransform(scrollY, [0, 100], [1, 0]);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const elementPosition = aboutSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 50;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <StickyHeader />
      
      {/* Logo Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative">
        <Logo />
        
        {/* Scroll indicator text - optimized with Motion */}
        <motion.div 
          className="fixed bottom-8 w-full flex justify-center cursor-pointer"
          style={{ y: parallaxY, opacity }}
          onClick={scrollToAbout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-center">
            <motion.p 
              className="text-xs uppercase tracking-widest text-gray-600 mb-1"
            >
              SCROLL TO
            </motion.p>
            <motion.p 
              className="text-sm font-medium"
              style={{ color: "#F8C46F" }}
            >
              EXPLORE
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* About Section Bumper */}
      <Bumper 
        number="01" 
        sectionHeader="ABOUT" 
        id="about"
      />

      {/* Experience Section */}
      <section id="experience">
        <Bio />
        <Experience />
      </section>

      {/* Work Section Bumper */}
      <Bumper 
        number="02" 
        sectionHeader="PROJECTS" 
        id="projects"
      />

      {/* Projects Section */}
      <section>
        <Projects />
      </section>

      {/* Footer */}
      <section id="footer">
        <Footer />
      </section>
    </div>
  );
}