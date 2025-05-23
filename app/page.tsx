import { Search, Sparkles } from "lucide-react"

import { SiteHeader } from "@/components/layout/site-header"
import { SearchClientWrapper } from "@/components/search/search-client-wrapper"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <SiteHeader />

      {/* Main Content */}
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
            Private Search & Local AI
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Self-hosted web search and local AI answers in one private interface
          </p>
        </div>
        
        <SearchClientWrapper />
      </main>
    </div>
  )
}
