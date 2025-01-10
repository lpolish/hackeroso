import { Task } from './types'

const testTask: Task = {
  id: '1',
  title: 'Test Task',
  priority: 'medium',
  status: 'pending',
  expectedDuration: 30,
  source: 'custom',
  projectId: 'default',
  createdAt: new Date().toISOString(),
  accumulatedTime: 0,
  notificationsEnabled: false
}

function updateTaskStatus(task: Task, newStatus: 'pending' | 'running' | 'completed') {
  if (task.status !== newStatus) {
    // This line should not cause a type error
    task.status = newStatus
  }
}

updateTaskStatus(testTask, 'completed')

