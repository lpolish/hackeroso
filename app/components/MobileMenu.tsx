'use client'

import Link from 'next/link'
import { X, Search, Moon, Sun, Laptop, LogIn, Send, Heart, Bell, BellOff, HelpCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge } from "./ui/badge"
import { Switch } from "./ui/switch"
import Footer from './Footer'

type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
  navItems: Array<{ href: string; label: string; icon: React.ElementType } | { group: string; items: Array<{ href: string; label: string; icon: React.ElementType }> }>
  isActive: (path: string) => boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  handleSearch: (e: React.FormEvent) => void
  theme: 'light' | 'dark' | 'system'
  toggleTheme: () => void
  pendingTasksCount: number
  notificationsEnabled: boolean
  setNotificationsEnabled: (enabled: boolean) => void
  onSupportClick: () => void;
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
  pendingTasksCount,
  notificationsEnabled,
  setNotificationsEnabled,
  onSupportClick
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
        className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300 md:hidden
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-0 w-full bg-zinc-900 z-[9999] 
                   transform transition-transform duration-300 ease-in-out md:hidden
                   overflow-y-auto
                   ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col min-h-full">
          <div className="flex items-center justify-between p-3 border-b border-zinc-800">
            <div className="group relative">
              <Link href="/" className="text-lg font-bold tracking-tighter bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent" onClick={onClose}>
                hackeroso
              </Link>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400"
              aria-label="close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-3 border-b border-zinc-800">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-zinc-800 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
            </form>
          </div>

          <nav className="px-2 py-4">
            <div className="space-y-1">
              <div className="mb-2">
                <div className="px-3 mb-1">
                  <span className="text-xs font-medium text-zinc-500">News</span>
                </div>
                {navItems.filter(item => 'group' in item && item.group === 'News').map(group => (
                  'items' in group && group.items.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                        isActive(item.href)
                          ? 'text-green-400 bg-zinc-800'
                          : 'text-zinc-400 hover:bg-zinc-800'
                      }`}
                      onClick={onClose}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Link>
                  ))
                ))}
              </div>

              <div className="mb-2">
                <div className="px-3 mb-1">
                  <span className="text-xs font-medium text-zinc-500">Trends</span>
                </div>
                {navItems.filter(item => 'group' in item && item.group === 'Trends').map(group => (
                  'items' in group && group.items.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                        isActive(item.href)
                          ? 'text-green-400 bg-zinc-800'
                          : 'text-zinc-400 hover:bg-zinc-800'
                      }`}
                      onClick={onClose}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Link>
                  ))
                ))}
              </div>

              <div className="mb-2">
                <div className="px-3 mb-1">
                  <span className="text-xs font-medium text-zinc-500">Personal</span>
                </div>
                {navItems.filter(item => !('group' in item) && ['tasks', 'profile'].includes(item.label)).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                      isActive(item.href)
                        ? 'text-green-400 bg-zinc-800'
                        : 'text-zinc-400 hover:bg-zinc-800'
                    }`}
                    onClick={onClose}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.label === 'profile' ? 'Dashboard' : item.label}
                    {item.label === 'tasks' && pendingTasksCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {pendingTasksCount}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>

              {navItems.filter(item => !('group' in item) && !['tasks', 'profile'].includes(item.label)).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                    isActive(item.href)
                      ? 'text-green-400 bg-zinc-800'
                      : 'text-zinc-400 hover:bg-zinc-800'
                  }`}
                  onClick={onClose}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="px-2 py-4 border-t border-zinc-800">
            <div className="space-y-1">
              <div className="px-3 mb-1">
                <span className="text-xs font-medium text-zinc-500">Settings</span>
              </div>
              <button 
                onClick={() => {
                  onClose();
                  onSupportClick();
                }} 
                className="flex items-center px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800 rounded-md w-full"
              >
                <Heart className="w-4 h-4 mr-3 text-green-500" />
                Support this project
              </button>
              <div className="flex items-center justify-between px-3 py-1.5 text-sm text-zinc-400">
                <div className="flex items-center">
                  {theme === 'light' ? (
                    <Sun className="w-4 h-4 mr-3" />
                  ) : theme === 'dark' ? (
                    <Moon className="w-4 h-4 mr-3" />
                  ) : (
                    <Laptop className="w-4 h-4 mr-3" />
                  )}
                  Theme
                </div>
                <button onClick={toggleTheme} className="p-1.5 rounded-full hover:bg-zinc-800">
                  {theme === 'light' ? (
                    <Sun className="w-4 h-4" />
                  ) : theme === 'dark' ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Laptop className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between px-3 py-1.5 text-sm text-zinc-400">
                <div className="flex items-center">
                  {notificationsEnabled ? (
                    <Bell className="w-4 h-4 mr-3" />
                  ) : (
                    <BellOff className="w-4 h-4 mr-3" />
                  )}
                  Notifications
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              <a
                href="https://news.ycombinator.com/login?goto=news"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800 rounded-md"
              >
                <LogIn className="w-4 h-4 mr-3" />
                Login
              </a>
              <a
                href="https://news.ycombinator.com/submit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800 rounded-md"
              >
                <Send className="w-4 h-4 mr-3" />
                Submit
              </a>
            </div>
          </div>

          <div className="mt-auto border-t border-zinc-800">
            <Footer className="py-4 px-3 text-xs" isMobileMenu={true} />
          </div>
        </div>
      </div>
    </>
  )
}

