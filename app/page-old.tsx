'use client'

import { useEffect } from 'react'
import { AppShell } from '@/components/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { HabitCard } from '@/components/habit-card'
import { FloatingActionButton } from '@/components/ui/floating-action-button'
import { useHabitsWithStats, useToggleHabitCompletion, useInitializeSampleData } from '@/lib/hooks'
import { getGreeting, formatDate } from '@/lib/utils'
import { Flame, Plus, Timer, Target, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const { data: habits = [], isLoading } = useHabitsWithStats()
  const toggleHabitMutation = useToggleHabitCompletion()
  const initializeSampleData = useInitializeSampleData()
  
  const today = new Date().toISOString().split('T')[0]
  const userName = "Novi" // This would come from user preferences
  
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
      <AppShell title="FocusHabit">
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Greeting Header */}
        <motion.div variants={item} className="text-center md:text-left">
          <h1 className="text-2xl font-bold mb-1">
            {getGreeting()}, {userName} 👋
          </h1>
          <p className="text-muted-foreground">
            {formatDate(new Date())}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current Streak */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Streak Terpanjang</p>
                  <p className="text-2xl font-bold">{currentStreak} hari</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Progress */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Hari Ini</p>
                  <p className="text-2xl font-bold">{completedToday}/{todayHabits.length}</p>
                  <Progress value={progressPercentage} className="mt-2 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Focus Session */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                  <Timer className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Focus Session</p>
                  <Button asChild size="sm" variant="ghost" className="h-auto p-0 text-base font-bold">
                    <Link href="/focus">Mulai Fokus</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Habits */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Habit Hari Ini</h2>
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              {Math.round(progressPercentage)}%
            </Badge>
          </div>

          {todayHabits.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">Belum ada habit</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Mulai perjalanan produktivitas dengan membuat habit pertama
                </p>
                <Button asChild>
                  <Link href="/habits">Buat Habit Pertama</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {todayHabits.map((habit, index) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <HabitCard
                    habit={habit}
                    onToggleComplete={handleToggleHabit}
                    date={today}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        {todayHabits.length > 0 && (
          <motion.div variants={item} className="grid grid-cols-2 gap-3">
            <Button asChild variant="outline" className="h-12">
              <Link href="/habits" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Kelola Habits
              </Link>
            </Button>
            <Button asChild className="h-12">
              <Link href="/focus" className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Mulai Fokus
              </Link>
            </Button>
          </motion.div>
        )}

        {/* Floating Action Button */}
        <FloatingActionButton onClick={() => window.location.href = '/habits'}>
          <Plus className="h-6 w-6" />
        </FloatingActionButton>
      </motion.div>
    </AppShell>
  )
}
