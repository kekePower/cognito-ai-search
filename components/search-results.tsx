import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchResult {
  title: string
  url: string
  content?: string
  // Add any additional fields that might come from the SearXNG API
  parsed_url?: string[]
  img_src?: string
  engine?: string
  score?: number
}

interface SearchResultsProps {
  results: SearchResult[]
  query?: string
}

export default function SearchResults({ results, query = '' }: SearchResultsProps) {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No results found for "{query}"
      </div>
    )
  }

  // Function to format the URL for display
  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      // Remove protocol and www. for cleaner display
      return urlObj.hostname.replace('www.', '') + urlObj.pathname
    } catch {
      return url
    }
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => {
        const displayUrl = result.parsed_url ? 
          `${result.parsed_url[1]?.replace('www.', '')}${result.parsed_url[2] || ''}${result.parsed_url[3] || ''}` : 
          formatUrl(result.url || '')
        
        return (
          <div 
            key={index}
            className={cn(
              "group p-5 rounded-lg border border-border-60 bg-card",
              "hover:shadow-md transition-all duration-200",
              "hover:border-border hover:bg-card-80"
            )}
          >
            <div className="flex flex-col space-y-2">
              {/* URL and source */}
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="truncate max-w-[200px] sm:max-w-xs">{displayUrl}</span>
                {result.engine && (
                  <span className="mx-2 text-muted-foreground/50">•</span>
                )}
                {result.engine && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {result.engine}
                  </span>
                )}
              </div>
              
              {/* Title with link */}
              <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline flex items-start"
                >
                  {result.title}
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5 shrink-0 mt-1.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              </h3>
              
              {/* Content snippet */}
              {result.content && (
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {result.content}
                </p>
              )}
              
              {/* Additional metadata */}
              <div className="flex items-center pt-2">
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-primary/80 hover:underline inline-flex items-center transition-colors"
                >
                  Visit website
                  <ExternalLink className="ml-1 h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
