import { useState, useEffect } from 'react'

interface NotificationData {
  id: string
  title: string
  message: string
  type: 'alert' | 'warning' | 'info'
  timestamp: Date
  read: boolean
  location?: string
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission)
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(setPermission)
      }
    }

    // Mock notifications - in real app, these would come from a service
    const mockNotifications: NotificationData[] = [
      {
        id: '1',
        title: 'Severe Weather Alert',
        message: 'Heavy rainfall expected in your area within the next 2 hours',
        type: 'alert',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        location: 'San Francisco, CA'
      },
      {
        id: '2',
        title: 'Air Quality Warning',
        message: 'Air quality has improved to moderate levels',
        type: 'warning',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true,
        location: 'San Francisco, CA'
      },
      {
        id: '3',
        title: 'Emergency Drill Reminder',
        message: 'Community emergency drill scheduled for this weekend',
        type: 'info',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: false,
        location: 'San Francisco, CA'
      }
    ]

    setNotifications(mockNotifications)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const sendNotification = (title: string, message: string) => {
    if (permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico'
      })
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    sendNotification,
    permission
  }
}