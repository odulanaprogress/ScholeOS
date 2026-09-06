import React from 'react'
import { Card } from '../Card'
import { IconBadge } from '../IconBadge'
import { cn } from '@/utils/cn'
import type { LucideIcon } from 'lucide-react'

export interface StatCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'primary' | 'gold'
  trend?: {
    value: string
    isPositive?: boolean
    label?: string
  }
  subtext?: string
  className?: string
  onClick?: () => void
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  tone = 'default',
  trend,
  subtext,
  className,
  onClick,
}) => {
  const toneClasses = {
    default: 'text-charcoal-dark',
    success: 'text-emerald-700',
    warning: 'text-amber-700',
    danger: 'text-rose-700',
    primary: 'text-indigo-brand',
    gold: 'text-amber-800',
  }

  const toneBgClasses = {
    default: '',
    success: 'bg-emerald-50/60 border-emerald-200',
    warning: 'bg-amber-50/60 border-amber-200',
    danger: 'bg-rose-50/60 border-rose-200',
    primary: 'bg-indigo-50/40 border-indigo-200',
    gold: 'bg-amber-50/50 border-amber-200',
  }

  return (
    <Card
      hoverable={Boolean(onClick)}
      className={cn(
        'relative overflow-hidden transition-all duration-200 p-5 sm:p-6',
        toneBgClasses[tone],
        onClick && 'cursor-pointer hover:-translate-y-0.5',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-medium text-charcoal-muted/70 tracking-wide uppercase">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <h3
              className={cn(
                'text-2xl sm:text-3xl font-display font-bold tracking-tight',
                toneClasses[tone]
              )}
            >
              {value}
            </h3>
          </div>
        </div>

        {Icon && (
          <IconBadge
            size="md"
            className="shrink-0 shadow-sm"
          >
            <Icon className="w-5 h-5 text-white" />
          </IconBadge>
        )}
      </div>

      {(trend || subtext) && (
        <div className="mt-3.5 pt-3 border-t border-cream-border/60 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full',
                trend.isPositive !== false
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              )}
            >
              {trend.value}
            </span>
          )}
          {(trend?.label || subtext) && (
            <span className="text-charcoal-muted/75 truncate">
              {trend?.label || subtext}
            </span>
          )}
        </div>
      )}
    </Card>
  )
}
