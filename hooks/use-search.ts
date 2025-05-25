import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { SearchResult, RecentSearch } from '@/lib/api/types'
import { 
  getCachedResult, 
  cacheResults, 
  loadRecentSearches, 
  addToRecentSearches,
  removeRecentSearch,
  clearRecentSearches,
  clearExpiredCache
} from '@/lib/cache'
import { cleanResponse } from '@/lib/utils'
import { deduplicateRequest } from '@/lib/utils/request-deduplicator'

interface UseSearchOptions {
  initialQuery?: string | string[]
}

interface UseSearchReturn {
  // State
  query: string
  isLoading: boolean
  isOptimizing: boolean
  isTransitioning: boolean
  isAiLoading: boolean
  aiResponse: string
  searchResults: SearchResult[]
  recentSearches: RecentSearch[]
  isInitialized: boolean
  hasSearched: boolean
  
  // Actions
  setQuery: (query: string) => void
  handleSearch: (searchQuery: string, isInitialLoad?: boolean) => Promise<void>
  handleRecentSearchClick: (searchQuery: string) => void
  handleRemoveRecentSearch: (index: number) => void
  handleClearRecentSearches: () => void
}

export function useSearch({ initialQuery = '' }: UseSearchOptions = {}): UseSearchReturn {
  const router = useRouter()
  const pathname = usePathname()
  
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const searchAbortController = useRef<AbortController | null>(null)
  const aiAbortController = useRef<AbortController | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  // Handle initial query when hook is initialized
  useEffect(() => {
    if (initialQuery && typeof initialQuery === 'string' && !hasSearched) {
      setQuery(initialQuery)
      setHasSearched(true)
      handleSearch(initialQuery, true)
    } else if (!initialQuery && hasSearched) {
      // Reset search state when navigating to home page without query
      setQuery('')
      setSearchResults([])
      setAiResponse('')
      setHasSearched(false)
    }
  }, [initialQuery]) // Only depend on initialQuery

  const handleSearch = useCallback(async (searchQuery: string, isInitialLoad = false) => {
    const normalizedQuery = searchQuery.trim()
    if (!normalizedQuery) return

    // Only update hasSearched if this is not an initial load
    if (!isInitialLoad) {
      setHasSearched(true)
    }

    // Cancel any ongoing requests
    searchAbortController.current?.abort()
    aiAbortController.current?.abort()
    
    // Create new abort controllers for this request
    const searchController = new AbortController()
    const aiController = new AbortController()
    searchAbortController.current = searchController
    aiAbortController.current = aiController

    // Set loading states
    setIsLoading(true)
    setIsOptimizing(true)
    setIsTransitioning(true)
    setIsAiLoading(true)
    
    try {
      // Check cache first
      const cachedResult = getCachedResult(normalizedQuery)
      if (cachedResult) {
        // Skip if we've been aborted
        if (searchController.signal.aborted) return
        
        setSearchResults(cachedResult.results)
        setAiResponse(cachedResult.aiResponse)
        setIsLoading(false)
        setIsAiLoading(false)
        
        // Start the fade-out transition for cached results too
        setIsTransitioning(false)
        
        // Add delay for smooth transition even with cached results
        setTimeout(() => {
          if (!searchController.signal.aborted) {
            setIsOptimizing(false)
          }
        }, 500)
        
        // Add to recent searches
        const updatedSearches = addToRecentSearches(searchQuery, recentSearches)
        setRecentSearches(updatedSearches)
        return
      }

      // Use deduplication for concurrent requests
      // First, get the AI-optimized query
      const aiOptimizationData = await deduplicateRequest(
        `optimize-${normalizedQuery}`,
        async () => {
          try {
            const response = await fetch('/api/ollama', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({ prompt: `Optimize this search query for better web search results: "${normalizedQuery}". Return only the optimized query, nothing else.` }),
              cache: 'no-store',
              signal: searchController.signal
            })
            
            if (response.ok) {
              const data = await response.json()
              return { optimizedQuery: data.response || normalizedQuery }
            } else {
              return { optimizedQuery: normalizedQuery } // Fallback to original query
            }
          } catch (error) {
            console.error('Error optimizing query:', error)
            return { optimizedQuery: normalizedQuery } // Fallback to original query
          }
        }
      )

      // Skip updates if request was aborted
      if (searchController.signal.aborted) return

      const optimizedQuery = aiOptimizationData.optimizedQuery || normalizedQuery

      // Now perform the search with the optimized query
      const searchData = await deduplicateRequest(
        `search-${optimizedQuery}`,
        async () => {
          const response = await fetch(`/api/searxng?q=${encodeURIComponent(optimizedQuery)}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            cache: 'no-store',
            signal: searchController.signal
          })
          
          if (!response.ok) {
            throw new Error(`Search request failed with status: ${response.status}`)
          }
          
          const data = await response.json()
          if (data.error) {
            throw new Error(data.error)
          }
          
          return data
        }
      )

      // Skip updates if request was aborted
      if (searchController.signal.aborted) return
      
      // Update search results immediately when available and transition from optimization
      setSearchResults(searchData.results || [])
      setIsLoading(false)
      setIsOptimizing(false)
      setIsTransitioning(false)

      // Now start the AI response generation in parallel (don't wait for it)
      deduplicateRequest(
        `ai-${normalizedQuery}`,
        async () => {
          try {
            const response = await fetch('/api/ollama', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({ prompt: normalizedQuery }),
              cache: 'no-store',
              signal: aiController.signal
            })
            
            if (response.ok) {
              const data = await response.json()
              if (data.response && !aiController.signal.aborted) {
                const cleanedResponse = cleanResponse(data.response)
                setAiResponse(cleanedResponse)
                cacheResults(normalizedQuery, searchData.results || [], cleanedResponse)
              }
            } else if (response.status === 503) {
              if (!aiController.signal.aborted) {
                setAiResponse("AI assistant is currently unavailable. Please check that your Ollama server is running and accessible.")
              }
            } else {
              throw new Error(`AI request failed with status: ${response.status}`)
            }
          } catch (error) {
            console.error('Error in AI request:', error)
            if (!aiController.signal.aborted) {
              setAiResponse("AI assistant is currently unavailable. This might be due to network issues or server timeout.")
            }
          } finally {
            if (!aiController.signal.aborted) {
              setIsAiLoading(false)
            }
          }
        }
      )
      
      // Add to recent searches
      const updatedSearches = addToRecentSearches(searchQuery, recentSearches)
      setRecentSearches(updatedSearches)
      
    } catch (error) {
      console.error('Search error:', error)
      setIsLoading(false)
      setIsAiLoading(false)
      setIsOptimizing(false)
      setIsTransitioning(false)
    }
  }, [recentSearches]) // Only depend on recentSearches

  // Initialize state and handle navigation changes
  useEffect(() => {
    // Clear expired cache on mount
    clearExpiredCache()
    
    // Load recent searches
    const savedSearches = loadRecentSearches()
    setRecentSearches(savedSearches)
    
    setIsInitialized(true)
  }, []) // Remove handleSearch dependency
  
  // Handle URL changes for back/forward navigation
  useEffect(() => {
    const handleRouteChange = () => {
      const searchParams = new URLSearchParams(window.location.search)
      const searchQuery = searchParams.get('q')
      
      if (searchQuery && searchQuery !== query) {
        setQuery(searchQuery)
        handleSearch(searchQuery)
      } else if (!searchQuery) {
        // Reset search state when navigating away from search
        setQuery('')
        setSearchResults([])
        setAiResponse('')
        setHasSearched(false)
      }
    }
    
    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [query]) // Remove handleSearch dependency
  
  const handleRecentSearchClick = useCallback((searchQuery: string) => {
    // Just navigate to the search URL - the search will be triggered by the URL change
    const searchUrl = `/?q=${encodeURIComponent(searchQuery)}`
    router.push(searchUrl, { scroll: false })
  }, [router]) // Only depend on router
  
  const handleRemoveRecentSearch = useCallback((index: number) => {
    const updatedSearches = removeRecentSearch(index, recentSearches)
    setRecentSearches(updatedSearches)
  }, [recentSearches]) // Only depend on recentSearches
  
  const handleClearRecentSearches = useCallback(() => {
    setRecentSearches([])
    clearRecentSearches()
    
    // Also clear any current search results and AI response
    setSearchResults([])
    setAiResponse('')
    setQuery('')
    setHasSearched(false)
    
    // Clear the URL search params
    window.history.pushState({}, '', '/')
  }, [])

  return {
    // State
    query,
    isLoading,
    isOptimizing,
    isTransitioning,
    isAiLoading,
    aiResponse,
    searchResults,
    recentSearches,
    isInitialized,
    hasSearched,
    
    // Actions
    setQuery,
    handleSearch,
    handleRecentSearchClick,
    handleRemoveRecentSearch,
    handleClearRecentSearches,
  }
}
