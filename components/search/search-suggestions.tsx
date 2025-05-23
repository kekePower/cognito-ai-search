'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import { useSearchSuggestions } from '@/hooks/use-search-suggestions'

interface SearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
}

export function SearchSuggestions({ onSuggestionClick }: SearchSuggestionsProps) {
  const { suggestions, refreshSuggestions, isLoading } = useSearchSuggestions({ count: 4 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Show skeleton during hydration
    return (
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Try these searches:</h3>
          <Button
            variant="ghost"
            size="sm"
            disabled
            className="text-muted-foreground opacity-50"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
              style={{ width: `${120 + (index * 20)}px` }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Try these searches:</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshSuggestions}
          disabled={isLoading}
          className="text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <RotateCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {isLoading ? (
          // Skeleton loading for suggestions
          [...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
              style={{ width: `${120 + (index * 20)}px` }}
            />
          ))
        ) : suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors px-3 py-2 text-sm"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </Badge>
          ))
        ) : (
          // Fallback if no suggestions load
          <div className="text-muted-foreground text-sm">
            Click refresh to load search suggestions
          </div>
        )}
      </div>
    </div>
  )
}
