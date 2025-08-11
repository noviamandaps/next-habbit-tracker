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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {userName} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            {formatDate(new Date())}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Streak Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900 dark:to-red-900">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-800">
                  <Flame className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Streak Terbaik</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-300">
                    {currentStreak} hari
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Hari Ini</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">{completedToday}/{todayHabits.length} selesai</span>
                    <span className="text-gray-600 dark:text-gray-400">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 bg-blue-100 dark:bg-blue-800" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Focus Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-800">
                  <Timer className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Fokus Sesi</p>
                  <Button 
                    asChild
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-green-600 dark:text-green-300 font-bold hover:bg-transparent"
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

        {/* Quick Actions */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          <Button asChild size="sm" className="shrink-0 rounded-full bg-blue-600 hover:bg-blue-700">
            <Link href="/focus" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Mulai Fokus
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="shrink-0 rounded-full border-gray-300 hover:bg-gray-50">
            <Link href="/habits" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Habit
            </Link>
          </Button>
        </div>

        {/* Today's Habits */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <Calendar className="h-5 w-5" />
              Habit Hari Ini
            </h2>
            {todayHabits.length > 0 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                {completedToday}/{todayHabits.length}
              </Badge>
            )}
          </div>

          {todayHabits.length === 0 ? (
            /* Empty State */
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
              <CardContent className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Belum ada habit</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  Mulai perjalanan produktivitasmu dengan membuat habit pertama
                </p>
                <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/habits">
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Habit Pertama
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Habits List */
            <div className="space-y-3">
              {todayHabits.map((habit) => (
                <div key={habit.id} className="transform transition-all duration-200 hover:scale-[1.02]">
                  <HabitCard
                    habit={habit}
                    onToggleComplete={handleToggleHabit}
                    date={today}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton asChild>
        <Link href="/focus">
          <Timer className="h-6 w-6" />
        </Link>
      </FloatingActionButton>
    </AppShell>
  )
}
