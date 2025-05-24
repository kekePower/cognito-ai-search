"use server"

// Helper function to log detailed information about requests
async function logRequestDetails(url: string, options: any) {
  console.log(`Making request to: ${url}`)
  console.log(`Request options:`, JSON.stringify(options))
}

export async function searchOllama(query: string): Promise<string> {
  try {
    const url = "http://10.0.0.3:11434/api/generate"
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.DEFAULT_OLLAMA_MODEL || "qwen3:30b",
        prompt: "/no_think " + query,
        stream: false,
      }),
      cache: "no-store" as RequestCache,
    }

    await logRequestDetails(url, options)

    // Add a timeout to the fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // Increase timeout to 60 seconds

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        next: { revalidate: 0 }, // Ensure no caching
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Ollama API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("Ollama response received:", data)
      return data.response || "No response from AI"
    } catch (fetchError: any) {
      // Try an alternative approach with a simple fetch
      console.log("Trying alternative fetch approach for Ollama...")

      // Try with a simpler model if available
      const simpleResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3", // Try with a different model as fallback
          prompt: query,
          stream: false,
        }),
        cache: "no-store",
      })

      if (simpleResponse.ok) {
        const simpleData = await simpleResponse.json()
        return simpleData.response || "No response from AI"
      }

      throw fetchError // Re-throw if alternative also fails
    }
  } catch (error: any) {
    console.error("Error querying Ollama:", error)
    if (error.name === "AbortError") {
      return "Request to Ollama timed out. Please check if the server is running and accessible."
    }
    return `Failed to get AI response: ${error.message}`
  }
}

export async function searchSearXNG(query: string): Promise<any[]> {
  try {
    // Use the updated URL format the user provided
    const encodedQuery = encodeURIComponent(query)
    const url = `http://10.0.0.3:8888/search?format=json&q=${encodedQuery}`

    const options: RequestInit = {
      method: "GET", // Using GET as per user's URL format
      headers: {
        Accept: "application/json",
      },
      cache: "no-store" as RequestCache,
    }

    await logRequestDetails(url, options)

    // Add a timeout to the fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      next: { revalidate: 0 }, // Ensure no caching
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`SearXNG API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("SearXNG response received:", data)

    // Process the SearXNG response
    if (data.results && Array.isArray(data.results)) {
      return data.results
        .map((result: any) => ({
          title: result.title || "No title",
          url: result.url || "#",
          content: result.content || result.snippet || "No description available",
        }))
        .slice(0, 10) // Limit to 10 results
    }

    return []
  } catch (error: any) {
    console.error("Error querying SearXNG:", error)
    if (error.name === "AbortError") {
      return []
    }
    return []
  }
}

// Add a test function to check connectivity
export async function testConnections(): Promise<{ ollama: boolean; searxng: boolean }> {
  const results = {
    ollama: false,
    searxng: false,
  }

  try {
    const ollamaResponse = await fetch("http://10.0.0.3:11434/api/version", {
      method: "GET",
      cache: "no-store",
    })
    results.ollama = ollamaResponse.ok
  } catch (error) {
    console.error("Ollama connectivity test failed:", error)
  }

  try {
    const searxngResponse = await fetch("http://10.0.0.3:8888/healthz", {
      method: "GET",
      cache: "no-store",
    })
    results.searxng = searxngResponse.ok
  } catch (error) {
    console.error("SearXNG connectivity test failed:", error)
  }

  return results
}
