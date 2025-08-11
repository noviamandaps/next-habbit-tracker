'use client'

import { useState, useMemo } from 'react'
import { AppShell } from '@/components/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useHabitsWithStats, useHabitLogs, usePomodoroSessions } from '@/lib/hooks'
import { calculateStreak, formatDate } from '@/lib/utils'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  Flame, 
  Target, 
  Calendar,
  Award,
  Download,
  Share,
  Filter,
  ChevronUp,
  ChevronDown
} from 'lucide-react'

type TimeRange = 'week' | 'month' | '90days'

export default function ProgressPage() {
  const { data: habits = [] } = useHabitsWithStats()
  const { data: allLogs = [] } = useHabitLogs()
  const { data: sessions = [] } = usePomodoroSessions()
  
  const [timeRange, setTimeRange] = useState<TimeRange>('week')
  const [selectedHabitId, setSelectedHabitId] = useState<string>('all')
  
  // Calculate date range
  const endDate = new Date()
  const startDate = new Date()
  
  switch (timeRange) {
    case 'week':
      startDate.setDate(endDate.getDate() - 7)
      break
    case 'month':
      startDate.setMonth(endDate.getMonth() - 1)
      break
    case '90days':
      startDate.setDate(endDate.getDate() - 90)
      break
  }
  
  // Filter data
  const filteredLogs = allLogs.filter(log => {
    const logDate = new Date(log.date)
    const inRange = logDate >= startDate && logDate <= endDate
    const matchesHabit = selectedHabitId === 'all' || log.habitId === selectedHabitId
    return inRange && matchesHabit
  })
  
  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.startedAt)
    return sessionDate >= startDate && sessionDate <= endDate
  })
  
  // Calculate stats
  const totalCompletions = filteredLogs.filter(log => log.completed).length
  const totalPossible = filteredLogs.length
  const completionRate = totalPossible > 0 ? (totalCompletions / totalPossible) * 100 : 0
  
  const longestStreak = Math.max(...habits.map(h => h.currentStreak), 0)
  const totalFocusMinutes = filteredSessions.reduce((sum, session) => sum + session.actualMinutes, 0)
  
  // Prepare chart data
  const chartData = useMemo(() => {
    const days = []
    const current = new Date(startDate)
    
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0]
      const dayLogs = filteredLogs.filter(log => log.date === dateStr)
      const completedCount = dayLogs.filter(log => log.completed).length
      const totalCount = dayLogs.length
      
      days.push({
        date: dateStr,
        day: current.toLocaleDateString('id-ID', { weekday: 'short' }),
        completed: completedCount,
        total: totalCount,
        rate: totalCount > 0 ? (completedCount / totalCount) * 100 : 0
      })
      
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }, [filteredLogs, startDate, endDate])
  
  // Top performing habits
  const topHabits = habits
    .filter(h => h.isActive && h.totalCompletions > 0)
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 5)
  
  // Habit distribution
  const habitDistribution = habits.reduce((acc, habit) => {
    const category = habit.category
    const existing = acc.find(item => item.category === category)
    if (existing) {
      existing.count += 1
    } else {
      acc.push({ category, count: 1 })
    }
    return acc
  }, [] as { category: string; count: number }[])
  
  const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981']

  return (
    <AppShell>
      <div className="space-y-4 max-w-sm mx-auto md:max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Progress & Analitik
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Lihat perkembangan habit kamu
          </p>
        </div>

        {/* Filters - Mobile Optimized */}
        <div className="space-y-3">
          <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
              <TabsTrigger value="week" className="text-xs py-2">Minggu</TabsTrigger>
              <TabsTrigger value="month" className="text-xs py-2">Bulan</TabsTrigger>
              <TabsTrigger value="90days" className="text-xs py-2">90 Hari</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Select value={selectedHabitId} onValueChange={setSelectedHabitId}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Habit</SelectItem>
              {habits.filter(h => h.isActive).map((habit) => (
                <SelectItem key={habit.id} value={habit.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: habit.color }}
                    />
                    <span className="text-xs">{habit.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats Overview - Mobile Grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <Card>
            <CardContent className="p-3">
              <div className="text-center space-y-1">
                <div className="w-8 h-8 mx-auto rounded-lg bg-blue-500 flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Rate</p>
                <p className="text-lg font-bold">{Math.round(completionRate)}%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="text-center space-y-1">
                <div className="w-8 h-8 mx-auto rounded-lg bg-orange-500 flex items-center justify-center">
                  <Flame className="h-4 w-4 text-white" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Streak</p>
                <p className="text-lg font-bold">{longestStreak}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="text-center space-y-1">
                <div className="w-8 h-8 mx-auto rounded-lg bg-green-500 flex items-center justify-center">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Selesai</p>
                <p className="text-lg font-bold">{totalCompletions}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="text-center space-y-1">
                <div className="w-8 h-8 mx-auto rounded-lg bg-purple-500 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Fokus</p>
                <p className="text-lg font-bold">{totalFocusMinutes}m</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Completion Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tingkat Penyelesaian
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, 'Completion Rate']}
                    labelFormatter={(label) => `Hari: ${label}`}
                  />
                  <Bar 
                    dataKey="rate" 
                    fill="#6366F1"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Belum ada data untuk ditampilkan</p>
                  <p className="text-sm">Mulai menyelesaikan habit untuk melihat progress</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Habits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>🏆 Habit Terbaik</CardTitle>
            </CardHeader>
            <CardContent>
              {topHabits.length > 0 ? (
                <div className="space-y-4">
                  {topHabits.map((habit, index) => (
                    <div
                      key={habit.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-lg font-bold text-muted-foreground">
                          #{index + 1}
                        </div>
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                          style={{ backgroundColor: habit.color }}
                        >
                          {habit.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{habit.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {habit.totalCompletions} kali selesai
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {Math.round(habit.completionRate)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Belum ada data habit</p>
                  <p className="text-sm">Selesaikan beberapa habit untuk melihat ranking</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Habit Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Distribusi Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              {habitDistribution.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={habitDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ category, count }) => `${category}: ${count}`}
                      >
                        {habitDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {habitDistribution.map((item, index) => (
                      <div key={item.category} className="flex items-center gap-2 text-sm">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="capitalize">{item.category}</span>
                        <span className="text-muted-foreground">({item.count})</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Belum ada habit</p>
                  <p className="text-sm">Buat habit untuk melihat distribusi kategori</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Export Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Export Data</h3>
                <p className="text-sm text-muted-foreground">
                  Download atau bagikan progress kamu
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empty State for no data */}
        {totalCompletions === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 flex items-center justify-center">
              <TrendingUp className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Belum ada data</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Rajin dulu 3 hari ya 😉<br />
              Progress kamu akan muncul di sini setelah menyelesaikan beberapa habit
            </p>
            <Button asChild>
              <a href="/habits">Mulai Sekarang</a>
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  )
}
