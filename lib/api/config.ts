import { ApiConfig } from './types';

/**
 * Get API configuration from environment variables.
 * This function ensures that all required configurations are present and valid,
 * or it throws an error. It also provides defaults for optional numeric values.
 */
export function getApiConfig(): ApiConfig {
  const searxngApiUrl = process.env.SEARXNG_API_URL;
  const ollamaApiUrl = process.env.OLLAMA_API_URL;
  const defaultOllamaModel = process.env.DEFAULT_OLLAMA_MODEL;

  // --- Validate presence of required environment variables ---
  const missingRequiredVars: string[] = [];
  if (!searxngApiUrl) { // Checks for undefined, null, or empty string
    missingRequiredVars.push('SEARXNG_API_URL');
  }
  if (!ollamaApiUrl) {
    missingRequiredVars.push('OLLAMA_API_URL');
  }
  if (!defaultOllamaModel) {
    missingRequiredVars.push('DEFAULT_OLLAMA_MODEL');
  }

  if (missingRequiredVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingRequiredVars.join(', ')}. ` +
      `Please define them in your .env.local file or environment.`
    );
  }

  // --- Process numeric configurations with defaults and validation ---
  const aiResponseMaxTokensInput = process.env.AI_RESPONSE_MAX_TOKENS;
  let aiResponseMaxTokens = parseInt(aiResponseMaxTokensInput || '1200', 10);
  if (isNaN(aiResponseMaxTokens) || aiResponseMaxTokens <= 0) {
    console.warn(
      `Invalid or missing AI_RESPONSE_MAX_TOKENS (value: "${aiResponseMaxTokensInput}"). ` +
      `Using default: 1200.`
    );
    aiResponseMaxTokens = 1200;
  }

  const ollamaTimeoutMsInput = process.env.OLLAMA_TIMEOUT_MS;
  let ollamaTimeoutMs = parseInt(ollamaTimeoutMsInput || '120000', 10);
  if (isNaN(ollamaTimeoutMs) || ollamaTimeoutMs <= 0) {
    console.warn(
      `Invalid or missing OLLAMA_TIMEOUT_MS (value: "${ollamaTimeoutMsInput}"). ` +
      `Using default: 180000 ms.`
    );
    ollamaTimeoutMs = 180000;
  }

  // All required string variables are guaranteed to be non-null and non-empty here
  // due to the checks above. The non-null assertion operator (!) is safe to use.
  return {
    searxngApiUrl: searxngApiUrl!,
    ollamaApiUrl: ollamaApiUrl!,
    defaultOllamaModel: defaultOllamaModel!,
    aiResponseMaxTokens,
    ollamaTimeoutMs,
  };
}
