"use client"

import { useEffect, useState } from 'react'
import AIResponseCard from "@/components/ai-response-card"
import SearchResults from "@/components/search-results"
import { SearchResult } from "@/lib/search-utils"
import { Loader2, Info, Sparkles } from 'lucide-react'

interface SearchResultsContainerProps {
  searchResults: SearchResult[]
  aiResponse: string
  isAiLoading: boolean
}

export function SearchResultsContainer({
  searchResults,
  aiResponse,
  isAiLoading
}: SearchResultsContainerProps) {
  return (
    <div className="space-y-8">
      {/* AI Response Section - Always at the top */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Summary
          </h2>
        </div>
        
        <div className="mb-8">
          {isAiLoading && !aiResponse ? (
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center text-blue-700 dark:text-blue-300">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Generating AI response...</span>
              </div>
            </div>
          ) : (
            <AIResponseCard 
              response={aiResponse} 
              isStreaming={isAiLoading}
              isError={false}
            />
          )}
        </div>
      </div>
      
      {/* Web Results Section */}
      {searchResults.length > 0 && (
        <div>
          <SearchResults results={searchResults} />
        </div>
      )}
    </div>
  )
}
