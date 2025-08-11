'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { HabitWithStats } from '@/lib/types'
import { Flame, Edit, Archive, Trash2, MoreVertical } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface HabitCardProps {
  habit: HabitWithStats
  onToggleComplete?: (habitId: string, date: string) => void
  onEdit?: (habit: HabitWithStats) => void
  onArchive?: (habitId: string) => void
  onDelete?: (habitId: string) => void
  className?: string
  date?: string
}

export function HabitCard({
  habit,
  onToggleComplete,
  onEdit,
  onArchive,
  onDelete,
  className,
  date = new Date().toISOString().split('T')[0]
}: HabitCardProps) {
  
  const handleToggle = (checked: boolean) => {
    onToggleComplete?.(habit.id, date)
  }

  return (
    <div className={cn("animate-fade-in", className)}>
      <Card className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-md active:scale-95",
        habit.todayCompleted && "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
      )}>
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {/* Checkbox - Mobile optimized */}
            <input
              type="checkbox"
              checked={habit.todayCompleted}
              onChange={(e) => handleToggle(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 touch-manipulation"
            />

            {/* Habit Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {/* Icon */}
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: habit.color }}
                >
                  {habit.icon.charAt(0).toUpperCase()}
                </div>

                {/* Name */}
                <h3 className={cn(
                  "font-medium text-sm truncate",
                  habit.todayCompleted && "line-through text-gray-500 dark:text-gray-400"
                )}>
                  {habit.name}
                </h3>

                {/* Streak */}
                {habit.currentStreak > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 ml-auto">
                    <Flame className="h-2.5 w-2.5" />
                    {habit.currentStreak}
                  </Badge>
                )}
              </div>

              {/* Schedule & Target */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <span className="capitalize">{habit.schedule}</span>
                {habit.target > 1 && (
                  <>
                    <span>•</span>
                    <span>{habit.target}x</span>
                  </>
                )}
                {habit.completionRate > 0 && (
                  <>
                    <span>•</span>
                    <span>{Math.round(habit.completionRate)}%</span>
                  </>
                )}
              </div>
            </div>

            {/* Actions Menu - Mobile optimized */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 touch-manipulation">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={() => onEdit?.(habit)} className="text-sm">
                  <Edit className="h-3 w-3 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onArchive?.(habit.id)} className="text-sm">
                  <Archive className="h-3 w-3 mr-2" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(habit.id)}
                  className="text-red-600 focus:text-red-600 text-sm"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
