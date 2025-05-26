import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl"
  align?: "left" | "center" | "right"
}

const SectionHeader = React.forwardRef<
  HTMLDivElement,
  SectionHeaderProps
>(({ 
  title,
  subtitle,
  icon,
  action,
  size = "md",
  align = "left",
  className,
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: {
      title: "text-lg font-semibold",
      subtitle: "text-sm text-muted-foreground",
      gap: "gap-2"
    },
    md: {
      title: "text-xl font-semibold", 
      subtitle: "text-base text-muted-foreground",
      gap: "gap-3"
    },
    lg: {
      title: "text-2xl font-bold",
      subtitle: "text-lg text-muted-foreground", 
      gap: "gap-4"
    },
    xl: {
      title: "text-3xl md:text-4xl font-bold tracking-tight",
      subtitle: "text-xl text-muted-foreground",
      gap: "gap-4"
    }
  }
  
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  }
  
  const flexAlignClasses = {
    left: "justify-start",
    center: "justify-center", 
    right: "justify-end"
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-start",
        action ? "justify-between" : flexAlignClasses[align],
        className
      )}
      {...props}
    >
      <div className={cn("flex items-start", sizeClasses[size].gap)}>
        {icon && (
          <div className="flex-shrink-0 mt-1">
            {icon}
          </div>
        )}
        
        <div className={cn("space-y-1", alignClasses[align])}>
          <h2 className={cn(sizeClasses[size].title, "text-primary")}>
            {title}
          </h2>
          {subtitle && (
            <p className={sizeClasses[size].subtitle}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  )
})

SectionHeader.displayName = "SectionHeader"

export { SectionHeader, type SectionHeaderProps }
