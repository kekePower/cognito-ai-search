import { NextResponse } from "next/server"

// Get environment variables with defaults
const SEARXNG_API_URL = process.env.SEARXNG_API_URL || 'http://10.0.0.3:8888';

export async function GET(request: Request) {
  try {
    // Get the query parameter from the URL
    const url = new URL(request.url)
    const query = url.searchParams.get("q")

    if (!query) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
    }

    const encodedQuery = encodeURIComponent(query)
    const searchUrl = `${SEARXNG_API_URL}/search?format=json&q=${encodedQuery}`


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

    return NextResponse.json({ results })
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
