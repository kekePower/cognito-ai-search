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
  
  // Actions
  setQuery: (query: string) => void
  handleSearch: (searchQuery: string) => Promise<void>
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

  const handleSearch = useCallback(async (searchQuery: string) => {
    const normalizedQuery = searchQuery.trim()
    if (!normalizedQuery) return

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
      const [searchData, aiData] = await Promise.all([
        // Search request
        deduplicateRequest(
          `search-${normalizedQuery}`,
          async () => {
            const response = await fetch(`/api/searxng?q=${encodeURIComponent(normalizedQuery)}`, {
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
        ),
        
        // AI request
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
                return await response.json()
              } else if (response.status === 503) {
                return { error: "AI assistant is currently unavailable. Please check that your Ollama server is running and accessible." }
              } else {
                throw new Error(`AI request failed with status: ${response.status}`)
              }
            } catch (error) {
              console.error('Error in AI request:', error)
              return { error: "AI assistant is currently unavailable. This might be due to network issues or server timeout." }
            }
          }
        )
      ])
      
      // Skip updates if request was aborted
      if (searchController.signal.aborted) return
      
      // Update search results
      setSearchResults(searchData.results || [])
      setIsLoading(false)
      
      // Start the fade-out transition for optimization
      setIsTransitioning(false)
      
      // Add a longer delay to ensure smooth transition before showing results
      setTimeout(() => {
        if (!searchController.signal.aborted) {
          setIsOptimizing(false)
        }
      }, 500)
      
      // Handle AI response
      if (aiData.response) {
        const cleanedResponse = cleanResponse(aiData.response)
        setAiResponse(cleanedResponse)
        cacheResults(normalizedQuery, searchData.results || [], cleanedResponse)
      } else if (aiData.error) {
        setAiResponse(aiData.error)
      }
      
      setIsAiLoading(false)
      
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
  }, [recentSearches])

  // Initialize state and handle navigation changes
  useEffect(() => {
    // Clear expired cache on mount
    clearExpiredCache()
    
    // Load recent searches
    const savedSearches = loadRecentSearches()
    setRecentSearches(savedSearches)

    // Reset state when on home page with no query
    if (pathname === '/' && !initialQuery) {
      setQuery('')
      setSearchResults([])
      setAiResponse('')
      setIsLoading(false)
      setIsAiLoading(false)
      setIsOptimizing(false)
      setIsTransitioning(false)
      setIsInitialized(true)
      return
    }

    // Set initial query if provided
    if (initialQuery) {
      const queryString = Array.isArray(initialQuery) ? initialQuery[0] : initialQuery
      setQuery(queryString)
      setIsInitialized(true)
      
      // Trigger search after component has fully rendered to ensure
      // optimization animation appears in the correct context
      if (queryString) {
        // Use requestAnimationFrame to ensure DOM is ready
        const frameId = requestAnimationFrame(() => {
          handleSearch(queryString)
        })
        
        return () => cancelAnimationFrame(frameId)
      }
      return
    }
    
    setIsInitialized(true)
  }, [initialQuery, pathname])

  const handleRecentSearchClick = useCallback((searchQuery: string) => {
    // Just navigate to the search URL - the search will be triggered by the URL change
    const searchUrl = `/?q=${encodeURIComponent(searchQuery)}`
    router.push(searchUrl, { scroll: false })
  }, [router])

  const handleRemoveRecentSearch = useCallback((index: number) => {
    const updatedSearches = removeRecentSearch(index, recentSearches)
    setRecentSearches(updatedSearches)
  }, [recentSearches])

  const handleClearRecentSearches = useCallback(() => {
    const updatedSearches = clearRecentSearches()
    setRecentSearches(updatedSearches)
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
    
    // Actions
    setQuery,
    handleSearch,
    handleRecentSearchClick,
    handleRemoveRecentSearch,
    handleClearRecentSearches,
  }
}
