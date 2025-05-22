"use server"

export async function searchOllama(query: string): Promise<string> {
  try {
    const response = await fetch("http://10.0.0.3:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "cogito:14b",
        prompt: query,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`)
    }

    const data = await response.json()
    return data.response || "No response from AI"
  } catch (error) {
    console.error("Error querying Ollama:", error)
    return "Failed to get AI response. Please try again."
  }
}

export async function searchSearXNG(query: string): Promise<any[]> {
  try {
    const encodedQuery = encodeURIComponent(query)
    const response = await fetch(`http://10.0.0.3:8888/search?format=json&q=${encodedQuery}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`SearXNG API error: ${response.status}`)
    }

    const data = await response.json()

    // Process the SearXNG response
    // The structure might need adjustment based on the actual response format
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
  } catch (error) {
    console.error("Error querying SearXNG:", error)
    return []
  }
}
