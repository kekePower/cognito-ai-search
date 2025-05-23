import { Suspense } from "react"
import { SiteHeader } from "@/components/layout/site-header"
import { SearchClientWrapper } from "@/components/search/search-client-wrapper"
import { Sparkles } from "lucide-react"

// Loading skeleton for the search container
function SearchContainerSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl p-4 transition-all duration-300">
      {/* Header skeleton */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="text-blue-600 dark:text-blue-400 h-8 w-8" />
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mx-auto"></div>
      </div>

      {/* Search form skeleton */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="relative">
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
        </div>
      </div>

      {/* Always show suggestions skeleton to maintain layout */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
              style={{ width: `${120 + (i * 20)}px` }}
            />
          ))}
        </div>
      </div>

      {/* Feature boxes skeleton */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="text-center mb-6">
          <div className="h-8 w-80 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mx-auto mb-3"></div>
          <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-start p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="mr-4 mt-1 bg-gray-200 dark:bg-gray-700 p-3 rounded-full w-12 h-12 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-col transition-colors duration-300">
      {/* Header */}
      <SiteHeader />

      {/* Main Content */}
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-2">
        {/* Search box gets priority placement */}
        <div>
          <Suspense fallback={<SearchContainerSkeleton />}>
            <SearchClientWrapper />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
