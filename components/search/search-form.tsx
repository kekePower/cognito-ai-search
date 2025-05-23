"use client"

import { useState, useRef, type FormEvent } from "react"
import { Loader2, Search, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchResult } from "@/lib/search-utils"

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
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    onSearch(query)
  }

  return (
    <div className={`text-center p-8 rounded-2xl bg-white dark:bg-[#182338]/80 border border-border/60 dark:border-white/10 mb-6 transition-all duration-500 shadow-sm hover:shadow-md ${isFocused ? 'light-shadow dark:white-shadow' : ''}`} data-focused={isFocused ? 'true' : 'false'}>
      <h2 className="text-2xl md:text-4xl font-bold mb-3 text-foreground dark:text-white">What would you like to know?</h2>
      <p className="text-muted-foreground dark:text-white/80 mx-auto text-base mb-6 whitespace-nowrap">
        Ask anything and get AI-powered answers along with web search results
      </p>
      
      <form 
        onSubmit={handleSubmit}
        className="relative max-w-2xl mx-auto"
      >
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="I'll search the web and use AI to craft the perfect answer just for you."
          className="h-14 pl-5 pr-32 rounded-full text-base text-black dark:text-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        <Button 
          type="submit" 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full h-12"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Search
            </>
          )}
        </Button>
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
