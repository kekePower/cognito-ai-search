"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto max-w-md py-16 px-4 text-center">
      <div className="flex justify-center mb-4">
        <AlertCircle className="h-16 w-16 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-6">We encountered an error while processing your request. Please try again.</p>
      <Button onClick={reset} variant="default">
        Try again
      </Button>
    </div>
  )
}
