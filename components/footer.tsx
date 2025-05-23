"use client"

export function Footer() {
  return (
    <footer className="py-2 text-xs text-muted-foreground dark:text-white/60 bg-background/100 dark:bg-[#0B1120]/95 border-t border-border/40 dark:border-white/10 sticky bottom-0 left-0 right-0 z-10 backdrop-blur-sm shadow-sm">
      <div className="container text-center">
        <div className="flex items-center justify-center">
          <span>2025 - Vibe coded by kekePower with ❤️ and Windsurf. Licensed under <a href="https://github.com/kekePower/cognito-ai-search/blob/main/LICENSE" className="text-blue-500 dark:text-blue-400 hover:underline">MIT</a>.</span>
        </div>
      </div>
    </footer>
  )
}
