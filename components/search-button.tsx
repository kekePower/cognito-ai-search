'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

interface SearchButtonProps {
  isLoading?: boolean
  query?: string
  type?: "button" | "submit" | "reset"
}

export function SearchButton({ isLoading = false, query, type = "submit" }: SearchButtonProps) {
  const { pending } = useFormStatus()
  const { theme } = useTheme()
  
  const isDisabled = pending || isLoading || !query?.trim()
  
  const lightModeStyles = {
    backgroundColor: 'transparent',         // Transparent background
    color: 'hsl(240, 10%, 12%)',           // Dark charcoal text
    borderWidth: '1px',
    borderStyle: 'solid' as const,
    borderColor: 'hsl(240, 10%, 12%)',     // Dark charcoal border
  }
  
  const darkModeStyles = {
    backgroundColor: 'transparent',         // Transparent background
    color: 'white',                         // White text
    borderWidth: '1px',
    borderStyle: 'solid' as const,
    borderColor: 'white',                   // White border
  }
  
  return (
    <Button
      type={type}
      disabled={isDisabled}
      variant="ghost"
      className="mr-2 h-10 px-6 py-2 rounded-md font-medium 
                 shadow-sm hover:shadow-md
                 disabled:opacity-60 disabled:cursor-not-allowed
                 transition-all duration-200"
      style={theme === 'dark' ? darkModeStyles : lightModeStyles}
    >
      {pending || isLoading ? (
        <span>Searching...</span>
      ) : (
        <span>Search</span>
      )}
    </Button>
  )
}
