type Theme = 'light' | 'dark' | 'system'

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export function getThemePreference(): Theme {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('theme') as Theme | null
    return storedTheme || 'system'
  }
  return 'system'
}

export function setThemePreference(theme: Theme) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', theme)
  }
}

export function applyTheme(theme: Theme) {
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')

  if (theme === 'system') {
    const systemTheme = getSystemTheme()
    root.classList.add(systemTheme)
  } else {
    root.classList.add(theme)
  }
}

export function initializeTheme() {
  const theme = getThemePreference()
  applyTheme(theme)
}

