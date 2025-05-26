import * as React from "react"
import { cn } from "@/lib/utils"

interface IconTextProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode
  children: React.ReactNode
  iconPosition?: "left" | "right" | "top"
  gap?: "1" | "2" | "3" | "4"
  align?: "start" | "center" | "end"
  iconSize?: "sm" | "md" | "lg"
}

const IconText = React.forwardRef<
  HTMLDivElement,
  IconTextProps
>(({ 
  icon,
  children,
  iconPosition = "left",
  gap = "2",
  align = "center",
  iconSize = "md",
  className,
  ...props 
}, ref) => {
  const gapClasses = {
    "1": "gap-1",
    "2": "gap-2", 
    "3": "gap-3",
    "4": "gap-4"
  }
  
  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end"
  }
  
  const iconSizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  }
  
  const flexDirection = iconPosition === "top" ? "flex-col" : "flex-row"
  const reverseOrder = iconPosition === "right" ? "flex-row-reverse" : ""
  
  const iconElement = React.isValidElement(icon) 
    ? React.cloneElement(icon as React.ReactElement<any>, {
        className: cn(iconSizeClasses[iconSize], (icon.props as any)?.className)
      })
    : icon
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex",
        flexDirection,
        reverseOrder,
        alignClasses[align],
        gapClasses[gap],
        className
      )}
      {...props}
    >
      <div className="flex-shrink-0">
        {iconElement}
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
})

IconText.displayName = "IconText"

export { IconText, type IconTextProps }
