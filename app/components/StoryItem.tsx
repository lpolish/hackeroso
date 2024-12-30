'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpCircle, MessageCircle, Clock, ExternalLink, ChevronDown, ChevronUp, PlusCircle, MinusCircle } from 'lucide-react'
import { useTaskContext } from '../contexts/TaskContext'

interface SearchResult {
  objectID: string;
  title: string;
  url: string;
  author: string;
  points: number;
  num_comments: number;
  created_at: string;
  created_at_i: number;
}

interface Item {
  id: number;
  title?: string;
  url?: string;
  score?: number;
  by?: string;
  time: number;
  descendants?: number;
  text?: string;
}

type Story = {
  id?: number | string;
  objectID?: string;
  title?: string;
  url?: string;
  score?: number;
  points?: number;
  by?: string;
  author?: string;
  time?: number;
  created_at?: string;
  created_at_i?: number;
  descendants?: number;
  num_comments?: number;
  text?: string;
};


interface StoryItemProps {
  story: Story;
  viewMode: 'list' | 'grid';
  isSingleView?: boolean;
}

function formatDate(timestamp: number | string | undefined, format: 'relative' | 'short' | 'iso'): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp * 1000) : 
               typeof timestamp === 'string' ? new Date(timestamp) : 
               new Date();
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  switch (format) {
    case 'relative':
      if (diff < 24 * 60 * 60 * 1000) {
        const hours = Math.floor(diff / (60 * 60 * 1000))
        if (hours === 0) {
          const minutes = Math.floor(diff / (60 * 1000))
          return `${minutes}m ago`
        }
        return `${hours}h ago`
      }
      if (diff < 7 * 24 * 60 * 60 * 1000) {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000))
        return `${days}d ago`
      }
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    case 'short':
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })

    case 'iso':
      return date.toISOString().slice(0, 16).replace('T', ' ')
  }
}

export default function StoryItem({ story, viewMode, isSingleView = false }: StoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [timeFormat, setTimeFormat] = useState<'relative' | 'short' | 'iso'>('relative')
  const { addTask, isTask, removeTaskByUrl } = useTaskContext()

  const id = story.id || story.objectID || '';
  const title = story.title || 'Untitled'
  const url = story.url || (typeof window !== 'undefined' ? `${window.location.origin}/item/${id}` : `/item/${id}`)
  const points = story.points || story.score
  const author = story.author || story.by
  const timestamp = story.created_at ? new Date(story.created_at).getTime() / 1000 : story.time
  const comments = story.num_comments || story.descendants
  const text = 'text' in story ? story.text : undefined

  const domain = story.url ? new URL(story.url).hostname.replace(/^www\./, '') : null
  const formattedTime = formatDate(timestamp ?? Date.now(), timeFormat)

  const toggleExpand = () => setIsExpanded(!isExpanded)

  const handleSetAsTask = () => {
    addTask({
      title: title,
      url: url,
      priority: 'medium',
      status: 'pending',
      expectedDuration: 30,
      source: 'hackernews',
      projectId: 'default',
      notificationsEnabled: false,
    })
  }

  const handleRemoveTask = () => {
    removeTaskByUrl(url)
  }

  const isTaskItem = isTask(url)

  return (
    <div className={`bg-white shadow-sm hover:shadow-md dark:bg-zinc-900 p-4 font-mono rounded-sm transition-shadow
      ${viewMode === 'list' ? 'flex gap-4' : 'h-full'}`}>
      <div className={`flex flex-col ${viewMode === 'list' ? 'flex-grow min-w-0' : 'h-full'}`}>
        <div className="flex-grow">
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex flex-col gap-2">
              <h2 className={`font-medium leading-tight ${viewMode === 'list' ? 'text-base' : 'text-lg'}`}>
                <Link 
                  href={url} 
                  className="text-gray-900 hover:text-orange-500 dark:text-zinc-100 dark:hover:text-orange-400"
                >
                  {title}
                </Link>
              </h2>
              <div className="flex items-center justify-between">
                {domain && (
                  <Link 
                    href={url} 
                    className="text-xs text-gray-500 hover:text-orange-500 dark:text-zinc-400 dark:hover:text-orange-400 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span className="truncate">{domain}</span>
                  </Link>
                )}
                {isTaskItem && (
                  <Link 
                    href="/tasks" 
                    className="text-xs bg-green-500 text-white ml-2 px-2 py-0.5 rounded-full hover:bg-green-600 transition-colors"
                  >
                    task
                  </Link>
                )}
              </div>
            </div>
            {(isSingleView || isExpanded) && text && (
              <div className="text-sm text-gray-600 dark:text-zinc-300 mb-2" dangerouslySetInnerHTML={{ __html: text }} />
            )}
            {!isSingleView && text && (
              <button 
                onClick={toggleExpand} 
                className="text-sm text-gray-500 hover:text-orange-500 dark:text-zinc-400 dark:hover:text-orange-400 flex items-center"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Hide description
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Show description
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-zinc-800">
          <div className="flex flex-col gap-2 text-xs text-gray-500 dark:text-zinc-400">
            <div className="flex items-center justify-between">
              <div className="flex-inline gap-2 justify-between">
              <button
                onClick={isTaskItem ? handleRemoveTask : handleSetAsTask}
                className="flex items-center gap-1 hover:text-orange-500 dark:hover:text-orange-400"
              >
                {isTaskItem ? (
                  <>
                    <MinusCircle className="w-3.5 h-3.5" />
                    Remove from tasks
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-3.5 h-3.5" />
                    Add to task
                  </>
                )}
              </button>
              </div>
              <div className="flex items-center gap-4">
                {points !== undefined && (
                  <Link href={`/item/${id}`} className="flex items-center gap-1 text-gray-500 hover:text-orange-500 dark:text-zinc-400 dark:hover:text-orange-400">
                    <ArrowUpCircle className="w-3.5 h-3.5" />
                    {points}
                  </Link>
                )}
                {comments !== undefined && (
                  <Link href={`/item/${id}`} className="flex items-center gap-1 hover:text-orange-500 dark:hover:text-orange-400">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {comments}
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setTimeFormat(current => 
                  current === 'relative' ? 'short' : 
                  current === 'short' ? 'iso' : 'relative'
                )}
                className="flex items-center gap-1 hover:text-orange-500 dark:hover:text-orange-400"
              >
                <Clock className="w-3.5 h-3.5" />
                {formattedTime}
              </button>
              <span className="flex items-center gap-1">
                by
                <Link 
                  href={`/user/${author || 'unknown'}`} 
                  className="hover:text-orange-500 dark:hover:text-orange-400 truncate max-w-[100px]"
                >
                  {author || 'unknown'}
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

