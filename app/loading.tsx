import SearchSkeleton from "@/components/search-skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">AI-Powered Search</h1>
      <p className="text-center text-gray-600 mb-8">
        Search using Ollama AI (qwen3:30b) and SearXNG for comprehensive results
      </p>

      <div className="w-full">
        <div className="mb-8 h-12 bg-gray-100 rounded-lg animate-pulse"></div>
        <SearchSkeleton />
      </div>
    </div>
  )
}
