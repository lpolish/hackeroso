'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Zap, Sparkles, HelpCircle, Tv, Briefcase, Menu, Moon, Sun, Laptop, LogIn, Send, CheckSquare, Bookmark, Github, MoreHorizontal, ChevronDown, Bell, BellOff, Copy, User, Heart } from 'lucide-react'
import { useTaskContext } from '../contexts/TaskContext'
import { Button } from "./ui/button"
import MobileMenu from './MobileMenu'
import { getThemePreference, setThemePreference, applyTheme, initializeTheme } from '../utils/theme'
import { Badge } from "./ui/badge"
import SearchModal from './SearchModal'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { DonationDialog } from "./DonationDialog"

export default function Header() {
  const { logoSettings, pendingTasksCount, notificationsEnabled, setNotificationsEnabled, userName } = useTaskContext()
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Added state for dropdown
  const pathname = usePathname()
  const router = useRouter()
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const [showDonationDialog, setShowDonationDialog] = useState(false)

  const toggleNotifications = useCallback(() => {
    setNotificationsEnabled(prev => !prev)
  }, [setNotificationsEnabled])

  useEffect(() => {
    initializeTheme()
    const storedTheme = getThemePreference()
    setTheme(storedTheme)
    
    const urlParams = new URLSearchParams(window.location.search)
    const queryParam = urlParams.get('q')
    if (queryParam) {
      setSearchQuery(queryParam)
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchModalOpen(false)
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
    {
      group: 'News',
      items: [
        { href: '/', label: 'top', icon: Zap },
        { href: '/new', label: 'new', icon: Sparkles },
        { href: '/ask', label: 'ask', icon: HelpCircle },
      ]
    },
    {
      group: 'Trends',
      items: [
        { href: '/trending', label: 'github', icon: Github },
        { href: '/show', label: 'show', icon: Tv },
      ]
    },
    { href: '/jobs', label: 'jobs', icon: Briefcase },
    { href: '/tasks', label: 'tasks', icon: CheckSquare },
    { href: '/profile', label: 'profile', icon: User },
  ];

  const dropdownItems = [
    {
      href: '/profile',
      label: 'Profile',
      icon: User,
      description: 'View your profile and manage followers',
    },
  ]

  const renderSearchComponent = () => {
    if (windowWidth > 1060) {
      // Original search input for larger screens
      return (
        <form onSubmit={handleSearch} className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-10 pr-4 py-2 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-green-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
        </form>
      )
    } else if (windowWidth >= 768 && windowWidth <= 1060) {
      // Button for search modal on medium screens
      return (
        <button
          ref={searchButtonRef}
          onClick={() => setIsSearchModalOpen(true)}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Open search"
        >
          <Search className="w-4 h-4" />
        </button>
      )
    }
    // No search component for mobile (handled in MobileMenu)
    return null
  }

  return (
    <>
      <header className={`font-mono bg-background border-b border-border shadow-md fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'md:h-12' : 'md:h-16'}`}>
        <div className={`px-4 h-full flex items-center transition-all duration-300 ${isScrolled ? 'py-1.5 md:py-1' : 'py-3 md:py-3'}`}>
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="group relative">
              <Link href="/" className={`text-xl font-bold tracking-tighter shrink-0 transition-all duration-300 bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent ${isScrolled ? 'md:text-lg' : ''}`}>
                hackeroso
              </Link>
              <div className="absolute -bottom-3 left-0 w-full overflow-hidden h-4 pointer-events-none">
                <span className="text-[0.42rem] font-medium text-orange-500 transform translate-y-4 transition-transform duration-200 block text-center group-hover:translate-y-0 group-active:translate-y-0">
                  .... .- -.-. -.-
                </span>
              </div>
            </div>

            <nav className={`hidden md:flex items-center space-x-6 flex-1 justify-center transition-all duration-300 ${isScrolled ? 'text-sm' : ''}`}>
              {navItems.map((item, index) => (
                'group' in item ? (
                  <DropdownMenu key={index}>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center text-muted-foreground hover:text-primary font-medium">
                        {item.group}
                        <ChevronDown className={`ml-1 transition-all duration-300 ${isScrolled ? 'w-3 h-3' : 'w-4 h-4'}`} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {item.items.map((subItem) => (
                        <DropdownMenuItem key={subItem.href}>
                          <Link href={subItem.href} className="flex items-center w-full">
                            <subItem.icon className="mr-2 h-4 w-4" />
                            {subItem.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
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
                    {item.label === 'profile' ? 'Dashboard' : item.label}
                    {item.label === 'tasks' && pendingTasksCount > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {pendingTasksCount}
                      </Badge>
                    )}
                  </Link>
                )
              ))}
            </nav>

            <div className="flex items-center gap-4 shrink-0">
              {renderSearchComponent()}
              <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}> {/* Updated DropdownMenu */}
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/tasks" className="flex items-center">
                      <CheckSquare className="mr-2 h-4 w-4" />
                      <span>Tasks</span>
                      {pendingTasksCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {pendingTasksCount}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleTheme}>
                    {theme === 'light' ? (
                      <Sun className="mr-2 h-4 w-4" />
                    ) : theme === 'dark' ? (
                      <Moon className="mr-2 h-4 w-4" />
                    ) : (
                      <Laptop className="mr-2 h-4 w-4" />
                    )}
                    <span>Theme: {theme}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    toggleNotifications();
                  }}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        {notificationsEnabled ? (
                          <Bell className="mr-2 h-4 w-4" />
                        ) : (
                          <BellOff className="mr-2 h-4 w-4" />
                        )}
                        <span>Notifications</span>
                      </div>
                      <Switch
                        checked={notificationsEnabled}
                        onCheckedChange={toggleNotifications}
                      />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    setIsDropdownOpen(false); // Close dropdown after clicking
                    setShowDonationDialog(true);
                  }}>
                    <button className="flex items-center w-full">
                      <Heart className="mr-2 h-4 w-4 text-green-500" />
                      Support this project
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                className="md:hidden p-2 relative z-50 bg-background hover:bg-accent"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="open menu"
              >
                <Menu className="w-5 h-5 text-foreground" />
                {pendingTasksCount > 0 && (
                  <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs">
                    {pendingTasksCount}
                  </Badge>
                )}
              </button>
            </div>
          </div>
        </div>

        {windowWidth < 768 && (
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
            notificationsEnabled={notificationsEnabled}
            setNotificationsEnabled={setNotificationsEnabled}
            onSupportClick={() => {
              setMobileMenuOpen(false);
              setShowDonationDialog(true);
            }}
          />
        )}
      </header>

      {windowWidth >= 768 && windowWidth <= 1060 && (
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          searchButtonRef={searchButtonRef}
        />
      )}
      <DonationDialog 
        open={showDonationDialog} 
        onOpenChange={setShowDonationDialog}
      />
    </>
  )
}

