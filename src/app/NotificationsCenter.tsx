import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Bell,
  Check,
  X,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  Filter,
  Search,
  Trash2,
  CheckCheck
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

// Mock Data
// Mock Data removed - using API

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl', className)}>
      {children}
    </div>
  )
}

import { api } from '../lib/api'

export default function NotificationsCenter() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<any[]>([])
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      const { response, data } = await api.getNotifications()
      if (response.ok) {
        setNotifications(data.results || data || [])
      }
    } catch (error) {
      console.error('Failed to load notifications', error)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchNotifications()
  }, [])

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === 'ALL' || (filter === 'UNREAD' && !n.read) || (filter === 'READ' && n.read)
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         n.message.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Helper to format date relative
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000) // mins
    if (diff < 1) return 'Just now'
    if (diff < 60) return `${diff} mins ago`
    if (diff < 1440) return `${Math.floor(diff/60)} hours ago`
    return `${Math.floor(diff/1440)} days ago`
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = async (id: number) => {
    try {
      await api.markNotificationRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (error) {
      console.error('Failed to mark as read', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Failed to mark all read', error)
    }
  }

  const deleteNotification = async (id: number) => {
    try {
      await api.deleteNotification(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (error) {
      console.error('Failed to delete notification', error)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} className="text-emerald-400" />
      case 'error': return <AlertCircle size={20} className="text-red-400" />
      case 'alert': return <AlertTriangle size={20} className="text-yellow-400" />
      default: return <Info size={20} className="text-blue-400" />
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-emerald-500/20'
      case 'error': return 'bg-red-500/20'
      case 'alert': return 'bg-yellow-500/20'
      default: return 'bg-blue-500/20'
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white">
      <div className="relative z-10">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/40 border-b border-white/10">
          <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Notifications</h1>
                <p className="text-sm text-white/40">{unreadCount} unread notifications</p>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center gap-2 transition-colors"
              >
                <CheckCheck size={18} />
                Mark All Read
              </button>
            )}
          </div>
        </div>

        <div className="max-w-[1000px] mx-auto px-6 py-8">
          {/* Search and Filters */}
          <GlassCard className="p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
              
              <div className="flex gap-2">
                {['ALL', 'UNREAD', 'READ'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                      filter === f
                        ? "bg-accent text-black"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <GlassCard
                key={notification.id}
                className={cn(
                  "p-6 transition-all",
                  !notification.read && "bg-white/10 border-accent/30"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", getBgColor(notification.type))}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold mb-1">{notification.title}</h3>
                        <p className="text-white/60 text-sm">{notification.message}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-2" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <span className="text-xs text-white/40">{formatTime(notification.created_at)}</span>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-accent hover:text-accent/80 transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <GlassCard className="p-12 text-center">
              <Bell size={48} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/60">No notifications found</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}

