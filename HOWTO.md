# Cognito Search - Technical Documentation

This document contains detailed technical information about setting up and configuring Cognito Search. For a general overview, please see the [README.md](README.md).

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [SearXNG Configuration](#searxng-configuration)
- [Ollama Setup](#ollama-setup)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Self-hosted SearXNG instance (or public instance URL)
- Ollama installed and running with desired models
- (Optional) Redis for caching (recommended for production)

## Environment Setup

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

## SearXNG Configuration

1. Install and configure a SearXNG instance following the [official documentation](https://docs.searxng.org/admin/installation.html)
2. Enable API and JSON support by modifying the following settings in `searx/settings.yml`:

   ```yaml
   search:
     api_enabled: true
     formats:
       - html
       - json
       - csv
       - rss
   
   server:
     bind_address: "0.0.0.0"  # Allow external connections
     secret_key: "your-secure-secret-key"  # Generate a secure key
     http_protocol_version: "1.1"
   ```

3. Update Redis socket path in `manage` script if needed:
   ```bash
   _dev_redis_sock="/run/redis/redis.sock"
   ```

4. Disable automatic browser opening in development (optional):
   ```bash
   # In manage script
   SEARXNG_DEBUG=0 pyenv.cmd python -m searx.webapp
   ```

## Ollama Setup

1. Install Ollama from [ollama.ai](https://ollama.ai/)
2. Pull your preferred model:
   ```bash
   ollama pull mistral
   # or
   ollama pull llama3
   ```
3. Start the Ollama server

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run production server
pnpm start

# Lint code
pnpm lint

# Type checking
pnpm type-check
```

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

## Troubleshooting

### Common Issues

1. **SearXNG API not accessible**
   - Ensure SearXNG is running and accessible
   - Verify the API is enabled in SearXNG settings
   - Check CORS settings if accessing from a different domain

2. **Ollama connection issues**
   - Make sure Ollama server is running
   - Verify the API URL and port in your environment variables
   - Check if the specified model is downloaded

3. **Build errors**
   - Ensure all dependencies are installed
   - Check Node.js version compatibility
   - Clear Next.js cache if needed: `rm -rf .next`

For additional help, please [open an issue](https://github.com/yourusername/cognito-ai-search/issues).
