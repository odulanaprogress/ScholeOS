import React from 'react'
import { cn } from '@/utils/cn'

export interface TabItem {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
  badgeVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'neutral' | 'gold'
  disabled?: boolean
}

export interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: 'underline' | 'pills'
  accentColor?: string
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  accentColor = '#4338CA',
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full overflow-x-auto no-scrollbar',
        variant === 'underline' && 'border-b border-cream-border/80',
        className
      )}
      role="tablist"
    >
      <div className="flex items-center gap-1 sm:gap-2 min-w-max pb-px">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon

          if (variant === 'pills') {
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                disabled={tab.disabled}
                onClick={() => onChange(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed select-none',
                  isActive
                    ? 'text-white shadow-xs font-semibold'
                    : 'text-charcoal-muted hover:text-charcoal-dark hover:bg-cream-base/60'
                )}
                style={isActive ? { backgroundColor: accentColor } : undefined}
              >
                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                      isActive ? 'bg-white/20 text-white' : 'bg-cream-base text-charcoal-muted'
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          }

          // Default underline variant
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed select-none border-b-2',
                isActive
                  ? 'text-charcoal-dark font-bold'
                  : 'text-charcoal-muted/70 hover:text-charcoal-dark border-transparent hover:border-cream-border'
              )}
              style={
                isActive
                  ? {
                      borderColor: accentColor,
                      color: accentColor,
                    }
                  : undefined
              }
            >
              {Icon && <Icon className="w-4 h-4 shrink-0" />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-bold tracking-wide uppercase',
                    isActive
                      ? 'bg-indigo-light text-indigo-brand'
                      : 'bg-cream-base text-charcoal-muted/70'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
