import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-plus-jakarta'
})

export const metadata: Metadata = {
  title: 'FocusHabit - Habit & Focus Tracker',
  description: 'Track your habits and focus sessions with beautiful, simple interface. Built for productivity and mindfulness.',
  keywords: ['habit tracker', 'focus timer', 'pomodoro', 'productivity', 'mindfulness'],
  authors: [{ name: 'FocusHabit Team' }],
  creator: 'FocusHabit',
  publisher: 'FocusHabit',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FocusHabit',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://focushabit.app',
    siteName: 'FocusHabit',
    title: 'FocusHabit - Habit & Focus Tracker',
    description: 'Track your habits and focus sessions with beautiful, simple interface.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FocusHabit - Habit & Focus Tracker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FocusHabit - Habit & Focus Tracker',
    description: 'Track your habits and focus sessions with beautiful, simple interface.',
    images: ['/twitter-image.png'],
    creator: '@focushabit',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FocusHabit" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
