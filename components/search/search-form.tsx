"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { Loader2, Search, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchResult } from "@/lib/api/types"

interface SearchFormProps {
  query: string
  setQuery: (query: string) => void
  isLoading: boolean
  onSearch: (query: string) => void
  onSuggestionClick: (suggestion: string) => void
  suggestions: string[]
  searchResults: SearchResult[]
}

export function SearchForm({
  query,
  setQuery,
  isLoading,
  onSearch,
  onSuggestionClick,
  suggestions,
  searchResults
}: SearchFormProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isLightMode, setIsLightMode] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Check theme on mount and when it changes
    const checkTheme = () => {
      setIsLightMode(!document.documentElement.classList.contains('dark'))
    }
    
    checkTheme()
    
    // Listen for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    onSearch(query)
  }

  return (
    <div className={`text-center p-8 rounded-2xl bg-card dark:bg-card-dark border border-border/60 dark:border-white/10 mb-6 transition-all duration-500 shadow-sm hover:shadow-md ${isFocused ? 'light-shadow dark:white-shadow' : ''}`} data-focused={isFocused ? 'true' : 'false'}>
      <h2 className="text-2xl md:text-4xl font-bold mb-3 text-foreground dark:text-white">What would you like to know?</h2>
      <p className="text-muted-foreground dark:text-white/80 mx-auto text-base mb-6 whitespace-nowrap">
        Ask anything and get AI-powered answers along with web search results
      </p>
      
      <form 
        onSubmit={handleSubmit}
        className="relative"
      >
        <div className={`relative transition-all duration-300 ${isFocused ? 'search-container-focused' : ''}`}
             style={isFocused ? {
               boxShadow: isLightMode ? 
                 '0 0 40px rgba(59, 130, 246, 0.25), 0 0 80px rgba(147, 51, 234, 0.15), 0 20px 40px rgba(0, 0, 0, 0.1)' : 
                 undefined,
               transform: isLightMode ? 
                 'translateY(-3px) scale(1.01)' : 
                 undefined
             } : {}}>
          <div 
            className={`absolute inset-0 rounded-2xl transition-all duration-300 overflow-hidden ${
              isFocused ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className={`absolute inset-0 rounded-2xl search-focus-gradient transition-transform duration-300 ease-out ${
                isFocused 
                  ? 'translate-x-0' 
                  : 'translate-x-full'
              }`}
              style={{ 
                padding: '3px',
                background: isLightMode && isFocused ? 
                  'linear-gradient(90deg, #0ea5e9 0%, #3b82f6 25%, #8b5cf6 50%, #ec4899 75%, #0ea5e9 100%)' : 
                  undefined,
                backgroundSize: isLightMode && isFocused ? 
                  '300% 100%' : 
                  undefined,
                animation: isLightMode && isFocused ? 
                  'shimmer-light-strong 1.5s ease-in-out infinite' : 
                  undefined
              }}
            >
              <div className="w-full h-full bg-card rounded-xl"></div>
            </div>
          </div>

          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Ask AI anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`relative w-full h-16 px-6 pr-20 text-lg bg-card dark:bg-card-dark rounded-2xl focus:ring-0 focus:outline-none placeholder:text-muted dark:placeholder:text-subtle transition-all duration-300 z-10 ${
              isFocused 
                ? 'border-[3px] border-transparent search-field-focused' 
                : 'border-[3px] border-border/60 dark:border-white/20'
            }`}
            style={isFocused ? {
              boxShadow: isLightMode ? 
                '0 0 0 4px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.3), 0 0 60px rgba(147, 51, 234, 0.2), 0 8px 25px rgba(0, 0, 0, 0.15)' : 
                undefined,
              borderColor: isLightMode ? 
                '#3b82f6' : 
                undefined,
              transform: isLightMode ? 
                'translateY(-2px)' : 
                undefined
            } : {}}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          
          <Button 
            type="submit" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl h-10 px-4 bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 dark:from-primary-dark/10 dark:to-primary-dark/20 dark:hover:from-primary-dark/20 dark:hover:to-primary-dark/30 border-0 shadow-md hover:shadow-lg transition-all duration-300 z-20"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-secondary dark:text-white" />
            ) : (
              <Sparkles className="h-4 w-4 text-primary" />
            )}
          </Button>
        </div>
      </form>
      
      {suggestions.length > 0 && !query && !searchResults.length && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {suggestions.map((suggestion, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="cursor-pointer px-3 py-1 text-sm hover:bg-primary/10 dark:text-white/90 dark:border-white/20 dark:hover:bg-white/10 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Suggestion clicked:', suggestion);
                onSuggestionClick(suggestion);
              }}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
