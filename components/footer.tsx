"use client"

export function Footer() {
  return (
    <footer className="py-2 text-xs text-muted-foreground bg-background/100 border-t border-border/40 sticky bottom-0 left-0 right-0 z-10 backdrop-blur-sm shadow-sm">
      <div className="container flex justify-between items-center">
        <div>
          2025 - Vibe coded by kekePower with ❤️ and Windsurf. Licensed under <a href="https://github.com/kekePower/cognito-ai-search/blob/main/LICENSE" className="text-blue-500 hover:underline">MIT</a>.
        </div>
        <div>
          <a 
            href="https://github.com/kekePower/cognito-ai-search"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:underline"
          >
            GitHub Repository
          </a>
        </div>
      </div>
    </footer>
  )
}
