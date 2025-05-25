"use client"

import packageJson from "../package.json"

export function Footer() {
  return (
    <footer className="py-2 text-xs text-muted-foreground dark:text-white/60 bg-white/30 dark:bg-gray-900/30 border-t border-border/20 dark:border-white/5 sticky bottom-0 left-0 right-0 z-10 backdrop-blur-md shadow-sm">
      <div className="container text-center">
        <div className="flex items-center justify-center">
          <span>Cognito AI Search v{packageJson.version} - {new Date().getFullYear()} - Vibe coded by kekePower with ❤️ and Windsurf. Licensed under <a href="https://github.com/kekePower/cognito-ai-search/blob/main/LICENSE" className="text-blue-500 dark:text-blue-400 hover:underline">MIT</a>.</span>
        </div>
      </div>
    </footer>
  )
}
