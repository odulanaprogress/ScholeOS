import React from 'react'
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  FileSpreadsheet,
  CreditCard,
  CalendarCheck,
  Megaphone,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkle,
} from 'lucide-react'
import { cn } from '@/utils/cn'

export interface SidebarNavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

export const defaultNavItems: SidebarNavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'students', label: 'Students', icon: GraduationCap },
  { id: 'staff', label: 'Staff', icon: Users },
  { id: 'classes', label: 'Classes & Subjects', icon: BookOpen },
  { id: 'results', label: 'Results & Broadsheets', icon: FileSpreadsheet },
  { id: 'fees', label: 'Fees', icon: CreditCard },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'ai', label: 'AI Assistant', icon: Sparkles, badge: 'New' },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export interface SidebarProps {
  activeItem: string
  onNavigate: (id: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  isMobileOpen?: boolean
  onCloseMobile?: () => void
  schoolName?: string
  schoolLogo?: string | null
  accentColor?: string
  trialDaysLeft?: number
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  onNavigate,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
  schoolName = 'Crown Academy Lagos',
  schoolLogo,
  accentColor = '#4338CA',
  trialDaysLeft = 12,
  className,
}) => {
  const sidebarContent = (
    <div className="flex flex-col h-full bg-cream-surface border-r border-cream-border select-none">
      {/* Brand / School Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-cream-border shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          {schoolLogo ? (
            <img
              src={schoolLogo}
              alt={schoolName}
              className="w-10 h-10 rounded-xl object-cover shrink-0 border border-cream-border shadow-xs"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-display font-bold text-lg shadow-sm shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              {schoolName.charAt(0)}
            </div>
          )}

          {!isCollapsed && (
            <div className="min-w-0 transition-opacity duration-200">
              <h2 className="text-sm font-display font-bold text-charcoal-dark truncate">
                {schoolName}
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] text-charcoal-muted/70 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span>ScholeOS Admin</span>
              </div>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        {isMobileOpen && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-charcoal-muted hover:text-charcoal-dark hover:bg-cream-base"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Desktop collapse toggle */}
        {onToggleCollapse && !isMobileOpen && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg text-charcoal-muted/60 hover:text-charcoal-dark hover:bg-cream-base transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {defaultNavItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onNavigate(item.id)
                if (isMobileOpen && onCloseMobile) {
                  onCloseMobile()
                }
              }}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 relative group',
                isActive
                  ? 'text-white shadow-sm font-semibold'
                  : 'text-charcoal-muted hover:text-charcoal-dark hover:bg-cream-base/60'
              )}
              style={
                isActive
                  ? { backgroundColor: accentColor }
                  : undefined
              }
            >
              <Icon
                className={cn(
                  'w-5 h-5 shrink-0 transition-transform group-hover:scale-110',
                  isActive ? 'text-white' : 'text-charcoal-muted/70 group-hover:text-charcoal-dark'
                )}
              />

              {!isCollapsed && (
                <span className="truncate flex-1 text-left">
                  {item.label}
                </span>
              )}

              {!isCollapsed && item.badge && (
                <span
                  className={cn(
                    'text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-light text-indigo-brand'
                  )}
                >
                  {item.badge}
                </span>
              )}

              {/* Floating tooltip for collapsed mode */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-charcoal-dark text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
                  {item.label}
                </div>
              )}
            </button>
          )
        })}
      </nav>

      {/* Trial License Status & Support */}
      <div className="p-3 border-t border-cream-border shrink-0 bg-cream-base/20">
        {!isCollapsed ? (
          <div className="bg-white rounded-xl p-3 border border-cream-border shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                <Sparkle className="w-3 h-3 text-amber-600 fill-amber-500" />
                Trial: {trialDaysLeft} days left
              </span>
              <span className="text-[10px] text-charcoal-muted/70 font-semibold">Pro Plan</span>
            </div>
            <p className="text-[11px] text-charcoal-muted leading-tight">
              Unlock full features & unlimited SMS parent notifications.
            </p>
            <button
              type="button"
              className="w-full text-center py-1 text-[11px] font-semibold text-indigo-brand hover:text-indigo-hover transition-colors"
            >
              Upgrade School Plan →
            </button>
          </div>
        ) : (
          <div
            className="w-full flex justify-center py-2"
            title={`Trial: ${trialDaysLeft} days left`}
          >
            <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center text-xs font-bold shadow-xs">
              {trialDaysLeft}d
            </span>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-64',
          className
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sliding Sheet */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fadeIn">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-charcoal-dark/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs h-full bg-cream-surface shadow-2xl z-10 animate-slideRight">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
