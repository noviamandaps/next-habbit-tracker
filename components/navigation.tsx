'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Home, Target, Timer, BarChart3, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  {
    href: '/',
    icon: Home,
    label: 'Home',
    id: 'home'
  },
  {
    href: '/habits',
    icon: Target, 
    label: 'Habits',
    id: 'habits'
  },
  {
    href: '/focus',
    icon: Timer,
    label: 'Focus',
    id: 'focus'
  },
  {
    href: '/progress',
    icon: BarChart3,
    label: 'Progress', 
    id: 'progress'
  },
  {
    href: '/profile',
    icon: User,
    label: 'Profile',
    id: 'profile'
  }
]

interface BottomNavigationProps {
  className?: string
}

export function BottomNavigation({ className }: BottomNavigationProps) {
  const pathname = usePathname()

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border",
      "md:hidden", // Hide on desktop
      className
    )}>
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          const Icon = item.icon
          
          return (
            <Button
              key={item.id}
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "relative flex flex-col gap-1 h-auto py-2 px-3 min-w-0 flex-1",
                "text-muted-foreground hover:text-foreground",
                isActive && "text-primary"
              )}
            >
              <Link href={item.href}>
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div
                    className="absolute -top-1 left-1/2 w-1 h-1 bg-primary rounded-full transform -translate-x-1/2"
                  />
                )}
              </Link>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}

interface DesktopSidebarProps {
  className?: string
}

export function DesktopSidebar({ className }: DesktopSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={cn(
      "hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50 bg-background border-r border-border",
      className
    )}>
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo/Brand */}
        <div className="flex items-center h-16 px-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">FocusHabit</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            const Icon = item.icon
            
            return (
              <Button
                key={item.id}
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/15"
                )}
              >
                <Link href={item.href}>
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </Button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Online</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
