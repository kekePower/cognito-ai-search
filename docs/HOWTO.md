# Cognito AI Search v1.2.0 - Technical Documentation

This document contains detailed technical information about setting up and configuring Cognito AI Search v1.2.0. For a general overview, please see the [README.md](../README.md).

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [SearXNG Configuration](#searxng-configuration)
- [Ollama Setup](#ollama-setup)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [IPv6 Support Configuration](#ipv6-support-configuration)
- [New Features in v1.2.0](#new-features-in-v120)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Self-hosted SearXNG instance (or public instance URL)
- Ollama v0.9.0+ installed and running with desired models
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

For optimal performance in v1.2.0, we recommend:
- **Model**: `phi4-mini:3.8b-q8_0` (fast and efficient)
- **Max Tokens**: `100` (quick responses)
- **Alternative**: `mistral` or `llama3` for more detailed responses

**Important**: Ollama version 0.9.0 or higher is required due to the 'think: false' parameter support introduced in this version.

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
2. **Ensure you have Ollama v0.9.0 or higher** - check with `ollama --version`
3. Pull your preferred model:
   ```bash
   ollama pull mistral
   # or
   ollama pull llama3
   ```
4. Start the Ollama server

**Note**: Cognito AI Search v1.2.0 requires Ollama v0.9.0+ due to the 'think: false' parameter. Older versions are not supported.

## Development

### Environment Setup

**Important**: Before running any commands, you must set up your environment configuration:

1. Copy the example environment file:
   ```bash
   cp env.example .env.local
   ```

2. Edit `.env.local` with your actual configuration values:
   ```bash
   # Required: Update these with your actual service URLs
   SEARXNG_API_URL=http://your-searxng-instance:port
   OLLAMA_API_URL=http://your-ollama-instance:11434
   DEFAULT_OLLAMA_MODEL=phi4-mini:3.8b-q8_0
   AI_RESPONSE_MAX_TOKENS=100
   ```

### Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (requires .env.local)
pnpm dev

# Build for production (requires .env.local)
pnpm build

# Run production server (requires .env.local)
pnpm start

# Lint code
pnpm lint

# Type checking
pnpm type-check
```

## Production Deployment

### Building for Production

**Important**: Ensure your `.env.local` file is configured before building.

1. Copy and configure environment file (if not already done):
   ```bash
   cp env.example .env.local
   # Edit .env.local with your production values
   ```

2. Ensure all dependencies are installed:
   ```bash
   pnpm install
   ```

3. Create a production build:
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

You can deploy Cognito AI Search using Docker in two ways: using our pre-built Docker Hub image (recommended) or building your own image. This provides a containerized environment for easier setup and management, especially when integrating with other services like SearXNG using Docker Compose.

### Prerequisites

- Docker installed on your system.

### Option 1: Using Pre-built Docker Hub Image (Recommended)

The easiest way to get started is using our official Docker Hub image:

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

**Available Docker Hub Tags:**
- `kekepower/cognito-ai-search:latest` - Latest stable release
- `kekepower/cognito-ai-search:1.2.0` - Specific version tags

**Environment Variables:**
- `OLLAMA_API_URL`: URL for your Ollama instance
- `SEARXNG_API_URL`: URL for your SearXNG instance  
- `DEFAULT_OLLAMA_MODEL`: The default Ollama model to use (recommended: `phi4-mini:3.8b-q8_0`)
- `AI_RESPONSE_MAX_TOKENS`: Maximum tokens for AI responses (recommended: 1200)
- `PORT`: The port the application listens on (default: 3000)

The application will be available at `http://localhost:3000`.

### Option 2: Building Your Own Docker Image

If you prefer to build the image yourself or need to customize the build:

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

#### Running Your Custom Built Container

Once the image is built, you can run it as a container:

```bash
docker run -d -p 3000:3000 \
  -e PORT="3000" \
  -e OLLAMA_API_URL="http://host.docker.internal:11434" \
  -e SEARXNG_API_URL="http://host.docker.internal:8080" \
  -e DEFAULT_OLLAMA_MODEL="phi4-mini:3.8b-q8_0" \
  -e AI_RESPONSE_MAX_TOKENS=1200 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  cognito-ai-search # Your built image name
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

For a more integrated setup, especially with SearXNG, you can use `docker-compose`. Here's an example `docker-compose.yml` using the Docker Hub image:

```yaml
version: '3.8'

services:
  cognito-ai-search:
    image: kekepower/cognito-ai-search:latest
    container_name: cognito-ai-search
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - OLLAMA_API_URL=http://host.docker.internal:11434
      - SEARXNG_API_URL=http://searxng:8080
      - DEFAULT_OLLAMA_MODEL=phi4-mini:3.8b-q8_0
      - AI_RESPONSE_MAX_TOKENS=1200
      - NODE_ENV=production
    depends_on:
      - searxng
    networks:
      - cognito_network

  searxng:
    image: searxng/searxng:latest
    container_name: searxng
    ports:
      - "8080:8080"
    volumes:
      - ./searxng:/etc/searxng
    environment:
      - SEARXNG_BASE_URL=http://localhost:8080/
    networks:
      - cognito_network

networks:
  cognito_network:
    driver: bridge
```

To run with Docker Compose:

```bash
docker-compose up -d
```

This Docker setup provides a flexible way to deploy and manage Cognito AI Search. The Docker Hub image is automatically updated with each new release through our CI/CD pipeline.

## IPv6 Support Configuration

Cognito AI Search can be configured to be accessible over IPv6. This requires changes at the application, Docker host, and deployment levels.

### 1. Application Configuration (`package.json`)

The `scripts.start` command in `package.json` has been updated to:

```json
"start": "next start -H ::"
```

This tells the Next.js application to listen on all available IPv6 (and by default, IPv4-mapped IPv6) interfaces within its container.

### 2. Docker Host Configuration

Your Docker daemon on the host machine must be configured to enable IPv6. This is a one-time setup on the machine running Docker.

1.  **Edit `daemon.json`**:
    *   Locate or create the Docker daemon configuration file (usually at `/etc/docker/daemon.json`).
    *   Add or ensure the following content is present:
        ```json
        {
          "ipv6": true,
          "fixed-cidr-v6": "2001:db8:1::/64" 
        }
        ```
        *Note: You can replace `"2001:db8:1::/64"` with a different unique local IPv6 unicast address (ULA) block if this one is already in use on your network or if you have a specific range assigned.*

2.  **Restart Docker Service**:
    *   After saving `daemon.json`, restart the Docker service. The command varies by system:
        *   `sudo systemctl restart docker` (most common on Linux)
        *   `sudo service docker restart` (older systems)

### 3. Deployment Configuration

#### Using `docker-compose.yml` (Recommended)

The provided `docker-compose.yml` file is pre-configured for IPv6:

*   **Port Mapping**: The `cognito-ai-search` service uses `ports: - "[::]:${APP_PORT:-3000}:3000"`. This maps port 3000 of the container to the specified host port (defaulting to 3000) on all IPv6 and IPv4 interfaces of the host.
*   **Network**: An IPv6-enabled Docker network (`cognito_network`) is defined and used by the service:
    ```yaml
    networks:
      cognito_network:
        driver: bridge
        enable_ipv6: true
        ipam:
          driver: default
          config:
            - subnet: "fd00:db8:cognito::/64" # Example IPv6 ULA subnet
    ```

To run with Docker Compose:

```bash
docker-compose up -d --build
```

#### Using `docker run` (Manual)

If you are not using Docker Compose, you need to modify your `docker run` command to map the port to IPv6 on the host:

```bash
docker run -d --name cognito-ai-search \
  -p [::]:3000:3000 \
  -e OLLAMA_API_URL="http://[your_ollama_host_or_ipv6]:11434" \
  -e SEARXNG_API_URL="http://[your_searxng_host_or_ipv6]:8080" \
  -e AI_RESPONSE_MAX_TOKENS=1200 \
  -e DEFAULT_OLLAMA_MODEL="phi4-mini:3.8b-q8_0" \
  -e NODE_ENV=production \
  -e PORT=3000 \
  cognito-ai-search # Your built image name
```

*Ensure you replace placeholder URLs and add all required environment variables.*

### 4. Accessing the Service via IPv6

Once configured and running, you can access Cognito AI Search using the IPv6 address of your host machine:

`http://[<ipv6_address_of_host>]:3000/`

Replace `<ipv6_address_of_host>` with the actual IPv6 address.

## New Features in v1.2.0

### 🎨 Holographic Shard Design System
- **Crystalline Aesthetics**: Sharp angular components with polygon clip-paths
- **Neon Color Scheme**: Cyan, magenta, and blue neon accents with dynamic glow effects
- **Glass Morphism**: Enhanced transparency effects with backdrop blur
- **Dual Theme Support**: Beautiful light mode with warm cream tones and enhanced dark mode

### 🚀 Performance & Architecture
- **50% Faster Builds**: Reduced build time from 4.0s to 2.0s
- **Component Optimization**: Removed 38 unused UI components (68% reduction)
- **Dependency Cleanup**: Eliminated 31 unused dependencies
- **Modular Architecture**: Complete API layer restructuring with centralized types

### 🔍 Enhanced Search Experience
- **Next.js 15 Forms**: Modern form handling with better performance
- **PDF Export**: Professional PDF generation with LaTeX support
- **200 AI Suggestions**: Organized into 16 technical categories
- **Intelligent Error Handling**: Clean error system with contextual messages

### 🛠️ Technical Improvements
- **TypeScript Excellence**: Comprehensive type safety across all modules
- **Ollama Integration**: Enhanced with 'think: false' parameter (requires v0.9.0+)
- **Caching Strategy**: Intelligent caching with expiration and cleanup
- **Cross-Browser Compatibility**: Firefox-specific fixes for consistent appearance

### 📱 User Experience Enhancements
- **Sparkles Icon**: Modern AI-appropriate branding
- **Vibrant Colors**: Enhanced visibility in light mode
- **No Page Scrolling**: Optimized spacing for viewport-contained content
- **Visual Polish**: Fixed hydration issues and text readjustment problems

### 🔒 Security & Privacy
- **No Tracking**: Continued commitment to zero tracking and data collection
- **Local Processing**: All AI processing remains on local infrastructure
- **Enhanced Validation**: Improved input validation and secure error handling

## Troubleshooting

### Common Issues

1. **SearXNG API not accessible**
   - Ensure SearXNG is running and accessible
   - Verify the API is enabled in SearXNG settings
   - Check CORS settings if accessing from a different domain

2. **Ollama connection issues**
   - Make sure Ollama server is running
   - **Verify you have Ollama v0.9.0 or higher** - check with `ollama --version`
   - Verify the API URL and port in your environment variables
   - Check if the specified model is downloaded

3. **Build errors**
   - Ensure all dependencies are installed
   - Check Node.js version compatibility
   - Clear Next.js cache if needed: `rm -rf .next`

For additional help, please [open an issue](https://github.com/kekePower/cognito-ai-search/issues).
