'use client'

import { useEffect } from 'react'
import { AppShell } from '@/components/app-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { FloatingActionButton } from '@/components/ui/floating-action-button'
import { useHabitsWithStats, useToggleHabitCompletion, useInitializeSampleData } from '@/lib/hooks'
import { getGreeting, formatDate } from '@/lib/utils'
import { Flame, Plus, Timer, Target, Calendar, Play } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const { data: habits = [], isLoading } = useHabitsWithStats()
  const toggleHabitMutation = useToggleHabitCompletion()
  const initializeSampleData = useInitializeSampleData()
  
  const today = new Date().toISOString().split('T')[0]
  const userName = "Novi"
  
  // Initialize sample data on first load
  useEffect(() => {
    if (!isLoading && habits.length === 0) {
      initializeSampleData.mutate()
    }
  }, [habits.length, isLoading, initializeSampleData])

  const todayHabits = habits.filter(habit => habit.isActive)
  const completedToday = todayHabits.filter(habit => habit.todayCompleted).length
  const progressPercentage = todayHabits.length > 0 ? (completedToday / todayHabits.length) * 100 : 0
  const currentStreak = habits.reduce((max, habit) => Math.max(max, habit.currentStreak), 0)

  const handleToggleHabit = (habitId: string, date: string) => {
    toggleHabitMutation.mutate({ habitId, date })
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="space-y-6">
          {/* Loading skeleton */}
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-48" />
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-4 max-w-sm mx-auto md:max-w-4xl">
        {/* Header - Mobile First */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {userName} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {formatDate(new Date())}
          </p>
        </div>

        {/* Stats Cards - Mobile Stack */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          {/* Streak Card */}
          <Card className="border-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/50 dark:to-red-900/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Streak</p>
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {currentStreak} hari
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Hari Ini</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">{completedToday}/{todayHabits.length}</span>
                    <span className="text-gray-500">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-1.5" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Focus Card */}
          <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/50 dark:to-emerald-900/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Timer className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Focus</p>
                  <Button 
                    asChild
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-green-600 dark:text-green-400 font-medium hover:bg-transparent text-xs"
                  >
                    <Link href="/focus">
                      Mulai Timer →
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Mobile Optimized */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Button asChild size="sm" className="shrink-0 rounded-full text-xs h-8 px-3">
            <Link href="/focus" className="flex items-center gap-1.5">
              <Play className="h-3 w-3" />
              Mulai Fokus
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="shrink-0 rounded-full text-xs h-8 px-3">
            <Link href="/habits" className="flex items-center gap-1.5">
              <Plus className="h-3 w-3" />
              Tambah Habit
            </Link>
          </Button>
        </div>

        {/* Today's Habits */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Habit Hari Ini
            </h2>
            {todayHabits.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {completedToday}/{todayHabits.length}
              </Badge>
            )}
          </div>

          {todayHabits.length === 0 ? (
            /* Empty State */
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                  <Target className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-base font-medium mb-1">Belum ada habit</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
                  Mulai perjalanan produktivitasmu
                </p>
                <Button asChild size="sm">
                  <Link href="/habits">
                    <Plus className="h-3 w-3 mr-1" />
                    Buat Habit
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Habits List - Mobile Optimized */
            <div className="space-y-2">
              {todayHabits.map((habit) => (
                <Card key={habit.id} className="border shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      {/* Checkbox - Larger for mobile */}
                      <input
                        type="checkbox"
                        checked={habit.todayCompleted}
                        onChange={() => handleToggleHabit(habit.id, today)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                      />

                      {/* Habit Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {/* Icon */}
                          <div 
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                            style={{ backgroundColor: habit.color }}
                          >
                            {habit.icon.charAt(0).toUpperCase()}
                          </div>

                          {/* Name */}
                          <h3 className={`font-medium text-sm truncate ${
                            habit.todayCompleted 
                              ? "line-through text-gray-500 dark:text-gray-400" 
                              : "text-gray-900 dark:text-white"
                          }`}>
                            {habit.name}
                          </h3>

                          {/* Streak */}
                          {habit.currentStreak > 0 && (
                            <Badge variant="secondary" className="flex items-center gap-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 ml-auto flex-shrink-0">
                              <Flame className="h-2.5 w-2.5" />
                              {habit.currentStreak}
                            </Badge>
                          )}
                        </div>

                        {/* Schedule & Target - Mobile compact */}
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button - Mobile positioned */}
      <FloatingActionButton asChild position="bottom-right">
        <Link href="/focus">
          <Timer className="h-5 w-5" />
        </Link>
      </FloatingActionButton>
    </AppShell>
  )
}
