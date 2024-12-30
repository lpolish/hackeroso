'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import { useTaskContext } from '../contexts/TaskContext'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { PenLine, Plus, Save, FolderOpen } from 'lucide-react'
import { useToast } from "@/app/components/ui/use-toast"
import { useTheme } from 'next-themes'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog"

export default function TaskManager() {
  const {
    tasks,
    updateTask,
    deleteTask,
    viewMode,
    setViewMode,
    reorderTasks,
    projectName,
    setProjectName,
  } =useTaskContext()
  const [isMobile, setIsMobile] = useState(false)
  const [isEditingProjectName, setIsEditingProjectName] = useState(false)
  const [newProjectName, setNewProjectName] = useState(projectName)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'new' | 'load' | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const pendingTasks = tasks.filter(task => task.status === 'pending')
  const runningTasks = tasks.filter(task => task.status === 'running')
  const completedTasks = tasks.filter(task => task.status === 'completed')

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    // Dropped outside the list
    if (!destination) {
      return
    }

    // Reorder within the same list
    if (source.droppableId === destination.droppableId) {
      reorderTasks(source.droppableId as 'pending' | 'running' | 'completed', source.index, destination.index)
    } else {
      // Move to a different list
      const newStatus = destination.droppableId as 'pending' | 'running' | 'completed'
      const taskId = result.draggableId
      const task = tasks.find(t => t.id === taskId)
      if (task) {
        updateTask({
          ...task,
          status: newStatus
        })
        reorderTasks(newStatus, source.index, destination.index)
      }
    }
  }

  const handleProjectNameEdit = () => {
    setIsEditingProjectName(true)
  }

  const handleProjectNameSave = () => {
    setProjectName(newProjectName)
    setIsEditingProjectName(false)
  }

  const handleProjectNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleProjectNameSave()
    } else if (e.key === 'Escape') {
      setNewProjectName(projectName)
      setIsEditingProjectName(false)
    }
  }

  const exportProject = () => {
    const projectData = {
      name: projectName,
      tasks: tasks
    }
    const dataStr = JSON.stringify(projectData)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `${projectName.replace(/\s+/g, '_')}_tasks.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Project exported",
      description: "Your project has been successfully exported.",
    })
  }

  const importProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result
          if (typeof content === 'string') {
            const importedData = JSON.parse(content)
            setProjectName(importedData.name)
            // Here you would also update the tasks in your context
            // This depends on how your context is set up to handle bulk updates
            toast({
              title: "Project imported",
              description: "Your project has been successfully imported.",
            })
          }
        } catch (error) {
          console.error('Error parsing imported file:', error)
          toast({
            title: "Import failed",
            description: "There was an error importing your project. Please check the file and try again.",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    }
  }

  const handleNewProject = () => {
    if (tasks.length > 0) {
      setConfirmAction('new')
      setIsConfirmDialogOpen(true)
    } else {
      // If no tasks, just create a new project without confirmation
      setProjectName('New Project')
      // Clear tasks (you'll need to implement this in your context)
    }
  }

  const handleLoadProject = () => {
    if (tasks.length > 0) {
      setConfirmAction('load')
      setIsConfirmDialogOpen(true)
    } else {
      // If no tasks, just trigger file input without confirmation
      document.getElementById('file-input')?.click()
    }
  }

  const handleConfirmAction = () => {
    if (confirmAction === 'new') {
      setProjectName('New Project')
      // Clear tasks (you'll need to implement this in your context)
    } else if (confirmAction === 'load') {
      document.getElementById('file-input')?.click()
    }
    setIsConfirmDialogOpen(false)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 mb-6">
            {isEditingProjectName ? (
              <Input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onBlur={handleProjectNameSave}
                onKeyDown={handleProjectNameKeyDown}
                className="text-3xl font-bold"
              />
            ) : (
              <h1 className="text-2xl font-bold">{projectName}</h1>
            )}
            <Button variant="ghost" size="icon" onClick={handleProjectNameEdit}>
              <PenLine className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleNewProject}>
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
            <Button variant="outline" size="sm" onClick={exportProject}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleLoadProject}>
              <FolderOpen className="h-4 w-4 mr-2" />
              Load
            </Button>
            <input
              id="file-input"
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={importProject}
            />
          </div>
        </div>

        <TaskForm />

        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground mt-12">
            <p className="text-lg font-medium mb-2">No tasks yet</p>
            <p className="text-sm">Add a task using the form above to get started</p>
          </div>
        ) : (
          <div className={`mt-6 ${isMobile ? 'space-y-4' : ''}`}>
            {!isMobile && (
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Task Board</h2>
              </div>
            )}
            
            <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-3 gap-4'}`}>
              {isMobile ? (
                <>
                  {runningTasks.length > 0 && (
                    <Droppable droppableId="running">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          <TaskList tasks={runningTasks} status="running" />
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}
                  {pendingTasks.length > 0 && (
                    <Droppable droppableId="pending">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          <h3 className="text-sm font-medium mb-2">Pending</h3>
                          <TaskList tasks={pendingTasks} status="pending" />
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}
                </>
              ) : (
                <>
                  <Droppable droppableId="pending">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium">Pending</h3>
                          <span className="text-xs text-muted-foreground">{pendingTasks.length} tasks</span>
                        </div>
                        <TaskList tasks={pendingTasks} status="pending" />
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <Droppable droppableId="running">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium">Running</h3>
                          <span className="text-xs text-muted-foreground">{runningTasks.length} task</span>
                        </div>
                        <TaskList tasks={runningTasks} status="running" />
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <Droppable droppableId="completed">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium">Completed</h3>
                          <span className="text-xs text-muted-foreground">{completedTasks.length} task</span>
                        </div>
                        <TaskList tasks={completedTasks} status="completed" />
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              {confirmAction === 'new'
                ? "Are you sure you want to start a new project? This will clear all current tasks."
                : "Are you sure you want to load a new project? This will replace all current tasks."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmAction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DragDropContext>
  )
}

