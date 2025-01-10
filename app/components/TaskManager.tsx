'use client'

import { useState, useEffect, useCallback } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import { useTaskContext, Task } from '../contexts/TaskContext'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { PenLine, Plus, Save, FolderOpen, Play, Pause, CheckCircle } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function TaskManager() {
  const {
    tasks,
    updateTask,
    deleteTask,
    reorderTasks,
    projectName,
    setProjectName,
    clearTasks,
    setTasks,
    calculateElapsedTime
  } = useTaskContext()
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

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result

    if (!destination) {
      return
    }

    if (source.droppableId === destination.droppableId) {
      reorderTasks(source.droppableId as 'pending' | 'running' | 'completed', source.index, destination.index)
    } else {
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
  }, [tasks, updateTask, reorderTasks])

  const handleProjectNameEdit = useCallback(() => {
    setIsEditingProjectName(true)
  }, [])

  const handleProjectNameSave = useCallback(() => {
    setProjectName(newProjectName)
    setIsEditingProjectName(false)
  }, [newProjectName, setProjectName])

  const handleProjectNameKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleProjectNameSave()
    } else if (e.key === 'Escape') {
      setNewProjectName(projectName)
      setIsEditingProjectName(false)
    }
  }, [handleProjectNameSave, projectName])

  const exportProject = useCallback(() => {
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
  }, [projectName, tasks, toast])

  const importProject = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result
          if (typeof content === 'string') {
            const importedData = JSON.parse(content)
            setProjectName(importedData.name)
            setTasks(importedData.tasks)
            toast({
              title: "Project Imported",
              description: `Project "${importedData.name}" has been successfully imported with ${importedData.tasks.length} tasks.`,
            })
          }
        } catch (error) {
          console.error('Error parsing imported file:', error)
          toast({
            title: "Import Failed",
            description: "There was an error importing your project. Please check the file and try again.",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    }
  }, [setProjectName, setTasks, toast])

  const handleNewProject = useCallback(() => {
    if (tasks.length > 0) {
      setConfirmAction('new')
      setIsConfirmDialogOpen(true)
    } else {
      createNewProject()
    }
  }, [tasks.length])

  const handleLoadProject = useCallback(() => {
    if (tasks.length > 0) {
      setConfirmAction('load')
      setIsConfirmDialogOpen(true)
    } else {
      document.getElementById('file-input')?.click()
    }
  }, [tasks.length])

  const handleConfirmAction = useCallback(() => {
    if (confirmAction === 'new') {
      createNewProject()
    } else if (confirmAction === 'load') {
      document.getElementById('file-input')?.click()
    }
    setIsConfirmDialogOpen(false)
  }, [confirmAction])

  const createNewProject = useCallback(() => {
    setProjectName('New Project')
    clearTasks()
    toast({
      title: "New Project Created",
      description: "A new project has been started with an empty task list.",
    })
  }, [setProjectName, clearTasks, toast])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center gap-2">
            {isEditingProjectName ? (
              <Input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onBlur={handleProjectNameSave}
                onKeyDown={handleProjectNameKeyDown}
                className="text-2xl font-bold"
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

        <div className="mb-6">
          <TaskForm />
        </div>

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
                          <h3 className="text-sm font-medium mb-2">Running</h3>
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
                  {completedTasks.length > 0 && (
                    <Droppable droppableId="completed">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          <h3 className="text-sm font-medium mb-2">Completed</h3>
                          <TaskList tasks={completedTasks} status="completed" />
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
                          <span className="text-xs text-muted-foreground">{runningTasks.length} tasks</span>
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
                          <span className="text-xs text-muted-foreground">{completedTasks.length} tasks</span>
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

