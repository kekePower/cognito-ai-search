"use client"

import * as React from "react"
import { Moon, Sun, Zap } from "lucide-react"
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
        className="h-10 w-10 glass-panel shard neon-border bg-transparent hover:bg-hsl(var(--glass-bg)/0.2) transition-all duration-300"
      >
        <Zap className="h-5 w-5 text-primary" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="h-10 w-10 glass-panel shard neon-border bg-transparent hover:bg-hsl(var(--glass-bg)/0.2) transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-primary group-hover:text-primary/80 transition-colors duration-300" />
      ) : (
        <Sun className="h-5 w-5 text-primary group-hover:text-primary/80 transition-colors duration-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
