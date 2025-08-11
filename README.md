# 🎯 FocusHabit - Habit & Focus Tracker

> Modern habit tracking app with Pomodoro timer, built with Next.js 14, Tailwind CSS, and shadcn/ui. Mobile-first design with PWA support.

![FocusHabit Demo](./public/screenshot-mobile.png)

## ✨ Features

### 🏠 **Dashboard Harian**
- Greeting personal dengan nama pengguna
- Progress hari ini dengan progress bar visual
- Daftar habit dengan checkbox toggle
- Quick start Pomodoro button
- Streak counter dengan emoji api 🔥

### 📝 **Manajemen Habit**
- CRUD habits lengkap dengan form validation
- Search & filter habits (kategori, hari, warna)
- Swipe actions (edit/archive/delete)
- Habit templates untuk quick setup
- Calendar heatmap 30 hari terakhir
- Custom jadwal (daily/custom days/interval)

### ⏱️ **Pomodoro Focus Timer**
- Timer besar dengan UI minimal distraksi
- Mode: Focus (25min) / Short Break (5min) / Long Break (15min)
- Preset timer atau custom
- Link ke habit target
- Session counter & statistics
- Notes area untuk catatan sesi

### 📊 **Progress & Analytics**
- Chart mingguan/bulanan dengan Recharts
- Streak & consistency statistics
- Completion rate visualization
- Filter by habit dengan multi-select
- Export data (dummy CSV/JSON)

### 👤 **Profile & Settings**
- Theme toggle (Light/Dark/System)
- PWA install prompt
- Notification settings (dummy)
- Data reset & export options
- User preferences management

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query + Zustand
- **Database**: IndexedDB (offline-first with idb-keyval)
- **Forms**: React Hook Form + Zod validation
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **PWA**: next-pwa
- **Type Safety**: TypeScript

## 📱 Mobile-First Design

- **Responsive**: Mobile, tablet, desktop optimized
- **Navigation**: Bottom nav (mobile) + Sidebar (desktop)
- **Touch Friendly**: 44px+ tap targets, swipe gestures
- **Performance**: Code splitting, lazy loading
- **Accessibility**: WCAG AA compliance, screen reader support

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Quick Start

```bash
# Clone repository
git clone https://github.com/username/next-habit-tracker.git
cd next-habit-tracker

# Install dependencies
pnpm install

# Start development server  
pnpm dev

# Open browser
# http://localhost:3000
```

### Build for Production

```bash
# Build optimized version
pnpm build

# Start production server
pnpm start

# Run type checking
pnpm type-check

# Run linting
pnpm lint
```

## 📁 Project Structure

```
app/
  ├── (system)/           # System pages (PWA install)
  ├── focus/             # Pomodoro timer
  ├── habits/            # Habit management
  ├── progress/          # Analytics & charts
  ├── profile/           # Settings & preferences
  ├── globals.css        # Global styles
  ├── layout.tsx         # Root layout with providers
  ├── page.tsx           # Home dashboard
  └── providers.tsx      # App providers (Query, Theme)

components/
  ├── ui/                # shadcn/ui components
  ├── app-shell.tsx      # Main layout wrapper
  ├── header.tsx         # App header
  ├── navigation.tsx     # Bottom nav + sidebar
  ├── habit-card.tsx     # Habit list item
  └── habit-form.tsx     # Add/edit habit form

lib/
  ├── hooks.ts           # React Query hooks
  ├── storage.ts         # IndexedDB operations
  ├── types.ts           # TypeScript definitions
  └── utils.ts           # Utility functions

public/
  ├── icons/             # PWA icons (72px - 512px)
  ├── manifest.json      # PWA manifest
  └── sw.js             # Service worker
```

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (`#6366F1`)
- **Secondary**: Purple (`#8B5CF6`) 
- **Accent**: Various habit colors
- **Success**: Emerald (`#10B981`)
- **Warning**: Amber (`#F59E0B`)
- **Error**: Rose (`#EF4444`)

### Typography
- **Font**: Plus Jakarta Sans / Inter
- **Headings**: font-semibold (600)
- **Body**: font-normal (400)
- **Scale**: Tailwind default scale

### Spacing & Layout
- **Container**: max-width with responsive padding
- **Cards**: rounded-2xl with shadow-sm
- **Buttons**: rounded-xl with proper touch targets
- **Grid**: CSS Grid + Flexbox responsive layouts

## 📊 State Management

### Data Layer
```typescript
// Local state with persistence
const habits = useHabits()              // All habits
const habitLogs = useHabitLogs()        // Completion logs  
const sessions = usePomodoroSessions()  // Focus sessions
const preferences = useUserPreferences() // Settings

// Mutations with optimistic updates
const toggleHabit = useToggleHabitCompletion()
const saveHabit = useSaveHabit()
const deleteHabit = useDeleteHabit()
```

### Offline Support
- **Storage**: IndexedDB via idb-keyval
- **Sync**: Background sync when online
- **Persistence**: All data persisted locally
- **PWA**: Offline usage with service worker

## 🔧 Customization

### Adding New Habit Categories
```typescript
// lib/types.ts
export const HabitCategory = {
  HEALTH: 'health',
  PRODUCTIVITY: 'productivity',
  // Add your category
  CUSTOM: 'custom'
} as const
```

### Custom Habit Templates
```typescript
// lib/types.ts
export const HABIT_TEMPLATES = [
  {
    name: "Your Custom Habit",
    icon: "star",
    color: "#F59E0B",
    category: "custom",
    // ... other properties
  }
]
```

### Theme Customization
```css
/* app/globals.css */
:root {
  --primary: 220 91% 64%;     /* Custom primary color */
  --secondary: 271 81% 56%;   /* Custom secondary */
  /* Add custom CSS variables */
}
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod

# Auto-deploy from GitHub
# Connect repository in Vercel dashboard
```

### Netlify
```bash
# Build command
pnpm build

# Publish directory  
.next
```

### Self-hosted
```bash
# Docker deployment
docker build -t focus-habit .
docker run -p 3000:3000 focus-habit
```

## 📈 Performance Metrics

### Target Lighthouse Scores
- **Performance**: 90+
- **Accessibility**: 95+  
- **Best Practices**: 95+
- **SEO**: 90+
- **PWA**: Installable

### Bundle Size Optimization
- Code splitting by route
- Dynamic imports for heavy components
- Tree shaking for unused code
- Image optimization with Next.js

## 🧪 Testing

```bash
# Unit tests (if added)
pnpm test

# E2E tests (if added)  
pnpm test:e2e

# Type checking
pnpm type-check
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use Tailwind CSS for styling
- Add proper TypeScript types
- Test on mobile devices
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Lucide](https://lucide.dev/) for consistent icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [TanStack Query](https://tanstack.com/query) for data management

---

<div align="center">
  <p>Made with ❤️ for productivity enthusiasts</p>
  <p>
    <a href="#-focushabit---habit--focus-tracker">⬆️ Back to top</a>
  </p>
</div>
