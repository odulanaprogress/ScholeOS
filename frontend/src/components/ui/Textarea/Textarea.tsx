import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helperText?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, disabled, rows = 4, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left font-body">
        {label && (
          <label className="block text-xs font-semibold text-charcoal-dark tracking-wide uppercase font-display">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          rows={rows}
          disabled={disabled}
          className={cn(
            'w-full bg-cream-surface text-charcoal-dark text-xs sm:text-sm rounded-xl py-2.5 px-3.5 border transition-all duration-200 shadow-2xs font-body focus:outline-none focus:ring-2 resize-y',
            'border-cream-border focus:border-indigo-brand focus:ring-indigo-brand/20',
            disabled && 'bg-cream-base/60 text-charcoal-muted/60 cursor-not-allowed border-cream-border/50',
            error && 'border-rose-500 text-rose-900 focus:border-rose-500 focus:ring-rose-500/20',
            className
          )}
          {...props}
        />

        {error ? (
          <p className="text-xs text-rose-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-charcoal-muted/70">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
