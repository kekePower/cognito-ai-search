# ---- Base Node Image ----
# Use a specific version of Node.js. Alpine Linux is used for a smaller image size.
FROM node:24-alpine AS builder
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

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
ARG AI_RESPONSE_MAX_TOKENS

# Set environment variables for the build process
ENV OLLAMA_API_URL=${OLLAMA_API_URL}
ENV SEARXNG_API_URL=${SEARXNG_API_URL}
ENV DEFAULT_OLLAMA_MODEL=${DEFAULT_OLLAMA_MODEL}
ENV AI_RESPONSE_MAX_TOKENS=${AI_RESPONSE_MAX_TOKENS}

# Set Node.js options to increase memory for the build process
ENV NODE_OPTIONS=--max-old-space-size=4096

# Build the Next.js application
RUN pnpm build

# ---- Runner Stage ----
# This stage creates the final, minimal image for running the application.
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Install pnpm globally for the runner stage to use `pnpm start`
RUN npm install -g pnpm

# Set default values for runtime environment variables.
# These can be overridden when running the container.
ENV OLLAMA_API_URL="http://localhost:11434"
ENV SEARXNG_API_URL="http://localhost:8080"
ENV DEFAULT_OLLAMA_MODEL="phi4-mini:3.8b-q8_0"
ENV AI_RESPONSE_MAX_TOKENS="1200"
ENV PORT="3000"

# Copy necessary files from the builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install production dependencies only
# Using --frozen-lockfile ensures we use the exact versions from the lockfile
RUN pnpm install --prod --frozen-lockfile

USER node

# Expose the port the app runs on.
# This should match the PORT environment variable.
EXPOSE ${PORT}

# The command to run the application using the start script from package.json
# `pnpm start` will execute `next start`
CMD ["pnpm", "start"]
