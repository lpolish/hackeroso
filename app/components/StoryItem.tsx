'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowUpCircle, MessageCircle, Clock, ExternalLink, ChevronDown, ChevronUp, PlusCircle, MinusCircle, Bookmark, UserPlus, UserMinus, User, MoreHorizontal } from 'lucide-react'
import { useTaskContext } from '../contexts/TaskContext'
import { useToast } from "./ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Story {
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
}

interface StoryItemProps {
  story: Story;
  viewMode: 'list' | 'grid' | 'compact';
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
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const touchStartTime = useRef<number | null>(null)

  const { 
    addTask, 
    isTask, 
    removeTaskByUrl, 
    notificationsEnabled,
    followers,
    followUser,
    unfollowUser,
    addSavedItem,
    removeSavedItem,
    savedItems
  } = useTaskContext()

  const { toast } = useToast()

  const id = story.id?.toString() || story.objectID || '';
  const title = story.title || 'Untitled'
  const url = story.url || (typeof window !== 'undefined' ? `${window.location.origin}/item/${id}` : `/item/${id}`)
  const points = story.points || story.score
  const author = story.author || story.by
  const timestamp = story.created_at ? new Date(story.created_at).getTime() / 1000 : story.time
  const comments = story.num_comments || story.descendants
  const text = 'text' in story ? story.text : undefined
  const domain = story.url ? new URL(story.url).hostname.replace(/^www\./, '') : null
  const formattedTime = formatDate(timestamp ?? Date.now(), timeFormat)
  const isFollowed = author ? followers[author]?.includes('currentUser') : false;
  const itemIsSaved = savedItems.some(item => item.id === id)

  const toggleExpand = () => setIsExpanded(!isExpanded)

  const handleFollowToggle = () => {
    if (author) {
      if (followers[author]?.includes('currentUser')) {
        unfollowUser(author);
        if (notificationsEnabled) {
          toast({
            title: "Unfollowed",
            description: `You are no longer following ${author}.`,
          });
        }
      } else {
        followUser(author);
        if (notificationsEnabled) {
          toast({
            title: "Followed",
            description: `You are now following ${author}.`,
          });
        }
      }
    }
  };

  const handleSave = () => {
    if (!itemIsSaved) {
      addSavedItem({
        id,
        title,
        url,
        listId: null,
      })
      if (notificationsEnabled) {
        toast({
          title: "Item Saved",
          description: `"${title}" has been added to your saved items.`,
        })
      }
    } else {
      removeSavedItem(id)
      if (notificationsEnabled) {
        toast({
          title: "Item Removed",
          description: `"${title}" has been removed from your saved items.`,
        })
      }
    }
  }

  const handleSetAsTask = () => {
    addTask({
      title: title,
      url: url,
      priority: 'medium',
      status: 'pending',
      expectedDuration: 30,
      source: 'hackernews',
      projectId: 'default'
    })
    if (notificationsEnabled) {
      toast({
        title: "Task Added",
        description: `"${title}" has been added to your tasks.`,
      })
    }
  }

  const handleRemoveTask = () => {
    removeTaskByUrl(url)
    if (notificationsEnabled) {
      toast({
        title: "Task Removed",
        description: `"${title}" has been removed from your tasks.`,
      })
    }
  }

  const isTaskItem = isTask(url)

