import * as React from "react"
import { Button, ButtonProps } from "./button"
import { cn } from "@/lib/utils"

interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode
  children: React.ReactNode
  iconPosition?: "left" | "right"
  gap?: "1" | "2" | "3" | "4"
}

const IconButton = React.forwardRef<
  HTMLButtonElement,
  IconButtonProps
>(({ 
  icon, 
  children, 
  iconPosition = "left", 
  gap = "2",
  className, 
  ...props 
}, ref) => {
  const gapClass = `gap-${gap}`
  
  return (
    <Button
      ref={ref}
      className={cn("flex items-center", gapClass, className)}
      {...props}
    >
      {iconPosition === "left" && icon}
      {children}
      {iconPosition === "right" && icon}
    </Button>
  )
})

IconButton.displayName = "IconButton"

export { IconButton, type IconButtonProps }
