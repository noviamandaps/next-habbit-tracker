import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { HabitStorage } from './storage'
import { Habit, HabitLog, PomodoroSession, UserPreferences, HabitWithStats } from './types'
import { calculateStreak } from './utils'
import { toast } from 'sonner'
import { useMemo } from 'react'

// Query Keys
export const QUERY_KEYS = {
  HABITS: ['habits'],
  HABIT_LOGS: ['habitLogs'],
  POMODORO_SESSIONS: ['pomodoroSessions'],
  USER_PREFERENCES: ['userPreferences'],
  HABITS_WITH_STATS: ['habitsWithStats']
} as const

// Habits
export function useHabits() {
  return useQuery({
    queryKey: QUERY_KEYS.HABITS,
    queryFn: HabitStorage.getHabits,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (cacheTime)
  })
}

export function useHabitsWithStats() {
  const habitsQuery = useHabits()
  const logsQuery = useHabitLogs()
  
  return useQuery({
    queryKey: QUERY_KEYS.HABITS_WITH_STATS,
    queryFn: async (): Promise<HabitWithStats[]> => {
      const habits = habitsQuery.data || []
      const allLogs = logsQuery.data || []
      const today = new Date().toISOString().split('T')[0]
      
      return habits.map(habit => {
        const habitLogs = allLogs.filter(log => log.habitId === habit.id)
        const todayLog = habitLogs.find(log => log.date === today)
        const completedLogs = habitLogs.filter(log => log.completed)
        
        return {
          ...habit,
          todayCompleted: todayLog?.completed || false,
          currentStreak: calculateStreak(habitLogs.map(log => ({ date: log.date, done: log.completed }))),
          totalCompletions: completedLogs.length,
          completionRate: habitLogs.length > 0 ? (completedLogs.length / habitLogs.length) * 100 : 0
        }
      })
    },
    enabled: habitsQuery.isSuccess && logsQuery.isSuccess,
    staleTime: 1000 * 60 * 1, // 1 minute
  })
}

export function useSaveHabit() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: HabitStorage.saveHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HABITS })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HABITS_WITH_STATS })
      toast.success('Habit berhasil disimpan!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menyimpan habit')
    }
  })
}

export function useDeleteHabit() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: HabitStorage.deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HABITS })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HABITS_WITH_STATS })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HABIT_LOGS })
      toast.success('Habit berhasil dihapus!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menghapus habit')
    }
  })
}

// Habit Logs
export function useHabitLogs(habitId?: string) {
  return useQuery({
    queryKey: habitId ? [...QUERY_KEYS.HABIT_LOGS, habitId] : QUERY_KEYS.HABIT_LOGS,
    queryFn: () => HabitStorage.getHabitLogs(habitId),
    staleTime: 1000 * 60 * 1, // 1 minute
  })
}

export function useToggleHabitCompletion() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ habitId, date }: { habitId: string; date: string }) =>
      HabitStorage.toggleHabitCompletion(habitId, date),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HABIT_LOGS })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HABITS_WITH_STATS })
      
      if (data.completed) {
        toast.success('Mantap! 1 langkah kecil selesai 🎉')
      } else {
        toast('Habit ditandai belum selesai')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal mengubah status habit')
    }
  })
}

// Pomodoro Sessions
export function usePomodoroSessions() {
  return useQuery({
    queryKey: QUERY_KEYS.POMODORO_SESSIONS,
    queryFn: HabitStorage.getPomodoroSessions,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useSavePomodoroSession() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: HabitStorage.savePomodoroSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POMODORO_SESSIONS })
      toast.success('Sesi fokus berhasil disimpan!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menyimpan sesi fokus')
    }
  })
}

// User Preferences
export function useUserPreferences() {
  return useQuery({
    queryKey: QUERY_KEYS.USER_PREFERENCES,
    queryFn: HabitStorage.getUserPreferences,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

export function useSaveUserPreferences() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: HabitStorage.saveUserPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PREFERENCES })
      toast.success('Preferensi berhasil disimpan!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menyimpan preferensi')
    }
  })
}

// Initialize Sample Data
export function useInitializeSampleData() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: HabitStorage.initializeSampleData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HABITS })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HABIT_LOGS })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HABITS_WITH_STATS })
    }
  })
}

// Reset Data
export function useResetData() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: HabitStorage.resetAllData,
    onSuccess: () => {
      queryClient.clear()
      toast.success('Semua data berhasil direset!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal mereset data')
    }
  })
}
