"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { ThemeToggleButton } from "@/components/theme-toggle-button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-6">
          <Link 
            href="/" 
            className="flex items-center space-x-2"
            onClick={() => {
              // Clear any cached search state when clicking the logo
              window.history.replaceState({}, '', '/')
            }}
          >
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg hidden sm:inline-block">Cognito AI Search</span>
          </Link>
          <Link 
            href="/how-it-works" 
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  )
}
