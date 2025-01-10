import React from 'react'
import { Toast, ToastProps } from './toast'
import { useTaskContext } from '../../contexts/TaskContext'
import { BellOff } from 'lucide-react'

export const ToastWrapper: React.FC<ToastProps> = ({ children, ...props }) => {
  const { setNotificationsEnabled, notificationsEnabled } = useTaskContext()

  const handleTurnOffNotifications = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent the toast from being dismissed
    setNotificationsEnabled(false)
  }

  if (!notificationsEnabled) {
    return null // Don't render the toast if notifications are disabled
  }

  return (
    <Toast {...props}>
      {children}
      <button
        onClick={handleTurnOffNotifications}
        className="absolute top-2 right-8 opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Turn off notifications"
      >
        <BellOff className="h-4 w-4" />
      </button>
    </Toast>
  )
}

