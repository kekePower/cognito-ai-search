"use client"

import AIResponseCard from "@/components/ai-response-card"
import SearchResults from "@/components/search-results"
import { SearchResult } from "@/lib/search-utils"
import { Loader2, Info } from 'lucide-react';

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
  if (searchResults.length === 0) return null
  
  return (
    <div className="space-y-8 transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-bottom-3 duration-600">
      {/* AI Response Section - Always at the top */}
      <div className="mb-8 transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-bottom-2 delay-150">
        {isAiLoading && !aiResponse ? (
          // AI Response Loading State - Redesigned
          <div className="p-6 rounded-xl shadow-lg bg-blue-50 border border-blue-200 dark:bg-slate-800 dark:border-slate-700 text-blue-700 dark:text-blue-300">
            <div className="flex items-center mb-4">
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              <h3 className="text-xl font-semibold">AI Response Loading</h3>
            </div>
            {/* Removed the border-t here for a cleaner look */}
            <div className="space-y-2">
              <p className="text-base">Generating AI response based on your query...</p>
              <div className="flex items-center text-sm text-blue-500 dark:text-blue-400">
                <Info className="mr-1.5 h-4 w-4 flex-shrink-0" />
                <span>This may take a few moments</span>
              </div>
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
      
      {/* Web Results Section */}
      <div className="animate-in fade-in slide-in-from-bottom-2 delay-300">
        <SearchResults results={searchResults} />
      </div>
    </div>
  )
}
