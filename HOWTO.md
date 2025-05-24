# Cognito AI Search v1.0.0 - Technical Documentation

This document contains detailed technical information about setting up and configuring Cognito AI Search v1.0.0. For a general overview, please see the [README.md](README.md).

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [SearXNG Configuration](#searxng-configuration)
- [Ollama Setup](#ollama-setup)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [New Features in v1.0.0](#new-features-in-v100)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Self-hosted SearXNG instance (or public instance URL)
- Ollama installed and running with desired models
- (Optional) Redis for caching (recommended for SearXNG)

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# SearXNG Configuration
SEARXNG_API_URL=http://your-searxng-instance:port

# Ollama Configuration  
OLLAMA_API_URL=http://your-ollama-instance:11434
DEFAULT_OLLAMA_MODEL=phi4-mini:3.8b-q8_0
AI_RESPONSE_MAX_TOKENS=100

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Recommended Model Configuration

For optimal performance in v1.0.0, we recommend:
- **Model**: `phi4-mini:3.8b-q8_0` (fast and efficient)
- **Max Tokens**: `100` (quick responses)
- **Alternative**: `mistral` or `llama3` for more detailed responses

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
DEFAULT_OLLAMA_MODEL=your-preferred-model
AI_RESPONSE_MAX_TOKENS=your-preferred-max-tokens
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
   pm2 start "pnpm start" --name "cognito-ai-search"
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

## Docker Deployment

You can also deploy Cognito AI Search using Docker. This provides a containerized environment for easier setup and management, especially when integrating with other services like SearXNG using Docker Compose.

### Prerequisites

- Docker installed on your system.

### Building the Docker Image

1.  Navigate to the root directory of the Cognito AI Search project (where the `Dockerfile` is located).
2.  Build the Docker image using the following command:

    ```bash
    docker build -t cognito-ai-search .
    ```

    **Important for Client-Side Configuration:**
    The application uses `NEXT_PUBLIC_` environment variables (e.g., `NEXT_PUBLIC_OLLAMA_API_URL`, `NEXT_PUBLIC_SEARXNG_API_URL`) that are embedded into the client-side code during the build process. If your client-side JavaScript needs to know these URLs (for instance, if you were making API calls directly from the browser to these services, though typically this app proxies through its own backend), you **must** provide them as build arguments. If these are not provided, their `NEXT_PUBLIC_` versions will be undefined in the client bundle.

    Example with build arguments:
    ```bash
    docker build \
      --build-arg OLLAMA_API_URL="http://your-ollama-host:11434" \
      --build-arg SEARXNG_API_URL="http://your-searxng-host:8080" \
      --build-arg DEFAULT_OLLAMA_MODEL="your-default-model" \
      -t cognito-ai-search .
    ```
    *Note: For typical deployments where Cognito AI Search backend handles communication with Ollama and SearXNG, these `NEXT_PUBLIC_` build arguments might not be strictly necessary if the client only talks to the Cognito AI Search backend. The runtime environment variables (see below) are generally more critical for server-side functionality.*

### Running the Docker Container

Once the image is built, you can run it as a container:

```bash
docker run -d -p 3000:3000 \
  -e PORT="3000" \
  -e OLLAMA_API_URL="http://host.docker.internal:11434" \
  -e SEARXNG_API_URL="http://host.docker.internal:8080" \
  -e DEFAULT_OLLAMA_MODEL="phi3:mini" \
  --name cognito-ai-search-container \
  cognito-ai-search
```

-   `-d`: Run the container in detached mode (in the background).
-   `-p 3000:3000`: Maps port 3000 on your host to port 3000 in the container.
-   `-e VARIABLE_NAME="value"`: Sets runtime environment variables for the application.
    -   `PORT`: The port the Next.js application will listen on inside the container.
    -   `OLLAMA_API_URL`: URL for your Ollama instance. `host.docker.internal` is a special DNS name that resolves to your host machine's IP address from within the container (useful if Ollama is running directly on your host).
    -   `SEARXNG_API_URL`: URL for your SearXNG instance.
    -   `DEFAULT_OLLAMA_MODEL`: The default Ollama model to use.
-   `--name cognito-ai-search-container`: Assigns a name to the running container.

Adjust the environment variables as needed for your setup.

### Using Docker Compose with SearXNG

For a more integrated setup, especially with SearXNG, you can use `docker-compose`. Here's an example `docker-compose.yml`:

```yaml
version: '3.8'

services:
  cognito-ai-search:
    build:
      context: . # Assumes docker-compose.yml is in the Cognito AI Search root
      args:
        # Optional: Provide build-time args for NEXT_PUBLIC_ variables if needed
        # OLLAMA_API_URL: "http://ollama:11434"
        # SEARXNG_API_URL: "http://searxng:8080"
    image: cognito-ai-search # Optional: use a pre-built image name
    container_name: cognito_ai_search
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      # Point to SearXNG service within the Docker network
      SEARXNG_API_URL: "http://searxng:8080"
      # Point to Ollama (adjust as needed)
      OLLAMA_API_URL: "http://host.docker.internal:11434" # If Ollama is on host
      # OLLAMA_API_URL: "http://ollama:11434" # If Ollama is another service in this compose
      DEFAULT_OLLAMA_MODEL: "phi3:mini"
    # depends_on:
    #   - searxng # Uncomment if SearXNG should start first
    #   - ollama  # Uncomment if Ollama is a service and should start first
    restart: unless-stopped

  searxng:
    image: searxng/searxng:latest # Or your preferred SearXNG image
    container_name: searxng
    # ports: # Only if you need to access SearXNG directly from host
    #   - "8080:8080"
    # Add SearXNG specific configurations (volumes for settings.yml, etc.)
    # volumes:
    #   - ./your_searxng_settings.yml:/etc/searxng/settings.yml:ro
    environment:
      # Example: Ensure SearXNG listens on all interfaces if accessed by cognito-ai-search container
      BIND_ADDRESS: "0.0.0.0:8080" 
      INSTANCE_NAME: "my-searxng"
    restart: unless-stopped

  # Optional: Ollama service
  # ollama:
  #   image: ollama/ollama:latest
  #   container_name: ollama
  #   ports:
  #     - "11434:11434"
  #   volumes:
  #     - ollama_data:/root/.ollama
  #   restart: unless-stopped

# Optional: Define a volume for Ollama data persistence
# volumes:
#   ollama_data:
```

To use this:
1.  Save the content above as `docker-compose.yml` in the root of your Cognito AI Search project.
2.  Adjust the SearXNG image, volumes, and environment variables as per your SearXNG setup.
3.  If you run Ollama as a container, uncomment and configure the `ollama` service.
4.  Run `docker-compose up -d` to start all services.

This Docker setup provides a flexible way to deploy and manage Cognito AI Search.

## New Features in v1.0.0

### 🎨 Modern UI/UX
- **Dark/Light Theme**: Automatic theme detection with manual toggle
- **Gradient Animations**: Beautiful input field animations (single run, not looping)
- **Glass Morphism**: Modern backdrop blur effects throughout the interface
- **Responsive Design**: Optimized for all device sizes

### 🚀 Enhanced Performance
- **Smart Caching**: Search results cached locally for 24 hours
- **Query Optimization**: AI-powered search query enhancement
- **Async Loading**: Search results display immediately, AI responses load in background
- **Health Checks**: Automatic service availability verification

### 🔍 Intelligent Search Features
- **Search Suggestions**: Dynamic suggestions with refresh capability
- **Recent Searches**: Persistent search history with individual removal
- **Optimized Queries**: AI enhances search terms for better results
- **Fallback Mechanisms**: Graceful degradation when services are unavailable

### 🛠️ Technical Improvements
- **Custom Hooks**: `useSearch` and `useSearchSuggestions` for state management
- **Modular API**: Separated concerns with dedicated API utilities
- **TypeScript**: Full type safety throughout the application
- **Error Handling**: Comprehensive error management with user-friendly messages

### 📱 User Experience
- **Loading States**: Clear visual feedback during operations
- **Smooth Transitions**: Polished animations and micro-interactions
- **Accessibility**: Improved keyboard navigation and screen reader support
- **Mobile Optimized**: Touch-friendly interface with responsive design

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

For additional help, please [open an issue](https://github.com/kekePower/cognito-ai-search/issues).
