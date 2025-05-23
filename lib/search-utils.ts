// Types
export interface SearchResult {
  title: string
  url: string
  content: string
}

export interface RecentSearch {
  query: string
  timestamp: number
}

// Cache management
const CACHE_EXPIRY = 1000 * 60 * 30; // 30 minutes

interface CachedResult {
  results: SearchResult[]
  aiResponse: string
  timestamp: number
}

// Function to get cached search result
export function getCachedResult(query: string): CachedResult | null {
  try {
    const cacheString = localStorage.getItem(`search_cache_${query}`);
    if (!cacheString) return null;
    
    const cache = JSON.parse(cacheString) as CachedResult;
    
    // Check if cache is expired
    if (Date.now() - cache.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(`search_cache_${query}`);
      return null;
    }
    
    return cache;
  } catch (error) {
    console.error("Error retrieving from cache:", error);
    return null;
  }
}

// Function to cache search results
export function cacheResults(query: string, results: SearchResult[], aiResponse: string): void {
  try {
    const cacheData: CachedResult = {
      results,
      aiResponse,
      timestamp: Date.now()
    };
    
    localStorage.setItem(`search_cache_${query}`, JSON.stringify(cacheData));
  } catch (error) {
    console.error("Error caching results:", error);
  }
}

// Recent searches management
export function loadRecentSearches(): RecentSearch[] {
  try {
    const storedSearches = localStorage.getItem("recentSearches");
    if (storedSearches) {
      return JSON.parse(storedSearches);
    }
  } catch (error) {
    console.error("Failed to parse recent searches:", error);
  }
  return [];
}

export function saveRecentSearches(searches: RecentSearch[]): void {
  try {
    localStorage.setItem("recentSearches", JSON.stringify(searches));
  } catch (error) {
    console.error("Failed to save recent searches:", error);
  }
}

export function addToRecentSearches(
  query: string, 
  currentSearches: RecentSearch[]
): RecentSearch[] {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return currentSearches;
  
  // Remove any existing instances of this query
  const filteredSearches = currentSearches.filter(
    (search) => search.query.toLowerCase() !== normalizedQuery.toLowerCase()
  );
  
  // Add the new search to the beginning
  const updatedSearches = [
    { query: normalizedQuery, timestamp: Date.now() },
    ...filteredSearches,
  ].slice(0, 10); // Keep only the 10 most recent
  
  // Save to localStorage
  saveRecentSearches(updatedSearches);
  
  return updatedSearches;
}

export function removeRecentSearch(
  index: number, 
  currentSearches: RecentSearch[]
): RecentSearch[] {
  const updatedSearches = [...currentSearches];
  updatedSearches.splice(index, 1);
  
  // Save to localStorage
  saveRecentSearches(updatedSearches);
  
  return updatedSearches;
}

export function clearRecentSearches(): RecentSearch[] {
  localStorage.removeItem("recentSearches");
  return [];
}
