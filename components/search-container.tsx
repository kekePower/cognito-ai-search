"use client"

import { useState, useEffect, useRef, useCallback, type FormEvent } from "react"
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

type SearchResult = {
  title: string
  url: string
  content: string
}

type RecentSearch = {
  query: string
  timestamp: number
}

export default function SearchContainer({ initialQuery = "" }: SearchContainerProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [displayedOriginalQuery, setDisplayedOriginalQuery] = useState<string | null>(null)
  const [displayedOptimizedQuery, setDisplayedOptimizedQuery] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])  
  const [suggestions, setSuggestions] = useState<string[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Cache configuration (1 hour in milliseconds)
  const CACHE_DURATION = 60 * 60 * 1000
  
  // Local storage keys
  const RECENT_SEARCHES_KEY = 'recentSearches'

  // Load recent searches from localStorage and set random suggestions on mount
  useEffect(() => {
    try {
      // Load recent searches
      const savedSearches = localStorage.getItem(RECENT_SEARCHES_KEY)
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches))
      }
      
      // Set random search suggestions
      setSuggestions(getRandomSuggestions(4))
    } catch (error) {
      console.error('Failed to load recent searches or set suggestions', error)
    }
  }, [])

  // Update URL when search is performed
  const updateUrl = useCallback((searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery)}`, { scroll: false })
    }
  }, [router])

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
  }, [])
  
  // Delete a search from cache and recent searches
  const deleteSearch = useCallback((queryToDelete: string) => {
    try {
      // Remove from cache
      const cacheKey = `search:${queryToDelete.toLowerCase().trim()}`
      localStorage.removeItem(cacheKey)
      
      // Remove from recent searches
      setRecentSearches(prev => {
        const newSearches = prev.filter(item => item.query.toLowerCase() !== queryToDelete.toLowerCase())
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newSearches))
        return newSearches
      })
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
        ].slice(0, 10) // Keep only the 10 most recent
        
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newSearches))
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
    setError(null)
    setDisplayedOriginalQuery(null)
    setDisplayedOptimizedQuery(null)
    
    // First check if we have cached results and we're not bypassing cache
    const cachedResults = !bypassCache ? getCachedResults(searchQuery) : null
    if (cachedResults) {
      setSearchResults(cachedResults.results || [])
      setAiResponse(cachedResults.aiResponse || '')
      setDisplayedOriginalQuery(cachedResults.originalQuery || searchQuery)
      setDisplayedOptimizedQuery(cachedResults.optimizedQuery || null)
      setIsLoading(false)
      setIsAiLoading(false)
      return
    }
    
    try {
      // First, get search results from SearXNG
      const searchResponse = await fetch(`/api/searxng?q=${encodeURIComponent(searchQuery)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })
      
      if (!searchResponse.ok) {
        throw new Error(`Search API error: ${searchResponse.status}`)
      }
      
      const searchData = await searchResponse.json()
      setSearchResults(searchData.results || [])
      setDisplayedOriginalQuery(searchData.originalQuery || searchQuery)
      setDisplayedOptimizedQuery(searchData.optimizedQuery || null)
      setIsLoading(false)
      
      // Then, get AI response
      setIsAiLoading(true)
      const aiResponse = await fetch(`/api/ollama?q=${encodeURIComponent(searchQuery)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })
      
      if (!aiResponse.ok) {
        throw new Error(`AI API error: ${aiResponse.status}`)
      }
      
      const aiData = await aiResponse.json()
      setAiResponse(aiData.response || '')
      setIsAiLoading(false)
      
      // Cache the combined results
      cacheResults(searchQuery, {
        results: searchData.results || [],
        aiResponse: aiData.response || '',
        originalQuery: searchData.originalQuery || searchQuery,
        optimizedQuery: searchData.optimizedQuery || null
      })
      
    } catch (error: any) {
      console.error('Search error:', error)
      setError(error.message || 'An error occurred during search')
      setIsLoading(false)
      setIsAiLoading(false)
    }
  }, [getCachedResults, cacheResults])

  // Function to regenerate the AI response (bypass cache)
  const regenerateResponse = useCallback(async () => {
    if (!displayedOriginalQuery) return
    
    setIsAiLoading(true)
    try {
      const aiResponse = await fetch(`/api/ollama?q=${encodeURIComponent(displayedOriginalQuery)}&nocache=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })
      
      const aiData = await aiResponse.json()
      setAiResponse(aiData.response || '')
    } catch (error) {
      console.error('Error regenerating AI response:', error)
    } finally {
      setIsAiLoading(false)
    }
  }, [displayedOriginalQuery])

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
        performSearch(q)
      }
    } else {
      setQuery('')
      setAiResponse('')
      setSearchResults([])
      setError(null)
      setDisplayedOriginalQuery(null)
      setDisplayedOptimizedQuery(null)
    }
  }, [initialQuery, getCachedResults, performSearch])

  // Handle form submission
  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      performSearch(query)
      updateUrl(query)
    }
  }
  
  // No streaming function needed

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
                    updateUrl(suggestion)
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
                        updateUrl(item.query)
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
