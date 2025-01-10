'use client'

import { useState } from 'react'
import { useTaskContext } from '../contexts/TaskContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Grid, ListIcon, Plus, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { toast } from "@/components/ui/use-toast"

const COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
]

export default function ListsPage() {
  const { savedItems, lists, addList, updateSavedItem } = useTaskContext()
  const [viewMode, setViewMode] = useState<'single' | 'multiple'>('multiple')
  const [newListName, setNewListName] = useState('')

  const unlistedItems = savedItems.filter(item => !item.listId)

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault()
    if (newListName.trim()) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      addList({
        name: newListName.trim(),
        color,
      })
      setNewListName('')
      toast({
        title: "List Created",
        description: `New list "${newListName}" has been created.`,
      })
    }
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const itemId = result.draggableId
    const sourceListId = result.source.droppableId
    const destinationListId = result.destination.droppableId

    if (sourceListId !== destinationListId) {
      updateSavedItem(itemId, {
        listId: destinationListId === 'unlisted' ? null : destinationListId,
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Saved Items</h1>
          <div className="flex items-center gap-4">
            <div className="flex rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'multiple' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('multiple')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'single' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('single')}
                className="rounded-l-none"
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <form onSubmit={handleAddList} className="flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="Create new list"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
          <Button type="submit">
            <Plus className="h-4 w-4 mr-2" />
            Add List
          </Button>
        </form>

        <DragDropContext onDragEnd={handleDragEnd}>
          {viewMode === 'single' ? (
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">All Items</h2>
              <div className="space-y-2">
                {savedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded-sm">
                    <Link href={item.url} className="hover:text-primary">
                      {item.title}
                    </Link>
                    {item.listId && (
                      <div 
                        className={`px-2 py-0.5 rounded-full text-xs text-white ${
                          lists.find(l => l.id === item.listId)?.color
                        }`}
                      >
                        {lists.find(l => l.id === item.listId)?.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-4">Unlisted Items</h2>
                <Droppable droppableId="unlisted">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {unlistedItems.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center justify-between p-2 bg-muted rounded-sm"
                            >
                              <Link href={item.url} className="hover:text-primary flex items-center gap-2">
                                {item.title}
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Card>

              {lists.map(list => (
                <Card key={list.id} className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${list.color}`} />
                    <h2 className="text-lg font-semibold">{list.name}</h2>
                  </div>
                  <Droppable droppableId={list.id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {savedItems
                          .filter(item => item.listId === list.id)
                          .map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="flex items-center justify-between p-2 bg-muted rounded-sm"
                                >
                                  <Link href={item.url} className="hover:text-primary flex items-center gap-2">
                                    {item.title}
                                    <ExternalLink className="h-3 w-3" />
                                  </Link>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Card>
              ))}
            </div>
          )}
        </DragDropContext>
      </main>
      <Footer />
    </div>
  )
}

