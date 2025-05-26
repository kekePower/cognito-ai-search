import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "strong"
  blur?: "sm" | "md" | "lg"
}

const GlassPanel = React.forwardRef<
  HTMLDivElement,
  GlassPanelProps
>(({ 
  variant = "default", 
  blur = "md",
  className, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-background/80 border border-border/50",
    subtle: "bg-background/60 border border-border/30",
    strong: "bg-background/90 border border-border/70"
  }
  
  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md", 
    lg: "backdrop-blur-lg"
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "glass-panel",
        variants[variant],
        blurClasses[blur],
        "rounded-lg shadow-sm",
        className
      )}
      {...props}
    />
  )
})

GlassPanel.displayName = "GlassPanel"

export { GlassPanel, type GlassPanelProps }
