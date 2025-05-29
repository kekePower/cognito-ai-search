import { cn } from "@/lib/utils"
import { Search, ExternalLink, Globe, Sparkles } from "lucide-react"

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
      <div className="glass-panel-solid rounded-lg p-12 text-center relative overflow-hidden">
        {/* Holographic accent lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        
        <div className="flex flex-col items-center text-secondary">
          <div className="relative mb-4">
            <Search className="h-12 w-12 text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)]" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
          </div>
          <p className="text-lg font-medium mb-2">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">No cognito fragments found</span>
          </p>
          <p className="text-sm text-secondary">Search query: "<span className="text-primary font-medium">{query}</span>"</p>
          <p className="text-xs text-muted mt-2">Try different neural pathways or refine your search parameters</p>
        </div>
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
    <div className="space-y-4 overflow-visible">
      {results.map((result, index) => {
        const displayUrl = result.parsed_url ? 
          `${result.parsed_url[1]?.replace('www.', '')}${result.parsed_url[2] || ''}${result.parsed_url[3] || ''}` : 
          formatUrl(result.url || '')
        
        return (
          <div 
            key={index}
            className="search-result-card-wrapper"
          >
            {/* Card content */}
            <div className="relative group transition-shadow duration-300 search-result-card overflow-visible">
              {/* Angular cognito border */}
              <div className="absolute inset-0 border border-border dark:border-primary/40 transition-colors duration-300
                            light:border-purple-300"
                style={{
                  clipPath: `polygon(${index % 2 === 0 ? '0.5% 0%, 100% 0%, 99.5% 100%, 0% 100%' : '0% 0%, 99.5% 0%, 100% 100%, 0.5% 100%'})`,
                  filter: 'drop-shadow(0 0 4px hsl(var(--primary) / 0.3))',
                }}
              ></div>
              
              {/* Main result card with proper light/dark mode support */}
              <div className="relative glass-panel-solid p-6 overflow-hidden transition-colors duration-300 
                            bg-card/50 dark:bg-card/80 backdrop-blur-sm
                            border border-border dark:border-glass-border"
                style={{
                  clipPath: `polygon(${index % 2 === 0 ? '0.5% 0%, 100% 0%, 99.5% 100%, 0% 100%' : '0% 0%, 99.5% 0%, 100% 100%, 0.5% 100%'})`
                }}
              >
                {/* Cognito corner accent - always visible */}
                <div className={`absolute ${index % 2 === 0 ? 'top-2 right-3' : 'top-2 left-3'} w-0 h-0 border-l-2 border-l-transparent border-r-2 border-r-transparent border-b-2 border-b-primary/50
                              light:border-b-purple-400`}></div>
                
                <div className="flex flex-col space-y-3">
                  {/* URL and source with enhanced styling */}
                  <div className="flex items-center text-sm text-muted">
                    <Globe className="h-3 w-3 mr-2 text-primary drop-shadow-[0_0_4px_hsl(var(--primary)/0.6)] 
                                 dark:drop-shadow-[0_0_4px_hsl(var(--primary)/0.6)]
                                 light:text-purple-500 light:drop-shadow-[0_0_4px_rgba(168,85,247,0.6)]" />
                    <span className="truncate max-w-[200px] sm:max-w-xs text-muted-foreground font-medium">{displayUrl}</span>
                    {result.engine && (
                      <>
                        <span className="mx-2 text-subtle">•</span>
                        <div className="glass-panel px-2 py-1 text-xs border border-border dark:border-primary/30 
                                      bg-primary/5 dark:bg-gradient-to-r dark:from-primary/10 dark:to-primary/5 rounded-md
                                      light:bg-gradient-to-r light:from-purple-500/10 light:to-pink-500/10 light:border-purple-300">
                          <Sparkles className="h-2 w-2 inline mr-1 text-primary 
                                         light:text-purple-500" />
                          <span className="text-primary font-medium light:text-purple-600">{result.engine}</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Title with link and gradient text */}
                  <h3 className="text-lg font-medium">
                    <a 
                      href={result.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline flex items-start transition-colors duration-200 
                               text-foreground hover:text-primary dark:text-primary dark:hover:text-primary/80
                               light:hover:text-purple-600"
                    >
                      {result.title}
                      <ExternalLink className="ml-2 h-4 w-4 shrink-0 mt-0.5 opacity-50 text-primary drop-shadow-[0_0_4px_hsl(var(--primary)/0.6)]
                                         light:text-purple-500 light:drop-shadow-[0_0_4px_rgba(168,85,247,0.6)]" />
                    </a>
                  </h3>
                  
                  {/* Content snippet with enhanced readability */}
                  {result.content && (
                    <p className="text-secondary text-sm line-clamp-3 leading-relaxed">
                      {result.content}
                    </p>
                  )}
                  
                  {/* Enhanced access button */}
                  <div className="flex items-center pt-3">
                    <a 
                      href={result.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="glass-panel px-4 py-2 text-sm border border-border dark:border-primary/30 
                               transition-[border-color,background-color] duration-300 
                               inline-flex items-center rounded-md font-medium 
                               bg-primary/5 dark:bg-primary/10
                               light:bg-gradient-to-r light:from-purple-500/10 light:to-pink-500/10 
                               light:border-purple-300 light:hover:border-purple-400
                               light:hover:from-purple-500/15 light:hover:to-pink-500/15"
                    >
                      <span className="text-primary font-medium light:text-purple-600">Access Fragment</span>
                      <ExternalLink className="ml-2 h-3 w-3 text-primary drop-shadow-[0_0_4px_hsl(var(--primary)/0.6)]
                                         light:text-purple-500 light:drop-shadow-[0_0_4px_rgba(168,85,247,0.6)]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
