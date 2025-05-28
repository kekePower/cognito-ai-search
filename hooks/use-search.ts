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
  optimizedQuery: string;
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
  handleRemoveRecentSearch: (query: string) => void
  handleClearRecentSearches: () => void
  retryAi: () => void
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
  const [optimizedQuery, setOptimizedQuery] = useState('')

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
    setOptimizedQuery(''); // Reset optimized query for new search
    setIsOptimizing(true); // Start optimizing phase
    const normalizedQuery = searchQuery.trim();
    if (!normalizedQuery) return;

    if (!isInitialLoad) {
      setHasSearched(true);
    }

    searchAbortController.current?.abort();
    aiAbortController.current?.abort();
    
    const searchController = new AbortController();
    const aiController = new AbortController();
    searchAbortController.current = searchController;
    aiAbortController.current = aiController;

    setIsLoading(true);
    setIsOptimizing(true);
    setIsTransitioning(true);
    setIsAiLoading(true);
    
    try {
      const cachedResult = getCachedResult(normalizedQuery);
      if (cachedResult) {
        if (searchController.signal.aborted) return;
        
        setSearchResults(cachedResult.results);
        setAiResponse(cachedResult.aiResponse);
        if (cachedResult.optimizedQuery) {
          setOptimizedQuery(cachedResult.optimizedQuery);
        }
        setIsLoading(false);
        setIsAiLoading(false);
        setIsTransitioning(false);
        
        setTimeout(() => {
          if (!searchController.signal.aborted) {
            setIsOptimizing(false); // Optimizing ends after cache load and delay
          }
        }, 500);
        
        const updatedSearches = addToRecentSearches(searchQuery, recentSearches);
        setRecentSearches(updatedSearches);
        return;
      }

      // Live search
      const response = await fetch(`/api/searxng`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: normalizedQuery }),
        signal: searchController.signal,
      });

      if (!response.ok) {
        throw new Error(`Search API request failed with status: ${response.status}`);
      }

      if (searchController.signal.aborted) return;

      const data = await response.json();
      setSearchResults(data.results || []);
      if (data.optimizedQuery) {
        setOptimizedQuery(data.optimizedQuery);
      }
      
      const updatedSearches = addToRecentSearches(searchQuery, recentSearches);
      setRecentSearches(updatedSearches);

      setIsLoading(false); // Search part is done loading
      // setIsOptimizing(false) will be set before the AI summarization call
      setIsTransitioning(false); // Allow UI to transition/show search results

      // AI call (summarization) starts after a short delay
      setTimeout(async () => {
        const constructedAiPrompt = `Based on the query "${data.optimizedQuery || normalizedQuery}" and the following search results, please provide a concise summary or insights:\n\n${(data.results || []).map((r: SearchResult) => `- ${r.title}: ${r.content?.substring(0, 150)}...`).join('\n')}`;

        if (aiController.signal.aborted) return;
        setIsOptimizing(false); // Transition from query optimization to AI summarization message
        try {
          const aiApiResponse = await fetch('/api/ollama', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: constructedAiPrompt }),
            signal: aiController.signal,
          });

          if (aiApiResponse.ok) {
            const aiData = await aiApiResponse.json();
            if (aiData.response && !aiController.signal.aborted) {
              const cleanedResponse = cleanResponse(aiData.response);
              setAiResponse(cleanedResponse);
              cacheResults(
                normalizedQuery, 
                data.results || [], 
                cleanedResponse, 
                data.optimizedQuery || '' // Cache optimized query
              );
            } else if (aiData.error && !aiController.signal.aborted) {
              setAiResponse(aiData.error);
            }
          } else if (aiApiResponse.status === 503) {
            try {
              const errorData = await aiApiResponse.json();
              if (errorData.error && !aiController.signal.aborted) {
                setAiResponse(errorData.error);
              } else if (!aiController.signal.aborted) {
                setAiResponse("AI assistant is currently unavailable. Please check that your Ollama server is running and accessible.");
              }
            } catch {
              if (!aiController.signal.aborted) {
                setAiResponse("AI assistant is currently unavailable. Please check that your Ollama server is running and accessible.");
              }
            }
          } else {
            throw new Error(`AI request failed with status: ${aiApiResponse.status}`);
          }
        } catch (error) {
          console.error('Error in AI request:', error);
          if (!aiController.signal.aborted) {
            setAiResponse("AI assistant is currently unavailable. This might be due to network issues or server timeout.");
          }
        } finally {
          if (!aiController.signal.aborted) {
            setIsAiLoading(false); // AI summarization is complete
            // setIsOptimizing(false) was moved earlier
          }
        }
      }, 100);

    } catch (error) {
      console.error('Search error:', error);
      setIsLoading(false);
      setIsAiLoading(false);
      setIsOptimizing(false); // Ensure optimizing stops on search error
      setIsTransitioning(false);
      // Optionally set error messages for UI
      // setAiResponse('Failed to fetch search results or AI summary.');
    } finally {
      // Main finally for the search try/catch.
      // Most loading states are handled within the try or catch blocks, 
      // or within the AI call's finally block.
      // If searchController was aborted and not caught by earlier checks, 
      // ensure loading states are reset.
      if (searchController.signal.aborted && (isLoading || isOptimizing || isAiLoading)) {
        setIsLoading(false);
        setIsAiLoading(false);
        setIsOptimizing(false);
        setIsTransitioning(false);
      }
    }

  }, [recentSearches]) // Dependencies: query, searchResults, recentSearches

  const retryAi = useCallback(async () => {
    if (query) {
      setAiResponse('') // Clear the AI response first to show the container loading state
      setIsAiLoading(true)
      deduplicateRequest(
        `ai-${query}`,
        async () => {
          try {
            const response = await fetch('/api/ai', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query: query, searchResults: searchResults }),
              signal: aiAbortController.current?.signal
            })
            
            if (response.ok) {
              const data = await response.json()
              if (data.response && !aiAbortController.current?.signal.aborted) {
                const cleanedResponse = cleanResponse(data.response)
                setAiResponse(cleanedResponse)
                cacheResults(query, searchResults, cleanedResponse)
              } else if (data.error && !aiAbortController.current?.signal.aborted) {
                // Handle graceful API error responses
                setAiResponse(data.error)
              }
            } else if (response.status === 503) {
              // Handle 503 responses which may contain graceful error messages
              try {
                const data = await response.json()
                if (data.error && !aiAbortController.current?.signal.aborted) {
                  setAiResponse(data.error)
                } else if (!aiAbortController.current?.signal.aborted) {
                  setAiResponse("AI assistant is currently unavailable. Please check that your Ollama server is running and accessible.")
                }
              } catch {
                if (!aiAbortController.current?.signal.aborted) {
                  setAiResponse("AI assistant is currently unavailable. Please check that your Ollama server is running and accessible.")
                }
              }
            } else {
              throw new Error(`AI request failed with status: ${response.status}`)
            }
          } catch (error) {
            console.error('Error in AI request:', error)
            if (!aiAbortController.current?.signal.aborted) {
              setAiResponse("AI assistant is currently unavailable. This might be due to network issues or server timeout.")
            }
          } finally {
            if (!aiAbortController.current?.signal.aborted) {
              setIsAiLoading(false)
            }
          }
        }
      )
    }
  }, [query, searchResults])

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
        setOptimizedQuery('')
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
  
  const handleRemoveRecentSearch = useCallback((query: string) => {
    const updatedSearches = removeRecentSearch(query, recentSearches)
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
    setOptimizedQuery('');
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
    optimizedQuery,
    
    // Actions
    setQuery,
    handleSearch,
    handleRecentSearchClick,
    handleRemoveRecentSearch,
    handleClearRecentSearches,
    retryAi,
  }
}
