import { NextResponse, type NextRequest } from "next/server"

// Define types for API responses
type SearXNGResult = {
  title: string
  url: string
  content?: string
  snippet?: string
}

type OllamaRequestOptions = {
  num_predict: number
  temperature: number
  top_p: number
}

type OllamaRequest = {
  model: string
  prompt: string
  stream: boolean
  options: OllamaRequestOptions
  think?: boolean; // Add think property for controlling model's thought process output
}

const OPTIMIZATION_PROMPT_TEMPLATE = `
/no_think
You are a Search Query Optimizer.
Task: Transform the User Query into an improved, concise search query, **ensuring the core user intent is preserved and clarity is enhanced.**
If the User Query is already optimal (clear, specific, good intent), OR if you cannot confidently improve it while strictly adhering to all rules and preserving intent, return the original User Query verbatim.

Output Rules:
- ONLY the optimized query string.
- SINGLE LINE.
- NO explanations, NO labels, NO extra text.
- Max 32 words.

Examples:
User: "best laptop"
Optimized: "top rated lightweight laptops under $1000"

User: "current exchange rate USD to EUR"
Optimized: "current exchange rate USD to EUR"

User: "how to bake bread"
Optimized: "how to bake easy bread recipe for beginners"

User: "Paris"
Optimized: "things to do in Paris"

User Query: "{USER_QUERY}"
Optimized:
`

/**
 * Cleans up the Ollama response text by removing tags and formatting
 *
 * @param text - The raw text response from Ollama
 * @returns The cleaned text response
 */
function cleanOllamaResponseText(text: string): string {
  if (!text) return ""

  // Remove <Thinking> and </Thinking> tags
  let cleaned = text.replace(/<Thinking>([\s\S]*?)<\/Thinking>/g, "")
  // Remove any remaining think tags
  cleaned = cleaned.replace(/<think>([\s\S]*?)<\/think>/g, "")
  // Remove any "Optimized Query:" prefix
  cleaned = cleaned.replace(/^Optimized Query:\s*/i, "")
  // Remove any "Your Output:" prefix
  cleaned = cleaned.replace(/^Your Output:\s*/i, "")
  // Remove surrounding quotes if any
  cleaned = cleaned.replace(/^["'](.*)["']$/, "$1")
  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim()
  return cleaned
}

/**
 * Gets an optimized search query using Ollama
 *
 * @param originalQuery - The original user query
 * @param ollamaApiUrl - The URL of the Ollama API
 * @param ollamaModel - The model to use for optimization
 * @param timeoutMs - The timeout in milliseconds for the optimization request
 * @returns The optimized query or the original query if optimization fails
 */
async function getOptimizedQuery(
  originalQuery: string,
  ollamaApiUrl: string,
  ollamaModel: string,
  timeoutMs: number,
): Promise<string> {
  let prompt = OPTIMIZATION_PROMPT_TEMPLATE.replace("{USER_QUERY}", originalQuery)

  // Special emphasized instructions for specific model families
  if (ollamaModel.startsWith('deepseek-r1')) {
    prompt += "\n\nIMPORTANT: Your response MUST be a SINGLE line. It MUST NOT exceed 32 words. ONLY the optimized query string. NO other text, NO explanations, NO thought process. SINGLE LINE, MAX 32 WORDS. VIOLATING THIS WILL RESULT IN FAILURE.";
  } else if (ollamaModel.startsWith('qwen')) {
    prompt += "\n\nYour task is to return ONLY the optimized search query string. If the original query is already optimal or you cannot improve it, return the original query verbatim. Do not add any other text, explanations, or conversational filler. Your response MUST be a SINGLE line.";
  }

  try {
    const ollamaRequestBody: OllamaRequest = {
      model: ollamaModel,
      prompt: prompt,
      stream: false,
      options: {
        num_predict: 100, // Max tokens for optimized query
        temperature: 0.2, // Low temperature for deterministic output
        top_p: 0.5, // Further constrains token selection
      },
      think: false, // Instruct Ollama to not output its thinking process
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs) // timeout in milliseconds

    const response = await fetch(`${ollamaApiUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(ollamaRequestBody),
      signal: controller.signal,
      cache: "no-store",
      next: { revalidate: 0 },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Ollama optimization API error: ${response.status} - ${errorText}`)
      return originalQuery
    }

    const data = await response.json()

    if (data && typeof data.response === 'string') {
      const optimized = cleanOllamaResponseText(data.response)
      // Basic validation: not empty and not excessively long
      if (optimized.length > 0 && optimized.length <= 200) {
        return optimized
      } else {
        console.warn(
          `Optimized query is empty or too long after cleaning: "${optimized}" (length: ${optimized.length})`,
        )
        return originalQuery
      }
    } else {
      console.warn(`Ollama optimization response format unexpected`, data)
      return originalQuery
    }
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error(`Ollama optimization request timed out for query: "${originalQuery}"`)
    } else {
      console.error(`Error during Ollama optimization: ${error.message}`)
    }
    return originalQuery
  }
}

