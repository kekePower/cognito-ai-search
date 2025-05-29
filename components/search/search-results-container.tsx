"use client"

import { useEffect, useState } from 'react'
import AIResponseCard from "@/components/ai-response-card"
import SearchResults from "@/components/search-results"
import { SearchResult } from "@/lib/api/types"
import { Loader2, Info, Sparkles, Globe, Bot, Diamond } from 'lucide-react'

interface SearchResultsContainerProps {
  searchResults: SearchResult[];
  aiResponse: string;
  isAiLoading: boolean;
  isOptimizing?: boolean; // Added
  optimizedQuery?: string; // Added
  onRetryAi?: () => void;
}

export function SearchResultsContainer({
  searchResults,
  aiResponse,
  isAiLoading,
  isOptimizing, // Added
  optimizedQuery, // Added
  onRetryAi,
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
      {/* AI Response Section - Matching other cards styling */}
      <div className="glass-panel rounded-lg p-6 overflow-visible">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
            <Bot className="h-6 w-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Diamond className="h-5 w-5 text-purple-500 dark:text-primary drop-shadow-[0_0_4px_rgba(168,85,247,0.6)]
                             dark:drop-shadow-[0_0_4px_hsl(var(--primary)/0.6)]" />
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                AI Analysis
              </h3>
            </div>
            <p className="text-sm text-muted">
              <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent font-medium">
                Cognito AI
              </span>
              {" "}powered insights
            </p>
          </div>
        </div>
        
        <div>
          {aiResponse ? (
            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
              <AIResponseCard 
                response={aiResponse} 
                isAiLoading={isAiLoading} // Prop renamed in AIResponseCard
                isOptimizing={isOptimizing} // Pass down
                optimizedQuery={optimizedQuery} // Pass down
                isError={isAiError}
                onRegenerate={isAiError ? onRetryAi : undefined}
              />
            </div>
          ) : isAiLoading ? (
            <div className="glass-panel p-6 relative rounded-lg border border-primary/30 bg-primary/5 dark:bg-primary/10 shadow-lg shadow-primary/20">
              <div className="absolute inset-0 rounded-lg border border-primary/30 animate-pulse"></div>
              <div className="flex items-center justify-center gap-3 text-primary relative z-10">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium flex items-center">
                  <span className="bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--neon-magenta))] to-[hsl(var(--neon-blue))] bg-clip-text text-transparent">
                    Cognito AI is&nbsp;
                  </span>
                  <span className="text-foreground">
                    {" "}generating insights...
                  </span>
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      
      {/* Web Results Section - Matching other cards styling */}
      {searchResults.length > 0 && (
        <div className="glass-panel rounded-lg p-6 overflow-visible">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 border border-accent/30
                          light:from-purple-500/20 light:to-pink-500/20 light:border-purple-300">
              <Globe className="h-6 w-6 text-purple-500 dark:text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]
                             dark:drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Diamond className="h-5 w-5 text-purple-500 dark:text-primary drop-shadow-[0_0_4px_rgba(168,85,247,0.6)]
                               dark:drop-shadow-[0_0_4px_hsl(var(--primary)/0.6)]" />
                <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Web Results
                </h3>
              </div>
              <p className="text-sm text-muted">
                <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent font-medium">
                  Web search results
                </span>
                {" "}powered by SearXNG
              </p>
            </div>
          </div>
          
          <div className="animate-in fade-in slide-in-from-top-2 duration-500 overflow-visible">
            <SearchResults results={searchResults} />
          </div>
        </div>
      )}
    </div>
  )
}
