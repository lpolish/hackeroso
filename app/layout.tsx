import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ThemeInitializer from './components/ThemeInitializer'
import { TaskProvider } from './contexts/TaskContext'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Hackeroso',
    template: '%s | Hackeroso',
  },
  description: 'A modern Hacker News client with integrated task management.',
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
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function getThemePreference() {
                const storedTheme = localStorage.getItem('theme');
                return storedTheme || 'system';
              }
              
              function applyTheme(theme) {
                document.documentElement.classList.remove('light', 'dark');
                if (theme === 'system') {
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  document.documentElement.classList.add(systemTheme);
                } else {
                  document.documentElement.classList.add(theme);
                }
              }
              
              const theme = getThemePreference();
              applyTheme(theme);
            })();
          `
        }} />
        <ThemeInitializer />
        <TaskProvider>
          {children}
        </TaskProvider>
        <Analytics />
      </body>
    </html>
  )
}

