'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTaskContext } from '../contexts/TaskContext'

interface SettingsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsSheet({ open, onOpenChange }: SettingsSheetProps) {
  const {
    viewMode,
    setViewMode,
    projectName,
    setProjectName,
  } = useTaskContext()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="canvas-view">Canvas View</Label>
            <Switch
              id="canvas-view"
              checked={viewMode === 'canvas'}
              onCheckedChange={(checked) => setViewMode(checked ? 'canvas' : 'list')}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

