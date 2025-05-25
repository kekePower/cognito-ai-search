import { cn } from "@/lib/utils"
import { Search, ExternalLink } from "lucide-react"

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
      <div className="text-center py-12 text-gray-500 dark:text-gray-400 flex flex-col items-center">
        <Search className="h-8 w-8 mb-3 text-gray-400 dark:text-gray-500" />
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
    <div className="space-y-4">
      {results.map((result, index) => {
        const displayUrl = result.parsed_url ? 
          `${result.parsed_url[1]?.replace('www.', '')}${result.parsed_url[2] || ''}${result.parsed_url[3] || ''}` : 
          formatUrl(result.url || '')
        
        return (
          <div 
            key={index}
            className={cn(
              "group p-5 rounded-lg border border-gray-200 dark:border-gray-700 bg-card dark:bg-card backdrop-blur-sm",
              "hover:shadow-lg transition-all duration-300",
              "hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-750"
            )}
          >
            <div className="flex flex-col space-y-2">
              {/* URL and source */}
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="truncate max-w-[200px] sm:max-w-xs">{displayUrl}</span>
                {result.engine && (
                  <span className="mx-2 text-gray-400 dark:text-gray-500">•</span>
                )}
                {result.engine && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                    {result.engine}
                  </span>
                )}
              </div>
              
              {/* Title with link */}
              <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline flex items-start text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  {result.title}
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5 shrink-0 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </h3>
              
              {/* Content snippet */}
              {result.content && (
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mt-1">
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
  )
}
