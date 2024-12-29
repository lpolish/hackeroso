'use client'

import { useEffect } from 'react'
import { initializeTheme } from '../utils/theme'

export default function ThemeInitializer() {
  useEffect(() => {
    initializeTheme()
  }, [])

  return null
}

