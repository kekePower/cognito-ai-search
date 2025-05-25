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
    <div className="card-bg-primary rounded-xl shadow-sm border border-border/60 dark:border-white/10 overflow-hidden">
      <div className="flex items-center p-4 border-b border-border/60 dark:border-white/10 bg-muted/30 dark:bg-white/5">
        <Clock className="h-5 w-5 mr-2 text-muted-foreground dark:text-white/70" />
        <h3 className="font-medium text-foreground dark:text-white">Recent Searches</h3>
      </div>
      
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {searches.map((search, index) => (
            <div key={index} className="flex items-center">
              <Badge 
                variant="secondary" 
                className="cursor-pointer px-3 py-1 text-sm flex items-center gap-1 bg-muted/50 hover:bg-muted dark:bg-[#182338]/80 dark:hover:bg-[#182338] text-foreground dark:text-white transition-colors"
                onClick={() => onSearchClick(search.query)}
              >
                {search.query}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSearch(index);
                  }}
                  className="ml-1 rounded-full hover:bg-muted/80 dark:hover:bg-white/10 p-1"
                >
                  <X className="h-3 w-3 text-muted-foreground dark:text-white/80" />
                </button>
              </Badge>
            </div>
          ))}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-muted-foreground dark:text-white/70 hover:text-foreground dark:hover:text-white hover:bg-muted/50 dark:hover:bg-white/10"
          onClick={onClearSearches}
        >
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Clear all recent searches
        </Button>
      </div>
    </div>
  )
}
