'use client'

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X } from 'lucide-react'
import { useTaskContext } from '../contexts/TaskContext'

interface SaveItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  url: string
  onSave: (categories: string[]) => void
}

export function SaveItemDialog({
  open,
  onOpenChange,
  title,
  url,
  onSave,
}: SaveItemDialogProps) {
  const { categories, addCategory } = useTaskContext()
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([])
  const [newCategoryName, setNewCategoryName] = React.useState('')

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim())
      setNewCategoryName('')
    }
  }

  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategories(current =>
      current.includes(categoryId)
        ? current.filter(id => id !== categoryId)
        : [...current, categoryId]
    )
  }

  const handleSave = () => {
    onSave(selectedCategories)
    onOpenChange(false)
  }

  React.useEffect(() => {
    if (open) {
      setSelectedCategories([])
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Item</DialogTitle>
          <DialogDescription>
            Add this item to your saved collection and organize it with categories.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-sm">
            <div className="font-medium">{title}</div>
            <div className="text-muted-foreground text-xs truncate">{url}</div>
          </div>
          <div className="space-y-2">
            <form onSubmit={handleAddCategory} className="flex gap-2">
              <Input
                type="text"
                placeholder="Add new category"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="h-8"
              />
              <Button type="submit" size="sm" className="h-8 px-2">
                <Plus className="h-4 w-4" />
              </Button>
            </form>
            <div className="flex flex-wrap gap-1">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategories.includes(category.id) ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handleToggleCategory(category.id)}
                  className="h-6 text-xs"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

