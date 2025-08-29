'use client'

import { cn } from '@/lib/utils'
import { Header } from './header'
import { BottomNavigation, DesktopSidebar } from './navigation'
import { memo } from 'react'

interface AppShellProps {
  children: React.ReactNode
  title?: string
  showBack?: boolean
  showNotifications?: boolean
  headerChildren?: React.ReactNode
  className?: string
}

export const AppShell = memo(function AppShell({
  children,
  title,
  showBack = false,
  showNotifications = true,
  headerChildren,
  className
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content */}
      <div className="md:pl-64">
        <Header 
          title={title}
          showBack={showBack}
          showNotifications={showNotifications}
        >
          {headerChildren}
        </Header>

        <main className={cn(
          "px-4 py-4",
          "pb-20 md:pb-6", // Extra padding bottom for mobile nav
          "min-h-[calc(100vh-4rem)]", // Full height minus header
          className
        )}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
})
