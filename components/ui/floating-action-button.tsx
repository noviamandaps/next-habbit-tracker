'use client'

import { cn } from '@/lib/utils'
import { Button, ButtonProps } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface FloatingActionButtonProps extends ButtonProps {
  icon?: React.ReactNode
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left'
  asChild?: boolean
}

export function FloatingActionButton({
  icon = <Plus className="h-6 w-6" />,
  position = 'bottom-right',
  className,
  children,
  asChild = false,
  ...props
}: FloatingActionButtonProps) {
  const positionClasses = {
    'bottom-right': 'bottom-20 right-4 md:bottom-6 md:right-6',
    'bottom-center': 'bottom-20 left-1/2 transform -translate-x-1/2 md:bottom-6',
    'bottom-left': 'bottom-20 left-4 md:bottom-6 md:left-6'
  }

  if (asChild) {
    return (
      <div
        className={cn(
          "fixed z-50",
          "h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground",
          "hover:shadow-xl transition-all duration-200",
          "flex items-center justify-center",
          "active:scale-95 hover:scale-105",
          "touch-manipulation",
          positionClasses[position],
          className
        )}
      >
        {children || icon}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "fixed z-50",
        positionClasses[position]
      )}
    >
      <Button
        {...props}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground",
          "hover:shadow-xl transition-all duration-200",
          "active:scale-95 hover:scale-105",
          "touch-manipulation",
          className
        )}
      >
        {children || icon}
      </Button>
    </div>
  )
}
