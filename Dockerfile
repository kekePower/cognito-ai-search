# ---- Base Node Image ----
# Use a specific version of Node.js. Alpine Linux is used for a smaller image size.
FROM node:20-alpine AS base
WORKDIR /app

# ---- Builder Stage ----
# This stage builds the Next.js application.
FROM base AS builder

# Install pnpm
RUN npm install -g pnpm

# Copy package manager files
# If you use pnpm workspaces, uncomment the next line and ensure pnpm-workspace.yaml is in your .dockerignore
COPY package.json pnpm-lock.yaml ./
# COPY pnpm-workspace.yaml ./

# Install dependencies
# Using --frozen-lockfile ensures that pnpm doesn't generate a new lockfile or update dependencies.
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Define build-time arguments that can be passed with `docker build --build-arg VAR=value`
# These are used by next.config.mjs to set NEXT_PUBLIC_ variables during the build
ARG OLLAMA_API_URL
ARG SEARXNG_API_URL
ARG DEFAULT_OLLAMA_MODEL

# Set environment variables for the build process
ENV OLLAMA_API_URL=${OLLAMA_API_URL}
ENV SEARXNG_API_URL=${SEARXNG_API_URL}
ENV DEFAULT_OLLAMA_MODEL=${DEFAULT_OLLAMA_MODEL}

# Build the Next.js application
# The `output: 'standalone'` in next.config.mjs ensures this creates a minimal server.
RUN pnpm build

# ---- Runner Stage ----
# This stage creates the final, minimal image for running the application.
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Set default values for environment variables.
# These can be overridden when running the container (e.g., with `docker run -e VAR=value` or in docker-compose.yml).
ENV OLLAMA_API_URL="http://localhost:11434"
ENV SEARXNG_API_URL="http://localhost:8080"
# Or your preferred default
ENV DEFAULT_OLLAMA_MODEL="phi3:mini"
ENV PORT=3000

# Copy the standalone output from the builder stage.
# This includes the Next.js server, necessary node_modules, public assets, and static files.
COPY --from=builder /app/.next/standalone ./

# Expose the port the app runs on.
# This should match the PORT environment variable and the port your Next.js app listens on.
EXPOSE 3000

# The command to run the application.
# The standalone output includes a server.js file.
CMD ["node", "server.js"]
