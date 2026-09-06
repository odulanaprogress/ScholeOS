import React, { useState } from 'react'
import { Sidebar, type SidebarNavItem } from '../ui/Sidebar'
import { TopBar } from '../ui/TopBar'
import { cn } from '@/utils/cn'
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  CreditCard,
  Menu,
} from 'lucide-react'

export interface DashboardLayoutProps {
  children: React.ReactNode
  activeNavId: string
  onNavigate: (navId: string) => void
  navItems?: SidebarNavItem[]
  showTrialPill?: boolean
  roleBadge?: string
  userName?: string
  userRole?: string
  pageTitle?: string
  pageSubtitle?: string
  headerAction?: React.ReactNode
  schoolName?: string
  schoolLogo?: string | null
  accentColor?: string
  onLogout?: () => void
  onOpenSettings?: () => void
  onOpenProfile?: () => void
  mobileNavTabs?: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[]
  className?: string
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeNavId,
  onNavigate,
  navItems,
  showTrialPill = true,
  roleBadge = 'ScholeOS Admin',
  userName,
  userRole,
  pageTitle,
  pageSubtitle,
  headerAction,
  schoolName = 'Crown Academy Lagos',
  schoolLogo,
  accentColor = '#4338CA',
  onLogout,
  onOpenSettings,
  onOpenProfile,
  mobileNavTabs: customMobileNavTabs,
  className,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Quick mobile bottom nav items
  const mobileNavTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'results', label: 'Results', icon: FileSpreadsheet },
    { id: 'fees', label: 'Fees', icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-cream-base flex flex-col font-body text-charcoal-dark antialiased">
      {/* 1. Persistent Sidebar */}
      <Sidebar
        activeItem={activeNavId}
        onNavigate={onNavigate}
        navItems={navItems}
        showTrialPill={showTrialPill}
        roleBadge={roleBadge}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        schoolName={schoolName}
        schoolLogo={schoolLogo}
        accentColor={accentColor}
      />

      {/* 2. Persistent TopBar */}
      <TopBar
        isSidebarCollapsed={isSidebarCollapsed}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        adminName={userName}
        adminRole={userRole}
        onLogout={onLogout}
        onOpenSettings={onOpenSettings || (() => onNavigate('settings'))}
        onOpenProfile={onOpenProfile}
      />

      {/* 3. Main Content Container */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 pt-16 pb-20 md:pb-8',
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        )}
      >
        <main className={cn('flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto', className)}>
          {/* Page Header Area */}
          {(pageTitle || headerAction) && (
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                {pageTitle && (
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-charcoal-dark tracking-tight">
                    {pageTitle}
                  </h1>
                )}
                {pageSubtitle && (
                  <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
                    {pageSubtitle}
                  </p>
                )}
              </div>

              {headerAction && (
                <div className="shrink-0 flex items-center gap-2">
                  {headerAction}
                </div>
              )}
            </div>
          )}

          {/* Page Body Content */}
          {children}
        </main>
      </div>

      {/* 4. Mobile Quick Bottom Navigation Bar (< md screens) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-cream-surface/95 backdrop-blur-md border-t border-cream-border px-3 py-1.5 flex items-center justify-around shadow-lg">
        {(customMobileNavTabs || mobileNavTabs).map((tab) => {
          const Icon = tab.icon
          const isActive = activeNavId === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[11px] font-medium transition-colors',
                isActive
                  ? 'text-indigo-brand font-bold'
                  : 'text-charcoal-muted hover:text-charcoal-dark'
              )}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}

        {/* More button triggering full drawer */}
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[11px] font-medium text-charcoal-muted hover:text-charcoal-dark"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </nav>
    </div>
  )
}
