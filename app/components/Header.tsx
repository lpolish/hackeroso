'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Zap, Sparkles, HelpCircle, Tv, Briefcase, Menu, Moon, Sun, Laptop, LogIn, Send, CheckSquare } from 'lucide-react'
import { useTaskContext } from '../contexts/TaskContext'
import { Button } from "./ui/button"
import MobileMenu from './MobileMenu'
import { getThemePreference, setThemePreference, applyTheme, initializeTheme } from '../utils/theme'
import { Badge } from "./ui/badge"

export default function Header() {
  const { logoSettings, pendingTasksCount } = useTaskContext()
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    initializeTheme()
    const storedTheme = getThemePreference()
    setTheme(storedTheme)
    
    // Initialize search query from URL
    const urlParams = new URLSearchParams(window.location.search)
    const queryParam = urlParams.get('q')
    if (queryParam) {
      setSearchQuery(queryParam)
    }

    // Add scroll event listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    setTheme(newTheme)
    setThemePreference(newTheme)
    applyTheme(newTheme)
  }

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: '/', label: 'top', icon: Zap },
    { href: '/new', label: 'new', icon: Sparkles },
    { href: '/ask', label: 'ask', icon: HelpCircle },
    { href: '/show', label: 'show', icon: Tv },
    { href: '/jobs', label: 'jobs', icon: Briefcase },
    { href: '/tasks', label: 'tasks', icon: CheckSquare },
  ]

  return (
    <header className={`bg-background border-b border-border shadow-md fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'md:h-12' : 'md:h-16'}`}>
      <div className={`container mx-auto px-4 h-full flex items-center transition-all duration-300 ${isScrolled ? 'md:py-1' : 'md:py-3'}`}>
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="group relative">
            <Link href="/" className={`text-xl font-bold tracking-tighter shrink-0 transition-all duration-300 bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent ${isScrolled ? 'md:text-lg' : ''}`}>
              hackeroso
            </Link>
            <div className="absolute -bottom-3 left-0 w-full overflow-hidden h-4 pointer-events-none">
              <span className="text-[0.42rem] font-medium text-orange-500 transform translate-y-4 transition-transform duration-200 block text-center group-hover:translate-y-0 group-active:translate-y-0">
                HACKER NEWS TASKOSO
              </span>
            </div>
          </div>

          <nav className={`hidden md:flex items-center space-x-6 flex-1 justify-center transition-all duration-300 ${isScrolled ? 'text-sm' : ''}`}>
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={`${
                  isActive(item.href) 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                } hover:text-primary flex items-center font-medium whitespace-nowrap`}
              >
                <item.icon className={`mr-1.5 transition-all duration-300 ${isScrolled ? 'w-3 h-3' : 'w-4 h-4'}`} />
                {item.label}
                {item.label === 'tasks' && pendingTasksCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {pendingTasksCount}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <input
                type="text"
                placeholder="search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-[200px] pl-8 pr-3 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-green-500 transition-all duration-300 ${isScrolled ? 'py-1 text-sm' : 'py-1.5'}`}
              />
              <Search className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-all duration-300 ${isScrolled ? 'w-3 h-3' : 'w-4 h-4'}`} />
            </form>

            <a
              href="https://news.ycombinator.com/login?goto=news"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden md:flex items-center font-medium text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-green-400 transition-all duration-300 ${isScrolled ? 'text-sm' : ''}`}
            >
              <LogIn className={`mr-1.5 transition-all duration-300 ${isScrolled ? 'w-3 h-3' : 'w-4 h-4'}`} />
              Login
            </a>

            <a
              href="https://news.ycombinator.com/submit"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden md:flex items-center font-medium text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-green-400 transition-all duration-300 ${isScrolled ? 'text-sm' : ''}`}
            >
              <Send className={`mr-1.5 transition-all duration-300 ${isScrolled ? 'w-3 h-3' : 'w-4 h-4'}`} />
              Submit
            </a>

            <button 
              onClick={toggleTheme}
              className={`hidden md:block rounded-full bg-muted transition-all duration-300 ${isScrolled ? 'p-1' : 'p-1.5'}`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Sun className={`text-gray-700 transition-all duration-300 ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
              ) : theme === 'dark' ? (
                <Moon className={`text-green-400 transition-all duration-300 ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
              ) : (
                <Laptop className={`text-gray-700 dark:text-green-400 transition-all duration-300 ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
              )}
            </button>

            <button
              className="md:hidden p-2 relative"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="open menu"
            >
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-400" />
              {pendingTasksCount > 0 && (
                <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs">
                  {pendingTasksCount}
                </Badge>
              )}
            </button>
          </div>
        </div>
      </div>

      {typeof window !== 'undefined' && window.innerWidth < 768 && (
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          navItems={navItems}
          isActive={isActive}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          theme={theme}
          toggleTheme={toggleTheme}
          pendingTasksCount={pendingTasksCount}
        />
      )}
    </header>
  )
}
