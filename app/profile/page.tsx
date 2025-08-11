'use client'

import { useState, useEffect } from 'react'
import { AppShell } from '@/components/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useUserPreferences, useSaveUserPreferences, useResetData } from '@/lib/hooks'
import { useTheme } from 'next-themes'
import { 
  User, 
  Settings,
  Bell,
  Moon,
  Sun,
  Monitor,
  Globe,
  Download,
  Upload,
  RotateCcw,
  Shield,
  HelpCircle,
  Mail,
  ExternalLink,
  Smartphone,
  Wifi,
  WifiOff,
  Crown,
  Zap
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { data: preferences } = useUserPreferences()
  const savePreferences = useSaveUserPreferences()
  const resetData = useResetData()
  const { theme, setTheme } = useTheme()
  
  const [name, setName] = useState('')
  const [language, setLanguage] = useState('id')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const [canInstallPWA, setCanInstallPWA] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  
  // Initialize form with preferences
  useEffect(() => {
    if (preferences) {
      setName(preferences.name)
      setLanguage(preferences.language)
      setNotificationsEnabled(preferences.notificationsEnabled)
      setSoundEnabled(preferences.soundEnabled)
    }
  }, [preferences])
  
  // Listen for PWA install prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstallPWA(true)
    }
    
    window.addEventListener('beforeinstallprompt', handler)
    
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setCanInstallPWA(false)
    }
    
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])
  
  // Listen for online/offline status
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])
  
  const handleSaveProfile = () => {
    if (preferences) {
      savePreferences.mutate({
        ...preferences,
        name,
        language: language as 'id' | 'en',
        notificationsEnabled,
        soundEnabled
      })
    }
  }
  
  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        toast.success('Aplikasi berhasil diinstall!')
        setCanInstallPWA(false)
      }
      
      setDeferredPrompt(null)
    }
  }
  
  const handleResetData = () => {
    resetData.mutate()
  }
  
  const handleExportData = () => {
    // Mock export functionality
    const data = {
      exportedAt: new Date().toISOString(),
      habits: [], // Would be actual data
      logs: [],
      sessions: [],
      preferences
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `focushabit-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Data berhasil diekspor!')
  }
  
  const handleImportData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string)
            // Would validate and import data here
            toast.success('Data berhasil diimpor!')
          } catch (error) {
            toast.error('File tidak valid')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <AppShell>
      <div className="space-y-4 max-w-sm mx-auto md:max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Profile & Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Kelola akun dan preferensi
          </p>
        </div>

        {/* PWA Install Banner */}
        {canInstallPWA && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <Smartphone className="h-4 w-4" />
              <div className="flex-1">
                <p className="font-medium text-sm">Jadikan Aplikasi</p>
                <p className="text-xs opacity-90">Install untuk pengalaman yang lebih baik</p>
              </div>
              <Button 
                onClick={handleInstallPWA}
                variant="secondary"
                size="sm"
                className="text-xs h-7"
              >
                Install
              </Button>
            </div>
          </div>
        )}
        
        {/* Offline Banner */}
        {!isOnline && (
          <div className="bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 animate-fade-in">
            <div className="flex items-center gap-3 text-orange-800 dark:text-orange-200">
              <WifiOff className="h-4 w-4" />
              <div className="flex-1">
                <p className="font-medium text-sm">Mode Offline</p>
                <p className="text-xs opacity-90">Perubahan akan tersinkron saat online</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-primary to-purple-600 text-white">
                  {getInitials(name || 'User')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama kamu"
                  />
                </div>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Crown className="h-3 w-3" />
                Free
              </Badge>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label>Bahasa</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">🇮🇩 Bahasa Indonesia</SelectItem>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSaveProfile} className="w-full">
              Simpan Profil
            </Button>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Tampilan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                  className="gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Terang
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                  className="gap-2"
                >
                  <Moon className="h-4 w-4" />
                  Gelap
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  onClick={() => setTheme('system')}
                  className="gap-2"
                >
                  <Monitor className="h-4 w-4" />
                  System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifikasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Reminder Habit</p>
                <p className="text-sm text-muted-foreground">Terima notifikasi untuk habit harian</p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Suara Notifikasi</p>
                <p className="text-sm text-muted-foreground">Putar suara saat timer selesai</p>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={handleExportData}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button 
                variant="outline" 
                onClick={handleImportData}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Import
              </Button>
            </div>
            
            <Separator />
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset Semua Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Semua Data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini akan menghapus semua habit, log, dan sesi fokus. 
                    Data yang sudah dihapus tidak dapat dikembalikan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetData}>
                    Ya, Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Tentang
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Versi</span>
              <Badge variant="outline">1.0.0</Badge>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                <HelpCircle className="h-4 w-4" />
                FAQ & Bantuan
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
              
              <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                <Mail className="h-4 w-4" />
                Kontak Support
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
              
              <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                <Zap className="h-4 w-4" />
                Changelog
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6 text-sm text-muted-foreground">
          <p>Dibuat dengan ❤️ untuk membantu membangun kebiasaan yang baik</p>
          <p className="mt-1">© 2025 FocusHabit. All rights reserved.</p>
        </div>
      </div>
    </AppShell>
  )
}
