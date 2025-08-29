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
      "fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700",
      "md:hidden", // Hide on desktop
      className
    )}>
      <div className="flex items-center justify-around px-1 py-1 safe-area-pb">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          const Icon = item.icon
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-2 min-w-0 flex-1 rounded-lg transition-colors touch-manipulation",
                "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",
                isActive && "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-xs font-medium truncate">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full transform -translate-x-1/2" />
              )}
            </Link>
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
      "hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700",
      className
    )}>
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo/Brand */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
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
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 h-11 px-3 rounded-lg transition-colors touch-manipulation",
                  "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800",
                  isActive && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Online</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
