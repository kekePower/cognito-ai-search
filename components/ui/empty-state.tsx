import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "ghost"
  }
  size?: "sm" | "md" | "lg"
}

const EmptyState = React.forwardRef<
  HTMLDivElement,
  EmptyStateProps
>(({ 
  icon,
  title,
  description,
  action,
  size = "md",
  className,
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: {
      container: "py-8",
      icon: "h-8 w-8",
      title: "text-lg font-medium",
      description: "text-sm text-muted-foreground",
      spacing: "space-y-2"
    },
    md: {
      container: "py-12", 
      icon: "h-12 w-12",
      title: "text-xl font-semibold",
      description: "text-base text-muted-foreground",
      spacing: "space-y-3"
    },
    lg: {
      container: "py-16",
      icon: "h-16 w-16", 
      title: "text-2xl font-bold",
      description: "text-lg text-muted-foreground",
      spacing: "space-y-4"
    }
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        sizeClasses[size].container,
        className
      )}
      {...props}
    >
      <div className={cn("flex flex-col items-center", sizeClasses[size].spacing)}>
        {icon && (
          <div className={cn(
            "flex items-center justify-center rounded-full bg-muted p-3"
          )}>
            {React.isValidElement(icon) 
              ? React.cloneElement(icon as React.ReactElement<any>, {
                  className: cn("text-muted-foreground", sizeClasses[size].icon, (icon.props as any)?.className)
                })
              : icon
            }
          </div>
        )}
        
        <div className="space-y-2">
          <h3 className={sizeClasses[size].title}>
            {title}
          </h3>
          {description && (
            <p className={cn(sizeClasses[size].description, "max-w-md")}>
              {description}
            </p>
          )}
        </div>
        
        {action && (
          <Button
            variant={action.variant || "default"}
            onClick={action.onClick}
            className="mt-4"
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
})

EmptyState.displayName = "EmptyState"

export { EmptyState, type EmptyStateProps }
