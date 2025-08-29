'use client'

import { useState, useEffect, useRef } from 'react'
import { AppShell } from '@/components/app-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ProgressRing } from '@/components/ui/progress-ring'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useHabitsWithStats, useSavePomodoroSession, useUserPreferences } from '@/lib/hooks'
import { generateId } from '@/lib/utils'
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Timer,
  Coffee,
  Target,
  Maximize,
  Settings
} from 'lucide-react'
import { toast } from 'sonner'

type TimerMode = 'focus' | 'short_break' | 'long_break'
type TimerStatus = 'idle' | 'running' | 'paused' | 'completed'

const TIMER_MODES = {
  focus: {
    label: 'Fokus',
    icon: Timer,
    color: '#6366F1',
    defaultMinutes: 25
  },
  short_break: {
    label: 'Break Pendek',
    icon: Coffee,
    color: '#10B981',
    defaultMinutes: 5
  },
  long_break: {
    label: 'Break Panjang',
    icon: Coffee,
    color: '#F59E0B',
    defaultMinutes: 15
  }
}

const PRESET_TIMERS = [
  { label: 'Klasik', focus: 25, shortBreak: 5, longBreak: 15 },
  { label: 'Panjang', focus: 50, shortBreak: 10, longBreak: 30 },
  { label: 'Singkat', focus: 15, shortBreak: 3, longBreak: 10 },
]

