'use client'

import { useState } from 'react'
import { useTaskContext } from '../contexts/TaskContext'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Sparkles, Clock } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip"

export default function TaskForm() {
  const { addTask } = useTaskContext()
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState('30')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')

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
      notificationsEnabled: false,
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2">
      <div className="flex-1 relative h-10 w-full">
        <Input
          type="text"
          placeholder="Add a new task or paste a link..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onPaste={handlePaste}
          className="w-full h-full bg-background/50 border-muted"
        />
      </div>
      <div className="flex items-center gap-2 h-10 w-full sm:w-auto">
        <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low priority</SelectItem>
            <SelectItem value="medium">Medium priority</SelectItem>
            <SelectItem value="high">High priority</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 bg-background/50 rounded-md px-2 h-full">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-12 border-0 p-0 text-center"
          />
          <span className="text-sm text-muted-foreground">min</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="outline" size="sm" disabled>
                <Sparkles className="mr-2 h-4 w-4" />
                Use AI
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Coming soon...</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button type="submit">Add Task</Button>
      </div>
    </form>
  )
}

