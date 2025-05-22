# Cognito Search

A privacy-focused, AI-powered search application that combines web search capabilities with local AI processing. This application allows users to perform searches while maintaining control over their data and leveraging the power of local AI models.

## Features

- **Privacy-First Search**: Uses self-hosted SearXNG instance for private web searches
- **Local AI Processing**: Integrates with local Ollama models for AI-powered responses
- **Modern UI**: Built with Next.js and shadcn/ui for a responsive, accessible interface
- **Theme Support**: Light and dark mode support
- **Fast & Efficient**: Server-side rendering and intelligent caching for optimal performance

## Prerequisites

- Node.js 18+ and npm/yarn
- Self-hosted SearXNG instance (or public instance URL)
- Ollama installed and running with desired models
- (Optional) Redis for caching (recommended for production)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# SearXNG Configuration
SEARXNG_API_URL=http://your-searxng-instance:port

# Ollama Configuration
OLLAMA_API_URL=http://your-ollama-instance:11434
DEFAULT_OLLAMA_MODEL=your-preferred-model

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cognito-ai-search.git
   cd cognito-ai-search
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Set up your environment variables (see above)

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

### SearXNG Setup

1. Install and configure a SearXNG instance following the [official documentation](https://docs.searxng.org/admin/installation.html)
2. Ensure the API is accessible from your Next.js application

### Ollama Setup

1. Install Ollama from [ollama.ai](https://ollama.ai/)
2. Pull your preferred model:
   ```bash
   ollama pull mistral
   # or
   ollama pull llama3
   ```
3. Start the Ollama server

## Development

- `npm run dev` or `pnpm dev` - Start development server
- `npm run build` or `pnpm build` - Build for production
- `npm start` or `pnpm start` - Start production server
- `npm run lint` or `pnpm lint` - Run ESLint
- `npm run type-check` or `pnpm type-check` - Run TypeScript type checking

## Production Deployment

### Building for Production

1. Ensure all dependencies are installed:
   ```bash
   pnpm install
   ```

2. Create a production build:
   ```bash
   pnpm build
   ```
   This will create an optimized production build in the `.next` directory.

### Running in Production

1. Start the production server:
   ```bash
   pnpm start
   ```
   The application will be available at `http://localhost:3000` by default.

### Environment Configuration for Production

For production, make sure to set the following environment variables:

```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Update these with your production URLs
SEARXNG_API_URL=your-production-searxng-url
OLLAMA_API_URL=your-production-ollama-url
NEXT_PUBLIC_APP_URL=your-production-url
```

### Using PM2 (Recommended for Production)

For better process management in production, you can use PM2:

1. Install PM2 globally:
   ```bash
   npm install -g pm2
   # or
   pnpm add -g pm2
   ```

2. Start the application with PM2:
   ```bash
   pm2 start "pnpm start" --name "cognito-search"
   ```

3. Set PM2 to start on system boot:
   ```bash
   pm2 startup
   pm2 save
   ```

4. Monitor your application:
   ```bash
   pm2 monit
   ```

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **AI Integration**: Ollama
- **Search**: SearXNG
- **State Management**: React Context
- **Form Handling**: React Hook Form
- **Icons**: Lucide Icons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [SearXNG](https://docs.searxng.org/) for the privacy-focused search
- [Ollama](https://ollama.ai/) for easy local AI model management
- [Next.js](https://nextjs.org/) for the React framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
