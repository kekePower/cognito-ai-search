'use client'

import { Suspense } from "react"
import Link from "next/link"
import { Search, Sparkles } from "lucide-react"
import { useSearchParams } from 'next/navigation'

import SearchContainer from "@/components/search-container"
import { ThemeToggleButton } from "@/components/theme-toggle-button"

export default function HomePage() {
  const searchParams = useSearchParams()
  const query = searchParams?.get('q') || ''
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="flex items-center space-x-2"
              onClick={() => {
                // Clear any cached search state when clicking the logo
                window.history.replaceState({}, '', '/')
              }}
            >
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg hidden sm:inline-block">Cognito AI Search</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggleButton />
          </div>
        </div>
      </header>

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
        
        <Suspense fallback={
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <SearchContainer initialQuery={query || undefined} />
        </Suspense>
      </main>
    </div>
  )
}
