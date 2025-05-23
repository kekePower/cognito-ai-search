"use client"

import Link from "next/link"
import { Sparkles, Github, BookOpen } from "lucide-react"
import { ThemeToggleButton } from "@/components/theme-toggle-button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center space-x-2"
            onClick={() => {
              // Clear any cached search state when clicking the logo
              window.history.replaceState({}, '', '/')
              // Clear localStorage cache for the current session
              localStorage.removeItem('currentSearchQuery')
            }}
          >
            <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-lg hidden sm:inline-block text-gray-900 dark:text-white">Cognito AI Search</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link 
            href="/how-it-works" 
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="h-4 w-4" />
            <span>How It Works</span>
          </Link>
          <a 
            href="https://github.com/kekePower/cognito-ai-search"
            target="_blank"
            rel="noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  )
}
