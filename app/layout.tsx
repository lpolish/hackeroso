import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ThemeInitializer from './components/ThemeInitializer'
import { TaskProvider } from './contexts/TaskContext'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Hackeroso - A Modern Hacker News Client',
    template: '%s | Hackeroso',
  },
  description: 'Discover tech news, discussions, and manage tasks with Hackeroso.',
  keywords: ['tech news', 'hacker news', 'task management', 'productivity'],
  authors: [{ name: 'Hackeroso Team' }],
  creator: 'Hackeroso Team',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hackeroso.com',
    siteName: 'Hackeroso',
    title: 'Hackeroso - A Modern Hacker News Client',
    description: 'Discover tech news, discussions, and manage tasks with Hackeroso.',
    images: [
      {
        url: 'https://hackeroso.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hackeroso - A Modern Hacker News Client',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hackeroso - A Modern Hacker News Client',
    description: 'Discover tech news, discussions, and manage tasks with Hackeroso.',
    images: ['https://hackeroso.com/twitter-image.jpg'],
    creator: '@hackeroso',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className={`${inter.className} pt-safe`}>
        <ThemeInitializer />
        <TaskProvider>
          {children}
          <Toaster />
        </TaskProvider>
      </body>
    </html>
  )
}

