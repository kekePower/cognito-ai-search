'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Form from 'next/form'
import Link from 'next/link'
import { Search, Diamond, AlertTriangle, Loader2, Clock, X, Globe, Bot } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchButton } from '@/components/search-button'
import { SearchResultsContainer } from '@/components/search/search-results-container'
import { SearchSuggestions } from '@/modules/suggestions'
import { useSearch } from '@/hooks/use-search'
import { EmptyState } from './ui/empty-state'

export default function SearchContainer() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(initialQuery); // State for controlled input

  const {
    query, // Destructure query from useSearch - this is the query being processed
    isLoading,
    isOptimizing,
    isTransitioning,
    isAiLoading,
    aiResponse,
    searchResults,
    optimizedQuery, // Added optimizedQuery from useSearch
    recentSearches,
    hasSearched,
    setQuery,
    handleSearch,
    handleRecentSearchClick,
    handleRemoveRecentSearch,
    handleClearRecentSearches,
    retryAi,
  } = useSearch({ initialQuery }) // useSearch is driven by initialQuery from URL

  useEffect(() => {
    setInputValue(initialQuery); // Sync input field if URL query changes
  }, [initialQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const [isFocused, setIsFocused] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  
  const handleSuggestionClick = (suggestion: string) => {
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
    <div className="relative duration-500">
      <div className="container mx-auto px-4 pt-8 pb-12 text-foreground duration-500">
        <div className="w-full max-w-6xl mx-auto">
          {/* Main Search Panel */}
          <div className={`bg-[hsl(var(--card))] dark:bg-[hsl(var(--glass-bg))]/[0.7] rounded-xl shadow-sm border border-border/60 dark:border-white/10 relative overflow-hidden duration-500 ${
            showResults ? 'p-4 mb-6' : 'p-8 mb-8'
          }`}>
            {/* Header with cognito logo */}
            <div className={`text-center duration-500 ${
              showResults ? 'mb-4' : 'mb-8'
            }`}>
              <Button 
                onClick={() => router.push('/', { scroll: false })}
                className={`flex items-center justify-center gap-4 mx-auto hover:scale-105 transition-all duration-300 cursor-pointer group ${
                  showResults ? 'mb-3' : 'mb-6'
                }`}
              >
                <div className="relative inline-flex items-center gap-3 group">
                  <Diamond className={`text-primary group-hover:text-primary/90 transition-colors duration-300 ${
                    showResults ? 'h-8 w-8' : 'h-10 w-10'
                  }`} />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:bg-primary/30 transition-all duration-300"></div>
                </div>
                <h1 className={`font-bold bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--neon-magenta))] to-[hsl(var(--neon-blue))] bg-clip-text text-transparent transition-all duration-500 leading-normal pb-1 ${
                  showResults ? 'text-3xl' : 'text-5xl'
                }`}>
                  Cognito AI Search
                </h1>
              </Button>
              {!showResults && (
                <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed transition-opacity duration-500 whitespace-nowrap">
                  AI-optimized search with cognito precision. Experience the future of information discovery.
                </p>
              )}
            </div>

            {/* Search Form with Sharp Cognito Border */}
            <div className={`mx-auto duration-500 ${
              showResults ? 'max-w-2xl mb-4' : 'max-w-4xl mb-8'
            }`}>
              <Form action="/" className="relative group">
                <div className="relative">
                  {/* Sharp cognito outer glow - TEMPORARILY REMOVED */}
                  {/* <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 blur-sm opacity-50 group-focus-within:opacity-100 transition-opacity duration-300 rounded-lg"></div> */}
                  
                  {/* Angular cognito border - TEMPORARILY REMOVED */}
                  {/* <div className="absolute inset-0 border-2 border-primary/40 group-focus-within:border-primary/80 transition-all duration-300 rounded-lg"></div> */}
                  
                  {/* Cognito edge highlight - TEMPORARILY REMOVED */}
                  {/* <div className="absolute inset-0 border border-primary/40 opacity-0 group-focus-within:opacity-100 transition-all duration-300 rounded-lg"></div> */}
                  
                  {/* Main search container with cognito shape */}
                  <div className="relative glass-panel p-4 flex items-center justify-between gap-3 rounded-lg">
                    {/* Search Icon Wrapper: Spans the pl-14 area and centers the icon within it */}
                    <div className="absolute left-0 top-0 bottom-0 w-14 flex items-center justify-center pointer-events-none z-10">
                      <Search className="h-6 w-6 text-muted-foreground" />
                      {/* Temporarily removed: <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm animate-pulse"></div> */}
                    </div>
                    
                    <Input
                      ref={inputRef} 
                      name="q" // Important for next/form submission
                      type="search"
                      value={inputValue} // Controlled component
                      onChange={handleInputChange} // Update state on change
                      placeholder="Search with Cognito AI..."
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      className="flex-1 pl-14 pr-4 py-3 bg-transparent border-none focus:ring-0 focus:outline-none placeholder-muted-foreground/70 text-lg"
                      aria-label="Search query"
                    />

                    {/* Main Search Button */}
                    <SearchButton
                      type="submit"
                      isLoading={isLoading || isTransitioning}
                      query={inputValue} // Button state based on live input
                    />
                  </div>
                  
                  {/* Sharp corner accents */}
                  <div className="absolute top-0 left-2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-primary/60 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 right-2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-primary/60 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Form>

              {/* Configuration Error */}
              {isConfigError && (
                <div className="mt-4 glass-panel shard p-4 border border-red-400/50">
                  <div className="flex items-center gap-3 text-red-300">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium">Configuration Issue</div>
                      <div className="text-red-400 mt-1">
                        Missing API endpoints. Please check your environment setup.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div> {/* This div closes the wrapper for form and config error */}

            {/* Search Suggestions as Cognito Shards */}
            {!showResults && !isOptimizing && (
              <div className={`max-w-6xl mx-auto mt-12 mb-4 transition-all duration-700 ${
                isLoading ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
              }`}>
                <SearchSuggestions onSuggestionClick={handleSuggestionClick} />
              </div>
            )}

            {/* Optimization Animation */}
            {isLoading && (
              <div className={`glass-panel rounded-lg p-8 text-center transition-all duration-700 border border-primary/30 bg-primary/5 dark:bg-primary/10 shadow-lg shadow-primary/20 ${
                isLoading ? 'opacity-100 transform translate-y-0 animate-in fade-in slide-in-from-bottom-4 duration-500' : 'opacity-0 transform translate-y-4'
              }`}>
                <div className="flex items-center justify-center gap-3 text-primary">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-lg font-medium">AI is generating an optimized search query</span>
                </div>
              </div>
            )}
          </div> {/* This div closes the Main Search Panel that starts around line 85 */}
          


            {/* Recent Searches and Search Results */}
            <div className="mt-8 w-full">
            {/* Recent Searches Panel */}
            {recentSearches.length > 0 && !hasSearched && !showResults && (
              <div className={`glass-panel rounded-lg p-6 mb-8 transition-all duration-700 ${
                isLoading ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0 animate-in fade-in slide-in-from-bottom-4 duration-500'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Searches
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearRecentSearches}
                    className="text-muted hover:text-primary transition-colors duration-200"
                  >
                    Clear all
                  </Button>
                </div>
                <div className="space-y-2">
                  {recentSearches.slice(0, 5).map((search) => (
                    <div key={search.query} className="relative group"> 
                      <Button
                        onClick={() => handleRecentSearchClick(search.query)}
                        variant="ghost"
                        className="relative w-full justify-start text-left p-3 rounded-lg text-foreground hover:text-primary transition-all ease-in-out duration-300 overflow-hidden bg-transparent hover:scale-[1.01] hover:shadow-sm hover:shadow-primary/8 border border-primary/20 hover:border-primary/60"
                      >
                        {/* Glass background that fades in on hover */}
                        <div className="absolute inset-0 glass-panel opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300 rounded-lg"></div>
                        
                        {/* Cognito glint animation - the sweep effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-500 group-hover:animate-[glint-sweep_1.5s_ease-out] rounded-lg"></div>
                        
                        {/* Sharp neon border effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300 rounded-lg"></div>
                        
                        {/* Glow effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300 shadow-sm shadow-primary/0 group-hover:shadow-primary/8 rounded-lg"></div>

                        {/* Content */}
                        <span className="relative z-10 block text-left text-foreground group-hover:text-primary">{search.query}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveRecentSearch(search.query)} // Pass search.query string
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

              </div>
            )}
            {/* Information Cards - Start */}
            {!hasSearched && !showResults && (
            <div className="mt-8 w-full">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Card 1: Private Web Search */}
                <Link href="/how-it-works" passHref>
                  <div className="h-full glass-panel rounded-lg relative overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-105 border border-transparent hover:border-cyan-400/40 hover:shadow-[0_0_18px_rgba(34,211,238,0.3)]">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"></div>
                    <div className="p-6 flex items-center space-x-4">
                      <Globe className="h-12 w-12 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                      <div>
                        <h4 className="font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">Private Web Search</h4>
                        <p className="text-sm text-muted-foreground group-hover:text-foreground/90 transition-colors">Powered by SearXNG, your searches remain completely anonymous. No tracking, no data collection, no advertising profiles. Get comprehensive results from multiple search engines while maintaining your privacy.</p>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Card 2: Local AI Intelligence */}
                <Link href="/documentation" passHref>
                  <div className="h-full glass-panel rounded-lg relative overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-105 border border-transparent hover:border-fuchsia-400/40 hover:shadow-[0_0_18px_rgba(244,114,182,0.3)]">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-fuchsia-400/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-fuchsia-400/20 to-transparent"></div>
                    <div className="p-6 flex items-center space-x-4">
                      <Bot className="h-12 w-12 text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors" />
                      <div>
                        <h4 className="font-semibold text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors">Local AI Intelligence</h4>
                        <p className="text-sm text-muted-foreground group-hover:text-foreground/90 transition-colors">Using Ollama running on your own hardware, get intelligent query optimization and detailed answers without sending any data to third parties. Your conversations stay completely local and private.</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            )}
            {/* Information Cards - End */}

            {/* Results */}
            {showResults && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-800 ease-out">
                <SearchResultsContainer
                  searchResults={searchResults}
                  aiResponse={aiResponse}
                  isAiLoading={isAiLoading}
                  isOptimizing={isOptimizing} // Pass down isOptimizing
                  optimizedQuery={optimizedQuery} // Pass down optimizedQuery
                  onRetryAi={retryAi}
                />
              </div>
            )}

            {/* No Results State */}
            {showNoResults && (
              <div className={`transition-all duration-700 ${
                isLoading ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0 animate-in fade-in slide-in-from-bottom-4 duration-500'
              }`}>
                <EmptyState
                  icon={<Search />}
                  title={`No results found for "${query}"`} // Display the processed query
                  description="Try different keywords or check your search query"
                  size="md"
                />
              </div>
            )}
          </div> {/* End of "mt-8 w-full" for Recent Searches, Results, etc. */}
        </div> {/* Closes max-width container */}
      </div> {/* Closes container mx-auto */}
    </div> 
  );
}
