import { OllamaRequest, OllamaResponse } from './types'

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
Your Output:`

/**
 * Clean Ollama response text by removing tags and formatting
 */
export function cleanOllamaResponseText(text: string): string {
  if (!text) return ''
  
  // Remove <Thinking> and </Thinking> tags
  let cleaned = text.replace(/<Thinking>[\s\S]*?<\/Thinking>/g, '')
  // Remove any remaining think tags
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/g, '')
  // Remove any "Optimized Query:" prefix
  cleaned = cleaned.replace(/^Optimized Query:\s*/i, '')
  // Remove any "Your Output:" prefix
  cleaned = cleaned.replace(/^Your Output:\s*/i, '')
  // Remove quotes if they wrap the entire response
  cleaned = cleaned.replace(/^["'](.*)["']$/, '$1')
  // Trim whitespace
  cleaned = cleaned.trim()
  
  return cleaned
}

/**
 * Check if Ollama server is healthy and responsive
 */
export async function checkOllamaHealth(ollamaApiUrl: string): Promise<boolean> {
  try {
    const response = await fetch(`${ollamaApiUrl}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout for health check
    })
    return response.ok
  } catch (error) {
    console.error('Ollama health check failed:', error)
    return false
  }
}

/**
 * Get optimized search query using Ollama
 */
export async function getOptimizedQuery(
  originalQuery: string,
  ollamaApiUrl: string,
  ollamaModel: string,
  timeoutMs?: number
): Promise<string> {
  try {
    // Use provided timeout or default to 120 seconds
    const timeout = timeoutMs || 120000
    
    const prompt = OPTIMIZATION_PROMPT_TEMPLATE.replace('{USER_QUERY}', originalQuery)
    
    const requestBody: OllamaRequest = {
      model: ollamaModel,
      prompt,
      stream: false,
      options: {
        num_predict: 60,
        temperature: 0.2,
        top_p: 0.5,
      },
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(`${ollamaApiUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
      cache: 'no-store',
      next: { revalidate: 0 },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Ollama optimization API error: ${response.status} - ${errorText}`)
      return originalQuery
    }

    const data: OllamaResponse = await response.json()
    
    if (data?.response) {
      const optimized = cleanOllamaResponseText(data.response)
      // Basic validation: not empty and not excessively long
      if (optimized.length > 0 && optimized.length <= 200) { 
        return optimized
      } else {
        console.warn(`Optimized query is empty or too long after cleaning: "${optimized}" (length: ${optimized.length})`)
        return originalQuery
      }
    } else {
      console.warn('Ollama optimization response format unexpected', data)
      return originalQuery
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error(`Ollama optimization request timed out for query: "${originalQuery}"`)
    } else {
      console.error(`Error during Ollama optimization: ${error.message}`)
    }
    return originalQuery
  }
}

/**
 * Generate AI response using Ollama
 */
export async function generateAIResponse(
  prompt: string,
  ollamaApiUrl: string,
  ollamaModel: string,
  maxTokens: number = 150,
  timeoutMs?: number
): Promise<string> {
  try {
    // Use provided timeout or default to 120 seconds
    const timeout = timeoutMs || 120000
    
    const requestBody: OllamaRequest = {
      model: ollamaModel,
      prompt,
      stream: false,
      options: {
        num_predict: maxTokens,
        temperature: 0.7,
        top_p: 0.9,
      },
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(`${ollamaApiUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
      cache: 'no-store',
      next: { revalidate: 0 },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Ollama API error: ${response.status} - ${errorText}`)
    }

    const data: OllamaResponse = await response.json()
    
    if (data?.response) {
      return data.response.trim()
    } else {
      throw new Error('Invalid response format from Ollama')
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('AI response generation timed out')
    }
    throw error
  }
}
