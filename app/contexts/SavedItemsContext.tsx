'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { SavedItem } from '../types'
import { useToast } from "../components/ui/use-toast"

interface SavedItemsContextType {
  savedItems: SavedItem[]
  addSavedItem: (item: Omit<SavedItem, 'id'>) => void
  removeSavedItem: (id: string) => void
  isSaved: (id: string) => boolean
}

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(undefined)

export const useSavedItemsContext = () => {
  const context = useContext(SavedItemsContext)
  if (!context) {
    throw new Error('useSavedItemsContext must be used within a SavedItemsProvider')
  }
  return context
}

export const SavedItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const { toast } = useToast()

  // Debug: Log when context is initialized
  useEffect(() => {
    console.log('SavedItemsProvider initialized')
  }, [])

  useEffect(() => {
    const loadSavedItems = () => {
      try {
        const savedItemsJson = localStorage.getItem('savedItems')
        console.log('Loading saved items from localStorage:', savedItemsJson) // Debug
        if (savedItemsJson) {
          const parsedItems = JSON.parse(savedItemsJson)
          console.log('Parsed saved items:', parsedItems) // Debug
          setSavedItems(parsedItems)
        }
      } catch (error) {
        console.error('Error loading saved items:', error)
      }
    }
    loadSavedItems()
  }, [])

  useEffect(() => {
    console.log('Saving items to localStorage:', savedItems) // Debug
    localStorage.setItem('savedItems', JSON.stringify(savedItems))
  }, [savedItems])

  const isSaved = useCallback((id: string) => {
    console.log('Checking if item is saved:', { id, savedItems }) // Debug
    const result = savedItems.some(item => item.id === id)
    console.log('isSaved result:', result) // Debug
    return result
  }, [savedItems])

  const addSavedItem = useCallback((item: Omit<SavedItem, 'id'>) => {
    console.log('Adding new item:', item) // Debug
    const newItem: SavedItem = { ...item, id: item.id || Date.now().toString() }
    setSavedItems(prevItems => {
      const updatedItems = [...prevItems, newItem]
      console.log('Updated saved items after add:', updatedItems) // Debug
      return updatedItems
    })
    toast({
      title: "Item Saved",
      description: `"${item.title}" has been added to your saved items.`,
    })
  }, [toast])

  const removeSavedItem = useCallback((id: string) => {
    console.log('Removing item:', id) // Debug
    setSavedItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id)
      console.log('Updated saved items after remove:', updatedItems) // Debug
      return updatedItems
    })
    toast({
      title: "Item Removed",
      description: "The item has been removed from your saved items.",
    })
  }, [toast])

  const contextValue = {
    savedItems,
    addSavedItem,
    removeSavedItem,
    isSaved,
  }

  return (
    <SavedItemsContext.Provider value={contextValue}>
      {children}
    </SavedItemsContext.Provider>
  )
}

