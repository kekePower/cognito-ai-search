import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl"
  text?: string
  centered?: boolean
  overlay?: boolean
}

const LoadingSpinner = React.forwardRef<
  HTMLDivElement,
  LoadingSpinnerProps
>(({ 
  size = "md",
  text,
  centered = true,
  overlay = false,
  className,
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8", 
    xl: "h-12 w-12"
  }
  
  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl"
  }
  
  const content = (
    <div className={cn(
      "flex items-center gap-3",
      centered && "justify-center",
      className
    )}>
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {text && (
        <span className={cn("text-muted-foreground", textSizeClasses[size])}>
          {text}
        </span>
      )}
    </div>
  )
  
  if (overlay) {
    return (
      <div
        ref={ref}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        {...props}
      >
        {content}
      </div>
    )
  }
  
  return (
    <div
      ref={ref}
      className={cn(centered && "flex items-center justify-center")}
      {...props}
    >
      {content}
    </div>
  )
})

LoadingSpinner.displayName = "LoadingSpinner"

export { LoadingSpinner, type LoadingSpinnerProps }
