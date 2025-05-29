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
      variant="outline"
      className="mr-2 h-10 px-6 py-2 rounded-md font-medium 
                 shadow-sm hover:shadow-md
                 disabled:opacity-60 disabled:cursor-not-allowed
                 transition-all duration-200
                 bg-transparent border-foreground text-foreground
                 hover:bg-foreground/10"
    >
      {pending || isLoading ? (
        <span>Searching...</span>
      ) : (
        <span>Search</span>
      )}
    </Button>
  )
}
