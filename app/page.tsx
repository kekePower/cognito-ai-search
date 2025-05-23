import { Search, Sparkles, Bot, Globe } from "lucide-react"

import { SiteHeader } from "@/components/layout/site-header"
import { SearchClientWrapper } from "@/components/search/search-client-wrapper"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/95 dark:from-[#0B1120] dark:to-[#0B1120]/95">
      {/* Header */}
      <SiteHeader />

      {/* Main Content */}
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-2">
            <Badge variant="outline" className="px-3 py-1 text-xs font-medium bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30 text-primary dark:text-primary/90">
              <Sparkles className="h-3 w-3 mr-1" />
              Self-hosted & Private
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 dark:from-primary/90 dark:to-primary/60 mb-2">
            Search + AI in One Place
          </h1>
        </div>
        
        {/* Search box gets priority placement */}
        <div className="mb-12">
          <SearchClientWrapper />
        </div>
        
        {/* Description moved below search */}
        <div className="text-center mb-8">
          <p className="text-lg text-muted-foreground dark:text-white/80 max-w-2xl mx-auto">
            Your private search engine with local AI-powered answers
          </p>
        </div>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <div className="flex items-start p-4 rounded-lg bg-card/50 dark:bg-[#182338]/80 border border-border/60 dark:border-white/10 backdrop-blur-sm shadow-sm hover:shadow transition-all duration-200">
            <div className="mr-4 mt-1 bg-primary/10 dark:bg-primary/20 p-2 rounded-full">
              <Globe className="h-5 w-5 text-primary dark:text-primary/90" />
            </div>
            <div>
              <h3 className="font-medium mb-1 dark:text-white/90">Web Search</h3>
              <p className="text-sm text-muted-foreground dark:text-white/70">Powered by SearXNG for private, untracked web results</p>
            </div>
          </div>
          
          <div className="flex items-start p-4 rounded-lg bg-card/50 dark:bg-[#182338]/80 border border-border/60 dark:border-white/10 backdrop-blur-sm shadow-sm hover:shadow transition-all duration-200">
            <div className="mr-4 mt-1 bg-primary/10 dark:bg-primary/20 p-2 rounded-full">
              <Bot className="h-5 w-5 text-primary dark:text-primary/90" />
            </div>
            <div>
              <h3 className="font-medium mb-1 dark:text-white/90">Local AI Responses</h3>
              <p className="text-sm text-muted-foreground dark:text-white/70">Using Ollama to generate answers without sending data to third parties</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
