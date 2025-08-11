'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Habit, HabitFormData, HabitCategory, HABIT_COLORS } from '@/lib/types'
import { Circle, Target, Book, Brain, Users, Palette, MoreHorizontal } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(1, "Nama habit wajib diisi"),
  icon: z.string().default("circle"),
  color: z.string().default("#6366F1"),
  category: z.enum(['health', 'productivity', 'mindfulness', 'learning', 'social', 'creativity', 'other']).default('other'),
  description: z.string().optional(),
  schedule: z.enum(['daily', 'custom', 'interval']).default('daily'),
  customDays: z.array(z.number()).optional(),
  intervalDays: z.number().optional(),
  target: z.number().min(1).default(1),
  targetType: z.enum(['daily', 'weekly']).default('daily'),
  reminderTimes: z.array(z.string()).default([]),
  isActive: z.boolean().default(true)
})

type FormData = z.infer<typeof formSchema>

const CATEGORY_ICONS = {
  health: Target,
  productivity: Circle,
  mindfulness: Brain,
  learning: Book,
  social: Users,
  creativity: Palette,
  other: MoreHorizontal
}

const CATEGORY_LABELS = {
  health: 'Kesehatan',
  productivity: 'Produktivitas',
  mindfulness: 'Mindfulness',
  learning: 'Belajar',
  social: 'Sosial', 
  creativity: 'Kreativitas',
  other: 'Lainnya'
}

const WEEKDAYS = [
  { value: 0, label: 'Min' },
  { value: 1, label: 'Sen' },
  { value: 2, label: 'Sel' },
  { value: 3, label: 'Rab' },
  { value: 4, label: 'Kam' },
  { value: 5, label: 'Jum' },
  { value: 6, label: 'Sab' }
]

interface HabitFormProps {
  habit?: Habit
  onSubmit: (data: HabitFormData) => void
  onCancel?: () => void
  className?: string
}

export function HabitForm({ habit, onSubmit, onCancel, className }: HabitFormProps) {
  const [selectedDays, setSelectedDays] = useState<number[]>(habit?.customDays || [])
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors, isSubmitting } 
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: habit ? {
      name: habit.name,
      icon: habit.icon,
      color: habit.color,
      category: habit.category,
      description: habit.description || '',
      schedule: habit.schedule,
      customDays: habit.customDays || [],
      intervalDays: habit.intervalDays || 1,
      target: habit.target,
      targetType: habit.targetType,
      reminderTimes: habit.reminderTimes || [],
      isActive: habit.isActive
    } : {
      name: '',
      icon: 'circle',
      color: HABIT_COLORS[0],
      category: 'other',
      description: '',
      schedule: 'daily',
      target: 1,
      targetType: 'daily',
      reminderTimes: [],
      isActive: true
    }
  })

  const watchedValues = watch()

  const handleDayToggle = (day: number) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day].sort()
    
    setSelectedDays(newDays)
    setValue('customDays', newDays)
  }

  const onFormSubmit = (data: FormData) => {
    const habitData: HabitFormData = {
      ...data,
      customDays: data.schedule === 'custom' ? selectedDays : undefined,
      intervalDays: data.schedule === 'interval' ? data.intervalDays : undefined
    }
    
    onSubmit(habitData)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className={cn("space-y-6", className)}>
      {/* Preview Card */}
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: watchedValues.color }}
            >
              <Circle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">
                {watchedValues.name || 'Nama habit...'}
              </h3>
              <div className="text-sm text-muted-foreground">
                {CATEGORY_LABELS[watchedValues.category]} • {watchedValues.target}x {watchedValues.targetType === 'daily' ? 'per hari' : 'per minggu'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nama Habit *</Label>
          <Input
            id="name"
            placeholder="Minum air 8 gelas"
            {...register('name')}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Deskripsi (Opsional)</Label>
          <Textarea
            id="description"
            placeholder="Deskripsi singkat tentang habit ini..."
            rows={3}
            {...register('description')}
          />
        </div>

        <div>
          <Label>Kategori</Label>
          <Select 
            value={watchedValues.category} 
            onValueChange={(value) => setValue('category', value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
                const Icon = CATEGORY_ICONS[key as keyof typeof CATEGORY_ICONS]
                return (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Warna</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {HABIT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setValue('color', color)}
                className={cn(
                  "w-8 h-8 rounded-xl border-2 transition-all",
                  watchedValues.color === color ? 'border-foreground scale-110' : 'border-transparent'
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      <Separator />

      {/* Schedule */}
      <div className="space-y-4">
        <div>
          <Label>Jadwal</Label>
          <Select 
            value={watchedValues.schedule} 
            onValueChange={(value) => setValue('schedule', value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Setiap hari</SelectItem>
              <SelectItem value="custom">Hari tertentu</SelectItem>
              <SelectItem value="interval">Interval hari</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {watchedValues.schedule === 'custom' && (
          <div>
            <Label>Pilih Hari</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {WEEKDAYS.map((day) => (
                <Badge
                  key={day.value}
                  variant={selectedDays.includes(day.value) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => handleDayToggle(day.value)}
                >
                  {day.label}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {watchedValues.schedule === 'interval' && (
          <div>
            <Label htmlFor="intervalDays">Setiap berapa hari</Label>
            <Input
              id="intervalDays"
              type="number"
              min="1"
              max="30"
              {...register('intervalDays', { valueAsNumber: true })}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="target">Target</Label>
            <Input
              id="target"
              type="number"
              min="1"
              {...register('target', { valueAsNumber: true })}
            />
          </div>

          <div>
            <Label>Per</Label>
            <Select 
              value={watchedValues.targetType} 
              onValueChange={(value) => setValue('targetType', value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Hari</SelectItem>
                <SelectItem value="weekly">Minggu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Batal
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Menyimpan...' : habit ? 'Update Habit' : 'Buat Habit'}
        </Button>
      </div>
    </form>
  )
}
