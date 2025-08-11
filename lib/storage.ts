import { get, set, del } from 'idb-keyval'
import { Habit, HabitLog, PomodoroSession, UserPreferences, HABIT_TEMPLATES } from './types'
import { generateId } from './utils'

// Storage keys
const STORAGE_KEYS = {
  HABITS: 'habits',
  HABIT_LOGS: 'habit_logs', 
  POMODORO_SESSIONS: 'pomodoro_sessions',
  USER_PREFERENCES: 'user_preferences'
} as const

// Mock API with IndexedDB persistence
export class HabitStorage {
  // Habits
  static async getHabits(): Promise<Habit[]> {
    try {
      const habits = await get(STORAGE_KEYS.HABITS)
      return habits || []
    } catch (error) {
      console.error('Error getting habits:', error)
      return []
    }
  }

  static async saveHabit(habit: Habit): Promise<void> {
    try {
      const habits = await this.getHabits()
      const existingIndex = habits.findIndex(h => h.id === habit.id)
      
      if (existingIndex >= 0) {
        habits[existingIndex] = { ...habit, updatedAt: new Date().toISOString() }
      } else {
        habits.push(habit)
      }
      
      await set(STORAGE_KEYS.HABITS, habits)
    } catch (error) {
      console.error('Error saving habit:', error)
      throw new Error('Gagal menyimpan habit')
    }
  }

  static async deleteHabit(habitId: string): Promise<void> {
    try {
      const habits = await this.getHabits()
      const filteredHabits = habits.filter(h => h.id !== habitId)
      await set(STORAGE_KEYS.HABITS, filteredHabits)
      
      // Also delete related logs
      const logs = await this.getHabitLogs()
      const filteredLogs = logs.filter(log => log.habitId !== habitId)
      await set(STORAGE_KEYS.HABIT_LOGS, filteredLogs)
    } catch (error) {
      console.error('Error deleting habit:', error)
      throw new Error('Gagal menghapus habit')
    }
  }

  // Habit Logs
  static async getHabitLogs(habitId?: string): Promise<HabitLog[]> {
    try {
      const logs = await get(STORAGE_KEYS.HABIT_LOGS) || []
      return habitId ? logs.filter((log: HabitLog) => log.habitId === habitId) : logs
    } catch (error) {
      console.error('Error getting habit logs:', error)
      return []
    }
  }

  static async saveHabitLog(log: HabitLog): Promise<void> {
    try {
      const logs = await this.getHabitLogs()
      const existingIndex = logs.findIndex(l => l.id === log.id)
      
      if (existingIndex >= 0) {
        logs[existingIndex] = log
      } else {
        logs.push(log)
      }
      
      await set(STORAGE_KEYS.HABIT_LOGS, logs)
    } catch (error) {
      console.error('Error saving habit log:', error)
      throw new Error('Gagal menyimpan log habit')
    }
  }

  static async toggleHabitCompletion(habitId: string, date: string): Promise<HabitLog> {
    try {
      const logs = await this.getHabitLogs(habitId)
      const existingLog = logs.find(log => log.date === date)
      
      const logData: HabitLog = {
        id: existingLog?.id || generateId(),
        habitId,
        date,
        completed: !existingLog?.completed,
        completedAt: !existingLog?.completed ? new Date().toISOString() : undefined,
        notes: existingLog?.notes,
        skipped: false,
        skipReason: undefined
      }
      
      await this.saveHabitLog(logData)
      return logData
    } catch (error) {
      console.error('Error toggling habit completion:', error)
      throw new Error('Gagal mengubah status habit')
    }
  }

  // Pomodoro Sessions
  static async getPomodoroSessions(): Promise<PomodoroSession[]> {
    try {
      const sessions = await get(STORAGE_KEYS.POMODORO_SESSIONS)
      return sessions || []
    } catch (error) {
      console.error('Error getting pomodoro sessions:', error)
      return []
    }
  }

  static async savePomodoroSession(session: PomodoroSession): Promise<void> {
    try {
      const sessions = await this.getPomodoroSessions()
      const existingIndex = sessions.findIndex(s => s.id === session.id)
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session
      } else {
        sessions.push(session)
      }
      
      await set(STORAGE_KEYS.POMODORO_SESSIONS, sessions)
    } catch (error) {
      console.error('Error saving pomodoro session:', error)
      throw new Error('Gagal menyimpan sesi pomodoro')
    }
  }

  // User Preferences
  static async getUserPreferences(): Promise<UserPreferences> {
    try {
      const preferences = await get(STORAGE_KEYS.USER_PREFERENCES)
      return preferences || {
        name: "User",
        theme: "system",
        language: "id",
        notificationsEnabled: true,
        soundEnabled: true,
        pomodoroSettings: {
          focusMinutes: 25,
          shortBreakMinutes: 5,
          longBreakMinutes: 15,
          longBreakInterval: 4
        }
      }
    } catch (error) {
      console.error('Error getting user preferences:', error)
      return {
        name: "User",
        theme: "system",
        language: "id", 
        notificationsEnabled: true,
        soundEnabled: true,
        pomodoroSettings: {
          focusMinutes: 25,
          shortBreakMinutes: 5,
          longBreakMinutes: 15,
          longBreakInterval: 4
        }
      }
    }
  }

  static async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    try {
      await set(STORAGE_KEYS.USER_PREFERENCES, preferences)
    } catch (error) {
      console.error('Error saving user preferences:', error)
      throw new Error('Gagal menyimpan preferensi')
    }
  }

  // Initialize with sample data
  static async initializeSampleData(): Promise<void> {
    try {
      const existingHabits = await this.getHabits()
      
      if (existingHabits.length === 0) {
        // Create sample habits from templates
        const sampleHabits: Habit[] = HABIT_TEMPLATES.slice(0, 3).map(template => ({
          ...template,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }))
        
        await set(STORAGE_KEYS.HABITS, sampleHabits)
        
        // Create some sample logs for the past few days
        const logs: HabitLog[] = []
        const today = new Date()
        
        for (let i = 0; i < 7; i++) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          const dateString = date.toISOString().split('T')[0]
          
          sampleHabits.forEach(habit => {
            // Random completion (80% chance for recent days)
            const shouldComplete = Math.random() > (i * 0.1)
            
            if (shouldComplete) {
              logs.push({
                id: generateId(),
                habitId: habit.id,
                date: dateString,
                completed: true,
                completedAt: new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString(),
                skipped: false
              })
            }
          })
        }
        
        await set(STORAGE_KEYS.HABIT_LOGS, logs)
      }
    } catch (error) {
      console.error('Error initializing sample data:', error)
    }
  }

  // Reset all data
  static async resetAllData(): Promise<void> {
    try {
      await del(STORAGE_KEYS.HABITS)
      await del(STORAGE_KEYS.HABIT_LOGS) 
      await del(STORAGE_KEYS.POMODORO_SESSIONS)
      await del(STORAGE_KEYS.USER_PREFERENCES)
    } catch (error) {
      console.error('Error resetting data:', error)
      throw new Error('Gagal mereset data')
    }
  }
}
