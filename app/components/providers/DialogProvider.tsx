'use client'

import { useEffect, useState } from 'react'

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div id="dialog-root" className="relative z-50">
      {children}
    </div>
  )
}

