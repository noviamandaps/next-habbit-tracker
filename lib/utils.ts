import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  })
}

export function formatTime(minutes: number): string {
  const mins = Math.floor(minutes % 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}`
  }
  return `${mins}:00`
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  
  if (hour < 12) return "Selamat pagi"
  if (hour < 15) return "Selamat siang" 
  if (hour < 18) return "Selamat sore"
  return "Selamat malam"
}

export function calculateStreak(logs: { date: string; done: boolean }[]): number {
  const sortedLogs = logs
    .filter(log => log.done)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  if (sortedLogs.length === 0) return 0
  
  let streak = 0
  let currentDate = new Date()
  
  for (const log of sortedLogs) {
    const logDate = new Date(log.date)
    const diffTime = Math.abs(currentDate.getTime() - logDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 1) {
      streak++
      currentDate = logDate
    } else {
      break
    }
  }
  
  return streak
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}
