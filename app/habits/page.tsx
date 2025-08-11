'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { HabitCard } from '@/components/habit-card'
import { FloatingActionButton } from '@/components/ui/floating-action-button'
import { HabitForm } from '@/components/habit-form'
import { useHabitsWithStats, useToggleHabitCompletion, useDeleteHabit } from '@/lib/hooks'
import { HabitWithStats } from '@/lib/types'
import { Search, Plus, Filter, SortAsc, Target, Archive, CheckCircle2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function HabitsPage() {
  const { data: habits = [], isLoading } = useHabitsWithStats()
  const toggleHabitMutation = useToggleHabitCompletion()
  const deleteHabitMutation = useDeleteHabit()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [showHabitForm, setShowHabitForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<HabitWithStats | null>(null)
  const [deleteHabitId, setDeleteHabitId] = useState<string | null>(null)
  
  const today = new Date().toISOString().split('T')[0]

  // Filter habits based on tab and search
  const filteredHabits = habits.filter(habit => {
    const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    switch (activeTab) {
      case 'active':
        return habit.isActive && matchesSearch
      case 'completed':
        return habit.todayCompleted && matchesSearch
      case 'archived':
        return !habit.isActive && matchesSearch
      default:
        return habit.isActive && matchesSearch
    }
  })

  const handleToggleHabit = (habitId: string, date: string) => {
    toggleHabitMutation.mutate({ habitId, date })
  }

  const handleEditHabit = (habit: HabitWithStats) => {
    setEditingHabit(habit)
    setShowHabitForm(true)
  }

  const handleDeleteHabit = (habitId: string) => {
    setDeleteHabitId(habitId)
  }

  const confirmDeleteHabit = () => {
    if (deleteHabitId) {
      deleteHabitMutation.mutate(deleteHabitId)
      setDeleteHabitId(null)
    }
  }

  const handleCloseForm = () => {
    setShowHabitForm(false)
    setEditingHabit(null)
  }

  const handleSubmit = (data: any) => {
    // Here you would typically call your save mutation
    console.log('Saving habit:', data)
    // saveHabitMutation.mutate(data)
    handleCloseForm()
  }

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'active':
        return habits.filter(h => h.isActive).length
      case 'completed':
        return habits.filter(h => h.todayCompleted).length
      case 'archived':
        return habits.filter(h => !h.isActive).length
      default:
        return habits.filter(h => h.isActive).length
    }
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="space-y-4 max-w-sm mx-auto md:max-w-4xl">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-4 max-w-sm mx-auto md:max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Kelola Habits
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Bangun rutinitas yang baik
          </p>
        </div>

        {/* Search and Filters - Mobile Optimized */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari habit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs - Mobile Friendly */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger value="all" className="text-xs py-2 px-1 flex flex-col gap-1">
              <Target className="h-3 w-3" />
              <span>Semua</span>
              <Badge variant="secondary" className="text-xs h-4 px-1">
                {getTabCount('all')}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs py-2 px-1 flex flex-col gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>Selesai</span>
              <Badge variant="secondary" className="text-xs h-4 px-1">
                {getTabCount('completed')}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="archived" className="text-xs py-2 px-1 flex flex-col gap-1">
              <Archive className="h-3 w-3" />
              <span>Arsip</span>
              <Badge variant="secondary" className="text-xs h-4 px-1">
                {getTabCount('archived')}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-2 mt-4">
            {filteredHabits.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Target className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-medium mb-1 text-sm">
                    {searchQuery ? 'Tidak ada hasil' : 'Belum ada habit'}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    {searchQuery 
                      ? `Tidak ditemukan habit "${searchQuery}"`
                      : 'Mulai buat habit pertama'
                    }
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setShowHabitForm(true)} size="sm">
                      <Plus className="h-3 w-3 mr-1" />
                      Buat Habit
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {filteredHabits.map((habit) => (
                  <div key={habit.id} className="opacity-0 animate-fade-in">
                    <HabitCard
                      habit={habit}
                      onToggleComplete={handleToggleHabit}
                      onEdit={handleEditHabit}
                      onDelete={handleDeleteHabit}
                      date={today}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-2 mt-4">
            {filteredHabits.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium mb-1 text-sm">Belum ada yang selesai</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Selesaikan habit hari ini
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {filteredHabits.map((habit) => (
                  <div key={habit.id}>
                    <HabitCard
                      habit={habit}
                      onToggleComplete={handleToggleHabit}
                      onEdit={handleEditHabit}
                      onDelete={handleDeleteHabit}
                      date={today}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="archived" className="space-y-2 mt-4">
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Archive className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="font-medium mb-1 text-sm">Tidak ada habit yang diarsipkan</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Habit yang diarsipkan akan muncul di sini
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Floating Action Button */}
        <FloatingActionButton onClick={() => setShowHabitForm(true)}>
          <Plus className="h-5 w-5" />
        </FloatingActionButton>

        {/* Habit Form Sheet */}
        <Sheet open={showHabitForm} onOpenChange={setShowHabitForm}>
          <SheetContent side="bottom" className="h-[90vh] sm:h-auto sm:max-w-lg sm:rounded-t-2xl">
            <SheetHeader>
              <SheetTitle className="text-left">
                {editingHabit ? 'Edit Habit' : 'Buat Habit Baru'}
              </SheetTitle>
              <SheetDescription className="text-left">
                {editingHabit 
                  ? 'Perbarui habit yang sudah ada'
                  : 'Buat habit baru untuk membangun rutinitas'
                }
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <HabitForm
                habit={editingHabit || undefined}
                onSubmit={handleSubmit}
                onCancel={handleCloseForm}
              />
            </div>
          </SheetContent>
        </Sheet>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteHabitId} onOpenChange={() => setDeleteHabitId(null)}>
          <AlertDialogContent className="max-w-sm mx-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base">Hapus Habit?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                Tindakan ini tidak dapat dibatalkan. Habit dan semua data akan dihapus.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
              <AlertDialogCancel className="w-full sm:w-auto">Batal</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteHabit} 
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  )
}
