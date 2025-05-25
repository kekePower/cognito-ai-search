import { useEffect, useState } from 'react'
import { SearchResult } from '@/lib/api/types'

interface ProgressiveSearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
  initialBatchSize?: number
  batchIncrement?: number
  delayMs?: number
  className?: string
  renderItem?: (result: SearchResult, index: number) => React.ReactNode
}

export function ProgressiveSearchResults({
  results,
  isLoading,
  initialBatchSize = 3,
  batchIncrement = 2,
  delayMs = 200,
  className = '',
  renderItem
}: ProgressiveSearchResultsProps) {
  const [visibleCount, setVisibleCount] = useState(initialBatchSize)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Reset state when results or loading state changes
    setVisibleCount(initialBatchSize)
    setIsComplete(false)
  }, [results, isLoading, initialBatchSize])

  useEffect(() => {
    if (isLoading || !results.length) {
      setIsComplete(false)
      return
    }

    // If we've already shown all results, mark as complete
    if (visibleCount >= results.length) {
      setIsComplete(true)
      return
    }

    // Set up progressive loading
    const timer = setInterval(() => {
      setVisibleCount(prev => {
        const newCount = prev + batchIncrement
        if (newCount >= results.length) {
          setIsComplete(true)
          clearInterval(timer)
          return results.length
        }
        return newCount
      })
    }, delayMs)

    return () => clearInterval(timer)
  }, [results, isLoading, visibleCount, batchIncrement, delayMs])

  const visibleResults = results.slice(0, visibleCount)

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="animate-pulse p-4 rounded-lg bg-gray-100 dark:bg-gray-800"
            style={{
              height: '120px',
              animationDelay: `${i * 100}ms`,
              animationDuration: '1.5s'
            }}
          />
        ))}
      </div>
    )
  }

  if (!results.length) {
    return (
      <div className={`text-center py-8 text-gray-500 dark:text-gray-400 ${className}`}>
        No results found. Try a different search query.
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {visibleResults.map((result, index) => (
        <div
          key={`${result.url}-${index}`}
          className="animate-in slide-in-from-bottom-4 duration-300"
          style={{ 
            animationDelay: `${Math.min(index, 5) * 100}ms`,
            opacity: isComplete ? 1 : Math.min(1, 0.3 + (index / visibleCount) * 0.7)
          }}
        >
          {renderItem ? (
            renderItem(result, index)
          ) : (
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow duration-200">
              <h3 className="font-medium text-gray-900 dark:text-white">
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline text-blue-600 dark:text-blue-400"
                >
                  {result.title || 'Untitled'}
                </a>
              </h3>
              {result.content && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {result.content}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
