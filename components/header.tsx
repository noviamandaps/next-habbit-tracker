'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Bell, Settings, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  title?: string
  showBack?: boolean
  showNotifications?: boolean
  className?: string
  children?: React.ReactNode
}

export function Header({ 
  title, 
  showBack = false, 
  showNotifications = true,
  className,
  children 
}: HeaderProps) {
  const router = useRouter()

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-9 w-9"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          
          {title && (
            <h1 className="text-lg font-semibold truncate">{title}</h1>
          )}
          
          {children}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {showNotifications && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 relative"
            >
              <Bell className="h-5 w-5" />
              {/* Notification badge */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </Button>
          )}
          
          <Button
            asChild
            variant="ghost" 
            size="icon"
            className="h-9 w-9"
          >
            <Link href="/profile">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
