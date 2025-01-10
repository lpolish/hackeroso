'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PlusCircle, MinusCircle, Bookmark, Star, GitFork, Check, Github, Copy } from 'lucide-react'
import { useTaskContext } from '../contexts/TaskContext'
import { useToast } from "@/components/ui/use-toast"

interface Repository {
  id: string;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  language: string;
  owner: {
    login: string;
  };
  forks_count: number;
  created_at: string;
}

interface TrendingItemProps {
  repository: Repository;
  viewMode: 'grid' | 'list';
  isSingleView?: boolean;
}

export default function TrendingItem({ repository, viewMode, isSingleView = false }: TrendingItemProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast()

  const { 
    addTask, 
    isTask, 
    removeTaskByUrl, 
    addSavedItem, 
    savedItems,
    notificationsEnabled,
  } = useTaskContext()

  const isSaved = savedItems.some(item => item.id === repository.id.toString())
  const isTaskItem = isTask(repository.html_url)

  const handleSetAsTask = () => {
    addTask({
      title: repository.full_name,
      url: repository.html_url,
      priority: 'medium',
      status: 'pending',
      expectedDuration: 30,
      source: 'github',
      projectId: 'default'
    })
    if (notificationsEnabled) {
      toast({
        title: "Task Added",
        description: `"${repository.full_name}" has been added to your tasks.`,
      })
    }
  }

  const handleRemoveTask = () => {
    removeTaskByUrl(repository.html_url)
    if (notificationsEnabled) {
      toast({
        title: "Task Removed",
        description: `"${repository.full_name}" has been removed from your tasks.`,
      })
    }
  }

  const handleSave = () => {
    if (!isSaved) {
      addSavedItem({
        id: repository.id.toString(),
        title: repository.full_name,
        url: repository.html_url,
        listId: null,
      })
      if (notificationsEnabled) {
        toast({
          title: "Item Saved",
          description: `"${repository.full_name}" has been added to your saved items.`,
        })
      }
    }
  }

  const handleCopyUrl = () => {
    if (repository.html_url) {
      navigator.clipboard.writeText(repository.html_url).then(() => {
        setIsCopied(true);
        if (notificationsEnabled) {
          toast({
            title: "URL Copied",
            description: "Repository URL has been copied to clipboard.",
          });
        }
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className={`bg-white dark:bg-zinc-900 p-4 rounded-sm transition-colors flex flex-col h-full ${isSaved ? 'hover:bg-orange-100 dark:hover:bg-orange-900/20' : 'hover:bg-gray-100 dark:hover:bg-zinc-800/50'}`}>
      <div className="flex-grow">
        <h2 className="text-zinc-100 font-medium text-base leading-tight mb-2">
          <Link 
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer" 
            className={`${isSaved ? 'text-orange-500 dark:text-orange-400' : 'text-gray-900 dark:text-zinc-100 hover:text-orange-500 dark:hover:text-orange-400'} transition-colors`}
          >
            {repository.full_name}
          </Link>
        </h2>
        <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5" />
            {repository.stargazers_count.toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-3.5 h-3.5" />
            {repository.forks_count.toLocaleString()}
          </div>
          {repository.language && (
            <span>{repository.language}</span>
          )}
          {isTaskItem && (
            <span className="text-xs bg-green-500 text-white dark:bg-green-600 dark:text-zinc-100 ml-2 px-2 py-0.5 rounded-full">
              task
            </span>
          )}
        </div>
        {repository.description && (
          <p className="text-sm text-gray-600 dark:text-zinc-400 line-clamp-2">
            {repository.description}
          </p>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-gray-200 dark:border-zinc-800">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <Link 
              href={`https://github.com/${repository.owner.login}`}
              target="_blank"
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              {repository.owner.login}
            </Link>
            <span>•</span>
            <span>{timeAgo(repository.created_at)}</span>
          </div>
          <button
            onClick={handleSave}
            className={`${
              isSaved ? 'text-orange-500 dark:text-orange-400' : 'text-gray-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400'
            } transition-colors`}
            disabled={isSaved}
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-zinc-400">
          <button
            onClick={isTaskItem ? handleRemoveTask : handleSetAsTask}
            className="flex items-center gap-1.5 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
          >
            {isTaskItem ? (
              <>
                <MinusCircle className="w-3.5 h-3.5" />
                Remove from task
              </>
            ) : (
              <>
                <PlusCircle className="w-3.5 h-3.5" />
                Add to task
              </>
            )}
          </button>
          <button
            onClick={handleCopyUrl}
            className="flex items-center gap-1.5 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied to clipboard
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Clone repo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

