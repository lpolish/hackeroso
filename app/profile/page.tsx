'use client'

import { useState, useRef, useEffect } from 'react'
import { useTaskContext } from '../contexts/TaskContext'
import { useSavedItemsContext } from '../contexts/SavedItemsContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Users, Download, Upload, Trash2, Edit2, Save, X, Bookmark, ExternalLink, Paintbrush, PlusCircle, MinusCircle, ArrowUpCircle, MessageCircle, Clock, User, Filter, UserMinus } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select"
import {
Popover,
PopoverContent,
PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ErrorBoundary } from 'react-error-boundary'

const LoadingOverlay = () => (
<div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
  <div className="fixed left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2">
    <div className="flex flex-col items-center gap-2">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-r-transparent" />
      <p className="text-sm text-muted-foreground">Loading your data...</p>
    </div>
  </div>
</div>
)

type SavedItem = {
id: string;
title: string;
url: string;
listId: string | null;
author?: string;
createdAt: string;
points?: number;
comments?: number;
};

type List = {
id: string;
name: string;
color: string;
};

function formatDate(timestamp: string): string {
const date = new Date(timestamp)
if (isNaN(date.getTime())) {
  return 'Unknown date'
}
const now = new Date()
const diff = now.getTime() - date.getTime()

if (diff < 24 * 60 * 60 * 1000) {
  const hours = Math.floor(diff / (60 * 60 * 1000))
  if (hours === 0) {
    const minutes = Math.floor(diff / (60 * 1000))
    return `${minutes}m ago`
  }
  return `${hours}h ago`
}

if (diff < 7 * 24 * 60 * 60 * 1000) {
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))
  return `${days}d ago`
}

return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function ErrorFallback({error, resetErrorBoundary}) {
return (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
)
}

