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
    description: "Led development of ResNet computer vision models for real-time traffic classification. Optimized TensorFlow pipelines and deployed edge solutions achieving 40% faster training."
  },
  {
    id: 2,
    company: "JiaYou Tennis",
    title: "Software Engineer",
    startDate: "Apr 2025",
    endDate: "Present",
    description: "Developed AR tennis applications for Snapchat Spectacles using TypeScript. Built custom YOLO computer vision models and managed agile teams delivering 94% of milestones."
  },
  {
    id: 3,
    company: "Albany Accounting & Tax",
    title: "WebDev Intern",
    startDate: "May 2024",
    endDate: "Aug 2024",
    description: "Created full-stack websites with Laravel/October CMS and Docker containerization. Presented UI/UX prototypes to clients reducing development time by 2+ sprints."
  },
  {
    id: 4,
    company: "Mindburn Solutions",
    title: "Support Technician",
    startDate: "Jul 2021",
    endDate: "Aug 2023",
    description: "Designed MySQL visual reporting systems and led disaster recovery for enterprise clients. Configured secure networks for 5+ clients including Amazon facilities."
  }
];
