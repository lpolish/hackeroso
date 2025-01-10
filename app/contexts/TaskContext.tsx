'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Task, LogoSettings, SavedItem, Category, List } from '../types'
import { useToast } from "../components/ui/use-toast"

interface TaskContextType {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'totalElapsedTime'>) => void
  updateTask: (task: Partial<Task> & { id: string }) => void
  deleteTask: (id: string) => void
  logoSettings: LogoSettings
  setLogoSettings: React.Dispatch<React.SetStateAction<LogoSettings>>
  fireEffectEnabled: boolean
  setFireEffectEnabled: React.Dispatch<React.SetStateAction<boolean>>
  credits: { free: number; paid: number }
  setCredits: React.Dispatch<React.SetStateAction<{ free: number; paid: number }>>
  notificationsEnabled: boolean;
  setNotificationsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
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
  savedItems: SavedItem[]
  categories: Category[]
  addSavedItem: (item: Omit<SavedItem, 'id'>) => void
  removeSavedItem: (id: string) => void
  addCategory: (name: string) => void
  removeCategory: (id: string) => void
  updateSavedItemCategories: (itemId: string, categories: string[]) => void
  lists: List[]
  addList: (list: Omit<List, 'id'>) => void
  updateSavedItem: (id: string, updates: Partial<SavedItem>) => void;
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  followers: { [userId: string]: string[] };
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  setFollowers: React.Dispatch<React.SetStateAction<{ [userId: string]: string[] }>>;
  calculateElapsedTime: (task: Task) => number;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  lastSelectedProfileTab: 'saved' | 'followed';
  setLastSelectedProfileTab: React.Dispatch<React.SetStateAction<'saved' | 'followed'>>;
  resetUserData: () => void;
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
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'canvas'>('canvas')
  const [customColumns, setCustomColumns] = useState<string[]>([])
  const [projectName, setProjectName] = useState('Tasks')
  const [pendingTasksCount, setPendingTasksCount] = useState(0)
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [lists, setLists] = useState<List[]>([])
  const [followers, setFollowers] = useState<{ [userId: string]: string[] }>({});
  const [userName, setUserName] = useState<string>('User')
  const [lastSelectedProfileTab, setLastSelectedProfileTab] = useState<'saved' | 'followed'>('saved');
  const { toast } = useToast()

  const loadState = useCallback(() => {
    try {
      const savedState = localStorage.getItem('taskAIState')
      console.log('Loading saved state from localStorage:', savedState) // Debug log

      if (savedState) {
        const parsedState = JSON.parse(savedState)
        console.log('Parsed saved state:', parsedState) // Debug log

        if (typeof parsedState === 'object' && parsedState !== null) {
          // Load saved items first to ensure they're available
          if (Array.isArray(parsedState.savedItems)) {
            console.log('Setting saved items:', parsedState.savedItems) // Debug log
            setSavedItems(parsedState.savedItems)
          }

          setTasks(Array.isArray(parsedState.tasks) ? parsedState.tasks.map((task: any) => ({
            ...task,
            startedAt: task.startedAt ? new Date(task.startedAt).toISOString() : undefined,
            lastPausedAt: task.lastPausedAt ? new Date(task.lastPausedAt).toISOString() : undefined,
            totalElapsedTime: typeof task.totalElapsedTime === 'number' ? task.totalElapsedTime : 0,
          })) : [])
          setLogoSettings(parsedState.logoSettings || { style: 'animated' })
          setFireEffectEnabled(!!parsedState.fireEffectEnabled)
          setCredits(parsedState.credits || { free: 10, paid: 0 })
          setNotificationsEnabled(parsedState.notificationsEnabled ?? true);
          setSoundEnabled(parsedState.soundEnabled ?? true)
          setViewMode(parsedState.viewMode || 'canvas')
          setCustomColumns(Array.isArray(parsedState.customColumns) ? parsedState.customColumns : [])
          setProjectName(parsedState.projectName || 'Tasks')
          setSavedItems(Array.isArray(parsedState.savedItems) ? parsedState.savedItems : [])
          setCategories(Array.isArray(parsedState.categories) ? parsedState.categories : [])
          setLists(Array.isArray(parsedState.lists) ? parsedState.lists : [])
          setFollowers(parsedState.followers || {});
          setUserName(parsedState.userName || 'User')
          setLastSelectedProfileTab(parsedState.lastSelectedProfileTab || 'saved');
        }
      }
    } catch (error) {
      console.error('Error loading saved state:', error)
      // Reset to default state on error
      setTasks([])
      setLogoSettings({ style: 'animated' })
      setFireEffectEnabled(true)
      setCredits({ free: 10, paid: 0 })
      setNotificationsEnabled(false)
      setSoundEnabled(true)
      setViewMode('canvas')
      setCustomColumns([])
      setProjectName('Tasks')
      setSavedItems([])
      setCategories([])
      setLists([])
      setFollowers({});
      setUserName('User')
      setLastSelectedProfileTab('saved');
    }
  }, [])

  useEffect(() => {
    loadState()
  }, [loadState])

  const saveState = useCallback(() => {
    try {
      console.log('Saving state with saved items:', savedItems) // Debug log
      const state = {
        tasks,
        logoSettings: logoSettings || { style: 'animated' },
        fireEffectEnabled: !!fireEffectEnabled,
        credits: credits || { free: 10, paid: 0 },
        notificationsEnabled: !!notificationsEnabled,
        soundEnabled: !!soundEnabled,
        viewMode: viewMode || 'canvas',
        customColumns: customColumns || [],
        projectName: projectName || 'Tasks',
        savedItems: savedItems || [],
        categories: categories || [],
        lists: lists || [],
        followers: followers || {},
        userName,
        lastSelectedProfileTab,
      }
      localStorage.setItem('taskAIState', JSON.stringify(state))
    } catch (error) {
      console.error('Error saving state:', error)
      // Attempt to clear localStorage if it's full
      try {
        localStorage.clear()
        localStorage.setItem('taskAIState', JSON.stringify({
          tasks: [],
          logoSettings: { style: 'animated' },
          fireEffectEnabled: true,
          credits: { free: 10, paid: 0 },
          notificationsEnabled: false,
          soundEnabled: true,
          viewMode: 'canvas',
          customColumns: [],
          projectName: 'Tasks',
          savedItems: [],
          categories: [],
          lists: [],
          followers: {},
          userName: 'User',
          lastSelectedProfileTab: 'saved',
        }))
      } catch (clearError) {
        console.error('Error clearing localStorage:', clearError)
      }
    }
  }, [tasks, logoSettings, fireEffectEnabled, credits, notificationsEnabled, soundEnabled, viewMode, customColumns, projectName, savedItems, categories, lists, followers, userName, lastSelectedProfileTab])

  useEffect(() => {
    saveState()
  }, [saveState, tasks, logoSettings, fireEffectEnabled, credits, notificationsEnabled, soundEnabled, viewMode, customColumns, projectName, savedItems, categories, lists, followers, userName, lastSelectedProfileTab])

  useEffect(() => {
    const pendingCount = tasks.filter(task => task.status === 'pending').length
    setPendingTasksCount(pendingCount)
  }, [tasks])

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'totalElapsedTime'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      totalElapsedTime: 0,
      notificationsEnabled: notificationsEnabled,
    }
    setTasks(prevTasks => [newTask, ...prevTasks])
    if (notificationsEnabled) {
      toast({
        title: "Task Added",
        description: `New task "${newTask.title}" has been added.`,
      })
    }
  }, [toast, notificationsEnabled])

  const updateTask = useCallback((updatedTask: Partial<Task> & { id: string }) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === updatedTask.id) {
        const newTask = { ...task, ...updatedTask };

        // Notification toggle toast
        if (newTask.notificationsEnabled !== task.notificationsEnabled && notificationsEnabled) {
          toast({
            title: newTask.notificationsEnabled ? "Notifications Enabled" : "Notifications Disabled",
            description: `Notifications for task "${task.title}" have been ${newTask.notificationsEnabled ? 'enabled' : 'disabled'}.`,
          });
        }

        // Handle task starting
        if (newTask.status === 'running' && !task.startedAt) {
          newTask.startedAt = new Date().toISOString();
          newTask.lastPausedAt = undefined;
        }

        // Handle task pausing
        if (newTask.status === 'pending' && task.status === 'running') {
          const now = new Date();
          const startTime = new Date(task.startedAt || now);
          const additionalTime = now.getTime() - startTime.getTime();
          newTask.totalElapsedTime = (task.totalElapsedTime || 0) + additionalTime;
          newTask.lastPausedAt = now.toISOString();
          newTask.startedAt = undefined;
        }

        // Handle task resuming
        if (newTask.status === 'running' && task.status === 'pending') {
          newTask.startedAt = new Date().toISOString();
          newTask.lastPausedAt = undefined;
        }

        // Handle task completion
        if (newTask.status === 'completed' && task.status !== 'completed') {
          newTask.completedAt = new Date().toISOString();
          if (task.status === 'running' && task.startedAt) {
            const now = new Date();
            const startTime = new Date(task.startedAt);
            newTask.totalElapsedTime = (task.totalElapsedTime || 0) + (now.getTime() - startTime.getTime());
          }
          newTask.startedAt = undefined;
          newTask.lastPausedAt = undefined;
        }

        return newTask;
      }
      return task;
    }));
  }, [toast, notificationsEnabled])

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
    return tasks.some(task => task.url === url);
  }, [tasks])

  const removeTaskByUrl = useCallback((url: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.url !== url));
  }, [])

  const requestNotificationPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return false;
    }

    let permission = await Notification.requestPermission();
    return permission === "granted";
  }, [])

  const sendNotification = useCallback((title: string, body: string) => {
    if (!notificationsEnabled) return;
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
    toast({
      title: title,
      description: body,
    })
  }, [notificationsEnabled, toast])

  const clearTasks = useCallback(() => {
    setTasks([]);
  }, [])

  const addSavedItem = useCallback((item: Omit<SavedItem, 'id'>) => {
    console.log('Adding saved item:', item) // Debug log
    const newItem: SavedItem = {
      ...item,
      id: item.id || Date.now().toString(),
      listId: null,
      createdAt: new Date().toISOString(), // Add this line to ensure we always have a creation date
    }
    setSavedItems(prevItems => {
      const updatedItems = [...prevItems, newItem]
      console.log('Updated saved items:', updatedItems) // Debug log
      return updatedItems
    })

    toast({
      title: "Item Saved",
      description: `"${item.title}" has been added to your saved items.`,
    })
  }, [toast])

  const removeSavedItem = useCallback((id: string) => {
    console.log('Removing saved item:', id) // Debug log
    setSavedItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id)
      console.log('Updated saved items after removal:', updatedItems) // Debug log
      return updatedItems
    })

    toast({
      title: "Item Removed",
      description: "The item has been removed from your saved items.",
    })
  }, [toast])

  useEffect(() => {
    console.log('Saving state due to savedItems change:', savedItems) // Debug log
    saveState()
  }, [savedItems, saveState])

  const addCategory = useCallback((name: string) => {
    const newCategory: Category = { id: Date.now().toString(), name }
    setCategories(prevCategories => [...prevCategories, newCategory])
  }, [])

  const removeCategory = useCallback((id: string) => {
    setCategories(prevCategories => prevCategories.filter(category => category.id !== id))
    setSavedItems(prevItems => prevItems.map(item => ({
      ...item,
      categories: item.categories.filter(catId => catId !== id)
    })))
  }, [])

  const updateSavedItemCategories = useCallback((itemId: string, categories: string[]) => {
    setSavedItems(prevItems => prevItems.map(item =>
      item.id === itemId ? { ...item, categories } : item
    ))
  }, [])

  const addList = useCallback((list: Omit<List, 'id'>) => {
    const newList: List = {
      ...list,
      id: Date.now().toString(),
    }
    setLists(prev => [...prev, newList])
  }, [])

  const updateSavedItem = useCallback((id: string, updates: Partial<SavedItem>) => {
    setSavedItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ))
  }, [])

  const followUser = useCallback((userId: string) => {
     setFollowers(prev => ({
       ...prev,
       [userId]: [...new Set([...(prev[userId] || []), 'currentUser'])]
     }));
   }, []);

  const unfollowUser = useCallback((userId: string) => {
     setFollowers(prev => ({
       ...prev,
       [userId]: (prev[userId] || []).filter(id => id !== 'currentUser')
     }));
   }, []);

  const calculateElapsedTime = useCallback((task: Task) => {
    let elapsedTime = task.totalElapsedTime || 0;
    if (task.status === 'running' && task.startedAt) {
      const now = new Date();
      const startTime = new Date(task.startedAt);
      elapsedTime += now.getTime() - startTime.getTime();
    }
    return elapsedTime;
  }, [])

  const resetUserData = useCallback(() => {
    setFollowers({});
    setUserName('User');
    setSavedItems([]);
    setLists([]);
    // Note: We're not clearing tasks here
  }, []);

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
    requestNotificationPermission,
    sendNotification,
    clearTasks,
    setTasks,
    savedItems,
    categories,
    addSavedItem,
    removeSavedItem,
    addCategory,
    removeCategory,
    updateSavedItemCategories,
    lists,
    addList,
    updateSavedItem,
    setLists,
    followers,
    followUser,
    unfollowUser,
    setFollowers,
    calculateElapsedTime,
    userName,
    setUserName,
    lastSelectedProfileTab,
    setLastSelectedProfileTab,
    resetUserData,
  }

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  )
}

