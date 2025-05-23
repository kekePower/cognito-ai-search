import { NextResponse } from "next/server"

// Get environment variables with defaults
const SEARXNG_API_URL = process.env.SEARXNG_API_URL || 'http://10.0.0.3:8888';
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://10.0.0.3:11434';
const DEFAULT_OLLAMA_MODEL = process.env.DEFAULT_OLLAMA_MODEL || 'qwen3:8b'; // Or a model suitable for query optimization

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

// Function to clean up Ollama response text
function cleanOllamaResponseText(text: string): string {
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

async function getOptimizedQuery(originalQuery: string, ollamaApiUrl: string, ollamaModel: string): Promise<string> {
  const prompt = OPTIMIZATION_PROMPT_TEMPLATE.replace("{USER_QUERY}", originalQuery);

  try {
    const ollamaRequestBody = {
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
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout for optimization

    const response = await fetch(`${ollamaApiUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(ollamaRequestBody),
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Ollama optimization API error: ${response.status} - ${errorText}. Falling back to original query: "${originalQuery}"`);
      return originalQuery;
    }

    const data = await response.json();
    
    if (data && data.response) {
      const optimized = cleanOllamaResponseText(data.response);
      // Basic validation: not empty and not excessively long (e.g. > 150 chars for a 32 word query)
      if (optimized.length > 0 && optimized.length <= 200) { 
          console.log(`Original query: "${originalQuery}", Optimized query: "${optimized}"`);
          return optimized;
      } else {
          console.warn(`Optimized query is empty or too long after cleaning: "${optimized}" (length: ${optimized.length}). Falling back to original query: "${originalQuery}"`);
          return originalQuery;
      }
    } else {
      console.warn(`Ollama optimization response format unexpected. Falling back to original query: "${originalQuery}"`, data);
      return originalQuery;
    }
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error(`Ollama optimization request timed out for query: "${originalQuery}". Falling back to original query.`);
    } else {
      console.error(`Error during Ollama optimization for query: "${originalQuery}": ${error.message}. Falling back to original query.`);
    }
    return originalQuery;
  }
}

export async function GET(request: Request) {
  try {
    // Get the query parameter from the URL
    const url = new URL(request.url)
    const query = url.searchParams.get("q")

    if (!query) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
    }

    // Get optimized query (or original if optimization fails)
    const finalQuery = await getOptimizedQuery(query, OLLAMA_API_URL, DEFAULT_OLLAMA_MODEL);

    const encodedQuery = encodeURIComponent(finalQuery)
    const searchUrl = `${SEARXNG_API_URL}/search?format=json&q=${encodedQuery}`

    console.log(`Calling SearXNG API with URL: ${searchUrl}`);

    // Add a timeout to the fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `SearXNG API Error: ${response.status} - ${errorText}` },
        { status: response.status },
      )
    }

    const data = await response.json()

    // Process the SearXNG response
    let results = []
    if (data.results && Array.isArray(data.results)) {
      results = data.results
        .map((result: any) => ({
          title: result.title || "No title",
          url: result.url || "#",
          content: result.content || result.snippet || "No description available",
        }))
        .slice(0, 10) // Limit to 10 results
    }

    return NextResponse.json({ results, originalQuery: query, optimizedQuery: finalQuery })
  } catch (error: any) {

    if (error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request to SearXNG timed out. Please check if the server is running and accessible." },
        { status: 504 },
      )
    }

    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 })
  }
}

export async function HEAD() {
  try {
    const searxngEndpoint = "http://10.0.0.3:8888"

    // Simple health check
    const response = await fetch(`${searxngEndpoint}/healthz`, {
      method: "GET",
      cache: "no-store",
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
