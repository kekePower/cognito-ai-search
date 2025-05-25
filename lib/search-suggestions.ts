// A comprehensive list of AI-focused search suggestions to rotate through
export const searchSuggestions = [
  // AI Fundamentals & Theory
  "What are transformer architectures and how do they work?",
  "Attention mechanisms in neural networks explained",
  "Self-supervised learning vs supervised learning",
  "How does backpropagation work in deep learning?",
  "Understanding gradient descent optimization",
  "What is the difference between AI, ML, and deep learning?",
  "Neural network activation functions comparison",
  "Overfitting and underfitting in machine learning",
  "Bias-variance tradeoff in AI models",
  "Ensemble methods in machine learning",

  // Fine-tuning & Model Training
  "How to fine-tune LLaMA models for specific tasks",
  "LoRA vs full fine-tuning for language models",
  "Parameter-efficient fine-tuning techniques",
  "QLoRA quantized fine-tuning explained",
  "Fine-tuning GPT models with custom datasets",
  "Transfer learning best practices",
  "Few-shot learning vs fine-tuning",
  "Catastrophic forgetting in neural networks",
  "Curriculum learning for AI training",
  "Data augmentation techniques for AI",

  // Open Source LLMs
  "LLaMA 2 vs Mistral 7B performance comparison",
  "Best open source alternatives to GPT-4",
  "Code Llama for programming assistance",
  "Vicuna vs Alpaca model comparison",
  "How to run Falcon 40B locally",
  "Open source multimodal AI models",
  "Hugging Face Transformers library tutorial",
  "BLOOM large language model capabilities",
  "MPT-7B model architecture and features",
  "WizardCoder vs StarCoder for programming",

  // GPUs, CPUs & Hardware
  "NVIDIA RTX 4090 vs H100 for AI training",
  "AMD MI300X vs NVIDIA A100 comparison",
  "Apple M3 Max for machine learning workloads",
  "Intel Arc GPUs for AI inference",
  "CPU vs GPU for transformer inference",
  "Memory requirements for running 70B models",
  "Quantization techniques for model compression",
  "TPU vs GPU for large model training",
  "Edge AI hardware for local inference",
  "Power consumption of AI accelerators",

  // Performance Optimizations
  "Flash Attention for faster transformer training",
  "Mixed precision training with FP16",
  "Gradient checkpointing for memory efficiency",
  "Model parallelism vs data parallelism",
  "DeepSpeed ZeRO optimizer states",
  "ONNX runtime optimization for inference",
  "TensorRT acceleration for NVIDIA GPUs",
  "Quantization-aware training techniques",
  "Knowledge distillation for model compression",
  "Pruning neural networks for efficiency",

  // Math for AI
  "Linear algebra fundamentals for machine learning",
  "Calculus concepts needed for deep learning",
  "Probability theory in machine learning",
  "Statistics for data science and AI",
  "Information theory and entropy in AI",
  "Optimization theory for neural networks",
  "Matrix factorization techniques",
  "Eigenvalues and eigenvectors in ML",
  "Fourier transforms in signal processing",
  "Bayesian inference in machine learning",

  // Python for AI
  "PyTorch vs TensorFlow for beginners",
  "NumPy arrays for machine learning",
  "Pandas data manipulation for AI projects",
  "Scikit-learn for traditional ML algorithms",
  "Matplotlib and Seaborn for data visualization",
  "Jupyter notebooks best practices",
  "Python virtual environments for AI projects",
  "FastAPI for serving ML models",
  "Streamlit for AI application prototypes",
  "Poetry for Python dependency management",

  // Different AI Servers & Frameworks
  "Ollama vs LM Studio for local LLMs",
  "vLLM for high-throughput LLM serving",
  "Text Generation Inference (TGI) setup",
  "LocalAI server configuration guide",
  "OpenAI API compatible servers",
  "Triton Inference Server for model serving",
  "Ray Serve for scalable ML deployment",
  "BentoML for model packaging and serving",
  "MLflow for experiment tracking",
  "Weights & Biases for ML monitoring",

  // AI Research & arXiv Papers
  "Latest papers on attention mechanisms",
  "Retrieval-augmented generation (RAG) research",
  "Constitutional AI and RLHF papers",
  "Mixture of experts (MoE) architectures",
  "In-context learning research findings",
  "Chain-of-thought prompting studies",
  "Emergent abilities in large language models",
  "AI safety and alignment research",
  "Multimodal AI research breakthroughs",
  "Federated learning recent advances",

  // AGI & ASI Concepts
  "What is artificial general intelligence?",
  "Current progress toward AGI development",
  "Artificial superintelligence risks and benefits",
  "AGI timeline predictions from experts",
  "Consciousness in artificial intelligence",
  "The hard problem of AI consciousness",
  "Recursive self-improvement in AI",
  "Intelligence explosion hypothesis",
  "AI alignment problem solutions",
  "Friendly AI development principles",

  // Vibe Coding & Creative AI
  "AI-assisted coding with GitHub Copilot",
  "Code generation with large language models",
  "AI pair programming best practices",
  "Creative writing with AI assistance",
  "AI-generated art and DALL-E techniques",
  "Music composition with AI tools",
  "AI for game development and design",
  "Creative coding with machine learning",
  "AI storytelling and narrative generation",
  "Procedural content generation with AI",

  // LLM Testing & Evaluation
  "How to evaluate large language models",
  "Benchmarking LLM performance metrics",
  "BLEU, ROUGE, and METEOR scores explained",
  "Human evaluation of AI-generated text",
  "Adversarial testing for language models",
  "Bias detection in AI model outputs",
  "Hallucination detection in LLMs",
  "Red teaming for AI safety testing",
  "A/B testing AI model improvements",
  "Automated testing frameworks for ML",

  // Prompt Engineering
  "Advanced prompt engineering techniques",
  "Chain-of-thought prompting examples",
  "Few-shot vs zero-shot prompting",
  "Prompt injection attack prevention",
  "System prompts and instruction tuning",
  "Temperature and top-p sampling explained",
  "Prompt optimization for better results",
  "Multi-turn conversation design",
  "Role-playing prompts for AI assistants",
  "Prompt templates and best practices",

  // LLM Training Deep Dive
  "Pretraining large language models from scratch",
  "Tokenization strategies for different languages",
  "Learning rate scheduling for transformer training",
  "Distributed training across multiple GPUs",
  "Data preprocessing for language model training",
  "Compute requirements for training LLMs",
  "Scaling laws for neural language models",
  "Training data quality and curation",
  "Checkpoint saving and resuming training",
  "Monitoring training metrics and loss curves",

  // LLM Inference Optimization
  "KV-cache optimization for faster inference",
  "Batching strategies for LLM serving",
  "Speculative decoding techniques",
  "Model sharding for large model inference",
  "CPU inference optimization techniques",
  "Memory mapping for efficient model loading",
  "Streaming inference for real-time applications",
  "Caching strategies for repeated queries",
  "Load balancing for LLM API servers",
  "Latency optimization for production deployment",

  // LLM How-to Guides
  "How to set up Ollama on different platforms",
  "Step-by-step guide to fine-tune Mistral 7B",
  "How to convert models to GGUF format",
  "Setting up a local ChatGPT alternative",
  "How to build a RAG system with LangChain",
  "Creating custom AI assistants with open models",
  "How to optimize VRAM usage for large models",
  "Building AI applications with Streamlit",
  "How to deploy LLMs on cloud platforms",
  "Creating AI chatbots for specific domains",

  // Emerging AI Trends & Future Tech
  "Neuromorphic computing for AI acceleration",
  "Quantum machine learning algorithms",
  "Brain-computer interfaces and AI integration",
  "AI in autonomous vehicle decision making",
  "Swarm intelligence and collective AI behavior",
  "AI-powered drug discovery and molecular design",
  "Generative AI for 3D model creation",
  "AI ethics frameworks for responsible development",
  "Explainable AI (XAI) techniques and tools",
  "AI for climate change prediction and mitigation"
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
