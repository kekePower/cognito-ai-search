"use client"

import packageJson from "../package.json"

export function Footer() {
  return (
    <footer className="glass-panel backdrop-blur-md py-4 text-xs text-secondary border-t border-cyan-400/20 sticky bottom-0 left-0 right-0 z-10 overflow-hidden">
      {/* Holographic accent line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>
      
      <div className="container text-center">
        <div className="flex items-center justify-center">
          <span>
            Cognito AI Search v{packageJson.version} - {new Date().getFullYear()} - 
            <span className="text-primary mx-1">Vibe coded by kekePower</span> 
            with <span className="text-red-400">❤️</span> and 
            <span className="text-primary mx-1">Windsurf</span>. 
            Licensed under <a href="https://github.com/kekePower/cognito-ai-search/blob/main/LICENSE" className="text-primary hover:text-primary/80 transition-colors duration-200 underline decoration-primary/50">MIT</a>.
          </span>
        </div>
      </div>
    </footer>
  )
}
