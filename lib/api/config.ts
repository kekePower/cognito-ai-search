import { ApiConfig } from './types'

/**
 * Get API configuration from environment variables with defaults
 */
export function getApiConfig(): ApiConfig {
  return {
    searxngApiUrl: process.env.SEARXNG_API_URL || 'http://10.0.0.3:8888',
    ollamaApiUrl: process.env.OLLAMA_API_URL || 'http://10.0.0.3:11434',
    defaultOllamaModel: process.env.DEFAULT_OLLAMA_MODEL || 'qwen3:30b', // Fallback to qwen3:30b
    aiResponseMaxTokens: parseInt(process.env.AI_RESPONSE_MAX_TOKENS || '1200', 10), // Default to 1200 tokens
    ollamaTimeoutMs: parseInt(process.env.OLLAMA_TIMEOUT_MS || '120000', 10), // 120 seconds
  }
}

/**
 * Validate API configuration
 */
export function validateApiConfig(config: ApiConfig): void {
  if (!config.searxngApiUrl) {
    throw new Error('SEARXNG_API_URL is required')
  }
  
  if (!config.ollamaApiUrl) {
    throw new Error('OLLAMA_API_URL is required')
  }
  
  if (!config.defaultOllamaModel) {
    throw new Error('DEFAULT_OLLAMA_MODEL is required')
  }
  
  if (config.aiResponseMaxTokens <= 0) {
    throw new Error('AI_RESPONSE_MAX_TOKENS must be a positive number')
  }
  
  if (config.ollamaTimeoutMs <= 0) {
    throw new Error('OLLAMA_TIMEOUT_MS must be a positive number')
  }
}
