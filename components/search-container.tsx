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
  const [activeTab, setActiveTab] = useState<string>("ai") // 'ai' or 'web'
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
    setActiveTab("ai") // Switch to AI tab when performing a new search
    
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

  // Focus the search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="relative w-full mb-8">
        <div className="relative flex items-center shadow-lg rounded-lg overflow-hidden border border-border/50 bg-card">
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything..."
            className="pl-12 pr-28 py-7 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
            disabled={isLoading}
          />
          <div className="absolute right-2 flex items-center space-x-2">
            <Button 
              type="submit" 
              className="h-10 px-4 bg-primary/90 hover:bg-primary text-primary-foreground font-medium"
              disabled={isLoading || !query.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Search</span>
            </Button>
          </div>
        </div>
      </form>

      {error && (
        <Alert variant="destructive" className="mb-6 rounded-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && !aiResponse && !searchResults.length && (
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur opacity-75"></div>
              <div className="relative bg-background p-4 rounded-full border border-border/50">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="font-medium">Searching for the best results</p>
              <p className="text-sm text-muted-foreground">This may take a moment...</p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && (aiResponse || searchResults.length > 0) && (
        <Tabs 
          defaultValue="ai" 
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 max-w-xs mx-auto mb-8">
            <TabsTrigger value="ai" className="flex items-center space-x-2">
              <Bot className="h-4 w-4" />
              <span>AI Answer</span>
            </TabsTrigger>
            <TabsTrigger value="web" className="flex items-center space-x-2">
              <SearchCheck className="h-4 w-4" />
              <span>Web Results</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai" className="mt-0">
            {aiResponse ? (
              <AIResponseCard response={aiResponse} />
            ) : (
              <Card className="bg-muted/30 border-dashed">
                <CardHeader>
                  <CardTitle className="text-center text-muted-foreground">No AI Response</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground text-sm">
                  Try asking a question to get an AI-powered answer
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="web" className="mt-0">
            {searchResults.length > 0 ? (
              <SearchResults results={searchResults} query={query} />
            ) : (
              <Card className="bg-muted/30 border-dashed">
                <CardHeader>
                  <CardTitle className="text-center text-muted-foreground">No Web Results</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground text-sm">
                  No web results found. Try a different search query.
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Empty state when no search has been performed */}
      {!isLoading && !aiResponse && searchResults.length === 0 && !query && (
        <div className="text-center py-12">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
            <Search className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">What would you like to know?</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Ask a question or search the web to get started.
          </p>
          
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mt-8 max-w-2xl mx-auto">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center justify-center">
                <Clock className="h-4 w-4 mr-2" />
                Recent Searches
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {recentSearches.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-sm font-normal h-8 px-4"
                    onClick={() => {
                      setQuery(item.query)
                      router.push(`/?q=${encodeURIComponent(item.query)}`)
                    }}
                  >
                    {item.query}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quick Suggestions */}
          <div className="mt-12 max-w-2xl mx-auto">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Try searching for</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "What is artificial intelligence?",
                "Latest tech news",
                "How to learn TypeScript",
                "Best programming practices"
              ].map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-sm font-normal h-8 px-4"
                  onClick={() => {
                    setQuery(suggestion)
                    router.push(`/?q=${encodeURIComponent(suggestion)}`)
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
