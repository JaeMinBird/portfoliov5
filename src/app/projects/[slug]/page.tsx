import { notFound } from 'next/navigation';
import { projectData } from '@/data/projects';
import ProjectArticle from '@/components/article';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projectData.find(p => p.slug === slug);

  if (!project) {
    notFound();
  }

  return <ProjectArticle project={project} />;
}

export function generateStaticParams() {
  return projectData.map((project) => ({
    slug: project.slug,
  }));
}
