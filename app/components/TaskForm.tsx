'use client'

import { useState, useRef, useEffect } from 'react'
import { useTaskContext } from '../contexts/TaskContext'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Clock, ChevronDown, Flag } from 'lucide-react'

export default function TaskForm() {
  const { addTask } = useTaskContext()
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState('30')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false)
  const priorityDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(event.target as Node)) {
        setIsPriorityDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const isUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(title)

    addTask({
      title: title.trim(),
      priority,
      status: 'pending',
      expectedDuration: parseInt(duration),
      source: 'custom',
      projectId: 'default',
      url: isUrl ? title : undefined,
    })

    setTitle('')
    setDuration('30')
    setPriority('medium')
  }

  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text')
    if (/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(pastedText)) {
      e.preventDefault()
      try {
        const response = await fetch(`/api/fetch-title?url=${encodeURIComponent(pastedText)}`)
        if (response.ok) {
          const { title } = await response.json()
          setTitle(title || pastedText)
        } else {
          setTitle(pastedText)
        }
      } catch (error) {
        console.error('Error fetching title:', error)
        setTitle(pastedText)
      }
    }
  }

  const priorityColors = {
    low: 'text-green-500',
    medium: 'text-yellow-500',
    high: 'text-red-500'
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
      <div className="flex-grow">
        <Input
          type="text"
          placeholder="Add a new task or paste a link..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onPaste={handlePaste}
          className="w-full bg-background/50 border-muted text-base"
        />
      </div>
      <div className="flex flex-wrap md:flex-nowrap gap-2">
        <div ref={priorityDropdownRef} className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
            className="w-[130px] justify-between"
          >
            <div className="flex items-center">
              <Flag className={`h-4 w-4 mr-2 ${priorityColors[priority]}`} />
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
          {isPriorityDropdownOpen && (
            <div className="absolute left-0 mt-2 w-[130px] bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  type="button"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                  onClick={() => {
                    setPriority('low')
                    setIsPriorityDropdownOpen(false)
                  }}
                >
                  <Flag className="h-4 w-4 mr-2 text-green-500" />
                  Low
                </button>
                <button
                  type="button"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                  onClick={() => {
                    setPriority('medium')
                    setIsPriorityDropdownOpen(false)
                  }}
                >
                  <Flag className="h-4 w-4 mr-2 text-yellow-500" />
                  Medium
                </button>
                <button
                  type="button"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                  onClick={() => {
                    setPriority('high')
                    setIsPriorityDropdownOpen(false)
                  }}
                >
                  <Flag className="h-4 w-4 mr-2 text-red-500" />
                  High
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 bg-background/50 rounded-md px-2 h-10">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-12 border-0 p-0 text-center text-base"
          />
          <span className="text-base text-muted-foreground">min</span>
        </div>
        <Button type="submit" className="md:ml-auto text-base">Add Task</Button>
      </div>
    </form>
  )
}

