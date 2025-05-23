import { SearchResult, SearXNGResult } from './types'

/**
 * Fetch search results from SearXNG
 */
export async function fetchSearchResults(
  query: string,
  searxngApiUrl: string,
  maxResults: number = 10,
  timeoutMs: number = 30000
): Promise<SearchResult[]> {
  try {
    const encodedQuery = encodeURIComponent(query)
    const searchUrl = `${searxngApiUrl}/search?format=json&q=${encodedQuery}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
      cache: 'no-store',
      next: { revalidate: 0 },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`SearXNG API Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    // Process the SearXNG response
    const results = data.results && Array.isArray(data.results)
      ? data.results
          .map((result: SearXNGResult) => ({
            title: result.title || 'No title',
            url: result.url || '#',
            content: result.content || result.snippet || 'No description available',
          }))
          .slice(0, maxResults)
      : []

    return results
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request to SearXNG timed out. Please check if the server is running and accessible.')
    }
    throw error
  }
}

/**
 * Check SearXNG server health
 */
export async function checkSearXNGHealth(searxngApiUrl: string): Promise<boolean> {
  try {
    const response = await fetch(`${searxngApiUrl}/healthz`, {
      method: 'GET',
      cache: 'no-store',
      next: { revalidate: 0 },
    })

    return response.ok
  } catch (error) {
    console.error('Error checking SearXNG status:', error)
    return false
  }
}