export default function ProfilePage() {
const { 
  followers, 
  setFollowers, 
  lists,
  setLists,
  userName,
  setUserName,
  lastSelectedProfileTab,
  setLastSelectedProfileTab,
  addList,
  clearTasks,
  savedItems,
  setSavedItems,
  updateSavedItem,
  removeSavedItem,
  resetUserData,
  addTask,
  isTask,
  removeTaskByUrl,
  notificationsEnabled,
  unfollowUser
} = useTaskContext()
const { isSaved } = useSavedItemsContext()
const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
const [isEditingName, setIsEditingName] = useState(false)
const [newUserName, setNewUserName] = useState(userName)
const [newListName, setNewListName] = useState('')
const fileInputRef = useRef<HTMLInputElement>(null)
const { toast } = useToast()
const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
const [importData, setImportData] = useState<{
  followers?: { [userId: string]: string[] };
  userName?: string;
  savedItems?: SavedItem[];
  lists?: List[];
} | null>(null)
const [isLoading, setIsLoading] = useState(false)
const [activeListIds, setActiveListIds] = useState<string[]>([])
const [userStats, setUserStats] = useState<{
  [key: string]: { karma: number; created: number }
}>({})

const followedUsers = Object.entries(followers)
  .filter(([_, userFollowers]) => userFollowers.includes('currentUser'))
  .map(([userId]) => userId)

useEffect(() => {
  setNewUserName(userName)
}, [userName])

// Add null checks for context values
if (!followers || !lists || !savedItems) {
  return <div>Loading...</div>
}

useEffect(() => {
  async function fetchUserStats() {
    const stats = {}
    for (const userId of followedUsers) {
      try {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/user/${userId}.json`)
        if (response.ok) {
          const data = await response.json()
          stats[userId] = {
            karma: data.karma || 0,
            created: data.created || Date.now(),
          }
        } else {
          console.error(`Failed to fetch stats for ${userId}: ${response.statusText}`)
        }
      } catch (error) {
        console.error(`Error fetching stats for ${userId}:`, error)
      }
    }
    setUserStats(stats)
  }
  
  if (followedUsers.length > 0) {
    fetchUserStats()
  }
}, [followedUsers])

const handleUnfollow = (userId: string) => {
  unfollowUser(userId)
  if (notificationsEnabled) {
    toast({
      title: "User Unfollowed",
      description: `You are no longer following ${userId}.`,
    })
  }
}

const handleExport = () => {
  const dataToExport = {
    followers,
    userName,
    savedItems,
    lists
  };
  const dataStr = JSON.stringify(dataToExport);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  const exportFileDefaultName = 'hackeroso_user_data.json';

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();

  toast({
    title: "User Data Exported",
    description: "Your user data has been exported successfully.",
  });
};

const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  if (file) {
    setIsLoading(true) 
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result
        if (typeof content === 'string') {
          const importedData = JSON.parse(content)
          setImportData(importedData)
          setIsImportDialogOpen(true)
        }
      } catch (error) {
        console.error('Error parsing imported file:', error)
        toast({
          title: "Import Failed",
          description: "There was an error importing your user data. Please check the file and try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false) 
      }
    }
    reader.onerror = () => {
      toast({
        title: "Import Failed",
        description: "There was an error reading the file. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false) 
    }
    reader.readAsText(file)
    event.target.value = ''
  }
}

const handleConfirmImport = async () => {
  if (!importData) return;

  setIsLoading(true);
  try {
    const importTimeout = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Import Timeout",
        description: "The import process took too long. Please try again.",
        variant: "destructive",
      });
    }, 10000);

    if (importData.followers) setFollowers(importData.followers);
    if (importData.userName) setUserName(importData.userName);
    if (importData.savedItems) setSavedItems(importData.savedItems);
    if (importData.lists) setLists(importData.lists);

    clearTimeout(importTimeout);

    toast({
      title: "User Data Imported",
      description: "Your user data has been imported successfully.",
    });
  } catch (error) {
    console.error('Error applying imported data:', error);
    toast({
      title: "Import Failed",
      description: "There was an error applying the imported data.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
    setIsImportDialogOpen(false);
    setImportData(null);
  }
};

const handleReset = () => {
  resetUserData();
  setIsResetDialogOpen(false);
  toast({
    title: "User Data Reset",
    description: "Your user data has been reset, except for your tasks.",
  });
}

const handleSaveName = () => {
  setUserName(newUserName)
  setIsEditingName(false)
  toast({
    title: "Name Updated",
    description: "Your profile name has been updated successfully.",
  })
}

const handleAddList = (e: React.FormEvent) => {
  e.preventDefault()
  if (newListName.trim()) {
    addList({
      name: newListName.trim(),
      color: `bg-${['red', 'blue', 'green', 'yellow', 'purple', 'pink'][Math.floor(Math.random() * 6)]}-500`,
    })
    setNewListName('')
    toast({
      title: "List Created",
      description: `New list "${newListName}" has been created.`,
    })
  }
}

const handleUpdateItemList = (itemId: string, listId: string | null) => {
  updateSavedItem(itemId, { listId: listId === 'unsorted' ? null : listId })
  toast({
    title: "Item Updated",
    description: `The item has been ${listId === 'unsorted' ? 'removed from its list' : 'moved to the selected list'}.`,
  })
}

const handleAddToTask = (item: SavedItem) => {
  addTask({
    title: item.title,
    url: item.url,
    priority: 'medium',
    status: 'pending',
    expectedDuration: 30,
    source: 'saved',
    projectId: 'default'
  })
  toast({
    title: "Task Added",
    description: `"${item.title}" has been added to your tasks.`,
  })
}

const handleRemoveTask = (url: string) => {
  removeTaskByUrl(url)
  if (notificationsEnabled) {
    toast({
      title: "Task Removed",
      description: `The item has been removed from your tasks.`,
    })
  }
}

const toggleListFilter = (listId: string) => {
  setActiveListIds(current => {
    if (current.includes(listId)) {
      return current.filter(id => id !== listId)
    }
    // If adding 'unsorted', remove all other filters
    if (listId === 'unsorted') {
      return ['unsorted']
    }
    // If adding a list and 'unsorted' is active, remove it
    const newFilters = current.filter(id => id !== 'unsorted')
    return [...newFilters, listId]
  })
}

return (
  <div className="min-h-screen flex flex-col bg-background font-mono text-[15px]">
    {isLoading && <LoadingOverlay />}
    <Header />
    <main className="flex-grow container mx-auto px-4 py-8 max-w-[1200px]">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="border-b">
          <div className="container px-4 py-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 min-w-0">
                {isEditingName ? (
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="h-8 text-sm"
                      placeholder="Enter your name"
                    />
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={handleSaveName} className="h-6 w-6 p-0">
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setIsEditingName(false)} className="h-6 w-6 p-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 min-w-0">
                    <h1 className="text-lg font-semibold truncate">{userName || 'Anonymous'}</h1>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingName(true)} className="h-6 w-6 p-0">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{followedUsers.length} followed</span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleExport}
                  className="h-6 px-1.5 text-[10px]"
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Export
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-6 px-1.5 text-[10px]"
                >
                  <Upload className="h-3.5 w-3.5 mr-1" />
                  Import
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsResetDialogOpen(true)}
                  className="h-6 px-1.5 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Reset
                </Button>
                <input
                  type="file"
                  accept=".json"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImport}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container px-4 py-4">
          <Tabs defaultValue={lastSelectedProfileTab} onValueChange={(value) => setLastSelectedProfileTab(value as 'saved' | 'followed')}>
            <TabsList className="mb-4">
              <TabsTrigger value="saved">Saved Items</TabsTrigger>
              <TabsTrigger value="followed">Followed Users</TabsTrigger>
            </TabsList>
            <TabsContent value="saved">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Saved Items</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <ScrollArea className="h-[400px] rounded-md border p-4">
                      {savedItems.length > 0 ? (
                        <div className="grid gap-4">
                          {(activeListIds.length > 0
                            ? savedItems.filter(item => 
                                activeListIds.includes('unsorted')
                                  ? !item.listId || activeListIds.includes(item.listId)
                                  : activeListIds.includes(item.listId)
                              )
                            : savedItems
                          ).map((item) => {
                            const isTaskItem = isTask(item.url);
                            return (
                              <div key={item.id} className="bg-zinc-900/30 hover:bg-zinc-900/50 rounded-sm p-3">
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <h2 className="text-xs font-medium leading-none">
                                        <Link 
                                          href={item.url} 
                                          className="text-zinc-100 hover:text-orange-400"
                                        >
                                          {item.title}
                                        </Link>
                                      </h2>
                                    </div>
                                    {isTaskItem && (
                                      <Badge variant="secondary" className="text-xs">
                                        task
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center text-xs text-zinc-400 space-x-2">
                                    <Link 
                                      href={item.url} 
                                      className="hover:text-orange-400 flex items-center gap-1"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      {new URL(item.url).hostname.replace(/^www\./, '')}
                                    </Link>
                                    {item.author && (
                                      <>
                                        <span>•</span>
                                        <Link 
                                          href={`/user/${item.author}`}
                                          className="hover:text-orange-400 flex items-center gap-1"
                                        >
                                          <User className="h-3 w-3" />
                                          {item.author}
                                        </Link>
                                      </>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <Select
                                      value={item.listId || 'unsorted'}
                                      onValueChange={(value) => handleUpdateItemList(item.id, value === 'unsorted' ? null : value)}
                                    >
                                      <SelectTrigger className="h-6 text-[10px] w-[120px]">
                                        <SelectValue placeholder="Select a list" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="unsorted">Unsorted</SelectItem>
                                        {lists.map((list) => (
                                          <SelectItem key={list.id} value={list.id}>{list.name}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => isTaskItem ? handleRemoveTask(item.url) : handleAddToTask(item)}
                                        className="h-6 px-1.5 text-[10px] text-zinc-400 hover:text-orange-400"
                                      >
                                        {isTaskItem ? (
                                          <>
                                            <MinusCircle className="h-3 w-3 mr-1" />
                                            Remove Task
                                          </>
                                        ) : (
                                          <>
                                            <PlusCircle className="h-3 w-3 mr-1" />
                                            Add Task
                                          </>
                                        )}
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => removeSavedItem(item.id)} 
                                        className="h-6 px-1.5 text-[10px] text-zinc-400 hover:text-orange-400"
                                      >
                                        <Trash2 className="h-3 w-3 mr-1" />
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">You have no saved items yet.</p>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Lists</CardTitle>
                      {activeListIds.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveListIds([])}
                          className="h-6 px-1.5 text-[10px]"
                        >
                          <Filter className="h-3.5 w-3.5 mr-1" />
                          Reset Filters
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <form onSubmit={handleAddList} className="flex gap-2 mb-4">
                      <Input
                        type="text"
                        placeholder="New list name"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className="h-7"
                      />
                      <Button type="submit" size="sm" className="h-7">Add List</Button>
                    </form>
                    {lists.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors
                                ${activeListIds.includes('unsorted') 
                                  ? 'bg-primary text-primary-foreground border-transparent' 
                                  : 'text-muted-foreground border-border hover:border-primary'}`}
                            >
                              Unsorted
                              <span className="inline-flex items-center justify-center bg-black/20 rounded-full px-2 py-0.5 text-xs">
                                {savedItems.filter(item => !item.listId).length}
                              </span>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">Unsorted Items</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleListFilter('unsorted')}
                                  className={activeListIds.includes('unsorted') ? 'text-primary' : ''}
                                >
                                  {activeListIds.includes('unsorted') ? 'Hide' : 'Show Only'}
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Items that haven't been assigned to any list
                              </p>
                            </div>
                          </PopoverContent>
                        </Popover>
                        {lists.map((list) => {
                          const itemCount = savedItems.filter(item => item.listId === list.id).length;
                          return (
                            <Popover key={list.id}>
                              <PopoverTrigger asChild>
                                <button
                                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm text-white transition-colors 
                                    ${list.color} hover:opacity-90 ${activeListIds.includes(list.id) ? 'ring-2 ring-offset-2 ring-offset-background' : ''}`}
                                >
                                  {list.name}
                                  <span className="inline-flex items-center justify-center bg-black/20 rounded-full px-2 py-0.5 text-xs">
                                    {itemCount}
                                  </span>
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-64">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium text-sm">{list.name}</h4>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleListFilter(list.id)}
                                        className={activeListIds.includes(list.id) ? 'text-primary' : ''}
                                      >
                                        {activeListIds.includes(list.id) ? 'Restore' : 'Show Only'}
                                      </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {itemCount} item{itemCount !== 1 ? 's' : ''} in this list
                                    </p>
                                  </div>
                                  
                                  <Separator />
                                  
                                  <div className="space-y-2">
                                    <h4 className="font-medium text-sm">List Color</h4>
                                    <div className="grid grid-cols-5 gap-2">
                                      {['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'cyan', 'teal', 'orange'].map((color) => (
                                        <Button
                                          key={color}
                                          className={`w-8 h-8 rounded-full bg-${color}-500 hover:bg-${color}-600`}
                                          onClick={() => {
                                            const updatedLists = lists.map(l =>
                                              l.id === list.id ? { ...l, color: `bg-${color}-500` } : l
                                            );
                                            setLists(updatedLists);
                                            toast({
                                              title: "List Color Updated",
                                              description: `The color for "${list.name}" has been updated.`,
                                            });
                                          }}
                                        />
                                      ))}
                                    </div>
                                  </div>

                                  <Separator />

                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 w-full justify-start"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete List
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete List</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete "{list.name}"? This will move {itemCount} item{itemCount !== 1 ? 's' : ''} to Unsorted.
                                          This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={async () => {
                                            // Move saved items to unsorted before deleting the list
                                            await Promise.all(savedItems
                                              .filter(item => item.listId === list.id)
                                              .map(async item => {
                                                await updateSavedItem(item.id, { listId: null });
                                              })
                                            );
                                            const updatedLists = lists.filter(l => l.id !== list.id);
                                            setLists(updatedLists);
                                            // Remove from active filters if present
                                            if (activeListIds.includes(list.id)) {
                                              setActiveListIds(activeListIds.filter(id => id !== list.id));
                                            }
                                            toast({
                                              title: "List Deleted",
                                              description: `The list "${list.name}" has been deleted.`,
                                            });
                                          }}
                                          className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                        >
                                          Delete List
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </PopoverContent>
                            </Popover>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">You have no lists yet.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="followed">
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-base">Followed Users</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  {followedUsers.length > 0 ? (
                    <div className="space-y-2">
                      {followedUsers.map((userId) => (
                        <div 
                          key={userId}
                          className="flex items-center justify-between py-1.5 px-2 rounded-sm bg-muted/30 hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Link
                              href={`/user/${userId}`}
                              className="text-xs font-medium text-primary hover:underline truncate"
                            >
                              {userId}
                            </Link>
                            <div className="flex items-center gap-1.5">
                              <Badge variant="secondary" className="text-[9px] px-1 py-0">
                                {userStats[userId]?.karma || '0'} karma
                              </Badge>
                              <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                                joined {formatDate(userStats[userId]?.created || Date.now())}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnfollow(userId)}
                            className="h-6 px-1.5 text-[10px] text-muted-foreground hover:text-destructive"
                          >
                            <UserMinus className="h-3 w-3 mr-1" />
                            Unfollow
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">You are not following any users yet.</p>
                  )}
                </CardContent>
                <CardFooter className="p-4 border-t bg-muted/40">
                  <p className="text-xs text-muted-foreground">
                    The followers functionality is exclusive to Hackeroso and does not affect your Hacker News profile.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ErrorBoundary>
    </main>
    <Footer />

    <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will reset all your user data, including followed users and saved items, but will keep your tasks intact. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <AlertDialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Import Data</AlertDialogTitle>
          <AlertDialogDescription>
            This will replace your current data:
            {importData && (
              <>
                <ul className="list-disc pl-5 mt-2 mb-2">
                  {importData.followers && (
                    <li>{Object.keys(importData.followers).length} followed users</li>
                  )}
                  {importData.savedItems && (
                    <li>{importData.savedItems.length} saved items</li>
                  )}
                  {importData.lists && (
                    <li>{importData.lists.length} lists</li>
                  )}
                  {importData.userName && (
                    <li>Profile name: {importData.userName}</li>
                  )}
                </ul>
                <p className="text-sm font-medium text-destructive">
                  Your current data will be replaced. This action cannot be undone.
                </p>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            setIsImportDialogOpen(false);
            setImportData(null);
                    }}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmImport}>
            Import
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
)
}

