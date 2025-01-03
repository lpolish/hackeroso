'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Task, LogoSettings } from '../types'
import { useToast } from "../components/ui/use-toast"

interface TaskContextType {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'accumulatedTime'>) => void
  updateTask: (task: Partial<Task> & { id: string }) => void
  deleteTask: (id: string) => void
  logoSettings: LogoSettings
  setLogoSettings: React.Dispatch<React.SetStateAction<LogoSettings>>
  fireEffectEnabled: boolean
  setFireEffectEnabled: React.Dispatch<React.SetStateAction<boolean>>
  credits: { free: number; paid: number }
  setCredits: React.Dispatch<React.SetStateAction<{ free: number; paid: number }>>
  notificationsEnabled: boolean
  setNotificationsEnabled: React.Dispatch<React.SetStateAction<boolean>>
  soundEnabled: boolean
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>
  viewMode: 'list' | 'canvas'
  setViewMode: React.Dispatch<React.SetStateAction<'list' | 'canvas'>>
  customColumns: string[]
  setCustomColumns: React.Dispatch<React.SetStateAction<string[]>>
  projectName: string
  setProjectName: React.Dispatch<React.SetStateAction<string>>
  reorderTasks: (status: 'pending' | 'running' | 'completed', startIndex: number, endIndex: number) => void
  pendingTasksCount: number
  isTask: (url: string) => boolean
  removeTaskByUrl: (url: string) => void
  clearTasks: () => void
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  sendNotification: (title: string, body: string) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export const useTaskContext = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider')
  }
  return context
}

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [logoSettings, setLogoSettings] = useState<LogoSettings>({ style: 'animated' })
  const [fireEffectEnabled, setFireEffectEnabled] = useState(true)
  const [credits, setCredits] = useState({ free: 10, paid: 0 })
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'canvas'>('canvas')
  const [customColumns, setCustomColumns] = useState<string[]>([])
  const [projectName, setProjectName] = useState('Tasks')
  const [pendingTasksCount, setPendingTasksCount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    const savedState = localStorage.getItem('taskAIState')
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      setTasks(parsedState.tasks || [])
      setLogoSettings(parsedState.logoSettings || { style: 'animated' })
      setFireEffectEnabled(parsedState.fireEffectEnabled ?? true)
      setCredits(parsedState.credits || { free: 10, paid: 0 })
      setNotificationsEnabled(parsedState.notificationsEnabled ?? false)
      setSoundEnabled(parsedState.soundEnabled ?? true)
      setViewMode(parsedState.viewMode || 'canvas')
      setCustomColumns(parsedState.customColumns || [])
      setProjectName(parsedState.projectName || 'Tasks')
    }
  }, [])

  useEffect(() => {
    const state = {
      tasks,
      logoSettings,
      fireEffectEnabled,
      credits,
      notificationsEnabled,
      soundEnabled,
      viewMode,
      customColumns,
      projectName,
    }
    localStorage.setItem('taskAIState', JSON.stringify(state))
  }, [tasks, logoSettings, fireEffectEnabled, credits, notificationsEnabled, soundEnabled, viewMode, customColumns, projectName])

  useEffect(() => {
    const pendingCount = tasks.filter(task => task.status === 'pending').length
    setPendingTasksCount(pendingCount)
  }, [tasks])

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'accumulatedTime'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      accumulatedTime: 0,
      notificationsEnabled: false,
    }
    setTasks(prevTasks => [newTask, ...prevTasks])
    toast({
      title: "Task Added",
      description: `New task "${newTask.title}" has been added.`,
    })
  }, [toast])

  const updateTask = useCallback((updatedTask: Partial<Task> & { id: string }) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === updatedTask.id) {
        const newTask = { ...task, ...updatedTask }

        if (newTask.notificationsEnabled !== task.notificationsEnabled) {
          toast({
            title: newTask.notificationsEnabled ? "Notifications Enabled" : "Notifications Disabled",
            description: `Notifications for task "${task.title}" have been ${newTask.notificationsEnabled ? 'enabled' : 'disabled'}.`,
          })
        }

        if (task.status === 'completed') {
          return { ...newTask, accumulatedTime: task.accumulatedTime }
        }

        if (newTask.status === 'running' && !task.startedAt && !newTask.isPaused) {
          newTask.startedAt = new Date().toISOString()
          newTask.lastPausedAt = undefined
        }

        if (newTask.isPaused && !task.isPaused && task.startedAt) {
          const now = new Date()
          const startTime = new Date(task.startedAt)
          const additionalTime = now.getTime() - startTime.getTime()
          newTask.accumulatedTime = (task.accumulatedTime || 0) + additionalTime
          newTask.lastPausedAt = now.toISOString()
        }

        if (!newTask.isPaused && task.isPaused) {
          newTask.startedAt = new Date().toISOString()
          newTask.lastPausedAt = undefined
        }

        const isCompleted = (newTask.status === 'completed')
        const wasNotCompleted = (task.status === 'pending' || task.status === 'running')
        if (isCompleted && wasNotCompleted) {
          newTask.completedAt = new Date().toISOString()
          if (task.status === 'running' && task.startedAt && !task.isPaused) {
            const now = new Date()
            const startTime = new Date(task.startedAt)
            newTask.accumulatedTime = (task.accumulatedTime || 0) + (now.getTime() - startTime.getTime())
          }
        }

        return newTask
      }
      return task
    }))
  }, [toast])

  const deleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
  }, [])

  const reorderTasks = useCallback((status: 'pending' | 'running' | 'completed', startIndex: number, endIndex: number) => {
    setTasks(prevTasks => {
      const result = Array.from(prevTasks)
      const [reorderedItem] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, reorderedItem)
      return result
    })
  }, [])

  const isTask = useCallback((url: string) => {
    return tasks.some(task => task.url === url)
  }, [tasks])

  const removeTaskByUrl = useCallback((url: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.url !== url))
  }, [])

  const clearTasks = useCallback(() => {
    setTasks([])
  }, [])

  const sendNotification = useCallback((title: string, body: string) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body })
    }
    toast({
      title: title,
      description: body,
    })
  }, [toast])

  const contextValue = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    logoSettings,
    setLogoSettings,
    fireEffectEnabled,
    setFireEffectEnabled,
    credits,
    setCredits,
    notificationsEnabled,
    setNotificationsEnabled,
    soundEnabled,
    setSoundEnabled,
    viewMode,
    setViewMode,
    customColumns,
    setCustomColumns,
    projectName,
    setProjectName,
    reorderTasks,
    pendingTasksCount,
    isTask,
    removeTaskByUrl,
    clearTasks,
    setTasks,
    sendNotification,
  }

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  )
}

