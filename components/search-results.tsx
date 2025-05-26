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
      <div className="glass-panel-solid rounded-lg p-12 text-center relative overflow-hidden" style={{ backgroundColor: 'rgba(147, 51, 234, 0.03)' }}>
        {/* Holographic accent lines with purple theme */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400/20 to-transparent"></div>
        
        <div className="flex flex-col items-center text-secondary">
          <div className="relative mb-4">
            <Search className="h-12 w-12 text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
            <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-lg"></div>
          </div>
          <p className="text-lg font-medium mb-2">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">No cognito fragments found</span>
          </p>
          <p className="text-sm text-secondary">Search query: "<span className="text-purple-400 font-medium">{query}</span>"</p>
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
    <div className="space-y-4">
      {results.map((result, index) => {
        const displayUrl = result.parsed_url ? 
          `${result.parsed_url[1]?.replace('www.', '')}${result.parsed_url[2] || ''}${result.parsed_url[3] || ''}` : 
          formatUrl(result.url || '')
        
        return (
          <div 
            key={index}
            className="relative group"
          >
            {/* Outer cognito glow with purple theme */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/10 to-purple-500/5 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Angular cognito border with purple accent */}
            <div className="absolute inset-0 border border-purple-400/40 group-hover:border-pink-400/60 transition-all duration-300"
              style={{
                clipPath: `polygon(${index % 2 === 0 ? '0.5% 0%, 100% 0%, 99.5% 100%, 0% 100%' : '0% 0%, 99.5% 0%, 100% 100%, 0.5% 100%'})`,
                filter: 'drop-shadow(0 0 4px rgba(147, 51, 234, 0.3))',
              }}
            ></div>
            
            {/* Main result card with purple tint and angular shape */}
            <div className="relative glass-panel-solid p-6 overflow-hidden hover:scale-[1.02] transition-all duration-300"
              style={{
                clipPath: `polygon(${index % 2 === 0 ? '0.5% 0%, 100% 0%, 99.5% 100%, 0% 100%' : '0% 0%, 99.5% 0%, 100% 100%, 0.5% 100%'})`,
                backgroundColor: 'rgba(147, 51, 234, 0.03)'
              }}
            >
              {/* Sharp holographic accent lines with purple/pink gradient */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400/30 to-transparent"></div>
              
              {/* Cognito corner accent with purple theme */}
              <div className={`absolute ${index % 2 === 0 ? 'top-2 right-3' : 'top-2 left-3'} w-0 h-0 border-l-2 border-l-transparent border-r-2 border-r-transparent border-b-2 border-b-purple-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="flex flex-col space-y-3">
                {/* URL and source with enhanced styling */}
                <div className="flex items-center text-sm text-muted">
                  <Globe className="h-3 w-3 mr-2 text-pink-500 drop-shadow-[0_0_4px_rgba(236,72,153,0.6)]" />
                  <span className="truncate max-w-[200px] sm:max-w-xs text-purple-400/80 font-medium">{displayUrl}</span>
                  {result.engine && (
                    <>
                      <span className="mx-2 text-subtle">•</span>
                      <div className="glass-panel px-2 py-1 text-xs border border-purple-400/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-md">
                        <Sparkles className="h-2 w-2 inline mr-1 text-pink-400" />
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-medium">{result.engine}</span>
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
                    className="hover:underline flex items-start transition-colors duration-200 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent hover:from-purple-500 hover:to-pink-500 dark:hover:from-purple-300 dark:hover:to-pink-300"
                  >
                    {result.title}
                    <ExternalLink className="ml-2 h-4 w-4 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 text-pink-500 drop-shadow-[0_0_4px_rgba(236,72,153,0.6)]" />
                  </a>
                </h3>
                
                {/* Content snippet with enhanced readability */}
                {result.content && (
                  <p className="text-secondary text-sm line-clamp-3 leading-relaxed">
                    {result.content}
                  </p>
                )}
                
                {/* Enhanced access button with purple theme */}
                <div className="flex items-center pt-3">
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="glass-panel px-4 py-2 text-sm border border-purple-400/30 hover:border-pink-400/50 transition-all duration-300 hover:scale-105 inline-flex items-center rounded-md font-medium bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20"
                  >
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Access Fragment</span>
                    <ExternalLink className="ml-2 h-3 w-3 text-pink-500 drop-shadow-[0_0_4px_rgba(236,72,153,0.6)]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
