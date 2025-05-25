'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Sparkles, Clock, X, RotateCcw, Globe, Bot, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchResultsContainer } from '@/components/search/search-results-container'
import { SearchSuggestions } from '@/components/search/search-suggestions'
import { useSearch } from '@/hooks/use-search'

export default function SearchContainer() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || undefined
  
  const {
    query,
    isLoading,
    isOptimizing,
    isTransitioning,
    isAiLoading,
    aiResponse,
    searchResults,
    recentSearches,
    hasSearched,
    setQuery,
    handleSearch,
    handleRecentSearchClick,
    handleRemoveRecentSearch,
    handleClearRecentSearches,
    retryAi,
  } = useSearch({ initialQuery })

  const [isFocused, setIsFocused] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query?.trim()) return

    // Just navigate to the search URL - the search will be triggered by the URL change
    const searchUrl = `/?q=${encodeURIComponent(query)}`
    router.push(searchUrl, { scroll: false })
  }

  const handleSuggestionClick = (suggestion: string) => {
    // Just navigate to the search URL - the search will be triggered by the URL change
    const searchUrl = `/?q=${encodeURIComponent(suggestion)}`
    router.push(searchUrl, { scroll: false })
  }

  const handleFocus = () => {
    setIsAnimatingOut(false)
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setIsAnimatingOut(true)
    // Reset animating out state after animation completes
    setTimeout(() => setIsAnimatingOut(false), 3000)
  }

  // Show loading state when we're actively searching
  const showLoading = isLoading && searchResults.length === 0;
  
  // Detect configuration errors from AI response
  const isConfigError = Boolean(aiResponse && (
    aiResponse.includes("configuration is incomplete") ||
    aiResponse.includes("environment setup")
  ))

  // Show no results message when search is complete, no results were found, and a search has been performed (excluding config errors)
  const showNoResults = hasSearched && !isLoading && !isOptimizing && searchResults.length === 0 && query && !isConfigError;

  // Show results when optimization is complete and we have search results OR an AI response (excluding config errors)
  const showResults = hasSearched && !isOptimizing && (searchResults.length > 0 || (aiResponse && !isConfigError));
  
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-6 pb-12">
        <div className="w-full max-w-6xl mx-auto bg-card rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 transition-all duration-300">
          {/* Header with logo */}
          <div className="text-center mb-6">
            <button 
              onClick={() => router.push('/', { scroll: false })}
              className="flex items-center justify-center gap-3 mb-4 mx-auto hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Sparkles className="text-blue-600 dark:text-blue-400 h-8 w-8" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cognito AI Search</h1>
            </button>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              AI-optimized search queries with comprehensive web results. Ollama enhances your searches and provides detailed answers.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-6xl mx-auto mb-8">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
                  <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                
                <div>
                  <div className="relative">
                    {/* Gradient border container */}
                    <div 
                      className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                        isFocused || isAnimatingOut ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981)',
                        backgroundSize: '300% 100%',
                        animation: isFocused 
                          ? 'gradient-shift 3s ease' 
                          : isAnimatingOut 
                            ? 'gradient-shift-reverse 3s ease' 
                            : 'none',
                      }}
                    />
                    
                    <input
                      type="text"
                      placeholder="Ask anything... (e.g., 'How does machine learning work?')"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      className={`relative w-full pl-12 pr-24 py-6 text-lg bg-white dark:bg-gray-800 rounded-2xl focus:ring-0 focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-300 z-10 ${
                        isFocused 
                          ? 'border-2 border-transparent' 
                          : 'border-2 border-gray-200 dark:border-gray-700'
                      }`}
                      style={isFocused ? {
                        margin: '2px',
                        width: 'calc(100% - 4px)',
                        height: 'calc(100% - 4px)'
                      } : {}}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading || !query?.trim()}
                  className="absolute right-0.5 top-0.5 w-16 rounded-l-none rounded-r-xl bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 dark:from-gray-600 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-800 border-0 shadow-md hover:shadow-lg transition-all duration-300 z-20 flex items-center justify-center"
                  style={{ height: 'calc(100% - 4px)' }}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-600 dark:text-white" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  )}
                </Button>
              </div>
              {isConfigError && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium">Configuration Issue</div>
                      <div className="text-red-600 dark:text-red-400 mt-1">
                        Missing API endpoints. Please check your environment setup.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Query Optimization Animation */}
          {isOptimizing && (
            <div className={`max-w-6xl mx-auto mb-8 transition-all duration-700 ease-in-out ${
              isOptimizing 
                ? 'animate-in fade-in slide-in-from-top-2 duration-300' 
                : 'animate-out fade-out slide-out-to-top-2 duration-500'
            }`}>
              <div className="relative flex items-center justify-center p-6 bg-card border border-gray-200 dark:border-gray-700 rounded-2xl">
                <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/50 dark:border-blue-500/50 animate-pulse"></div>
                <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300 relative z-10">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 dark:border-blue-400" />
                  <span className="text-sm font-medium">Optimizing your search query with AI...</span>
                </div>
              </div>
            </div>
          )}

          {/* Search Suggestions */}
          {!searchResults?.length && (
            <SearchSuggestions onSuggestionClick={handleSuggestionClick} />
          )}

          {/* Recent Searches */}
          {!searchResults?.length && recentSearches.length > 0 && (
            <div className="max-w-6xl mx-auto mb-6">
              <Card className="shadow-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-gray-200/50 dark:shadow-gray-900/50">
                <CardContent className="p-4">
                  <div className="flex items-baseline justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 relative top-[0.125rem]" />
                      <h3 className="text-lg font-semibold">Recent Searches</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearRecentSearches}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group"
                      >
                        <button
                          onClick={() => handleRecentSearchClick(search.query)}
                          className="text-sm text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {search.query}
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveRecentSearch(index)}
                          className="h-4 w-4 p-0 opacity-60 hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* How It Works - Feature Information */}
          {!searchResults?.length && (
            <div className="max-w-6xl mx-auto mb-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Privacy-First Search with AI Enhancement
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
                  Experience the perfect blend of comprehensive web search and intelligent AI assistance, 
                  all while keeping your data completely private and secure on your own infrastructure.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start p-4 rounded-xl bg-card border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="mr-4 mt-1 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                    <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Private Web Search</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      Powered by SearXNG, your searches remain completely anonymous. No tracking, no data collection, 
                      no advertising profiles. Get comprehensive results from multiple search engines while maintaining your privacy.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start p-4 rounded-xl bg-card border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="mr-4 mt-1 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                    <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Local AI Intelligence</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      Using Ollama running on your own hardware, get intelligent query optimization and detailed answers 
                      without sending any data to third parties. Your conversations stay completely local and private.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {showResults && (
            <div className="animate-in fade-in duration-300">
              <SearchResultsContainer
                searchResults={searchResults}
                aiResponse={aiResponse}
                isAiLoading={isAiLoading}
                onRetryAi={retryAi}
              />
            </div>
          )}

          {/* No Results State */}
          {showNoResults && (
            <div className="text-center py-16 animate-in fade-in">
              <p className="text-gray-600 dark:text-gray-300">No results found for "{query}"</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Try different keywords or check your search query
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
