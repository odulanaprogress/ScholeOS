import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Exact design requirement: fully pill-shaped (rounded-full)
    const baseStyles =
      'inline-flex items-center justify-center font-medium font-sans rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-brand active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none disabled:cursor-not-allowed select-none'

    const sizeStyles = {
      sm: 'text-xs px-4 py-2 gap-1.5 min-h-[36px]',
      md: 'text-sm px-6 py-2.5 gap-2 min-h-[44px]',
      lg: 'text-base px-8 py-3.5 gap-2.5 min-h-[52px] font-semibold',
    }

    const iconSizeStyles = {
      sm: 'p-2 min-h-[36px] min-w-[36px]',
      md: 'p-2.5 min-h-[44px] min-w-[44px]',
      lg: 'p-3.5 min-h-[52px] min-w-[52px]',
    }

    const variantStyles = {
      primary:
        'bg-indigo-brand text-white shadow-md shadow-indigo-900/10 hover:bg-indigo-hover hover:shadow-lg hover:shadow-indigo-900/15 border border-transparent',
      secondary:
        'bg-white text-indigo-brand border-2 border-indigo-brand hover:bg-indigo-light/60 hover:text-indigo-hover shadow-sm',
      ghost:
        'bg-transparent text-charcoal-dark hover:bg-cream-hover hover:text-indigo-brand',
      icon:
        'bg-white text-charcoal-dark border border-gray-200 hover:border-indigo-brand hover:text-indigo-brand shadow-sm hover:shadow-md',
    }

    const isIconButton = variant === 'icon' || (!children && (Boolean(leftIcon) || Boolean(rightIcon)))

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          isIconButton ? iconSizeStyles[size] : sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
            {!isIconButton && <span>Loading...</span>}
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0 inline-flex items-center">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0 inline-flex items-center">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
