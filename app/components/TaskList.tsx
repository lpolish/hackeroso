'use client'

import { Task } from '../types'
import TaskItem from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  status: 'pending' | 'running' | 'completed'
}

export default function TaskList({ tasks, status }: TaskListProps) {
  //const { tasks } = useTaskContext()

  //const filteredTasks = tasks.filter(task => task.status === status)

  return (
    <div className="space-y-2">
      {tasks.map((task, index) => (
        <TaskItem key={task.id} task={task} index={index} />
      ))}
    </div>
  )
}

