import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search Hackeroso',
  description: 'Search for tech news, discussions, and job opportunities across Hacker News.',
  keywords: ['hacker news search', 'tech news', 'startup discussions', 'programming topics'],
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

