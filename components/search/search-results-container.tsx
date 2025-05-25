"use client"

import { useEffect, useState } from 'react'
import AIResponseCard from "@/components/ai-response-card"
import SearchResults from "@/components/search-results"
import { SearchResult } from "@/lib/api/types"
import { Loader2, Info, Sparkles, Globe } from 'lucide-react'

interface SearchResultsContainerProps {
  searchResults: SearchResult[]
  aiResponse: string
  isAiLoading: boolean
  onRetryAi?: () => void
}

export function SearchResultsContainer({
  searchResults,
  aiResponse,
  isAiLoading,
  onRetryAi
}: SearchResultsContainerProps) {
  // Detect if the AI response is an error message (excluding configuration errors which are handled above)
  const isAiError = Boolean(aiResponse && (
    aiResponse.includes("AI assistant is currently unavailable") ||
    aiResponse.includes("network issues") ||
    aiResponse.includes("server timeout") ||
    aiResponse.includes("Error generating") ||
    aiResponse.includes("failed to fetch") ||
    aiResponse.includes("connection refused") ||
    aiResponse.includes("timeout")
  ) && !(
    aiResponse.includes("configuration is incomplete") ||
    aiResponse.includes("environment setup")
  ))

  // Check for configuration-specific errors
  const isConfigError = Boolean(aiResponse && (
    aiResponse.includes("configuration is incomplete") ||
    aiResponse.includes("environment setup")
  ))

  return (
    <div className="space-y-8">
      {/* AI Response Section - Always at the top */}
      <div>
        <div className="flex items-baseline gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 relative top-[0.125rem]" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Summary
          </h2>
        </div>
        
        <div className="mb-8">
          {aiResponse ? (
            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
              <AIResponseCard 
                response={aiResponse} 
                isStreaming={isAiLoading}
                isError={isAiError}
                onRegenerate={isAiError ? onRetryAi : undefined}
              />
            </div>
          ) : isAiLoading ? (
            <div className="relative flex items-center justify-center p-6 bg-card border border-gray-200 dark:border-gray-700 rounded-2xl">
              <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/50 dark:border-blue-500/50 animate-pulse"></div>
              <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300 relative z-10">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 dark:border-blue-400" />
                <span className="text-sm font-medium">Generating AI response...</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      
      {/* Web Results Section */}
      <div className="mt-8">
        <div className="flex items-baseline gap-2 mb-4">
          <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 relative top-[0.125rem]" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Web Results
          </h2>
        </div>
        
        {searchResults.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-top-2 duration-500">
            <SearchResults results={searchResults} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
