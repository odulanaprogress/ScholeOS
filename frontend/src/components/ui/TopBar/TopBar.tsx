import React, { useState, useRef, useEffect } from 'react'
import {
  Search,
  Bell,
  Menu,
  User,
  Settings,
  LogOut,
  ChevronDown,
  CheckCheck,
  Clock,
} from 'lucide-react'
import { cn } from '@/utils/cn'

export interface TopBarProps {
  isSidebarCollapsed?: boolean
  onOpenMobileSidebar?: () => void
  adminName?: string
  adminRole?: string
  adminAvatarUrl?: string
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  onLogout?: () => void
  onOpenSettings?: () => void
  onOpenProfile?: () => void
  className?: string
}

export const TopBar: React.FC<TopBarProps> = ({
  isSidebarCollapsed = false,
  onOpenMobileSidebar,
  adminName = 'Alhaji Dr. S. Bello',
  adminRole = 'Principal / Administrator',
  adminAvatarUrl,
  searchPlaceholder = 'Search students, staff, classes...',
  onSearch,
  onLogout,
  onOpenSettings,
  onOpenProfile,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)

  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchQuery(val)
    if (onSearch) onSearch(val)
  }

  const notifications = [
    {
      id: 1,
      title: 'Scores Submitted',
      description: 'Mrs. Adeyemi submitted Mathematics scores for JSS 2A.',
      time: '15m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Fee Payment Confirmed',
      description: '₦240,000 received via Paystack for Chinedu Obi (SSS 2).',
      time: '1h ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Broadsheet Ready',
      description: 'Term 2 Mid-term broadsheet compiled for JSS 1.',
      time: '3h ago',
      unread: true,
    },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-20 h-16 bg-cream-surface/90 backdrop-blur-md border-b border-cream-border px-4 sm:px-6 transition-all duration-300 flex items-center justify-between gap-4',
        // Desktop left spacing based on sidebar state
        isSidebarCollapsed ? 'md:left-20' : 'md:left-64',
        'left-0',
        className
      )}
    >
      {/* Left section: Mobile hamburger + Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-xl text-charcoal-muted hover:text-charcoal-dark hover:bg-cream-base transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted/60 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-cream-base/50 focus:bg-white text-charcoal-dark placeholder:text-charcoal-muted/50 rounded-full border border-cream-border focus:border-indigo-brand focus:outline-none focus:ring-2 focus:ring-indigo-brand/20 transition-all"
          />
        </div>
      </div>

      {/* Right section: Notifications + User Avatar */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Quick status pill on larger screens */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs text-emerald-800 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>2025/2026 • 2nd Term Active</span>
        </div>

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-full text-charcoal-muted hover:text-charcoal-dark hover:bg-cream-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-brand/30"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full ring-1 ring-rose-500/20" />
            )}
          </button>

          {/* Notifications Popover */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-cream-border p-4 z-50 animate-fadeIn space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-cream-border">
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-bold text-sm text-charcoal-dark">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <span className="bg-indigo-light text-indigo-brand text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setUnreadCount(0)}
                    className="text-[11px] font-medium text-indigo-brand hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-cream-border/50 max-h-72 overflow-y-auto space-y-1">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'py-2.5 px-2 rounded-xl transition-colors',
                      item.unread && unreadCount > 0 ? 'bg-cream-base/40' : 'hover:bg-cream-base/20'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-charcoal-dark">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-charcoal-muted/70 flex items-center gap-1 shrink-0">
                        <Clock className="w-2.5 h-2.5" />
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-muted mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-cream-border text-center">
                <button
                  type="button"
                  className="text-xs font-semibold text-indigo-brand hover:text-indigo-hover"
                >
                  View all announcements & alerts →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-2 py-1 rounded-full hover:bg-cream-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-brand/30"
            aria-label="User menu"
          >
            {adminAvatarUrl ? (
              <img
                src={adminAvatarUrl}
                alt={adminName}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-cream-border"
              />
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-indigo-brand to-indigo-hover text-white flex items-center justify-center font-display font-bold text-xs sm:text-sm shadow-xs">
                {adminName
                  .split(' ')
                  .map((n) => n[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('')}
              </div>
            )}

            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-charcoal-dark leading-tight truncate max-w-[120px]">
                {adminName}
              </p>
              <p className="text-[11px] text-charcoal-muted/70 truncate max-w-[120px]">
                {adminRole}
              </p>
            </div>

            <ChevronDown className="w-4 h-4 text-charcoal-muted/60 hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-cream-border p-2 z-50 animate-fadeIn space-y-1">
              <div className="px-3 py-2 border-b border-cream-border/70 mb-1">
                <p className="text-xs font-bold text-charcoal-dark truncate">{adminName}</p>
                <p className="text-[11px] text-charcoal-muted/70 truncate">admin@crownacademy.ng</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false)
                  if (onOpenProfile) onOpenProfile()
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-charcoal-dark hover:bg-cream-base transition-colors"
              >
                <User className="w-4 h-4 text-charcoal-muted" />
                <span>Admin Profile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false)
                  if (onOpenSettings) onOpenSettings()
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-charcoal-dark hover:bg-cream-base transition-colors"
              >
                <Settings className="w-4 h-4 text-charcoal-muted" />
                <span>School Settings</span>
              </button>

              <div className="pt-1 border-t border-cream-border/70">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false)
                    if (onLogout) onLogout()
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
