export interface JobInfo {
  id: number;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

export const jobData: JobInfo[] = [
  {
    id: 1,
    company: "HTI Lab",
    title: "ML Research Assistant",
    startDate: "May 2025",
    endDate: "Present",
    description: "Led development of ResNet-based computer vision models for real-time traffic scene classification. Optimized TensorFlow data pipelines and deployed edge computing solutions achieving significant performance improvements."
  },
  {
    id: 2,
    company: "JiaYou Tennis",
    title: "Software Engineer",
    startDate: "Apr 2025",
    endDate: "Present",
    description: "Developed immersive augmented reality applications for Snapchat Spectacles using TypeScript and Lens Studio. Built custom computer vision models and managed agile development teams to deliver innovative sports technology solutions."
  },
  {
    id: 3,
    company: "Albany Accounting & Tax",
    title: "Web Development Intern",
    startDate: "May 2024",
    endDate: "Aug 2024",
    description: "Created full-stack web solutions with modern frameworks and containerized deployment strategies. Collaborated with clients on UI/UX design iterations and built dynamic content management systems with automated CI/CD pipelines."
  },
  {
    id: 4,
    company: "Mindburn Solutions",
    title: "Support Technician",
    startDate: "Jul 2021",
    endDate: "Aug 2023",
    description: "Designed comprehensive database reporting systems and led disaster recovery operations for enterprise clients. Implemented secure network infrastructures and server deployments across multiple high-profile facilities."
  }
];
