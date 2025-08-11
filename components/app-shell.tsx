'use client'

import { cn } from '@/lib/utils'
import { Header } from './header'
import { BottomNavigation, DesktopSidebar } from './navigation'

interface AppShellProps {
  children: React.ReactNode
  title?: string
  showBack?: boolean
  showNotifications?: boolean
  headerChildren?: React.ReactNode
  className?: string
}

export function AppShell({
  children,
  title,
  showBack = false,
  showNotifications = true,
  headerChildren,
  className
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
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
          "container mx-auto px-4 py-6",
          "pb-20 md:pb-6", // Extra padding bottom for mobile nav
          className
        )}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
