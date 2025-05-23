"use client"

import { Suspense } from "react"
import { useSearchParams } from 'next/navigation'
import SearchContainer from "@/components/search-container"

export function SearchClientWrapper() {
  const searchParams = useSearchParams()
  const query = searchParams?.get('q') || ''
  
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <SearchContainer initialQuery={query || undefined} />
    </Suspense>
  )
}
