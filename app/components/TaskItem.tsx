'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTaskContext } from '../contexts/TaskContext'
import { Task } from '../types'
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Bell, BellOff, Play, Pause, CheckCircle, Trash2, Timer, HourglassIcon, Flag, GripVertical, ExternalLink, ChevronDown } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Draggable } from 'react-beautiful-dnd'
import { Input } from "./ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { useToast } from "./ui/use-toast"

interface TaskItemProps {
  task: Task
  index: number
}

export default function TaskItem({ task, index }: TaskItemProps) {
  const { updateTask, deleteTask, sendNotification } = useTaskContext()
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isEditingDuration, setIsEditingDuration] = useState(false)
  const [editedDuration, setEditedDuration] = useState(task.expectedDuration.toString())
  const [isReverseTimer, setIsReverseTimer] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false)
  const durationInputRef = useRef<HTMLInputElement>(null)
  const priorityDropdownRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const formatTime = useCallback((seconds: number) => {
    const totalMinutes = Math.floor(seconds / 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    const remainingSeconds = seconds % 60
    return `${hours > 0 ? `${hours}:` : ''}${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }, [])

  const stopBlinking = useCallback(() => {
    setIsBlinking(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [])

  const handleComplete = useCallback(() => {
    const now = new Date().getTime()
    const startTime = task.startedAt ? new Date(task.startedAt).getTime() : now
    const finalTime = now - startTime + (task.accumulatedTime || 0)
    updateTask({
      id: task.id,
      status: 'completed',
      accumulatedTime: finalTime,
    })
    stopBlinking()
    stopTabTitleBlink()
    toast({
      title: "Task Completed",
      description: `Your task "${task.title}" has been completed!`,
      duration: 5000,
    })
  }, [task.id, task.startedAt, task.accumulatedTime, task.title, updateTask, toast, stopBlinking])

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const initialElapsedTime = task.accumulatedTime ? Math.floor(task.accumulatedTime / 1000) : 0;
    setElapsedTime(initialElapsedTime);

    if (task.status === 'running' && !task.isPaused) {
      const startTime = task.startedAt ? new Date(task.startedAt).getTime() : Date.now();
      interval = setInterval(() => {
        const now = Date.now();
        const currentTime = now - startTime + initialElapsedTime * 1000;
        setElapsedTime(Math.floor(currentTime / 1000));

        if (currentTime >= task.expectedDuration * 60 * 1000) {
          clearInterval(interval);
          setIsBlinking(true);
          handleComplete();
          if (task.notificationsEnabled) {
            sendNotification("Task Completed", `Your task "${task.title}" has been completed!`);
            startTabTitleBlink(`Task Completed: ${task.title}`);
          }
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [task, handleComplete, sendNotification]);

  useEffect(() => {
    if (isEditingDuration && durationInputRef.current) {
      durationInputRef.current.focus()
      durationInputRef.current.select()
    }
  }, [isEditingDuration])

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

  const handleStart = useCallback(() => {
    const now = Date.now();
    updateTask({
      id: task.id,
      status: 'running',
      isPaused: false,
      startedAt: new Date(now).toISOString(),
      accumulatedTime: task.accumulatedTime || 0,
    });
    stopBlinking();
    stopTabTitleBlink();
    toast({
      title: "Task Started",
      description: `Task "${task.title}" has been started.`,
      duration: 3000,
    });
  }, [task.id, task.title, task.accumulatedTime, updateTask, toast, stopBlinking]);

  const handlePause = useCallback(() => {
    const now = Date.now();
    const startTime = task.startedAt ? new Date(task.startedAt).getTime() : now;
    const additionalTime = now - startTime;
    const totalAccumulatedTime = (task.accumulatedTime || 0) + additionalTime;

    updateTask({
      id: task.id,
      status: 'running',
      isPaused: true,
      accumulatedTime: totalAccumulatedTime,
    });
    toast({
      title: "Task Paused",
      description: `Task "${task.title}" has been paused.`,
      duration: 3000,
    });
  }, [task.id, task.title, task.startedAt, task.accumulatedTime, updateTask, toast]);

  const handleNotificationToggle = useCallback(() => {
    if (task.status === 'completed') return
    updateTask({
      id: task.id,
      notificationsEnabled: !task.notificationsEnabled,
    })
    toast({
      title: task.notificationsEnabled ? "Notifications Disabled" : "Notifications Enabled",
      description: `Notifications for task "${task.title}" have been ${task.notificationsEnabled ? 'disabled' : 'enabled'}.`,
    })
  }, [task.id, task.status, task.notificationsEnabled, task.title, updateTask, toast])

  const handleDurationClick = useCallback(() => {
    if (!task.isPaused && task.status === 'running') return
    setIsEditingDuration(true)
  }, [task.isPaused, task.status])

  const handleDurationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setEditedDuration(value)
  }, [])

  const handleDurationSubmit = useCallback(() => {
    const newDuration = parseInt(editedDuration)
    if (!isNaN(newDuration) && newDuration > 0) {
      updateTask({
        id: task.id,
        expectedDuration: newDuration,
      })
      toast({
        title: "Duration Updated",
        description: `Task duration updated to ${newDuration} minutes.`,
      })
    } else {
      setEditedDuration(task.expectedDuration.toString())
    }
    setIsEditingDuration(false)
  }, [editedDuration, task.id, task.expectedDuration, updateTask, toast])

  const handleDurationBlur = useCallback(() => {
    handleDurationSubmit()
  }, [handleDurationSubmit])

  const handleDurationKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleDurationSubmit()
    } else if (e.key === 'Escape') {
      setEditedDuration(task.expectedDuration.toString())
      setIsEditingDuration(false)
    }
  }, [handleDurationSubmit, task.expectedDuration])

  const toggleTimerMode = useCallback(() => {
    setIsReverseTimer(!isReverseTimer)
  }, [])

  const getTimerDisplay = useCallback(() => {
    if (isReverseTimer) {
      const remainingTime = Math.max(0, task.expectedDuration * 60 - elapsedTime);
      return formatTime(remainingTime);
    }
    return formatTime(elapsedTime);
  }, [isReverseTimer, task.expectedDuration, elapsedTime, formatTime]);

  const handlePriorityChange = useCallback((newPriority: 'low' | 'medium' | 'high') => {
    updateTask({
      id: task.id,
      priority: newPriority,
    })
    toast({
      title: "Priority Updated",
      description: `Task priority updated to ${newPriority}.`,
    })
    setIsPriorityDropdownOpen(false)
  }, [task.id, updateTask, toast])

  const startTabTitleBlink = useCallback((message: string) => {
    let isOriginal = false
    const originalTitle = document.title
    const interval = setInterval(() => {
      document.title = isOriginal ? originalTitle : message
      isOriginal = !isOriginal
    }, 1000)

    // Store the interval ID on the window object
    (window as any).tabTitleBlinkInterval = interval
  }, [])

  const stopTabTitleBlink = useCallback(() => {
    if ((window as any).tabTitleBlinkInterval) {
      clearInterval((window as any).tabTitleBlinkInterval)
      document.title = 'Hackeroso' // Reset to original title
    }
  }, [])

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Card className={`p-4 relative ${task.status === 'running' ? 'border-blue-500' : ''} ${isBlinking ? 'animate-pulse' : ''}`}>
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-sm mb-1">
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
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {isEditingDuration ? (
                      <Input
                        ref={durationInputRef}
                        type="text"
                        value={editedDuration}
                        onChange={handleDurationChange}
                        onBlur={handleDurationBlur}
                        onKeyDown={handleDurationKeyDown}
                        className="w-16 h-6 px-1 text-center text-xs"
                      />
                    ) : (
                      <button
                        onClick={handleDurationClick}
                        className="hover:text-primary focus:outline-none focus:text-primary text-xs"
                        disabled={!task.isPaused && task.status === 'running'}
                      >
                        {task.expectedDuration}m
                      </button>
                    )}
                    <span>•</span>
                    <span className="truncate">Added {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
                <div ref={priorityDropdownRef} className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                    className="flex items-center gap-1"
                  >
                    <Flag className={`h-4 w-4 stroke-2 ${
                      task.priority === 'low' ? 'stroke-green-500' :
                      task.priority === 'medium' ? 'stroke-yellow-500' :
                      'stroke-red-500'
                    }`} />
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  {isPriorityDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                          onClick={() => handlePriorityChange('low')}
                        >
                          <Flag className="h-4 w-4 mr-2 stroke-green-500 stroke-2" />
                          Low
                        </button>
                        <button
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                          onClick={() => handlePriorityChange('medium')}
                        >
                          <Flag className="h-4 w-4 mr-2 stroke-yellow-500 stroke-2" />
                          Medium
                        </button>
                        <button
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                          onClick={() => handlePriorityChange('high')}
                        >
                          <Flag className="h-4 w-4 mr-2 stroke-red-500 stroke-2" />
                          High
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
                {task.status !== 'completed' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleNotificationToggle}
                          className={task.notificationsEnabled ? "text-green-500" : "text-gray-400"}
                        >
                          {task.notificationsEnabled ? (
                            <Bell className="h-4 w-4" />
                          ) : (
                            <BellOff className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{task.notificationsEnabled ? "Disable notifications" : "Enable notifications"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {task.status !== 'completed' && (
                  task.status === 'running' && !task.isPaused ? (
                    <Button variant="ghost" size="icon" onClick={handlePause}>
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" onClick={handleStart}>
                      <Play className="h-4 w-4" />
                    </Button>
                  )
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleComplete}
                  disabled={task.status === 'completed'}
                >
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

