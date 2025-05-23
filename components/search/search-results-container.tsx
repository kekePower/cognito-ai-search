"use client"

import AIResponseCard from "@/components/ai-response-card"
import SearchResults from "@/components/search-results"
import { SearchResult } from "@/lib/search-utils"

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
    <div className="space-y-8">
      {/* AI Response Section - Always at the top */}
      <div className="mb-8">
        {isAiLoading && !aiResponse ? (
          <div className="border border-primary/20 bg-white dark:bg-[#0f1729]/90 shadow-md backdrop-blur-sm rounded-xl overflow-hidden">
            <div className="pb-2 border-b border-primary/10 bg-primary/5 dark:bg-primary/10 p-4">
              <h3 className="text-xl flex items-center gap-2 text-primary dark:text-primary/90">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                AI Response Loading
              </h3>
            </div>
            <div className="p-4 text-foreground dark:text-gray-300">
              <p className="mb-2">Generating AI response based on your query...</p>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="inline-block h-2 w-2 bg-primary rounded-full animate-pulse"></span>
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
      <div>
        <SearchResults results={searchResults} />
      </div>
    </div>
  )
}
