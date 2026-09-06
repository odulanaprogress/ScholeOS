import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface IconBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
}

export const IconBadge = forwardRef<HTMLDivElement, IconBadgeProps>(
  ({ className, size = 'md', icon, children, ...props }, ref) => {
    const sizeMap = {
      sm: 'w-9 h-9 rounded-lg text-sm [&>svg]:w-4 [&>svg]:h-4',
      md: 'w-11 h-11 rounded-xl text-base [&>svg]:w-5 [&>svg]:h-5',
      lg: 'w-14 h-14 rounded-2xl text-xl [&>svg]:w-7 [&>svg]:h-7',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'bg-gold-brand text-white flex items-center justify-center shadow-sm shrink-0 transition-transform duration-200 hover:scale-105 select-none',
          sizeMap[size],
          className
        )}
        {...props}
      >
        {icon || children}
      </div>
    )
  }
)

IconBadge.displayName = 'IconBadge'
