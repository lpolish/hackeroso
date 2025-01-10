export interface Task {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'running' | 'completed'
  expectedDuration: number
  source: 'custom' | 'hackernews'
  projectId: string
  createdAt: string
  startedAt?: string
  completedAt?: string
  url?: string
  isPaused?: boolean
  accumulatedTime: number
  lastPausedAt?: string
  notificationsEnabled: boolean
}

export interface LogoSettings {
  style: 'animated' | 'static'
}

export interface SavedItem {
  id: string
  title: string
  url: string
  listId: string | null
}

export interface Category {
  id: string
  name: string
}

export interface List {
  id: string
  name: string
  color: string
}

export interface User {
  id: string
  created: number
  karma: number
  about?: string
  submitted?: number[]
}

export interface Item {
  id: number
  type: string
  by: string
  time: number
  text?: string
  parent?: number
  kids?: number[]
  url?: string
  score?: number
  title?: string
  descendants?: number
}

