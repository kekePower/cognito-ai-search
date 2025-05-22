const requiredEnvVars = [
  'OLLAMA_API_URL',
  'SEARXNG_API_URL',
  'DEFAULT_OLLAMA_MODEL'
] as const;

// Validate required environment variables
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

export const config = {
  ollama: {
    url: process.env.OLLAMA_API_URL!,
    defaultModel: process.env.DEFAULT_OLLAMA_MODEL!,
  },
  searxng: {
    url: process.env.SEARXNG_API_URL!,
  },
} as const;
