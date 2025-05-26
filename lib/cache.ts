import { SearchResult, CachedResult, RecentSearch } from './api/types'

// Cache management constants
const CACHE_EXPIRY = 1000 * 60 * 30 // 30 minutes
const MAX_RECENT_SEARCHES = 10

/**
 * Generate a cache key for a search query
 */
function getCacheKey(query: string): string {
  return `search_cache_${query.trim().toLowerCase()}`
}

/**
 * Get cached search result
 */
export function getCachedResult(query: string): CachedResult | null {
  if (typeof window === 'undefined') return null
  
  try {
    const cacheKey = getCacheKey(query)
    const cacheString = localStorage.getItem(cacheKey)
    if (!cacheString) return null
    
    const cache = JSON.parse(cacheString) as CachedResult
    
    // Check if cache is expired
    if (Date.now() - cache.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(cacheKey)
      return null
    }
    
    return cache
  } catch (error) {
    console.error('Error retrieving from cache:', error)
    return null
  }
}

/**
 * Cache search results
 */
export function cacheResults(query: string, results: SearchResult[], aiResponse: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const cacheKey = getCacheKey(query)
    const cacheData: CachedResult = {
      results,
      aiResponse,
      timestamp: Date.now()
    }
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheData))
  } catch (error) {
    console.error('Error caching results:', error)
  }
}

/**
 * Clear expired cache entries
 */
export function clearExpiredCache(): void {
  if (typeof window === 'undefined') return
  
  try {
    const keys = Object.keys(localStorage)
    const cacheKeys = keys.filter(key => key.startsWith('search_cache_'))
    
    cacheKeys.forEach(key => {
      try {
        const cacheString = localStorage.getItem(key)
        if (cacheString) {
          const cache = JSON.parse(cacheString) as CachedResult
          if (Date.now() - cache.timestamp > CACHE_EXPIRY) {
            localStorage.removeItem(key)
          }
        }
      } catch (error) {
        // Remove corrupted cache entries
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Error clearing expired cache:', error)
  }
}

/**
 * Load recent searches from localStorage
 */
export function loadRecentSearches(): RecentSearch[] {
  if (typeof window === 'undefined') return []
  
  try {
    const storedSearches = localStorage.getItem('recentSearches')
    if (storedSearches) {
      const searches = JSON.parse(storedSearches) as RecentSearch[]
      // Filter out old searches (older than 30 days)
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
      return searches.filter(search => search.timestamp > thirtyDaysAgo)
    }
  } catch (error) {
    console.error('Failed to parse recent searches:', error)
  }
  return []
}

/**
 * Save recent searches to localStorage
 */
export function saveRecentSearches(searches: RecentSearch[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('recentSearches', JSON.stringify(searches))
  } catch (error) {
    console.error('Failed to save recent searches:', error)
  }
}

/**
 * Add a search to recent searches
 */
export function addToRecentSearches(
  query: string, 
  currentSearches: RecentSearch[]
): RecentSearch[] {
  const normalizedQuery = query.trim()
  if (!normalizedQuery) return currentSearches
  
  // Remove any existing instances of this query
  const filteredSearches = currentSearches.filter(
    (search) => search.query.toLowerCase() !== normalizedQuery.toLowerCase()
  )
  
  // Add the new search to the beginning
  const updatedSearches = [
    { query: normalizedQuery, timestamp: Date.now() },
    ...filteredSearches,
  ].slice(0, MAX_RECENT_SEARCHES)
  
  // Save to localStorage
  saveRecentSearches(updatedSearches)
  
  return updatedSearches
}

/**
 * Remove a recent search by query string
 */
export function removeRecentSearch(
  queryToRemove: string, 
  currentSearches: RecentSearch[]
): RecentSearch[] {
  const normalizedQueryToRemove = queryToRemove.trim().toLowerCase();
  const updatedSearches = currentSearches.filter(
    (search) => search.query.trim().toLowerCase() !== normalizedQueryToRemove
  );

  // Only save if something actually changed
  if (updatedSearches.length !== currentSearches.length) {
    saveRecentSearches(updatedSearches);
    
    // Also remove the cached search result for this specific query
    if (typeof window !== 'undefined') {
      try {
        const cacheKey = getCacheKey(queryToRemove);
        localStorage.removeItem(cacheKey);
      } catch (error) {
        console.error(`Error removing cached result for query '${queryToRemove}':`, error);
      }
    }
  }
  
  return updatedSearches;
}

/**
 * Clear all recent searches and cached search results
 */
export function clearRecentSearches(): RecentSearch[] {
  if (typeof window !== 'undefined') {
    // Clear recent searches
    localStorage.removeItem('recentSearches')
    
    // Clear all cached search results
    const keys = Object.keys(localStorage)
    const cacheKeys = keys.filter(key => key.startsWith('search_cache_'))
    cacheKeys.forEach(key => localStorage.removeItem(key))
  }
  return []
}
