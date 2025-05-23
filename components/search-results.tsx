import { ExternalLink, Globe, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

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
      <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
        <Search className="h-8 w-8 mb-3 text-muted-foreground/50" />
        <p>No results found for "{query}"</p>
        <p className="text-sm mt-2">Try using different keywords or simplify your search query</p>
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
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Globe className="h-4 w-4 text-primary/70 relative top-[0.075em]" />
          <span className="text-sm font-medium ml-2">Web Results</span>
        </div>
        <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">
          {results.length} results
        </Badge>
      </div>
      
      <div className="space-y-4">
        {results.map((result, index) => {
          const displayUrl = result.parsed_url ? 
            `${result.parsed_url[1]?.replace('www.', '')}${result.parsed_url[2] || ''}${result.parsed_url[3] || ''}` : 
            formatUrl(result.url || '')
          
          return (
            <div 
              key={index}
              className={cn(
                "group p-5 rounded-lg border border-border/50 bg-white dark:bg-[#0f1729]/90 backdrop-blur-sm",
                "hover:shadow-lg transition-all duration-300",
                "hover:border-primary/20 hover:bg-white hover:dark:bg-[#0f1729]/95"
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
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/5 text-primary/80 border border-primary/10">
                    {result.engine}
                  </span>
                )}
              </div>
              
              {/* Title with link */}
              <h3 className="text-lg font-medium text-foreground dark:text-gray-200 group-hover:text-primary transition-colors">
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline flex items-start dark:text-blue-300 dark:hover:text-blue-200"
                >
                  {result.title}
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5 shrink-0 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </h3>
              
              {/* Content snippet */}
              {result.content && (
                <p className="text-muted-foreground text-sm line-clamp-3 mt-1">
                  {result.content}
                </p>
              )}
              
              {/* Additional metadata */}
              <div className="flex items-center pt-2">
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary dark:text-blue-300 hover:text-primary/80 dark:hover:text-blue-200 hover:underline inline-flex items-center transition-colors px-3 py-1 rounded-full bg-primary/5 hover:bg-primary/10"
                >
                  Visit website
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
