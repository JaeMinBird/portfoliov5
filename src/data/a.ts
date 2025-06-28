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
    title: "ML Researcher",
    startDate: "Jan 2023",
    endDate: "Present",
    description: "Led development of scalable web applications serving millions of users. Implemented modern React patterns and optimized performance across multiple platforms."
  },
  {
    id: 2,
    company: "JiaYou Tennis",
    title: "Software Engineer",
    startDate: "Aug 2021",
    endDate: "Dec 2022",
    description: "Built responsive user interfaces using React and TypeScript. Collaborated with design teams to create intuitive user experiences for enterprise applications."
  },
  {
    id: 3,
    company: "Albany AT",
    title: "Webdev Intern",
    startDate: "Mar 2020",
    endDate: "Jul 2021",
    description: "Developed end-to-end solutions using React, Node.js, and GraphQL. Worked on social media features impacting user engagement and platform growth."
  },
  {
    id: 4,
    company: "Mindburn Solutions",
    title: "Support Technician",
    startDate: "Jun 2018",
    endDate: "Feb 2020",
    description: "Created native iOS applications using Swift and UIKit. Focused on performance optimization and seamless user experience across different Apple devices."
  }
];
