'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ProgressRing } from '@/components/ui/progress-ring'
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { motion } from 'framer-motion'

export type TimerMode = 'focus' | 'short_break' | 'long_break'

interface TimerProps {
  mode: TimerMode
  initialMinutes: number
  onComplete?: () => void
  onModeChange?: (mode: TimerMode) => void
  className?: string
}

const MODE_LABELS = {
  focus: 'Focus',
  short_break: 'Short Break',
  long_break: 'Long Break'
}

const MODE_COLORS = {
  focus: '#6366F1',
  short_break: '#10B981', 
  long_break: '#8B5CF6'
}

export function Timer({ 
  mode, 
  initialMinutes, 
  onComplete, 
  onModeChange,
  className 
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const totalSeconds = initialMinutes * 60
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  useEffect(() => {
    setTimeLeft(initialMinutes * 60)
    setIsRunning(false)
  }, [initialMinutes, mode])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            onComplete?.()
            // Play notification sound
            if (isSoundEnabled && typeof window !== 'undefined') {
              const audio = new Audio('/notification.mp3')
              audio.play().catch(() => {}) // Ignore errors
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, onComplete, isSoundEnabled])

  const handlePlayPause = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(initialMinutes * 60)
  }

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardContent className="p-8 text-center">
        {/* Mode Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-muted rounded-xl p-1">
            {(['focus', 'short_break', 'long_break'] as TimerMode[]).map((timerMode) => (
              <Button
                key={timerMode}
                variant={mode === timerMode ? "default" : "ghost"}
                size="sm"
                onClick={() => onModeChange?.(timerMode)}
                className={cn(
                  "text-xs font-medium transition-all",
                  mode === timerMode && "shadow-sm"
                )}
                style={{
                  backgroundColor: mode === timerMode ? MODE_COLORS[timerMode] : undefined,
                  color: mode === timerMode ? 'white' : undefined
                }}
              >
                {MODE_LABELS[timerMode]}
              </Button>
            ))}
          </div>
        </div>

        {/* Timer Display */}
        <div className="mb-8">
          <ProgressRing 
            progress={progress} 
            size={200} 
            strokeWidth={12}
            className="mb-4"
            style={{ color: MODE_COLORS[mode] } as any}
          >
            <motion.div
              key={`${minutes}-${seconds}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold font-mono">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {MODE_LABELS[mode]}
              </div>
            </motion.div>
          </ProgressRing>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            className="h-12 w-12"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>

          <Button
            onClick={handlePlayPause}
            size="lg"
            className="h-16 w-16 rounded-full text-white"
            style={{ backgroundColor: MODE_COLORS[mode] }}
          >
            {isRunning ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="h-12 w-12"
          >
            {isSoundEnabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Session Info */}
        <div className="text-center text-sm text-muted-foreground">
          {timeLeft === 0 ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-primary font-medium"
            >
              {mode === 'focus' ? 'Sesi fokus selesai! 🎉' : 'Waktu istirahat habis! ⏰'}
            </motion.div>
          ) : (
            <div>
              {isRunning ? 'Timer berjalan...' : 'Tekan play untuk memulai'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
