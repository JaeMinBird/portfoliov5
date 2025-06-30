import { notFound } from 'next/navigation';
import { projectData } from '@/data/projects';
import ProjectArticle from '@/components/article';

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const projectId = parseInt(params.id);
  const project = projectData.find(p => p.id === projectId);

  if (!project) {
    notFound();
  }

  return <ProjectArticle project={project} />;
}

// Generate static params for all projects
export function generateStaticParams() {
  return projectData.map((project) => ({
    id: project.id.toString(),
  }));
} 