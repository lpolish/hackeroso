import React from 'react'
import type { Task } from '../types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Calendar, LinkIcon } from 'lucide-react'

interface TaskCardProps {
  task: Task
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
        {task.url && (
          <a href={task.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:text-blue-700 mb-2 flex items-center">
            <LinkIcon className="w-4 h-4 mr-1" />
            {new URL(task.url).hostname}
          </a>
        )}
        <div className="flex items-center space-x-2 mb-2">
          <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {task.expectedDuration} min
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(task.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Status: {task.status}
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 bg-gray-50">
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-xs">
            {task.source}
          </Badge>
          {task.notificationsEnabled && (
            <Badge variant="secondary" className="text-xs">
              Notifications On
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

export default TaskCard

