# 🔍 Cognito AI Search v1.2.0: Your Private Gateway to Information

Cognito AI Search offers a secure and private way to find information and get answers. It's designed for individuals who value their privacy and want more control over their digital footprint. This tool brings together the power of a local AI assistant and a private web search engine, all running on your own hardware, ensuring your data stays with you.

In an online world where tracking is common, Cognito AI Search provides an alternative. It allows you to explore the web and interact with artificial intelligence without concerns about your search history or personal data being collected or analyzed by third parties.

![Cognito AI Search Screenshot](https://kekepower.com/images/cognito-ai-search-screenshot-1.2.0.png "Cognito AI Search Screenshot")

## ✨ What's New in v1.2.0

🎨 **Holographic Shard Design**: Revolutionary crystalline UI with angular shapes, neon accents, and glass morphism effects  
🚀 **50% Faster Performance**: Build time reduced from 4.0s to 2.0s with 68% fewer components and optimized dependencies  
🔍 **Enhanced Search Experience**: 200 AI-focused suggestions, improved error handling, and professional PDF export with LaTeX support  
📱 **Perfect Cross-Browser Support**: Firefox compatibility fixes and consistent styling across all browsers  
🛠️ **Modular Architecture**: Complete codebase restructuring with TypeScript enhancements and clean separation of concerns  
🌈 **Dual Theme Support**: Beautiful light mode with warm cream tones and enhanced dark mode with neon aesthetics  
⚡ **Advanced Caching**: Intelligent caching system with automatic cleanup and improved performance  
🎯 **Clean Error Handling**: Contextual error messages with professional styling and clear recovery options

## What Can Cognito AI Search Do For You?

Cognito AI Search is built on two core pillars, designed to work together seamlessly or independently:

### 🤖 Your Personal AI Assistant, On Your Terms

Imagine having an AI assistant that operates entirely on your own computer. Cognito AI Search makes this possible by integrating with local AI models like LLaMA or Mistral (via Ollama). This means:

*   **True Privacy:** Your conversations with the AI never leave your machine. What you ask and the responses you receive remain confidential.
*   **Offline Access:** Because the AI runs locally, you can often get answers and assistance even without an active internet connection.
*   **Customization:** You have the freedom to choose the AI model that best suits your needs and configure how it responds.

### 🌐 Private and Unbiased Web Search

When you need to search the wider internet, Cognito AI Search uses a self-hosted instance of SearXNG. This is a powerful metasearch engine that fetches results from various sources without compromising your privacy. Key benefits include:

*   **Anonymous Searching:** Your search queries are not logged or tied to your identity. Each search is a fresh start.
*   **No Tracking or Profiling:** Unlike many commercial search engines, Cognito AI Search doesn't build a profile on you, ensuring the results you see are not influenced by past behavior or targeted advertising.
*   **Aggregated Results:** Get a broader perspective by seeing results from multiple search engines in one place.

## Key Advantages of Using Cognito AI Search

Choosing Cognito AI Search means prioritizing your digital autonomy. Here’s what sets it apart:

*   **Complete Data Control:** By self-hosting, you are in full command of your data. Nothing is sent to external servers without your explicit action.
*   **Freedom from Ads and Trackers:** Enjoy a cleaner, more focused experience without targeted advertisements or hidden data collection.
*   **Efficient and User-Friendly:** The interface is designed to be lightweight and responsive, delivering quick results on any device without unnecessary clutter.
*   **IPv6 Support:** Configurable for accessibility over IPv6. See [HOWTO.md#ipv6-support-configuration](docs/HOWTO.md#ipv6-support-configuration) for details.

## 🚀 Get Started

For detailed setup instructions, see the [HOWTO](docs/HOWTO.md).

## 🐳 Quick Start with Docker

The easiest way to get started is using our pre-built Docker image from Docker Hub:

```bash
docker run -d \
  -p 3000:3000 \
  -e OLLAMA_API_URL="http://YOUR_OLLAMA_HOST:11434" \
  -e DEFAULT_OLLAMA_MODEL="phi4-mini:3.8b-q8_0" \
  -e AI_RESPONSE_MAX_TOKENS="1200" \
  -e SEARXNG_API_URL="http://YOUR_SEARXNG_HOST:8888" \
  --name cognito-ai-search \
  kekepower/cognito-ai-search:latest
```

**Available Tags:**
- `kekepower/cognito-ai-search:latest` - Latest stable release
- `kekepower/cognito-ai-search:1.2.0` - Current stable version
- `kekepower/cognito-ai-search:1.1.0` - Previous version

**Key Environment Variables:**
- `OLLAMA_API_URL` - URL to your Ollama instance
- `SEARXNG_API_URL` - URL to your SearXNG instance  
- `DEFAULT_OLLAMA_MODEL` - AI model to use (recommended: `phi4-mini:3.8b-q8_0`)
- `AI_RESPONSE_MAX_TOKENS` - Maximum tokens for AI responses

The application will be available at `http://localhost:3000`. For detailed configuration and setup instructions, see the [HOWTO](docs/HOWTO.md).

## 🌟 Join Our Community

Cognito AI Search is more than just a tool; it's a step towards a more private and user-controlled internet. We welcome you to join us:

*   ⭐ Star us on GitHub
*   🐛 Report issues if you find any bugs
*   💡 Suggest features you'd like to see
*   🤝 Contribute code if you're a developer

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=kekePower/cognito-ai-search&type=Date)](https://www.star-history.com/#kekePower/cognito-ai-search&Date)

## 📄 License

Cognito AI Search is open-source and licensed under the MIT License.
