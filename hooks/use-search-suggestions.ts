import { useState, useEffect, useCallback } from 'react'
import { getRandomSuggestions } from '@/lib/search-suggestions'

interface UseSearchSuggestionsOptions {
  count?: number
  refreshOnMount?: boolean
}

interface UseSearchSuggestionsReturn {
  suggestions: string[]
  refreshSuggestions: () => void
  isLoading: boolean
}

export function useSearchSuggestions({ 
  count = 4, 
  refreshOnMount = true 
}: UseSearchSuggestionsOptions = {}): UseSearchSuggestionsReturn {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true) // Start with loading true
  const [isMounted, setIsMounted] = useState(false)

  const refreshSuggestions = useCallback(() => {
    if (!isMounted) return // Don't run on server
    
    setIsLoading(true)
    try {
      const newSuggestions = getRandomSuggestions(count)
      setSuggestions(newSuggestions)
    } catch (error) {
      console.error('Error getting suggestions:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [count, isMounted])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && refreshOnMount) {
      refreshSuggestions()
    }
  }, [isMounted, refreshOnMount, refreshSuggestions])

  return {
    suggestions,
    refreshSuggestions,
    isLoading: isLoading || !isMounted,
  }
}