  if (viewMode === 'compact') {
    return (
      <div className="bg-white dark:bg-zinc-900 p-2 font-mono text-sm border-b border-gray-200 dark:border-zinc-800 last:border-b-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-grow min-w-0">
            <Link 
              href={url} 
              className="text-gray-900 dark:text-zinc-100 hover:text-orange-500 dark:hover:text-orange-400 font-medium truncate block"
            >
              {title}
            </Link>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400 mt-1">
              {points !== undefined && (
                <span className="flex items-center gap-1">
                  <ArrowUpCircle className="w-3 h-3" />
                  {points}
                </span>
              )}
              {author && (
                <Link href={`/user/${author}`} className="hover:text-orange-500 dark:hover:text-orange-400">
                  by {author}
                </Link>
              )}
              {timestamp && (
                <span>{formatDate(timestamp, 'relative')}</span>
              )}
              {comments !== undefined && (
                <Link href={`/item/${id}`} className="hover:text-orange-500 dark:hover:text-orange-400 flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {comments}
                </Link>
              )}
              {domain && (
                <span className="truncate">
                  ({domain})
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`p-1 rounded-full transition-colors ${
                itemIsSaved 
                  ? 'text-orange-500 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label={itemIsSaved ? "Remove from saved items" : "Save item"}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={isTaskItem ? handleRemoveTask : handleSetAsTask}>
                  {isTaskItem ? (
                    <>
                      <MinusCircle className="w-4 h-4 mr-2" />
                      Remove from tasks
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add to tasks
                    </>
                  )}
                </DropdownMenuItem>
                {author && (
                  <DropdownMenuItem onClick={handleFollowToggle}>
                    {isFollowed ? (
                      <>
                        <UserMinus className="w-4 h-4 mr-2" />
                        Unfollow {author}
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow {author}
                      </>
                    )}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md p-4 font-mono rounded-sm transition-all
      ${viewMode === 'list' ? 'flex gap-4' : 'h-full'}`}>
      <div className={`flex flex-col ${viewMode === 'list' ? 'flex-grow min-w-0' : 'h-full'}`}>
        <div className="flex-grow">
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-[13px] leading-tight font-medium">
                      <Link 
                        href={url} 
                        className="text-gray-900 dark:text-zinc-100 hover:text-orange-500 dark:hover:text-orange-400"
                      >
                        {title}
                      </Link>
                    </h2>
                    {isTaskItem && (
                      <Link
                        href="/tasks"
                        className="shrink-0 text-[12px] bg-green-500 text-white dark:bg-green-600 dark:text-zinc-100 px-1.5 py-0.5 rounded-full hover:bg-green-600 dark:hover:bg-green-700 transition-colors ml-2"
                      >
                        task
                      </Link>
                    )}
                  </div>
                  {domain && (
                    <Link 
                      href={url} 
                      className="text-xs text-gray-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate">{domain}</span>
                    </Link>
                  )}
                </div>
              </div>
              {(isSingleView || isExpanded) && text && (
                <div className="text-sm text-gray-700 dark:text-zinc-300 mb-2" dangerouslySetInnerHTML={{ __html: text }} />
              )}
              {!isSingleView && text && (
                <button 
                  onClick={toggleExpand} 
                  className="text-sm text-gray-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 flex items-center"
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
        </div>

        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-zinc-800">
          <div className="flex flex-col gap-2 text-xs text-gray-500 dark:text-zinc-400">
            <div className="flex flex-wrap justify-between gap-y-2">
              <div className="flex items-center gap-2 min-w-0">
                {points !== undefined && (
                  <Link href={`/item/${id}`} className="flex items-center gap-1 text-gray-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400">
                    <ArrowUpCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{points}</span>
                  </Link>
                )}
                {comments !== undefined && (
                  <Link href={`/item/${id}`} className="flex items-center gap-1 hover:text-orange-500 dark:hover:text-orange-400">
                    <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{comments}</span>
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-2 min-w-0">
                {author && (
                  <Link 
                    href={`/user/${author}`} 
                    className={`flex items-center gap-1 ${
                      isFollowed 
                        ? 'text-amber-600 dark:text-amber-400 font-medium' 
                        : 'text-gray-500 dark:text-zinc-400'
                    } hover:text-orange-500 dark:hover:text-orange-400 truncate`}
                  >
                    <User className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{author}</span>
                  </Link>
                )}
                <button
                  onClick={handleSave}
                  className={`h-6 w-6 p-0 flex items-center justify-center transition-all ${
                    itemIsSaved 
                      ? 'text-orange-500 dark:text-orange-400 scale-110 transform' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
                  }`}
                  aria-label={itemIsSaved ? "Remove from saved items" : "Save item"}
                >
                  <Bookmark className={`h-3.5 w-3.5 transition-transform ${itemIsSaved ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap justify-between gap-y-2">
              <button 
                onClick={() => setTimeFormat(current => 
                  current === 'relative' ? 'short' : 
                  current === 'short' ? 'iso' : 'relative'
                )}
                className="flex items-center gap-1 hover:text-orange-500 dark:hover:text-orange-400"
              >
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{formattedTime}</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={isTaskItem ? handleRemoveTask : handleSetAsTask}
                  className="flex items-center gap-1 hover:text-orange-500 dark:hover:text-orange-400"
                >
                  {isTaskItem ? (
                    <>
                      <MinusCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">Remove task</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">Add task</span>
                    </>
                  )}
                </button>
                {author && (
                  <button
                    onClick={handleFollowToggle}
                    className="flex items-center gap-1 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    {followers[author]?.includes('currentUser') ? (
                      <>
                        <UserMinus className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">Unfollow</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">Follow</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

