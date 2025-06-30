'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProjectInfo } from '../data/projects';
import Footer from './footer';
import StickyHeader from './nav';

interface ProjectArticleProps {
  project: ProjectInfo;
}

export default function ProjectArticle({ project }: ProjectArticleProps) {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'problem', label: 'Problem' },
    { id: 'solution', label: 'Solution' },
    { id: 'reflection', label: 'Reflection' }
  ];

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 100;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const centerOfScreen = scrollPosition + windowHeight / 2;
      
      // If we're at the bottom of the page, set to reflection
      if (scrollPosition + windowHeight >= documentHeight - 50) {
        setActiveSection('reflection');
        return;
      }
      
      // If we're near the top, set to overview
      if (scrollPosition < 400) {
        setActiveSection('overview');
        return;
      }

      // Check which section is closest to the center of the screen
      let closestSection = 'overview';
      let closestDistance = Infinity;

      for (const section of sections.slice(1)) {
        const element = document.getElementById(section.id);
        if (element) {
          const elementTop = element.offsetTop;
          const elementCenter = elementTop + element.offsetHeight / 2;
          const distance = Math.abs(centerOfScreen - elementCenter);
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = section.id;
          }
        }
      }
      
      setActiveSection(closestSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <StickyHeader />
      
      {/* Navigation Sidebar */}
      <motion.div 
        className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`text-left transition-all duration-200 cursor-pointer ${
                activeSection === section.id 
                  ? 'font-medium' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              style={{ 
                color: activeSection === section.id ? '#F8C46F' : undefined 
              }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full transition-all duration-200`}
                     style={{ 
                       backgroundColor: activeSection === section.id ? '#F8C46F' : '#d1d5db' 
                     }} />
                <span className="text-base uppercase tracking-wider">
                  {section.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="w-[60vw] mx-auto pt-32">
        {/* Hero Image */}
        <motion.div 
          className="w-[50vw] mx-auto aspect-[2/1] bg-gray-200 rounded-lg overflow-hidden mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-600 text-2xl font-medium">
            {project.heroImage || 'Project Hero Image'}
          </div>
        </motion.div>

        {/* Overview Section */}
        <motion.section 
          id="overview" 
          className="mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex gap-12">
            {/* Left Side - 80% */}
            <div className="w-4/5">
              {/* Project Title */}
              <h1 className="text-5xl md:text-6xl font-light mb-6 text-black leading-tight text-left">
                {project.title}
              </h1>

              {/* Concept Sentence */}
              <h2 className="text-5xl md:text-6xl font-light mb-12 text-gray-400 leading-tight text-left">
                A comprehensive solution
              </h2>

              {/* Project Description */}
              <p className="text-xl leading-relaxed text-black max-w-4xl text-left">
                {project.description}
              </p>
            </div>

            {/* Right Side - 20% */}
            <div className="w-1/5 flex items-center">
              {/* RPS (Role, Platform, Stack) */}
              <div className="flex flex-col gap-8 text-base">
                <div>
                  <div className="mb-2">
                    <span className="uppercase tracking-wider font-medium" style={{ color: '#F8C46F' }}>
                      [ ROLE ]
                    </span>
                  </div>
                  <div className="text-black font-light">
                    {project.role || 'Developer'}
                  </div>
                </div>
                
                <div>
                  <div className="mb-2">
                    <span className="uppercase tracking-wider font-medium" style={{ color: '#F8C46F' }}>
                      [ PLATFORM ]
                    </span>
                  </div>
                  <div className="text-black font-light">
                    {project.platform || 'Web Application'}
                  </div>
                </div>
                
                <div>
                  <div className="mb-2">
                    <span className="uppercase tracking-wider font-medium" style={{ color: '#F8C46F' }}>
                      [ STACK ]
                    </span>
                  </div>
                  <div className="text-black font-light">
                    {(project.stack || project.technologies).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Problem Section */}
        <motion.section 
          id="problem" 
          className="mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-light mb-12 leading-tight" style={{ color: '#F8C46F' }}>
            Problem
          </h2>
          <p className="text-2xl leading-relaxed text-black max-w-4xl">
            {project.problem || 'Problem description not available for this project.'}
          </p>
        </motion.section>

        {/* Solution Section */}
        <motion.section 
          id="solution" 
          className="mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-light mb-12 leading-tight" style={{ color: '#F8C46F' }}>
            Solution
          </h2>
          <p className="text-2xl leading-relaxed text-black max-w-4xl">
            {project.solution || 'Solution description not available for this project.'}
          </p>
        </motion.section>

        {/* Reflection Section */}
        <motion.section 
          id="reflection" 
          className="mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-light mb-12 leading-tight" style={{ color: '#F8C46F' }}>
            Reflection
          </h2>
          <p className="text-2xl leading-relaxed text-black max-w-4xl">
            {project.reflection || 'Reflection not available for this project.'}
          </p>
        </motion.section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
} 