'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

interface SearchButtonProps {
  isLoading?: boolean
  query?: string
  type?: "button" | "submit" | "reset"
}

export function SearchButton({ isLoading = false, query, type = "submit" }: SearchButtonProps) {
  const { pending } = useFormStatus()
  
  const isDisabled = pending || isLoading || !query?.trim()
  
  return (
    <Button
      type={type}
      disabled={isDisabled}
      className="mr-2 px-6 py-2 rounded-md font-medium border border-primary/60 bg-primary text-white disabled:bg-primary disabled:text-disabled disabled:opacity-100 disabled:cursor-not-allowed"
    >
      {pending || isLoading ? (
        <span className="relative z-10">Searching...</span>
      ) : (
        <span className="relative z-10">Search</span>
      )}
    </Button>
  )
}
