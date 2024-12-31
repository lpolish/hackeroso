'use client'

import { Task } from '@/app/types'
import TaskItem from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  status: 'pending' | 'running' | 'completed'
}

export default function TaskList({ tasks, status }: TaskListProps) {
  return (
    <div className="space-y-2">
      {tasks.map((task, index) => (
        <TaskItem key={task.id} task={task} index={index} />
      ))}
    </div>
  )
}

