"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggleButton() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Ensure the component is mounted before rendering to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 dark:bg-[#182338]/80 dark:border-white/10 dark:hover:bg-[#182338] dark:hover:border-white/20"
      >
        <Sun className="h-5 w-5 dark:text-white/90" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="h-10 w-10 dark:bg-[#182338]/80 dark:border-white/10 dark:hover:bg-[#182338] dark:hover:border-white/20"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-white/90" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
