import React, { useEffect, useRef } from 'react'
import { Search } from 'lucide-react'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  handleSearch: (e: React.FormEvent) => void
  searchButtonRef: React.RefObject<HTMLButtonElement>
}

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  handleSearch,
  searchButtonRef
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, searchButtonRef])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-full max-w-md"
      >
        <form onSubmit={handleSearch} className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-green-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
        </form>
      </div>
    </div>
  )
}

export default SearchModal

