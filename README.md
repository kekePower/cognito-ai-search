# 🔍 Cognito Search

A privacy-focused, AI-powered search application that combines web search capabilities with local AI processing. Search the web while maintaining control over your data and leverage the power of local AI models for intelligent responses.

![Cognito Search Screenshot](https://via.placeholder.com/1200x600.png?text=Cognito+Search+Screenshot)

## ✨ Key Features

- **Privacy-First Search**: Self-hosted SearXNG instance for private web searches
- **Local AI Processing**: Powered by Ollama for secure, on-device AI responses
- **Beautiful UI**: Modern, responsive interface with light/dark theme support
- **Blazing Fast**: Optimized performance with server-side rendering
- **Self-Hosted**: Complete control over your data and search experience

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   pnpm install  # or npm install / yarn
   ```

2. **Configure Environment**
   Create a `.env.local` file with your settings:
   ```env
   SEARXNG_API_URL=http://your-searxng-instance:port
   OLLAMA_API_URL=http://localhost:11434
   DEFAULT_OLLAMA_MODEL=llama3
   ```

3. **Start Development Server**
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 Documentation

For detailed setup and configuration instructions, please see our [HOWTO Guide](HOWTO.md).

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: shadcn/ui, Tailwind CSS
- **AI**: Ollama for local LLM processing
- **Search**: Self-hosted SearXNG
- **Theming**: Built-in light/dark mode

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [SearXNG](https://docs.searxng.org/) - Privacy-focused metasearch engine
- [Ollama](https://ollama.ai/) - Local LLM management
- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
