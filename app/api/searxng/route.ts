import { NextResponse, type NextRequest } from "next/server"

// Get environment variables with defaults
const SEARXNG_API_URL = process.env.SEARXNG_API_URL || 'http://10.0.0.3:8888';
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://10.0.0.3:11434';
const DEFAULT_OLLAMA_MODEL = process.env.DEFAULT_OLLAMA_MODEL || 'qwen3:8b';

// Define types for API responses
type SearXNGResult = {
  title: string;
  url: string;
  content?: string;
  snippet?: string;
};

type OllamaRequestOptions = {
  num_predict: number;
  temperature: number;
  top_p: number;
};

type OllamaRequest = {
  model: string;
  prompt: string;
  stream: boolean;
  options: OllamaRequestOptions;
};

const OPTIMIZATION_PROMPT_TEMPLATE = `You are an AI Search Query Optimization Engine. Your sole task is to process an input search query and return a single, effective search query string.

Internal Guiding Principles (for your decision-making process only, not for output):

    Assess Original Query:
        Evaluate if the input query is already clear, specific, unambiguous, and directly addresses a likely user intent (e.g., "symptoms of flu in adults," "current population of Tokyo," "Google Pixel 8 Pro review").
        Consider if it uses strong keywords and is of a reasonable length for its purpose.

    If Improvement is Needed:
        Clarity and Specificity: If vague or ambiguous (e.g., "jaguar"), refine for specificity (e.g., targeting "jaguar car models" or "jaguar animal habitat facts" – choose the most probable common intent or a generally useful specification).
        Conciseness vs. Natural Language: Aim for conciseness (typically 2-7 impactful words) if it clarifies intent. For complex questions or "how-to" searches, a longer, natural language query might be the best single optimized form.
        Keyword Quality: Use strong, relevant keywords. Remove redundant words.
        User Intent Preservation: The optimized query MUST preserve the original user's core search intent. Do not change the fundamental topic.
        Single Best Output: If multiple optimization paths exist, select the ONE that offers the most significant improvement in clarity and specificity for a common interpretation of the user's likely intent.

Input:
The user will provide a single search query string.

Output Instructions:

    Your response MUST be ONLY the single, final search query string.
    If you determine the original user query is already effective and well-structured according to the internal guiding principles, output the original query string exactly as provided, and nothing else.
    If you determine the original query can be improved, output only the single, best optimized query string, and nothing else.
    DO NOT include ANY explanations, analysis, labels (like "Optimized Query:"), introductory text, affirmations, or any characters or words beyond the query string itself.

Example Interactions (showing only the AI's direct output):

User Query: "best laptop"
Your Output:
top rated lightweight laptops under $1000

User Query: "current exchange rate USD to EUR"
Your Output:
current exchange rate USD to EUR

User Query: "how to bake bread"
Your Output:
how to bake easy bread recipe for beginners

User Query: "Paris"
Your Output:
things to do in Paris

Constraint (for internal processing):

    Optimized queries should not exceed 32 words.
    
/no_think

User Query: "{USER_QUERY}"
Your Output:`;

/**
 * Cleans up the Ollama response text by removing tags and formatting
 * 
 * @param text - The raw text response from Ollama
 * @returns The cleaned text response
 */
function cleanOllamaResponseText(text: string): string {
  if (!text) return '';
  
  // Remove <Thinking> and </Thinking> tags
  let cleaned = text.replace(/<Thinking>([\s\S]*?)<\/Thinking>/g, '')
  // Remove any remaining think tags
  cleaned = cleaned.replace(/<think>([\s\S]*?)<\/think>/g, '')
  // Remove any "Optimized Query:" prefix
  cleaned = cleaned.replace(/^Optimized Query:\s*/i, '');
  // Remove any "Your Output:" prefix
  cleaned = cleaned.replace(/^Your Output:\s*/i, '');
  // Remove surrounding quotes if any
  cleaned = cleaned.replace(/^["'](.*)["']$/, '$1');
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
async function getOptimizedQuery(originalQuery: string, ollamaApiUrl: string, ollamaModel: string, timeoutMs: number): Promise<string> {
  const prompt = OPTIMIZATION_PROMPT_TEMPLATE.replace("{USER_QUERY}", originalQuery);

  try {
    const ollamaRequestBody: OllamaRequest = {
      model: ollamaModel,
      prompt: prompt,
      stream: false,
      options: {
        num_predict: 60, // Max 32 words, ~1.5-2 tokens per word on average + buffer
        temperature: 0.2, // Low temperature for more deterministic/focused output
        top_p: 0.5        // Further constrains token selection
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs); // timeout in milliseconds

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
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Ollama optimization API error: ${response.status} - ${errorText}`);
      return originalQuery;
    }

    const data = await response.json();
    
    if (data && data.response) {
      const optimized = cleanOllamaResponseText(data.response);
      // Basic validation: not empty and not excessively long
      if (optimized.length > 0 && optimized.length <= 200) { 
          return optimized;
      } else {
          console.warn(`Optimized query is empty or too long after cleaning: "${optimized}" (length: ${optimized.length})`);
          return originalQuery;
      }
    } else {
      console.warn(`Ollama optimization response format unexpected`, data);
      return originalQuery;
    }
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error(`Ollama optimization request timed out for query: "${originalQuery}"`);
    } else {
      console.error(`Error during Ollama optimization: ${error.message}`);
    }
    return originalQuery;
  }
}

import { getApiConfig, validateApiConfig } from '@/lib/api/config'
import { fetchSearchResults } from '@/lib/api/searxng'
import { SearchApiResponse } from '@/lib/api/types'

export async function GET(request: NextRequest) {
  try {
    // Get and validate configuration
    const config = getApiConfig()
    validateApiConfig(config)
    
    // Extract query from URL parameters
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      )
    }

    console.log(`[SearXNG API] Processing search query: "${query}"`)

    // Optimize the query using Ollama
    let optimizedQuery = query
    try {
      optimizedQuery = await getOptimizedQuery(
        query,
        config.ollamaApiUrl,
        config.defaultOllamaModel,
        config.ollamaTimeoutMs
      )
      console.log(`[SearXNG API] Query optimized: "${query}" -> "${optimizedQuery}"`)
    } catch (error) {
      console.warn('[SearXNG API] Query optimization failed, using original query:', error)
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
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })

  } catch (error: any) {
    console.error('[SearXNG API] Error:', error)
    
    const response: SearchApiResponse = {
      results: [],
      originalQuery: '',
      optimizedQuery: '',
      error: error.message || 'An unexpected error occurred',
    }

    return NextResponse.json(response, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  }
}

/**
 * HEAD handler for health check of the SearXNG server
 */
export async function HEAD() {
  try {
    // Simple health check
    const response = await fetch(`${SEARXNG_API_URL}/healthz`, {
      method: "GET",
      cache: "no-store",
      next: { revalidate: 0 },
    })

    return NextResponse.json({
      status: response.ok ? "ok" : "error",
      message: response.ok ? "SearXNG server is reachable" : "SearXNG server not reachable",
    })
  } catch (error: any) {
    console.error("Error checking SearXNG status:", error)
    return NextResponse.json({
      status: "error",
      message: `Failed to connect to SearXNG: ${error.message}`,
    })
  }
}
