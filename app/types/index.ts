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

