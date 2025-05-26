"use client"

import { Clock, RefreshCw, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface RecentSearch {
  query: string
  timestamp: number
}

interface RecentSearchesProps {
  searches: RecentSearch[]
  onSearchClick: (query: string) => void
  onRemoveSearch: (index: number) => void
  onClearSearches: () => void
}

export function RecentSearches({
  searches,
  onSearchClick,
  onRemoveSearch,
  onClearSearches
}: RecentSearchesProps) {
  if (searches.length === 0) return null
  
  return (
    <div className="card-bg-primary rounded-xl shadow-sm border border-border/60 dark:border-white/10">
      <div className="flex items-center p-4 border-b border-border/60 dark:border-white/10 bg-muted/30 dark:bg-white/5">
        <Clock className="h-5 w-5 mr-2 text-muted-foreground dark:text-white/70" />
        <h3 className="font-medium text-foreground dark:text-white">Recent Searches</h3>
      </div>
      
      <div className="p-4 relative">
        <div className="flex flex-wrap gap-3 mb-3">
          {searches.map((search, index) => (
            <div key={index} className="relative">
              <button
                className="group relative px-4 py-2 text-sm text-secondary hover:text-primary transition-all duration-300 flex items-center gap-1 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => onSearchClick(search.query)}
              >
                {/* Base background for better visibility */}
                <div className="absolute inset-0 bg-muted/30 dark:bg-[#182338]/50 rounded-lg"></div>
                
                {/* Glass background that fades in on hover */}
                <div className="absolute inset-0 glass-panel opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg border border-cyan-400/0 group-hover:border-cyan-400/20"></div>
                
                {/* Cognito glint animation - the sweep effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-[glint-sweep_1.5s_ease-out] rounded-lg"></div>
                
                {/* Sharp neon border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/30 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg"></div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg shadow-lg shadow-cyan-400/0 group-hover:shadow-cyan-400/20"></div>
                
                {/* Content */}
                <span className="relative z-10 group-hover:font-semibold transition-all duration-300">{search.query}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSearch(index);
                  }}
                  className="relative z-10 ml-1 rounded-full hover:bg-white/20 p-0.5 transition-colors"
                >
                  <X className="h-3 w-3 text-muted-foreground dark:text-white/80" />
                </button>
              </button>
            </div>
          ))}
        </div>
        
        <div className="relative group">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-muted-foreground dark:text-white/70 hover:text-foreground dark:hover:text-white hover:bg-muted/50 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105"
            onClick={onClearSearches}
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-300" />
            Clear all recent searches
          </Button>
          
          {/* Interactive tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-card border border-border/60 dark:border-white/20 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 whitespace-nowrap">
            <div className="text-xs text-foreground dark:text-white font-medium">
              Remove all search history
            </div>
            {/* Arrow pointing down */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-border/60 dark:border-t-white/20"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
