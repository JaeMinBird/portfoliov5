export interface ProjectInfo {
  id: number;
  title: string;
  description: string;
  image: string; // placeholder for now
  category: 'ML/AI' | 'Full Stack' | 'Featured';
  featured: boolean;
  technologies: string[];
}

export const projectData: ProjectInfo[] = [
  {
    id: 1,
    title: "Review Sentiment Analysis Model",
    description: "Deep learning model that applies artistic styles to images using convolutional neural networks.",
    image: "/placeholder-400x400.jpg",
    category: "ML/AI",
    featured: true,
    technologies: ["Python", "TensorFlow", "CNNs"]
  },
  {
    id: 2,
    title: "E-Commerce Platform",
    description: "Full-stack application with React frontend and Node.js backend featuring real-time inventory management.",
    image: "/placeholder-400x400.jpg", 
    category: "Full Stack",
    featured: true,
    technologies: ["React", "Node.js", "PostgreSQL"]
  },
  {
    id: 3,
    title: "Sentiment Analysis API",
    description: "Machine learning service that analyzes text sentiment with 94% accuracy across multiple languages.",
    image: "/placeholder-400x400.jpg",
    category: "ML/AI", 
    featured: false,
    technologies: ["Python", "NLTK", "FastAPI"]
  },
  {
    id: 4,
    title: "Task Management App",
    description: "Collaborative productivity tool with real-time synchronization and intuitive drag-and-drop interface.",
    image: "/placeholder-400x400.jpg",
    category: "Full Stack",
    featured: true,
    technologies: ["React", "Firebase", "TypeScript"]
  }
];

export type FilterCategory = 'All' | 'Featured' | 'ML/AI' | 'Full Stack'; 