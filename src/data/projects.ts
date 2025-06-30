export interface ProjectInfo {
  id: number;
  title: string;
  description: string;
  image: string; // placeholder for now
  categories: ('ML/AI' | 'Full Stack')[];
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
  // Section images
  sectionImages?: {
    problem?: string;
    solution?: string;
    reflection?: string;
  };
}

export const projectData: ProjectInfo[] = [
  {
    id: 1,
    title: "Review Sentiment Analysis Model",
    description: "Comprehensive sentiment analysis system that scrapes professor reviews, trains dual ML models, and provides an interactive dashboard for analyzing student sentiment across departments.",
    image: "/placeholder-400x400.jpg",
    categories: ["ML/AI"],
    featured: true,
    technologies: ["Python", "PyTorch", "Transformers", "Flask", "BeautifulSoup4"],
    // Article content
    heroImage: "/placeholder-hero-1200x600.jpg",
    conceptSentence: "Intelligent professor review analysis",
    role: "Developer",
    platform: "Web Application & Automated Pipeline",
    stack: ["Python", "PyTorch", "Transformers", "DistilBERT", "Flask", "BeautifulSoup4", "Pandas", "Scikit-learn", "Plotly", "APScheduler"],
    problem: "Students at Penn State lacked comprehensive tools to analyze professor reviews beyond simple ratings. Traditional review systems didn't account for the nuanced relationship between difficulty and quality, making it challenging to identify truly excellent professors versus easy graders. Additionally, manual analysis of thousands of reviews was impractical for extracting meaningful departmental insights.",
    solution: "Developed a comprehensive sentiment analysis system featuring dual ML models: a standard rating-based model and an innovative combined model that incorporates difficulty scores and metadata. The system automatically scrapes Rate My Professors data, processes reviews using DistilBERT transformers, and provides real-time insights through an interactive Flask dashboard. Implemented automated daily pipeline runs with performance tracking to continuously improve model accuracy over time.",
    reflection: "This project deepened my understanding of NLP model fine-tuning and the complexities of web scraping at scale. Working with transformer models taught me about the trade-offs between model complexity and inference speed. The automated pipeline development highlighted the importance of robust error handling and monitoring in production ML systems. Building the comparative analysis between models revealed insights about when traditional metrics might not capture the full picture of model performance. Future enhancements would explore multi-university datasets and temporal sentiment tracking across academic terms."
  },
  {
    id: 2,
    title: "Timely - AI Calendar Assistant",
    description: "AI-powered calendar assistant built in 24 hours during HackPSU, featuring natural language processing for schedule management and seamless Google Calendar integration.",
    image: "/placeholder-400x400.jpg",
    categories: ["Full Stack", "ML/AI"],
    featured: true,
    technologies: ["React", "Next.js", "TypeScript", "MongoDB", "OpenAI"],
    // Article content
    heroImage: "/placeholder-hero-1200x600.jpg",
    conceptSentence: "Natural language calendar management",
    role: "Co-Developer (Database Focus)",
    platform: "Web Application",
    stack: ["React 18", "Next.js 14", "TypeScript", "MongoDB", "NextAuth.js", "Google Calendar API", "AI-SDK", "OpenAI GPT-4", "Google Gemini", "Tailwind CSS", "Framer Motion"],
    problem: "Traditional calendar applications require users to navigate complex interfaces and fill out multiple form fields for simple scheduling tasks. Users wanted a more intuitive way to manage their schedules through natural conversation, similar to how they would ask a human assistant. Existing solutions lacked the seamless integration between AI conversation and actual calendar functionality.",
    solution: "Built a comprehensive AI calendar assistant that interprets natural language requests and automatically creates calendar events through Google Calendar API integration. Implemented hot-swappable AI models (GPT-4 and Gemini) with real-time chat functionality, user authentication via NextAuth, and cross-device data persistence using MongoDB. The system features intelligent time parsing, context-aware event creation, and a fully responsive interface with smooth animations.",
    reflection: "Developing this project in just 24 hours taught me the importance of rapid prototyping and MVP-focused development. Working with multiple AI models simultaneously highlighted the benefits of abstraction and modular architecture. The tight deadline forced creative problem-solving around API integration and state management. I gained valuable experience in OAuth2.0 flows and learned how to effectively combine multiple complex services (AI, Calendar, Database) into a cohesive user experience. Future iterations would include smart scheduling suggestions and conflict detection."
  },
  {
    id: 3,
    title: "263 STUDIOS - Modern Fashion E-Commerce",
    description: "Minimalist fashion e-commerce platform built from the ground up, featuring sophisticated responsive design, custom animations, and a complete full-stack architecture with AWS-hosted infrastructure.",
    image: "/placeholder-400x400.jpg",
    categories: ["Full Stack"],
    featured: true,
    technologies: ["React", "Next.js", "TypeScript", "PostgreSQL", "AWS"],
    // Article content
    heroImage: "/placeholder-hero-1200x600.jpg",
    conceptSentence: "Rebuilding e-commerce fundamentals",
    role: "Full Stack Developer & Designer",
    platform: "Web Application",
    stack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "AWS", "Prisma ORM", "Stripe"],
    problem: "Rather than relying on existing e-commerce solutions like Shopify, I wanted to build a premium fashion platform from the ground up to master the full complexity of modern web commerce. This meant architecting everything from database relationships and payment processing to sophisticated UI interactions and responsive design systems. The challenge was creating a minimalist, typography-focused shopping experience that worked seamlessly across devices while implementing robust backend systems for inventory, orders, and payments.",
    solution: "I developed 263 STUDIOS as a comprehensive fashion e-commerce platform with custom cursor implementation, full-screen brand video integration, and sophisticated responsive design. Built the backend with AWS-hosted PostgreSQL, Prisma ORM for type-safe database access, and complete Stripe payment processing with webhook handling. Implemented advanced frontend features including scroll-based navbar hiding, intersection observer for category navigation, spring physics animations, and adaptive layouts that transform between desktop split-screens and mobile single-column designs. Created a complete checkout flow with expandable sections, real-time cart management, and seamless mobile optimization.",
    reflection: "Building 263 STUDIOS taught me the intricacies of production-ready e-commerce architecture that you simply can't learn from tutorials or frameworks. Implementing custom cursor physics with Framer Motion revealed the complexities of performant animations. Working with AWS-hosted databases and Prisma ORM deepened my understanding of type-safe backend development and database relationships. The responsive design challenges forced me to think systematically about layout systems and user experience across devices. Most importantly, architecting the complete data flow from cart management through Stripe webhooks to order fulfillment gave me confidence to tackle any e-commerce problem. The typography-focused design approach taught me how technical implementation can serve aesthetic vision."
  }
];

export type FilterCategory = 'All' | 'Featured' | 'ML/AI' | 'Full Stack'; 