import { getApiConfig } from "@/lib/api/config"
import { fetchSearchResults } from "@/lib/api/searxng"
import type { SearchApiResponse } from "@/lib/api/types"

export async function GET(request: NextRequest) {
  try {
    // Get configuration - handle missing env vars gracefully
    let config;
    try {
      config = getApiConfig()
    } catch (configError) {
      console.error('[SearXNG API] Configuration error:', configError)
      const response: SearchApiResponse = {
        results: [],
        originalQuery: '',
        optimizedQuery: '',
        error: 'Search service configuration is incomplete. Please check your environment setup.'
      }
      return NextResponse.json(response, { status: 503 })
    }

    // Extract query from URL parameters
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 })
    }

    console.log(`[SearXNG API] Processing search query: "${query}"`)

    // Optimize the query using Ollama
    let optimizedQuery = query
    try {
      optimizedQuery = await getOptimizedQuery(
        query,
        config.ollamaApiUrl,
        config.defaultOllamaModel,
        config.ollamaTimeoutMs,
      )
      console.log(`[SearXNG API] Query optimized: "${query}" -> "${optimizedQuery}"`)
    } catch (error) {
      console.warn("[SearXNG API] Query optimization failed, using original query:", error)
    }

    // Fetch search results from SearXNG using the original query
    const results = await fetchSearchResults(query, config.searxngApiUrl)

    console.log(`[SearXNG API] Found ${results.length} search results`)

    const response: SearchApiResponse = {
      results,
      originalQuery: query,
      optimizedQuery,
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error: any) {
    console.error("[SearXNG API] Error:", error)

    const response: SearchApiResponse = {
      results: [],
      originalQuery: "",
      optimizedQuery: "",
      error: error.message || "An unexpected error occurred",
    }

    return NextResponse.json(response, {
      status: 500,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  }
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json()

    if (!query) {
      return NextResponse.json({ error: 'Query parameter "query" in JSON body is required' }, { status: 400 })
    }

    const config = getApiConfig()
    console.log(`[SearXNG API] Processing search query: "${query}"`)

    let optimizedQuery = query
    // Ensure config.ollamaApiUrl and config.defaultOllamaModel are valid before calling
    if (config.ollamaApiUrl && config.defaultOllamaModel) {
      try {
        optimizedQuery = await getOptimizedQuery(
          query,
          config.ollamaApiUrl,
          config.defaultOllamaModel,
          config.ollamaTimeoutMs, // This was in the previous version, ensure it's in config
        )
        console.log(`[SearXNG API] Query optimized: "${query}" -> "${optimizedQuery}"`)
      } catch (error) {
        console.warn("[SearXNG API] Query optimization failed, using original query:", error)
      }
    } else {
      console.warn("[SearXNG API] Ollama configuration missing, skipping query optimization.")
    }

    const results = await fetchSearchResults(optimizedQuery, config.searxngApiUrl) // Using optimizedQuery for search

    console.log(`[SearXNG API] Found ${results.length} search results for query: "${optimizedQuery}"`)

    const response: SearchApiResponse = {
      results,
      originalQuery: query,
      optimizedQuery,
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error: any) {
    console.error("[SearXNG API] Error in POST handler:", error.message, error.stack)

    // Ensure query is defined for the error response, even if it failed early
    const requestBody = await req.text().catch(() => "{}") // Try to get body text for logging
    let originalQueryAttempt = ""
    try {
      originalQueryAttempt = JSON.parse(requestBody).query || ""
    } catch {
      /* ignore parsing error */
    }

    const response: SearchApiResponse = {
      results: [],
      originalQuery: originalQueryAttempt,
      optimizedQuery: originalQueryAttempt, // as optimization might not have run
      error: error.message || "An unexpected error occurred in SearXNG API",
    }

    return NextResponse.json(response, {
      status: 500,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  }
}

/**
 * HEAD handler for health check of the SearXNG server
 */
export async function HEAD() {
  try {
    // Get configuration
    const config = getApiConfig()

    // Simple health check
    const response = await fetch(`${config.searxngApiUrl}/healthz`, {
      method: "GET",
      cache: "no-store",
      next: { revalidate: 0 },
    })

    return NextResponse.json({
      status: response.ok ? "ok" : "error",
      message: response.ok ? "SearXNG server is reachable" : "SearXNG server not reachable",
      apiUrlUsed: config.searxngApiUrl, // Optional: for debugging which URL was used
    })
  } catch (error: any) {
    console.error("Error checking SearXNG status:", error)
    // Attempt to get config even in error to report which URL might have failed
    let apiUrlReport = "unknown (config could not be loaded)"
    try {
      const config = getApiConfig()
      apiUrlReport = config.searxngApiUrl || "undefined (config loaded but URL empty)"
    } catch (configError) {
      // Config loading failed, stick with initial message
    }
    return NextResponse.json({
      status: "error",
      message: `Failed to connect to SearXNG: ${error.message}`,
      apiUrlAttempted: apiUrlReport, // Optional: for debugging
    })
  }
}