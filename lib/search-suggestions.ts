// A comprehensive list of search suggestions to rotate through
export const searchSuggestions = [
  "What is artificial intelligence?",
  "Latest tech news",
  "How to learn TypeScript",
  "Best programming practices",
  "Python vs JavaScript comparison",
  "Beginner's guide to machine learning",
  "How does blockchain work?",
  "Web development frameworks 2025",
  "Data science career path",
  "Quantum computing explained",
  "React vs Angular vs Vue",
  "How to build a REST API",
  "Cloud computing basics",
  "Cybersecurity best practices",
  "DevOps pipeline explained",
  "Docker vs Kubernetes",
  "Functional programming concepts",
  "How to optimize website performance",
  "Mobile app development trends",
  "Neural networks explained simply",
  "Open source contribution guide",
  "PostgreSQL vs MongoDB",
  "Responsive design principles",
  "Software architecture patterns",
  "TensorFlow vs PyTorch",
  "UI/UX design principles",
  "Virtual reality development",
  "WebAssembly use cases",
  "Xcode tips and tricks",
  "Zero to hero in coding",
  "Agile vs waterfall methodology",
  "Big data analytics tools",
  "CSS grid vs flexbox",
  "Debugging techniques for developers",
  "Ethical hacking tutorials",
  "Flutter vs React Native",
  "GraphQL vs REST",
  "How to implement CI/CD",
  "IoT project ideas",
  "JavaScript ES6+ features",
  "Kotlin vs Java for Android",
  "Linux command line basics",
  "Microservices architecture",
  "NextJS vs Gatsby",
  "Object-oriented programming principles",
  "Progressive web apps benefits",
  "Quick sort algorithm explained",
  "Rust programming language features",
  "Serverless computing examples",
  "TypeScript best practices"
];

// Function to get a random subset of suggestions
export function getRandomSuggestions(count: number = 4): string[] {
  // Create a copy of the array to avoid modifying the original
  const shuffled = [...searchSuggestions];
  
  // Fisher-Yates shuffle algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Return the first 'count' elements
  return shuffled.slice(0, count);
}
