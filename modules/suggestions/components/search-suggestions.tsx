'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RotateCcw, Sparkles } from 'lucide-react'
import { useSearchSuggestions } from '../hooks/use-search-suggestions'

export interface SearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
}

/**
 * SearchSuggestions Component
 * Displays a grid of AI-focused search suggestions with refresh functionality
 * Features cognito styling and smooth animations
 */
export function SearchSuggestions({ onSuggestionClick }: SearchSuggestionsProps) {
  const { suggestions, refreshSuggestions, isLoading } = useSearchSuggestions({ count: 6 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Show skeleton during hydration
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Cognito Suggestions
          </h3>
          <Button
            variant="ghost"
            size="sm"
            disabled
            className="glass-panel shard text-muted hover:text-primary transition-colors duration-200"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 max-w-5xl">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-10 glass-panel shard rounded-lg flex-1 min-w-[200px]"
              style={{
                animation: 'subtle-pulse 6s ease-in-out infinite',
                animationDelay: `${index * 0.3}s`
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Cognito Suggestions
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshSuggestions}
          disabled={isLoading}
          className="group relative glass-panel shard text-muted hover:text-primary transition-all duration-300 disabled:opacity-50 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 border border-primary/20 hover:border-primary/40 overflow-hidden"
        >
          {/* Glass background that fades in on hover */}
          <div className="absolute inset-0 glass-panel opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300 rounded-lg"></div>
          
          {/* Cognito glint animation - the sweep effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-500 group-hover:animate-[glint-sweep_1.5s_ease-out] rounded-lg"></div>
          
          {/* Content */}
          <RotateCcw className={`h-4 w-4 mr-2 relative z-10 transition-transform duration-300 group-hover:rotate-180 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="relative z-10">Refresh</span>
        </Button>
      </div>
      <div className="flex flex-wrap gap-4 max-w-6xl justify-center">
        {isLoading ? (
          // Skeleton loading for suggestions
          [...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-10 glass-panel shard rounded-lg flex-1 min-w-[200px]"
              style={{
                animation: 'subtle-pulse 6s ease-in-out infinite',
                animationDelay: `${index * 0.3}s`
              }}
            />
          ))
        ) : suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => {
            // Reset pattern every 3 items for consistent rows
            const rowIndex = index % 3;
            return (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion)}
              className="group relative crystal-shard glass-panel px-8 py-3 text-xs text-foreground hover:text-primary transition-all ease-in-out duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 border border-primary/20 hover:border-primary/60 flex-shrink-0 min-w-fit max-w-none break-words overflow-hidden"
              style={{
                clipPath: `polygon(${8 + rowIndex * 2}% 0%, 100% 0%, ${92 - rowIndex * 1.5}% 100%, 0% 100%)`,
                transform: `skew(${-2 + rowIndex * 0.5}deg)`,
              }}
            >
              {/* Glass background that fades in on hover */}
              <div className="absolute inset-0 glass-panel opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300 rounded-none"></div>
              
              {/* Cognito glint animation - the sweep effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-500 group-hover:animate-[glint-sweep_1.5s_ease-out]"></div>
              
              {/* Sharp neon border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300"></div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300 shadow-lg shadow-primary/0 group-hover:shadow-primary/20"></div>

              {/* Text content */}
              <span className="relative z-10 text-foreground group-hover:text-primary">
                {suggestion}
              </span>
            </button>
          )})
        ) : (
          // Fallback if no suggestions load
          <div className="glass-panel shard rounded-lg p-4 text-muted text-sm">
            <Sparkles className="h-4 w-4 inline mr-2" />
            Click refresh to load cognito suggestions
          </div>
        )}
      </div>
    </div>
  )
}
