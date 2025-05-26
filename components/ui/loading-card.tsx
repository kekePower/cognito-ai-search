import * as React from "react"
import { Card, CardHeader, CardContent, CardFooter } from "./card"
import { Skeleton } from "./skeleton"
import { cn } from "@/lib/utils"

interface LoadingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  showHeader?: boolean
  showFooter?: boolean
  headerHeight?: "sm" | "md" | "lg"
  contentLines?: number
  footerHeight?: "sm" | "md" | "lg"
}

const LoadingCard = React.forwardRef<
  HTMLDivElement,
  LoadingCardProps
>(({ 
  showHeader = true,
  showFooter = false,
  headerHeight = "md",
  contentLines = 3,
  footerHeight = "sm",
  className,
  ...props 
}, ref) => {
  const headerHeights = {
    sm: "h-4",
    md: "h-6", 
    lg: "h-8"
  }
  
  const footerHeights = {
    sm: "h-4",
    md: "h-6",
    lg: "h-8"
  }
  
  return (
    <Card ref={ref} className={cn("", className)} {...props}>
      {showHeader && (
        <CardHeader className="pb-2">
          <Skeleton className={cn(headerHeights[headerHeight], "w-32")} />
        </CardHeader>
      )}
      
      <CardContent>
        <div className="space-y-2">
          {Array.from({ length: contentLines }).map((_, i) => (
            <Skeleton 
              key={i}
              className={cn(
                "h-4",
                i === contentLines - 1 ? "w-3/4" : "w-full"
              )} 
            />
          ))}
        </div>
      </CardContent>
      
      {showFooter && (
        <CardFooter>
          <Skeleton className={cn(footerHeights[footerHeight], "w-24")} />
        </CardFooter>
      )}
    </Card>
  )
})

LoadingCard.displayName = "LoadingCard"

export { LoadingCard, type LoadingCardProps }
