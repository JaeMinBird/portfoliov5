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
      const scrollPosition = window.scrollY + 150;
      
      if (scrollPosition < 400) {
        setActiveSection('overview');
        return;
      }

      for (const section of sections.slice(1)) {
        const element = document.getElementById(section.id);
        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;
          
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveSection(section.id);
            return;
          }
        }
      }
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
        className="fixed left-4 lg:left-8 top-1/2 -translate-y-1/2 z-50 hidden xl:block"
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
      <div className="w-[90vw] md:w-[70vw] lg:w-[60vw] mx-auto pt-20 md:pt-32 px-4 md:px-0">
        {/* Hero Image */}
        <motion.div 
          className="w-[80vw] md:w-[50vw] lg:w-[40vw] mx-auto aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden mb-12 md:mb-16"
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
          className="mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left Side - 80% */}
            <div className="w-full lg:w-4/5">
              {/* Project Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4 text-black leading-tight text-left">
                {project.title}
              </h1>

              {/* Concept Sentence */}
              <h2 className="text-3xl md:text-4xl font-light mb-8 lg:mb-12 text-gray-400 leading-tight text-left">
                {project.conceptSentence || 'A comprehensive solution'}
              </h2>

              {/* Project Description */}
              <p className="text-xl md:text-2xl leading-relaxed text-black max-w-4xl text-left mb-8 lg:mb-0">
                {project.description}
              </p>
            </div>

            {/* Right Side - 20% */}
            <div className="w-full lg:w-1/5 lg:flex lg:items-center">
              {/* RPS (Role, Platform, Stack) */}
              <div className="w-full">
                {/* Mobile: 2-column grid */}
                <div className="grid gap-x-4 gap-y-3 lg:hidden text-sm" style={{ gridTemplateColumns: '1fr 2fr' }}>
                  <div className="text-left">
                    <span className="uppercase tracking-wider font-medium" style={{ color: '#F8C46F' }}>
                      [ ROLE ]
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="text-black font-light">
                      {project.role || 'Developer'}
                    </span>
                  </div>
                  
                  <div className="text-left">
                    <span className="uppercase tracking-wider font-medium" style={{ color: '#F8C46F' }}>
                      [ PLATFORM ]
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="text-black font-light">
                      {project.platform || 'Web Application'}
                    </span>
                  </div>
                  
                  <div className="text-left">
                    <span className="uppercase tracking-wider font-medium" style={{ color: '#F8C46F' }}>
                      [ STACK ]
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="text-black font-light text-sm">
                      {(project.stack || project.technologies).join(', ')}
                    </span>
                  </div>
                </div>

                {/* Desktop: Original vertical layout */}
                <div className="hidden lg:flex lg:flex-col lg:gap-8 text-base">
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
          </div>
        </motion.section>

        {/* Problem Section */}
        <motion.section 
          id="problem" 
          className="mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Left Side - 40% */}
            <div className="w-full md:w-2/5">
              <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6 md:mb-0" style={{ color: '#F8C46F' }}>
                PROBLEM
              </h2>
            </div>
            
            {/* Right Side - 60% */}
            <div className="w-full md:w-3/5 flex items-center">
              <p className="text-xl md:text-2xl leading-relaxed text-black">
                {project.problem || 'Problem description not available for this project.'}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Solution Section */}
        <motion.section 
          id="solution" 
          className="mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Left Side - 40% */}
            <div className="w-full md:w-2/5">
              <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6 md:mb-0" style={{ color: '#F8C46F' }}>
                SOLUTION
              </h2>
            </div>
            
            {/* Right Side - 60% */}
            <div className="w-full md:w-3/5 flex items-center">
              <p className="text-xl md:text-2xl leading-relaxed text-black">
                {project.solution || 'Solution description not available for this project.'}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Reflection Section */}
        <motion.section 
          id="reflection" 
          className="mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Left Side - 40% */}
            <div className="w-full md:w-2/5">
              <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6 md:mb-0" style={{ color: '#F8C46F' }}>
                REFLECTION
              </h2>
            </div>
            
            {/* Right Side - 60% */}
            <div className="w-full md:w-3/5 flex items-center">
              <p className="text-xl md:text-2xl leading-relaxed text-black">
                {project.reflection || 'Reflection not available for this project.'}
              </p>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Footer */}
      <Footer width="60vw" />
    </div>
  );
} 