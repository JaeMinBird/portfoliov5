export interface ProjectInfo {
  id: number;
  title: string;
  description: string;
  image: string; // placeholder for now
  category: 'ML/AI' | 'Full Stack' | 'Featured';
  featured: boolean;
  technologies: string[];
  // Extended properties for article page
  heroImage?: string;
  conceptSentence?: string;
  role?: string;
  platform?: string;
  stack?: string[];
  problem?: string;
  solution?: string;
  reflection?: string;
}

export const projectData: ProjectInfo[] = [
  {
    id: 1,
    title: "Review Sentiment Analysis Model",
    description: "Deep learning model that applies artistic styles to images using convolutional neural networks.",
    image: "/placeholder-400x400.jpg",
    category: "ML/AI",
    featured: true,
    technologies: ["Python", "TensorFlow", "CNNs"],
    // Article content
    heroImage: "/placeholder-hero-1200x600.jpg",
    conceptSentence: "Automating sentiment understanding",
    role: "ML Engineer & Data Scientist",
    platform: "Web Application",
    stack: ["Python", "TensorFlow", "Keras", "Scikit-learn", "FastAPI"],
    problem: "Traditional review analysis relied on manual categorization, which was time-consuming and prone to human bias. Businesses needed a scalable solution to automatically understand customer sentiment from thousands of reviews to make data-driven decisions about product improvements and customer satisfaction.",
    solution: "Developed a deep learning model using convolutional neural networks that processes text reviews and classifies sentiment with 94% accuracy. The model uses advanced NLP techniques including word embeddings and attention mechanisms to understand context and nuance in customer feedback, providing real-time insights through a REST API.",
    reflection: "This project taught me the importance of data preprocessing and the challenges of working with unstructured text data. I learned to balance model complexity with performance requirements, and gained valuable experience in deploying ML models to production environments. Future iterations would benefit from incorporating transformer architectures for even better accuracy."
  },
  {
    id: 2,
    title: "E-Commerce Platform",
    description: "Full-stack application with React frontend and Node.js backend featuring real-time inventory management.",
    image: "/placeholder-400x400.jpg", 
    category: "Full Stack",
    featured: true,
    technologies: ["React", "Node.js", "PostgreSQL"],
    // Article content
    heroImage: "/placeholder-hero-1200x600.jpg",
    conceptSentence: "Real-time inventory management",
    role: "Full Stack Developer",
    platform: "Web Application",
    stack: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Redis"],
    problem: "Small businesses struggled with managing inventory across multiple sales channels, often leading to overselling, stockouts, and poor customer experiences. Existing solutions were either too expensive or lacked the real-time synchronization needed for modern e-commerce operations.",
    solution: "Built a comprehensive e-commerce platform with real-time inventory tracking using WebSocket connections and Redis for caching. The system automatically updates stock levels across all channels, sends alerts for low inventory, and provides detailed analytics. The React frontend offers an intuitive interface for both customers and administrators.",
    reflection: "This project highlighted the complexity of real-time systems and the importance of proper database design. I learned valuable lessons about handling concurrent transactions and ensuring data consistency. The experience also taught me about the challenges of scaling web applications and the importance of performance optimization."
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