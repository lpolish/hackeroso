import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Support - Hackeroso',
  description: 'Get support or learn more about the Hackeroso project, which provides a modern interface for Hacker News, trending GitHub repositories, and other sources, with integrated task management.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) { return children }

