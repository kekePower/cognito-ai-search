"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, AlertTriangle, Loader2, Sparkles, ExternalLink, Bot, SearchCheck, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  const [aiResponse, setAiResponse] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<Array<{query: string, timestamp: number}>>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Cache configuration (1 hour in milliseconds)
  const CACHE_DURATION = 60 * 60 * 1000

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const savedSearches = localStorage.getItem('recentSearches')
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches))
      }
    } catch (error) {
      console.error('Failed to load recent searches', error)
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
  
  const performSearch = async (searchQuery: string) => {
    setIsLoading(true)
    setAiResponse("")
    setSearchResults([])
    setError(null)
    
    console.log("Starting search for query:", searchQuery)

    try {
      // Check cache first
      const cached = getCachedResults(searchQuery)
      if (cached) {
        console.log("Using cached results for query:", searchQuery)
        setAiResponse(cached.aiResponse || "")
        setSearchResults(cached.searchResults || [])
        setIsLoading(false)
        return
      }

      // Run both searches in parallel
      const [ollamaPromise, searxngPromise] = [
        fetch(`/api/ollama?q=${encodeURIComponent(searchQuery)}`),
        fetch(`/api/searxng?q=${encodeURIComponent(searchQuery)}`),
      ]

      const [ollamaSettled, searxngSettled] = await Promise.allSettled([
        ollamaPromise,
        searxngPromise,
      ])

      let aiResponse = ""
      let searchResults: any[] = []

      // Handle Ollama response
      if (ollamaSettled.status === "fulfilled" && ollamaSettled.value.ok) {
        const ollamaData = await ollamaSettled.value.json()
        aiResponse = cleanResponse(ollamaData.response || "")
        setAiResponse(aiResponse)
      } else if (ollamaSettled.status === 'rejected' || !ollamaSettled.value.ok) {
        const errorMsg = ollamaSettled.status === 'rejected' 
          ? ollamaSettled.reason?.message 
          : `Ollama API Error: ${ollamaSettled.value.status} - ${await ollamaSettled.value.text()}`
        console.error("Ollama error:", errorMsg)
        setError(prev => prev ? `${prev}\n${errorMsg}` : errorMsg)
      }

      // Handle SearXNG response
      if (searxngSettled.status === "fulfilled" && searxngSettled.value.ok) {
        const searxngData = await searxngSettled.value.json()
        searchResults = searxngData.results || []
        console.log("Received SearXNG results:", searchResults.length)
        setSearchResults(searchResults)
      } else if (searxngSettled.status === 'rejected' || !searxngSettled.value.ok) {
        const errorMsg = searxngSettled.status === 'rejected' 
          ? searxngSettled.reason?.message 
          : `SearXNG API Error: ${searxngSettled.value.status} - ${await searxngSettled.value.text()}`
        console.error("SearXNG error:", errorMsg)
        setError(prev => prev ? `${prev}\n${errorMsg}` : errorMsg)
      }

      // Cache the results if we got valid responses
      if (aiResponse || searchResults.length > 0) {
        cacheResults(searchQuery, { aiResponse, searchResults })
      }
    } catch (error: any) {
      console.error("Search error:", error)
      setError(`An unexpected error occurred: ${error.message}`)
    } finally {
      setIsLoading(false)
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
        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {(isLoading || aiResponse || searchResults.length > 0) && (
        <div className="mt-8 space-y-6">
          {isLoading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-40 bg-muted rounded-lg"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* AI Response - Always shown above results */}
              {aiResponse ? (
                <AIResponseCard response={aiResponse} />
              ) : (
                <Card className="bg-primary/5 border-primary/10 border-dashed mb-6 shadow-sm">
                  <CardHeader className="text-center py-8">
                    <Bot className="h-10 w-10 mx-auto mb-4 text-primary/50" />
                    <CardTitle className="text-primary-foreground text-lg">No AI Response</CardTitle>
                    <p className="text-muted-foreground text-sm mt-2">
                      Try asking a question to get an AI-powered answer
                    </p>
                  </CardHeader>
                </Card>
              )}
              
              {/* Search stats */}
              <div className="flex items-center justify-between mb-4 mt-8">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Search className="h-5 w-5 text-foreground/80" />
                  Web Results
                </h2>
                
                {searchResults.length > 0 && (
                  <Badge variant="outline">
                    {searchResults.length} results
                  </Badge>
                )}
              </div>
              
              {/* Web Search Results */}
              {searchResults.length > 0 ? (
                <SearchResults results={searchResults} query={query} />
              ) : (
                <Card className="bg-muted/10 border-border/40 border-dashed">
                  <CardHeader className="text-center py-8">
                    <SearchCheck className="h-10 w-10 mx-auto mb-4 text-muted-foreground/50" />
                    <CardTitle className="text-foreground/80 text-lg">No Web Results</CardTitle>
                    <p className="text-muted-foreground text-sm mt-2">
                      No web results found. Try a different search query.
                    </p>
                  </CardHeader>
                </Card>
              )}
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
              {[
                "What is artificial intelligence?",
                "Latest tech news",
                "How to learn TypeScript",
                "Best programming practices"
              ].map((suggestion, index) => (
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
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-sm font-normal h-9 px-4 hover:bg-accent/30 transition-colors"
                    onClick={() => {
                      setQuery(item.query)
                      performSearch(item.query)
                      router.push(`/?q=${encodeURIComponent(item.query)}`)
                    }}
                  >
                    {item.query.length > 30 ? `${item.query.substring(0, 30)}...` : item.query}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