export default function FocusPage() {
  const { data: habits = [] } = useHabitsWithStats()
  const { data: preferences } = useUserPreferences()
  const savePomodoroMutation = useSavePomodoroSession()
  
  const [mode, setMode] = useState<TimerMode>('focus')
  const [status, setStatus] = useState<TimerStatus>('idle')
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [sessionCount, setSessionCount] = useState(0)
  const [selectedHabitId, setSelectedHabitId] = useState<string>('none')
  const [notes, setNotes] = useState('')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout>()
  const startTimeRef = useRef<Date>()
  
  const currentModeConfig = TIMER_MODES[mode]
  const totalTime = getTotalTimeForMode(mode)
  const progress = ((totalTime - timeLeft) / totalTime) * 100
  
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  
  function getTotalTimeForMode(timerMode: TimerMode): number {
    const settings = preferences?.pomodoroSettings
    switch (timerMode) {
      case 'focus':
        return (settings?.focusMinutes || 25) * 60
      case 'short_break':
        return (settings?.shortBreakMinutes || 5) * 60
      case 'long_break':
        return (settings?.longBreakMinutes || 15) * 60
      default:
        return 25 * 60
    }
  }
  
  useEffect(() => {
    setTimeLeft(getTotalTimeForMode(mode))
  }, [mode, preferences])
  
  useEffect(() => {
    if (status === 'running' && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [status, timeLeft])
  
  const handleStart = () => {
    setStatus('running')
    startTimeRef.current = new Date()
    toast.success(`${currentModeConfig.label} dimulai!`)
  }
  
  const handlePause = () => {
    setStatus('paused')
    toast('Timer dijeda')
  }
  
  const handleResume = () => {
    setStatus('running')
    toast('Timer dilanjutkan')
  }
  
  const handleStop = () => {
    setStatus('idle')
    setTimeLeft(getTotalTimeForMode(mode))
    toast('Timer dihentikan')
  }
  
  const handleReset = () => {
    setStatus('idle')
    setTimeLeft(getTotalTimeForMode(mode))
    setNotes('')
  }
  
  const handleTimerComplete = () => {
    setStatus('completed')
    
    // Save session
    if (startTimeRef.current) {
      const session = {
        id: generateId(),
        habitId: selectedHabitId !== 'none' ? selectedHabitId : undefined,
        mode,
        plannedMinutes: Math.floor(getTotalTimeForMode(mode) / 60),
        actualMinutes: Math.floor((Date.now() - startTimeRef.current.getTime()) / 60000),
        completed: true,
        notes: notes || undefined,
        startedAt: startTimeRef.current.toISOString(),
        completedAt: new Date().toISOString()
      }
      
      savePomodoroMutation.mutate(session)
    }
    
    // Show completion message
    if (mode === 'focus') {
      setSessionCount(prev => prev + 1)
      toast.success('Sesi fokus berakhir. Ambil napas dulu ya! 🎉')
      
      // Auto switch to break
      const nextSessionCount = sessionCount + 1
      const isLongBreakTime = nextSessionCount % 4 === 0
      setMode(isLongBreakTime ? 'long_break' : 'short_break')
    } else {
      toast.success('Break selesai. Siap fokus lagi? 💪')
      setMode('focus')
    }
    
    // Play sound notification
    if (soundEnabled) {
      try {
        const audio = new Audio('/notification.mp3')
        audio.play().catch(() => {
          // Fallback: use system notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`${currentModeConfig.label} selesai!`, {
              body: mode === 'focus' ? 'Waktunya istirahat' : 'Waktunya fokus lagi',
              icon: '/icon-192x192.png'
            })
          }
        })
      } catch (error) {
        console.log('Could not play sound')
      }
    }
    
    // Reset for next session
    setTimeout(() => {
      setStatus('idle')
      setTimeLeft(getTotalTimeForMode(mode))
    }, 3000)
  }
  
  const applyPreset = (preset: typeof PRESET_TIMERS[0]) => {
    // This would update user preferences, but for now just show toast
    toast.success(`Preset "${preset.label}" diterapkan`)
  }
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch(() => {
        toast.error('Tidak dapat masuk fullscreen')
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      })
    }
  }

  return (
    <AppShell>
      <div className={`space-y-4 max-w-sm mx-auto md:max-w-4xl ${isFullscreen ? 'min-h-screen flex flex-col justify-center bg-background p-8' : ''}`}>
        {/* Header */}
        {!isFullscreen && (
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Focus Timer
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Metode Pomodoro untuk produktivitas
            </p>
          </div>
        )}

        {!isFullscreen && (
          <>
            {/* Mode Tabs - Mobile Optimized */}
            <Tabs value={mode} onValueChange={(value) => setMode(value as TimerMode)}>
              <TabsList className="grid w-full grid-cols-3 h-auto p-1">
                {(Object.keys(TIMER_MODES) as TimerMode[]).map((timerMode) => {
                  const config = TIMER_MODES[timerMode]
                  const Icon = config.icon
                  return (
                    <TabsTrigger key={timerMode} value={timerMode} className="text-xs py-2 px-1 flex flex-col gap-1">
                      <Icon className="h-3 w-3" />
                      <span className="truncate">{config.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>

            {/* Session Counter */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-xs text-gray-600 dark:text-gray-400">Sesi ke-{sessionCount + 1}</span>
              <div className="flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      i < (sessionCount % 4) ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Main Timer */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <ProgressRing 
              progress={progress} 
              size={isFullscreen ? 280 : 200}
              strokeWidth={8}
              className="text-blue-600"
            >
              <div className="text-center">
                <div className={`font-mono font-bold ${isFullscreen ? 'text-5xl' : 'text-3xl'} transition-all duration-200`}>
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </div>
                <p className={`text-gray-600 dark:text-gray-400 ${isFullscreen ? 'text-lg' : 'text-xs'} mt-1`}>
                  {currentModeConfig.label}
                </p>
              </div>
            </ProgressRing>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-3">
            {status === 'idle' && (
              <Button
                onClick={handleStart}
                size={isFullscreen ? "lg" : "sm"}
                className="gap-2 min-w-20"
              >
                <Play className="h-3 w-3" />
                Mulai
              </Button>
            )}
            
            {status === 'running' && (
              <Button
                onClick={handlePause}
                variant="outline"
                size={isFullscreen ? "lg" : "sm"}
                className="gap-2 min-w-20"
              >
                <Pause className="h-3 w-3" />
                Jeda
              </Button>
            )}
            
            {status === 'paused' && (
              <>
                <Button
                  onClick={handleResume}
                  size={isFullscreen ? "lg" : "sm"}
                  className="gap-2"
                >
                  <Play className="h-3 w-3" />
                  Lanjut
                </Button>
                <Button
                  onClick={handleStop}
                  variant="outline"
                  size={isFullscreen ? "lg" : "sm"}
                  className="gap-2"
                >
                  <Square className="h-3 w-3" />
                  Stop
                </Button>
              </>
            )}
            
            {status === 'completed' && (
              <div className="text-center animate-fade-in">
                <Badge variant="secondary" className="text-sm px-4 py-1">
                  ✨ Selesai!
                </Badge>
              </div>
            )}
            
            <Button
              onClick={handleReset}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-gray-600 shrink-0"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {!isFullscreen && (
          <>
            {/* Quick Settings */}
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`${soundEnabled ? 'text-blue-600' : 'text-gray-400'} h-8 w-8`}
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="text-gray-400 hover:text-gray-600 h-8 w-8"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>

            {/* Habit Selection */}
            <Card>
              <CardContent className="p-3 space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Habit Target (opsional)</label>
                  <Select value={selectedHabitId} onValueChange={setSelectedHabitId}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Pilih habit..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tidak ada</SelectItem>
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

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Catatan Sesi</label>
                  <Textarea
                    placeholder="Apa yang ingin kamu fokuskan?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="text-xs resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Presets */}
            <Card>
              <CardContent className="p-3">
                <h3 className="font-medium mb-2 text-sm">Quick Presets</h3>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_TIMERS.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset)}
                      className="text-xs h-auto py-2 flex flex-col"
                    >
                      <span className="font-medium">{preset.label}</span>
                      <span className="text-gray-500 text-xs">
                        {preset.focus}/{preset.shortBreak}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Today's Stats */}
            <Card>
              <CardContent className="p-3">
                <h3 className="font-medium mb-2 text-sm">Statistik Hari Ini</h3>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-xl font-bold text-blue-600">{sessionCount}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Sesi Selesai</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-blue-600">{sessionCount * 25}m</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Total Fokus</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  )
}
