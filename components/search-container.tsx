"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2, Sparkles, ExternalLink, Bot, SearchCheck, Clock, X } from "lucide-react"
import { getRandomSuggestions } from "@/lib/search-suggestions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import AIResponseCard from "@/components/ai-response-card"
import SearchResults from "@/components/search-results"
import { cleanResponse } from "@/lib/utils"

interface SearchContainerProps {
  initialQuery?: string | string[]
}

export default function SearchContainer({ initialQuery = "" }: SearchContainerProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<Array<{query: string, timestamp: number}>>([])  
  const [suggestions, setSuggestions] = useState<string[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Cache configuration (1 hour in milliseconds)
  const CACHE_DURATION = 60 * 60 * 1000

  // Load recent searches from localStorage and set random suggestions on mount
  useEffect(() => {
    try {
      // Load recent searches
      const savedSearches = localStorage.getItem('recentSearches')
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches))
      }
      
      // Set random search suggestions
      setSuggestions(getRandomSuggestions(4))
    } catch (error) {
      console.error('Failed to load recent searches or set suggestions', error)
    }
  }, [])

  // Get cached results for a query
  const getCachedResults = useCallback((query: string) => {
    try {
      const cacheKey = `search:${query.toLowerCase().trim()}`
      const cached = localStorage.getItem(cacheKey)
      if (!cached) return null
      
      const { data, timestamp } = JSON.parse(cached)
      const isExpired = Date.now() - timestamp > CACHE_DURATION
      
      if (!isExpired) {
        return data
      }
      // Remove expired cache
      localStorage.removeItem(cacheKey)
    } catch (error) {
      console.error('Error reading cache', error)
    }
    return null
  }, [CACHE_DURATION])

  // Delete a search from cache and recent searches
  const deleteSearch = useCallback((queryToDelete: string) => {
    try {
      // Remove from cache
      const cacheKey = `search:${queryToDelete.toLowerCase().trim()}`
      localStorage.removeItem(cacheKey)
      
      // Remove from recent searches
      setRecentSearches(prev => {
        const newSearches = prev.filter(item => item.query.toLowerCase() !== queryToDelete.toLowerCase())
        localStorage.setItem('recentSearches', JSON.stringify(newSearches))
        return newSearches
      })
      
      console.log(`Deleted search: ${queryToDelete}`)
    } catch (error) {
      console.error('Error deleting search', error)
    }
  }, [])

  // Cache search results
  const cacheResults = useCallback((query: string, data: any) => {
    try {
      const cacheKey = `search:${query.toLowerCase().trim()}`
      const cacheData = {
        data,
        timestamp: Date.now()
      }
      localStorage.setItem(cacheKey, JSON.stringify(cacheData))

      // Update recent searches
      setRecentSearches(prev => {
        const newSearches = [
          { query, timestamp: Date.now() },
          ...prev.filter(item => item.query.toLowerCase() !== query.toLowerCase())
        ].slice(0, 5) // Keep only 5 most recent searches
        
        try {
          localStorage.setItem('recentSearches', JSON.stringify(newSearches))
        } catch (error) {
          console.error('Failed to save recent searches', error)
        }
        
        return newSearches
      })
    } catch (error) {
      console.error('Error caching results', error)
    }
  }, [])

  // Handle search when component mounts with URL query
  useEffect(() => {
    // If there's an initialQuery, process it
    if (initialQuery) {
      const searchQuery = Array.isArray(initialQuery) ? initialQuery[0] || '' : initialQuery
      setQuery(searchQuery)
      if (searchQuery) {
        const cached = getCachedResults(searchQuery)
        if (cached) {
          setAiResponse(cached.aiResponse || '')
          setSearchResults(cached.searchResults || [])
          setError(null)
        } else {
          performSearch(searchQuery)
        }
      }
    } else {
      // If there's no initialQuery (navigating to home page), clear the search state
      setQuery('')
      setAiResponse('')
      setSearchResults([])
      setError(null)
      console.log('Cleared search state - navigated to home page without query')
    }
  }, [initialQuery, getCachedResults])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedQuery = query.trim()
    if (!trimmedQuery || isLoading) return
    
    // Update URL with search query
    const searchParams = new URLSearchParams()
    searchParams.set('q', trimmedQuery)
    router.push(`/?${searchParams.toString()}`)
    // performSearch will be triggered by the useEffect when initialQuery changes
  }
  
  // No streaming function needed
  
  // Function to regenerate the AI response (bypass cache)
  const regenerateResponse = async () => {
    if (!query) return;
    
    // Clear the current AI response
    setAiResponse("");
    
    // Perform a new search with the bypass cache flag
    await performSearch(query, true);
  };

  // Function to perform the search
  const performSearch = async (searchQuery: string, bypassCache = false) => {
    setIsLoading(true)
    setIsAiLoading(true)
    setAiResponse("")
    setSearchResults([])
    setError(null)
    
    try {
      // Check cache first (unless bypassCache is true)
      if (!bypassCache) {
        const cachedResult = getCachedResults(searchQuery)
        if (cachedResult) {
          setAiResponse(cachedResult.aiResponse || "")
          setSearchResults(cachedResult.searchResults || [])
          setIsLoading(false)
          return
        }
      }

      // Start both searches in parallel but handle them separately
      
      // Create the promises
      const ollamaPromise = fetch(`/api/ollama`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: searchQuery,
          model: process.env.NEXT_PUBLIC_DEFAULT_OLLAMA_MODEL || 'qwen3:30b'
        })
      })
      
      const searxngPromise = fetch(`/api/searxng?q=${encodeURIComponent(searchQuery)}`)
      
      // Handle SearXNG results immediately without waiting for Ollama
      searxngPromise.then(async (response) => {
        if (response.ok) {
          try {
            const searxngData = await response.json()
            const results = searxngData.results || []

            setSearchResults(results)
            
            // Set loading to false once search results are available
            // but keep AI loading state active
            setIsLoading(false)
            
            // Cache web search results immediately
            if (results.length > 0) {
              const cachedData = getCachedResults(searchQuery) || { aiResponse: "" }
              cacheResults(searchQuery, { ...cachedData, searchResults: results })
            }
          } catch (error) {

            setError(prev => {
              const errorMsg = `Error parsing SearXNG response: ${error instanceof Error ? error.message : String(error)}`
              return prev ? `${prev}\n${errorMsg}` : errorMsg
            })
          }
        } else {
          try {
            const errorText = await response.text()
            const errorMsg = `SearXNG API Error: ${response.status} - ${errorText}`
            setError(prev => prev ? `${prev}\n${errorMsg}` : errorMsg)
          } catch (e) {
            const errorMsg = `SearXNG API Error: ${response.status} - Could not read error text`
            setError(prev => prev ? `${prev}\n${errorMsg}` : errorMsg)
          }
        }
      })
      
      // Wait for Ollama response
      let aiResponse = ""
      try {
        const ollamaResponse = await ollamaPromise
        
        if (ollamaResponse.ok) {
          const ollamaData = await ollamaResponse.json()
          aiResponse = ollamaData.response || ""
          
          // Check if the response is empty or too short
          if (!aiResponse || aiResponse.length < 50) {
            const errorMsg = "The AI generated an empty or incomplete response. Please try again."
            setError(errorMsg)
          } else {
            setAiResponse(aiResponse)
            
            // Set AI loading state to false when AI response is complete
            setIsAiLoading(false)
            
            // Update cache with AI response
            const cachedData = getCachedResults(searchQuery) || { searchResults: [] }
            cacheResults(searchQuery, { ...cachedData, aiResponse })
          }
        } else {
          // Handle HTTP error
          try {
            const errorText = await ollamaResponse.text()
            const errorMsg = `Ollama API Error: ${ollamaResponse.status} - ${errorText}`
            setError(prev => prev ? `${prev}\n${errorMsg}` : errorMsg)
          } catch (e) {
            const errorMsg = `Ollama API Error: ${ollamaResponse.status} - Could not read error text`
            setError(prev => prev ? `${prev}\n${errorMsg}` : errorMsg)
          }
        }
      } catch (error) {
        // Handle network error
        const errorMsg = `Ollama API request failed: ${error instanceof Error ? error.message : String(error)}`
        setError(prev => prev ? `${prev}\n${errorMsg}` : errorMsg)
      }

      // SearXNG response is already handled in the promise chain above
      
      // Final cache update for AI response (if needed)
      if (aiResponse) {
        // Note: Web search results are already cached in the promise chain
        const cachedData = getCachedResults(searchQuery) || { searchResults: [] }
        if (!cachedData.aiResponse) {
          cacheResults(searchQuery, { ...cachedData, aiResponse })
        }
      }
    } catch (error: any) {
      setError(`An unexpected error occurred: ${error.message}`)
      // Set both loading states to false on error
      setIsLoading(false)
      setIsAiLoading(false)
    } finally {
      // In the finally block, we ensure both loading states are properly reset
      // but we don't set isLoading to false here as it's handled in the SearXNG response
      setIsAiLoading(false)
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6">
      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="relative mb-8 flex items-center"
      >
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search the web or ask a question..."
            className="pl-10 pr-24 h-12 bg-background/80 backdrop-blur-sm shadow-sm border-border/60 focus-visible:ring-primary/30 focus-visible:ring-offset-0 rounded-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute right-1.5 top-1.5">
            <Button
              type="submit"
              size="sm"
              className="h-9 rounded-full"
              disabled={isLoading || !query.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Error state */}
      {error && (
        <AIResponseCard 
          response={error} 
          isError={true} 
          isStreaming={false} 
          onRegenerate={regenerateResponse} 
        />
      )}

      {(isLoading || isAiLoading || aiResponse || searchResults.length > 0) && (
        <div className="mt-8 space-y-6">
          {/* AI Response Section */}
          {isAiLoading ? (
            /* Show loading state for AI response */
            <AIResponseCard 
              response="" 
              isError={false} 
              isStreaming={true} 
            />
          ) : aiResponse ? (
            /* Show AI response when available */
            <AIResponseCard 
              response={aiResponse} 
              isError={false} 
              isStreaming={false} 
              onRegenerate={regenerateResponse} 
            />
          ) : null}
          
          {/* Search Results Section */}
          {isLoading ? (
            /* Show loading state for search results */
            <div className="animate-pulse space-y-6 mt-8">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
          ) : searchResults.length > 0 && (
            <>
              {/* Search stats */}
              <div className="flex items-center justify-between mb-4 mt-8">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Search className="h-5 w-5 text-foreground/80" />
                  Web Results
                </h2>
                
                <Badge variant="outline">
                  {searchResults.length} results
                </Badge>
              </div>
              
              {/* Web Search Results */}
              <SearchResults results={searchResults} query={query} />
            </>
          )}
        </div>
      )}

      {/* Empty state when no search has been performed */}
      {!isLoading && !aiResponse && searchResults.length === 0 && !query && (
        <div className="text-center py-12 px-4">
          <div className="mx-auto w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
            <Search className="h-12 w-12 text-primary/80" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">What would you like to know?</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-lg mb-12">
            Ask a question or search the web to get started.
          </p>
          
          {/* Quick Suggestions */}
          <div className="max-w-2xl mx-auto mb-16">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Try searching for</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="rounded-full text-sm font-normal h-9 px-4 hover:bg-accent/50 transition-colors"
                  onClick={() => {
                    setQuery(suggestion)
                    performSearch(suggestion)
                    router.push(`/?q=${encodeURIComponent(suggestion)}`)
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center justify-center">
                <Clock className="h-4 w-4 mr-2" />
                <span className="uppercase tracking-wider">Recent Searches</span>
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {recentSearches.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-l-full text-sm font-normal h-9 px-4 hover:bg-accent/30 transition-colors"
                      onClick={() => {
                        setQuery(item.query)
                        performSearch(item.query)
                        router.push(`/?q=${encodeURIComponent(item.query)}`)
                      }}
                    >
                      {item.query.length > 30 ? `${item.query.substring(0, 30)}...` : item.query}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-r-full h-9 px-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSearch(item.query)
                      }}
                      title="Delete search"
                      aria-label={`Delete search: ${item.query}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {recentSearches.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 text-xs text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    // Clear all recent searches
                    recentSearches.forEach(item => deleteSearch(item.query))
                  }}
                >
                  Clear all recent searches
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
