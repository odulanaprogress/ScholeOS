import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'primary' | 'gold'
  size?: 'sm' | 'md'
  showDot?: boolean
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'neutral',
      size = 'md',
      showDot = true,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      success: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      warning: 'bg-amber-50 text-amber-900 border-amber-200/80',
      danger: 'bg-rose-50 text-rose-800 border-rose-200/80',
      neutral: 'bg-slate-100 text-slate-700 border-slate-200',
      primary: 'bg-indigo-50 text-indigo-brand border-indigo-200',
      gold: 'bg-amber-50/70 text-amber-800 border-amber-300',
    }

    const dotStyles = {
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      danger: 'bg-rose-500',
      neutral: 'bg-slate-400',
      primary: 'bg-indigo-brand',
      gold: 'bg-gold-brand',
    }

    const sizeStyles = {
      sm: 'text-xs px-2.5 py-0.5 gap-1.5 font-medium',
      md: 'text-xs px-3 py-1 gap-2 font-semibold',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border transition-colors select-none font-sans',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {showDot && (
          <span
            className={cn('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse', dotStyles[variant])}
            aria-hidden="true"
          />
        )}
        <span>{children}</span>
      </span>
    )
  }
)

Badge.displayName = 'Badge'
