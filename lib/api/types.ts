// API Types and Interfaces
export interface SearchResult {
  title: string
  url: string
  content: string
  parsed_url?: string[]
}

export interface SearXNGResult {
  title: string
  url: string
  content?: string
  snippet?: string
}

export interface OllamaRequestOptions {
  num_predict: number
  temperature: number
  top_p: number
}

export interface OllamaRequest {
  model: string
  prompt: string
  stream: boolean
  options: OllamaRequestOptions
}

export interface OllamaResponse {
  response: string
  done: boolean
  context?: number[]
  total_duration?: number
  load_duration?: number
  prompt_eval_count?: number
  prompt_eval_duration?: number
  eval_count?: number
  eval_duration?: number
}

export interface SearchApiResponse {
  results: SearchResult[]
  originalQuery: string
  optimizedQuery: string
  error?: string
}

export interface AIResponse {
  response: string
  error?: string
}

// Environment configuration
export interface ApiConfig {
  searxngApiUrl: string
  ollamaApiUrl: string
  defaultOllamaModel: string
  aiResponseMaxTokens: number
  ollamaTimeoutMs: number
}

// Cache types
export interface CachedResult {
  results: SearchResult[]
  aiResponse: string
  timestamp: number
  optimizedQuery?: string // Added to store the AI-optimized query string
}

export interface RecentSearch {
  query: string
  timestamp: number
}
