'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ProjectInfo } from '../data/projects';
import Footer from './footer';
import StickyHeader from './nav';
import { COLORS, LINKS } from '@/lib/constants';

// ---------------------------------------------------------------------------
// ArticleSection — alternating left/right split with square image preview.
// ---------------------------------------------------------------------------

interface ArticleSectionProps {
  id: string;
  title: string;
  content: string;
  fallback: string;
  sectionImage?: string;
  projectTitle: string;
  isReversed: boolean;
}

function ArticleSection({
  id,
  title,
  content,
  fallback,
  sectionImage,
  projectTitle,
  isReversed,
}: ArticleSectionProps) {
  return (
    <motion.section
      id={id}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16 md:mb-24"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Text — title stacked above body */}
      <div
        className={`flex flex-col gap-4 md:gap-6 ${isReversed ? 'md:order-2' : 'md:order-1'}`}
      >
        <h2
          className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight"
          style={{ color: COLORS.accent }}
        >
          {title}
        </h2>
        <p className="text-base md:text-lg lg:text-xl leading-relaxed text-black">
          {content || fallback}
        </p>
      </div>

      {/* Square image preview — stretches to text height on desktop */}
      <div
        className={`aspect-square md:aspect-auto rounded-lg overflow-hidden relative ${isReversed ? 'md:order-1' : 'md:order-2'}`}
        style={{ backgroundColor: '#f5f5f5' }}
      >
        {sectionImage && (
          <Image
            src={sectionImage}
            alt={`${projectTitle} ${id}`}
            fill
            sizes="(max-width: 768px) 90vw, 40vw"
            className="object-contain p-[7.5%]"
          />
        )}
      </div>
    </motion.section>
  );
}


// ---------------------------------------------------------------------------
// ProjectArticle (default export)
// ---------------------------------------------------------------------------

interface ProjectArticleProps {
  project: ProjectInfo;
}

export default function ProjectArticle({ project }: ProjectArticleProps) {
  const metadataFields = [
    { label: 'TYPE', value: project.platform || 'Web Application' },
    { label: 'STACK', value: (project.stack || project.technologies).join(', ') },
  ];

  const contentSections = [
    {
      id: 'problem',
      title: 'PROBLEM',
      content: project.problem,
      fallback: 'Problem description not available for this project.',
      image: project.sectionImages?.problem,
    },
    {
      id: 'solution',
      title: 'SOLUTION',
      content: project.solution,
      fallback: 'Solution description not available for this project.',
      image: project.sectionImages?.solution,
    },
    {
      id: 'reflection',
      title: 'REFLECTION',
      content: project.reflection,
      fallback: 'Reflection not available for this project.',
      image: project.sectionImages?.reflection,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <StickyHeader />

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="w-[90vw] md:w-[80vw] mx-auto pt-32 md:pt-32 px-4 md:px-0">

        {/* Hero image */}
        <motion.div
          className="max-w-3xl mx-auto aspect-[4/3] md:aspect-[16/10] rounded-lg overflow-hidden mb-6 md:mb-8 relative"
          style={{ backgroundColor: '#f5f5f5' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {project.heroImage ? (
            <Image
              src={project.heroImage}
              alt={`${project.title} hero image`}
              fill
              sizes="(max-width: 768px) 90vw, 768px"
              className="object-contain p-[5%]"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-600 text-2xl font-medium">
              {project.title}
            </div>
          )}
        </motion.div>

        {/* Links */}
        <motion.div
          className="max-w-3xl mx-auto flex justify-center gap-8 mb-12 md:mb-16"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a
            href={project.repo || LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-wider font-medium text-black hover:opacity-70 transition-opacity"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            <span>GitHub</span>
          </a>

          {project.devpost && (
            <a
              href={project.devpost}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-wider font-medium text-black hover:opacity-70 transition-opacity"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M6.002 1.61L0 12.004 6.002 22.39h11.996L24 12.004 17.998 1.61zm1.593 16.526l-3.742-6.132 3.742-6.135h8.82l3.741 6.135-3.741 6.132z"/>
              </svg>
              <span>Devpost</span>
            </a>
          )}

          {project.website && (
            <a
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-wider font-medium text-black hover:opacity-70 transition-opacity"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>Website</span>
            </a>
          )}
        </motion.div>

        {/* Overview section */}
        <motion.section
          id="overview"
          className="mb-10 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:grid lg:grid-cols-[4fr_1fr] lg:gap-x-12 lg:items-start">
            <div className="mb-8 lg:mb-12 lg:col-start-1 lg:row-start-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black leading-tight text-left">
                {project.title}
              </h1>
              {project.hackathon && (
                <div className="mt-3 inline-flex items-center gap-2">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded select-none"
                    style={{ backgroundColor: COLORS.accent, color: '#fff' }}
                  >
                    {project.hackathon.place}
                  </span>
                  <span className="text-xs uppercase tracking-widest font-medium text-gray-400">
                    {project.hackathon.event}
                  </span>
                </div>
              )}
            </div>

            <div className="hidden lg:block lg:col-start-2 lg:row-start-1 text-base">
              <div className="mb-2">
                <span className="uppercase tracking-wider font-medium" style={{ color: COLORS.accent }}>
                  [ {metadataFields[0].label} ]
                </span>
              </div>
              <div className="text-black font-light">{metadataFields[0].value}</div>
            </div>

            <div className="hidden lg:block lg:col-start-2 lg:row-start-2 text-base">
              <div className="mb-2">
                <span className="uppercase tracking-wider font-medium" style={{ color: COLORS.accent }}>
                  [ {metadataFields[1].label} ]
                </span>
              </div>
              <div className="text-black font-light">{metadataFields[1].value}</div>
            </div>

            <div
              className="max-w-4xl pl-6 border-l-2 mb-8 lg:mb-0 lg:col-start-1 lg:row-start-2"
              style={{ borderColor: COLORS.accent }}
            >
              <p className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-3" style={{ color: COLORS.accent }}>
                Abstract
              </p>
              <p className="text-xl md:text-2xl leading-relaxed text-black text-left">
                {project.description}
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-2 lg:hidden text-sm">
              {metadataFields.map((f) => (
                <div key={f.label} className="flex flex-col gap-1">
                  <span className="uppercase tracking-wider font-medium" style={{ color: COLORS.accent }}>
                    [ {f.label} ]
                  </span>
                  <span className="text-black font-light">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Content sections — left / right / left alternating */}
        {contentSections.map((section, idx) => (
          <ArticleSection
            key={section.id}
            id={section.id}
            title={section.title}
            content={section.content || ''}
            fallback={section.fallback}
            sectionImage={section.image}
            projectTitle={project.title}
            isReversed={idx % 2 === 1}
          />
        ))}
      </div>

      <Footer />
    </div>
  );
}
