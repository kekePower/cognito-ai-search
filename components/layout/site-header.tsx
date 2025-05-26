"use client"

import Link from "next/link"
import { Diamond, Github, BookOpen, FileText, Zap } from "lucide-react"
import { ThemeToggleButton } from "@/components/theme-toggle-button"

export function SiteHeader() {
  return (
    <header className="glass-panel backdrop-blur-md sticky top-0 z-50 w-full border-b border-primary/20 overflow-hidden">
      {/* Holographic accent line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
      
      <div className="w-full flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center space-x-3 group"
            onClick={() => {
              // Clear any cached search state when clicking the logo
              window.history.replaceState({}, '', '/')
              // Clear localStorage cache for the current session
              localStorage.removeItem('currentSearchQuery')
            }}
          >
            <div className="relative">
              <Diamond className="h-6 w-6 text-primary group-hover:text-primary/80 transition-colors duration-200" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm group-hover:blur-md transition-all duration-200"></div>
            </div>
            <span className="font-bold text-lg hidden sm:inline-block bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--neon-magenta))] to-[hsl(var(--neon-blue))] bg-clip-text text-transparent">
              Cognito AI Search
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link 
            href="/how-it-works" 
            className="group relative px-4 py-2 text-foreground hover:text-accent transition-all duration-300 flex items-center gap-2 rounded-lg overflow-hidden"
          >
            {/* Glass background that fades in on hover */}
            <div className="absolute inset-0 glass-panel opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg border border-primary/0 group-hover:border-primary/20"></div>
            
            {/* Cognito glint animation - the sweep effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-[glint-sweep_1.5s_ease-out]"></div>
            
            {/* Sharp neon border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg"></div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg shadow-lg shadow-primary/0 group-hover:shadow-primary/20"></div>
            
            <BookOpen className="h-4 w-4 relative z-10" />
            <span className="hidden md:inline relative z-10 group-hover:font-semibold transition-all duration-300">Neural Guide</span>
          </Link>
          <Link 
            href="/documentation" 
            className="group relative px-4 py-2 text-foreground hover:text-accent transition-all duration-300 flex items-center gap-2 rounded-lg overflow-hidden"
          >
            {/* Glass background that fades in on hover */}
            <div className="absolute inset-0 glass-panel opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg border border-primary/0 group-hover:border-primary/20"></div>
            
            {/* Cognito glint animation - the sweep effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-[glint-sweep_1.5s_ease-out]"></div>
            
            {/* Sharp neon border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg"></div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg shadow-lg shadow-primary/0 group-hover:shadow-primary/20"></div>
            
            <FileText className="h-4 w-4 relative z-10" />
            <span className="hidden md:inline relative z-10 group-hover:font-semibold transition-all duration-300">Codex</span>
          </Link>
          <a 
            href="https://github.com/kekePower/cognito-ai-search"
            target="_blank"
            rel="noreferrer"
            className="group relative px-4 py-2 text-foreground hover:text-accent transition-all duration-300 flex items-center gap-2 rounded-lg overflow-hidden"
          >
            {/* Glass background that fades in on hover */}
            <div className="absolute inset-0 glass-panel opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg border border-primary/0 group-hover:border-primary/20"></div>
            
            {/* Cognito glint animation - the sweep effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-[glint-sweep_1.5s_ease-out]"></div>
            
            {/* Sharp neon border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg"></div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg shadow-lg shadow-primary/0 group-hover:shadow-primary/20"></div>
            
            <Github className="h-4 w-4 relative z-10" />
            <span className="hidden md:inline relative z-10 group-hover:font-semibold transition-all duration-300">Source</span>
          </a>
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  )
}
