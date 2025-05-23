"use client"

import { useCallback, useEffect, useState, FormEvent } from "react"
import { useRouter, usePathname } from "next/navigation"

// Import modular components
import { SearchForm } from "./search/search-form"
import { RecentSearches } from "./search/recent-searches"
import { SearchResultsContainer } from "./search/search-results-container"

// Import utility functions
import { 
  SearchResult,
  RecentSearch,
  getCachedResult,
  cacheResults,
  loadRecentSearches,
  addToRecentSearches,
  removeRecentSearch,
  clearRecentSearches
} from "@/lib/search-utils"

// Import other utilities
import { cleanResponse } from "@/lib/utils"
import { getRandomSuggestions } from "@/lib/search-suggestions"

interface SearchContainerProps {
  initialQuery?: string | string[]
}

export default function SearchContainer({ initialQuery = "" }: SearchContainerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Load recent searches from localStorage on component mount and handle navigation changes
  useEffect(() => {
    // Load recent searches
    const savedSearches = loadRecentSearches();
    console.log('Loaded recent searches:', savedSearches);
    setRecentSearches(savedSearches);

    // Set random suggestions
    setSuggestions(getRandomSuggestions(3))

    // Reset state when on home page with no query
    if (pathname === '/' && !initialQuery) {
      setQuery('')
      setSearchResults([])
      setAiResponse('')
      setIsLoading(false)
      setIsAiLoading(false)
      return
    }

    // Set initial query if provided
    if (initialQuery) {
      const queryString = Array.isArray(initialQuery) ? initialQuery[0] : initialQuery
      setQuery(queryString)
      if (queryString) {
        handleSearch(queryString)
      }
    }
  }, [initialQuery, pathname])

  // Function to check if we have a cached result for this query
  const getCachedResult = useCallback((query: string) => {
    const normalizedQuery = query.trim().toLowerCase()
    const cachedData = localStorage.getItem(`search_${normalizedQuery}`)
    
    if (cachedData) {
      try {
        const { timestamp, results, aiResponse } = JSON.parse(cachedData)
        // Check if cache is less than 24 hours old
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          return { results, aiResponse }
        }
      } catch (error) {
        console.error("Failed to parse cached search results:", error)
      }
    }
    return null
  }, [])

  // Function to cache search results
  const cacheResults = useCallback((query: string, results: SearchResult[], aiResponse: string) => {
    const normalizedQuery = query.trim().toLowerCase()
    const cacheData = {
      timestamp: Date.now(),
      results,
      aiResponse
    }
    localStorage.setItem(`search_${normalizedQuery}`, JSON.stringify(cacheData))
  }, [])

  // Function to add a search to recent searches
  const handleAddToRecentSearches = useCallback((query: string) => {
    const normalizedQuery = query.trim()
    if (!normalizedQuery) return
    
    // Remove any existing instances of this query
    const filteredSearches = recentSearches.filter(
      (search) => search.query.toLowerCase() !== normalizedQuery.toLowerCase()
    )
    
    // Add the new search to the beginning
    const updatedSearches = [
      { query: normalizedQuery, timestamp: Date.now() },
      ...filteredSearches,
    ].slice(0, 10) // Keep only the 10 most recent
    
    // Save to localStorage
    try {
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
    } catch (error) {
      console.error("Error saving recent searches:", error)
    }
    
    setRecentSearches(updatedSearches)
  }, [recentSearches])
  
  // Function to remove a search from recent searches
  const handleRemoveRecentSearch = useCallback((index: number) => {
    const updatedSearches = [...recentSearches]
    updatedSearches.splice(index, 1)
    
    // Save to localStorage
    try {
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
    } catch (error) {
      console.error("Error saving recent searches:", error)
    }
    
    setRecentSearches(updatedSearches)
  }, [recentSearches])
  
  // Function to clear all recent searches
  const handleClearRecentSearches = useCallback(() => {
    localStorage.removeItem("recentSearches")
    setRecentSearches([])
  }, [])

  // Function to handle search submission
  const handleSubmit = () => {
    if (!query.trim()) return
    
    // Normalize query
    const normalizedQuery = query.trim()
    
    // Update URL with the search query
    const searchUrl = `/?q=${encodeURIComponent(normalizedQuery)}`
    console.log('Updating URL to:', searchUrl)
    
    // Perform search first to avoid any navigation issues
    handleSearch(normalizedQuery)
    
    // Then update the URL
    router.push(searchUrl, { scroll: false })
  }

  // Function to perform the search
  const handleSearch = async (searchQuery: string) => {
    console.log("[SearchContainer] handleSearch called with:", searchQuery); // DEBUG
    try {
      // Normalize the query
      const normalizedQuery = searchQuery.trim()
      if (!normalizedQuery) return

      // Update UI state
      setIsLoading(true)
      setIsAiLoading(true)
      setSearchResults([])
      setAiResponse("")

      // Check if we have a cached result for this query
      const cachedResult = getCachedResult(normalizedQuery)
      if (cachedResult) {
        console.log("Using cached search results")
        setSearchResults(cachedResult.results)
        setAiResponse(cachedResult.aiResponse)
        setIsLoading(false)
        setIsAiLoading(false)
        return
      }

      // Fetch search results
      const searchUrl = `/api/searxng?q=${encodeURIComponent(normalizedQuery)}`
      const response = await fetch(searchUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Search request failed with status: ${response.status}`)
      }

      const data = await response.json()
      
      // Extract the optimized query if available
      const optimizedQuery = data.optimizedQuery || normalizedQuery
      
      // Process search results and display them immediately
      if (data.results && Array.isArray(data.results)) {
        setSearchResults(data.results)
        // Mark the main loading as complete since we have web results
        setIsLoading(false)
      } else {
        setSearchResults([])
        setIsLoading(false)
      }
      
      // Now fetch the AI response in the background
      try {
        const aiUrl = `/api/ollama?q=${encodeURIComponent(optimizedQuery)}`
        const aiResponse = await fetch(aiUrl, {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        })
        
        if (aiResponse.ok) {
          const aiData = await aiResponse.json()
          if (aiData.response) {
            const cleanedResponse = cleanResponse(aiData.response)
            setAiResponse(cleanedResponse)
            
            // Cache the results only after AI response is ready
            cacheResults(normalizedQuery, data.results || [], cleanedResponse)
          }
        } else {
          console.error(`AI response request failed with status: ${aiResponse.status}`)
        }
      } catch (error) {
        console.error("Error fetching AI response:", error)
      }
      
      // Update AI loading state
      setIsAiLoading(false)
      
      // Add to recent searches
      const updatedSearches = addToRecentSearches(searchQuery, recentSearches)
      setRecentSearches(updatedSearches)
      
    } catch (error) {
      console.error("Search error:", error)
      setIsLoading(false)
      setIsAiLoading(false)
    }
  }

  // Function to handle clicking on a recent search
  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery)
    
    // Perform search first to avoid any navigation issues
    handleSearch(searchQuery)
    
    // Then update the URL
    const searchUrl = `/?q=${encodeURIComponent(searchQuery)}`
    console.log('Recent search clicked, updating URL to:', searchUrl)
    router.push(searchUrl, { scroll: false })
  }

  // Function to handle clicking on a suggestion
  const handleSuggestionClick = (suggestion: string) => {
    console.log('Suggestion click handler called with:', suggestion)
    setQuery(suggestion)
    
    // Perform search first to avoid any navigation issues
    handleSearch(suggestion)
    
    // Then update the URL
    const searchUrl = `/?q=${encodeURIComponent(suggestion)}`
    console.log('Suggestion clicked, updating URL to:', searchUrl)
    setTimeout(() => {
      router.push(searchUrl, { scroll: false })
    }, 100) // Small delay to ensure search starts first
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      {/* Search Form */}
      <SearchForm
        query={query}
        setQuery={setQuery}
        isLoading={isLoading}
        onSearch={handleSubmit}
        onSuggestionClick={handleSuggestionClick}
        suggestions={suggestions}
        searchResults={searchResults}
      />
      
      {/* Search Results */}
      {searchResults.length > 0 && (
        <SearchResultsContainer
          searchResults={searchResults}
          aiResponse={aiResponse}
          isAiLoading={isAiLoading}
        />
      )}
      
      {/* Recent Searches */}
      {!searchResults.length && !isLoading && recentSearches.length > 0 && (
        <div className="mt-12 mb-8">
          <RecentSearches
            searches={recentSearches}
            onSearchClick={handleRecentSearchClick}
            onRemoveSearch={handleRemoveRecentSearch}
            onClearSearches={handleClearRecentSearches}
          />
        </div>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <svg className="animate-spin text-primary mb-4 h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-muted-foreground">Searching the web...</p>
        </div>
      )}
    </div>
  )
}
