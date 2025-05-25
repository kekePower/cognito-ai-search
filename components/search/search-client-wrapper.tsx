"use client"

import { Suspense } from "react"
// No need for useSearchParams here as SearchContainer handles it
import SearchContainer from "@/components/search-container"

export function SearchClientWrapper() {
  // initialQuery is handled within SearchContainer via useSearchParams
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <SearchContainer />
    </Suspense>
  )
}
