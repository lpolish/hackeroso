'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Task, LogoSettings } from '@/app/types'

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
  requestNotificationPermission: () => Promise<boolean>
  sendNotification: (title: string, body: string) => void
  clearTasks: () => void
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
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
    const pendingCount = tasks.filter(task => task.status === 'pending').length;
    setPendingTasksCount(pendingCount);
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'accumulatedTime'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      accumulatedTime: 0,
      notificationsEnabled: false,
    }
    setTasks(prevTasks => [newTask, ...prevTasks])
  }

  const updateTask = (updatedTask: Partial<Task> & { id: string }) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === updatedTask.id) {
        const newTask = { ...task, ...updatedTask }

        // Handle task starting
        if (newTask.status === 'running' && !task.startedAt && !newTask.isPaused) {
          newTask.startedAt = new Date().toISOString()
          newTask.lastPausedAt = undefined
        }

        // Handle task pausing
        if (newTask.isPaused && !task.isPaused && task.startedAt) {
          const now = new Date()
          const startTime = new Date(task.startedAt)
          const additionalTime = now.getTime() - startTime.getTime()
          newTask.accumulatedTime = (task.accumulatedTime || 0) + additionalTime
          newTask.lastPausedAt = now.toISOString()
        }

        // Handle task resuming
        if (!newTask.isPaused && task.isPaused) {
          newTask.startedAt = new Date().toISOString()
          newTask.lastPausedAt = undefined
        }

        // Handle task completion
        if (newTask.status === 'completed' && task.status !== 'completed') {
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
  }

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
  }

  const reorderTasks = (status: 'pending' | 'running' | 'completed', startIndex: number, endIndex: number) => {
    setTasks(prevTasks => {
      const result = Array.from(prevTasks)
      const [reorderedItem] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, reorderedItem)
      return result
    })
  }

  const isTask = (url: string) => {
    return tasks.some(task => task.url === url);
  };

  const removeTaskByUrl = (url: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.url !== url));
  };

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return false;
    }

    let permission = await Notification.requestPermission();
    return permission === "granted";
  };

  const sendNotification = (title: string, body: string) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  const clearTasks = () => {
    setTasks([]);
  };

  return (
    <TaskContext.Provider value={{
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
      requestNotificationPermission,
      sendNotification,
      clearTasks,
      setTasks,
    }}>
      {children}
    </TaskContext.Provider>
  )
}

