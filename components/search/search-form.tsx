"use client"

import { useState, useRef, type FormEvent } from "react"
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
        className="relative"
      >
        <div className="relative">
          {/* Animated gradient border - Google style */}
          <div 
            className={`absolute inset-0 rounded-2xl transition-all duration-300 overflow-hidden ${
              isFocused ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-transform duration-300 ease-out ${
                isFocused 
                  ? 'translate-x-0' 
                  : 'translate-x-full'
              }`}
              style={{ padding: '3px' }}
            >
              <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl"></div>
            </div>
          </div>

          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Ask AI anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`relative w-full h-16 px-6 pr-20 text-lg bg-white dark:bg-gray-800 rounded-2xl focus:ring-0 focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-300 z-10 ${
              isFocused 
                ? 'border-[3px] border-transparent' 
                : 'border-[3px] border-gray-200 dark:border-gray-700'
            }`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          
          <Button 
            type="submit" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl h-10 px-4 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 dark:from-gray-600 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-800 border-0 shadow-md hover:shadow-lg transition-all duration-300 z-20"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-600 dark:text-white" />
            ) : (
              <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
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
