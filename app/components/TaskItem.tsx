'use client'

import { useState, useEffect, useRef } from 'react'
import { Task, useTaskContext } from '../contexts/TaskContext'
import { Button } from "@/app/components/ui/button"
import { Card } from "@/app/components/ui/card"
import { Bell, Play, Pause, CheckCircle, Trash2, Timer, HourglassIcon, Flag, GripVertical, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Draggable } from 'react-beautiful-dnd'
import { Input } from "@/app/components/ui/input"
import { Badge } from "@/app/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"

interface TaskItemProps {
  task: Task
  index: number
}

export default function TaskItem({ task, index }: TaskItemProps) {
  const { updateTask, deleteTask, requestNotificationPermission, sendNotification } = useTaskContext()
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isEditingDuration, setIsEditingDuration] = useState(false)
  const [editedDuration, setEditedDuration] = useState(task.expectedDuration.toString())
  const [isReverseTimer, setIsReverseTimer] = useState(false)
  const durationInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (task.status === 'running' && !task.isPaused && task.startedAt) {
      interval = setInterval(() => {
        const now = new Date().getTime()
        const startTime = new Date(task.startedAt!).getTime()
        const currentTime = now - startTime + (task.accumulatedTime || 0)
        setElapsedTime(Math.floor(currentTime / 1000))

        if (currentTime >= task.expectedDuration * 60 * 1000) {
          clearInterval(interval)
          if (task.notificationsEnabled) {
            sendNotification("Task Completed", `Your task "${task.title}" has been completed!`)
          }
        }
      }, 1000)
    } else if (task.isPaused) {
      setElapsedTime(Math.floor(task.accumulatedTime / 1000))
    }
    return () => clearInterval(interval)
  }, [task.status, task.startedAt, task.isPaused, task.accumulatedTime, task.expectedDuration, task.notificationsEnabled, task.title, sendNotification])

  useEffect(() => {
    if (isEditingDuration && durationInputRef.current) {
      durationInputRef.current.focus()
      durationInputRef.current.select()
    }
  }, [isEditingDuration])

  const formatTime = (seconds: number) => {
    const totalMinutes = Math.floor(seconds / 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    const remainingSeconds = seconds % 60
    return `${hours > 0 ? `${hours}:` : ''}${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }

  const handleStart = () => {
    updateTask({
      id: task.id,
      status: 'running',
      isPaused: false,
    })
  }

  const handlePause = () => {
    updateTask({
      id: task.id,
      status: 'running',
      isPaused: true,
    })
  }

  const handleComplete = () => {
    updateTask({
      id: task.id,
      status: 'completed',
    })
  }

  const handleNotificationToggle = async () => {
    if (!task.notificationsEnabled) {
      const permissionGranted = await requestNotificationPermission()
      if (!permissionGranted) {
        console.log("Notification permission denied")
        return
      }
    }
    updateTask({
      id: task.id,
      notificationsEnabled: !task.notificationsEnabled,
    })
  }

  const handleDurationClick = () => {
    if (!task.isPaused && task.status === 'running') return
    setIsEditingDuration(true)
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setEditedDuration(value)
  }

  const handleDurationSubmit = () => {
    const newDuration = parseInt(editedDuration)
    if (!isNaN(newDuration) && newDuration > 0) {
      updateTask({
        id: task.id,
        expectedDuration: newDuration,
      })
    } else {
      setEditedDuration(task.expectedDuration.toString())
    }
    setIsEditingDuration(false)
  }

  const handleDurationBlur = () => {
    handleDurationSubmit()
  }

  const handleDurationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleDurationSubmit()
    } else if (e.key === 'Escape') {
      setEditedDuration(task.expectedDuration.toString())
      setIsEditingDuration(false)
    }
  }

  const toggleTimerMode = () => {
    setIsReverseTimer(!isReverseTimer)
  }

  const getTimerDisplay = () => {
    if (isReverseTimer) {
      const remainingTime = Math.max(0, task.expectedDuration * 60 - elapsedTime)
      return formatTime(remainingTime)
    }
    return formatTime(elapsedTime)
  }

  const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  }

  const handlePriorityChange = (newPriority: 'low' | 'medium' | 'high') => {
    updateTask({
      id: task.id,
      priority: newPriority,
    })
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Card className={`p-4 relative ${task.status === 'running' ? 'border-blue-500' : ''}`}>
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">
                    {task.url ? (
                      <a
                        href={task.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gray-900 hover:text-orange-500 dark:text-zinc-100 dark:hover:text-orange-400"
                      >
                        {task.title}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      task.title
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {isEditingDuration ? (
                      <Input
                        ref={durationInputRef}
                        type="text"
                        value={editedDuration}
                        onChange={handleDurationChange}
                        onBlur={handleDurationBlur}
                        onKeyDown={handleDurationKeyDown}
                        className="w-16 h-6 px-1 text-center"
                      />
                    ) : (
                      <button
                        onClick={handleDurationClick}
                        className="hover:text-primary focus:outline-none focus:text-primary"
                        disabled={!task.isPaused && task.status === 'running'}
                      >
                        {task.expectedDuration}m
                      </button>
                    )}
                    <span>•</span>
                    <span>Added {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Flag className={`h-4 w-4 stroke-2 ${
                        task.priority === 'low' ? 'stroke-green-500' :
                        task.priority === 'medium' ? 'stroke-yellow-500' :
                        'stroke-red-500'
                      }`} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handlePriorityChange('low')}>
                      <Flag className="h-4 w-4 mr-2 stroke-green-500 stroke-2" />
                      Low
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePriorityChange('medium')}>
                      <Flag className="h-4 w-4 mr-2 stroke-yellow-500 stroke-2" />
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePriorityChange('high')}>
                      <Flag className="h-4 w-4 mr-2 stroke-red-500 stroke-2" />
                      High
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {task.status === 'running' && (
                <div className="text-sm text-green-500 flex items-center gap-2">
                  <button onClick={toggleTimerMode} className="focus:outline-none">
                    {isReverseTimer ? <HourglassIcon className="h-4 w-4" /> : <Timer className="h-4 w-4" />}
                  </button>
                  <button onClick={toggleTimerMode} className="focus:outline-none">
                    {getTimerDisplay()} / {formatTime(task.expectedDuration * 60)}
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNotificationToggle}
                        className={task.notificationsEnabled ? "text-green-500" : "text-gray-400"}
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{task.notificationsEnabled ? "Disable notifications" : "Enable notifications"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {task.status === 'running' && !task.isPaused ? (
                  <Button variant="ghost" size="icon" onClick={handlePause}>
                    <Pause className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" onClick={handleStart}>
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={handleComplete}>
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Drag Handle */}
            <div
              {...provided.dragHandleProps}
              className="absolute bottom-2 right-2 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Drag to reorder"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  )
}

