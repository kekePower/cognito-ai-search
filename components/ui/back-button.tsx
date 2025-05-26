import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { IconButton, IconButtonProps } from "./icon-button"

interface BackButtonProps extends Omit<IconButtonProps, "icon" | "children"> {
  href: string
  children?: React.ReactNode
}

const BackButton = React.forwardRef<
  HTMLButtonElement,
  BackButtonProps
>(({ 
  href, 
  children = "Back to Search",
  variant = "ghost",
  size = "sm",
  gap = "1",
  className,
  ...props 
}, ref) => {
  return (
    <Link href={href}>
      <IconButton
        ref={ref}
        variant={variant}
        size={size}
        gap={gap}
        icon={<ArrowLeft className="h-4 w-4" />}
        className={className}
        {...props}
      >
        {children}
      </IconButton>
    </Link>
  )
})

BackButton.displayName = "BackButton"

export { BackButton, type BackButtonProps }
