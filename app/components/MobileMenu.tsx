'use client'

import Link from 'next/link'
import { X, Search, Moon, Sun, Laptop, LogIn, Send } from 'lucide-react'
import { useEffect } from 'react'
import { Badge } from "./ui/badge"

type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
  navItems: Array<{ href: string; label: string; icon: React.ElementType }>
  isActive: (path: string) => boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  handleSearch: (e: React.FormEvent) => void
  theme: 'light' | 'dark' | 'system'
  toggleTheme: () => void
  pendingTasksCount: number
}

export default function MobileMenu({
  isOpen,
  onClose,
  navItems,
  isActive,
  searchQuery,
  setSearchQuery,
  handleSearch,
  theme,
  toggleTheme,
  pendingTasksCount
}: MobileMenuProps) {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        onClose()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 md:hidden
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-zinc-900 z-[60] 
                   transform transition-transform duration-300 ease-in-out shadow-xl md:hidden
                   ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
            <div className="group relative">
              <Link href="/" className="text-lg font-bold tracking-tighter bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent" onClick={onClose}>
                hackeroso
              </Link>
              <div className="absolute -bottom-3 left-0 w-full overflow-hidden h-4 pointer-events-none">
                <span className="text-[0.65rem] font-medium text-orange-500 transform translate-y-4 transition-transform duration-200 block text-center group-hover:translate-y-0 group-active:translate-y-0">
                  HACKER NEWS VIBROSO
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full text-gray-700 dark:text-gray-400"
              aria-label="close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-green-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            </form>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium
                             ${isActive(item.href) 
                               ? 'text-orange-500 bg-orange-50 dark:text-green-400 dark:bg-zinc-800' 
                               : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                             }`}
                    onClick={onClose}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                    {item.label === 'tasks' && pendingTasksCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {pendingTasksCount}
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
            <div className="flex flex-col space-y-4">
              <a
                href="https://news.ycombinator.com/login?goto=news"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-green-400"
              >
                <LogIn className="w-4 h-4 mr-1.5" />
                Login
              </a>
              <a
                href="https://news.ycombinator.com/submit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-green-400"
              >
                <Send className="w-4 h-4 mr-1.5" />
                Submit
              </a>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
                <button 
                  onClick={toggleTheme}
                  className="p-1.5 rounded-full bg-gray-100 dark:bg-zinc-800"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? (
                    <Sun className="w-5 h-5 text-gray-700" />
                  ) : theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-green-400" />
                  ) : (
                    <Laptop className="w-5 h-5 text-gray-700 dark:text-green-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

