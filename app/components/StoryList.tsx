'use client'

import { useState, useEffect } from 'react'
import StoryItem from './StoryItem'

interface Story {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
}

interface StoryListProps {
  storyType: 'top' | 'new' | 'best' | 'ask' | 'show' | 'job';
  viewMode: 'grid' | 'list';
}

export default function StoryList({ storyType, viewMode }: StoryListProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStories() {
      try {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/${storyType}stories.json`)
        const storyIds = await response.json()
        const fetchedStories = await Promise.all(
          storyIds.slice(0, 30).map(async (id: number) => {
            const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            return storyResponse.json()
          })
        )
        setStories(fetchedStories)
        setLoading(false)
      } catch (error) {
        console.error(`Error fetching ${storyType} stories:`, error)
        setLoading(false)
      }
    }

    fetchStories()
  }, [storyType])

  if (loading) {
    return <div className="text-center py-8">loading...</div>
  }

  return (
    <div 
      className={`
        ${viewMode === 'grid' 
          ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' 
          : 'space-y-4'
        }
      `}
    >
      {stories.map((story) => (
        <StoryItem key={story.id} story={story} viewMode={viewMode} isSingleView={false} />
      ))}
    </div>
  )
}

