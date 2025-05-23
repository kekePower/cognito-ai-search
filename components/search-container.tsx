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
  const [displayedOriginalQuery, setDisplayedOriginalQuery] = useState<string | null>(null)
  const [displayedOptimizedQuery, setDisplayedOptimizedQuery] = useState<string | null>(null)
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
  }, [CACHE_DURATION])

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

  // Function to perform the search
  const performSearch = useCallback(async (searchQuery: string, bypassCache = false) => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setIsAiLoading(true)
    setError(null)
    setAiResponse("")
    setSearchResults([])
    setDisplayedOriginalQuery(null) // Clear previous queries
    setDisplayedOptimizedQuery(null)

    router.push(`/?q=${encodeURIComponent(searchQuery)}`)
    
    try {
      // Check cache first (unless bypassCache is true)
      if (!bypassCache) {
        const cachedResult = getCachedResults(searchQuery)
        if (cachedResult) {
          setAiResponse(cachedResult.aiResponse || "")
          setSearchResults(cachedResult.searchResults || [])
          setDisplayedOriginalQuery(cachedResult.originalQuery || searchQuery)
          setDisplayedOptimizedQuery(cachedResult.optimizedQuery || searchQuery)
          setIsLoading(false)
          // No need to set isAiLoading to false here, as AI response might still be pending or fetched separately
          return
        }
      }

      // If not in cache or bypassing cache, fetch new results
      // Fetch SearXNG results
      try {
        const searxngResponse = await fetch(`/api/searxng?q=${encodeURIComponent(searchQuery)}`)
        if (!searxngResponse.ok) {
          const errorData = await searxngResponse.json()
          throw new Error(errorData.error || "Failed to fetch web results")
        }
        const searxngData = await searxngResponse.json()
        const results = searxngData.results || []
        setSearchResults(results)

        const originalFromAPI = searxngData.originalQuery || searchQuery;
        const optimizedFromAPI = searxngData.optimizedQuery || originalFromAPI; // Fallback to original if optimized is missing

        setDisplayedOriginalQuery(originalFromAPI)
        setDisplayedOptimizedQuery(optimizedFromAPI)
            
        // Cache web search results immediately
        if (results.length > 0) {
          const combinedDataToCache = {
            aiResponse: "", // AI response will be cached separately or fetched fresh
            searchResults: results,
            originalQuery: originalFromAPI,
            optimizedQuery: optimizedFromAPI
          }
          cacheResults(searchQuery, combinedDataToCache)
        }
      } catch (e: any) {
        console.error("Error fetching web results:", e)
        setError(`Failed to fetch web results: ${e.message}`)
        // Don't set isLoading to false here, AI response might still be coming
      }
      
      // Fetch AI response (Ollama)
      try {
        const aiRes = await fetch(`/api/ollama?q=${encodeURIComponent(searchQuery)}${bypassCache ? '&bypassCache=true' : ''}`)
        if (!aiRes.ok) {
          const errorData = await aiRes.json()
          throw new Error(errorData.error || "Failed to fetch AI response")
        }
        const aiData = await aiRes.json()
        const cleanedAiResponse = cleanResponse(aiData.response || "")
        setAiResponse(cleanedAiResponse)

        // Update cache with AI response
        const cachedDataForAI = getCachedResults(searchQuery) || { searchResults: [], originalQuery: searchQuery, optimizedQuery: searchQuery }
        cacheResults(searchQuery, { ...cachedDataForAI, aiResponse: cleanedAiResponse })

      } catch (e: any) {
        console.error("Error fetching AI response:", e)
        setError((prevError) => prevError ? `${prevError}, AI response error: ${e.message}` : `AI response error: ${e.message}`)
      }

    } catch (e: any) {
      console.error("Search error:", e)
      setError(e.message)
    } finally {
      setIsLoading(false)
      // but we don't set isLoading to false here as it's handled in the SearXNG response
      setIsAiLoading(false)
    }
  }, [router, getCachedResults, cacheResults, setIsLoading, setIsAiLoading, setError, setAiResponse, setSearchResults, setDisplayedOriginalQuery, setDisplayedOptimizedQuery]) // Added dependencies

  // Effect for handling initial query and query changes from URL
  useEffect(() => {
    const q = Array.isArray(initialQuery) ? initialQuery[0] : initialQuery
    if (q) {
      setQuery(q)
      const cachedData = getCachedResults(q)
      if (cachedData) {
        setAiResponse(cachedData.aiResponse || '')
        setSearchResults(cachedData.searchResults || [])
        setDisplayedOriginalQuery(cachedData.originalQuery || q)
        setDisplayedOptimizedQuery(cachedData.optimizedQuery || q)
        setError(null)
      } else {
        performSearch(q, false) // Call performSearch
      }
    } else {
      setQuery('')
      setAiResponse('')
      setSearchResults([])
      setError(null)
      setDisplayedOriginalQuery(null)
      setDisplayedOptimizedQuery(null)
    }
  }, [initialQuery, getCachedResults, performSearch]) // Added performSearch

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
              
              {displayedOptimizedQuery && displayedOriginalQuery && displayedOptimizedQuery.toLowerCase() !== displayedOriginalQuery.toLowerCase() && (
                <p className="text-xs italic text-muted-foreground mb-2">
                  Showing results for: "<em>{displayedOptimizedQuery}</em>" (optimized from: "<em>{displayedOriginalQuery}</em>")
                </p>
              )}
              
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
