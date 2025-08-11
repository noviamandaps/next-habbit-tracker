import { z } from "zod"

// Enums
export const HabitScheduleType = {
  DAILY: 'daily',
  CUSTOM: 'custom', 
  INTERVAL: 'interval'
} as const

export const PomodoroMode = {
  FOCUS: 'focus',
  SHORT_BREAK: 'short_break', 
  LONG_BREAK: 'long_break'
} as const

export const HabitCategory = {
  HEALTH: 'health',
  PRODUCTIVITY: 'productivity',
  MINDFULNESS: 'mindfulness',
  LEARNING: 'learning',
  SOCIAL: 'social',
  CREATIVITY: 'creativity',
  OTHER: 'other'
} as const

// Zod Schemas
export const habitSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nama habit wajib diisi"),
  icon: z.string().default("circle"),
  color: z.string().default("#6366F1"),
  category: z.enum(['health', 'productivity', 'mindfulness', 'learning', 'social', 'creativity', 'other']).default('other'),
  description: z.string().optional(),
  schedule: z.enum(['daily', 'custom', 'interval']).default('daily'),
  customDays: z.array(z.number()).optional(), // [0,1,2,3,4,5,6] for Sunday-Saturday
  intervalDays: z.number().optional(), // every N days
  target: z.number().default(1), // target per day or per week
  targetType: z.enum(['daily', 'weekly']).default('daily'),
  reminderTimes: z.array(z.string()).default([]), // ["07:00", "18:00"]
  isActive: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const habitLogSchema = z.object({
  id: z.string(),
  habitId: z.string(),
  date: z.string(), // YYYY-MM-DD format
  completed: z.boolean().default(false),
  completedAt: z.string().optional(),
  notes: z.string().optional(),
  skipped: z.boolean().default(false),
  skipReason: z.string().optional()
})

export const pomodoroSessionSchema = z.object({
  id: z.string(),
  habitId: z.string().optional(),
  mode: z.enum(['focus', 'short_break', 'long_break']),
  plannedMinutes: z.number(),
  actualMinutes: z.number(),
  completed: z.boolean().default(false),
  notes: z.string().optional(),
  startedAt: z.string(),
  completedAt: z.string().optional()
})

export const userPreferencesSchema = z.object({
  name: z.string().default("User"),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  language: z.enum(['id', 'en']).default('id'),
  notificationsEnabled: z.boolean().default(true),
  soundEnabled: z.boolean().default(true),
  pomodoroSettings: z.object({
    focusMinutes: z.number().default(25),
    shortBreakMinutes: z.number().default(5),
    longBreakMinutes: z.number().default(15),
    longBreakInterval: z.number().default(4) // after N sessions
  })
})

// Types
export type Habit = z.infer<typeof habitSchema>
export type HabitLog = z.infer<typeof habitLogSchema>
export type PomodoroSession = z.infer<typeof pomodoroSessionSchema>
export type UserPreferences = z.infer<typeof userPreferencesSchema>

export type HabitWithStats = Habit & {
  todayCompleted: boolean
  currentStreak: number
  totalCompletions: number
  completionRate: number
}

export type HabitFormData = Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>

// Habit Templates
export const HABIT_TEMPLATES: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: "Minum air 8 gelas",
    icon: "cup-soda",
    color: "#3B82F6",
    category: "health",
    description: "Minum minimal 8 gelas air per hari",
    schedule: "daily",
    target: 8,
    targetType: "daily",
    reminderTimes: ["08:00", "12:00", "16:00", "20:00"],
    isActive: true
  },
  {
    name: "Baca buku 30 menit",
    icon: "book-open",
    color: "#8B5CF6",
    category: "learning", 
    description: "Membaca buku minimal 30 menit setiap hari",
    schedule: "daily",
    target: 1,
    targetType: "daily",
    reminderTimes: ["19:00"],
    isActive: true
  },
  {
    name: "Olahraga rutin",
    icon: "dumbbell",
    color: "#F59E0B",
    category: "health",
    description: "Olahraga minimal 30 menit",
    schedule: "custom",
    customDays: [1, 3, 5], // Monday, Wednesday, Friday
    target: 3,
    targetType: "weekly",
    reminderTimes: ["06:00"],
    isActive: true
  },
  {
    name: "Meditasi 10 menit",
    icon: "brain",
    color: "#10B981",
    category: "mindfulness",
    description: "Sesi meditasi atau mindfulness",
    schedule: "daily",
    target: 1,
    targetType: "daily",
    reminderTimes: ["06:30", "21:00"],
    isActive: true
  },
  {
    name: "Journaling",
    icon: "pen-tool",
    color: "#EF4444",
    category: "mindfulness",
    description: "Menulis jurnal harian",
    schedule: "daily",
    target: 1,
    targetType: "daily",
    reminderTimes: ["21:30"],
    isActive: true
  }
]

// Colors for habits
export const HABIT_COLORS = [
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#6366F1", // Indigo
  "#EC4899", // Pink
  "#F97316", // Orange
  "#84CC16", // Lime
  "#06B6D4", // Cyan
]
