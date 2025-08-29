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
    description: "Train and deploy machine learning computer vision models for traffic analysis. Compile and present technical documentation."
  },
  {
    id: 2,
    company: "JiaYou Tennis",
    title: "Software Engineer",
    startDate: "Apr 2025",
    endDate: "Present",
    description: "Developed augmented reality tennis applications with OpenGL. Managed and led an agile development team."
  },
  {
    id: 3,
    company: "Albany Accounting & Tax",
    title: "WebDev Intern",
    startDate: "May 2024",
    endDate: "Aug 2024",
    description: "Built secure client service platform with encrypted file management. Designed comprehensive UI/UX prototypes."
  },
  {
    id: 4,
    company: "Mindburn Solutions",
    title: "Support Technician",
    startDate: "Jul 2021",
    endDate: "Aug 2023",
    description: "Supported enterprise disaster recovery operations for multiple clients. Developed visual report system for SQL database."
  }
];
